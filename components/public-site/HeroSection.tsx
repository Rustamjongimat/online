'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Play, BookOpen, Star, Users, Award, Zap, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AVATARS = ['A', 'B', 'D', 'F', 'G'];
const AVATAR_COLORS = [
  'from-amber-400 to-orange-500',
  'from-blue-400 to-indigo-500',
  'from-emerald-400 to-teal-500',
  'from-pink-400 to-rose-500',
  'from-violet-400 to-purple-500',
];

const FLOATING_BADGES = [
  { icon: '🎓', text: '5,000+ o\'quvchi', color: 'from-amber-500/20 to-orange-500/10', border: 'border-amber-500/20' },
  { icon: '⭐', text: '4.9 reyting', color: 'from-yellow-500/20 to-amber-500/10', border: 'border-yellow-500/20' },
  { icon: '🏆', text: 'Sertifikat', color: 'from-emerald-500/20 to-teal-500/10', border: 'border-emerald-500/20' },
];

export default function HeroSection() {
  const t = useTranslations('hero');
  const locale = useLocale();

  return (
    <section className="hero-gradient min-h-screen flex items-center relative overflow-hidden pt-16">
      {/* Background layers */}
      <div className="absolute inset-0 dot-grid pointer-events-none" />
      <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-amber-500/8 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] bg-blue-600/8 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-amber-500/4 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* ── Left: Text ── */}
          <div>
            {/* Live badge */}
            <div className="inline-flex items-center gap-2.5 glass rounded-full px-4 py-2 mb-8 animate-fade-in">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
              </span>
              <span className="text-sm font-medium text-slate-300">{t('badge')}</span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-[1.05] tracking-tight animate-fade-in-up">
              {t('title').split(' ').map((word, i) =>
                i === 1 ? (
                  <span key={i} className="gradient-text text-glow-amber"> {word} </span>
                ) : (
                  <span key={i}>{word} </span>
                )
              )}
            </h1>

            {/* Subtitle */}
            <p className="text-lg text-slate-400 max-w-lg mb-8 leading-relaxed animate-fade-in-up delay-100">
              {t('subtitle')}
            </p>

            {/* Feature list */}
            <ul className="space-y-2 mb-10 animate-fade-in-up delay-200">
              {[
                locale === 'uz' ? "O'zbek, Rus va Ingliz tillarida darslar" : locale === 'ru' ? "Уроки на 3 языках" : "Lessons in 3 languages",
                locale === 'uz' ? "Har bir kurs uchun sertifikat" : locale === 'ru' ? "Сертификат за каждый курс" : "Certificate for each course",
                locale === 'uz' ? "Interaktiv testlar va amaliyot" : locale === 'ru' ? "Интерактивные тесты" : "Interactive quizzes & practice",
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-2.5 text-slate-300 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 mb-10 animate-fade-in-up delay-300">
              <a href={`/${locale}/courses`}>
                <Button variant="gold" size="xl"
                  className="gap-2.5 glow-amber-sm w-full sm:w-auto font-bold text-base px-8">
                  <Play className="w-5 h-5" fill="white" />
                  {t('cta_primary')}
                </Button>
              </a>
              <a href={`/${locale}/register`}>
                <Button variant="outline" size="xl"
                  className="gap-2.5 border-slate-600 text-white hover:bg-white/5 hover:border-slate-400 bg-transparent w-full sm:w-auto text-base px-8">
                  <BookOpen className="w-5 h-5" />
                  {t('cta_secondary')}
                </Button>
              </a>
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-4 animate-fade-in-up delay-400">
              <div className="flex -space-x-2.5">
                {AVATARS.map((a, i) => (
                  <div key={i}
                    className={`w-9 h-9 rounded-full bg-gradient-to-br ${AVATAR_COLORS[i]} flex items-center justify-center text-white text-xs font-bold ring-2 ring-[#0F172A]`}>
                    {a}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1 mb-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="text-white text-sm font-semibold ml-1">4.9</span>
                </div>
                <p className="text-slate-400 text-xs">
                  {locale === 'uz' ? '5,000+ dan ortiq o\'quvchilar ishonadi' :
                   locale === 'ru' ? 'Доверяют 5,000+ студентов' :
                   'Trusted by 5,000+ students'}
                </p>
              </div>
            </div>
          </div>

          {/* ── Right: Visual ── */}
          <div className="hidden lg:flex items-center justify-center relative">
            {/* Main card */}
            <div className="relative w-full max-w-sm">
              {/* Glow behind card */}
              <div className="absolute inset-0 bg-amber-500/20 rounded-3xl blur-3xl" />

              {/* Main dashboard card */}
              <div className="relative glass rounded-3xl p-6 border-gradient animate-float">
                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <p className="text-slate-400 text-xs mb-1">
                      {locale === 'uz' ? "Umumiy progress" : locale === 'ru' ? "Общий прогресс" : "Overall Progress"}
                    </p>
                    <p className="text-white text-xl font-bold">78%</p>
                  </div>
                  <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center glow-amber-sm">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2.5 bg-white/10 rounded-full mb-5 overflow-hidden">
                  <div className="h-full w-[78%] bg-gradient-to-r from-amber-400 to-amber-500 rounded-full" />
                </div>

                {/* Course items */}
                <div className="space-y-3 mb-5">
                  {[
                    { title: locale === 'uz' ? "Python Asoslari" : locale === 'ru' ? "Основы Python" : "Python Basics", pct: 100, done: true },
                    { title: locale === 'uz' ? "Web Dasturlash" : locale === 'ru' ? "Веб Разработка" : "Web Dev", pct: 65, done: false },
                    { title: locale === 'uz' ? "Data Science" : locale === 'ru' ? "Data Science" : "Data Science", pct: 30, done: false },
                  ].map((c, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${c.done ? 'bg-green-500/20' : 'bg-amber-500/20'}`}>
                        {c.done
                          ? <CheckCircle2 className="w-4 h-4 text-green-400" />
                          : <Zap className="w-4 h-4 text-amber-400" />
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-xs font-medium truncate mb-1">{c.title}</p>
                        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${c.done ? 'bg-green-400' : 'bg-amber-400'}`}
                            style={{ width: `${c.pct}%` }} />
                        </div>
                      </div>
                      <span className="text-xs text-slate-400 flex-shrink-0 font-medium">{c.pct}%</span>
                    </div>
                  ))}
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-2 pt-4 border-t border-white/10">
                  {[
                    { icon: BookOpen, val: '12', label: locale === 'uz' ? 'Dars' : locale === 'ru' ? 'Уроков' : 'Lessons' },
                    { icon: Award,    val: '3',  label: locale === 'uz' ? 'Sertif.' : locale === 'ru' ? 'Серт.' : 'Certs' },
                    { icon: Users,    val: '5k', label: locale === 'uz' ? "O'q-chi" : locale === 'ru' ? 'Студ.' : 'Students' },
                  ].map(({ icon: Icon, val, label }, i) => (
                    <div key={i} className="text-center">
                      <Icon className="w-4 h-4 text-amber-400 mx-auto mb-1" />
                      <p className="text-white text-sm font-bold">{val}</p>
                      <p className="text-slate-500 text-xs">{label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating badge: new lesson */}
              <div className="absolute -top-5 -right-6 glass rounded-2xl px-4 py-2.5 flex items-center gap-2 shadow-xl animate-fade-in delay-300">
                <div className="w-8 h-8 bg-green-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-white text-xs font-semibold">
                    {locale === 'uz' ? "Dars tugatildi!" : locale === 'ru' ? "Урок завершён!" : "Lesson done!"}
                  </p>
                  <p className="text-slate-400 text-xs">+50 XP</p>
                </div>
              </div>

              {/* Floating badge: students */}
              <div className="absolute -bottom-5 -left-6 glass rounded-2xl px-4 py-2.5 flex items-center gap-2 shadow-xl animate-fade-in delay-400">
                <div className="flex -space-x-1.5">
                  {AVATARS.slice(0, 3).map((a, i) => (
                    <div key={i} className={`w-6 h-6 rounded-full bg-gradient-to-br ${AVATAR_COLORS[i]} flex items-center justify-center text-white text-xs font-bold ring-1 ring-slate-900`}>
                      {a}
                    </div>
                  ))}
                </div>
                <p className="text-white text-xs font-medium">
                  {locale === 'uz' ? "+24 bugun qo'shildi" : locale === 'ru' ? "+24 сегодня" : "+24 joined today"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom floating badges (mobile friendly) */}
        <div className="flex flex-wrap justify-center gap-3 mt-16 lg:mt-12 animate-fade-in-up delay-500">
          {FLOATING_BADGES.map((b, i) => (
            <div key={i}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${b.color} border ${b.border} backdrop-blur-sm`}>
              <span className="text-base">{b.icon}</span>
              <span className="text-sm text-white font-medium">{b.text}</span>
            </div>
          ))}
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 opacity-40">
          <div className="w-px h-10 bg-gradient-to-b from-transparent via-slate-500 to-slate-700" />
          <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
}
