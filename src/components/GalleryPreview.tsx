'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { GalleryImage, GalleryCategory } from '@/types/database';
import { ArrowRight, Maximize2, X, Sparkles } from 'lucide-react';

export default function GalleryPreview({
  images,
  categories,
  showAllLink = true
}: {
  images: GalleryImage[];
  categories: GalleryCategory[];
  showAllLink?: boolean;
}) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeLightbox, setActiveLightbox] = useState<GalleryImage | null>(null);

  const filteredImages = selectedCategory === 'all'
    ? images
    : images.filter(img => img.category_id === selectedCategory);

  return (
    <section className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <p className="text-roseGold-600 font-semibold tracking-[0.25em] text-xs uppercase mb-3">
            Real Brides & Events
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-brandDark font-normal mb-4">
            The Bridal Portrait Gallery
          </h2>
          <p className="text-brandMuted text-sm sm:text-base font-light">
            Each bride has a unique dream. Immerse yourself in our collection of real weddings and high-fashion bridal moments.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-12">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-5 py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition-all ${
              selectedCategory === 'all'
                ? 'bg-brandDark text-white shadow-md'
                : 'bg-champagne-100 text-brandDark/80 hover:bg-champagne-200'
            }`}
          >
            All Masterpieces
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-5 py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition-all ${
                selectedCategory === cat.id
                  ? 'bg-brandDark text-white shadow-md'
                  : 'bg-champagne-100 text-brandDark/80 hover:bg-champagne-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Masonry / Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredImages.slice(0, showAllLink ? 8 : filteredImages.length).map((image) => (
            <div
              key={image.id}
              onClick={() => setActiveLightbox(image)}
              className="group relative cursor-pointer overflow-hidden rounded-2xl bg-champagne-100 shadow-md aspect-[4/5] transform hover:-translate-y-1 transition-all duration-300"
            >
              <img
                src={image.image_url}
                alt={image.title}
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 text-white">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] uppercase tracking-widest text-champagne-300 font-medium">
                    {image.category?.name || 'Bridal Couture'}
                  </span>
                  <Maximize2 className="w-4 h-4 text-white/80" />
                </div>
                <h4 className="font-serif text-lg font-normal text-white">
                  {image.title}
                </h4>
                {image.description && (
                  <p className="text-xs text-white/80 line-clamp-2 mt-1 font-light">
                    {image.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* View Full Gallery Link */}
        {showAllLink && (
          <div className="mt-14 text-center">
            <Link
              href="/gallery"
              className="inline-flex items-center space-x-3 bg-gradient-to-r from-champagne-700 to-roseGold-600 hover:from-champagne-800 hover:to-roseGold-700 text-white px-8 py-4 rounded-full text-xs font-semibold tracking-widest uppercase shadow-glow transition-all"
            >
              <span>Explore Complete HD Photo Gallery</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

      </div>

      {/* Lightbox Modal */}
      {activeLightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
          onClick={() => setActiveLightbox(null)}
        >
          <button
            onClick={() => setActiveLightbox(null)}
            className="absolute top-6 right-6 text-white/80 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-50"
            aria-label="Close Lightbox"
          >
            <X className="w-7 h-7" />
          </button>

          <div
            className="max-w-4xl w-full max-h-[90vh] flex flex-col bg-brandDark rounded-2xl overflow-hidden shadow-2xl border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative flex-1 bg-black flex items-center justify-center max-h-[72vh] overflow-hidden">
              <img
                src={activeLightbox.image_url}
                alt={activeLightbox.title}
                className="max-w-full max-h-full object-contain"
              />
            </div>
            <div className="p-6 bg-brandDark text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs text-roseGold-400 font-medium uppercase tracking-widest">
                  {activeLightbox.category?.name || 'Bridal Special'}
                </span>
                <h3 className="font-serif text-2xl font-normal text-ivory mt-1">
                  {activeLightbox.title}
                </h3>
                {activeLightbox.description && (
                  <p className="text-xs sm:text-sm text-champagne-300/80 font-light mt-1 max-w-2xl">
                    {activeLightbox.description}
                  </p>
                )}
              </div>
              <Link
                href="/contact#book"
                className="shrink-0 bg-roseGold-600 hover:bg-roseGold-700 text-white px-6 py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-colors"
              >
                Book This Look
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
