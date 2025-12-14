import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Routes that require authentication
const protectedRoutes = ['/dashboard', '/clients', '/cases', '/documents', '/settings', '/billing'];

// Routes that should redirect to dashboard if already logged in
const authRoutes = ['/login', '/register'];

// Multi-tenant subdomain handling
const getSubdomain = (host: string) => {
  const parts = host.split('.');
  if (parts.length > 2) {
    return parts[0];
  }
  return null;
};

export async function middleware(request: NextRequest) {
  const { pathname, host } = request.nextUrl;
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  // Get subdomain for multi-tenant routing
  const subdomain = getSubdomain(host);

  // Handle landing pages (subdomain routing)
  if (subdomain && subdomain !== 'www' && subdomain !== 'app') {
    // Rewrite to landing page route
    const url = request.nextUrl.clone();
    url.pathname = `/landing/${subdomain}${pathname}`;
    return NextResponse.rewrite(url);
  }

  // Handle client portal routes
  if (pathname.startsWith('/portal')) {
    // Client portal has its own authentication
    // Handled by the portal route handlers
    return NextResponse.next();
  }

  // Check if route requires authentication
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // Redirect to login if accessing protected route without auth
  if (isProtectedRoute && !token) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(url);
  }

  // Redirect to dashboard if accessing auth routes while logged in
  if (isAuthRoute && token) {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  // Add organization context to headers for API routes
  if (pathname.startsWith('/api') && token) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', token.id as string);

    // If organization ID is in the request, add it to headers
    const orgId = request.nextUrl.searchParams.get('organizationId');
    if (orgId) {
      requestHeaders.set('x-organization-id', orgId);
    }

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api/auth (NextAuth routes)
     */
    '/((?!_next/static|_next/image|favicon.ico|public|api/auth).*)',
  ],
};
