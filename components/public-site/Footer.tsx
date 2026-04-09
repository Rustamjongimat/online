import { useTranslations, useLocale } from 'next-intl';
import { GraduationCap, Mail, Youtube, Instagram, Send, ArrowRight, BookOpen, Bell, Tag, Home } from 'lucide-react';

export default function Footer() {
  const t = useTranslations('footer');
  const nav = useTranslations('nav');
  const locale = useLocale();

  const navLinks = [
    { href: `/${locale}`, label: nav('home'), icon: Home },
    { href: `/${locale}/courses`, label: nav('courses'), icon: BookOpen },
    { href: `/${locale}/announcements`, label: nav('announcements'), icon: Bell },
    { href: `/${locale}/pricing`, label: nav('pricing'), icon: Tag },
  ];

  const socials = [
    { href: '#', icon: Youtube, label: 'YouTube', hover: 'hover:bg-red-600 hover:border-red-600' },
    { href: '#', icon: Instagram, label: 'Instagram', hover: 'hover:bg-gradient-to-br hover:from-pink-500 hover:to-orange-400 hover:border-pink-500' },
    { href: '#', icon: Send, label: 'Telegram', hover: 'hover:bg-blue-500 hover:border-blue-500' },
    { href: 'mailto:info@onlineacademy.uz', icon: Mail, label: 'Email', hover: 'hover:bg-amber-500 hover:border-amber-500' },
  ];

  return (
    <footer className="bg-[#0A1628] text-slate-400 relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-600/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Top divider with gradient */}
      <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">

        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">

          {/* ── Brand ── */}
          <div className="lg:col-span-1">
            <a href={`/${locale}`} className="inline-flex items-center gap-2.5 text-white font-bold text-xl mb-5 group">
              <div className="w-9 h-9 bg-amber-500 rounded-xl flex items-center justify-center group-hover:bg-amber-400 transition-colors glow-amber-sm">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span>Online<span className="text-amber-400">Academy</span></span>
            </a>

            <p className="text-sm leading-relaxed text-slate-400 mb-6 max-w-xs">
              {t('description')}
            </p>

            {/* Social icons */}
            <div className="flex gap-2.5">
              {socials.map(({ href, icon: Icon, label, hover }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className={`w-9 h-9 bg-slate-800 border border-slate-700 rounded-lg flex items-center justify-center transition-all duration-200 ${hover}`}
                >
                  <Icon className="w-4 h-4 text-white" />
                </a>
              ))}
            </div>
          </div>

          {/* ── Quick Links ── */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-widest mb-5">{t('quick_links')}</h3>
            <ul className="space-y-3">
              {navLinks.map(({ href, label, icon: Icon }) => (
                <li key={href}>
                  <a
                    href={href}
                    className="group inline-flex items-center gap-2.5 text-sm text-slate-400 hover:text-amber-400 transition-colors duration-200"
                  >
                    <Icon className="w-3.5 h-3.5 text-slate-600 group-hover:text-amber-400 transition-colors" />
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Contact ── */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-widest mb-5">{t('follow_us')}</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="mailto:info@onlineacademy.uz" className="inline-flex items-center gap-2 hover:text-amber-400 transition-colors">
                  <Mail className="w-3.5 h-3.5 text-amber-500" />
                  info@onlineacademy.uz
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Send className="w-3.5 h-3.5 text-blue-400" />
                <span>@onlineacademy_uz</span>
              </li>
            </ul>

            {/* Badge row */}
            <div className="mt-6 flex flex-col gap-2">
              <div className="inline-flex items-center gap-2 bg-slate-800/60 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-300">
                <span className="w-2 h-2 rounded-full bg-green-400 inline-block animate-pulse" />
                5,000+ active students
              </div>
              <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-xl px-3 py-2 text-xs text-amber-300">
                ⭐ 4.9 / 5.0 rating
              </div>
            </div>
          </div>

          {/* ── Newsletter ── */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-widest mb-5">
              {locale === 'uz' ? "Yangiliklar" : locale === 'ru' ? "Новости" : "Newsletter"}
            </h3>
            <p className="text-sm text-slate-400 mb-4 leading-relaxed">
              {locale === 'uz'
                ? "Yangi kurslar va chegirmalar haqida birinchi bo'lib bilin."
                : locale === 'ru'
                ? "Узнайте первыми о новых курсах и скидках."
                : "Be the first to know about new courses and offers."}
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder={locale === 'uz' ? "Email manzilingiz" : locale === 'ru' ? "Ваш email" : "Your email"}
                className="flex-1 min-w-0 bg-slate-800 border border-slate-700 text-white placeholder-slate-500 text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:border-amber-500 transition-colors"
              />
              <button
                type="button"
                className="w-10 h-10 bg-amber-500 hover:bg-amber-400 rounded-xl flex items-center justify-center transition-colors flex-shrink-0 glow-amber-sm"
              >
                <ArrowRight className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} OnlineAcademy. {t('rights')}</p>
          <div className="flex items-center gap-4">
            <a href={`/${locale}`} className="hover:text-slate-300 transition-colors">
              {locale === 'uz' ? "Maxfiylik" : locale === 'ru' ? "Конфиденциальность" : "Privacy"}
            </a>
            <a href={`/${locale}`} className="hover:text-slate-300 transition-colors">
              {locale === 'uz' ? "Shartlar" : locale === 'ru' ? "Условия" : "Terms"}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
