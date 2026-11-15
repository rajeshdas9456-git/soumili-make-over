// Client-Side Global Persistence Store for Soumili's Makeover
// Permanently keeps user's custom photos, packages, and settings without reverting!

import { initialSettings, initialServices, initialPackages, initialCategories, initialGallery, initialTestimonials } from '@/lib/initialData';
import { WebsiteSettings, ServiceItem, PricingPackage, GalleryCategory, GalleryImage, Testimonial, BookingEnquiry } from '@/types/database';

const KEYS = {
  SETTINGS: 'sm_settings_v3',
  PACKAGES: 'sm_packages_v3',
  SERVICES: 'sm_services_v3',
  GALLERY: 'sm_gallery_v3',
  CATEGORIES: 'sm_categories_v3',
  TESTIMONIALS: 'sm_testimonials_v3',
  ENQUIRIES: 'sm_enquiries_v3',
  CUSTOM_FLAGS: 'sm_custom_flags_v3'
};

function getLocal<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = localStorage.getItem(key);
    if (item) {
      const parsed = JSON.parse(item);
      if (Array.isArray(parsed) && parsed.length === 0 && Array.isArray(fallback) && (fallback as any).length === 0) {
        return parsed as T;
      }
      return parsed;
    }
  } catch (e) {
    console.error('LocalStorage read error:', e);
  }
  return fallback;
}

function setLocal<T>(key: string, data: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
    window.dispatchEvent(new Event('soumili_data_updated'));
  } catch (e) {
    console.error('LocalStorage write error:', e);
  }
}

function getFlags(): Record<string, boolean> {
  if (typeof window === 'undefined') return {};
  try {
    const item = localStorage.getItem(KEYS.CUSTOM_FLAGS);
    if (item) return JSON.parse(item);
  } catch {}
  return {};
}

function setFlag(flag: string): void {
  if (typeof window === 'undefined') return;
  try {
    const flags = getFlags();
    flags[flag] = true;
    localStorage.setItem(KEYS.CUSTOM_FLAGS, JSON.stringify(flags));
  } catch {}
}

export const clientStore = {
  hasCustom: (type: string): boolean => {
    return Boolean(getFlags()[type]);
  },

  // SETTINGS
  getSettings: (): WebsiteSettings => {
    return getLocal(KEYS.SETTINGS, initialSettings);
  },
  saveSettings: (settings: WebsiteSettings) => {
    setFlag('settings');
    setLocal(KEYS.SETTINGS, settings);
  },

  // PACKAGES
  getPackages: (publishedOnly = true): PricingPackage[] => {
    const pkgs = getLocal(KEYS.PACKAGES, initialPackages);
    return publishedOnly ? pkgs.filter(p => p.is_published) : pkgs;
  },
  savePackages: (pkgs: PricingPackage[]) => {
    setFlag('packages');
    setLocal(KEYS.PACKAGES, pkgs);
  },

  // SERVICES
  getServices: (): ServiceItem[] => {
    return getLocal(KEYS.SERVICES, initialServices);
  },
  saveServices: (services: ServiceItem[]) => {
    setFlag('services');
    setLocal(KEYS.SERVICES, services);
  },

  // GALLERY
  getGallery: (publishedOnly = true): GalleryImage[] => {
    const gallery = getLocal(KEYS.GALLERY, initialGallery);
    return publishedOnly ? gallery.filter(g => g.is_published) : gallery;
  },
  saveGallery: (gallery: GalleryImage[]) => {
    setFlag('gallery');
    setLocal(KEYS.GALLERY, gallery);
  },

  // CATEGORIES
  getCategories: (): GalleryCategory[] => {
    return getLocal(KEYS.CATEGORIES, initialCategories);
  },
  saveCategories: (categories: GalleryCategory[]) => {
    setFlag('categories');
    setLocal(KEYS.CATEGORIES, categories);
  },

  // TESTIMONIALS
  getTestimonials: (publishedOnly = true): Testimonial[] => {
    const testimonials = getLocal(KEYS.TESTIMONIALS, initialTestimonials);
    return publishedOnly ? testimonials.filter(t => t.is_published) : testimonials;
  },
  saveTestimonials: (testimonials: Testimonial[]) => {
    setFlag('testimonials');
    setLocal(KEYS.TESTIMONIALS, testimonials);
  },

  // ENQUIRIES
  getEnquiries: (): BookingEnquiry[] => getLocal(KEYS.ENQUIRIES, []),
  addEnquiry: (enquiry: BookingEnquiry) => {
    const current = getLocal<BookingEnquiry[]>(KEYS.ENQUIRIES, []);
    setLocal(KEYS.ENQUIRIES, [enquiry, ...current]);
  },
  saveEnquiries: (enquiries: BookingEnquiry[]) => setLocal(KEYS.ENQUIRIES, enquiries)
};
