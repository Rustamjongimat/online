export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getDb } from '@/lib/db';

export async function GET(_req: NextRequest, { params }: { params: { courseId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ completedIds: [], percent: 0, totalLessons: 0, completedCount: 0 });

  const userId = (session.user as { id?: string }).id;
  if (!userId) return NextResponse.json({ completedIds: [], percent: 0, totalLessons: 0, completedCount: 0 });

  const sql = getDb();
  const [progress, total] = await Promise.all([
    sql`SELECT lesson_id, quiz_score, completed_at FROM user_lesson_progress WHERE user_id=${userId} AND course_id=${params.courseId}`,
    sql`SELECT COUNT(*) FROM lessons WHERE course_id=${params.courseId} AND is_published=true`,
  ]);

  const completedIds = progress.map((p) => p.lesson_id as string);
  const totalLessons = Number(total[0].count);
  const completedCount = completedIds.length;
  const percent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  return NextResponse.json({ completedIds, completedLessons: progress, totalLessons, completedCount, percent });
}
