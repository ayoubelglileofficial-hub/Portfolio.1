import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Certification from '@/models/Certification';
import { isAuthenticated } from '@/lib/auth';
import { CertificationUpdateSchema } from '@/types/certification';

function handleMongoError(error: unknown, fallback: string) {
  if (error instanceof Error && error.name === 'ValidationError') {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  console.error(fallback, error);
  return NextResponse.json({ error: fallback }, { status: 500 });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!isAuthenticated(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { id } = await params;
    const body = await request.json();
    const parsed = CertificationUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.issues },
        { status: 400 }
      );
    }
    await connectDB();
    const certification = await Certification.findByIdAndUpdate(
      id,
      { ...parsed.data, updated_at: new Date() },
      { new: true, runValidators: true }
    ).lean();
    if (!certification) {
      return NextResponse.json({ error: 'Certification not found' }, { status: 404 });
    }
    return NextResponse.json(certification);
  } catch (error) {
    return handleMongoError(error, 'Failed to update certification');
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!isAuthenticated(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { id } = await params;
    await connectDB();
    const certification = await Certification.findByIdAndDelete(id).lean();
    if (!certification) {
      return NextResponse.json({ error: 'Certification not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Certification deleted successfully' });
  } catch (error) {
    return handleMongoError(error, 'Failed to delete certification');
  }
}
