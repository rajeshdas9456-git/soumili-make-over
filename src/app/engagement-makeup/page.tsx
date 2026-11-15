import React from 'react';
import type { Metadata } from 'next';
import ServiceDetailTemplate from '@/components/ServiceDetailTemplate';
import { db } from '@/lib/db';
import { initialServices } from '@/lib/initialData';

export const metadata: Metadata = {
  title: "Engagement & Sagan Makeup | Soft Glam & Romantic Aesthetics | Soumili's Makeover",
  description: "Dewy skin, romantic pastels, and effortless styling for ring ceremonies and intimate celebrations by Soumili's Makeover.",
};

export const revalidate = 0;

export default async function EngagementMakeupPage() {
  let service = initialServices.find((s) => s.slug === 'engagement-makeup') || initialServices[2] || initialServices[0];

  try {
    const s = db.getServiceBySlug('engagement-makeup') || db.getServices().find((s) => s.slug === 'engagement-makeup');
    if (s) service = s;
  } catch {}

  return (
    <ServiceDetailTemplate
      service={service}
      heroBadge="Engagement Aesthetics • Soumili's Makeover"
      accentQuote="Subtle, romantic elegance that highlights your authentic grace during intimate ceremonies."
      relatedPackagesFilter="Engagement"
    />
  );
}
