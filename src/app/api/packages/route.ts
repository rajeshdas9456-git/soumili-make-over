import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { isAuthenticatedAdmin } from '@/lib/auth';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const all = url.searchParams.get('all') === 'true';
  const isAuth = await isAuthenticatedAdmin();
  
  // Public visitors only see published packages
  const packages = db.getPackages(!all || !isAuth);
  return NextResponse.json(packages);
}

export async function POST(req: Request) {
  const isAuth = await isAuthenticatedAdmin();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    if (!body.name || !body.price) {
      return NextResponse.json({ error: 'Name and price are required' }, { status: 400 });
    }
    const saved = db.savePackage(body);
    return NextResponse.json({ success: true, package: saved });
  } catch (error) {
    console.error('Save package error:', error);
    return NextResponse.json({ error: 'Failed to save package' }, { status: 500 });
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
    db.deletePackage(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete package' }, { status: 500 });
  }
}
