'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, Award, Heart, CheckCircle2 } from 'lucide-react';
import { WebsiteSettings } from '@/types/database';

export default function AboutSection({ settings: initialSettings }: { settings: WebsiteSettings }) {
  const [settings, setSettings] = useState<WebsiteSettings>(initialSettings);

  useEffect(() => {
    if (initialSettings) setSettings(initialSettings);

    fetch('/api/settings')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.brand_name) {
          setSettings(data);
        }
      })
      .catch(() => {});

    const handleUpdate = () => {
      fetch('/api/settings')
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data && data.brand_name) {
            setSettings(data);
          }
        })
        .catch(() => {});
    };

    window.addEventListener('soumili_data_updated', handleUpdate);
    return () => {
      window.removeEventListener('soumili_data_updated', handleUpdate);
    };
  }, [initialSettings]);

  return (
    <section className="py-24 bg-[#FCEAF1]/35 relative overflow-hidden" id="about">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Portrait Image Column */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-gradient-to-br from-[#FCEAF1] to-pink-100 flex items-center justify-center">
                {settings.about_image ? (
                  <img
                    src={settings.about_image}
                    alt="Soumili Makeup Artist"
                    className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  <div className="text-center p-8">
                    <div className="w-20 h-20 rounded-full bg-[#E83B79]/15 border-2 border-[#E83B79]/30 mx-auto flex items-center justify-center text-[#E83B79] mb-3 shadow-pink-soft">
                      <Sparkles className="w-10 h-10 text-[#E83B79]" />
                    </div>
                    <h3 className="font-serif text-2xl text-[#151515] font-semibold">Soumili</h3>
                    <p className="text-xs text-[#E83B79] font-medium uppercase tracking-widest mt-1">Master Makeup Artist</p>
                    <p className="text-[11px] text-[#777777] mt-1">Soumili's Makeover</p>
                  </div>
                )}
              </div>

              {/* Floating Luxury Experience Box */}
              <div className="absolute -bottom-6 -right-6 sm:bottom-6 sm:-right-8 bg-[#151515] text-white p-6 rounded-2xl shadow-xl border border-[#E83B79]/40 max-w-[220px]">
                <p className="font-serif text-3xl text-[#E83B79] font-semibold">
                  {(settings.about_experience_years ?? 12)}+
                </p>
                <p className="text-xs uppercase tracking-wider text-[#FCEAF1] font-medium mt-1">
                  Years of Bridal Mastery
                </p>
                <p className="text-[10px] text-white/60 mt-0.5">
                  Soumili's Makeover Studio
                </p>
              </div>
            </div>
          </div>

          {/* Text Content Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center space-x-2 text-[#E83B79] font-semibold tracking-[0.25em] text-xs uppercase bg-[#FCEAF1] px-4 py-1.5 rounded-full border border-[#E83B79]/30">
              <Sparkles className="w-3.5 h-3.5 text-[#E83B79]" />
              <span>Meet The Master Artist</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#151515] font-normal leading-tight">
              {settings.about_name || "Soumili"}
            </h2>

            <p className="font-serif text-lg text-[#E83B79] italic">
              {settings.about_title || "Celebrity Bridal Stylist & Master Makeup Artist"}
            </p>

            <p className="text-sm sm:text-base text-[#333333]/80 font-light leading-relaxed">
              {settings.about_bio || "With over a decade of luxury bridal mastery across India and destination weddings, Soumili crafts unforgettable bridal experiences combining bespoke skincare, international cosmetics, and flawless couture styling."}
            </p>

            {/* Signature Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-center space-x-2.5 text-xs text-[#333333] font-medium">
                <CheckCircle2 className="w-4 h-4 text-[#E83B79] shrink-0" />
                <span>Bespoke Pre-Bridal Skincare Preparation</span>
              </div>
              <div className="flex items-center space-x-2.5 text-xs text-[#333333] font-medium">
                <CheckCircle2 className="w-4 h-4 text-[#E83B79] shrink-0" />
                <span>Ultra HD & Temptu Airbrush Precision</span>
              </div>
              <div className="flex items-center space-x-2.5 text-xs text-[#333333] font-medium">
                <CheckCircle2 className="w-4 h-4 text-[#E83B79] shrink-0" />
                <span>Long-Wear Tearproof & Sweatproof Base</span>
              </div>
              <div className="flex items-center space-x-2.5 text-xs text-[#333333] font-medium">
                <CheckCircle2 className="w-4 h-4 text-[#E83B79] shrink-0" />
                <span>Hairstyling, Saree & Dupatta Drapery</span>
              </div>
            </div>

            {/* Metrics */}
            <div className="pt-6 border-t border-[#E83B79]/20 grid grid-cols-2 sm:grid-cols-3 gap-6">
              <div>
                <p className="font-serif text-3xl text-[#151515] font-semibold">
                  {(settings.about_brides_catered ?? 950)}+
                </p>
                <p className="text-[11px] text-[#777777] uppercase tracking-wider mt-0.5 font-medium">Total Brides Styled</p>
              </div>
              <div>
                <p className="font-serif text-3xl text-[#151515] font-semibold">100%</p>
                <p className="text-[11px] text-[#777777] uppercase tracking-wider mt-0.5 font-medium">Client Satisfaction</p>
              </div>
              <div>
                <p className="font-serif text-3xl text-[#151515] font-semibold">Global</p>
                <p className="text-[11px] text-[#777777] uppercase tracking-wider mt-0.5 font-medium">Destination Weddings</p>
              </div>
            </div>

            <div className="pt-4 flex items-center space-x-4">
              <Link
                href="/about"
                className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-[#E83B79] hover:text-[#D42666] transition-colors"
              >
                <span>Read Full Biography & Journey</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
