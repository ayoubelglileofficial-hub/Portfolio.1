import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';

export async function POST(req: NextRequest) {
    try {
        if (!isAuthenticated(req)) {
            return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
        }

        return NextResponse.json({ error: 'Non supporté' }, { status: 501 });
    } catch (error) {
        console.error('Update error:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}