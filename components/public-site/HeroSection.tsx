'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export default function HeroSection() {
  const t = useTranslations('hero');
  const locale = useLocale();

  return (
    <section className="relative overflow-hidden pt-8 lg:pt-16 bg-white border-b border-gray-200">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* ── Left: Text ── */}
          <div className="z-10">
            {/* Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-[56px] font-bold text-gray-900 mb-6 leading-[1.1] tracking-tight">
              {t('title')}
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-gray-700 max-w-xl mb-8 leading-relaxed font-normal">
              {t('subtitle')}
            </p>

            {/* CTA area */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8 mt-4">
              <Button asChild size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg font-semibold rounded shadow-sm">
                <a href={`/${locale}/courses`}>{t('cta_primary')}</a>
              </Button>
            </div>
          </div>

          {/* ── Right: Visual ── */}
          <div className="hidden lg:flex items-center justify-end relative">
            {/* Main image */}
            <div className="relative w-full max-w-[500px] aspect-[4/3] rounded overflow-hidden">
              <Image 
                src="/images/edx_hero.png" 
                alt="Student learning" 
                fill 
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
