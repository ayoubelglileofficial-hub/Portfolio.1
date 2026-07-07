import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Service from '@/models/Service';
import { isAuthenticated } from '@/lib/auth';
import { ServiceCreateSchema } from '@/types/service';

function handleMongoError(error: unknown, fallback: string) {
  if (error instanceof Error && error.name === 'ValidationError') {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  console.error(fallback, error);
  return NextResponse.json({ error: fallback }, { status: 500 });
}

async function generateNextId() {
  const services = await Service.find({}, { _id: 1 }).lean();
  const nums = services.map((s) => {
    const match = String(s._id).match(/^serv_(\d+)$/);
    return match ? parseInt(match[1], 10) : 0;
  });
  const max = nums.length > 0 ? Math.max(...nums) : 0;
  return `serv_${String(max + 1).padStart(3, '0')}`;
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const isAdmin = isAuthenticated(request);
    const filter = isAdmin ? {} : { isVisible: true };
    const services = await Service.find(filter).sort({ order_index: 1 }).lean();
    return NextResponse.json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!isAuthenticated(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const parsed = ServiceCreateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.issues },
        { status: 400 }
      );
    }

    await connectDB();
    const _id = await generateNextId();
    const service = await Service.create({ _id, ...parsed.data });
    return NextResponse.json(service, { status: 201 });
  } catch (error) {
    return handleMongoError(error, 'Failed to create service');
  }
}
