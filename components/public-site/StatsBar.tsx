import { useTranslations } from 'next-intl';
import { BookOpen, Users, Globe } from 'lucide-react';

interface StatsBarProps {
  coursesCount: number;
  studentsCount: number;
}

export default function StatsBar({ coursesCount, studentsCount }: StatsBarProps) {
  const t = useTranslations('stats');

  const stats = [
    {
      icon: <BookOpen className="w-8 h-8 text-amber-400" />,
      value: coursesCount,
      suffix: '+',
      label: t('courses_label'),
    },
    {
      icon: <Users className="w-8 h-8 text-amber-400" />,
      value: studentsCount,
      suffix: '+',
      label: t('students_label'),
    },
    {
      icon: <Globe className="w-8 h-8 text-amber-400" />,
      value: 3,
      suffix: '',
      label: t('languages_label'),
    },
  ];

  return (
    <section className="bg-white border-b border-slate-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="flex flex-col items-center text-center p-6 rounded-2xl hover:bg-slate-50 transition-colors"
            >
              <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mb-4">
                {stat.icon}
              </div>
              <div className="text-4xl font-bold text-[#0F172A] mb-1">
                {stat.value.toLocaleString()}
                <span className="text-amber-500">{stat.suffix}</span>
              </div>
              <p className="text-slate-500 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
