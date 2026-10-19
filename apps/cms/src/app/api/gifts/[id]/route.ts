import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { errorResponse, user } = requireAdmin(req);
    if (errorResponse) return errorResponse;

    const updates = await req.json();
    const updated = db.updateWelcomeGift(params.id, updates, user!.id);

    return NextResponse.json({ success: true, gift: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update gift' }, { status: 500 });
  }
}
