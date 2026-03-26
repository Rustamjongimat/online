'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { toast } from 'sonner';
import { GraduationCap, Eye, EyeOff, Mail, Lock, User, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Toaster } from '@/components/ui/sonner';
import { getSupabaseBrowser } from '@/lib/supabase-client';

export default function RegisterPage() {
  const t = useTranslations('auth');
  const locale = useLocale();
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password.length < 6) { toast.error(t('password_short')); return; }
    if (form.password !== form.confirm) { toast.error(t('password_mismatch')); return; }

    setLoading(true);
    try {
      const supabase = getSupabaseBrowser();
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://online-two-iota.vercel.app';
      const { error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: { full_name: form.name },
          emailRedirectTo: `${siteUrl}/${locale}/dashboard`,
        },
      });
      if (error) {
        toast.error(error.message || t('register_error'));
      } else {
        toast.success(t('register_success'));
        // Try to sign in immediately (if email confirmation disabled)
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: form.email,
          password: form.password,
        });
        if (!signInError) {
          router.push(`/${locale}/dashboard`);
          router.refresh();
        } else {
          // Email confirmation required — redirect to login
          setTimeout(() => router.push(`/${locale}/login`), 2000);
        }
      }
    } catch {
      toast.error(t('register_error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Toaster />

      {/* Back button */}
      <a
        href={`/${locale}`}
        className="absolute top-6 left-6 flex items-center gap-2 text-slate-500 hover:text-slate-800 text-sm transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        {locale === 'uz' ? 'Bosh sahifa' : locale === 'ru' ? 'Главная' : 'Home'}
      </a>

      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <a href={`/${locale}`} className="inline-flex flex-col items-center gap-3">
            <div className="w-14 h-14 bg-[#0F172A] rounded-2xl flex items-center justify-center shadow-lg">
              <GraduationCap className="w-8 h-8 text-amber-400" />
            </div>
            <span className="text-2xl font-bold text-[#0F172A]">
              Online<span className="text-amber-500">Academy</span>
            </span>
          </a>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-1">{t('register_title')}</h1>
          <p className="text-slate-500 text-sm mb-6">{t('register_subtitle')}</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">{t('name_label')}</Label>
              <div className="relative mt-1">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  id="name"
                  type="text"
                  placeholder={t('name_placeholder')}
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email">{t('email_label')}</Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder={t('email_placeholder')}
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className="pl-10"
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password">{t('password_label')}</Label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder={t('password_placeholder')}
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  className="pl-10 pr-10"
                  required
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <Label htmlFor="confirm">{t('confirm_password_label')}</Label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  id="confirm"
                  type={showPassword ? 'text' : 'password'}
                  placeholder={t('confirm_password_placeholder')}
                  value={form.confirm}
                  onChange={(e) => setForm((f) => ({ ...f, confirm: e.target.value }))}
                  className="pl-10"
                  required
                  autoComplete="new-password"
                />
              </div>
            </div>

            <Button type="submit" variant="gold" className="w-full" size="lg" disabled={loading}>
              {loading ? t('registering') : t('register_btn')}
            </Button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            {t('have_account')}{' '}
            <a
              href={`/${locale}/login`}
              className="text-amber-500 hover:text-amber-600 font-semibold"
            >
              {t('login_link')}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
