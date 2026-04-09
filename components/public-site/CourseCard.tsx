import { Play, Lock, Clock, Star, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
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
      className="group block bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm
                 hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 cursor-pointer"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video bg-slate-100 overflow-hidden">
        <img
          src={thumbnail}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Dark overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Play button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100">
          <div className="w-14 h-14 bg-amber-500 rounded-full flex items-center justify-center shadow-xl glow-amber-sm">
            <Play className="w-6 h-6 text-white ml-0.5" fill="white" />
          </div>
        </div>

        {/* Free/Premium badge */}
        <div className="absolute top-3 left-3">
          {course.is_free ? (
            <span className="inline-flex items-center gap-1 bg-amber-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
              {freeLabel}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 bg-[#0F172A]/90 text-amber-400 text-xs font-bold px-2.5 py-1 rounded-full shadow-sm border border-amber-500/30">
              <Lock className="w-3 h-3" />
              {premiumLabel}
            </span>
          )}
        </div>

        {/* Category */}
        {course.category && (
          <div className="absolute top-3 right-3">
            <span className="bg-white/90 backdrop-blur-sm text-slate-700 text-xs font-semibold px-2.5 py-1 rounded-full">
              {course.category}
            </span>
          </div>
        )}

        {/* Bottom meta row */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex items-center gap-1.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
            ))}
            <span className="text-white text-xs font-semibold ml-0.5">4.9</span>
          </div>
          <div className="flex items-center gap-1 text-white/80 text-xs">
            <Clock className="w-3 h-3" />
            <span>
              {locale === 'uz' ? "O'z vaqtida" : locale === 'ru' ? "Онлайн" : "Online"}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Title */}
        <h3 className="font-bold text-slate-900 text-base leading-snug mb-2 line-clamp-2 group-hover:text-amber-600 transition-colors duration-200">
          {course.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-slate-500 leading-relaxed mb-4 line-clamp-2">
          {course.description}
        </p>

        {/* Footer row */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-50">
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
              O
            </div>
            <span className="text-xs text-slate-500 font-medium">OnlineAcademy</span>
          </div>

          <span className="inline-flex items-center gap-1 text-amber-500 text-sm font-semibold group-hover:gap-2 transition-all duration-200">
            {watchLabel}
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </a>
  );
}
