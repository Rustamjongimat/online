export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getDb } from '@/lib/db';

function genCertNumber() {
  return `OA-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
}

async function ensureTables() {
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
    CREATE TABLE IF NOT EXISTS certificates (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL,
      course_id UUID NOT NULL,
      certificate_number TEXT NOT NULL UNIQUE,
      full_name TEXT NOT NULL,
      issued_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE(user_id, course_id)
    )
  `;
}

function nestCourseRow(row: Record<string, unknown>) {
  const { title_uz, title_ru, title_en, ...cert } = row;
  return { ...cert, courses: { title_uz, title_ru, title_en } };
}

export async function GET(
  _req: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ certificate: null });

    const userId = (session.user as { id?: string }).id;
    if (!userId) return NextResponse.json({ certificate: null });
    // Admin id is not a UUID — no certificate for admin
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId);
    if (!isUuid) return NextResponse.json({ certificate: null });

    const sql = getDb();
    await ensureTables();

    // Return existing certificate if already issued
    const existing = await sql`
      SELECT cert.*, c.title_uz, c.title_ru, c.title_en
      FROM certificates cert
      JOIN courses c ON cert.course_id = c.id
      WHERE cert.user_id = ${userId} AND cert.course_id = ${params.courseId}
      LIMIT 1
    `;
    if (existing.length > 0) {
      return NextResponse.json({
        certificate: nestCourseRow(existing[0] as Record<string, unknown>),
      });
    }

    // Check if all published lessons are completed
    const [completed, total] = await Promise.all([
      sql`
        SELECT COUNT(*) AS count
        FROM user_lesson_progress
        WHERE user_id = ${userId} AND course_id = ${params.courseId}
      `,
      sql`
        SELECT COUNT(*) AS count
        FROM lessons
        WHERE course_id = ${params.courseId} AND is_published = true
      `,
    ]);

    const completedCount = Number(completed[0]?.count ?? 0);
    const totalLessons = Number(total[0]?.count ?? 0);

    if (totalLessons === 0 || completedCount < totalLessons) {
      return NextResponse.json({
        certificate: null,
        percent: totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0,
      });
    }

    // All lessons done — issue certificate
    const fullName = session.user.name || session.user.email?.split('@')[0] || 'Student';
    const cert = await sql`
      INSERT INTO certificates (user_id, course_id, certificate_number, full_name)
      VALUES (${userId}, ${params.courseId}, ${genCertNumber()}, ${fullName})
      ON CONFLICT (user_id, course_id) DO UPDATE SET issued_at = certificates.issued_at
      RETURNING *
    `;

    const certWithCourse = await sql`
      SELECT cert.*, c.title_uz, c.title_ru, c.title_en
      FROM certificates cert
      JOIN courses c ON cert.course_id = c.id
      WHERE cert.id = ${cert[0].id}
    `;

    return NextResponse.json({
      certificate: nestCourseRow(certWithCourse[0] as Record<string, unknown>),
      newly_issued: true,
    });
  } catch (err) {
    console.error('[GET /api/certificate/:courseId] error:', err);
    return NextResponse.json({ certificate: null, error: String(err) });
  }
}
