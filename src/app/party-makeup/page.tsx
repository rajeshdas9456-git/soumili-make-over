import React from 'react';
import type { Metadata } from 'next';
import ServiceDetailTemplate from '@/components/ServiceDetailTemplate';
import { db } from '@/lib/db';
import { initialServices } from '@/lib/initialData';

export const metadata: Metadata = {
  title: "Cocktail & Party Makeup | High-Fashion Event Styling | Soumili's Makeover",
  description: "Sensational looks for bridesmaids, cocktail parties, and festive celebrations by Soumili's Makeover.",
};

export const revalidate = 0;

export default async function PartyMakeupPage() {
  let service = initialServices.find((s) => s.slug === 'party-makeup') || initialServices[3] || initialServices[0];

  try {
    const s = db.getServiceBySlug('party-makeup') || db.getServices().find((s) => s.slug === 'party-makeup');
    if (s) service = s;
  } catch {}

  return (
    <ServiceDetailTemplate
      service={service}
      heroBadge="Celebration Artistry • Soumili's Makeover"
      accentQuote="Dazzling beauty transformations crafted for red-carpet appearances and night celebrations."
      relatedPackagesFilter="Party"
    />
  );
}
