import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import type { Course, Locale } from '@/lib/types';
import { localizeCourse } from '@/lib/types';
import Header from '@/components/public-site/Header';
import Footer from '@/components/public-site/Footer';
import VideoPlayer from '@/components/public-site/VideoPlayer';
import CourseCard from '@/components/public-site/CourseCard';
import EnrollmentForm from '@/components/public-site/EnrollmentForm';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';
import { Toaster } from '@/components/ui/sonner';
import { ArrowLeft, Tag, Calendar } from 'lucide-react';

export default async function CourseDetailPage({
  params: { locale, id },
}: {
  params: { locale: string; id: string };
}) {
  const t = await getTranslations({ locale, namespace: 'course_detail' });
  const db = getSupabaseAdmin();

  const { data: courseData } = await db
    .from('courses')
    .select('*')
    .eq('id', id)
    .eq('is_published', true)
    .single();

  if (!courseData) notFound();

  const course = courseData as Course;
  const loc = locale as Locale;
  const localCourse = localizeCourse(course, loc);

  // Related courses (same category, excluding current)
  const { data: relatedData } = await db
    .from('courses')
    .select('*')
    .eq('is_published', true)
    .eq('category', course.category)
    .neq('id', id)
    .limit(3);

  const relatedCourses = ((relatedData || []) as Course[]).map((c) => localizeCourse(c, loc));

  const watchNowLabel = t('free_badge');
  const freeLabel = t('free_badge');

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <Toaster />

      {/* Breadcrumb */}
      <div className="bg-[#0F172A] pt-24 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <a
            href={`/${locale}/courses`}
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Courses
          </a>
          <div className="flex items-center gap-3 flex-wrap">
            {localCourse.category && (
              <div className="flex items-center gap-1.5 text-amber-400 text-sm">
                <Tag className="w-4 h-4" />
                {localCourse.category}
              </div>
            )}
            <div className="flex items-center gap-1.5 text-slate-400 text-sm">
              <Calendar className="w-4 h-4" />
              {formatDate(course.created_at, locale)}
            </div>
            {course.is_free ? (
              <Badge variant="gold">FREE</Badge>
            ) : (
              <Badge variant="navy">PREMIUM</Badge>
            )}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mt-3 leading-tight">
            {localCourse.title}
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Player */}
            <VideoPlayer
              youtubeUrl={localCourse.youtube_url}
              title={localCourse.title}
              thumbnailUrl={localCourse.thumbnail_url}
            />

            {/* Description */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-4">About This Course</h2>
              <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                {localCourse.description}
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Enrollment form */}
            <EnrollmentForm courseId={id} />

            {/* Related courses */}
            {relatedCourses.length > 0 && (
              <div>
                <h3 className="font-bold text-slate-900 mb-4">{t('related_courses')}</h3>
                <div className="space-y-4">
                  {relatedCourses.map((c) => (
                    <CourseCard
                      key={c.id}
                      course={c}
                      watchLabel={t('free_badge')}
                      freeLabel={freeLabel}
                      locale={locale}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
