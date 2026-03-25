import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const db = getSupabaseAdmin();

  const [coursesRes, studentsRes, announcementsRes, pricingRes] = await Promise.all([
    db.from('courses').select('id', { count: 'exact', head: true }),
    db.from('students').select('id', { count: 'exact', head: true }),
    db
      .from('announcements')
      .select('id', { count: 'exact', head: true })
      .eq('is_published', true),
    db
      .from('pricing_plans')
      .select('id', { count: 'exact', head: true })
      .eq('is_active', true),
  ]);

  return NextResponse.json({
    courses: coursesRes.count || 0,
    students: studentsRes.count || 0,
    announcements: announcementsRes.count || 0,
    pricing: pricingRes.count || 0,
  });
}
