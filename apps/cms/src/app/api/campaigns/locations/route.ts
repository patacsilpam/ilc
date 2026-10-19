import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getUserFromRequest, requireAdmin } from '@/lib/auth';
import { validateLocationInput } from '@ilc/shared';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const user = getUserFromRequest(req);
    const isAdmin = user && ['admin', 'editor', 'super_admin'].includes(user.role);
    const activeOnly = !isAdmin;

    const locations = db.getCampaignLocations(activeOnly);
    return NextResponse.json({ success: true, locations });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch locations' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { errorResponse, user } = requireAdmin(req);
    if (errorResponse) return errorResponse;

    const body = await req.json();
    const validation = validateLocationInput(body);

    if (!validation.valid) {
      return NextResponse.json({ error: 'Validation failed', details: validation.errors }, { status: 400 });
    }

    const loc = db.createCampaignLocation(
      {
        name: body.name.trim(),
        description: body.description?.trim() || undefined,
        latitude: body.latitude,
        longitude: body.longitude,
        radius_meters: body.radius_meters,
        is_active: body.is_active !== undefined ? !!body.is_active : true,
        associated_campaign_id: body.associated_campaign_id || null,
      },
      user!.id
    );

    return NextResponse.json({ success: true, location: loc }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to create location' }, { status: 500 });
  }
}
