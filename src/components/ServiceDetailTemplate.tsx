import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import ContactBookingSection from '@/components/ContactBookingSection';
import { db } from '@/lib/db';
import { Sparkles, CheckCircle2, ArrowRight, ShieldCheck, HeartHandshake, Star } from 'lucide-react';
import { ServiceItem } from '@/types/database';

export default function ServiceDetailTemplate({
  service,
  heroBadge,
  accentQuote,
  relatedPackagesFilter
}: {
  service: ServiceItem;
  heroBadge: string;
  accentQuote: string;
  relatedPackagesFilter: string;
}) {
  const settings = db.getSettings();
  const allServices = db.getServices();
  const allPackages = db.getPackages(true);
  const filteredPackages = allPackages.filter(p => 
    p.category.toLowerCase().includes(relatedPackagesFilter.toLowerCase()) || 
    p.name.toLowerCase().includes(relatedPackagesFilter.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-champagne-50">
      <Navbar />

      {/* Hero Banner */}
      <section className="relative pt-36 pb-24 bg-brandDark text-white overflow-hidden">
        <div className="absolute inset-0 opacity-25">
          <img
            src={service.image_url}
            alt={service.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <span className="text-xs uppercase tracking-[0.3em] text-roseGold-400 font-semibold mb-3 inline-block">
            {heroBadge}
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl text-ivory font-normal mb-4">
            {service.title}
          </h1>
          <p className="text-champagne-200/90 text-sm sm:text-base font-light max-w-2xl mx-auto">
            {service.short_description}
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="#book"
              className="bg-gradient-to-r from-roseGold-500 to-roseGold-700 hover:from-roseGold-600 hover:to-roseGold-800 text-white px-8 py-3.5 rounded-full text-xs font-semibold tracking-widest uppercase shadow-glow transition-all"
            >
              Book {service.title}
            </Link>
          </div>
        </div>
      </section>

      {/* Main Experience Breakdown */}
      <section className="py-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5">
            <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
              <img
                src={service.image_url}
                alt={service.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center space-x-2 text-roseGold-600 font-semibold tracking-widest text-xs uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Couture Methodology</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl text-brandDark font-normal">
              {accentQuote}
            </h2>

            <p className="text-brandMuted leading-relaxed text-sm sm:text-base font-light">
              {service.full_description}
            </p>

            {/* Inclusions */}
            <div className="pt-4">
              <h4 className="font-serif text-lg text-brandDark font-medium mb-4">
                What to Expect During Your Session:
              </h4>
              <ul className="space-y-3">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start text-xs sm:text-sm text-brandDark/85">
                    <CheckCircle2 className="w-4 h-4 text-roseGold-500 shrink-0 mr-2.5 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-6">
              <Link
                href="/pricing"
                className="inline-flex items-center space-x-2 text-xs uppercase tracking-widest font-semibold text-roseGold-600 hover:text-roseGold-800"
              >
                <span>Compare All Service Packages & Pricing</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Packages for this Service */}
      {filteredPackages.length > 0 && (
        <section className="py-16 bg-white border-t border-champagne-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h3 className="font-serif text-2xl sm:text-3xl text-brandDark">
                Popular Packages for {service.title}
              </h3>
              <p className="text-xs text-brandMuted mt-1">
                Real database rates for your ceremony and reception styling.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPackages.map((pkg) => (
                <div key={pkg.id} className="bg-champagne-50/70 p-6 rounded-2xl border border-champagne-200 flex flex-col justify-between">
                  <div>
                    <h4 className="font-serif text-xl text-brandDark font-medium mb-1">
                      {pkg.name}
                    </h4>
                    <p className="text-2xl font-serif font-bold text-roseGold-700 mb-3">
                      ₹{pkg.price.toLocaleString('en-IN')}
                    </p>
                    <p className="text-xs text-brandMuted mb-4">
                      {pkg.description}
                    </p>
                    <ul className="space-y-1.5 text-[11px] text-brandDark/80 mb-6">
                      {pkg.features.slice(0, 4).map((f, i) => (
                        <li key={i} className="flex items-center">
                          <CheckCircle2 className="w-3.5 h-3.5 text-roseGold-500 mr-1.5 shrink-0" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Link
                    href={`/contact?package=${encodeURIComponent(pkg.name)}#book`}
                    className="w-full text-center py-2.5 rounded-full bg-brandDark hover:bg-roseGold-600 text-white text-xs font-semibold uppercase tracking-wider transition-colors"
                  >
                    Select Package
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Booking Form */}
      <ContactBookingSection
        settings={settings}
        services={allServices}
        defaultPackage={service.title}
      />

      <WhatsAppButton phone={settings.contact_whatsapp} />
      <Footer />
    </main>
  );
}
