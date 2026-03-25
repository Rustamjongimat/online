import { useTranslations, useLocale } from 'next-intl';
import { GraduationCap, Mail, Youtube, Instagram, Send } from 'lucide-react';

export default function Footer() {
  const t = useTranslations('footer');
  const nav = useTranslations('nav');
  const locale = useLocale();

  const links = [
    { href: `/${locale}`, label: nav('home') },
    { href: `/${locale}/courses`, label: nav('courses') },
    { href: `/${locale}/announcements`, label: nav('announcements') },
    { href: `/${locale}/pricing`, label: nav('pricing') },
  ];

  return (
    <footer className="bg-[#0F172A] text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <a href={`/${locale}`} className="flex items-center gap-2 text-white font-bold text-xl mb-4">
              <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span>
                Online<span className="text-amber-400">Academy</span>
              </span>
            </a>
            <p className="text-sm leading-relaxed">{t('description')}</p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">{t('quick_links')}</h3>
            <ul className="space-y-2">
              {links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm hover:text-amber-400 transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-white font-semibold mb-4">{t('follow_us')}</h3>
            <div className="flex gap-3 mb-6">
              <a
                href="#"
                className="w-10 h-10 bg-slate-800 hover:bg-red-600 rounded-lg flex items-center justify-center transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-5 h-5 text-white" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-slate-800 hover:bg-pink-600 rounded-lg flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5 text-white" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-slate-800 hover:bg-blue-500 rounded-lg flex items-center justify-center transition-colors"
                aria-label="Telegram"
              >
                <Send className="w-5 h-5 text-white" />
              </a>
              <a
                href="mailto:info@onlineacademy.uz"
                className="w-10 h-10 bg-slate-800 hover:bg-amber-500 rounded-lg flex items-center justify-center transition-colors"
                aria-label="Email"
              >
                <Mail className="w-5 h-5 text-white" />
              </a>
            </div>
            <p className="text-sm">{t('contact')}: info@onlineacademy.uz</p>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm">
            © {new Date().getFullYear()} OnlineAcademy. {t('rights')}
          </p>
        </div>
      </div>
    </footer>
  );
}
