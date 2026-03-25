import { getTranslations, getLocale } from 'next-intl/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import type { Course, Announcement, PricingPlan, Locale } from '@/lib/types';
import { localizeCourse, localizeAnnouncement, localizePricingPlan } from '@/lib/types';
import HeroSection from '@/components/public-site/HeroSection';
import StatsBar from '@/components/public-site/StatsBar';
import CourseCard from '@/components/public-site/CourseCard';
import AnnouncementCard from '@/components/public-site/AnnouncementCard';
import PricingCard from '@/components/public-site/PricingCard';
import TestimonialsSection from '@/components/public-site/TestimonialsSection';
import Header from '@/components/public-site/Header';
import Footer from '@/components/public-site/Footer';
import { ArrowRight, BookOpen, Bell, Tag } from 'lucide-react';
import { Toaster } from '@/components/ui/sonner';

export default async function HomePage({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'featured_courses' });
  const tAnn = await getTranslations({ locale, namespace: 'announcements' });
  const tPricing = await getTranslations({ locale, namespace: 'pricing' });

  const db = getSupabaseAdmin();

  const [coursesRes, announcementsRes, pricingRes, studentsRes] = await Promise.all([
    db
      .from('courses')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .limit(6),
    db
      .from('announcements')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .limit(3),
    db.from('pricing_plans').select('*').eq('is_active', true).order('price'),
    db.from('students').select('id', { count: 'exact', head: true }),
  ]);

  const courses = (coursesRes.data || []) as Course[];
  const announcements = (announcementsRes.data || []) as Announcement[];
  const pricingPlans = (pricingRes.data || []) as PricingPlan[];
  const studentsCount = studentsRes.count || 0;

  const loc = locale as Locale;
  const localizedCourses = courses.map((c) => localizeCourse(c, loc));
  const localizedAnnouncements = announcements.map((a) => localizeAnnouncement(a, loc));
  const localizedPlans = pricingPlans.map((p) => localizePricingPlan(p, loc));

  return (
    <div className="min-h-screen">
      <Header />
      <Toaster />

      {/* Hero */}
      <HeroSection />

      {/* Stats */}
      <StatsBar coursesCount={courses.length || 0} studentsCount={studentsCount} />

      {/* Featured Courses */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="flex items-center gap-2 text-amber-500 mb-2">
                <BookOpen className="w-5 h-5" />
                <span className="text-sm font-semibold uppercase tracking-wide">Courses</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#0F172A]">{t('title')}</h2>
              <p className="text-slate-500 mt-2">{t('subtitle')}</p>
            </div>
            <a
              href={`/${locale}/courses`}
              className="hidden sm:flex items-center gap-1.5 text-amber-500 hover:text-amber-600 font-semibold text-sm transition-colors"
            >
              {t('view_all')}
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {localizedCourses.length === 0 ? (
            <p className="text-center text-slate-400 py-12">{t('no_courses')}</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {localizedCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  watchLabel={t('watch_now')}
                  freeLabel={t('free_badge')}
                  locale={locale}
                />
              ))}
            </div>
          )}

          <div className="sm:hidden mt-8 text-center">
            <a
              href={`/${locale}/courses`}
              className="inline-flex items-center gap-1.5 text-amber-500 hover:text-amber-600 font-semibold"
            >
              {t('view_all')} <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Announcements */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="flex items-center gap-2 text-amber-500 mb-2">
                <Bell className="w-5 h-5" />
                <span className="text-sm font-semibold uppercase tracking-wide">News</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#0F172A]">{tAnn('title')}</h2>
              <p className="text-slate-500 mt-2">{tAnn('subtitle')}</p>
            </div>
            <a
              href={`/${locale}/announcements`}
              className="hidden sm:flex items-center gap-1.5 text-amber-500 hover:text-amber-600 font-semibold text-sm"
            >
              {tAnn('view_all')}
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {localizedAnnouncements.length === 0 ? (
            <p className="text-center text-slate-400 py-12">{tAnn('no_announcements')}</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {localizedAnnouncements.map((ann) => (
                <AnnouncementCard
                  key={ann.id}
                  announcement={ann}
                  readMoreLabel={tAnn('read_more')}
                  locale={locale}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Pricing */}
      {localizedPlans.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-2 text-amber-500 mb-2">
                <Tag className="w-5 h-5" />
                <span className="text-sm font-semibold uppercase tracking-wide">Pricing</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#0F172A]">
                {tPricing('title')}
              </h2>
              <p className="text-slate-500 mt-2">{tPricing('subtitle')}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {localizedPlans.map((plan) => (
                <PricingCard
                  key={plan.id}
                  plan={plan}
                  perMonthLabel={tPricing('per_month')}
                  popularLabel={tPricing('most_popular')}
                  ctaLabel={tPricing('get_started')}
                  locale={locale}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      <TestimonialsSection />

      <Footer />
    </div>
  );
}
