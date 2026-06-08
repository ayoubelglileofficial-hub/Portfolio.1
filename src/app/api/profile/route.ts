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

// PATCH 
export async function PATCH(request: NextRequest) {  
    try {
        // 🔐 التحقق من المصادقة
        if (!isAuthenticated(request)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();
        const body = await request.json();
        const updateBody = {
            ...body,
            updated_at: new Date(),
        };

        if (typeof updateBody.isVisible === 'string') {
            updateBody.isVisible = updateBody.isVisible === 'true';
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