'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { WebsiteSettings } from '@/types/database';
import { clientStore } from '@/lib/clientStore';

export default function HeroSection({ settings: initialSettings }: { settings: WebsiteSettings }) {
  const [settings, setSettings] = useState<WebsiteSettings>(initialSettings);

  useEffect(() => {
    try {
      const local = clientStore.getSettings();
      if (local && local.brand_name) setSettings(local);
    } catch {}

    fetch('/api/settings')
      .then((res) => {
        if (!res.ok) throw new Error('API failed');
        return res.json();
      })
      .then((data) => {
        if (data && data.brand_name) {
          setSettings(data);
          try {
            clientStore.saveSettings(data);
          } catch {}
        }
      })
      .catch(() => {});

    const handleUpdate = () => {
      try {
        const updated = clientStore.getSettings();
        if (updated && updated.brand_name) setSettings(updated);
      } catch {}
    };

    window.addEventListener('soumili_data_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('soumili_data_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden bg-brandBlack pt-20">
      {/* Background Hero Image or Cool Pink Ambient Overlay */}
      <div className="absolute inset-0 z-0">
        {settings.hero_image ? (
          <>
            <img
              src={settings.hero_image}
              alt="Soumili's Makeover Bridal"
              className="w-full h-full object-cover object-center filter brightness-[0.78] scale-105 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brandBlack via-brandBlack/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-brandBlack/80 via-transparent to-brandBlack/40" />
          </>
        ) : (
          /* Cool Luxury Pink Ambient Atmosphere when photo is not yet uploaded */
          <div className="w-full h-full bg-gradient-to-br from-[#111111] via-[#1D0914] to-[#2E0B1F] relative">
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brandPink/15 rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-brandPink/10 rounded-full blur-[120px] pointer-events-none" />
          </div>
        )}
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white py-24">
        
        {/* Subtle Brand Badge */}
        <div className="inline-flex items-center space-x-2 bg-brandBlack/60 backdrop-blur-md border border-brandPink/40 px-5 py-2 rounded-full mb-8 shadow-pink-soft">
          <Sparkles className="w-3.5 h-3.5 text-brandPink" />
          <span className="text-xs uppercase tracking-[0.25em] font-semibold text-brandLightPink">
            Soumili's Makeover • Beauty • Elegance • Perfection
          </span>
        </div>

        {/* Main Headline */}
        <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.15] font-normal tracking-tight text-white max-w-4xl mx-auto mb-6 drop-shadow-md">
          {settings.hero_title}
        </h1>

        {/* Tagline / Subtitle */}
        <p className="font-sans text-sm sm:text-base md:text-lg text-brandLightPink/90 font-light max-w-2xl mx-auto mb-10 leading-relaxed">
          {settings.hero_subtitle}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/contact#book"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-3 bg-brandPink hover:bg-brandPink-600 text-white px-8 py-4 rounded-full text-xs font-semibold tracking-widest uppercase shadow-pink-soft hover:shadow-pink-glow transition-all transform hover:-translate-y-0.5"
          >
            <span>Book Appointment</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/gallery"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-brandBlack/60 hover:bg-brandBlack border border-brandPink/40 hover:border-brandPink text-white px-8 py-4 rounded-full text-xs font-semibold tracking-widest uppercase backdrop-blur-sm transition-all"
          >
            <span>Explore Bridal Gallery</span>
          </Link>
        </div>

        {/* Quick Highlights Bar */}
        <div className="mt-16 pt-8 border-t border-brandPink/20 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          <div className="text-center">
            <p className="font-serif text-2xl sm:text-3xl text-brandPink font-bold">12+</p>
            <p className="text-[11px] uppercase tracking-wider text-brandLightPink/80 mt-1">Years of Mastery</p>
          </div>
          <div className="text-center">
            <p className="font-serif text-2xl sm:text-3xl text-brandPink font-bold">950+</p>
            <p className="text-[11px] uppercase tracking-wider text-brandLightPink/80 mt-1">Real Royal Brides</p>
          </div>
          <div className="text-center">
            <p className="font-serif text-2xl sm:text-3xl text-brandPink font-bold">100%</p>
            <p className="text-[11px] uppercase tracking-wider text-brandLightPink/80 mt-1">HD & Airbrush</p>
          </div>
          <div className="text-center">
            <p className="font-serif text-2xl sm:text-3xl text-brandPink font-bold">Global</p>
            <p className="text-[11px] uppercase tracking-wider text-brandLightPink/80 mt-1">Destination Artist</p>
          </div>
        </div>

      </div>

      {/* Decorative Bottom Wave */}
      <div className="absolute bottom-0 inset-x-0 h-10 bg-gradient-to-t from-white to-transparent z-10" />
    </section>
  );
}
