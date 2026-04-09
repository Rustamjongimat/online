'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import {
  ArrowLeft, ArrowRight, CheckCircle2, PlayCircle,
  BookOpen, HelpCircle, Award
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/providers/AuthProvider';
import { extractYouTubeId } from '@/lib/youtube';
import type { Lesson, QuizQuestion, Course } from '@/lib/types';
import { localizeLesson, localizeQuizQuestion, localizeCourse } from '@/lib/types';
import type { Locale } from '@/lib/types';

export default function LessonViewerPage() {
  const params = useParams();
  const courseId = params.id as string;
  const lessonId = params.lessonId as string;
  const locale = useLocale() as Locale;
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [marking, setMarking] = useState(false);
  const [alreadyDone, setAlreadyDone] = useState(false);

  const L = {
    uz: { back: 'Orqaga', next: 'Keyingi dars', complete: 'Darsni tugatish', quiz: 'Test', submit: 'Javob yuborish', score: 'Natija', pass: 'Tabriklaymiz! Dars bajarildi', fail: 'Qayta urinib ko\'ring', correct: 'To\'g\'ri!', wrong: 'Noto\'g\'ri', completed: 'Bajarilgan', read: 'Maruza', video: 'Video', allDone: 'Kursni yakladingiz!', getCert: 'Sertifikat olish' },
    ru: { back: 'Назад', next: 'Следующий урок', complete: 'Завершить урок', quiz: 'Тест', submit: 'Отправить', score: 'Результат', pass: 'Поздравляем! Урок завершён', fail: 'Попробуйте снова', correct: 'Верно!', wrong: 'Неверно', completed: 'Завершён', read: 'Лекция', video: 'Видео', allDone: 'Курс завершён!', getCert: 'Получить сертификат' },
    en: { back: 'Back', next: 'Next Lesson', complete: 'Complete Lesson', quiz: 'Quiz', submit: 'Submit Answers', score: 'Score', pass: 'Congratulations! Lesson completed', fail: 'Try again', correct: 'Correct!', wrong: 'Incorrect', completed: 'Completed', read: 'Lecture', video: 'Video', allDone: 'Course completed!', getCert: 'Get Certificate' },
  }[locale] ?? { back: 'Back', next: 'Next', complete: 'Complete', quiz: 'Quiz', submit: 'Submit', score: 'Score', pass: 'Done!', fail: 'Try again', correct: 'Correct!', wrong: 'Wrong', completed: 'Done', read: 'Lecture', video: 'Video', allDone: 'Done!', getCert: 'Certificate' };

  const fetchProgress = useCallback(async () => {
    const res = await fetch(`/api/progress/${courseId}`);
    if (res.ok) {
      const d = await res.json();
      setCompletedIds(d.completedIds || []);
    }
  }, [courseId]);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push(`/${locale}/login`); return; }

    const load = async () => {
      const [courseRes, lessonRes, progressRes] = await Promise.all([
        fetch(`/api/courses/${courseId}`),
        fetch(`/api/lessons/${lessonId}`),
        fetch(`/api/progress/${courseId}`),
      ]);

      if (courseRes.ok) {
        const d = await courseRes.json();
        setCourse(d.course as Course);
        setLessons(d.lessons as Lesson[]);
      }
      if (lessonRes.ok) {
        const d = await lessonRes.json();
        setLesson(d.lesson as Lesson);
        setQuestions(d.questions as QuizQuestion[]);
      }
      if (progressRes.ok) {
        const d = await progressRes.json();
        setCompletedIds(d.completedIds || []);
      }
      setLoading(false);
    };
    load();
  }, [user, authLoading, courseId, lessonId, locale, router]);

  useEffect(() => {
    if (completedIds.includes(lessonId)) {
      setAlreadyDone(true);
      setSubmitted(true);
    }
  }, [completedIds, lessonId]);

  const currentIndex = lessons.findIndex((l) => l.id === lessonId);
  const nextLesson = lessons[currentIndex + 1] || null;
  const isLastLesson = currentIndex === lessons.length - 1;
  const allCourseDone = completedIds.length === lessons.length && lessons.length > 0;

  // Block access if previous lesson is not completed (sequential lock)
  const isLessonLocked = currentIndex > 0 && !completedIds.includes(lessons[currentIndex - 1]?.id);

  const handleSubmitQuiz = async () => {
    if (!lesson) return;
    const localQs = questions.map((q) => localizeQuizQuestion(q, locale));
    let correct = 0;
    localQs.forEach((q) => { if (answers[q.id] === q.correct_option) correct++; });
    const pct = localQs.length > 0 ? Math.round((correct / localQs.length) * 100) : 100;
    setScore(pct);
    setSubmitted(true);

    if (pct >= 60) {
      await markComplete(pct);
    }
  };

  const markComplete = async (quizScore?: number) => {
    setMarking(true);
    try {
      const res = await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lesson_id: lessonId, course_id: courseId, quiz_score: quizScore ?? null }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.error('[markComplete] failed:', err);
      }
    } catch (e) {
      console.error('[markComplete] network error:', e);
    }
    await fetchProgress();
    setAlreadyDone(true);
    setMarking(false);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!lesson || !course) return null;

  // Show locked screen if previous lesson not done
  if (isLessonLocked) {
    const prevLesson = lessons[currentIndex - 1];
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-8 text-center">
        <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mb-6">
          <ArrowLeft className="w-10 h-10 text-amber-500" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">
          {locale === 'uz' ? 'Bu dars qulflangan' : locale === 'ru' ? 'Урок заблокирован' : 'Lesson Locked'}
        </h2>
        <p className="text-slate-500 mb-6 max-w-sm">
          {locale === 'uz'
            ? 'Avvalgi darsni muvaffaqiyatli tugatganingizdan so\'ng bu dars ochiladi.'
            : locale === 'ru'
            ? 'Этот урок откроется после успешного завершения предыдущего урока.'
            : 'This lesson unlocks after you complete the previous lesson.'}
        </p>
        <Button variant="gold" onClick={() => router.push(`/${locale}/courses/${courseId}/learn/${prevLesson.id}`)}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          {locale === 'uz' ? 'Avvalgi darsga qaytish' : locale === 'ru' ? 'К предыдущему уроку' : 'Go to previous lesson'}
        </Button>
      </div>
    );
  }

  const loc = localizeLesson(lesson, locale);
  const localQuestions = questions.map((q) => localizeQuizQuestion(q, locale));
  const videoId = lesson.video_url ? extractYouTubeId(lesson.video_url) : null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-[#0F172A] sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <button onClick={() => router.push(`/${locale}/courses/${courseId}/learn`)}
            className="flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors">
            <ArrowLeft className="w-4 h-4" /> {L.back}
          </button>
          <p className="text-white text-sm font-medium truncate hidden sm:block">{loc.title}</p>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>{completedIds.length}/{lessons.length}</span>
            {alreadyDone && <CheckCircle2 className="w-4 h-4 text-green-400" />}
          </div>
        </div>
      </header>

      <div className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 space-y-6">
        <div>
          <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
            <span>{currentIndex + 1} / {lessons.length}</span>
            {alreadyDone && <span className="flex items-center gap-1 text-green-500"><CheckCircle2 className="w-3.5 h-3.5" /> {L.completed}</span>}
          </div>
          <h1 className="text-2xl font-bold text-slate-900">{loc.title}</h1>
        </div>

        {videoId && (
          <div className="bg-black rounded-2xl overflow-hidden shadow-lg">
            <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
              <iframe
                src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={loc.title}
              />
            </div>
          </div>
        )}

        {loc.content && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-amber-500" /> {L.read}
            </h2>
            <div className="prose prose-slate max-w-none">
              <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{loc.content}</p>
            </div>
          </div>
        )}

        {localQuestions.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h2 className="font-bold text-slate-800 mb-5 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-amber-500" /> {L.quiz}
              <span className="text-xs text-slate-400 font-normal">({localQuestions.length} ta savol)</span>
            </h2>

            {submitted && !alreadyDone && (
              <div className={`rounded-xl p-4 mb-5 flex items-center gap-3 ${score >= 60 ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                {score >= 60 ? <CheckCircle2 className="w-5 h-5" /> : <HelpCircle className="w-5 h-5" />}
                <div>
                  <p className="font-semibold">{score >= 60 ? L.pass : L.fail}</p>
                  <p className="text-sm">{L.score}: {score}%</p>
                </div>
              </div>
            )}
            {alreadyDone && (
              <div className="rounded-xl p-4 mb-5 bg-green-50 text-green-700 border border-green-200 flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5" />
                <p className="font-semibold">{L.pass}</p>
              </div>
            )}

            <div className="space-y-6">
              {localQuestions.map((q, qi) => (
                <div key={q.id}>
                  <p className="font-semibold text-slate-800 mb-3">{qi + 1}. {q.question}</p>
                  <div className="space-y-2">
                    {q.options.map((opt, oi) => {
                      const isSelected = answers[q.id] === oi;
                      const isCorrect = oi === q.correct_option;
                      let cls = 'border border-slate-200 text-slate-700 hover:border-amber-300 hover:bg-amber-50';
                      if (submitted || alreadyDone) {
                        if (isCorrect) cls = 'border-green-400 bg-green-50 text-green-800';
                        else if (isSelected && !isCorrect) cls = 'border-red-400 bg-red-50 text-red-700';
                        else cls = 'border-slate-100 text-slate-400';
                      } else if (isSelected) {
                        cls = 'border-amber-400 bg-amber-50 text-amber-800';
                      }
                      return (
                        <button
                          key={oi}
                          disabled={submitted || alreadyDone}
                          onClick={() => setAnswers((a) => ({ ...a, [q.id]: oi }))}
                          className={`w-full text-left p-3 rounded-lg text-sm transition-colors flex items-center gap-3 ${cls} disabled:cursor-default`}
                        >
                          <span className="w-6 h-6 rounded-full border-2 border-current flex items-center justify-center text-xs font-bold flex-shrink-0">
                            {String.fromCharCode(65 + oi)}
                          </span>
                          {opt}
                          {(submitted || alreadyDone) && isCorrect && <CheckCircle2 className="w-4 h-4 ml-auto text-green-500" />}
                        </button>
                      );
                    })}
                  </div>
                  {(submitted || alreadyDone) && q.explanation && (
                    <p className="text-xs text-slate-500 mt-2 ml-2 italic">{q.explanation}</p>
                  )}
                </div>
              ))}
            </div>

            {!submitted && !alreadyDone && (
              <Button variant="gold" className="mt-6 w-full sm:w-auto" onClick={handleSubmitQuiz}
                disabled={Object.keys(answers).length < localQuestions.length}>
                {L.submit}
              </Button>
            )}

            {submitted && score < 60 && !alreadyDone && (
              <Button variant="outline" className="mt-4" onClick={() => { setAnswers({}); setSubmitted(false); }}>
                Qayta urinish
              </Button>
            )}
          </div>
        )}

        {localQuestions.length === 0 && !alreadyDone && (
          <div className="bg-white rounded-2xl border border-slate-100 p-6 text-center">
            <Button variant="gold" onClick={() => markComplete()} disabled={marking}>
              {marking ? 'Saqlanmoqda...' : L.complete}
            </Button>
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          <Button variant="outline" onClick={() => router.push(`/${locale}/courses/${courseId}/learn`)}>
            <ArrowLeft className="w-4 h-4 mr-2" /> {L.back}
          </Button>

          {allCourseDone && isLastLesson ? (
            <Button variant="gold" onClick={() => router.push(`/${locale}/certificate/${courseId}`)}>
              <Award className="w-4 h-4 mr-2" /> {L.getCert}
            </Button>
          ) : nextLesson ? (
            <Button
              variant={alreadyDone ? 'gold' : 'outline'}
              disabled={!alreadyDone}
              onClick={() => router.push(`/${locale}/courses/${courseId}/learn/${nextLesson.id}`)}
            >
              {L.next} <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
