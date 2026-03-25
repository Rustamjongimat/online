export type Locale = 'uz' | 'ru' | 'en';

export interface Course {
  id: string;
  title_uz: string;
  title_ru: string;
  title_en: string;
  description_uz: string;
  description_ru: string;
  description_en: string;
  youtube_url: string;
  thumbnail_url: string;
  category: string;
  is_free: boolean;
  is_published: boolean;
  created_at: string;
}

export interface Announcement {
  id: string;
  title_uz: string;
  title_ru: string;
  title_en: string;
  content_uz: string;
  content_ru: string;
  content_en: string;
  is_published: boolean;
  created_at: string;
}

export interface Student {
  id: string;
  full_name: string;
  phone: string;
  email: string;
  course_id: string;
  enrolled_at: string;
  courses?: {
    title_uz: string;
    title_ru: string;
    title_en: string;
  };
}

export interface PricingPlan {
  id: string;
  name_uz: string;
  name_ru: string;
  name_en: string;
  price: number;
  currency: string;
  features_uz: string[];
  features_ru: string[];
  features_en: string[];
  is_popular: boolean;
  is_active: boolean;
}

export interface LocalizedCourse {
  id: string;
  title: string;
  description: string;
  youtube_url: string;
  thumbnail_url: string;
  category: string;
  is_free: boolean;
  is_published: boolean;
  created_at: string;
}

export interface LocalizedAnnouncement {
  id: string;
  title: string;
  content: string;
  is_published: boolean;
  created_at: string;
}

export interface LocalizedPricingPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  features: string[];
  is_popular: boolean;
  is_active: boolean;
}

export function localizeCourse(course: Course, locale: Locale): LocalizedCourse {
  return {
    id: course.id,
    title: course[`title_${locale}`] || course.title_en,
    description: course[`description_${locale}`] || course.description_en,
    youtube_url: course.youtube_url,
    thumbnail_url: course.thumbnail_url,
    category: course.category,
    is_free: course.is_free,
    is_published: course.is_published,
    created_at: course.created_at,
  };
}

export function localizeAnnouncement(ann: Announcement, locale: Locale): LocalizedAnnouncement {
  return {
    id: ann.id,
    title: ann[`title_${locale}`] || ann.title_en,
    content: ann[`content_${locale}`] || ann.content_en,
    is_published: ann.is_published,
    created_at: ann.created_at,
  };
}

export function localizePricingPlan(plan: PricingPlan, locale: Locale): LocalizedPricingPlan {
  return {
    id: plan.id,
    name: plan[`name_${locale}`] || plan.name_en,
    price: plan.price,
    currency: plan.currency,
    features: plan[`features_${locale}`] || plan.features_en,
    is_popular: plan.is_popular,
    is_active: plan.is_active,
  };
}
