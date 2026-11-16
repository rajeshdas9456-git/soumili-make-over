'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Check, Sparkles, Clock, ArrowRight } from 'lucide-react';
import { PricingPackage } from '@/types/database';

export default function PricingSection({ packages: initialPackages }: { packages: PricingPackage[] }) {
  const [packages, setPackages] = useState<PricingPackage[]>(initialPackages || []);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  useEffect(() => {
    if (initialPackages && initialPackages.length > 0) {
      setPackages(initialPackages);
    }

    // Fetch latest live packages from database
    fetch('/api/packages')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setPackages(data);
        }
      })
      .catch(() => { });

    // Listen for live database updates triggered by Admin
    const handleUpdate = () => {
      fetch('/api/packages')
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) {
            setPackages(data);
          }
        })
        .catch(() => { });
    };

    window.addEventListener('soumili_data_updated', handleUpdate);
    return () => {
      window.removeEventListener('soumili_data_updated', handleUpdate);
    };
  }, [initialPackages]);

  const categories = ['all', 'Bridal', 'Engagement', 'Reception', 'Party'];

  const filteredPackages = activeCategory === 'all'
    ? packages
    : packages.filter(p => p.category?.toLowerCase() === activeCategory.toLowerCase());

  return (
    <section className="py-24 bg-gradient-to-b from-[#FCEAF1]/50 via-white to-[#FCEAF1]/30 relative" id="pricing">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-2 bg-[#FCEAF1] border border-[#E83B79]/30 px-4 py-1.5 rounded-full mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#E83B79]" />
            <span className="text-[#E83B79] font-semibold tracking-[0.25em] text-[11px] uppercase">
              Beauty • Elegance • Perfection
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#151515] font-normal mb-4">
            Bridal Makeup Packages & Pricing
          </h2>
          <p className="text-[#777777] text-sm sm:text-base font-light leading-relaxed">
            Transparent investment for your once-in-a-lifetime celebrations. Every package is personally crafted with high-definition artistry, luxury skin prep, and couture styling by Soumili.
          </p>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition-all cursor-pointer ${activeCategory === cat
                  ? 'bg-[#E83B79] text-white shadow-pink-soft'
                  : 'bg-white text-[#333333] border border-[#E83B79]/20 hover:border-[#E83B79] hover:text-[#E83B79]'
                  }`}
              >
                {cat === 'all' ? 'All Packages' : `${cat} Makeup`}
              </button>
            ))}
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPackages.map((pkg) => (
            <div
              key={pkg.id}
              className={`relative rounded-3xl transition-all duration-300 flex flex-col justify-between overflow-hidden ${pkg.is_featured
                ? 'bg-white shadow-2xl border-2 border-[#E83B79] transform lg:-translate-y-2 ring-4 ring-[#E83B79]/10'
                : 'bg-white border border-[#E83B79]/20 hover:shadow-xl hover:border-[#E83B79]/60'
                }`}
            >
              {/* Featured Ribbon */}
              {pkg.is_featured && (
                <div className="absolute top-0 right-0 z-10">
                  <div className="bg-[#E83B79] text-white text-[10px] uppercase font-bold tracking-widest px-4 py-1.5 rounded-bl-xl shadow-md flex items-center space-x-1">
                    <Sparkles className="w-3 h-3" />
                    <span>Signature Choice</span>
                  </div>
                </div>
              )}

              {/* Package Header with Image or Soft Pink Placeholder */}
              <div>
                <div className="relative h-48 w-full overflow-hidden bg-[#FCEAF1]">
                  {pkg.image_url ? (
                    <>
                      <img
                        src={pkg.image_url}
                        alt={pkg.name}
                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#151515]/85 via-[#151515]/30 to-transparent" />
                    </>
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#FCEAF1] via-white to-pink-100 flex flex-col items-center justify-center p-4 border-b border-[#E83B79]/20 text-center">
                      <div className="w-12 h-12 rounded-full bg-[#E83B79]/15 border border-[#E83B79]/30 flex items-center justify-center text-[#E83B79] mb-2 shadow-sm">
                        <Sparkles className="w-6 h-6 text-[#E83B79]" />
                      </div>
                      <span className="font-serif text-base font-semibold text-[#151515]">Soumili's Makeover</span>
                      <span className="text-[10px] text-[#E83B79] uppercase tracking-widest font-semibold mt-0.5">Bespoke Bridal Package</span>
                    </div>
                  )}

                  <div className="absolute bottom-4 left-6 right-6">
                    <span className="text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full bg-[#E83B79] text-white shadow-sm inline-block">
                      {pkg.category}
                    </span>
                    <h3 className={`font-serif text-xl font-medium mt-1 drop-shadow-sm ${pkg.image_url ? 'text-white' : 'text-[#151515]'}`}>
                      {pkg.name}
                    </h3>
                  </div>
                </div>

                {/* Pricing & Duration */}
                <div className="p-6 pb-2">
                  <div className="flex items-baseline space-x-1 mb-2">
                    <span className="font-serif text-3xl sm:text-4xl font-semibold text-[#151515]">
                      ₹{Number(pkg.price).toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs text-[#777777] uppercase tracking-wider">
                      / Event
                    </span>
                  </div>

                  <div className="flex items-center text-xs text-[#E83B79] font-semibold mb-4">
                    <Clock className="w-3.5 h-3.5 mr-1 text-[#E83B79]" />
                    <span>Duration: {pkg.duration}</span>
                  </div>

                  <p className="text-xs text-[#777777] leading-relaxed mb-6 font-light">
                    {pkg.description}
                  </p>

                  <div className="h-[1px] bg-[#E83B79]/15 mb-6" />

                  {/* Included Features */}
                  <h4 className="text-[11px] uppercase tracking-wider font-semibold text-[#151515] mb-3">
                    Package Inclusions:
                  </h4>
                  <ul className="space-y-2.5 text-xs text-[#333333] mb-8 font-light">
                    {pkg.features && pkg.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <Check className="w-4 h-4 text-[#E83B79] shrink-0 mr-2 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Book Now Button */}
              <div className="p-6 pt-0">
                <Link
                  href={`/contact?package=${encodeURIComponent(pkg.name)}#book`}
                  className={`w-full py-3.5 rounded-full text-xs font-semibold uppercase tracking-widest transition-all flex items-center justify-center space-x-2 ${pkg.is_featured
                    ? 'bg-[#E83B79] hover:bg-[#D42666] text-white shadow-pink-soft'
                    : 'bg-[#FCEAF1] hover:bg-[#E83B79] hover:text-white text-[#151515] border border-[#E83B79]/30'
                    }`}
                >
                  <span>Book This Package</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

            </div>
          ))}
        </div>

        {/* Custom Requirements Note */}
        <div className="mt-16 bg-white rounded-3xl p-8 border border-[#E83B79]/20 text-center max-w-3xl mx-auto shadow-pink-soft">
          <h3 className="font-serif text-xl text-[#151515] mb-2 font-medium">
            Planning a Destination or Multi-Day Wedding?
          </h3>
          <p className="text-xs sm:text-sm text-[#777777] leading-relaxed mb-6 font-light">
            Soumili's Makeover provides bespoke all-inclusive bridal entourage packages for destination weddings across India and worldwide, covering Mehendi, Haldi, Sangeet, Pheras, and Reception.
          </p>
          <Link
            href="/contact#book"
            className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-[#E83B79] hover:text-[#D42666]"
          >
            <span>Request Custom Destination Proposal &rarr;</span>
          </Link>
        </div>

      </div>
    </section>
  );
}
