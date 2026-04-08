export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const lessonId = searchParams.get('lesson_id');
  if (!lessonId) return NextResponse.json({ error: 'lesson_id required' }, { status: 400 });

  const db = getSupabaseAdmin();
  const { data, error } = await db
    .from('quiz_questions')
    .select('*')
    .eq('lesson_id', lessonId)
    .order('order_index', { ascending: true });

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
      .from('quiz_questions')
      .insert({
        lesson_id: body.lesson_id,
        question_uz: body.question_uz || '',
        question_ru: body.question_ru || '',
        question_en: body.question_en || '',
        options_uz: body.options_uz || [],
        options_ru: body.options_ru || [],
        options_en: body.options_en || [],
        correct_option: body.correct_option ?? 0,
        explanation_uz: body.explanation_uz || '',
        explanation_ru: body.explanation_ru || '',
        explanation_en: body.explanation_en || '',
        order_index: body.order_index || 0,
      })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data, { status: 201 });
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Error' }, { status: 500 });
  }
}
