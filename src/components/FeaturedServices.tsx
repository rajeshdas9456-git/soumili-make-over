'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import { ServiceItem } from '@/types/database';
import { clientStore } from '@/lib/clientStore';

export default function FeaturedServices({ services: initialServices }: { services: ServiceItem[] }) {
  const [services, setServices] = useState<ServiceItem[]>(initialServices || []);

  useEffect(() => {
    try {
      const local = clientStore.getServices();
      if (local && local.length > 0) setServices(local);
    } catch {}

    fetch('/api/services')
      .then((res) => {
        if (!res.ok) throw new Error('API failed');
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setServices(data);
          try {
            clientStore.saveServices(data);
          } catch {}
        }
      })
      .catch(() => {});

    const handleUpdate = () => {
      try {
        const updated = clientStore.getServices();
        if (updated && updated.length > 0) setServices(updated);
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
    <section className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 bg-brandPink/10 border border-brandPink/30 px-4 py-1.5 rounded-full mb-4">
            <Sparkles className="w-3.5 h-3.5 text-brandPink" />
            <span className="text-brandPink font-semibold tracking-[0.25em] text-[11px] uppercase">
              Bespoke Artistry
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-brandBlack font-normal mb-4">
            Couture Makeup Services
          </h2>
          <p className="text-brandBlack/70 text-sm sm:text-base font-light">
            Every celebration demands a personalized signature look. Explore our luxury portfolio of specialized bridal and event artistry services by Soumili's Makeover.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service) => (
            <div
              key={service.id}
              className="group bg-brandLightPink/30 rounded-2xl overflow-hidden border border-brandPink/20 hover:border-brandPink transition-all duration-300 hover:shadow-xl flex flex-col justify-between"
            >
              <div>
                {/* Image or Cool Pink Placeholder */}
                <div className="relative aspect-[4/3] overflow-hidden bg-brandLightPink/60">
                  {service.image_url ? (
                    <>
                      <img
                        src={service.image_url}
                        alt={service.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-brandBlack/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </>
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-brandLightPink via-white to-pink-100 flex flex-col items-center justify-center p-4 border-b border-brandPink/20 text-center">
                      <div className="w-10 h-10 rounded-full bg-brandPink/15 border border-brandPink/30 flex items-center justify-center text-brandPink mb-1.5 shadow-sm">
                        <Sparkles className="w-5 h-5 text-brandPink" />
                      </div>
                      <span className="font-serif text-xs font-semibold text-brandBlack">{service.title}</span>
                      <span className="text-[9px] text-brandPink uppercase tracking-widest font-semibold mt-0.5">Soumili's Makeover</span>
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="p-6">
                  <h3 className="font-serif text-xl text-brandBlack font-medium mb-2 group-hover:text-brandPink transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-xs text-brandBlack/70 leading-relaxed mb-4 line-clamp-3">
                    {service.short_description}
                  </p>

                  <ul className="space-y-1.5 mb-4">
                    {service.features.slice(0, 3).map((feat, i) => (
                      <li key={i} className="flex items-center text-[11px] text-brandBlack/80">
                        <CheckCircle2 className="w-3.5 h-3.5 text-brandPink mr-1.5 shrink-0" />
                        <span className="truncate">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Link */}
              <div className="px-6 pb-6 pt-0">
                <Link
                  href={`/${service.slug}`}
                  className="inline-flex items-center space-x-1.5 text-xs font-semibold text-brandPink group-hover:text-brandPink-700 tracking-wider uppercase transition-colors"
                >
                  <span>Discover Artistry</span>
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
