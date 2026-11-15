import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { isAuthenticatedAdmin } from '@/lib/auth';
import { syncCloudData } from '@/lib/cloudSync';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [settings, packages, gallery, services, categories, testimonials] = await Promise.all([
      db.getSettingsAsync(),
      db.getPackagesAsync(true),
      db.getGalleryAsync(true),
      db.getServicesAsync(),
      db.getCategoriesAsync(),
      db.getTestimonialsAsync(true)
    ]);

    return NextResponse.json({
      success: true,
      data: {
        settings,
        packages,
        gallery,
        services,
        categories,
        testimonials
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Sync fetch failed' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const isAuth = await isAuthenticatedAdmin();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { settings, packages, gallery, services, categories, testimonials } = body;

    if (settings) {
      db.updateSettings(settings);
      syncCloudData('settings', settings);
    }
    if (packages && Array.isArray(packages)) {
      packages.forEach(p => db.savePackage(p));
      syncCloudData('packages', packages);
    }
    if (gallery && Array.isArray(gallery)) {
      gallery.forEach(g => db.saveGalleryImage(g));
      syncCloudData('gallery', gallery);
    }
    if (services && Array.isArray(services)) {
      services.forEach(s => db.saveService(s));
      syncCloudData('services', services);
    }
    if (categories && Array.isArray(categories)) {
      categories.forEach(c => db.saveCategory(c));
      syncCloudData('categories', categories);
    }
    if (testimonials && Array.isArray(testimonials)) {
      testimonials.forEach(t => db.saveTestimonial(t));
      syncCloudData('testimonials', testimonials);
    }

    return NextResponse.json({
      success: true,
      message: 'All website data successfully synced to Cloud & Mobile!'
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Sync failed' }, { status: 500 });
  }
}
