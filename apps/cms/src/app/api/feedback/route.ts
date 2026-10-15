import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getUserFromRequest, requireMember } from '@/lib/auth';
import { validateFeedbackInput } from '@ilc/shared';

export async function GET(req: NextRequest) {
  try {
    const user = getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const isAdmin = ['admin', 'editor', 'super_admin'].includes(user.role);
    const { searchParams } = new URL(req.url);
    const statusParam = searchParams.get('status') as any;

    if (isAdmin) {
      const list = db.getFeedback(statusParam);
      return NextResponse.json({ success: true, feedback: list });
    }

    // Authenticated members only see their own feedback
    const userList = db.getFeedback().filter((f) => f.user_id === user.id);
    return NextResponse.json({ success: true, feedback: userList });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch feedback' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { errorResponse, user } = requireMember(req);
    if (errorResponse) return errorResponse;

    const body = await req.json();
    const validation = validateFeedbackInput(body);

    if (!validation.valid) {
      return NextResponse.json({ error: 'Validation failed', details: validation.errors }, { status: 400 });
    }

    const fb = db.submitFeedback(
      {
        merchant_name: body.merchant_name,
        rating: body.rating,
        comment: body.comment,
      },
      user!.id
    );

    return NextResponse.json({ success: true, feedback: fb }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to submit feedback' }, { status: 500 });
  }
}
