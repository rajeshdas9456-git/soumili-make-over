import React from 'react';
import type { Metadata } from 'next';
import ServiceDetailTemplate from '@/components/ServiceDetailTemplate';
import { db } from '@/lib/db';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  title: "Party & Sangeet Makeup | Glam Cocktail Styling | Soumili's Makeover",
  description: "Striking, trend-forward makeup for cocktail evenings, sangeet dances, bridesmaids and VIP wedding guests by Soumili's Makeover.",
};

export const revalidate = 0;

export default async function PartyMakeupPage() {
  const service = db.getServiceBySlug('party-makeup') || db.getServices()[3] || db.getServices()[0];
  if (!service) return notFound();

  return (
    <ServiceDetailTemplate
      service={service}
      heroBadge="Festive Glamour & Sangeet • Soumili's Makeover"
      accentQuote="Radiant, dance-proof artistry engineered to shine all night under festive lights."
      relatedPackagesFilter="Party"
    />
  );
}
