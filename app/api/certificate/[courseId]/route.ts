export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

function generateCertNumber(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(100000 + Math.random() * 900000);
  return `OA-${year}-${random}`;
}

// GET — fetch certificate for a course (or issue if 100% complete)
export async function GET(req: NextRequest, { params }: { params: { courseId: string } }) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader) return NextResponse.json({ certificate: null });

    const token = authHeader.replace('Bearer ', '');
    const supabase = getSupabaseAdmin();

    const { data: { user } } = await supabase.auth.getUser(token);
    if (!user) return NextResponse.json({ certificate: null });

    // Check if certificate already issued
    const { data: existing } = await supabase
      .from('certificates')
      .select('*, courses(title_uz, title_ru, title_en)')
      .eq('user_id', user.id)
      .eq('course_id', params.courseId)
      .single();

    if (existing) return NextResponse.json({ certificate: existing });

    // Check progress — must be 100%
    const { data: progressData } = await supabase
      .from('user_lesson_progress')
      .select('lesson_id')
      .eq('user_id', user.id)
      .eq('course_id', params.courseId);

    const { count: totalLessons } = await supabase
      .from('lessons')
      .select('*', { count: 'exact', head: true })
      .eq('course_id', params.courseId)
      .eq('is_published', true);

    if (!totalLessons || totalLessons === 0) {
      return NextResponse.json({ certificate: null, error: 'No lessons' });
    }

    const completedCount = (progressData || []).length;
    if (completedCount < totalLessons) {
      return NextResponse.json({
        certificate: null,
        percent: Math.round((completedCount / totalLessons) * 100),
      });
    }

    // Issue certificate
    const fullName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Student';

    const { data: cert, error } = await supabase
      .from('certificates')
      .insert({
        user_id: user.id,
        course_id: params.courseId,
        certificate_number: generateCertNumber(),
        full_name: fullName,
        issued_at: new Date().toISOString(),
      })
      .select('*, courses(title_uz, title_ru, title_en)')
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ certificate: cert, newly_issued: true });
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Error' }, { status: 500 });
  }
}
