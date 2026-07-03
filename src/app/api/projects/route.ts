import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Project from '@/models/Project';
import { isAuthenticated } from '@/lib/auth';
import { ProjectCreateSchema } from '@/types/project';

function handleMongoError(error: unknown, fallback: string) {
  if (error instanceof Error && 'code' in error && (error as any).code === 11000) {
    return NextResponse.json({ error: 'A project with this name already exists' }, { status: 409 });
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
    const projects = await Project.find().sort({ order_index: 1 }).lean();
    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!isAuthenticated(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const parsed = ProjectCreateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.issues },
        { status: 400 }
      );
    }

    await connectDB();
    const project = await Project.create(parsed.data);
    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    return handleMongoError(error, 'Failed to create project');
  }
}
