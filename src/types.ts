export type PostCategory = 'review' | 'release' | 'tip' | 'notice';
export type ReleaseCategory = string;

export interface Post {
  id: string;
  title: string;
  category: PostCategory;
  categoryLabel: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  thumbnailUrl: string;
  readTime: string;
}

export interface CurriculumWeek {
  week: number;
  title: string;
  topics: string[];
}

export interface CurriculumCourse {
  id: string;
  level: string;
  name: string;
  targetAudience: string;
  duration: string;
  sessionsPerWeek: string;
  description: string;
  keyPoints: string[];
  recommendedDaw: string;
  syllabus: CurriculumWeek[];
  isPopular?: boolean;
}

export interface AudioTrack {
  id: string;
  title: string;
  artist: string;
  tag: string;
  duration: number; // in seconds
  genre: string;
  bpm: number;
  description: string;
  type: 'original' | 'before_after';
}

export interface ProducerCredit {
  year: string;
  title: string;
  role: string;
  artistOrProject: string;
}

export interface ConsultationInquiry {
  id: string;
  inquiryType?: 'lesson' | 'production';
  name: string;
  phone: string;
  email: string;
  courseId: string;
  daw: string;
  genre: string;
  experienceLevel: string;
  message: string;
  createdAt: string;
  status: 'pending' | 'contacted' | 'completed';
}

export interface ThemeConfig {
  backgroundColor: string;
  cardColor: string;
  accentColor: string;
  textColor: string;
  mutedTextColor: string;
  borderColor: string;
  fontFamily: 'sans' | 'serif' | 'mono';
}

export interface SiteContent {
  studioName: string;
  studioSubName: string;
  heroHeadline: string;
  heroSubheadline: string;
  heroHighlightBadge: string;
  producerName: string;
  producerRole: string;
  producerBio: string;
  producerQuote: string;
  studioPhilosophy: string;
  studioEquipment: string[];
  contactPhone: string;
  contactEmail: string;
  kakaoId: string;
  studioAddress: string;
  transitInfo: string;
  instagramUrl: string;
  youtubeUrl: string;
  soundcloudUrl: string;
}

export interface SeoConfig {
  metaTitle: string;
  metaDescription: string;
  ogImageUrl: string;
  keywords: string;
}

export interface ReleaseItem {
  id: string;
  title: string;
  artist?: string;
  coverUrl: string;
  youtubeUrl?: string;
  releaseOrder: number;
  category?: string;
}

export interface PortfolioCategoryConfig {
  id: string;
  label: string;
  shortTag: string;
  aspectRatio: 'square' | 'poster';
}

export interface CustomSectionCard {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  badge?: string;
  imageUrl?: string;
  linkUrl?: string;
}

export interface CustomHomepageCategory {
  id: string;
  navLabel: string;
  showInNav: boolean;
  visible: boolean;
  badge: string;
  title: string;
  subtitle: string;
  layout: 'cards' | 'list' | 'banner';
  items: CustomSectionCard[];
  ctaText?: string;
  ctaAction?: 'lesson' | 'production' | 'link';
  ctaUrl?: string;
}

export interface LessonPlanItem {
  id: string;
  name: string;
  time: string;
  price: string;
  popular?: boolean;
  isOneDay?: boolean;
}

export interface ProductionServiceItem {
  id: string;
  service: string;
  price: string;
  priceNote?: string;
  note: string;
}

export interface LessonHighlightCard {
  id: string;
  title: string;
  description: string;
}

export interface HomepageConfig {
  sectionOrder: string[];
  customCategories: CustomHomepageCategory[];
  portfolioCategories: PortfolioCategoryConfig[];
  sections: {
    heroVisible: boolean;
    portfolioVisible: boolean;
    pricingVisible: boolean;
    productionPricingVisible: boolean;
    lessonVisible: boolean;
    contactVisible: boolean;
    footerVisible: boolean;
  };
  navLabels: {
    portfolio: string;
    pricing: string;
    productionPricing: string;
    lesson: string;
    workContact: string;
    location: string;
    topCta: string;
  };
  hero: {
    ctaText: string;
    logoUrl: string;
  };
  portfolio: {
    badge: string;
    title: string;
    subtitle: string;
    allTabLabel: string;
    musicTabLabel: string;
    programTabLabel: string;
    bgmTabLabel: string;
  };
  lessonPricing: {
    badge: string;
    title: string;
    subtitle: string;
    cardKicker: string;
    cardTitle: string;
    cardSubtitle: string;
    cardBadge: string;
    plans: LessonPlanItem[];
    footnotePrimary: string;
    footnoteSecondary: string;
    ctaText: string;
  };
  productionPricing: {
    badge: string;
    title: string;
    subtitle: string;
    cardKicker: string;
    cardTitle: string;
    cardSubtitle: string;
    cardBadge: string;
    services: ProductionServiceItem[];
    footnotePrimary: string;
    footnoteSecondary: string;
    ctaText: string;
  };
  lessonSection: {
    badge: string;
    title: string;
    cards: LessonHighlightCard[];
    ctaKicker: string;
    ctaTitle: string;
    ctaButtonText: string;
  };
  contactSection: {
    kicker: string;
    title: string;
    subtitle: string;
    locationCardTitle: string;
    regionTag: string;
    landmarkTag: string;
    roomTag: string;
    mapLinkUrl: string;
    kakaoUrl: string;
    instagramHandle: string;
    weekdayHours: string;
    weekendHours: string;
    lessonCourses: string[];
    productionTypes: string[];
    experienceLevels: string[];
    submitNotice: string;
  };
  footerSection: {
    tagline: string;
    businessInfo: string;
    naverPcUrl: string;
    naverMobileUrl: string;
  };
}
