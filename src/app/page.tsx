import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import FeaturedServices from '@/components/FeaturedServices';
import PricingSection from '@/components/PricingSection';
import GalleryPreview from '@/components/GalleryPreview';
import TestimonialsSection from '@/components/TestimonialsSection';
import InstagramSection from '@/components/InstagramSection';
import ContactBookingSection from '@/components/ContactBookingSection';
import { db } from '@/lib/db';
import {
  initialSettings,
  initialServices,
  initialPackages,
  initialCategories,
  initialGallery,
  initialTestimonials
} from '@/lib/initialData';

export const revalidate = 0; // live dynamic data from database

export default async function HomePage() {
  let settings = initialSettings;
  let services = initialServices;
  let packages = initialPackages.filter((p) => p.is_published);
  let gallery = initialGallery;
  let categories = initialCategories;
  let testimonials = initialTestimonials.filter((t) => t.is_published);

  try {
    const s = await db.getSettingsAsync();
    if (s && s.brand_name) settings = s;
  } catch {}

  try {
    const sv = await db.getServicesAsync();
    if (Array.isArray(sv) && sv.length > 0) services = sv;
  } catch {}

  try {
    const pk = await db.getPackagesAsync(true);
    if (Array.isArray(pk) && pk.length > 0) packages = pk;
  } catch {}

  try {
    const gl = await db.getGalleryAsync(true);
    if (Array.isArray(gl) && gl.length > 0) gallery = gl;
  } catch {}

  try {
    const ct = await db.getCategoriesAsync();
    if (Array.isArray(ct) && ct.length > 0) categories = ct;
  } catch {}

  try {
    const ts = await db.getTestimonialsAsync(true);
    if (Array.isArray(ts) && ts.length > 0) testimonials = ts;
  } catch {}

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      
      {/* 1. Large Bridal Hero Banner */}
      <HeroSection settings={settings} />

      {/* 2. Featured Services */}
      <FeaturedServices services={services} />

      {/* 3. About Elena Vance Preview */}
      <AboutSection settings={settings} />

      {/* 4. Popular Bridal Packages & Real Pricing */}
      <PricingSection packages={packages} />

      {/* 5. Latest Bridal Makeup Gallery (with Category Filter & Lightbox) */}
      <GalleryPreview images={gallery} categories={categories} showAllLink={true} />

      {/* 6. Customer Testimonials */}
      <TestimonialsSection testimonials={testimonials} />

      {/* 7. Instagram Section */}
      <InstagramSection settings={settings} />

      {/* 8. Contact & Booking Section */}
      <ContactBookingSection settings={settings} services={services} />

      {/* 9. WhatsApp Floating Button */}
      <WhatsAppButton phone={settings.contact_whatsapp || '+919876543210'} />

      <Footer />
    </main>
  );
}
