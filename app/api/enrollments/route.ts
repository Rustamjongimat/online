export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getDb } from '@/lib/db';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ enrollments: [] });

  const userId = (session.user as { id?: string }).id;
  if (!userId) return NextResponse.json({ enrollments: [] });

  const sql = getDb();
  const rows = await sql`
    SELECT s.id, s.enrolled_at, s.course_id,
           c.id as c_id, c.title_uz, c.title_ru, c.title_en,
           c.thumbnail_url, c.category, c.is_free
    FROM students s
    JOIN courses c ON s.course_id = c.id
    WHERE s.user_id=${userId}
    ORDER BY s.enrolled_at DESC
  `;

  const enrollments = rows.map((r) => ({
    id: r.id,
    enrolled_at: r.enrolled_at,
    courses: {
      id: r.c_id,
      title_uz: r.title_uz,
      title_ru: r.title_ru,
      title_en: r.title_en,
      thumbnail_url: r.thumbnail_url,
      category: r.category,
      is_free: r.is_free,
    },
  }));

  return NextResponse.json({ enrollments });
}
