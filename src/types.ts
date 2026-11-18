export type PostCategory = 'review' | 'release' | 'tip' | 'notice';
export type ReleaseCategory = 'ALL' | 'MUSIC' | 'PROGRAM' | 'BGM';

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
