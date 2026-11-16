'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { GalleryImage, GalleryCategory } from '@/types/database';
import { ArrowRight, Maximize2, X, Sparkles, ImagePlus } from 'lucide-react';

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
    if (initialImages) setImages(initialImages);
    if (initialCategories) setCategories(initialCategories);

    // Fetch live gallery from server API
    fetch('/api/gallery')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Array.isArray(data.images) && data.images.length > 0) {
          setImages(data.images);
        }
        if (data && Array.isArray(data.categories) && data.categories.length > 0) {
          setCategories(data.categories);
        }
      })
      .catch(() => { });

    // Listen for live database updates from admin
    const handleUpdate = () => {
      fetch('/api/gallery')
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data && Array.isArray(data.images)) {
            setImages(data.images);
          }
        })
        .catch(() => { });
    };

    window.addEventListener('soumili_data_updated', handleUpdate);
    return () => {
      window.removeEventListener('soumili_data_updated', handleUpdate);
    };
  }, [initialImages, initialCategories]);

  const filteredImages = selectedCategory === 'all'
    ? images
    : images.filter(img => img.category_id === selectedCategory);

  return (
    <section className="py-24 bg-white relative" id="gallery">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-2 bg-[#FCEAF1] border border-[#E83B79]/30 px-4 py-1.5 rounded-full mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#E83B79]" />
            <span className="text-[#E83B79] font-semibold tracking-[0.25em] text-[11px] uppercase">
              Couture Portfolios & Real Weddings
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#151515] font-normal mb-4">
            The Bridal Portrait Gallery
          </h2>
          <p className="text-[#777777] text-sm sm:text-base font-light leading-relaxed">
            Every bride is an eternal masterpiece. Explore authentic portfolios of royal brides, reception glamour, and engagement transformations styled by Soumili's Makeover.
          </p>
        </div>

        {/* Category Filters */}
        {categories.length > 0 && images.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-12">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-5 py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition-all cursor-pointer ${selectedCategory === 'all'
                ? 'bg-[#E83B79] text-white shadow-pink-soft'
                : 'bg-[#FCEAF1] text-[#151515] hover:bg-[#E83B79] hover:text-white'
                }`}
            >
              All Masterpieces ({images.length})
            </button>
            {categories.map((cat) => {
              const count = images.filter(img => img.category_id === cat.id).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-5 py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition-all cursor-pointer ${selectedCategory === cat.id
                    ? 'bg-[#E83B79] text-white shadow-pink-soft'
                    : 'bg-[#FCEAF1] text-[#151515] hover:bg-[#E83B79] hover:text-white'
                    }`}
                >
                  {cat.name} {count > 0 ? `(${count})` : ''}
                </button>
              );
            })}
          </div>
        )}

        {/* Responsive Grid or Clean Empty State */}
        {filteredImages.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredImages.slice(0, showAllLink ? 8 : filteredImages.length).map((image) => (
              <div
                key={image.id}
                onClick={() => setActiveLightbox(image)}
                className="group relative cursor-pointer overflow-hidden rounded-2xl bg-[#FCEAF1] shadow-md aspect-[4/5] transform hover:-translate-y-1 transition-all duration-300 border border-[#E83B79]/15 hover:border-[#E83B79]/60"
              >
                <img
                  src={image.image_url}
                  alt={image.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#151515]/90 via-[#151515]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 text-white">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] uppercase tracking-widest text-[#FCEAF1] font-semibold">
                      {image.category?.name || 'Bridal Couture'}
                    </span>
                    <Maximize2 className="w-4 h-4 text-[#E83B79]" />
                  </div>
                  <h4 className="font-serif text-lg font-normal text-white">
                    {image.title}
                  </h4>
                  {image.description && (
                    <p className="text-xs text-[#FCEAF1]/80 line-clamp-2 mt-1 font-light">
                      {image.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Elegant Empty State with Direct Admin Upload Link */
          <div className="max-w-md mx-auto text-center py-16 px-6 bg-[#FCEAF1]/50 border-2 border-dashed border-[#E83B79]/30 rounded-3xl">
            <div className="w-16 h-16 rounded-full bg-white shadow-pink-soft flex items-center justify-center mx-auto mb-4 text-[#E83B79]">
              <ImagePlus className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-xl font-medium text-[#151515] mb-2">
              Bridal Portfolio Updates Coming Soon
            </h3>
            <p className="text-xs text-[#777777] mb-6 font-light leading-relaxed">
              Soumili's Makeover is curating high-definition wedding albums from our recent royal weddings and destination brides.
            </p>
            <Link
              href="/contact#book"
              className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider bg-[#E83B79] text-white px-6 py-3 rounded-full shadow-pink-soft hover:bg-[#D42666] transition-all"
            >
              <span>Schedule Live Studio Consultation</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        {/* View All Button */}
        {showAllLink && filteredImages.length > 8 && (
          <div className="mt-14 text-center">
            <Link
              href="/gallery"
              className="inline-flex items-center space-x-2 bg-[#151515] hover:bg-[#E83B79] text-white px-8 py-4 rounded-full text-xs font-semibold uppercase tracking-widest transition-all shadow-md group"
            >
              <span>View Full Bridal Portfolio</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        )}

      </div>

      {/* Lightbox Fullscreen Modal */}
      {activeLightbox && (
        <div
          className="fixed inset-0 z-50 bg-[#151515]/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
          onClick={() => setActiveLightbox(null)}
        >
          <button
            onClick={() => setActiveLightbox(null)}
            className="absolute top-6 right-6 text-white/80 hover:text-white p-2 rounded-full bg-black/40 border border-white/20 transition-all z-10"
            aria-label="Close Preview"
          >
            <X className="w-6 h-6" />
          </button>

          <div
            className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={activeLightbox.image_url}
              alt={activeLightbox.title}
              className="max-h-[75vh] w-auto max-w-full rounded-2xl object-contain shadow-2xl border border-white/10"
            />
            <div className="text-center mt-4 text-white max-w-lg">
              <span className="text-[10px] uppercase tracking-widest text-[#E83B79] font-semibold bg-[#E83B79]/20 border border-[#E83B79]/40 px-3 py-1 rounded-full inline-block mb-2">
                {activeLightbox.category?.name || 'Bridal Couture'}
              </span>
              <h3 className="font-serif text-xl sm:text-2xl font-normal text-white">
                {activeLightbox.title}
              </h3>
              {activeLightbox.description && (
                <p className="text-xs sm:text-sm text-[#FCEAF1]/80 mt-1 font-light">
                  {activeLightbox.description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

    </section>
  );
}
