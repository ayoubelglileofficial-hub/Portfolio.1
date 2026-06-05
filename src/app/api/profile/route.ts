import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Profile from '@/models/Profile';

export async function GET() {
    try {
        await connectDB();
        const profile = await Profile.findOne({ _id: 'prof_001' }).lean();

        if (!profile) {
            return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
        }

        return NextResponse.json(profile);
    } catch (error) {
        console.error('Error fetching profile:', error);
        return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
    }
}

// ← NEW: PATCH handler to update profile fields (including isVisible)
export async function PATCH(request: Request) {
    try {
        await connectDB();
        const body = await request.json();

        const updatedProfile = await Profile.findOneAndUpdate(
            { _id: 'prof_001' },
            { 
                ...body,
                updated_at: new Date() 
            },
            { new: true, runValidators: true }
        ).lean();

        if (!updatedProfile) {
            return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
        }

        return NextResponse.json(updatedProfile);
    } catch (error) {
        console.error('Error updating profile:', error);
        return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
    }
}