import React from 'react';
import type { Metadata } from 'next';
import ServiceDetailTemplate from '@/components/ServiceDetailTemplate';
import { db } from '@/lib/db';
import { initialServices } from '@/lib/initialData';

export const metadata: Metadata = {
  title: "Luxury Bridal Makeup | HD & Airbrush Royal Makeovers | Soumili's Makeover",
  description: "Signature luxury bridal makeup by Soumili. Flawless 4K camera-ready skin, bespoke dupatta draping, and waterproof lash artistry.",
};

export const revalidate = 0;

export default async function BridalMakeupPage() {
  let service = initialServices.find((s) => s.slug === 'bridal-makeup') || initialServices[0];

  try {
    const s = db.getServiceBySlug('bridal-makeup') || db.getServices().find((s) => s.slug === 'bridal-makeup');
    if (s) service = s;
  } catch {}

  return (
    <ServiceDetailTemplate
      service={service}
      heroBadge="Signature Bridal Artistry • Soumili's Makeover"
      accentQuote="Creating an ethereal, regal bridal presence that radiates beauty, elegance, and perfection."
      relatedPackagesFilter="Bridal"
    />
  );
}
