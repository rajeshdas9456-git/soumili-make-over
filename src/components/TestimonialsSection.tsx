'use client';

import React, { useState, useEffect } from 'react';
import { Star, Quote } from 'lucide-react';
import { Testimonial } from '@/types/database';
import { clientStore } from '@/lib/clientStore';

export default function TestimonialsSection({ testimonials: initialTestimonials }: { testimonials: Testimonial[] }) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials || []);

  useEffect(() => {
    try {
      const local = clientStore.getTestimonials(true);
      if (local && local.length > 0) setTestimonials(local);
    } catch {}

    fetch('/api/testimonials')
      .then((res) => {
        if (!res.ok) throw new Error('API failed');
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setTestimonials(data);
          try {
            clientStore.saveTestimonials(data);
          } catch {}
        }
      })
      .catch(() => {});

    const handleUpdate = () => {
      try {
        const updated = clientStore.getTestimonials(true);
        if (updated && updated.length > 0) setTestimonials(updated);
      } catch {}
    };

    window.addEventListener('soumili_data_updated', handleUpdate);
    return () => window.removeEventListener('soumili_data_updated', handleUpdate);
  }, []);

  return (
    <section className="py-24 bg-brandLightPink/30 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-brandPink font-semibold tracking-[0.25em] text-xs uppercase mb-3">
            Real Words from Real Brides
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-brandBlack font-normal mb-4">
            Cherished Love Stories
          </h2>
          <p className="text-brandBlack/70 text-sm sm:text-base font-light">
            Read heartfelt experiences from brides who trusted Soumili's Makeover for their most cherished life milestones.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((test) => (
            <div
              key={test.id}
              className="bg-white p-8 rounded-3xl border border-brandPink/20 shadow-pink-soft hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative group"
            >
              <Quote className="absolute top-6 right-6 w-10 h-10 text-brandPink/20 group-hover:text-brandPink/40 transition-colors" />

              <div>
                {/* 5-star rating */}
                <div className="flex items-center space-x-1 mb-6 text-amber-500">
                  {Array.from({ length: test.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                <p className="text-brandBlack/85 font-light text-sm sm:text-base leading-relaxed italic mb-8 relative z-10">
                  "{test.quote}"
                </p>
              </div>

              {/* Client Info */}
              <div className="flex items-center space-x-4 pt-4 border-t border-brandPink/15">
                <img
                  src={test.avatar_url}
                  alt={test.client_name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-brandPink shadow-sm"
                />
                <div>
                  <h4 className="font-serif text-base text-brandBlack font-semibold">
                    {test.client_name}
                  </h4>
                  <p className="text-[11px] text-brandPink font-medium uppercase tracking-wider">
                    {test.event_type} • {test.event_date}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
