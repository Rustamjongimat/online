'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export default function HeroSection() {
  const t = useTranslations('hero');
  const locale = useLocale();

  return (
    <section className="relative overflow-hidden pt-16 lg:pt-[76px] bg-[#FCEDE7]">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-24 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* ── Left: Text ── */}
          <div className="z-10">
            {/* Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-secondary mb-6 leading-tight tracking-tight">
              {t('title')}
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-gray-700 max-w-lg mb-8 leading-relaxed font-medium">
              {t('subtitle')}
            </p>

            {/* Search and CTA area */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="relative w-full max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-4 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary focus:border-primary sm:text-base shadow-sm"
                  placeholder="Nimani o'rganmoqchisiz?"
                />
              </div>
              <Button asChild size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white px-8 py-7 text-base font-bold">
                <a href={`/${locale}/courses`}>{t('cta_primary')}</a>
              </Button>
            </div>
          </div>

          {/* ── Right: Visual ── */}
          <div className="hidden lg:flex items-center justify-center relative">
            {/* Main image */}
            <div className="relative w-full max-w-md aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
              <Image 
                src="/images/edx_hero.png" 
                alt="Student learning" 
                fill 
                className="object-cover"
                priority
              />
            </div>
            
            {/* Decorative background shape */}
            <div className="absolute -z-10 -top-8 -right-8 w-full max-w-md aspect-[4/3] rounded-2xl bg-primary/20" />
          </div>
        </div>
      </div>
    </section>
  );
}
