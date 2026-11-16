import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { isAuthenticatedAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const all = url.searchParams.get('all') === 'true';
  const isAuth = await isAuthenticatedAdmin();
  
  const testimonials = await db.getTestimonialsAsync(!all || !isAuth);
  return NextResponse.json(testimonials);
}

export async function POST(req: Request) {
  const isAuth = await isAuthenticatedAdmin();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    if (!body.client_name || !body.quote) {
      return NextResponse.json({ error: 'Client name and quote are required' }, { status: 400 });
    }
    const saved = await db.saveTestimonialAsync(body);
    return NextResponse.json({ success: true, testimonial: saved });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save testimonial' }, { status: 500 });
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
    await db.deleteTestimonialAsync(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete testimonial' }, { status: 500 });
  }
}
