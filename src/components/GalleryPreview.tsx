'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { GalleryImage, GalleryCategory } from '@/types/database';
import { ArrowRight, Maximize2, X, Sparkles } from 'lucide-react';
import { clientStore } from '@/lib/clientStore';

export default function GalleryPreview({
  images: initialImages,
  categories: initialCategories,
  showAllLink = true
}: {
  images: GalleryImage[];
  categories: GalleryCategory[];
  showAllLink?: boolean;
}) {
  const [images, setImages] = useState<GalleryImage[]>(initialImages || []);
  const [categories, setCategories] = useState<GalleryCategory[]>(initialCategories || []);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeLightbox, setActiveLightbox] = useState<GalleryImage | null>(null);

  useEffect(() => {
    // 1. Instantly hydrate from local clientStore
    try {
      const localGallery = clientStore.getGallery(true);
      const localCats = clientStore.getCategories();
      if (localGallery && localGallery.length > 0) setImages(localGallery);
      if (localCats && localCats.length > 0) setCategories(localCats);
    } catch {}

    // 2. Fetch fresh published gallery from server API
    fetch('/api/gallery')
      .then((res) => {
        if (!res.ok) throw new Error('API failed');
        return res.json();
      })
      .then((data) => {
        if (data && Array.isArray(data.images) && data.images.length > 0) {
          setImages(data.images);
          try {
            clientStore.saveGallery(data.images);
          } catch {}
        }
        if (data && Array.isArray(data.categories) && data.categories.length > 0) {
          setCategories(data.categories);
          try {
            clientStore.saveCategories(data.categories);
          } catch {}
        }
      })
      .catch(() => {});

    // 3. Listen for live updates from admin dashboard
    const handleUpdate = () => {
      try {
        const updatedImages = clientStore.getGallery(true);
        const updatedCats = clientStore.getCategories();
        if (updatedImages && updatedImages.length > 0) setImages(updatedImages);
        if (updatedCats && updatedCats.length > 0) setCategories(updatedCats);
      } catch {}
    };

    window.addEventListener('soumili_data_updated', handleUpdate);
    return () => window.removeEventListener('soumili_data_updated', handleUpdate);
  }, []);

  const filteredImages = selectedCategory === 'all'
    ? images
    : images.filter(img => img.category_id === selectedCategory);

  return (
    <section className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <p className="text-brandPink font-semibold tracking-[0.25em] text-xs uppercase mb-3">
            Real Brides & Events
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-brandBlack font-normal mb-4">
            The Bridal Portrait Gallery
          </h2>
          <p className="text-brandBlack/70 text-sm sm:text-base font-light">
            Each bride has a unique dream. Immerse yourself in our collection of real weddings and high-fashion bridal moments by Soumili's Makeover.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-12">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-5 py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition-all ${
              selectedCategory === 'all'
                ? 'bg-brandPink text-white shadow-pink-soft'
                : 'bg-brandLightPink text-brandBlack hover:bg-brandPink hover:text-white'
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
                  ? 'bg-brandPink text-white shadow-pink-soft'
                  : 'bg-brandLightPink text-brandBlack hover:bg-brandPink hover:text-white'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredImages.slice(0, showAllLink ? 8 : filteredImages.length).map((image) => (
            <div
              key={image.id}
              onClick={() => setActiveLightbox(image)}
              className="group relative cursor-pointer overflow-hidden rounded-2xl bg-brandLightPink shadow-md aspect-[4/5] transform hover:-translate-y-1 transition-all duration-300 border border-brandPink/15 hover:border-brandPink/50"
            >
              <img
                src={image.image_url}
                alt={image.title}
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brandBlack/90 via-brandBlack/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 text-white">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] uppercase tracking-widest text-brandLightPink font-semibold">
                    {image.category?.name || 'Bridal Couture'}
                  </span>
                  <Maximize2 className="w-4 h-4 text-brandPink" />
                </div>
                <h4 className="font-serif text-lg font-normal text-white">
                  {image.title}
                </h4>
                {image.description && (
                  <p className="text-xs text-brandLightPink/80 line-clamp-2 mt-1 font-light">
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
              className="inline-flex items-center space-x-3 bg-brandPink hover:bg-brandPink-600 text-white px-8 py-4 rounded-full text-xs font-semibold tracking-widest uppercase shadow-pink-soft hover:shadow-pink-glow transition-all"
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
            className="max-w-4xl w-full max-h-[90vh] flex flex-col bg-brandBlack rounded-2xl overflow-hidden shadow-2xl border border-brandPink/30"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative flex-1 bg-black flex items-center justify-center max-h-[72vh] overflow-hidden">
              <img
                src={activeLightbox.image_url}
                alt={activeLightbox.title}
                className="max-w-full max-h-full object-contain"
              />
            </div>
            <div className="p-6 bg-brandBlack text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-brandPink/20">
              <div>
                <span className="text-xs text-brandPink font-semibold uppercase tracking-widest">
                  {activeLightbox.category?.name || 'Bridal Special'}
                </span>
                <h3 className="font-serif text-2xl font-normal text-white mt-1">
                  {activeLightbox.title}
                </h3>
                {activeLightbox.description && (
                  <p className="text-xs sm:text-sm text-brandLightPink/80 font-light mt-1 max-w-2xl">
                    {activeLightbox.description}
                  </p>
                )}
              </div>
              <Link
                href="/contact#book"
                className="shrink-0 bg-brandPink hover:bg-brandPink-600 text-white px-6 py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-colors shadow-pink-soft"
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
