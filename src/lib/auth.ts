import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const SESSION_TOKEN = 'auth_session';

// Hash the password
export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
}

// Compare passwords
export async function comparePassword(password: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(password, hashed);
}

// Create session (simple - in production use JWT or NextAuth)
export async function createSession(email: string, role: string) {
    const cookieStore = await cookies();
    const sessionValue = `${email}|${role}`;

    cookieStore.set(SESSION_TOKEN, sessionValue, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24, // 1 day
        path: '/',
    });
}

// Log Out
export async function destroySession() {
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_TOKEN);
}

export async function getSession(): Promise<string | null> {
    const cookieStore = await cookies();
    return cookieStore.get(SESSION_TOKEN)?.value || null;
}

export async function getSessionData(): Promise<{ email: string; role: string } | null> {
    const sessionValue = await getSession();
    if (!sessionValue) return null;

    const [email, role] = sessionValue.split('|');
    if (!email || !role) return null;

    return { email, role };
}

// Middleware helper 
export function isAuthenticated(request: NextRequest): boolean {
    const sessionCookie = request.cookies.get(SESSION_TOKEN);
    return !!sessionCookie?.value;
}

// secureAPI Routes
export function protectRoute(handler: Function) {
    return async (request: NextRequest, context: any) => {
        if (!isAuthenticated(request)) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }
        return handler(request, context);
    };
}