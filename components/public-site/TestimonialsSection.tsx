'use client';

import { useTranslations } from 'next-intl';
import { Star } from 'lucide-react';

interface TestimonialItem {
  name: string;
  role: string;
  text: string;
  avatar: string;
}

export default function TestimonialsSection() {
  const t = useTranslations('testimonials');

  // We get items from the locale messages
  const items: TestimonialItem[] = [
    {
      name: t('items.0.name'),
      role: t('items.0.role'),
      text: t('items.0.text'),
      avatar: t('items.0.avatar'),
    },
    {
      name: t('items.1.name'),
      role: t('items.1.role'),
      text: t('items.1.text'),
      avatar: t('items.1.avatar'),
    },
    {
      name: t('items.2.name'),
      role: t('items.2.role'),
      text: t('items.2.text'),
      avatar: t('items.2.avatar'),
    },
    {
      name: t('items.3.name'),
      role: t('items.3.role'),
      text: t('items.3.text'),
      avatar: t('items.3.avatar'),
    },
  ];

  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0F172A] mb-4">
            {t('title')}
          </h2>
          <p className="text-slate-500 text-lg">{t('subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              {/* Quote */}
              <p className="text-slate-600 leading-relaxed mb-6 italic">"{item.text}"</p>
              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {item.avatar}
                </div>
                <div>
                  <p className="font-semibold text-slate-900 text-sm">{item.name}</p>
                  <p className="text-slate-400 text-xs">{item.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
