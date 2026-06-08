import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const SESSION_TOKEN = 'auth_session';

// secured routes
const protectedRoutes = ['/admin', '/dashboard'];
// public routes (like login)
const publicRoutes = ['/login'];

export function proxy(request: NextRequest) {
    const session = request.cookies.get(SESSION_TOKEN);
    const { pathname } = request.nextUrl;

    // if user is not authenticated and tries to access protected route, redirect to login
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

    if (isProtectedRoute && !session) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('from', pathname);
        return NextResponse.redirect(loginUrl);
    }

    // if user is authenticated and tries to access public route (like login), redirect to home
    const isPublicRoute = publicRoutes.some(route => pathname === route);
    if (isPublicRoute && session) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/login', '/admin/:path*', '/dashboard/:path*'],
};
