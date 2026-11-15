import fs from 'fs';
import path from 'path';
import { initialSettings, initialServices, initialPackages, initialCategories, initialGallery, initialTestimonials } from './initialData';
import { WebsiteSettings, ServiceItem, PricingPackage, GalleryCategory, GalleryImage, Testimonial, BookingEnquiry } from '@/types/database';
import { supabase, supabaseAdmin, isSupabaseConfigured } from './supabase';

// Cloud Sync KV Engine (Inlined for complete standalone resilience on Vercel)
const KV_BUCKET = process.env.KV_BUCKET_ID || 'soumili_makeover_live_db_2026';
const KV_BASE_URL = `https://kvdb.io/${KV_BUCKET}`;

async function syncCloudData(key: string, data: any): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);
    const res = await fetch(`${KV_BASE_URL}/${key}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    return res.ok;
  } catch {
    return false;
  }
}

async function loadCloudData<T>(key: string): Promise<T | null> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);
    const res = await fetch(`${KV_BASE_URL}/${key}`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    if (!res.ok) return null;
    const text = await res.text();
    if (!text) return null;
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

// Global shared state across serverless invocations within the process
declare global {
  var __soumili_db: {
    settings?: WebsiteSettings;
    services?: ServiceItem[];
    packages?: PricingPackage[];
    categories?: GalleryCategory[];
    gallery?: GalleryImage[];
    testimonials?: Testimonial[];
    enquiries?: BookingEnquiry[];
  } | undefined;
}

if (!global.__soumili_db) {
  global.__soumili_db = {};
}

function getStorageDir(): string {
  try {
    if (process.env.VERCEL === '1' || process.env.NODE_ENV === 'production') {
      return path.join('/tmp', 'soumili_data');
    }
    return path.join(process.cwd(), 'data');
  } catch {
    return '/tmp';
  }
}

function readData<T>(key: keyof NonNullable<typeof global.__soumili_db>, defaultData: T): T {
  // 1. Check in-memory global state first
  if (global.__soumili_db && global.__soumili_db[key] !== undefined) {
    return global.__soumili_db[key] as T;
  }

  // 2. Try disk storage
  try {
    const dir = getStorageDir();
    const filePath = path.join(dir, `${String(key)}.json`);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      const parsed = JSON.parse(content) as T;
      if (global.__soumili_db) global.__soumili_db[key] = parsed as any;
      return parsed;
    }
  } catch (err) {
    // Disk read fallback
  }

  // 3. Fallback to default
  if (global.__soumili_db) global.__soumili_db[key] = defaultData as any;
  return defaultData;
}

async function readDataAsync<T>(key: keyof NonNullable<typeof global.__soumili_db>, defaultData: T): Promise<T> {
  // 1. In-memory
  if (global.__soumili_db && global.__soumili_db[key] !== undefined) {
    return global.__soumili_db[key] as T;
  }

  // 2. Disk
  try {
    const dir = getStorageDir();
    const filePath = path.join(dir, `${String(key)}.json`);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      const parsed = JSON.parse(content) as T;
      if (global.__soumili_db) global.__soumili_db[key] = parsed as any;
      return parsed;
    }
  } catch {}

  // 3. Cloud KV Sync (Crucial for Mobile Web to receive Laptop uploads!)
  try {
    const cloud = await loadCloudData<T>(String(key));
    if (cloud !== null) {
      if (global.__soumili_db) global.__soumili_db[key] = cloud as any;
      try {
        const dir = getStorageDir();
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(path.join(dir, `${String(key)}.json`), JSON.stringify(cloud, null, 2), 'utf-8');
      } catch {}
      return cloud;
    }
  } catch {}

  // 4. Default fallback
  if (global.__soumili_db) global.__soumili_db[key] = defaultData as any;
  return defaultData;
}

function writeData<T>(key: keyof NonNullable<typeof global.__soumili_db>, data: T): void {
  // 1. Update memory
  if (global.__soumili_db) {
    global.__soumili_db[key] = data as any;
  }

  // 2. Save to disk
  try {
    const dir = getStorageDir();
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const filePath = path.join(dir, `${String(key)}.json`);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {}

  // 3. Sync to Cloud KV (So mobile web sees it in real-time!)
  try {
    syncCloudData(String(key), data);
  } catch {}
}

export const db = {
  // Settings
  getSettings: (): WebsiteSettings => readData('settings', initialSettings),
  getSettingsAsync: async (): Promise<WebsiteSettings> => {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase.from('website_settings').select('*').limit(1).single();
        if (!error && data && data.brand_name) {
          if (global.__soumili_db) global.__soumili_db.settings = data;
          return data;
        }
      } catch {}
    }
    return readDataAsync('settings', initialSettings);
  },
  updateSettings: (data: Partial<WebsiteSettings>): WebsiteSettings => {
    const current = db.getSettings();
    const updated = { ...current, ...data, updated_at: new Date().toISOString() };
    writeData('settings', updated);
    if (isSupabaseConfigured() && (supabaseAdmin || supabase)) {
      try {
        const client = supabaseAdmin || supabase!;
        client.from('website_settings').upsert({ ...updated, id: 'primary' }).then();
      } catch {}
    }
    return updated;
  },

  // Services
  getServices: (): ServiceItem[] => readData('services', initialServices),
  getServicesAsync: async (): Promise<ServiceItem[]> => {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase.from('services').select('*').order('display_order', { ascending: true });
        if (!error && Array.isArray(data) && data.length > 0) {
          if (global.__soumili_db) global.__soumili_db.services = data;
          return data;
        }
      } catch {}
    }
    return readDataAsync('services', initialServices);
  },
  getServiceBySlug: (slug: string): ServiceItem | undefined => {
    return db.getServices().find(s => s.slug === slug);
  },
  saveService: (service: Partial<ServiceItem> & { title: string }): ServiceItem => {
    const services = [...db.getServices()];
    let savedSvc: ServiceItem;
    if (service.id) {
      const index = services.findIndex(s => s.id === service.id);
      if (index !== -1) {
        services[index] = { ...services[index], ...service } as ServiceItem;
        savedSvc = services[index];
        writeData('services', services);
      } else {
        savedSvc = service as ServiceItem;
        services.push(savedSvc);
        writeData('services', services);
      }
    } else {
      savedSvc = {
        id: `svc-${Date.now()}`,
        slug: service.slug || service.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        title: service.title,
        short_description: service.short_description || '',
        full_description: service.full_description || '',
        image_url: service.image_url || '',
        features: service.features || [],
        is_featured: service.is_featured ?? false,
        display_order: service.display_order ?? (services.length + 1),
        created_at: new Date().toISOString()
      };
      services.push(savedSvc);
      writeData('services', services);
    }
    if (isSupabaseConfigured() && (supabaseAdmin || supabase)) {
      try {
        const client = supabaseAdmin || supabase!;
        client.from('services').upsert(savedSvc).then();
      } catch {}
    }
    return savedSvc;
  },
  deleteService: (id: string): boolean => {
    const services = db.getServices().filter(s => s.id !== id);
    writeData('services', services);
    return true;
  },

  // Pricing Packages
  getPackages: (publishedOnly = false): PricingPackage[] => {
    const packages = readData('packages', initialPackages);
    if (publishedOnly) {
      return packages.filter(p => p.is_published);
    }
    return packages;
  },
  getPackagesAsync: async (publishedOnly = false): Promise<PricingPackage[]> => {
    if (isSupabaseConfigured() && supabase) {
      try {
        let query = supabase.from('pricing_packages').select('*').order('display_order', { ascending: true });
        if (publishedOnly) query = query.eq('is_published', true);
        const { data, error } = await query;
        if (!error && Array.isArray(data) && data.length > 0) {
          if (global.__soumili_db) global.__soumili_db.packages = data;
          return data;
        }
      } catch {}
    }
    const packages = await readDataAsync('packages', initialPackages);
    if (publishedOnly) {
      return packages.filter(p => p.is_published);
    }
    return packages;
  },
  getPackageById: (id: string): PricingPackage | undefined => {
    return db.getPackages().find(p => p.id === id);
  },
  savePackage: (pkg: Partial<PricingPackage> & { name: string; price: number }): PricingPackage => {
    const packages = [...db.getPackages()];
    let savedPkg: PricingPackage;
    if (pkg.id) {
      const index = packages.findIndex(p => p.id === pkg.id);
      if (index !== -1) {
        packages[index] = { ...packages[index], ...pkg } as PricingPackage;
        savedPkg = packages[index];
        writeData('packages', packages);
      } else {
        savedPkg = pkg as PricingPackage;
        packages.push(savedPkg);
        writeData('packages', packages);
      }
    } else {
      savedPkg = {
        id: `pkg-${Date.now()}`,
        name: pkg.name,
        category: pkg.category || 'Bridal',
        price: Number(pkg.price),
        duration: pkg.duration || '3 Hours',
        description: pkg.description || '',
        features: pkg.features || [],
        image_url: pkg.image_url || '',
        is_featured: pkg.is_featured ?? false,
        is_published: pkg.is_published ?? true,
        display_order: pkg.display_order ?? (packages.length + 1),
        created_at: new Date().toISOString()
      };
      packages.push(savedPkg);
      writeData('packages', packages);
    }
    if (isSupabaseConfigured() && (supabaseAdmin || supabase)) {
      try {
        const client = supabaseAdmin || supabase!;
        client.from('pricing_packages').upsert(savedPkg).then();
      } catch {}
    }
    return savedPkg;
  },
  deletePackage: (id: string): boolean => {
    const packages = db.getPackages().filter(p => p.id !== id);
    writeData('packages', packages);
    if (isSupabaseConfigured() && (supabaseAdmin || supabase)) {
      try {
        const client = supabaseAdmin || supabase!;
        client.from('pricing_packages').delete().eq('id', id).then();
      } catch {}
    }
    return true;
  },

  // Gallery Categories
  getCategories: (): GalleryCategory[] => readData('categories', initialCategories),
  getCategoriesAsync: async (): Promise<GalleryCategory[]> => {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase.from('gallery_categories').select('*').order('display_order', { ascending: true });
        if (!error && Array.isArray(data) && data.length > 0) {
          if (global.__soumili_db) global.__soumili_db.categories = data;
          return data;
        }
      } catch {}
    }
    return readDataAsync('categories', initialCategories);
  },
  saveCategory: (category: Partial<GalleryCategory> & { name: string }): GalleryCategory => {
    const categories = [...db.getCategories()];
    let savedCat: GalleryCategory;
    if (category.id) {
      const idx = categories.findIndex(c => c.id === category.id);
      if (idx !== -1) {
        categories[idx] = { ...categories[idx], ...category } as GalleryCategory;
        savedCat = categories[idx];
        writeData('categories', categories);
      } else {
        savedCat = category as GalleryCategory;
        categories.push(savedCat);
        writeData('categories', categories);
      }
    } else {
      savedCat = {
        id: `cat-${Date.now()}`,
        name: category.name,
        slug: category.slug || category.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        display_order: category.display_order ?? (categories.length + 1),
        created_at: new Date().toISOString()
      };
      categories.push(savedCat);
      writeData('categories', categories);
    }
    if (isSupabaseConfigured() && (supabaseAdmin || supabase)) {
      try {
        const client = supabaseAdmin || supabase!;
        client.from('gallery_categories').upsert(savedCat).then();
      } catch {}
    }
    return savedCat;
  },
  deleteCategory: (id: string): boolean => {
    const categories = db.getCategories().filter(c => c.id !== id);
    writeData('categories', categories);
    return true;
  },

  // Gallery Images
  getGallery: (publishedOnly = false): GalleryImage[] => {
    const gallery = readData('gallery', initialGallery);
    const categories = db.getCategories();
    const mapped = gallery.map(item => ({
      ...item,
      category: categories.find(c => c.id === item.category_id)
    }));
    if (publishedOnly) {
      return mapped.filter(item => item.is_published);
    }
    return mapped;
  },
  getGalleryAsync: async (publishedOnly = false): Promise<GalleryImage[]> => {
    if (isSupabaseConfigured() && supabase) {
      try {
        let query = supabase.from('gallery_images').select('*, category:gallery_categories(*)').order('created_at', { ascending: false });
        if (publishedOnly) query = query.eq('is_published', true);
        const { data, error } = await query;
        if (!error && Array.isArray(data) && data.length > 0) {
          if (global.__soumili_db) global.__soumili_db.gallery = data;
          return data;
        }
      } catch {}
    }
    const gallery = await readDataAsync('gallery', initialGallery);
    const categories = await db.getCategoriesAsync();
    const mapped = gallery.map(item => ({
      ...item,
      category: categories.find(c => c.id === item.category_id)
    }));
    if (publishedOnly) {
      return mapped.filter(item => item.is_published);
    }
    return mapped;
  },
  saveGalleryImage: (img: Partial<GalleryImage> & { title: string; image_url: string }): GalleryImage => {
    const gallery = [...readData('gallery', initialGallery)];
    let savedImg: GalleryImage;
    if (img.id) {
      const idx = gallery.findIndex(g => g.id === img.id);
      if (idx !== -1) {
        gallery[idx] = { ...gallery[idx], ...img } as GalleryImage;
        savedImg = gallery[idx];
        writeData('gallery', gallery);
      } else {
        savedImg = img as GalleryImage;
        gallery.push(savedImg);
        writeData('gallery', gallery);
      }
    } else {
      savedImg = {
        id: `gal-${Date.now()}`,
        title: img.title,
        description: img.description || '',
        image_url: img.image_url,
        category_id: img.category_id,
        is_featured: img.is_featured ?? false,
        is_published: img.is_published ?? true,
        created_at: new Date().toISOString()
      };
      gallery.push(savedImg);
      writeData('gallery', gallery);
    }
    if (isSupabaseConfigured() && (supabaseAdmin || supabase)) {
      try {
        const client = supabaseAdmin || supabase!;
        const { category, ...cleanDbRecord } = savedImg as any;
        client.from('gallery_images').upsert(cleanDbRecord).then();
      } catch {}
    }
    return savedImg;
  },
  deleteGalleryImage: (id: string): boolean => {
    const gallery = readData<GalleryImage[]>('gallery', initialGallery).filter(g => g.id !== id);
    writeData('gallery', gallery);
    if (isSupabaseConfigured() && (supabaseAdmin || supabase)) {
      try {
        const client = supabaseAdmin || supabase!;
        client.from('gallery_images').delete().eq('id', id).then();
      } catch {}
    }
    return true;
  },

  // Testimonials
  getTestimonials: (publishedOnly = false): Testimonial[] => {
    const testimonials = readData('testimonials', initialTestimonials);
    if (publishedOnly) {
      return testimonials.filter(t => t.is_published);
    }
    return testimonials;
  },
  getTestimonialsAsync: async (publishedOnly = false): Promise<Testimonial[]> => {
    if (isSupabaseConfigured() && supabase) {
      try {
        let query = supabase.from('testimonials').select('*').order('display_order', { ascending: true });
        if (publishedOnly) query = query.eq('is_published', true);
        const { data, error } = await query;
        if (!error && Array.isArray(data) && data.length > 0) {
          if (global.__soumili_db) global.__soumili_db.testimonials = data;
          return data;
        }
      } catch {}
    }
    const testimonials = await readDataAsync('testimonials', initialTestimonials);
    if (publishedOnly) {
      return testimonials.filter(t => t.is_published);
    }
    return testimonials;
  },
  saveTestimonial: (test: Partial<Testimonial> & { client_name: string; quote: string }): Testimonial => {
    const testimonials = [...db.getTestimonials()];
    let savedTest: Testimonial;
    if (test.id) {
      const idx = testimonials.findIndex(t => t.id === test.id);
      if (idx !== -1) {
        testimonials[idx] = { ...testimonials[idx], ...test } as Testimonial;
        savedTest = testimonials[idx];
        writeData('testimonials', testimonials);
      } else {
        savedTest = test as Testimonial;
        testimonials.push(savedTest);
        writeData('testimonials', testimonials);
      }
    } else {
      savedTest = {
        id: `test-${Date.now()}`,
        client_name: test.client_name,
        event_type: test.event_type || 'Wedding Ceremony',
        event_date: test.event_date || 'Recent',
        rating: test.rating || 5,
        quote: test.quote,
        avatar_url: test.avatar_url || '',
        is_published: test.is_published ?? true,
        is_featured: test.is_featured ?? false,
        display_order: test.display_order ?? (testimonials.length + 1),
        created_at: new Date().toISOString()
      };
      testimonials.push(savedTest);
      writeData('testimonials', testimonials);
    }
    if (isSupabaseConfigured() && (supabaseAdmin || supabase)) {
      try {
        const client = supabaseAdmin || supabase!;
        client.from('testimonials').upsert(savedTest).then();
      } catch {}
    }
    return savedTest;
  },
  deleteTestimonial: (id: string): boolean => {
    const testimonials = db.getTestimonials().filter(t => t.id !== id);
    writeData('testimonials', testimonials);
    if (isSupabaseConfigured() && (supabaseAdmin || supabase)) {
      try {
        const client = supabaseAdmin || supabase!;
        client.from('testimonials').delete().eq('id', id).then();
      } catch {}
    }
    return true;
  },

  // Booking Enquiries
  getEnquiries: (): BookingEnquiry[] => readData('enquiries', []),
  saveEnquiry: (enquiry: Omit<BookingEnquiry, 'id' | 'status' | 'created_at'>): BookingEnquiry => {
    const enquiries = [...db.getEnquiries()];
    const newEnquiry: BookingEnquiry = {
      ...enquiry,
      id: `enq-${Date.now()}`,
      status: 'new',
      created_at: new Date().toISOString()
    };
    enquiries.unshift(newEnquiry);
    writeData('enquiries', enquiries);
    return newEnquiry;
  },
  updateEnquiryStatus: (id: string, status: BookingEnquiry['status']): boolean => {
    const enquiries = [...db.getEnquiries()];
    const idx = enquiries.findIndex(e => e.id === id);
    if (idx !== -1) {
      enquiries[idx].status = status;
      writeData('enquiries', enquiries);
      return true;
    }
    return false;
  }
};
