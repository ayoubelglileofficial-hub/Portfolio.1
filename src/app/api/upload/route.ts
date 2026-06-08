import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/mongodb';
import Profile from '@/models/Profile';

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
        }

        const body = await req.json();
        await dbConnect();

        const updateData = {
            full_name: body.full_name,
            title: body.title,
            short_bio: body.short_bio,
            email: body.email,
            phone: body.phone || '',
            location: body.location || '',
            avatar_url: body.avatar_url || '',
            website_logo: body.website_logo || '',
            github_url: body.github_url || '',
            linkedin_url: body.linkedin_url || '',
            website_url: body.website_url || '',
            bio_1: body.bio_1 || '',
            bio_2: body.bio_2 || '',
            bio_3: body.bio_3 || '',
            updated_at: new Date(),
        };

        await Profile.findByIdAndUpdate('prof_001', updateData, { new: true, upsert: true });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Update error:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}