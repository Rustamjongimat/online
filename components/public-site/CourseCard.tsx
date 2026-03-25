import Image from 'next/image';
import { Play, Lock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { LocalizedCourse } from '@/lib/types';
import { getYouTubeThumbnail, extractYouTubeId } from '@/lib/youtube';
import { truncateText } from '@/lib/utils';

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
    <div className="group bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col">
      {/* Thumbnail */}
      <div className="relative aspect-video bg-slate-100 overflow-hidden">
        <img
          src={thumbnail}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {/* Play overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="w-14 h-14 bg-amber-500 rounded-full flex items-center justify-center shadow-lg">
            <Play className="w-6 h-6 text-white ml-1" />
          </div>
        </div>
        {/* Badge */}
        <div className="absolute top-3 left-3">
          {course.is_free ? (
            <Badge variant="gold" className="font-bold text-xs">
              {freeLabel}
            </Badge>
          ) : (
            <Badge variant="navy" className="font-bold text-xs flex items-center gap-1">
              <Lock className="w-3 h-3" />
              {premiumLabel}
            </Badge>
          )}
        </div>
        {/* Category */}
        {course.category && (
          <div className="absolute top-3 right-3">
            <span className="bg-white/90 text-slate-700 text-xs font-medium px-2 py-1 rounded-full">
              {course.category}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-semibold text-slate-900 text-base leading-snug mb-2 line-clamp-2">
          {course.title}
        </h3>
        <p className="text-sm text-slate-500 leading-relaxed mb-4 flex-1 line-clamp-3">
          {truncateText(course.description, 120)}
        </p>
        <a href={`/${locale}/courses/${course.id}`}>
          <Button variant="gold" className="w-full gap-2">
            <Play className="w-4 h-4" />
            {watchLabel}
          </Button>
        </a>
      </div>
    </div>
  );
}
