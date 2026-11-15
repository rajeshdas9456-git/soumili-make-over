import { NextResponse } from 'next/server';
import { isAuthenticatedAdmin } from '@/lib/auth';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const isAuth = await isAuthenticatedAdmin();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const contentType = req.headers.get('content-type') || '';
    
    // Case A: Multipart form data upload
    if (contentType.includes('multipart/form-data')) {
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

      // 1. Supabase Storage if configured
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
          console.warn('Supabase storage fallback:', sbErr);
        }
      }

      // 2. Safe Data URI fallback (Lightweight for web images)
      const base64 = buffer.toString('base64');
      const dataUri = `data:${mimeType};base64,${base64}`;

      return NextResponse.json({
        success: true,
        url: dataUri,
        fileName: filename
      });
    }

    // Case B: Direct JSON with Base64 or image URL
    if (contentType.includes('application/json')) {
      const body = await req.json();
      if (body.dataUrl) {
        return NextResponse.json({
          success: true,
          url: body.dataUrl,
          fileName: `upload-${Date.now()}.jpg`
        });
      }
    }

    return NextResponse.json({ error: 'Invalid upload format' }, { status: 400 });
  } catch (error: any) {
    console.error('Upload handler error:', error);
    return NextResponse.json({ error: error.message || 'Upload failed' }, { status: 500 });
  }
}
