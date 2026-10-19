import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const user = getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ authenticated: false, user: null, membership: null }, { status: 200 });
    }

    const membership = db.getMembershipCardByUserId(user.id);
    const safeUser = {
      id: user.id,
      email: user.email,
      display_name: user.display_name,
      avatar_url: user.avatar_url,
      account_status: user.account_status,
      role: user.role,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };

    return NextResponse.json({
      authenticated: true,
      user: safeUser,
      membership,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}

export async function POST(_req: NextRequest) {
  const response = NextResponse.json({ success: true, message: 'Logged out successfully' });
  response.cookies.delete('ilc_auth_token');
  return response;
}
