import React from 'react';
import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import PricingSection from '@/components/PricingSection';
import ContactBookingSection from '@/components/ContactBookingSection';
import { db } from '@/lib/db';
import { initialSettings, initialPackages, initialServices } from '@/lib/initialData';
import { Sparkles, ShieldCheck, HeartHandshake } from 'lucide-react';

export const metadata: Metadata = {
  title: "Bridal Makeup Packages & Pricing | Soumili's Makeover",
  description: "Live pricing and packages for royal bridal makeup, Temptu Airbrush, HD makeovers, and destination wedding packages by Soumili's Makeover.",
};

export const revalidate = 0;

export default async function PricingPage() {
  let settings = initialSettings;
  let packages = initialPackages.filter((p) => p.is_published);
  let services = initialServices;

  try {
    const [s, pk, sv] = await Promise.all([
      db.getSettingsAsync().catch(() => initialSettings),
      db.getPackagesAsync(true).catch(() => initialPackages),
      db.getServicesAsync().catch(() => initialServices)
    ]);
    if (s && s.brand_name) settings = s;
    if (Array.isArray(pk) && pk.length > 0) packages = pk;
    if (Array.isArray(sv) && sv.length > 0) services = sv;
  } catch { }

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
            <p className="text-xs sm:text-sm text-brandBlack/70 max-w-2xl mx-auto mt-2 font-light">
              We never compromise on luxury. Every bride receives couture standard attention and international product lines.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl border border-brandPink/20 shadow-sm flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-brandPink/15 text-brandPink flex items-center justify-center mb-4 border border-brandPink/30 shadow-sm">
                <Sparkles className="w-6 h-6" />
              </div>
              <h4 className="font-serif text-lg font-medium text-brandBlack mb-2">High-Definition Mastery</h4>
              <p className="text-xs text-brandBlack/75 font-light leading-relaxed">
                We use exclusively top-tier cosmetic brands like Charlotte Tilbury, MAC, Dior, NARS, and Huda Beauty for seamless 4K camera brilliance.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-brandPink/20 shadow-sm flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-brandPink/15 text-brandPink flex items-center justify-center mb-4 border border-brandPink/30 shadow-sm">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="font-serif text-lg font-medium text-brandBlack mb-2">Hygiene & Skin Prep</h4>
              <p className="text-xs text-brandBlack/75 font-light leading-relaxed">
                Medical-grade sanitized brush kits and hydrating luxury skin prep customized specifically for your skin profile.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-brandPink/20 shadow-sm flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-brandPink/15 text-brandPink flex items-center justify-center mb-4 border border-brandPink/30 shadow-sm">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h4 className="font-serif text-lg font-medium text-brandBlack mb-2">Couture Draping & Hair</h4>
              <p className="text-xs text-brandBlack/75 font-light leading-relaxed">
                Intricate bridal hairstyle, authentic floral or jewel placement, and heavy lehenga/saree draping tailored to your comfort.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Form */}
      <ContactBookingSection settings={settings} services={services} />

      <WhatsAppButton phone={settings.contact_whatsapp || '+919876543210'} />
      <Footer settings={settings} />
    </main>
  );
}
