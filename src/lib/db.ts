import fs from 'fs';
import path from 'path';
import { initialSettings, initialServices, initialPackages, initialCategories, initialGallery, initialTestimonials } from './initialData';
import { WebsiteSettings, ServiceItem, PricingPackage, GalleryCategory, GalleryImage, Testimonial, BookingEnquiry } from '@/types/database';

// Global memory cache for serverless environments (Vercel)
const memoryCache: Record<string, any> = {
  settings: initialSettings,
  services: initialServices,
  packages: initialPackages,
  categories: initialCategories,
  gallery: initialGallery,
  testimonials: initialTestimonials,
  enquiries: [] as BookingEnquiry[]
};

// Safe fallback for serverless read/write
function isServerless() {
  return process.env.VERCEL === '1' || process.env.NODE_ENV === 'production';
}

function getDataDir() {
  try {
    if (isServerless()) {
      return path.join('/tmp', 'data');
    }
    return path.join(process.cwd(), 'data');
  } catch {
    return '/tmp';
  }
}

function getFilePath(filename: string) {
  return path.join(getDataDir(), `${filename}.json`);
}

function readData<T>(filename: string, defaultData: T): T {
  // Always check memory first
  if (memoryCache[filename] !== undefined) {
    return memoryCache[filename] as T;
  }

  try {
    const file = getFilePath(filename);
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf-8');
      const parsed = JSON.parse(content) as T;
      memoryCache[filename] = parsed;
      return parsed;
    }
  } catch (error) {
    // Ignore file read errors in serverless
  }

  memoryCache[filename] = defaultData;
  return defaultData;
}

function writeData<T>(filename: string, data: T): void {
  memoryCache[filename] = data;
  try {
    const dir = getDataDir();
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const file = getFilePath(filename);
    fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    // Serverless fallback continues using memoryCache
  }
}

export const db = {
  // Settings
  getSettings: (): WebsiteSettings => readData<WebsiteSettings>('settings', initialSettings),
  updateSettings: (data: Partial<WebsiteSettings>): WebsiteSettings => {
    const current = db.getSettings();
    const updated = { ...current, ...data, updated_at: new Date().toISOString() };
    writeData('settings', updated);
    return updated;
  },

  // Services
  getServices: (): ServiceItem[] => readData<ServiceItem[]>('services', initialServices),
  getServiceBySlug: (slug: string): ServiceItem | undefined => {
    return db.getServices().find(s => s.slug === slug);
  },
  saveService: (service: Partial<ServiceItem> & { title: string }): ServiceItem => {
    const services = db.getServices();
    if (service.id) {
      const index = services.findIndex(s => s.id === service.id);
      if (index !== -1) {
        services[index] = { ...services[index], ...service } as ServiceItem;
        writeData('services', services);
        return services[index];
      }
    }
    const newService: ServiceItem = {
      id: `svc-${Date.now()}`,
      slug: service.slug || service.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      title: service.title,
      short_description: service.short_description || '',
      full_description: service.full_description || '',
      image_url: service.image_url || 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&q=80&w=1000',
      features: service.features || [],
      is_featured: service.is_featured ?? false,
      display_order: service.display_order ?? (services.length + 1),
      created_at: new Date().toISOString()
    };
    services.push(newService);
    writeData('services', services);
    return newService;
  },
  deleteService: (id: string): boolean => {
    const services = db.getServices();
    const filtered = services.filter(s => s.id !== id);
    writeData('services', filtered);
    return true;
  },

  // Pricing Packages
  getPackages: (publishedOnly = false): PricingPackage[] => {
    const packages = readData<PricingPackage[]>('packages', initialPackages);
    if (publishedOnly) {
      return packages.filter(p => p.is_published);
    }
    return packages;
  },
  getPackageById: (id: string): PricingPackage | undefined => {
    return db.getPackages().find(p => p.id === id);
  },
  savePackage: (pkg: Partial<PricingPackage> & { name: string; price: number }): PricingPackage => {
    const packages = db.getPackages();
    if (pkg.id) {
      const index = packages.findIndex(p => p.id === pkg.id);
      if (index !== -1) {
        packages[index] = { ...packages[index], ...pkg } as PricingPackage;
        writeData('packages', packages);
        return packages[index];
      }
    }
    const newPkg: PricingPackage = {
      id: `pkg-${Date.now()}`,
      name: pkg.name,
      category: pkg.category || 'Bridal',
      price: Number(pkg.price),
      duration: pkg.duration || '3 Hours',
      description: pkg.description || '',
      features: pkg.features || [],
      image_url: pkg.image_url || 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&q=80&w=1000',
      is_featured: pkg.is_featured ?? false,
      is_published: pkg.is_published ?? true,
      display_order: pkg.display_order ?? (packages.length + 1),
      created_at: new Date().toISOString()
    };
    packages.push(newPkg);
    writeData('packages', packages);
    return newPkg;
  },
  deletePackage: (id: string): boolean => {
    const packages = db.getPackages();
    const filtered = packages.filter(p => p.id !== id);
    writeData('packages', filtered);
    return true;
  },

  // Gallery Categories
  getCategories: (): GalleryCategory[] => readData<GalleryCategory[]>('categories', initialCategories),
  saveCategory: (category: Partial<GalleryCategory> & { name: string }): GalleryCategory => {
    const categories = db.getCategories();
    if (category.id) {
      const idx = categories.findIndex(c => c.id === category.id);
      if (idx !== -1) {
        categories[idx] = { ...categories[idx], ...category } as GalleryCategory;
        writeData('categories', categories);
        return categories[idx];
      }
    }
    const newCat: GalleryCategory = {
      id: `cat-${Date.now()}`,
      name: category.name,
      slug: category.slug || category.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      display_order: category.display_order ?? (categories.length + 1),
      created_at: new Date().toISOString()
    };
    categories.push(newCat);
    writeData('categories', categories);
    return newCat;
  },
  deleteCategory: (id: string): boolean => {
    const categories = db.getCategories();
    writeData('categories', categories.filter(c => c.id !== id));
    return true;
  },

  // Gallery Images
  getGallery: (publishedOnly = false): GalleryImage[] => {
    const gallery = readData<GalleryImage[]>('gallery', initialGallery);
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
  saveGalleryImage: (img: Partial<GalleryImage> & { title: string; image_url: string }): GalleryImage => {
    const gallery = readData<GalleryImage[]>('gallery', initialGallery);
    if (img.id) {
      const idx = gallery.findIndex(g => g.id === img.id);
      if (idx !== -1) {
        gallery[idx] = { ...gallery[idx], ...img } as GalleryImage;
        writeData('gallery', gallery);
        return gallery[idx];
      }
    }
    const newImg: GalleryImage = {
      id: `gal-${Date.now()}`,
      title: img.title,
      description: img.description || '',
      image_url: img.image_url,
      category_id: img.category_id,
      is_featured: img.is_featured ?? false,
      is_published: img.is_published ?? true,
      created_at: new Date().toISOString()
    };
    gallery.push(newImg);
    writeData('gallery', gallery);
    return newImg;
  },
  deleteGalleryImage: (id: string): boolean => {
    const gallery = readData<GalleryImage[]>('gallery', initialGallery);
    writeData('gallery', gallery.filter(g => g.id !== id));
    return true;
  },

  // Testimonials
  getTestimonials: (publishedOnly = false): Testimonial[] => {
    const testimonials = readData<Testimonial[]>('testimonials', initialTestimonials);
    if (publishedOnly) {
      return testimonials.filter(t => t.is_published);
    }
    return testimonials;
  },
  saveTestimonial: (test: Partial<Testimonial> & { client_name: string; quote: string }): Testimonial => {
    const testimonials = db.getTestimonials();
    if (test.id) {
      const idx = testimonials.findIndex(t => t.id === test.id);
      if (idx !== -1) {
        testimonials[idx] = { ...testimonials[idx], ...test } as Testimonial;
        writeData('testimonials', testimonials);
        return testimonials[idx];
      }
    }
    const newTest: Testimonial = {
      id: `test-${Date.now()}`,
      client_name: test.client_name,
      event_type: test.event_type || 'Wedding Ceremony',
      event_date: test.event_date || 'Recent',
      rating: test.rating || 5,
      quote: test.quote,
      avatar_url: test.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
      is_published: test.is_published ?? true,
      is_featured: test.is_featured ?? false,
      display_order: test.display_order ?? (testimonials.length + 1),
      created_at: new Date().toISOString()
    };
    testimonials.push(newTest);
    writeData('testimonials', testimonials);
    return newTest;
  },
  deleteTestimonial: (id: string): boolean => {
    const testimonials = db.getTestimonials();
    writeData('testimonials', testimonials.filter(t => t.id !== id));
    return true;
  },

  // Booking Enquiries
  getEnquiries: (): BookingEnquiry[] => readData<BookingEnquiry[]>('enquiries', []),
  saveEnquiry: (enquiry: Omit<BookingEnquiry, 'id' | 'status' | 'created_at'>): BookingEnquiry => {
    const enquiries = db.getEnquiries();
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
    const enquiries = db.getEnquiries();
    const idx = enquiries.findIndex(e => e.id === id);
    if (idx !== -1) {
      enquiries[idx].status = status;
      writeData('enquiries', enquiries);
      return true;
    }
    return false;
  }
};
