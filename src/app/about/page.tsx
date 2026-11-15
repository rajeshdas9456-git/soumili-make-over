import React from 'react';
import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { db } from '@/lib/db';
import { initialSettings } from '@/lib/initialData';
import { Sparkles, Award, Heart, CheckCircle2, Star, Calendar } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: "About Soumili | Master Bridal Stylist | Soumili's Makeover",
  description: "Discover the luxury bridal artistry, philosophy, and heritage of Soumili, founder of Soumili's Makeover. Beauty • Elegance • Perfection.",
};

export const revalidate = 0;

export default async function AboutPage() {
  let settings = initialSettings;

  try {
    const s = await db.getSettingsAsync();
    if (s && s.brand_name) settings = s;
  } catch {}

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
            <div className="relative mx-auto max-w-md aspect-[3/4] rounded-3xl overflow-hidden bg-brandLightPink shadow-2xl border-4 border-brandLightPink ring-1 ring-brandPink/30">
              {settings.about_image ? (
                <img
                  src={settings.about_image}
                  alt={settings.about_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-brandLightPink via-white to-pink-100 flex flex-col items-center justify-center p-8 text-center">
                  <div className="w-20 h-20 rounded-full bg-brandPink/15 border border-brandPink/40 flex items-center justify-center text-brandPink mb-4 shadow-sm">
                    <Sparkles className="w-10 h-10 text-brandPink" />
                  </div>
                  <h3 className="font-serif text-2xl font-normal text-brandBlack">{settings.about_name}</h3>
                  <p className="text-xs text-brandPink uppercase tracking-widest font-semibold mt-1">
                    Master Bridal Artist
                  </p>
                </div>
              )}
            </div>

            <div className="absolute -bottom-6 -right-4 sm:right-4 bg-brandBlack text-white p-6 rounded-2xl shadow-xl border border-brandPink/30 max-w-[220px]">
              <div className="flex items-center space-x-2 text-brandPink mb-1">
                <Award className="w-5 h-5 text-brandPink" />
                <span className="text-xs uppercase font-bold tracking-wider">Couture Icon</span>
              </div>
              <p className="text-xs text-brandLightPink/80 font-light">
                {settings.about_experience_years}+ Years of Bridal Excellence & {settings.about_brides_catered}+ brides styled
              </p>
            </div>
          </div>

          <div className="lg:col-span-7">
            <span className="text-xs uppercase tracking-[0.25em] text-brandPink font-semibold mb-2 block">
              Meet The Artist
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl text-brandBlack font-normal mb-6 leading-tight">
              Crafting Timeless Radiance for Every Bride
            </h2>

            <p className="text-brandBlack/80 text-sm sm:text-base leading-relaxed mb-6 font-light">
              {settings.about_bio}
            </p>

            <div className="grid grid-cols-2 gap-6 my-8 py-6 border-y border-brandPink/20">
              <div>
                <span className="font-serif text-3xl sm:text-4xl text-brandPink font-normal block mb-1">
                  {settings.about_experience_years}+
                </span>
                <span className="text-xs uppercase tracking-wider text-brandBlack/70 font-medium">
                  Years Experience
                </span>
              </div>
              <div>
                <span className="font-serif text-3xl sm:text-4xl text-brandPink font-normal block mb-1">
                  {settings.about_brides_catered}+
                </span>
                <span className="text-xs uppercase tracking-wider text-brandBlack/70 font-medium">
                  Royal Brides Styled
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center space-x-2 bg-brandPink hover:bg-brandPink-600 text-white px-8 py-4 rounded-full text-xs font-semibold tracking-widest uppercase transition-all shadow-pink-soft hover:shadow-pink-glow"
              >
                <Calendar className="w-4 h-4" />
                <span>Reserve Consultation</span>
              </Link>
              <Link
                href="/gallery"
                className="inline-flex items-center space-x-2 bg-brandLightPink hover:bg-brandPink hover:text-white text-brandBlack px-8 py-4 rounded-full text-xs font-semibold tracking-widest uppercase transition-all border border-brandPink/25"
              >
                <span>View Portfolio</span>
              </Link>
            </div>
          </div>

        </div>
      </section>

      <WhatsAppButton phone={settings.contact_whatsapp || '+919876543210'} />
      <Footer />
    </main>
  );
}
