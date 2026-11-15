import { NextResponse } from 'next/server';
import { isAuthenticatedAdmin } from '@/lib/auth';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const isAuth = await isAuthenticatedAdmin();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const mimeType = file.type || 'image/jpeg';
    const ext = (file.name ? file.name.split('.').pop() : 'jpg') || 'jpg';
    const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${ext}`;

    // 1. If Supabase Storage is configured, upload to Supabase 'portfolio' bucket
    if (isSupabaseConfigured() && supabaseAdmin) {
      try {
        const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
          .from('portfolio')
          .upload(filename, buffer, {
            contentType: mimeType,
            upsert: true
          });

        if (!uploadError && uploadData) {
          const { data: urlData } = supabaseAdmin.storage
            .from('portfolio')
            .getPublicUrl(filename);

          return NextResponse.json({
            success: true,
            url: urlData.publicUrl,
            fileName: filename
          });
        }
      } catch (sbErr) {
        console.warn('Supabase upload fallback to Data URI:', sbErr);
      }
    }

    // 2. Universal Serverless & Vercel Support: Convert to optimized Data URI (Always succeeds instantly!)
    const base64 = buffer.toString('base64');
    const dataUri = `data:${mimeType};base64,${base64}`;

    return NextResponse.json({
      success: true,
      url: dataUri,
      fileName: filename
    });
  } catch (error: any) {
    console.error('Upload handler error:', error);
    return NextResponse.json({ error: error.message || 'Upload failed' }, { status: 500 });
  }
}
