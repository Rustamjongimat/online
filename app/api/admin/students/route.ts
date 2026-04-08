export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getDb } from '@/lib/db';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const sql = getDb();
  const rows = await sql`SELECT s.*,c.title_uz,c.title_ru,c.title_en FROM students s LEFT JOIN courses c ON s.course_id=c.id ORDER BY s.enrolled_at DESC`;
  return NextResponse.json(rows);
}
