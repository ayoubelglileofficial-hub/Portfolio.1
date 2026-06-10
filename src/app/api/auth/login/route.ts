import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { createSession } from '@/lib/auth';

export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const body = await request.json();
        const email = typeof body?.email === 'string' ? body.email.trim() : '';
        const password = typeof body?.password === 'string' ? body.password : '';

        if (!email || !password || password.length < 8) {
            return NextResponse.json(
                { error: 'Please enter a valid email and password.' },
                { status: 400 }
            );
        }

        // check user
        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json(
                { error: 'Invalid email or password' },
                { status: 401 }
            );
        }

        // check password
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return NextResponse.json(
                { error: 'Invalid email or password' },
                { status: 401 }
            );
        }

        // create session
        await createSession(user.email, user.role);

        return NextResponse.json({
            success: true,
            user: {
                email: user.email,
                role: user.role,
            },
        });

    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}