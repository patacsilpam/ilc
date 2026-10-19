import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { errorResponse } = requireAdmin(req);
    if (errorResponse) return errorResponse;

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || undefined;

    // Strips personal emails/phone/credentials
    const members = db.getSanitizedMembers(search);

    return NextResponse.json({ success: true, members });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch members' }, { status: 500 });
  }
}
