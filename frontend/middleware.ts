import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/jwt';

// List of routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/profile',
  '/community',  // Add this line to protect the community page
  '/community/create',
];

// Routes that should be accessible only to non-authenticated users
const authRoutes = [
  '/login',
  '/register',
];

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const path = request.nextUrl.pathname;
  
  // Check if the path is a protected route
  const isProtectedRoute = protectedRoutes.some(route => 
    path.startsWith(route)
  );
  
  // Check if the path is an auth route (login/register)
  const isAuthRoute = authRoutes.some(route => 
    path.startsWith(route)
  );

  // Verify token
  const payload = token ? verifyToken(token) : null;
  const isAuthenticated = !!payload;

  // Redirect logic
  if (isProtectedRoute && !isAuthenticated) {
    // Redirect to login if trying to access protected route without auth
    const url = new URL('/login', request.url);
    url.searchParams.set('from', path);
    return NextResponse.redirect(url);
  }

  if (isAuthRoute && isAuthenticated) {
    // Redirect to home if trying to access auth routes while logged in
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

// Configure middleware to run only on specified routes
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|logo.png|.*\\.png|.*\\.jpg).*)',
  ],
};