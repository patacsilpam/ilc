import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getUserFromRequest, requireAdmin } from '@/lib/auth';
import { validateVideoInput } from '@ilc/shared';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category') || undefined;
    const search = searchParams.get('search') || undefined;
    const statusParam = searchParams.get('status') || undefined;
    const featuredParam = searchParams.get('featured');

    const currentUser = getUserFromRequest(req);
    const isAdmin = currentUser && ['admin', 'editor', 'super_admin'].includes(currentUser.role);

    // If not admin, restrict strictly to published videos
    let status: any = 'published';
    if (isAdmin && statusParam) {
      status = statusParam;
    }

    const isFeatured = featuredParam !== null ? featuredParam === 'true' : undefined;

    const videos = db.getVideos({
      status,
      category,
      search,
      isFeatured,
    });

    const categories = db.getCategories();

    return NextResponse.json({
      success: true,
      videos,
      categories,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch videos' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { errorResponse, user } = requireAdmin(req);
    if (errorResponse) return errorResponse;

    const body = await req.json();
    const validation = validateVideoInput(body);

    if (!validation.valid) {
      return NextResponse.json({ error: 'Validation failed', details: validation.errors }, { status: 400 });
    }

    const slug =
      body.slug ||
      body.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') +
        '-' +
        Math.floor(Math.random() * 1000);

    const video = db.createVideo(
      {
        title: body.title,
        slug,
        description: body.description,
        media_path: body.media_path,
        thumbnail_path:
          body.thumbnail_path ||
          'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop',
        duration_seconds: body.duration_seconds || null,
        status: body.status || 'draft',
        is_featured: !!body.is_featured,
        published_at: null,
        created_by: user!.id,
        categories: body.categories || ['Islands & Beaches'],
        tags: body.tags || ['Philippines', 'Travel'],
      },
      user!.id
    );

    return NextResponse.json({ success: true, video }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to create video' }, { status: 500 });
  }
}
