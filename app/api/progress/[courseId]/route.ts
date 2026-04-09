export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getDb } from '@/lib/db';

async function ensureTable() {
  const sql = getDb();
  await sql`
    CREATE TABLE IF NOT EXISTS user_lesson_progress (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL,
      lesson_id UUID NOT NULL,
      course_id UUID NOT NULL,
      quiz_score INTEGER,
      completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE(user_id, lesson_id)
    )
  `;
}

export async function GET(
  _req: NextRequest,
  { params }: { params: { courseId: string } }
) {
  const empty = { completedIds: [], percent: 0, totalLessons: 0, completedCount: 0 };

  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json(empty);

    const userId = (session.user as { id?: string }).id;
    if (!userId) return NextResponse.json(empty);
    // Admin id is not a UUID — return empty progress
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId);
    if (!isUuid) return NextResponse.json(empty);

    const sql = getDb();
    await ensureTable();

    const [progress, total] = await Promise.all([
      sql`
        SELECT lesson_id, quiz_score, completed_at
        FROM user_lesson_progress
        WHERE user_id = ${userId} AND course_id = ${params.courseId}
      `,
      sql`
        SELECT COUNT(*) AS count
        FROM lessons
        WHERE course_id = ${params.courseId} AND is_published = true
      `,
    ]);

    const completedIds = progress.map((p) => p.lesson_id as string);
    const totalLessons = Number(total[0]?.count ?? 0);
    const completedCount = completedIds.length;
    const percent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

    return NextResponse.json({
      completedIds,
      completedLessons: progress,
      totalLessons,
      completedCount,
      percent,
    });
  } catch (err) {
    console.error('[GET /api/progress/:courseId] error:', err);
    return NextResponse.json({ completedIds: [], percent: 0, totalLessons: 0, completedCount: 0 });
  }
}
