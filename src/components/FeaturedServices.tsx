'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import { ServiceItem } from '@/types/database';

export default function FeaturedServices({ services: initialServices }: { services: ServiceItem[] }) {
  const [services, setServices] = useState<ServiceItem[]>(initialServices || []);

  useEffect(() => {
    if (initialServices && initialServices.length > 0) {
      setServices(initialServices);
    }

    fetch('/api/services')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setServices(data);
        }
      })
      .catch(() => {});

    const handleUpdate = () => {
      fetch('/api/services')
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) {
            setServices(data);
          }
        })
        .catch(() => {});
    };

    window.addEventListener('soumili_data_updated', handleUpdate);
    return () => {
      window.removeEventListener('soumili_data_updated', handleUpdate);
    };
  }, [initialServices]);

  return (
    <section className="py-24 bg-white relative" id="services">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 bg-[#FCEAF1] border border-[#E83B79]/30 px-4 py-1.5 rounded-full mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#E83B79]" />
            <span className="text-[#E83B79] font-semibold tracking-[0.25em] text-[11px] uppercase">
              Bespoke Bridal Services
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#151515] font-normal mb-4">
            Couture Makeup & Styling
          </h2>
          <p className="text-[#777777] text-sm sm:text-base font-light leading-relaxed">
            Every bridal celebration demands a personalized signature nuance. Explore our specialized services designed to shine beneath ceremonial fires and ballroom chandeliers.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service) => (
            <div
              key={service.id}
              className="group bg-[#FCEAF1]/30 rounded-3xl overflow-hidden border border-[#E83B79]/20 hover:border-[#E83B79] transition-all duration-300 hover:shadow-xl flex flex-col justify-between"
            >
              <div>
                {/* Image or Soft Pink Placeholder */}
                <div className="relative aspect-[4/3] overflow-hidden bg-[#FCEAF1]/70">
                  {service.image_url ? (
                    <>
                      <img
                        src={service.image_url}
                        alt={service.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#151515]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </>
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#FCEAF1] via-white to-pink-100 flex flex-col items-center justify-center p-4 border-b border-[#E83B79]/20 text-center">
                      <div className="w-10 h-10 rounded-full bg-[#E83B79]/15 border border-[#E83B79]/30 flex items-center justify-center text-[#E83B79] mb-1.5 shadow-sm">
                        <Sparkles className="w-5 h-5 text-[#E83B79]" />
                      </div>
                      <span className="font-serif text-xs font-semibold text-[#151515]">{service.title}</span>
                      <span className="text-[9px] text-[#E83B79] uppercase tracking-widest font-semibold mt-0.5">Soumili's Makeover</span>
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="p-6">
                  <h3 className="font-serif text-xl text-[#151515] font-medium mb-2 group-hover:text-[#E83B79] transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-xs text-[#777777] leading-relaxed mb-4 line-clamp-3 font-light">
                    {service.short_description}
                  </p>

                  <ul className="space-y-1.5 mb-4">
                    {service.features && service.features.slice(0, 3).map((feat, i) => (
                      <li key={i} className="flex items-center text-[11px] text-[#333333]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#E83B79] mr-1.5 shrink-0" />
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
                  className="inline-flex items-center space-x-1.5 text-xs font-semibold text-[#E83B79] group-hover:text-[#D42666] tracking-wider uppercase transition-colors"
                >
                  <span>Explore Service</span>
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
