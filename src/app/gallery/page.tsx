import React from 'react';
import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import GalleryPreview from '@/components/GalleryPreview';
import { db } from '@/lib/db';

export const metadata: Metadata = {
  title: "Bridal Photo Gallery | Soumili's Makeover Portfolios & Real Weddings",
  description: "View real brides, reception glam, engagement makeovers, and royal wedding transformations styled by Soumili's Makeover.",
};

export const revalidate = 0;

export default async function GalleryPage() {
  const settings = db.getSettings();
  const gallery = db.getGallery(true);
  const categories = db.getCategories();

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* Header Banner */}
      <section className="pt-36 pb-20 bg-brandBlack text-white relative">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <span className="text-xs uppercase tracking-[0.3em] text-brandPink font-semibold mb-3 inline-block">
            Beauty • Elegance • Perfection
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl text-white font-normal">
            Bridal Photo Gallery
          </h1>
          <p className="text-brandLightPink/90 text-sm sm:text-base font-light mt-3 max-w-2xl mx-auto">
            Explore high-definition portfolios of our brides, featuring fine details, immaculate blending, and timeless hairstyles by Soumili's Makeover.
          </p>
        </div>
      </section>

      {/* Full Gallery with All Images and Lightbox */}
      <GalleryPreview images={gallery} categories={categories} showAllLink={false} />

      <WhatsAppButton phone={settings.contact_whatsapp} />
      <Footer />
    </main>
  );
}
