import React from 'react';
import { Star, Quote } from 'lucide-react';
import { Testimonial } from '@/types/database';

export default function TestimonialsSection({ testimonials }: { testimonials: Testimonial[] }) {
  return (
    <section className="py-24 bg-champagne-50/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-roseGold-600 font-semibold tracking-[0.25em] text-xs uppercase mb-3">
            Real Words from Real Brides
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-brandDark font-normal mb-4">
            Cherished Love Stories
          </h2>
          <p className="text-brandMuted text-sm sm:text-base font-light">
            Read heartfelt experiences from brides who trusted Aura Bridal Studio for their most cherished life milestones.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((test) => (
            <div
              key={test.id}
              className="bg-white p-8 rounded-3xl border border-champagne-200/80 shadow-soft hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative group"
            >
              <Quote className="absolute top-6 right-6 w-10 h-10 text-champagne-200/50 group-hover:text-roseGold-200/70 transition-colors" />

              <div>
                {/* 5-star rating */}
                <div className="flex items-center space-x-1 mb-6 text-amber-500">
                  {Array.from({ length: test.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                <p className="text-brandDark/85 font-light text-sm sm:text-base leading-relaxed italic mb-8 relative z-10">
                  "{test.quote}"
                </p>
              </div>

              {/* Client Info */}
              <div className="flex items-center space-x-4 pt-4 border-t border-champagne-100">
                <img
                  src={test.avatar_url}
                  alt={test.client_name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-roseGold-300 shadow-sm"
                />
                <div>
                  <h4 className="font-serif text-base font-medium text-brandDark">
                    {test.client_name}
                  </h4>
                  <p className="text-[11px] text-roseGold-600 font-medium">
                    {test.event_type}
                  </p>
                  <p className="text-[10px] text-brandMuted">
                    {test.event_date}
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
