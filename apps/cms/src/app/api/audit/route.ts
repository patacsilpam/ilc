import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { errorResponse } = requireAdmin(req);
    if (errorResponse) return errorResponse;

    const events = db.getAuditEvents(100);
    return NextResponse.json({ success: true, audit_events: events });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch audit events' }, { status: 500 });
  }
}
