import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { errorResponse } = requireAdmin(req);
    if (errorResponse) return errorResponse;

    const campaigns = db.getNotificationCampaigns();
    return NextResponse.json({ success: true, campaigns });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch campaigns' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { errorResponse, user } = requireAdmin(req);
    if (errorResponse) return errorResponse;

    const body = await req.json();

    if (body.action === 'broadcast') {
      if (!body.campaign_id) {
        return NextResponse.json({ error: 'campaign_id is required for broadcast' }, { status: 400 });
      }
      const broadcasted = db.submitNotificationBroadcast(body.campaign_id, user!.id);
      return NextResponse.json({ success: true, campaign: broadcasted });
    }

    if (!body.title || !body.message) {
      return NextResponse.json({ error: 'Title and message are required' }, { status: 400 });
    }

    const campaign = db.createNotificationCampaign(
      {
        title: body.title.trim(),
        message: body.message.trim(),
        deep_link: body.deep_link || null,
        status: 'draft',
        scheduled_at: body.scheduled_at || null,
        target_audience: body.target_audience || 'all',
        created_by: user!.id,
      },
      user!.id
    );

    return NextResponse.json({ success: true, campaign }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to process notification campaign' }, { status: 500 });
  }
}
