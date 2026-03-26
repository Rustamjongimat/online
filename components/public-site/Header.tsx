'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { Menu, X, GraduationCap, User, LogOut, LayoutDashboard, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/components/providers/AuthProvider';

const LOCALES = [
  { code: 'uz', label: '🇺🇿 UZ' },
  { code: 'ru', label: '🇷🇺 RU' },
  { code: 'en', label: '🇬🇧 EN' },
];

export default function Header() {
  const t = useTranslations('nav');
  const tAuth = useTranslations('auth');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close user menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-user-menu]')) setUserMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const navLinks = [
    { href: `/${locale}`, label: t('home') },
    { href: `/${locale}/courses`, label: t('courses') },
    { href: `/${locale}/announcements`, label: t('announcements') },
    { href: `/${locale}/pricing`, label: t('pricing') },
  ];

  const switchLocale = (newLocale: string) => {
    const segments = pathname.split('/');
    segments[1] = newLocale;
    const newPath = segments.join('/') || `/${newLocale}`;
    localStorage.setItem('preferred-locale', newLocale);
    router.push(newPath);
  };

  const handleSignOut = async () => {
    setUserMenuOpen(false);
    setIsOpen(false);
    await signOut();
    router.push(`/${locale}`);
    router.refresh();
  };

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled ? 'bg-[#0F172A]/95 backdrop-blur-md shadow-lg' : 'bg-[#0F172A]'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href={`/${locale}`} className="flex items-center gap-2 text-white font-bold text-xl">
            <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span>
              Online<span className="text-amber-400">Academy</span>
            </span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-slate-300 hover:text-amber-400 transition-colors text-sm font-medium"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            {/* Language switcher */}
            <div className="flex items-center gap-1 bg-slate-800 rounded-lg p-1">
              {LOCALES.map((loc) => (
                <button
                  key={loc.code}
                  onClick={() => switchLocale(loc.code)}
                  className={cn(
                    'px-2.5 py-1 rounded-md text-xs font-semibold transition-all',
                    locale === loc.code
                      ? 'bg-amber-500 text-white'
                      : 'text-slate-400 hover:text-white'
                  )}
                >
                  {loc.label}
                </button>
              ))}
            </div>

            {/* Auth buttons */}
            {!loading && (
              <>
                {user ? (
                  <div className="relative" data-user-menu>
                    <button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                    >
                      <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                        {displayName.charAt(0).toUpperCase()}
                      </div>
                      <span className="max-w-[120px] truncate">{displayName}</span>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                    {userMenuOpen && (
                      <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 py-1 z-50">
                        <a
                          href={`/${locale}/dashboard`}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <LayoutDashboard className="w-4 h-4 text-amber-500" />
                          {tAuth('dashboard')}
                        </a>
                        <button
                          onClick={handleSignOut}
                          className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          {tAuth('logout')}
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Button asChild variant="ghost" size="sm" className="text-slate-300 hover:text-white hover:bg-slate-700">
                      <a href={`/${locale}/login`}>{tAuth('login_btn')}</a>
                    </Button>
                    <Button asChild variant="gold" size="sm">
                      <a href={`/${locale}/register`}>{tAuth('register_btn')}</a>
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden pb-4 border-t border-slate-700 mt-2 pt-4">
            <nav className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-slate-300 hover:text-amber-400 transition-colors text-sm font-medium px-2 py-1"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              {!loading && user && (
                <>
                  <a
                    href={`/${locale}/dashboard`}
                    className="flex items-center gap-2 text-slate-300 hover:text-amber-400 transition-colors text-sm font-medium px-2 py-1"
                    onClick={() => setIsOpen(false)}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    {tAuth('dashboard')}
                  </a>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors text-sm font-medium px-2 py-1 text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    {tAuth('logout')}
                  </button>
                </>
              )}
              {!loading && !user && (
                <div className="flex gap-2 px-2 pt-1">
                  <a
                    href={`/${locale}/login`}
                    className="flex-1 text-center py-2 rounded-lg border border-slate-600 text-slate-300 hover:text-white text-sm font-medium transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {tAuth('login_btn')}
                  </a>
                  <a
                    href={`/${locale}/register`}
                    className="flex-1 text-center py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {tAuth('register_btn')}
                  </a>
                </div>
              )}
            </nav>
            {/* Mobile language switcher */}
            <div className="flex items-center gap-2 mt-4 px-2">
              {LOCALES.map((loc) => (
                <button
                  key={loc.code}
                  onClick={() => {
                    switchLocale(loc.code);
                    setIsOpen(false);
                  }}
                  className={cn(
                    'px-3 py-1.5 rounded-md text-xs font-semibold transition-all',
                    locale === loc.code
                      ? 'bg-amber-500 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  )}
                >
                  {loc.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
