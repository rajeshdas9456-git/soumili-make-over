import React from 'react';
import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { db } from '@/lib/db';
import { Sparkles, Award, Heart, CheckCircle2, Star, Calendar } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: "About Soumili | Master Bridal Stylist | Soumili's Makeover",
  description: "Discover the luxury bridal artistry, philosophy, and heritage of Soumili, founder of Soumili's Makeover. Beauty • Elegance • Perfection.",
};

export const revalidate = 0;

export default async function AboutPage() {
  const settings = db.getSettings();

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* Header Banner */}
      <section className="pt-36 pb-20 bg-brandBlack text-white relative overflow-hidden">
        {settings.about_image && (
          <div className="absolute inset-0 opacity-20">
            <img
              src={settings.about_image}
              alt="Soumili's Makeover"
              className="w-full h-full object-cover filter blur-sm"
            />
          </div>
        )}
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <span className="text-xs uppercase tracking-[0.3em] text-brandPink font-semibold mb-3 inline-block">
            Beauty • Elegance • Perfection
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl text-white font-normal">
            About Soumili's Makeover
          </h1>
          <p className="font-accent text-xl sm:text-2xl text-brandLightPink italic mt-3 max-w-2xl mx-auto">
            {settings.about_title}
          </p>
        </div>
      </section>

      {/* Philosophy & Story */}
      <section className="py-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          <div className="lg:col-span-5 relative">
            <div className="aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl border-4 border-brandLightPink bg-gradient-to-br from-brandLightPink to-pink-100 flex items-center justify-center">
              {settings.about_image ? (
                <img
                  src={settings.about_image}
                  alt={settings.about_name}
                  className="w-full h-full object-cover object-top"
                />
              ) : (
                <div className="text-center p-8">
                  <div className="w-20 h-20 rounded-full bg-brandPink/15 border border-brandPink/30 mx-auto flex items-center justify-center text-brandPink mb-3 shadow-sm">
                    <Sparkles className="w-10 h-10 text-brandPink" />
                  </div>
                  <h3 className="font-serif text-2xl text-brandBlack font-semibold">{settings.about_name}</h3>
                  <p className="text-xs text-brandPink font-medium uppercase tracking-widest mt-1">Master Makeup Artist</p>
                </div>
              )}
            </div>
            <div className="mt-6 bg-brandBlack text-white p-6 rounded-2xl border border-brandPink/30 shadow-pink-soft text-center">
              <p className="font-serif text-3xl text-brandPink font-bold">
                {settings.about_brides_catered}+
              </p>
              <p className="text-xs text-brandLightPink uppercase tracking-widest font-semibold mt-1">
                Happy Brides Across India & Abroad
              </p>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center space-x-2 text-brandPink font-semibold tracking-widest text-xs uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>The Soumili's Makeover Ethos</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl text-brandBlack font-normal leading-tight">
              "Every bride carries an innate royalty. My art exists to unveil it with grace and timeless sophistication."
            </h2>

            <p className="text-brandBlack/80 leading-relaxed text-sm sm:text-base font-light">
              {settings.about_bio}
            </p>

            <p className="text-brandBlack/80 leading-relaxed text-sm sm:text-base font-light">
              At Soumili's Makeover, bridal styling is a harmonious blend of traditional Indian heritage and modern high-fashion aesthetics. Having crafted looks for destination weddings in Udaipur, Mumbai, Goa, and Europe, Soumili brings calm expertise and luxury to your wedding morning.
            </p>

            {/* Core Values */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="p-5 bg-brandLightPink/40 rounded-2xl border border-brandPink/20">
                <h4 className="font-serif text-base text-brandBlack font-medium mb-1 flex items-center space-x-2">
                  <Award className="w-4 h-4 text-brandPink" />
                  <span>Hospital-Grade Hygiene</span>
                </h4>
                <p className="text-xs text-brandBlack/70">
                  Every brush, sponge, and palette undergoes ultrasonic sterilization for absolute bridal peace of mind.
                </p>
              </div>

              <div className="p-5 bg-brandLightPink/40 rounded-2xl border border-brandPink/20">
                <h4 className="font-serif text-base text-brandBlack font-medium mb-1 flex items-center space-x-2">
                  <Heart className="w-4 h-4 text-brandPink" />
                  <span>Bespoke Customization</span>
                </h4>
                <p className="text-xs text-brandBlack/70">
                  No cookie-cutter templates. Every look is calibrated to your facial contours, undertone, and heirloom jewellery.
                </p>
              </div>
            </div>

            <div className="pt-6">
              <Link
                href="/contact#book"
                className="inline-flex items-center space-x-3 bg-brandPink hover:bg-brandPink-600 text-white px-8 py-4 rounded-full text-xs font-semibold tracking-widest uppercase shadow-pink-soft transition-all"
              >
                <Calendar className="w-4 h-4" />
                <span>Reserve Consultation with Soumili</span>
              </Link>
            </div>

          </div>

        </div>
      </section>

      <WhatsAppButton phone={settings.contact_whatsapp} />
      <Footer />
    </main>
  );
}
