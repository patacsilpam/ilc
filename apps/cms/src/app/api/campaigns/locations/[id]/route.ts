import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { errorResponse, user } = requireAdmin(req);
    if (errorResponse) return errorResponse;

    const updates = await req.json();
    const updated = db.updateCampaignLocation(params.id, updates, user!.id);

    return NextResponse.json({ success: true, location: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update location' }, { status: 500 });
  }
}
