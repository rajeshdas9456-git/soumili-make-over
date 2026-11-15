// Client-Side Global Persistence Store for Soumili's Makeover
// Synced across tabs and pages in the user's browser via localStorage + API

import { initialSettings, initialServices, initialPackages, initialCategories, initialGallery, initialTestimonials } from '@/lib/initialData';
import { WebsiteSettings, ServiceItem, PricingPackage, GalleryCategory, GalleryImage, Testimonial, BookingEnquiry } from '@/types/database';

const KEYS = {
  SETTINGS: 'sm_settings_v2',
  PACKAGES: 'sm_packages_v2',
  SERVICES: 'sm_services_v2',
  GALLERY: 'sm_gallery_v2',
  CATEGORIES: 'sm_categories_v2',
  TESTIMONIALS: 'sm_testimonials_v2',
  ENQUIRIES: 'sm_enquiries_v2'
};

function getLocal<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = localStorage.getItem(key);
    if (item) return JSON.parse(item);
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

export const clientStore = {
  // SETTINGS
  getSettings: (): WebsiteSettings => getLocal(KEYS.SETTINGS, initialSettings),
  saveSettings: (settings: WebsiteSettings) => setLocal(KEYS.SETTINGS, settings),

  // PACKAGES
  getPackages: (publishedOnly = true): PricingPackage[] => {
    const pkgs = getLocal(KEYS.PACKAGES, initialPackages);
    return publishedOnly ? pkgs.filter(p => p.is_published) : pkgs;
  },
  savePackages: (pkgs: PricingPackage[]) => setLocal(KEYS.PACKAGES, pkgs),

  // SERVICES
  getServices: (): ServiceItem[] => getLocal(KEYS.SERVICES, initialServices),
  saveServices: (services: ServiceItem[]) => setLocal(KEYS.SERVICES, services),

  // GALLERY
  getGallery: (publishedOnly = true): GalleryImage[] => {
    const gallery = getLocal(KEYS.GALLERY, initialGallery);
    return publishedOnly ? gallery.filter(g => g.is_published) : gallery;
  },
  saveGallery: (gallery: GalleryImage[]) => setLocal(KEYS.GALLERY, gallery),

  // CATEGORIES
  getCategories: (): GalleryCategory[] => getLocal(KEYS.CATEGORIES, initialCategories),
  saveCategories: (categories: GalleryCategory[]) => setLocal(KEYS.CATEGORIES, categories),

  // TESTIMONIALS
  getTestimonials: (publishedOnly = true): Testimonial[] => {
    const testimonials = getLocal(KEYS.TESTIMONIALS, initialTestimonials);
    return publishedOnly ? testimonials.filter(t => t.is_published) : testimonials;
  },
  saveTestimonials: (testimonials: Testimonial[]) => setLocal(KEYS.TESTIMONIALS, testimonials),

  // ENQUIRIES
  getEnquiries: (): BookingEnquiry[] => getLocal(KEYS.ENQUIRIES, []),
  addEnquiry: (enquiry: BookingEnquiry) => {
    const current = getLocal<BookingEnquiry[]>(KEYS.ENQUIRIES, []);
    setLocal(KEYS.ENQUIRIES, [enquiry, ...current]);
  },
  saveEnquiries: (enquiries: BookingEnquiry[]) => setLocal(KEYS.ENQUIRIES, enquiries)
};
