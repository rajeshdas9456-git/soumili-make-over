'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, User } from 'lucide-react';
import { WebsiteSettings } from '@/types/database';
import { clientStore } from '@/lib/clientStore';

export default function AboutSection({ settings: initialSettings }: { settings: WebsiteSettings }) {
  const [settings, setSettings] = useState<WebsiteSettings>(initialSettings);

  useEffect(() => {
    try {
      const local = clientStore.getSettings();
      if (local && local.about_name) setSettings(local);
    } catch {}

    fetch('/api/settings')
      .then((res) => {
        if (!res.ok) throw new Error('API failed');
        return res.json();
      })
      .then((data) => {
        if (data && data.about_name) {
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
        if (updated && updated.about_name) setSettings(updated);
      } catch {}
    };

    window.addEventListener('soumili_data_updated', handleUpdate);
    return () => window.removeEventListener('soumili_data_updated', handleUpdate);
  }, []);

  return (
    <section className="py-24 bg-brandLightPink/40 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Portrait Image Column or Cool Pink Placeholder */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-gradient-to-br from-brandLightPink to-pink-100 flex items-center justify-center">
                {settings.about_image ? (
                  <img
                    src={settings.about_image}
                    alt="Soumili Makeup Artist"
                    className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  <div className="text-center p-8">
                    <div className="w-20 h-20 rounded-full bg-brandPink/15 border-2 border-brandPink/30 mx-auto flex items-center justify-center text-brandPink mb-3 shadow-pink-soft">
                      <Sparkles className="w-10 h-10 text-brandPink" />
                    </div>
                    <h3 className="font-serif text-2xl text-brandBlack font-semibold">Soumili</h3>
                    <p className="text-xs text-brandPink font-medium uppercase tracking-widest mt-1">Master Makeup Artist</p>
                    <p className="text-[11px] text-brandBlack/60 mt-1">Soumili's Makeover</p>
                  </div>
                )}
              </div>

              {/* Floating Pink Experience Box */}
              <div className="absolute -bottom-6 -right-6 sm:bottom-6 sm:-right-8 bg-brandBlack text-white p-6 rounded-2xl shadow-xl border border-brandPink/40 max-w-[210px]">
                <p className="font-serif text-3xl text-brandPink font-semibold">
                  {settings.about_experience_years}+
                </p>
                <p className="text-xs uppercase tracking-wider text-brandLightPink font-medium mt-1">
                  Years of Bridal Mastery
                </p>
                <p className="text-[10px] text-white/60 mt-0.5">
                  Soumili's Makeover
                </p>
              </div>
            </div>
          </div>

          {/* Text Content Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center space-x-2 text-brandPink font-semibold tracking-[0.25em] text-xs uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Meet The Master Artist</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-brandBlack font-normal leading-tight">
              {settings.about_name}
            </h2>

            <p className="font-accent text-xl text-brandPink italic">
              {settings.about_title} • Soumili's Makeover
            </p>

            <p className="text-sm sm:text-base text-brandBlack/75 font-light leading-relaxed">
              {settings.about_bio}
            </p>

            <div className="pt-4 border-t border-brandPink/20 grid grid-cols-2 sm:grid-cols-3 gap-6">
              <div>
                <p className="font-serif text-2xl text-brandBlack font-medium">
                  {(settings.about_brides_catered ?? 950)}+
                </p>
                <p className="text-[11px] text-brandBlack/60 uppercase tracking-wider mt-0.5">Total Brides Styled</p>
              </div>
              <div>
                <p className="font-serif text-2xl text-brandBlack font-medium">100%</p>
                <p className="text-[11px] text-brandBlack/60 uppercase tracking-wider mt-0.5">Waterproof Finish</p>
              </div>
              <div>
                <p className="font-serif text-2xl text-brandBlack font-medium">Global</p>
                <p className="text-[11px] text-brandBlack/60 uppercase tracking-wider mt-0.5">Pan-India & Abroad</p>
              </div>
            </div>

            <div className="pt-4">
              <Link
                href="/about"
                className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-brandPink hover:text-brandPink-700 transition-colors"
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
