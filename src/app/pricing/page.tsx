import React from 'react';
import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import PricingSection from '@/components/PricingSection';
import ContactBookingSection from '@/components/ContactBookingSection';
import { db } from '@/lib/db';
import { Sparkles, ShieldCheck, HeartHandshake } from 'lucide-react';

export const metadata: Metadata = {
  title: "Bridal Makeup Packages & Pricing | Soumili's Makeover",
  description: "Live pricing and packages for royal bridal makeup, Temptu Airbrush, HD makeovers, and destination wedding packages by Soumili's Makeover.",
};

export const revalidate = 0;

export default async function PricingPage() {
  const settings = db.getSettings();
  const packages = db.getPackages(true);
  const services = db.getServices();

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
            Pricing & Bridal Packages
          </h1>
          <p className="text-brandLightPink/90 text-sm sm:text-base font-light mt-3 max-w-2xl mx-auto">
            Transparent investment for your most cherished celebration. Live prices from Soumili's Makeover studio database.
          </p>
        </div>
      </section>

      {/* Dynamic Pricing Cards */}
      <PricingSection packages={packages} />

      {/* Inclusions Detail Section */}
      <section className="py-16 bg-brandLightPink/30 border-y border-brandPink/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="font-serif text-2xl sm:text-3xl text-brandBlack">
              What Is Included In Every Booking at Soumili's Makeover?
            </h3>
            <p className="text-xs text-brandBlack/60 mt-1">
              Every package is an all-inclusive VIP pampering experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-white border border-brandPink/30 shadow-pink-soft">
              <Sparkles className="w-8 h-8 text-brandPink mb-4" />
              <h4 className="font-serif text-lg text-brandBlack font-medium mb-2">
                Luxury Skincare & Prep
              </h4>
              <p className="text-xs text-brandBlack/70 leading-relaxed">
                Hyaluronic acid hydration, calming cooling eye patches, lip scrub, and bespoke primer layering to ensure 18-hour poreless longevity.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-brandPink/30 shadow-pink-soft">
              <ShieldCheck className="w-8 h-8 text-brandPink mb-4" />
              <h4 className="font-serif text-lg text-brandBlack font-medium mb-2">
                100% International Cosmetics
              </h4>
              <p className="text-xs text-brandBlack/70 leading-relaxed">
                We exclusively utilize Charlotte Tilbury, Tom Ford, NARS, Dior Backstage, Anastasia Beverly Hills, and Huda Beauty.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-brandPink/30 shadow-pink-soft">
              <HeartHandshake className="w-8 h-8 text-brandPink mb-4" />
              <h4 className="font-serif text-lg text-brandBlack font-medium mb-2">
                Complete Hair & Draping
              </h4>
              <p className="text-xs text-brandBlack/70 leading-relaxed">
                Includes designer hair extensions styling, fresh or artificial flower insertion, heavy double dupatta pinning, and royal jewelry placement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Form */}
      <ContactBookingSection settings={settings} services={services} />

      <WhatsAppButton phone={settings.contact_whatsapp} />
      <Footer />
    </main>
  );
}
