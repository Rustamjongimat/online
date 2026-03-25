export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getSupabaseAdmin } from '@/lib/supabase';
import { extractYouTubeId } from '@/lib/youtube';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();

  // Extract YouTube video ID from URL
  if (body.youtube_url) {
    const videoId = extractYouTubeId(body.youtube_url);
    if (videoId) body.youtube_url = videoId;
  }

  const db = getSupabaseAdmin();
  const { data, error } = await db
    .from('courses')
    .update({
      title_uz: body.title_uz,
      title_ru: body.title_ru,
      title_en: body.title_en,
      description_uz: body.description_uz,
      description_ru: body.description_ru,
      description_en: body.description_en,
      youtube_url: body.youtube_url,
      thumbnail_url: body.thumbnail_url || null,
      category: body.category || null,
      is_free: body.is_free,
      is_published: body.is_published,
    })
    .eq('id', params.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const db = getSupabaseAdmin();
  const { error } = await db.from('courses').delete().eq('id', params.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
