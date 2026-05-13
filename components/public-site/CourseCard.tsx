import { Lock, ArrowRight } from 'lucide-react';
import type { LocalizedCourse } from '@/lib/types';
import { getYouTubeThumbnail, extractYouTubeId } from '@/lib/youtube';

interface CourseCardProps {
  course: LocalizedCourse;
  watchLabel: string;
  freeLabel: string;
  premiumLabel?: string;
  locale: string;
}

export default function CourseCard({
  course,
  watchLabel,
  freeLabel,
  premiumLabel = 'PREMIUM',
  locale,
}: CourseCardProps) {
  const videoId = extractYouTubeId(course.youtube_url);
  const thumbnail =
    course.thumbnail_url ||
    (videoId ? getYouTubeThumbnail(videoId, 'hq') : '/placeholder-course.jpg');

  return (
    <a
      href={`/${locale}/courses/${course.id}`}
      className="group flex flex-col bg-white border border-gray-200 overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer h-full"
    >
      {/* Thumbnail */}
      <div className="relative aspect-[16/9] bg-gray-100 overflow-hidden shrink-0">
        <img
          src={thumbnail}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Free/Premium badge */}
        <div className="absolute top-0 right-0 m-3">
          {course.is_free ? (
            <span className="inline-flex items-center bg-white text-gray-800 text-xs font-bold px-2 py-1 shadow-sm uppercase tracking-wide">
              {freeLabel}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 bg-primary text-white text-xs font-bold px-2 py-1 shadow-sm uppercase tracking-wide">
              <Lock className="w-3 h-3" />
              {premiumLabel}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 flex flex-col flex-1">
        {/* Category / Partner */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            OnlineAcademy
          </span>
          {course.category && (
            <span className="text-xs text-secondary font-medium">
              {course.category}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-bold text-secondary text-lg leading-snug mb-3 line-clamp-2 group-hover:text-primary transition-colors duration-200">
          {course.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 line-clamp-2 mb-4 flex-1">
          {course.description}
        </p>

        {/* Footer row */}
        <div className="pt-4 border-t border-gray-100 mt-auto">
          <span className="inline-flex items-center gap-1 text-primary text-sm font-semibold group-hover:gap-2 transition-all duration-200">
            {watchLabel}
            <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </a>
  );
}
