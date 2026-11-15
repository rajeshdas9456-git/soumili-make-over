-- ==============================================================================
-- PREMIUM BRIDAL MAKEUP ARTIST DATABASE SCHEMA (SUPABASE POSTGRESQL)
-- ==============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ADMINS TABLE
CREATE TABLE IF NOT EXISTS public.admins (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'admin',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. WEBSITE SETTINGS TABLE (Single row configuration)
CREATE TABLE IF NOT EXISTS public.website_settings (
    id TEXT PRIMARY KEY DEFAULT 'primary',
    brand_name TEXT NOT NULL DEFAULT 'Aura Bridal Studio',
    tagline TEXT NOT NULL DEFAULT 'Elevating Bridal Elegance with Couture Artistry & Timeless Glamour',
    hero_title TEXT NOT NULL DEFAULT 'Transforming Your Special Day Into An Eternal Masterpiece',
    hero_subtitle TEXT NOT NULL DEFAULT 'Luxury bridal makeup, bespoke styling, and international HD & Airbrush expertise crafted exclusively for modern brides.',
    hero_image TEXT NOT NULL DEFAULT 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&q=80&w=1600',
    about_name TEXT NOT NULL DEFAULT 'Elena Vance',
    about_title TEXT NOT NULL DEFAULT 'Celebrity Bridal Stylist & Master Makeup Artist',
    about_bio TEXT NOT NULL DEFAULT 'With over a decade of luxury bridal mastery across India, Dubai, and destination weddings worldwide, Elena combines bespoke skin preparation, premium global cosmetics, and couture styling techniques to make every bride shine effortlessly.',
    about_experience_years INT NOT NULL DEFAULT 12,
    about_brides_catered INT NOT NULL DEFAULT 850,
    about_image TEXT NOT NULL DEFAULT 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=1000',
    contact_phone TEXT NOT NULL DEFAULT '+91 98765 43210',
    contact_email TEXT NOT NULL DEFAULT 'concierge@aurabridal.com',
    contact_whatsapp TEXT NOT NULL DEFAULT '+919876543210',
    contact_address TEXT NOT NULL DEFAULT 'Suite 402, Royal Palms Boulevard, Bandra West, Mumbai 400050',
    instagram_handle TEXT NOT NULL DEFAULT '@aurabridalstudio',
    instagram_url TEXT NOT NULL DEFAULT 'https://instagram.com',
    facebook_url TEXT NOT NULL DEFAULT 'https://facebook.com',
    youtube_url TEXT NOT NULL DEFAULT 'https://youtube.com',
    pinterest_url TEXT NOT NULL DEFAULT 'https://pinterest.com',
    google_maps_embed_url TEXT NOT NULL DEFAULT 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.441097230607!2d72.825833!3d19.055833!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c9123456789%3A0x1234567890abcdef!2sBandra%20West%2C%20Mumbai!5e0!3m2!1sen!2sin!4v1600000000000',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. SERVICES TABLE
CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    short_description TEXT NOT NULL,
    full_description TEXT NOT NULL,
    image_url TEXT NOT NULL,
    features JSONB NOT NULL DEFAULT '[]'::jsonb,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. PRICING PACKAGES TABLE
CREATE TABLE IF NOT EXISTS public.pricing_packages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'Bridal',
    price INT NOT NULL,
    duration TEXT NOT NULL DEFAULT '3-4 Hours',
    description TEXT NOT NULL,
    features JSONB NOT NULL DEFAULT '[]'::jsonb,
    image_url TEXT NOT NULL,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    is_published BOOLEAN NOT NULL DEFAULT true,
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. GALLERY CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.gallery_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. GALLERY IMAGES TABLE
CREATE TABLE IF NOT EXISTS public.gallery_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT DEFAULT '',
    image_url TEXT NOT NULL,
    category_id UUID REFERENCES public.gallery_categories(id) ON DELETE SET NULL,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    is_published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. TESTIMONIALS TABLE
CREATE TABLE IF NOT EXISTS public.testimonials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_name TEXT NOT NULL,
    event_type TEXT NOT NULL,
    event_date TEXT NOT NULL,
    rating INT NOT NULL DEFAULT 5,
    quote TEXT NOT NULL,
    avatar_url TEXT NOT NULL,
    is_published BOOLEAN NOT NULL DEFAULT true,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. BOOKING ENQUIRIES TABLE
CREATE TABLE IF NOT EXISTS public.booking_enquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
    package_name TEXT DEFAULT '',
    event_date DATE NOT NULL,
    event_location TEXT NOT NULL,
    guest_count INT DEFAULT 1,
    message TEXT DEFAULT '',
    status TEXT NOT NULL DEFAULT 'new', -- new, contacted, booked, cancelled
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_enquiries ENABLE ROW LEVEL SECURITY;

-- PUBLIC READ PERMISSIONS
CREATE POLICY "Public read website_settings" ON public.website_settings FOR SELECT USING (true);
CREATE POLICY "Public read services" ON public.services FOR SELECT USING (true);
CREATE POLICY "Public read published packages" ON public.pricing_packages FOR SELECT USING (is_published = true);
CREATE POLICY "Public read gallery_categories" ON public.gallery_categories FOR SELECT USING (true);
CREATE POLICY "Public read published gallery" ON public.gallery_images FOR SELECT USING (is_published = true);
CREATE POLICY "Public read published testimonials" ON public.testimonials FOR SELECT USING (is_published = true);
CREATE POLICY "Public can submit booking enquiries" ON public.booking_enquiries FOR INSERT WITH CHECK (true);

-- ADMIN AUTHENTICATED FULL PERMISSIONS
CREATE POLICY "Admin full access website_settings" ON public.website_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access services" ON public.services FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access pricing_packages" ON public.pricing_packages FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access gallery_categories" ON public.gallery_categories FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access gallery_images" ON public.gallery_images FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access testimonials" ON public.testimonials FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access booking_enquiries" ON public.booking_enquiries FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin read admins" ON public.admins FOR SELECT TO authenticated USING (true);

-- ==============================================================================
-- STORAGE BUCKETS SETUP
-- ==============================================================================
-- Run in Supabase SQL editor:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('portfolio', 'portfolio', true) ON CONFLICT DO NOTHING;
-- CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'portfolio');
-- CREATE POLICY "Authenticated Uploads" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'portfolio');
-- CREATE POLICY "Authenticated Deletes" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'portfolio');

-- ==============================================================================
-- INITIAL SEED DATA
-- ==============================================================================

INSERT INTO public.website_settings (id, brand_name, tagline, hero_title, hero_subtitle, about_name, about_title, contact_phone, contact_email)
VALUES (
    'primary',
    'Aura Bridal Studio',
    'Elevating Bridal Elegance with Couture Artistry & Timeless Glamour',
    'Transforming Your Special Day Into An Eternal Masterpiece',
    'Luxury bridal makeup, bespoke styling, and international HD & Airbrush expertise crafted exclusively for modern brides.',
    'Elena Vance',
    'Celebrity Bridal Stylist & Master Makeup Artist',
    '+91 98765 43210',
    'concierge@aurabridal.com'
) ON CONFLICT (id) DO NOTHING;

-- Seed Categories
INSERT INTO public.gallery_categories (name, slug, display_order) VALUES
('Bridal Couture', 'bridal-couture', 1),
('Reception Glam', 'reception-glam', 2),
('Engagement Elegance', 'engagement-elegance', 3),
('Party & Cocktail', 'party-cocktail', 4),
('Pre-Wedding & Haldi', 'pre-wedding-haldi', 5)
ON CONFLICT (slug) DO NOTHING;
