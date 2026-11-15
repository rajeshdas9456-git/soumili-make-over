import React from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { ServiceItem } from '@/types/database';

export default function FeaturedServices({ services }: { services: ServiceItem[] }) {
  return (
    <section className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-roseGold-600 font-semibold tracking-[0.25em] text-xs uppercase mb-3">
            Bespoke Artistry
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-brandDark font-normal mb-4">
            Couture Makeup Services
          </h2>
          <p className="text-brandMuted text-sm sm:text-base font-light">
            Every celebration demands a personalized signature look. Explore our luxury portfolio of specialized bridal and event artistry services.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service) => (
            <div
              key={service.id}
              className="group bg-champagne-50/50 rounded-2xl overflow-hidden border border-champagne-200/70 hover:border-roseGold-300 transition-all duration-300 hover:shadow-xl flex flex-col justify-between"
            >
              <div>
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={service.image_url}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brandDark/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                {/* Details */}
                <div className="p-6">
                  <h3 className="font-serif text-xl text-brandDark font-medium mb-2 group-hover:text-roseGold-600 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-xs text-brandMuted leading-relaxed mb-4 line-clamp-3">
                    {service.short_description}
                  </p>

                  <ul className="space-y-1.5 mb-4">
                    {service.features.slice(0, 3).map((feat, idx) => (
                      <li key={idx} className="flex items-start text-[11px] text-brandDark/80">
                        <CheckCircle2 className="w-3.5 h-3.5 text-roseGold-500 shrink-0 mr-1.5 mt-0.5" />
                        <span className="line-clamp-1">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action */}
              <div className="p-6 pt-0 border-t border-champagne-200/40">
                <Link
                  href={`/${service.slug}`}
                  className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-roseGold-600 hover:text-roseGold-800 transition-colors"
                >
                  <span>Explore Experience</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

            </div>
          ))}
        </div>

        {/* View All CTA */}
        <div className="mt-14 text-center">
          <Link
            href="/services"
            className="inline-flex items-center space-x-3 bg-champagne-100 hover:bg-champagne-200 border border-champagne-300 text-brandDark px-8 py-3.5 rounded-full text-xs font-semibold tracking-widest uppercase transition-all"
          >
            <span>View All Makeup Services & Details</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}
