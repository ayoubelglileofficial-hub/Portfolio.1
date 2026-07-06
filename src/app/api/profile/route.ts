// import { NextResponse } from 'next/server';
// import connectDB from '@/lib/mongodb';
// import Profile from '@/models/Profile';

// export async function GET() {
//     try {
//         await connectDB();
//         const profile = await Profile.findOne({ _id: 'prof_001' }).lean();

//         if (!profile) {
//             return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
//         }

//         return NextResponse.json(profile);
//     } catch (error) {
//         console.error('Error fetching profile:', error);
//         return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
//     }
// }

// // ← NEW: PATCH handler to update profile fields (including isVisible)
// export async function PATCH(request: Request) {
//     try {
//         await connectDB();
//         const body = await request.json();
//         const updateBody = {
//             ...body,
//             updated_at: new Date(),
//         };

//         if (typeof updateBody.isVisible === 'string') {
//             updateBody.isVisible = updateBody.isVisible === 'true';
//         }

//         const updatedProfile = await Profile.findOneAndUpdate(
//             { _id: 'prof_001' },
//             updateBody,
//             { new: true, runValidators: true }
//         ).lean();

//         if (!updatedProfile) {
//             return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
//         }

//         return NextResponse.json(updatedProfile);
//     } catch (error) {
//         console.error('Error updating profile:', error);
//         return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
//     }
// }


import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Profile from '@/models/Profile';
import { isAuthenticated } from '@/lib/auth';

// GET profile data
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

const ALLOWED_FIELDS = [
    'full_name', 'title', 'short_bio', 'email', 'phone', 'location',
    'avatar_url', 'website_logo', 'github_url', 'linkedin_url',
    'bio_1', 'bio_2', 'bio_3', 'isVisible', 'show_skills', 'show_projects', 'show_services',
];

// PATCH 
export async function PATCH(request: NextRequest) {  
    try {
        // 🔐 التحقق من المصادقة
        if (!isAuthenticated(request)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();
        const body = await request.json();
        const updateBody: Record<string, unknown> = { updated_at: new Date() };
        for (const field of ALLOWED_FIELDS) {
            if (field in body) {
                updateBody[field] = body[field];
            }
        }

        if (typeof updateBody.isVisible === 'string') {
            updateBody.isVisible = updateBody.isVisible === 'true';
        }
        if (typeof updateBody.show_skills === 'string') {
            updateBody.show_skills = updateBody.show_skills === 'true';
        }
        if (typeof updateBody.show_projects === 'string') {
            updateBody.show_projects = updateBody.show_projects === 'true';
        }
        if (typeof updateBody.show_services === 'string') {
            updateBody.show_services = updateBody.show_services === 'true';
        }

        const updatedProfile = await Profile.findOneAndUpdate(
            { _id: 'prof_001' },
            updateBody,
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