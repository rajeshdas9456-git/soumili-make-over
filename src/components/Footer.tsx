import React from 'react';
import Link from 'next/link';
import { Instagram, Facebook, Youtube, Phone, Mail, MapPin, Sparkles } from 'lucide-react';
import { db } from '@/lib/db';
import Logo from './Logo';

export default function Footer() {
  const settings = db.getSettings();

  return (
    <footer className="bg-brandBlack text-white pt-16 pb-12 border-t border-brandPink/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 pb-12 border-b border-brandPink/20">
          
          {/* Col 1: Brand & Logo */}
          <div className="space-y-4">
            <Logo variant="white" size="lg" showTagline={true} />
            <p className="text-xs leading-relaxed text-brandLightPink/80 font-light max-w-sm pt-2">
              Luxury bridal makeup artist and couture wedding beauty studio. Celebrating your most unforgettable moments with beauty, elegance, and perfection.
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <a
                href={settings.instagram_url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-brandBlack-light border border-brandPink/30 flex items-center justify-center text-brandPink hover:text-white hover:bg-brandPink transition-all"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={settings.facebook_url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-brandBlack-light border border-brandPink/30 flex items-center justify-center text-brandPink hover:text-white hover:bg-brandPink transition-all"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href={settings.youtube_url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-brandBlack-light border border-brandPink/30 flex items-center justify-center text-brandPink hover:text-white hover:bg-brandPink transition-all"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="font-serif text-sm uppercase tracking-widest text-brandPink font-medium mb-4">
              Explore Studio
            </h4>
            <ul className="space-y-2.5 text-xs text-white/80">
              <li>
                <Link href="/about" className="hover:text-brandPink transition-colors">
                  About Soumili
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-brandPink transition-colors">
                  Couture Services
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-brandPink transition-colors">
                  Pricing & Bridal Packages
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-brandPink transition-colors">
                  Bridal Photo Gallery
                </Link>
              </li>
              <li>
                <Link href="/testimonials" className="hover:text-brandPink transition-colors">
                  Client Love Stories
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-brandPink transition-colors">
                  Contact & Bookings
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Signature Specialties */}
          <div>
            <h4 className="font-serif text-sm uppercase tracking-widest text-brandPink font-medium mb-4">
              Signature Makeovers
            </h4>
            <ul className="space-y-2.5 text-xs text-white/80">
              <li>
                <Link href="/bridal-makeup" className="hover:text-brandPink transition-colors">
                  Traditional Royal Bridal
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-brandPink transition-colors">
                  Temptu Airbrush Artistry
                </Link>
              </li>
              <li>
                <Link href="/reception-makeup" className="hover:text-brandPink transition-colors">
                  Red-Carpet Reception Glam
                </Link>
              </li>
              <li>
                <Link href="/engagement-makeup" className="hover:text-brandPink transition-colors">
                  Dewy Engagement & Sagan
                </Link>
              </li>
              <li>
                <Link href="/party-makeup" className="hover:text-brandPink transition-colors">
                  Cocktail & Sangeet Makeovers
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-brandPink transition-colors">
                  Destination Wedding Packages
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Studio Concierge */}
          <div>
            <h4 className="font-serif text-sm uppercase tracking-widest text-brandPink font-medium mb-4">
              Studio Concierge
            </h4>
            <ul className="space-y-3 text-xs text-white/80">
              <li className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-brandPink shrink-0 mt-0.5" />
                <span>{settings.contact_address}</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-brandPink shrink-0" />
                <a href={`tel:${settings.contact_phone}`} className="hover:text-brandPink transition-colors">
                  {settings.contact_phone}
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-brandPink shrink-0" />
                <a href={`mailto:${settings.contact_email}`} className="hover:text-brandPink transition-colors">
                  {settings.contact_email}
                </a>
              </li>
            </ul>
            <div className="mt-5">
              <Link
                href="/admin/login"
                className="text-[11px] uppercase tracking-wider text-brandLightPink/70 hover:text-brandPink transition-colors inline-block"
              >
                Studio Admin Portal &rarr;
              </Link>
            </div>
          </div>

        </div>

        {/* Bottom Credits */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-white/60 space-y-3 sm:space-y-0">
          <p>© {new Date().getFullYear()} Soumili's Makeover. All Rights Reserved. Beauty • Elegance • Perfection.</p>
          <p className="flex items-center space-x-1">
            <span>Crafted for unforgettable brides</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
