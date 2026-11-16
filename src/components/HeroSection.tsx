'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { WebsiteSettings } from '@/types/database';

export default function HeroSection({ settings: initialSettings }: { settings: WebsiteSettings }) {
  const [settings, setSettings] = useState<WebsiteSettings>(initialSettings);

  useEffect(() => {
    if (initialSettings) {
      setSettings(initialSettings);
    }

    // Fetch live settings from database
    fetch('/api/settings')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.brand_name) {
          setSettings(data);
        }
      })
      .catch(() => { });

    // Listen for live updates from admin dashboard
    const handleUpdate = () => {
      fetch('/api/settings')
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data && data.brand_name) {
            setSettings(data);
          }
        })
        .catch(() => { });
    };

    window.addEventListener('soumili_data_updated', handleUpdate);
    return () => {
      window.removeEventListener('soumili_data_updated', handleUpdate);
    };
  }, [initialSettings]);

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden bg-[#151515] pt-24 pb-16">
      {/* Background Hero Image or Luxury Ambient Overlay */}
      <div className="absolute inset-0 z-0">
        {settings.hero_image ? (
          <>
            <img
              src={settings.hero_image}
              alt="Soumili's Makeover Bridal"
              className="w-full h-full object-cover object-center filter brightness-[0.72] scale-105 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#151515] via-[#151515]/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#151515]/85 via-transparent to-[#151515]/50" />
          </>
        ) : (
          /* High-end Luxury Ambient Atmosphere */
          <div className="w-full h-full bg-gradient-to-br from-[#151515] via-[#1E0B16] to-[#2B0A1E] relative">
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-[#E83B79]/15 rounded-full blur-[150px] pointer-events-none" />
            <div className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-[#E83B79]/10 rounded-full blur-[130px] pointer-events-none" />
          </div>
        )}
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white py-16">

        {/* Subtle Luxury Badge */}
        <div className="inline-flex items-center space-x-2 bg-black/50 backdrop-blur-md border border-[#E83B79]/40 px-5 py-2 rounded-full mb-8 shadow-pink-soft">
          <Sparkles className="w-3.5 h-3.5 text-[#E83B79]" />
          <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#FCEAF1]">
            Soumili's Makeover • Beauty • Elegance • Perfection
          </span>
        </div>

        {/* Main Headline */}
        <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.12] font-normal tracking-tight text-white max-w-4xl mx-auto mb-6 drop-shadow-md">
          {settings.hero_title || "Transforming Your Special Day Into An Eternal Masterpiece"}
        </h1>

        {/* Subtitle */}
        <p className="font-sans text-sm sm:text-base md:text-lg text-[#FCEAF1]/90 font-light max-w-2xl mx-auto mb-10 leading-relaxed">
          {settings.hero_subtitle || "Luxury bridal makeup, bespoke styling, and international HD & Airbrush expertise crafted exclusively for the modern bride by Soumili."}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/contact#book"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-3 bg-[#E83B79] hover:bg-[#D42666] text-white px-8 py-4 rounded-full text-xs font-semibold tracking-widest uppercase shadow-pink-soft hover:shadow-pink-glow transition-all transform hover:-translate-y-0.5 cursor-pointer"
          >
            <span>Book Bridal Consultation</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/gallery"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-black/60 hover:bg-black border border-[#E83B79]/40 hover:border-[#E83B79] text-white px-8 py-4 rounded-full text-xs font-semibold tracking-widest uppercase backdrop-blur-sm transition-all cursor-pointer"
          >
            <span>Explore Bridal Gallery</span>
          </Link>
        </div>

        {/* Quick Highlights Bar */}
        <div className="mt-16 pt-8 border-t border-[#E83B79]/20 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          <div className="text-center">
            <p className="font-serif text-2xl sm:text-3xl text-[#E83B79] font-bold">
              {(settings.about_experience_years ?? 12)}+
            </p>
            <p className="text-[11px] uppercase tracking-wider text-[#FCEAF1]/80 mt-1">Years of Mastery</p>
          </div>
          <div className="text-center">
            <p className="font-serif text-2xl sm:text-3xl text-[#E83B79] font-bold">
              {(settings.about_brides_catered ?? 950)}+
            </p>
            <p className="text-[11px] uppercase tracking-wider text-[#FCEAF1]/80 mt-1">Real Royal Brides</p>
          </div>
          <div className="text-center">
            <p className="font-serif text-2xl sm:text-3xl text-[#E83B79] font-bold">100%</p>
            <p className="text-[11px] uppercase tracking-wider text-[#FCEAF1]/80 mt-1">HD & Airbrush</p>
          </div>
          <div className="text-center">
            <p className="font-serif text-2xl sm:text-3xl text-[#E83B79] font-bold">Global</p>
            <p className="text-[11px] uppercase tracking-wider text-[#FCEAF1]/80 mt-1">Destination Artist</p>
          </div>
        </div>

      </div>

      {/* Decorative Bottom Fade */}
      <div className="absolute bottom-0 inset-x-0 h-10 bg-gradient-to-t from-white to-transparent z-10" />
    </section>
  );
}
