import React from 'react';
import type { Metadata } from 'next';
import ServiceDetailTemplate from '@/components/ServiceDetailTemplate';
import { db } from '@/lib/db';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  title: "Reception Makeup | Red-Carpet Glam & Modern Elegance | Soumili's Makeover",
  description: "Sophisticated evening reception makeup featuring sculpted 3D contours, glistening eye artistry, and Hollywood waves by Soumili's Makeover.",
};

export const revalidate = 0;

export default async function ReceptionMakeupPage() {
  const service = db.getServiceBySlug('reception-makeup') || db.getServices()[1] || db.getServices()[0];
  if (!service) return notFound();

  return (
    <ServiceDetailTemplate
      service={service}
      heroBadge="Red-Carpet Evening Soirée • Soumili's Makeover"
      accentQuote="Mesmerizing ballroom allure crafted with sculpted cheekbones and dramatic eye artistry."
      relatedPackagesFilter="Reception"
    />
  );
}
