import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { errorResponse, user } = requireAdmin(req);
    if (errorResponse) return errorResponse;

    const body = await req.json();
    const updated = db.updateFeedbackStatus(params.id, body.status, body.admin_notes, user!.id);

    return NextResponse.json({ success: true, feedback: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update feedback' }, { status: 500 });
  }
}
