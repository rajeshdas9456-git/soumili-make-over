import React from 'react';
import type { Metadata } from 'next';
import ServiceDetailTemplate from '@/components/ServiceDetailTemplate';
import { db } from '@/lib/db';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  title: "Engagement & Sagan Makeup | Soft Glam & Dewy Look | Soumili's Makeover",
  description: "Romantic, dewy engagement makeup that enhances natural features with soft pink hues and whimsical hairstyles by Soumili's Makeover.",
};

export const revalidate = 0;

export default async function EngagementMakeupPage() {
  const service = db.getServiceBySlug('engagement-makeup') || db.getServices()[2] || db.getServices()[0];
  if (!service) return notFound();

  return (
    <ServiceDetailTemplate
      service={service}
      heroBadge="Romantic Ring Ceremony • Soumili's Makeover"
      accentQuote="Soft-focus radiance and dreamy nuances for unforgettable daytime and twilight ceremonies."
      relatedPackagesFilter="Engagement"
    />
  );
}
