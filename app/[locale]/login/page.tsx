'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { toast } from 'sonner';
import { GraduationCap, Eye, EyeOff, Mail, Lock, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Toaster } from '@/components/ui/sonner';
import { getSupabaseBrowser } from '@/lib/supabase-client';

export default function LoginPage() {
  const t = useTranslations('auth');
  const locale = useLocale();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const supabase = getSupabaseBrowser();
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        if (error.message.toLowerCase().includes('email not confirmed')) {
          toast.error(locale === 'uz' ? 'Emailingizni tasdiqlang. Pochta qutingizni tekshiring.' : locale === 'ru' ? 'Подтвердите email. Проверьте почту.' : 'Please confirm your email first. Check your inbox.');
        } else if (error.message.toLowerCase().includes('invalid login')) {
          toast.error(locale === 'uz' ? 'Email yoki parol noto\'g\'ri' : locale === 'ru' ? 'Неверный email или пароль' : 'Invalid email or password');
        } else {
          toast.error(error.message);
        }
      } else {
        toast.success(t('login_success'));
        router.push(`/${locale}/dashboard`);
        router.refresh();
      }
    } catch {
      toast.error(t('login_error'));
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
          <h1 className="text-2xl font-bold text-slate-900 mb-1">{t('login_title')}</h1>
          <p className="text-slate-500 text-sm mb-6">{t('login_subtitle')}</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">{t('email_label')}</Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder={t('email_placeholder')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  required
                  autoComplete="current-password"
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

            <Button type="submit" variant="gold" className="w-full" size="lg" disabled={loading}>
              {loading ? t('logging_in') : t('login_btn')}
            </Button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            {t('no_account')}{' '}
            <a
              href={`/${locale}/register`}
              className="text-amber-500 hover:text-amber-600 font-semibold"
            >
              {t('register_link')}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
