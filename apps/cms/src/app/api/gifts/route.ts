import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getUserFromRequest, requireAdmin } from '@/lib/auth';
import { validateWelcomeGiftInput } from '@ilc/shared';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const user = getUserFromRequest(req);
    const isAdmin = user && ['admin', 'editor', 'super_admin'].includes(user.role);
    const activeOnly = !isAdmin;

    const gifts = db.getWelcomeGifts(activeOnly);
    return NextResponse.json({ success: true, gifts });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch gifts' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { errorResponse, user } = requireAdmin(req);
    if (errorResponse) return errorResponse;

    const body = await req.json();
    const validation = validateWelcomeGiftInput(body);

    if (!validation.valid) {
      return NextResponse.json({ error: 'Validation failed', details: validation.errors }, { status: 400 });
    }

    const gift = db.createWelcomeGift(
      {
        title: body.title,
        description: body.description,
        image_path:
          body.image_path ||
          'https://images.unsplash.com/photo-1525385133512-2f3bdd039054?q=80&w=800&auto=format&fit=crop',
        is_active: body.is_active !== undefined ? !!body.is_active : true,
        new_member_only: body.new_member_only !== undefined ? !!body.new_member_only : true,
        starts_at: body.starts_at || new Date().toISOString(),
        ends_at: body.ends_at || null,
        validity_days: body.validity_days || 30,
        redemption_instructions: body.redemption_instructions,
        created_by: user!.id,
      },
      user!.id
    );

    return NextResponse.json({ success: true, gift }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to create welcome gift' }, { status: 500 });
  }
}
