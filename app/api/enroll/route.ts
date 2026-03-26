export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { full_name, phone, email, course_id, user_id } = body;

    if (!full_name?.trim() || !phone?.trim() || !course_id) {
      return NextResponse.json(
        { error: 'full_name, phone, and course_id are required' },
        { status: 400 }
      );
    }

    const db = getSupabaseAdmin();

    // Verify course exists
    const { data: course } = await db
      .from('courses')
      .select('id')
      .eq('id', course_id)
      .eq('is_published', true)
      .single();

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    const { data, error } = await db
      .from('students')
      .insert({
        full_name: full_name.trim(),
        phone: phone.trim(),
        email: email?.trim() || null,
        course_id,
        user_id: user_id || null,
        enrolled_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Enrollment error:', error);
      return NextResponse.json({ error: 'Failed to enroll' }, { status: 500 });
    }

    return NextResponse.json({ success: true, student: data }, { status: 201 });
  } catch (err) {
    console.error('Enroll route error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
