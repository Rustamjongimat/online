export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

// GET — fetch user's progress for a specific course
export async function GET(req: NextRequest, { params }: { params: { courseId: string } }) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader) return NextResponse.json({ completedLessons: [], percent: 0 });

    const token = authHeader.replace('Bearer ', '');
    const supabase = getSupabaseAdmin();

    const { data: { user } } = await supabase.auth.getUser(token);
    if (!user) return NextResponse.json({ completedLessons: [], percent: 0 });

    // Get completed lesson IDs for this course
    const { data: progressData } = await supabase
      .from('user_lesson_progress')
      .select('lesson_id, quiz_score, completed_at')
      .eq('user_id', user.id)
      .eq('course_id', params.courseId);

    // Get total published lessons count
    const { count } = await supabase
      .from('lessons')
      .select('*', { count: 'exact', head: true })
      .eq('course_id', params.courseId)
      .eq('is_published', true);

    const completedIds = (progressData || []).map((p) => p.lesson_id);
    const totalLessons = count || 0;
    const completedCount = completedIds.length;
    const percent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

    return NextResponse.json({
      completedLessons: progressData || [],
      completedIds,
      totalLessons,
      completedCount,
      percent,
    });
  } catch {
    return NextResponse.json({ completedLessons: [], percent: 0 });
  }
}
