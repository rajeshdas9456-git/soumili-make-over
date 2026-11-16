import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import ContactBookingSection from '@/components/ContactBookingSection';
import { db } from '@/lib/db';
import { Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
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
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Banner */}
      <section className="relative pt-36 pb-24 bg-brandBlack text-white overflow-hidden">
        <div className="absolute inset-0 opacity-25">
          <img
            src={service.image_url}
            alt={service.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <span className="text-xs uppercase tracking-[0.3em] text-brandPink font-semibold mb-3 inline-block">
            {heroBadge}
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl text-white font-normal mb-4">
            {service.title}
          </h1>
          <p className="text-brandLightPink/90 text-sm sm:text-base font-light max-w-2xl mx-auto">
            {service.short_description}
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="#book"
              className="bg-brandPink hover:bg-brandPink-600 text-white px-8 py-3.5 rounded-full text-xs font-semibold tracking-widest uppercase shadow-pink-soft hover:shadow-pink-glow transition-all"
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
            <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-4 border-brandLightPink">
              <img
                src={service.image_url}
                alt={service.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center space-x-2 text-brandPink font-semibold tracking-widest text-xs uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Couture Methodology</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl text-brandBlack font-normal">
              {accentQuote}
            </h2>

            <p className="text-brandBlack/75 leading-relaxed text-sm sm:text-base font-light">
              {service.full_description}
            </p>

            {/* Inclusions */}
            <div className="pt-4">
              <h4 className="font-serif text-lg text-brandBlack font-medium mb-4">
                What to Expect During Your Session:
              </h4>
              <ul className="space-y-3">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start text-xs sm:text-sm text-brandBlack/85">
                    <CheckCircle2 className="w-4 h-4 text-brandPink shrink-0 mr-2.5 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-6">
              <Link
                href="/pricing"
                className="inline-flex items-center space-x-2 text-xs uppercase tracking-widest font-semibold text-brandPink hover:text-brandPink-700"
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
        <section className="py-16 bg-brandLightPink/30 border-t border-brandPink/20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h3 className="font-serif text-2xl sm:text-3xl text-brandBlack">
                Popular Packages for {service.title}
              </h3>
              <p className="text-xs text-brandBlack/70 mt-1">
                Real database rates for your ceremony and reception styling by Soumili's Makeover.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPackages.map((pkg) => (
                <div key={pkg.id} className="bg-white p-6 rounded-2xl border border-brandPink/30 flex flex-col justify-between shadow-pink-soft">
                  <div>
                    <h4 className="font-serif text-xl text-brandBlack font-medium mb-1">
                      {pkg.name}
                    </h4>
                    <p className="text-2xl font-serif font-bold text-brandPink mb-3">
                      ₹{Number(pkg.price).toLocaleString('en-IN')}
                    </p>
                    <p className="text-xs text-brandBlack/70 mb-4">
                      {pkg.description}
                    </p>
                    <ul className="space-y-1.5 text-[11px] text-brandBlack/80 mb-6">
                      {pkg.features.slice(0, 4).map((f, i) => (
                        <li key={i} className="flex items-center">
                          <CheckCircle2 className="w-3.5 h-3.5 text-brandPink mr-1.5 shrink-0" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Link
                    href={`/contact?package=${encodeURIComponent(pkg.name)}#book`}
                    className="w-full text-center py-2.5 rounded-full bg-brandPink hover:bg-brandPink-600 text-white text-xs font-semibold uppercase tracking-wider transition-colors shadow-pink-soft"
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
      <Footer settings={settings} />
    </main>
  );
}
