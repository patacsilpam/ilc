import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { generateToken } from '@/lib/auth';
import { validateAuthInput } from '@ilc/shared';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = validateAuthInput(body);

    if (!validation.valid) {
      return NextResponse.json({ error: 'Validation failed', details: validation.errors }, { status: 400 });
    }

    const existing = db.findUserByEmail(body.email);
    if (existing) {
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 });
    }

    const { user, membership } = db.createUser(body.email, body.password, body.display_name, 'member');
    const token = generateToken(user);

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

    const response = NextResponse.json({
      success: true,
      user: safeUser,
      membership,
      token,
    });

    response.cookies.set('ilc_auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
