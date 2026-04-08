export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { getSupabaseBrowser } from '@/lib/supabase-client';

// POST — mark a lesson as complete (called from client with user's auth token)
export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const token = authHeader.replace('Bearer ', '');
    const supabase = getSupabaseAdmin();

    // Verify the user token
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { lesson_id, course_id, quiz_score } = body;

    if (!lesson_id || !course_id) {
      return NextResponse.json({ error: 'lesson_id and course_id are required' }, { status: 400 });
    }

    // Upsert progress (insert or update if already exists)
    const { data, error } = await supabase
      .from('user_lesson_progress')
      .upsert({
        user_id: user.id,
        lesson_id,
        course_id,
        quiz_score: quiz_score ?? null,
        completed_at: new Date().toISOString(),
      }, { onConflict: 'user_id,lesson_id' })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true, progress: data });
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Error' }, { status: 500 });
  }
}
