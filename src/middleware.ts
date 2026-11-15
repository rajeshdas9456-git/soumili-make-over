import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const SECRET = process.env.ADMIN_JWT_SECRET || 'luxury-bridal-secret-salt-3849182390';

// Edge runtime compatible verification
function verifyAdminTokenEdge(token: string): boolean {
  try {
    const [payloadB64] = token.split('.');
    if (!payloadB64) return false;
    const jsonStr = atob(payloadB64);
    const payload = JSON.parse(jsonStr);
    if (!payload || payload.role !== 'admin') return false;
    if (payload.exp && payload.exp < Date.now()) return false;
    return true;
  } catch {
    return false;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /admin routes except /admin/login
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const token = request.cookies.get('admin_token')?.value;

    if (!token || !verifyAdminTokenEdge(token)) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
