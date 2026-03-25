export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const db = getSupabaseAdmin();
  const { data, error } = await db
    .from('pricing_plans')
    .select('*')
    .order('price');

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const db = getSupabaseAdmin();

  const { data, error } = await db
    .from('pricing_plans')
    .insert({
      name_uz: body.name_uz || '',
      name_ru: body.name_ru || '',
      name_en: body.name_en || '',
      price: body.price || 0,
      currency: body.currency || 'UZS',
      features_uz: body.features_uz || [],
      features_ru: body.features_ru || [],
      features_en: body.features_en || [],
      is_popular: body.is_popular ?? false,
      is_active: body.is_active ?? true,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
