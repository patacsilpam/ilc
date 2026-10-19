import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const user = getUserFromRequest(req);
    const body = await req.json();

    if (!body.event_name) {
      return NextResponse.json({ error: 'event_name is required' }, { status: 400 });
    }

    // Strict allowlist for event properties
    const safeProps: Record<string, any> = {};
    const allowedKeys = ['video_id', 'video_title', 'duration', 'progress', 'category', 'screen', 'action', 'destination'];

    if (body.event_properties && typeof body.event_properties === 'object') {
      for (const key of allowedKeys) {
        if (body.event_properties[key] !== undefined) {
          safeProps[key] = body.event_properties[key];
        }
      }
    }

    const event = db.trackAnalytics(body.event_name, safeProps, user?.id || body.user_id);
    return NextResponse.json({ success: true, event });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Analytics ingestion error' }, { status: 500 });
  }
}
