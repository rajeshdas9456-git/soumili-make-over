import React from 'react';
import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import TestimonialsSection from '@/components/TestimonialsSection';
import ContactBookingSection from '@/components/ContactBookingSection';
import { db } from '@/lib/db';

export const metadata: Metadata = {
  title: "Client Reviews & Real Bride Testimonials | Soumili's Makeover",
  description: "Read verified reviews and heartfelt experiences from brides across India styled by Soumili's Makeover. Beauty • Elegance • Perfection.",
};

export const revalidate = 0;

export default async function TestimonialsPage() {
  const settings = db.getSettings();
  const testimonials = db.getTestimonials(true);
  const services = db.getServices();

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* Header Banner */}
      <section className="pt-36 pb-20 bg-brandBlack text-white relative">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <span className="text-xs uppercase tracking-[0.3em] text-brandPink font-semibold mb-3 inline-block">
            Gratitude & Love
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl text-white font-normal">
            Bride Testimonials & Stories
          </h1>
          <p className="text-brandLightPink/90 text-sm sm:text-base font-light mt-3 max-w-2xl mx-auto">
            Honest feedback and cherished moments from brides who walked down the aisle with confidence and joy with Soumili's Makeover.
          </p>
        </div>
      </section>

      {/* Testimonials List */}
      <TestimonialsSection testimonials={testimonials} />

      {/* Contact Booking Section */}
      <ContactBookingSection settings={settings} services={services} />

      <WhatsAppButton phone={settings.contact_whatsapp} />
      <Footer />
    </main>
  );
}
