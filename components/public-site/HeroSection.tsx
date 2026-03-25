'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Play, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function HeroSection() {
  const t = useTranslations('hero');
  const locale = useLocale();

  return (
    <section className="hero-gradient min-h-screen flex items-center justify-center relative overflow-hidden pt-16">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-3xl" />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 px-4 py-2 rounded-full text-sm font-medium mb-8 animate-fade-in-up">
          <span>{t('badge')}</span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight animate-fade-in-up">
          {t('title').split(' ').map((word, i) =>
            i === 1 ? (
              <span key={i} className="text-amber-400">
                {' '}
                {word}{' '}
              </span>
            ) : (
              <span key={i}>{word} </span>
            )
          )}
        </h1>

        {/* Subtitle */}
        <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up">
          {t('subtitle')}
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up">
          <a href={`/${locale}/courses`}>
            <Button variant="gold" size="xl" className="gap-2 shadow-lg shadow-amber-500/25">
              <Play className="w-5 h-5" fill="white" />
              {t('cta_primary')}
            </Button>
          </a>
          <a href={`/${locale}/courses`}>
            <Button
              variant="outline"
              size="xl"
              className="gap-2 border-slate-600 text-white hover:bg-slate-800 hover:border-slate-500 bg-transparent"
            >
              <BookOpen className="w-5 h-5" />
              {t('cta_secondary')}
            </Button>
          </a>
        </div>

        {/* Scroll indicator */}
        <div className="mt-20 flex flex-col items-center gap-2 text-slate-600 animate-bounce">
          <div className="w-px h-8 bg-gradient-to-b from-transparent to-slate-600" />
          <div className="w-4 h-4 border-2 border-slate-600 rounded-full" />
        </div>
      </div>
    </section>
  );
}
