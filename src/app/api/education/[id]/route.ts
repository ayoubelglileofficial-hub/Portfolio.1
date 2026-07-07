import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Education from '@/models/Education';
import { isAuthenticated } from '@/lib/auth';
import { EducationUpdateSchema } from '@/types/education';

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
    const parsed = EducationUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.issues },
        { status: 400 }
      );
    }

    await connectDB();
    const education = await Education.findByIdAndUpdate(
      id,
      { ...parsed.data, updated_at: new Date() },
      { new: true, runValidators: true }
    ).lean();

    if (!education) {
      return NextResponse.json({ error: 'Education not found' }, { status: 404 });
    }

    return NextResponse.json(education);
  } catch (error) {
    return handleMongoError(error, 'Failed to update education');
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
    const education = await Education.findByIdAndDelete(id).lean();

    if (!education) {
      return NextResponse.json({ error: 'Education not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Education deleted successfully' });
  } catch (error) {
    return handleMongoError(error, 'Failed to delete education');
  }
}
