export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getDb } from '@/lib/db';

function genCertNumber() {
  return `OA-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
}

export async function GET(_req: NextRequest, { params }: { params: { courseId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ certificate: null });

  const userId = (session.user as { id?: string }).id;
  if (!userId) return NextResponse.json({ certificate: null });

  const sql = getDb();

  // Check existing certificate
  const existing = await sql`
    SELECT cert.*, c.title_uz, c.title_ru, c.title_en
    FROM certificates cert
    JOIN courses c ON cert.course_id = c.id
    WHERE cert.user_id=${userId} AND cert.course_id=${params.courseId}
    LIMIT 1
  `;
  if (existing.length > 0) return NextResponse.json({ certificate: existing[0] });

  // Check 100% progress
  const [progress, total] = await Promise.all([
    sql`SELECT COUNT(*) FROM user_lesson_progress WHERE user_id=${userId} AND course_id=${params.courseId}`,
    sql`SELECT COUNT(*) FROM lessons WHERE course_id=${params.courseId} AND is_published=true`,
  ]);

  const completedCount = Number(progress[0].count);
  const totalLessons = Number(total[0].count);

  if (totalLessons === 0 || completedCount < totalLessons) {
    return NextResponse.json({ certificate: null, percent: totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0 });
  }

  const fullName = session.user.name || session.user.email?.split('@')[0] || 'Student';
  const cert = await sql`
    INSERT INTO certificates (user_id, course_id, certificate_number, full_name)
    VALUES (${userId}, ${params.courseId}, ${genCertNumber()}, ${fullName})
    RETURNING *
  `;

  const certWithCourse = await sql`
    SELECT cert.*, c.title_uz, c.title_ru, c.title_en
    FROM certificates cert
    JOIN courses c ON cert.course_id = c.id
    WHERE cert.id=${cert[0].id}
  `;

  return NextResponse.json({ certificate: certWithCourse[0], newly_issued: true });
}
