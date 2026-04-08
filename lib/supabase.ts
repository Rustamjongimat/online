import { createClient } from '@supabase/supabase-js';

// Public keys — safe to include as fallbacks (anon key is not secret)
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://qtwadkdxfwdrasvswbce.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_4_jrqzYZ4moN_x07bsUpEg_yK55_AXe';

// Service role key — must be set in environment variables (never hardcode)
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Lazy public client — created on first call, not at module load time
export function getSupabaseClient() {
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

// Server-side admin client (bypasses RLS) — use only in API routes / server components
export function getSupabaseAdmin() {
  const key = SUPABASE_SERVICE_KEY || SUPABASE_ANON_KEY;
  return createClient(SUPABASE_URL, key, {
    auth: { persistSession: false },
  });
}
