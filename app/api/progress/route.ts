export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getDb } from '@/lib/db';

/** Ensure the progress table exists before any query */
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
  await sql`
    CREATE INDEX IF NOT EXISTS idx_progress_user_course
      ON user_lesson_progress (user_id, course_id)
  `;
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized — not logged in' }, { status: 401 });
    }

    const userId = (session.user as { id?: string }).id;
    if (!userId) {
      return NextResponse.json({ error: 'No user id in session token' }, { status: 401 });
    }
    // Admin user id is not a UUID — skip progress tracking for admin
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId);
    if (!isUuid) {
      return NextResponse.json({ success: true, skipped: 'admin' });
    }

    const body = await req.json();
    const { lesson_id, course_id, quiz_score } = body;
    if (!lesson_id || !course_id) {
      return NextResponse.json({ error: 'lesson_id and course_id required' }, { status: 400 });
    }

    const sql = getDb();

    // Auto-create table if it doesn't exist
    await ensureTable();

    await sql`
      INSERT INTO user_lesson_progress (user_id, lesson_id, course_id, quiz_score)
      VALUES (${userId}, ${lesson_id}, ${course_id}, ${quiz_score ?? null})
      ON CONFLICT (user_id, lesson_id)
      DO UPDATE SET quiz_score = ${quiz_score ?? null}, completed_at = NOW()
    `;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[POST /api/progress] error:', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
