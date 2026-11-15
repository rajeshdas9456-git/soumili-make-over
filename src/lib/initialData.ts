import { WebsiteSettings, ServiceItem, PricingPackage, GalleryCategory, GalleryImage, Testimonial } from '@/types/database';

export const initialSettings: WebsiteSettings = {
  id: 'primary',
  brand_name: "Soumili's Makeover",
  tagline: 'Beauty • Elegance • Perfection',
  hero_title: "Transforming Your Special Day Into An Eternal Masterpiece",
  hero_subtitle: "Luxury bridal makeup, bespoke styling, and international HD & Airbrush expertise crafted exclusively for the modern bride by Soumili.",
  hero_image: '', // Admin will add real photo
  about_name: 'Soumili',
  about_title: 'Celebrity Bridal Stylist & Master Makeup Artist',
  about_bio: "With over a decade of luxury bridal mastery across India and destination weddings, Soumili crafts unforgettable bridal experiences combining bespoke skincare, international cosmetics, and flawless couture styling.",
  about_experience_years: 12,
  about_brides_catered: 950,
  about_image: '', // Admin will add real photo
  contact_phone: '+91 98765 43210',
  contact_email: 'contact@soumilismakeover.com',
  contact_whatsapp: '+919876543210',
  contact_address: "Soumili's Makeover Luxury Studio, Royal Palms, Bandra West, Mumbai 400050",
  instagram_handle: '@soumilismakeover',
  instagram_url: 'https://instagram.com',
  facebook_url: 'https://facebook.com',
  youtube_url: 'https://youtube.com',
  pinterest_url: 'https://pinterest.com',
  google_maps_embed_url: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.441097230607!2d72.825833!3d19.055833!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c9123456789%3A0x1234567890abcdef!2sBandra%20West%2C%20Mumbai!5e0!3m2!1sen!2sin!4v1600000000000',
  updated_at: new Date().toISOString()
};

export const initialServices: ServiceItem[] = [
  {
    id: 's-1',
    slug: 'bridal-makeup',
    title: 'Bridal Makeup',
    short_description: "Signature royal bridal makeover by Soumili's Makeover. Timeless, regal, and camera-ready for your wedding day ceremonies.",
    full_description: "Our signature bridal service is an immersive luxury ritual. From advanced skin preparation to long-wear high-definition base creation, every brushstroke is tailored to complement your heirloom jewels, lehenga, and lighting ambiance.",
    image_url: '', // Admin can add real photo
    features: ['Custom Luxury Skin Prep & Hydration Mask', 'High-Definition Waterproof Base', 'Lashes & Customized Eye Contour', 'Hairstyling, Saree/Dupatta Draping & Jewelry Setting', 'Complimentary Touch-up Kit Included'],
    is_featured: true,
    display_order: 1,
    created_at: new Date().toISOString()
  },
  {
    id: 's-2',
    slug: 'reception-makeup',
    title: 'Reception Makeup',
    short_description: 'Sophisticated, modern, red-carpet glam that glistens beneath evening ballroom chandeliers.',
    full_description: 'Designed for high-impact evening events. We focus on sculpted cheekbones, sultry smokey or shimmering metallic eyes, glass skin finish, and voluminous Hollywood waves or sleek contemporary updos.',
    image_url: '', // Admin can add real photo
    features: ['High-Shine Radiant Glass Skin Finish', 'Sensational Evening Eye Artistry', 'Statement Lip Sculpting', 'Couture Red-Carpet Hairstyling', 'Body Shimmer & Decolletage Highlighting'],
    is_featured: true,
    display_order: 2,
    created_at: new Date().toISOString()
  },
  {
    id: 's-3',
    slug: 'engagement-makeup',
    title: 'Engagement Makeup',
    short_description: 'Romantic, dewy, and fresh aesthetics that highlight your natural beauty with soft glam nuances.',
    full_description: 'Perfect harmony of modern youthfulness and regal tradition. We emphasize dewy skin, soft-focus pastel eyelids, and whimsical floral hairstyles that photograph exquisitely in daylight and twilight.',
    image_url: '', // Admin can add real photo
    features: ['Soft Focus Dewy Base Artistry', 'Subtle Rose Pink & Champagne Eyes', 'Intricate Floral Hair Art / Braids', 'Outfit Draping & Accessory Styling', 'All-Day Sweat & Tear Resistant'],
    is_featured: true,
    display_order: 3,
    created_at: new Date().toISOString()
  },
  {
    id: 's-4',
    slug: 'party-makeup',
    title: 'Party Makeup',
    short_description: 'Striking, trend-forward makeup for cocktail evenings, sangeet parties, and wedding guests.',
    full_description: 'Elevate your party attire with our customized party glam. Whether you prefer minimalist chic, bold winged eyeliner, or glittering festive glam, we craft a look that stays flawless through dance and celebrations.',
    image_url: '', // Admin can add real photo
    features: ['Precision Airbrush or HD Finish', 'Customized False Lashes', 'Trendy Textured Updos or Beach Waves', 'Transfer-Proof Color Palette', 'Fast & Flawless Transformation'],
    is_featured: true,
    display_order: 4,
    created_at: new Date().toISOString()
  }
];

export const initialPackages: PricingPackage[] = [
  {
    id: 'pkg-1',
    name: 'Classic Bridal Elegance',
    category: 'Bridal',
    price: 25000,
    duration: '3.5 Hours',
    description: "A refined traditional bridal makeover utilizing international luxury HD cosmetics by Soumili's Makeover.",
    features: [
      'Complete HD Waterproof Face Base',
      'Premium Mink Lashes Application',
      'Bridal Hair Styling & Bun Ornaments',
      'Dupatta Setting & Heavy Jewelry Fixing',
      'Complimentary Mini Touch-up Kit'
    ],
    image_url: '', // Clean for admin upload
    is_featured: false,
    is_published: true,
    display_order: 1,
    created_at: new Date().toISOString()
  },
  {
    id: 'pkg-2',
    name: 'Couture HD Bridal Makeup',
    category: 'Bridal',
    price: 35000,
    duration: '4 Hours',
    description: "Our signature sought-after bridal experience with high-definition camera readiness by Soumili.",
    features: [
      'Pre-Bridal Luxury Collagen Skin Prep',
      'Ultra HD 4K Seamless Waterproof Base',
      'Artisanal Eye Artistry & 3D Mink Lashes',
      'Intricate Bridal Hair Design & Real Flowers Setting',
      'Double Dupatta Draping & Royal Jewelry Fitting',
      'Full Size Touch-up Kit with Lipstick Sample'
    ],
    image_url: '', // Clean for admin upload
    is_featured: true,
    is_published: true,
    display_order: 2,
    created_at: new Date().toISOString()
  },
  {
    id: 'pkg-3',
    name: 'Royal Airbrush Bridal Makeup',
    category: 'Bridal',
    price: 45000,
    duration: '4.5 Hours',
    description: 'The pinnacle of luxury makeup artistry with weightless, poreless Temptu Airbrush precision.',
    features: [
      'Exclusive Temptu 24-Hour Silicone Airbrush Base',
      'Sweatproof, Waterproof & Cry-Proof Technology',
      'Bespoke Eye Design with Swarovski Crystal Accents',
      'Master Bridal Coiffure & Veil Architecture',
      'Full Draping, Jewellery, and Neck/Shoulder Highlighting',
      'Artist Accompaniment for Ceremony Touch-ups'
    ],
    image_url: '', // Clean for admin upload
    is_featured: true,
    is_published: true,
    display_order: 3,
    created_at: new Date().toISOString()
  },
  {
    id: 'pkg-4',
    name: 'Engagement & Sagan Glam',
    category: 'Engagement',
    price: 18000,
    duration: '2.5 Hours',
    description: 'Soft-focus, romantic, and dreamy styling customized for ring ceremonies and daytime functions.',
    features: [
      'Luminous Satin Skin Preparation',
      'Soft Pastel / Pink Smokey Eyes',
      'Delicate Faux Lash Accents',
      'Boho-Chic Textured Braids or Soft Curls',
      'Dupatta/Gown Draping Assistance'
    ],
    image_url: '', // Clean for admin upload
    is_featured: false,
    is_published: true,
    display_order: 4,
    created_at: new Date().toISOString()
  },
  {
    id: 'pkg-5',
    name: 'Red-Carpet Reception Glam',
    category: 'Reception',
    price: 22000,
    duration: '3 Hours',
    description: 'Glamorous and sultry evening looks crafted to captivate under reception stage spotlights.',
    features: [
      'Sculpted 3D Contour & Candlelight Glow',
      'Dramatic Evening Eye Makeup & Winged Precision',
      'Velvet Matte or Lacquer Lips',
      'Hollywood Waves or Polished Chignon',
      'Decolletage Illuminator and Body Buffing'
    ],
    image_url: '', // Clean for admin upload
    is_featured: false,
    is_published: true,
    display_order: 5,
    created_at: new Date().toISOString()
  },
  {
    id: 'pkg-6',
    name: 'Celebrity Party & Sangeet Makeup',
    category: 'Party',
    price: 12000,
    duration: '2 Hours',
    description: 'High-energy party makeup designed to withstand all night dancing without budging.',
    features: [
      'Flawless Medium-to-Full Coverage Base',
      'Shimmer or Glitter Pop Eye Artistry',
      'Natural Volume Lash Enhancement',
      'Modern Blowout, Ponytail or Messy Bun',
      'Saree / Sangeet Outfit Draping'
    ],
    image_url: '', // Clean for admin upload
    is_featured: false,
    is_published: true,
    display_order: 6,
    created_at: new Date().toISOString()
  }
];

export const initialCategories: GalleryCategory[] = [
  { id: 'cat-1', name: 'Bridal Couture', slug: 'bridal-couture', display_order: 1, created_at: new Date().toISOString() },
  { id: 'cat-2', name: 'Reception Glam', slug: 'reception-glam', display_order: 2, created_at: new Date().toISOString() },
  { id: 'cat-3', name: 'Engagement Elegance', slug: 'engagement-elegance', display_order: 3, created_at: new Date().toISOString() },
  { id: 'cat-4', name: 'Party & Cocktail', slug: 'party-cocktail', display_order: 4, created_at: new Date().toISOString() },
  { id: 'cat-5', name: 'Pre-Wedding & Haldi', slug: 'pre-wedding-haldi', display_order: 5, created_at: new Date().toISOString() }
];

// Clean empty gallery - ready for admin to upload real photos!
export const initialGallery: GalleryImage[] = [];

export const initialTestimonials: Testimonial[] = [
  {
    id: 'test-1',
    client_name: 'Ananya Singhania',
    event_type: 'Destination Wedding',
    event_date: 'Recent',
    rating: 5,
    quote: "Soumili is an absolute magician! My wedding makeup looked as immaculate after seven hours of pheras as it did when she first applied it. Soumili's Makeover is pure luxury and perfection.",
    avatar_url: '',
    is_published: true,
    is_featured: true,
    display_order: 1,
    created_at: new Date().toISOString()
  },
  {
    id: 'test-2',
    client_name: 'Meera Kapoor',
    event_type: 'Reception & Sangeet',
    event_date: 'Recent',
    rating: 5,
    quote: "Booking Soumili's Makeover was hands down the best decision of my entire wedding journey. Her airbrush technique gave me pure porcelain skin without feeling cakey or heavy.",
    avatar_url: '',
    is_published: true,
    is_featured: true,
    display_order: 2,
    created_at: new Date().toISOString()
  },
  {
    id: 'test-3',
    client_name: 'Dr. Riya Sen',
    event_type: 'Royal Wedding',
    event_date: 'Recent',
    rating: 5,
    quote: "I rarely wear makeup in daily life and was terrified of looking unrecognizable. Soumili enhanced my natural beauty with divine elegance. Truly the highest tier of bridal artistry!",
    avatar_url: '',
    is_published: true,
    is_featured: true,
    display_order: 3,
    created_at: new Date().toISOString()
  }
];
