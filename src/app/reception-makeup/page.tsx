import React from 'react';
import type { Metadata } from 'next';
import ServiceDetailTemplate from '@/components/ServiceDetailTemplate';
import { db } from '@/lib/db';
import { initialServices } from '@/lib/initialData';

export const metadata: Metadata = {
  title: "Reception Makeup | Glamour & Red-Carpet Elegance | Soumili's Makeover",
  description: "Modern evening glam, sculptured contours, and red-carpet hairstyles crafted by Soumili's Makeover for your luxury reception night.",
};

export const revalidate = 0;

export default async function ReceptionMakeupPage() {
  let service = initialServices.find((s) => s.slug === 'reception-makeup') || initialServices[1] || initialServices[0];

  try {
    const s = db.getServiceBySlug('reception-makeup') || db.getServices().find((s) => s.slug === 'reception-makeup');
    if (s) service = s;
  } catch {}

  return (
    <ServiceDetailTemplate
      service={service}
      heroBadge="Reception Glamour • Soumili's Makeover"
      accentQuote="Mesmerizing evening radiance designed to shine under ballroom chandeliers and flash photography."
      relatedPackagesFilter="Reception"
    />
  );
}
