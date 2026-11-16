export interface WebsiteSettings {
  id: string;
  brand_name: string;
  tagline: string;
  hero_title: string;
  hero_subtitle: string;
  hero_image: string;
  about_name: string;
  about_title: string;
  about_bio: string;
  about_experience_years: number;
  about_brides_catered: number;
  about_image: string;
  contact_phone: string;
  contact_email: string;
  contact_whatsapp: string;
  contact_address: string;
  instagram_handle: string;
  instagram_url: string;
  facebook_url: string;
  youtube_url: string;
  pinterest_url: string;
  google_maps_embed_url: string;
  updated_at: string;
}

export interface ServiceItem {
  id: string;
  slug: string;
  title: string;
  short_description: string;
  full_description: string;
  image_url: string;
  features: string[];
  is_featured: boolean;
  display_order: number;
  created_at: string;
}

export interface PricingPackage {
  id: string;
  name: string;
  category: string;
  price: number;
  duration: string;
  description: string;
  features: string[];
  image_url: string;
  is_featured: boolean;
  is_published: boolean;
  display_order: number;
  created_at: string;
}

export interface GalleryCategory {
  id: string;
  name: string;
  slug: string;
  display_order: number;
  created_at: string;
}

export interface GalleryImage {
  id: string;
  title: string;
  description?: string;
  image_url: string;
  category_id?: string;
  category?: GalleryCategory;
  is_featured: boolean;
  is_published: boolean;
  created_at: string;
}

export interface Testimonial {
  id: string;
  client_name: string;
  event_type: string;
  event_date: string;
  rating: number;
  quote: string;
  avatar_url: string;
  is_published: boolean;
  is_featured: boolean;
  display_order: number;
  created_at: string;
}

export interface BookingEnquiry {
  id: string;
  client_name: string;
  phone: string;
  email: string;
  service_id?: string;
  package_name?: string;
  event_date: string;
  event_location: string;
  guest_count: number;
  message?: string;
  notes?: string;
  status: 'new' | 'contacted' | 'booked' | 'cancelled';
  created_at: string;
}
