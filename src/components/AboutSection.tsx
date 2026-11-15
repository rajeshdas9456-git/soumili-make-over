import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight } from 'lucide-react';
import { WebsiteSettings } from '@/types/database';

export default function AboutSection({ settings }: { settings: WebsiteSettings }) {
  return (
    <section className="py-24 bg-brandLightPink/40 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Portrait Image Column */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                <img
                  src={settings.about_image}
                  alt="Soumili Makeup Artist"
                  className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700"
                />
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

            <div className="h-[2px] w-24 bg-brandPink my-4" />

            <p className="text-brandBlack/80 leading-relaxed text-sm sm:text-base font-light">
              {settings.about_bio}
            </p>

            <p className="text-brandBlack/80 leading-relaxed text-sm sm:text-base font-light">
              Every bridal silhouette is unique. Soumili's artistry centers on enhancing raw natural radiance rather than masking individuality. Utilizing ultra-luxe international brands such as Charlotte Tilbury, Tom Ford, NARS, Dior Backstage, and Temptu Airbrush, she guarantees a flawless, transfer-proof finish that weathers tears of joy, humidity, and 4K ultra-zoom lenses with royal dignity.
            </p>

            {/* Specialties Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 text-xs font-medium text-brandBlack">
              <div className="flex items-center space-x-2.5">
                <span className="w-2 h-2 rounded-full bg-brandPink" />
                <span>Certified Temptu Airbrush Specialist</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <span className="w-2 h-2 rounded-full bg-brandPink" />
                <span>Bespoke 3D Dupatta & Saree Draping</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <span className="w-2 h-2 rounded-full bg-brandPink" />
                <span>Luxury Waterproof & Cry-Proof Formulas</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <span className="w-2 h-2 rounded-full bg-brandPink" />
                <span>Pan-India & Destination Weddings</span>
              </div>
            </div>

            <div className="pt-6">
              <Link
                href="/about"
                className="inline-flex items-center space-x-2 text-xs uppercase tracking-widest font-semibold text-brandBlack hover:text-brandPink border-b-2 border-brandBlack pb-1 hover:border-brandPink transition-all"
              >
                <span>Read Full Artistic Philosophy</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
