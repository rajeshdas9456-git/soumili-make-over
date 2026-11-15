import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { isAuthenticatedAdmin } from '@/lib/auth';

export async function GET() {
  const isAuth = await isAuthenticatedAdmin();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const enquiries = db.getEnquiries();
  return NextResponse.json(enquiries);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.client_name || !body.phone || !body.event_date) {
      return NextResponse.json({ error: 'Name, phone and event date are required' }, { status: 400 });
    }
    const saved = db.saveEnquiry(body);
    return NextResponse.json({ success: true, enquiry: saved });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to record enquiry' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const isAuth = await isAuthenticatedAdmin();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id, status } = await req.json();
    if (!id || !status) {
      return NextResponse.json({ error: 'ID and status required' }, { status: 400 });
    }
    db.updateEnquiryStatus(id, status);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update enquiry' }, { status: 500 });
  }
}
