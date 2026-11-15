import React from 'react';
import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import FeaturedServices from '@/components/FeaturedServices';
import PricingSection from '@/components/PricingSection';
import ContactBookingSection from '@/components/ContactBookingSection';
import { db } from '@/lib/db';
import { initialSettings, initialServices, initialPackages } from '@/lib/initialData';

export const metadata: Metadata = {
  title: "Luxury Makeup Services & Artistry Repertoire | Soumili's Makeover",
  description: "Explore the complete luxury beauty repertoire of Soumili's Makeover: Royal Bridal, HD Makeovers, Airbrush, Reception Glam, Sagan, and Party Makeovers.",
};

export const revalidate = 0;

export default async function ServicesPage() {
  let settings = initialSettings;
  let services = initialServices;
  let packages = initialPackages.filter((p) => p.is_published);

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

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* Header Banner */}
      <section className="pt-36 pb-20 bg-brandBlack text-white relative">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <span className="text-xs uppercase tracking-[0.3em] text-brandPink font-semibold mb-3 inline-block">
            Beauty • Elegance • Perfection
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl text-white font-normal">
            Couture Makeup Services
          </h1>
          <p className="text-brandLightPink/90 text-sm sm:text-base font-light mt-3 max-w-2xl mx-auto">
            From regal traditional Indian weddings to contemporary international celebrations, explore our range of bespoke beauty services at Soumili's Makeover.
          </p>
        </div>
      </section>

      {/* Services List */}
      <FeaturedServices services={services} />

      {/* Associated Packages */}
      <PricingSection packages={packages} />

      {/* Booking CTA */}
      <ContactBookingSection settings={settings} services={services} />

      <WhatsAppButton phone={settings.contact_whatsapp || '+919876543210'} />
      <Footer />
    </main>
  );
}
