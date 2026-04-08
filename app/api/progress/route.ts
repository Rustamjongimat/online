export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getDb } from '@/lib/db';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const userId = (session.user as { id?: string }).id;
  if (!userId) return NextResponse.json({ error: 'No user id' }, { status: 401 });

  const { lesson_id, course_id, quiz_score } = await req.json();
  if (!lesson_id || !course_id) return NextResponse.json({ error: 'lesson_id and course_id required' }, { status: 400 });

  const sql = getDb();
  await sql`
    INSERT INTO user_lesson_progress (user_id, lesson_id, course_id, quiz_score)
    VALUES (${userId}, ${lesson_id}, ${course_id}, ${quiz_score??null})
    ON CONFLICT (user_id, lesson_id) DO UPDATE SET quiz_score=${quiz_score??null}, completed_at=NOW()
  `;
  return NextResponse.json({ success: true });
}
