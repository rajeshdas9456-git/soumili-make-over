import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { isAuthenticatedAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const all = url.searchParams.get('all') === 'true';
  const isAuth = await isAuthenticatedAdmin();
  
  const images = await db.getGalleryAsync(!all || !isAuth);
  const categories = await db.getCategoriesAsync();
  
  return NextResponse.json({ images, categories });
}

export async function POST(req: Request) {
  const isAuth = await isAuthenticatedAdmin();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    if (!body.title || !body.image_url) {
      return NextResponse.json({ error: 'Title and image URL are required' }, { status: 400 });
    }
    const saved = db.saveGalleryImage(body);
    return NextResponse.json({ success: true, image: saved });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save gallery image' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const isAuth = await isAuthenticatedAdmin();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }
    db.deleteGalleryImage(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete gallery image' }, { status: 500 });
  }
}
