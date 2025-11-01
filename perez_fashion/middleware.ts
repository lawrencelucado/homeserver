import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';

  // Handle admin subdomain
  if (hostname.startsWith('admin.')) {
    const url = request.nextUrl.clone();

    // If already on /admin path, allow it through
    if (url.pathname.startsWith('/admin')) {
      return NextResponse.next();
    }

    // Redirect root of admin subdomain to /admin
    if (url.pathname === '/') {
      url.pathname = '/admin';
      return NextResponse.redirect(url);
    }

    // For any other path on admin subdomain, redirect to /admin
    url.pathname = '/admin';
    return NextResponse.redirect(url);
  }

  // Default: allow request to continue
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
