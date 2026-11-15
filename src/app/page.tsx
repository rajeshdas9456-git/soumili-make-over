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

export const revalidate = 0; // live dynamic data from database

export default async function HomePage() {
  const settings = db.getSettings();
  const services = db.getServices();
  const packages = db.getPackages(true); // published only
  const gallery = db.getGallery(true); // published only
  const categories = db.getCategories();
  const testimonials = db.getTestimonials(true); // published only

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
      <WhatsAppButton phone={settings.contact_whatsapp} />

      <Footer />
    </main>
  );
}
