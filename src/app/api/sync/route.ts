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
    }
    if (packages && Array.isArray(packages)) {
      db.setPackages(packages);
    }
    if (gallery && Array.isArray(gallery)) {
      db.setGallery(gallery);
    }
    if (services && Array.isArray(services)) {
      db.setServices(services);
    }
    if (categories && Array.isArray(categories)) {
      db.setCategories(categories);
    }
    if (testimonials && Array.isArray(testimonials)) {
      db.setTestimonials(testimonials);
    }

    // Automatically save permanently to src/lib/initialData.ts so Vercel builds retain everything
    db.persistToInitialData();

    return NextResponse.json({
      success: true,
      message: 'All website data successfully synced to disk & database!'
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Sync failed' }, { status: 500 });
  }
}
