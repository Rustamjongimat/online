export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const courseId = searchParams.get('course_id');

  const db = getSupabaseAdmin();
  let query = db.from('lessons').select('*').order('order_index', { ascending: true });
  if (courseId) query = query.eq('course_id', courseId);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const db = getSupabaseAdmin();

    const { data, error } = await db
      .from('lessons')
      .insert({
        course_id: body.course_id,
        title_uz: body.title_uz || '',
        title_ru: body.title_ru || '',
        title_en: body.title_en || '',
        content_uz: body.content_uz || '',
        content_ru: body.content_ru || '',
        content_en: body.content_en || '',
        video_url: body.video_url || null,
        duration_minutes: body.duration_minutes || 0,
        order_index: body.order_index || 0,
        is_published: body.is_published ?? false,
      })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data, { status: 201 });
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Error' }, { status: 500 });
  }
}
