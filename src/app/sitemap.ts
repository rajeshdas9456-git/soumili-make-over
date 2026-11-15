import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://aurabridal.com';
  const routes = [
    '',
    '/about',
    '/bridal-makeup',
    '/party-makeup',
    '/engagement-makeup',
    '/reception-makeup',
    '/services',
    '/pricing',
    '/gallery',
    '/testimonials',
    '/contact',
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly',
    priority: route === '' ? 1.0 : 0.8,
  }));
}
