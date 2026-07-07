import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Certification from '@/models/Certification';
import { isAuthenticated } from '@/lib/auth';
import { CertificationCreateSchema } from '@/types/certification';

function handleMongoError(error: unknown, fallback: string) {
  if (error instanceof Error && error.name === 'ValidationError') {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  console.error(fallback, error);
  return NextResponse.json({ error: fallback }, { status: 500 });
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const isAdmin = isAuthenticated(request);
    const filter = isAdmin ? {} : { isVisible: true };
    const certifications = await Certification.find(filter).sort({ order_index: 1 }).lean();
    return NextResponse.json(certifications);
  } catch (error) {
    console.error('Error fetching certifications:', error);
    return NextResponse.json({ error: 'Failed to fetch certifications' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!isAuthenticated(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const body = await request.json();
    const parsed = CertificationCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.issues },
        { status: 400 }
      );
    }
    await connectDB();
    const certification = await Certification.create(parsed.data);
    return NextResponse.json(certification, { status: 201 });
  } catch (error) {
    return handleMongoError(error, 'Failed to create certification');
  }
}
