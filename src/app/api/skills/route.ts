import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Skill from '@/models/Skill';
import { isAuthenticated } from '@/lib/auth';

function handleMongoError(error: unknown, fallback: string) {
  if (error instanceof Error && 'code' in error && (error as any).code === 11000) {
    return NextResponse.json({ error: 'A skill with this slug already exists' }, { status: 409 });
  }
  if (error instanceof Error && error.name === 'ValidationError') {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  console.error(fallback, error);
  return NextResponse.json({ error: fallback }, { status: 500 });
}

export async function GET() {
  try {
    await connectDB();
    const skills = await Skill.find().sort({ order_index: 1 }).lean();
    return NextResponse.json(skills);
  } catch (error) {
    console.error('Error fetching skills:', error);
    return NextResponse.json({ error: 'Failed to fetch skills' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!isAuthenticated(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const body = await request.json();
    const skill = await Skill.create(body);
    return NextResponse.json(skill, { status: 201 });
  } catch (error) {
    return handleMongoError(error, 'Failed to create skill');
  }
}
