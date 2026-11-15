import React from 'react';
import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import ContactBookingSection from '@/components/ContactBookingSection';
import { db } from '@/lib/db';

export const metadata: Metadata = {
  title: "Contact Us & Book Consultation | Soumili's Makeover",
  description: "Book your bridal makeup consultation, check date availability, or connect with Soumili's Makeover studio concierge via WhatsApp, phone, or in person.",
};

export const revalidate = 0;

export default async function ContactPage({
  searchParams
}: {
  searchParams?: { package?: string };
}) {
  const settings = db.getSettings();
  const services = db.getServices();
  const selectedPackage = searchParams?.package || '';

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* Header Banner */}
      <section className="pt-36 pb-20 bg-brandBlack text-white relative">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <span className="text-xs uppercase tracking-[0.3em] text-brandPink font-semibold mb-3 inline-block">
            Start Your Journey
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl text-white font-normal">
            Contact & VIP Bookings
          </h1>
          <p className="text-brandLightPink/90 text-sm sm:text-base font-light mt-3 max-w-2xl mx-auto">
            Soumili's Makeover is honored to be considered for your once-in-a-lifetime milestone. Let us curate an unforgettable beauty experience.
          </p>
        </div>
      </section>

      {/* Contact Booking Form and Map */}
      <ContactBookingSection
        settings={settings}
        services={services}
        defaultPackage={selectedPackage}
      />

      <WhatsAppButton phone={settings.contact_whatsapp} />
      <Footer />
    </main>
  );
}
