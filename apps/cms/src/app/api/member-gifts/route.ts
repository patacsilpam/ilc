import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getUserFromRequest, requireMember } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const user = getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const isAdmin = ['admin', 'editor', 'super_admin'].includes(user.role);
    const { searchParams } = new URL(req.url);
    const all = searchParams.get('all') === 'true';

    if (isAdmin && all) {
      const allMemberGifts = db.getAllMemberGifts();
      return NextResponse.json({ success: true, member_gifts: allMemberGifts });
    }

    // Default to the authenticated user's own gifts
    const memberGifts = db.getMemberGifts(user.id);
    return NextResponse.json({ success: true, member_gifts: memberGifts });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch member gifts' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { errorResponse, user } = requireMember(req);
    if (errorResponse) return errorResponse;

    const body = await req.json();
    if (!body.member_gift_id) {
      return NextResponse.json({ error: 'member_gift_id is required' }, { status: 400 });
    }

    const updated = db.redeemMemberGift(body.member_gift_id, user!.id);
    return NextResponse.json({ success: true, member_gift: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to redeem gift' }, { status: 400 });
  }
}
