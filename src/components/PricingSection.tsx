'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Check, Sparkles, Clock, ArrowRight } from 'lucide-react';
import { PricingPackage } from '@/types/database';
import { clientStore } from '@/lib/clientStore';

export default function PricingSection({ packages: initialPackages }: { packages: PricingPackage[] }) {
  const [packages, setPackages] = useState<PricingPackage[]>(initialPackages || []);

  useEffect(() => {
    // 1. Immediately hydrate with locally saved packages if available
    try {
      const local = clientStore.getPackages(true);
      if (local && Array.isArray(local) && local.length > 0) {
        setPackages(local);
      }
    } catch (e) {
      // LocalStorage access fallback
    }

    // 2. Fetch fresh published packages from server API
    fetch('/api/packages')
      .then((res) => {
        if (!res.ok) throw new Error('API request failed');
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setPackages(data);
          try {
            clientStore.savePackages(data);
          } catch {}
        }
      })
      .catch(() => {});

    // 3. Listen for cross-tab and in-tab live updates from the admin dashboard
    const handleUpdate = () => {
      try {
        const updated = clientStore.getPackages(true);
        if (updated && Array.isArray(updated) && updated.length > 0) {
          setPackages(updated);
        }
      } catch {}
    };

    window.addEventListener('soumili_data_updated', handleUpdate);
    return () => window.removeEventListener('soumili_data_updated', handleUpdate);
  }, []);

  return (
    <section className="py-24 bg-brandLightPink/30 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-brandPink font-semibold tracking-[0.25em] text-xs uppercase mb-3">
            Investment in Flawless Beauty
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-brandBlack font-normal mb-4">
            Bridal & Event Packages
          </h2>
          <p className="text-brandBlack/70 text-sm sm:text-base font-light">
            All pricing includes premium international skincare, waterproof lash application, coiffure styling, and drapery by Soumili's Makeover.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className={`relative rounded-3xl transition-all duration-300 flex flex-col justify-between overflow-hidden ${
                pkg.is_featured
                  ? 'bg-white shadow-2xl border-2 border-brandPink transform lg:-translate-y-2'
                  : 'bg-white border border-brandPink/20 hover:shadow-xl hover:border-brandPink/50'
              }`}
            >
              {/* Featured Ribbon */}
              {pkg.is_featured && (
                <div className="absolute top-0 right-0 z-10">
                  <div className="bg-brandPink text-white text-[10px] uppercase font-bold tracking-widest px-4 py-1.5 rounded-bl-xl shadow-md flex items-center space-x-1">
                    <Sparkles className="w-3 h-3" />
                    <span>Most Coveted</span>
                  </div>
                </div>
              )}

              {/* Package Header with Image Preview */}
              <div>
                <div className="relative h-44 w-full overflow-hidden">
                  <img
                    src={pkg.image_url}
                    alt={pkg.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brandBlack/80 via-brandBlack/30 to-transparent" />
                  <div className="absolute bottom-4 left-6 right-6">
                    <span className="text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full bg-brandPink text-white">
                      {pkg.category}
                    </span>
                    <h3 className="font-serif text-xl text-white font-medium mt-1">
                      {pkg.name}
                    </h3>
                  </div>
                </div>

                {/* Pricing & Duration */}
                <div className="p-6 pb-2">
                  <div className="flex items-baseline space-x-1 mb-2">
                    <span className="font-serif text-3xl sm:text-4xl font-semibold text-brandBlack">
                      ₹{Number(pkg.price).toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs text-brandBlack/60 uppercase tracking-wider">
                      / Event
                    </span>
                  </div>

                  <div className="flex items-center text-xs text-brandPink font-medium mb-4">
                    <Clock className="w-3.5 h-3.5 mr-1 text-brandPink" />
                    <span>Session: {pkg.duration}</span>
                  </div>

                  <p className="text-xs text-brandBlack/70 leading-relaxed mb-6">
                    {pkg.description}
                  </p>

                  <div className="h-[1px] bg-brandPink/20 mb-6" />

                  {/* Included Features */}
                  <h4 className="text-[11px] uppercase tracking-wider font-semibold text-brandBlack mb-3">
                    Package Inclusions:
                  </h4>
                  <ul className="space-y-2.5 text-xs text-brandBlack/85 mb-8">
                    {pkg.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <Check className="w-4 h-4 text-brandPink shrink-0 mr-2 mt-0.5" />
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
                  className={`w-full py-3.5 rounded-full text-xs font-semibold uppercase tracking-widest transition-all flex items-center justify-center space-x-2 ${
                    pkg.is_featured
                      ? 'bg-brandPink hover:bg-brandPink-600 text-white shadow-pink-soft hover:shadow-pink-glow'
                      : 'bg-brandLightPink hover:bg-brandPink hover:text-white text-brandBlack border border-brandPink/30'
                  }`}
                >
                  <span>Reserve Package</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

            </div>
          ))}
        </div>

        {/* Custom Requirements Note */}
        <div className="mt-16 bg-white rounded-3xl p-8 border border-brandPink/30 text-center max-w-3xl mx-auto shadow-pink-soft">
          <h3 className="font-serif text-xl text-brandBlack mb-2">
            Planning a Multi-Day Destination Wedding?
          </h3>
          <p className="text-xs sm:text-sm text-brandBlack/70 leading-relaxed mb-6">
            Soumili's Makeover provides bespoke all-inclusive bridal entourage packages for destination weddings across Rajasthan, Goa, UAE, and Europe, covering Haldi, Mehendi, Sangeet, Pheras, and Reception.
          </p>
          <Link
            href="/contact#book"
            className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-brandPink hover:text-brandPink-700"
          >
            <span>Request Bespoke Destination Proposal &rarr;</span>
          </Link>
        </div>

      </div>
    </section>
  );
}
