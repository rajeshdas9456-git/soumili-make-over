'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Calendar, Menu, X, Sparkles } from 'lucide-react';
import Logo from './Logo';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const mainNavLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Services', href: '/services' },
    { name: 'Portfolio', href: '/gallery' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Reviews', href: '/testimonials' },
    { name: 'Contact', href: '/contact' },
  ];

  const categoryLinks = [
    { name: 'Bridal Makeup', href: '/bridal-makeup' },
    { name: 'Party Makeup', href: '/party-makeup' },
    { name: 'Engagement', href: '/engagement-makeup' },
    { name: 'Reception', href: '/reception-makeup' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'glass-nav shadow-pink-soft border-b border-brandPink/15 py-3'
          : 'bg-white/95 backdrop-blur-md py-4 border-b border-brandPink-100'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Custom Elegant Logo for Soumili's Makeover */}
          <Logo variant="dark" size="md" showTagline={true} />

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center space-x-7 text-[13px] font-medium tracking-wider uppercase">
            {mainNavLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`transition-all hover:text-brandPink relative py-1 ${
                  isActive(link.href)
                    ? 'text-brandPink font-semibold'
                    : 'text-brandBlack/85'
                }`}
              >
                {link.name}
                {isActive(link.href) && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-brandPink rounded-full" />
                )}
              </Link>
            ))}
          </nav>

          {/* Action CTA */}
          <div className="hidden sm:flex items-center space-x-3">
            <Link
              href="/contact#book"
              className="inline-flex items-center space-x-2 bg-brandPink hover:bg-brandPink-600 text-white px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase shadow-pink-soft hover:shadow-pink-glow transition-all transform hover:-translate-y-0.5"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book Appointment</span>
            </Link>
          </div>

          {/* Mobile hamburger button */}
          <div className="lg:hidden flex items-center space-x-2">
            <Link
              href="/contact#book"
              className="text-xs bg-brandPink text-white px-3.5 py-1.5 rounded-full font-semibold uppercase tracking-wider sm:hidden"
            >
              Book
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-brandBlack hover:text-brandPink hover:bg-brandLightPink transition-colors"
              aria-label="Toggle Navigation"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="lg:hidden bg-white/98 backdrop-blur-xl border-b border-brandPink/20 px-4 pt-3 pb-6 space-y-1 shadow-xl max-h-[85vh] overflow-y-auto">
          <div className="space-y-1">
            {mainNavLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2.5 rounded-md text-sm tracking-wide uppercase transition-colors ${
                  isActive(link.href)
                    ? 'bg-brandLightPink text-brandPink font-semibold'
                    : 'text-brandBlack hover:bg-brandLightPink/60 hover:text-brandPink'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="pt-3 pb-1 border-t border-brandPink-100">
            <p className="px-3 text-[10px] uppercase tracking-widest text-brandPink font-bold mb-1.5">
              Specialized Services
            </p>
            <div className="grid grid-cols-2 gap-1">
              {categoryLinks.map((c) => (
                <Link
                  key={c.name}
                  href={c.href}
                  onClick={() => setIsOpen(false)}
                  className="px-3 py-2 text-xs text-brandBlack/80 hover:text-brandPink hover:bg-brandLightPink/50 rounded-md transition-colors"
                >
                  {c.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-brandPink-100 flex flex-col space-y-2">
            <Link
              href="/contact#book"
              onClick={() => setIsOpen(false)}
              className="w-full text-center py-3 bg-brandPink text-white rounded-full text-xs uppercase tracking-wider font-semibold shadow-md"
            >
              Book Appointment Now
            </Link>
            <Link
              href="/admin/login"
              onClick={() => setIsOpen(false)}
              className="text-center py-2 text-xs text-brandBlack/60 hover:text-brandPink transition-colors"
            >
              Admin Portal
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
