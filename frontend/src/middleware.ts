import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // 1. Enforce HTTPS redirects in production (excluding localhost/127.0.0.1)
  if (
    process.env.NODE_ENV === 'production' &&
    request.headers.get('x-forwarded-proto') !== 'https' &&
    !request.url.includes('localhost') &&
    !request.url.includes('127.0.0.1')
  ) {
    const host = request.headers.get('host') || request.nextUrl.host;
    return NextResponse.redirect(
      `https://${host}${request.nextUrl.pathname}${request.nextUrl.search}`,
      301
    );
  }

  // 2. Server-side session verification for Admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.redirect(new URL('/login/', request.url));
    }

    try {
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${backendUrl}/api/auth/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        return NextResponse.redirect(new URL('/login/', request.url));
      }

      const user = await res.json();
      if (user.role !== 'admin') {
        return NextResponse.redirect(new URL('/dashboard/', request.url));
      }
    } catch (err) {
      console.error('Admin middleware session verification failed:', err);
      return NextResponse.redirect(new URL('/login/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  /*
   * Match all request paths except for the ones starting with:
   * - api (API routes)
   * - _next/static (static files)
   * - _next/image (image optimization files)
   * - favicon.ico (favicon file)
   */
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
