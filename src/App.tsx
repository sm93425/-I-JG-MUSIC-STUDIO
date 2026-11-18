/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  INITIAL_CURRICULUM,
  INITIAL_POSTS,
  INITIAL_PRODUCER_CREDITS,
  INITIAL_SEO,
  INITIAL_SITE_CONTENT,
  INITIAL_THEME,
  INITIAL_AUDIO_TRACKS,
  INITIAL_INQUIRIES,
} from './data/initialData';
import {
  ConsultationInquiry,
  CurriculumCourse,
  Post,
  ProducerCredit,
  SeoConfig,
  SiteContent,
  ThemeConfig,
  ReleaseCategory,
} from './types';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Curriculum } from './components/Curriculum';
import { AudioPlayer } from './components/AudioPlayer';
import { PricingSection } from './components/PricingSection';
import { BlogReviews } from './components/BlogReviews';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { AdminModal } from './components/AdminModal';

export default function App() {
  // --- Persistent States from LocalStorage ---
  const [theme, setTheme] = useState<ThemeConfig>(() => {
    try {
      const saved = localStorage.getItem('jz_theme');
      return saved ? JSON.parse(saved) : INITIAL_THEME;
    } catch {
      return INITIAL_THEME;
    }
  });

  const [siteContent, setSiteContent] = useState<SiteContent>(() => {
    try {
      const saved = localStorage.getItem('jz_site_content');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.heroHeadline === '아이디어가 완전한 트랙이 되는 곳.' || parsed.heroHeadline === 'MAKE YOUR OWN MUSIC,') {
          parsed.heroHeadline = 'MAKE YOUR OWN MUSIC';
        }
        if (parsed.heroSubheadline && parsed.heroSubheadline.includes('차트 인 프로듀서의 1:1 밀착 코칭')) {
          parsed.heroSubheadline = '음악적 아이디어를 하나의 완성된 작품으로\n작곡부터 편곡, 프로듀싱까지 함께합니다.';
        }
        parsed.heroHighlightBadge = '';
        parsed.studioAddress = '경기도 수원시 권선구 호매실동 407 202호 (제이지뮤직스튜디오)';
        parsed.contactPhone = '050-71348-0425';
        parsed.contactEmail = 'jg_musicstudio@naver.com';
        parsed.kakaoId = '채널 : 제이지뮤직스튜디오';
        parsed.transitInfo = '사전 예약 필수';
        parsed.instagramUrl = 'https://www.instagram.com/jg.musicstudio/';
        parsed.producerName = '장성민 (JG Producer)';
        return parsed;
      }
      return INITIAL_SITE_CONTENT;
    } catch {
      return INITIAL_SITE_CONTENT;
    }
  });

  const [posts, setPosts] = useState<Post[]>(() => {
    try {
      const saved = localStorage.getItem('jz_posts');
      return saved ? JSON.parse(saved) : INITIAL_POSTS;
    } catch {
      return INITIAL_POSTS;
    }
  });

  const [credits, setCredits] = useState<ProducerCredit[]>(() => {
    try {
      const saved = localStorage.getItem('jz_credits');
      return saved ? JSON.parse(saved) : INITIAL_PRODUCER_CREDITS;
    } catch {
      return INITIAL_PRODUCER_CREDITS;
    }
  });

  const [courses, setCourses] = useState<CurriculumCourse[]>(() => {
    try {
      const saved = localStorage.getItem('jz_curriculum');
      return saved ? JSON.parse(saved) : INITIAL_CURRICULUM;
    } catch {
      return INITIAL_CURRICULUM;
    }
  });

  const [seo, setSeo] = useState<SeoConfig>(() => {
    try {
      const saved = localStorage.getItem('jz_seo');
      return saved ? JSON.parse(saved) : INITIAL_SEO;
    } catch {
      return INITIAL_SEO;
    }
  });

  const [inquiries, setInquiries] = useState<ConsultationInquiry[]>(() => {
    try {
      const saved = localStorage.getItem('jz_inquiries');
      return saved ? JSON.parse(saved) : INITIAL_INQUIRIES;
    } catch {
      return INITIAL_INQUIRIES;
    }
  });

  // UI state
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [selectedCourseForConsult, setSelectedCourseForConsult] = useState<string>('');
  const [selectedReleaseCategory, setSelectedReleaseCategory] = useState<ReleaseCategory>('ALL');
  const [activeInquiryType, setActiveInquiryType] = useState<'lesson' | 'production'>('lesson');

  // --- Auto-persist effects ---
  useEffect(() => {
    localStorage.setItem('jz_theme', JSON.stringify(theme));
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('jz_site_content', JSON.stringify(siteContent));
  }, [siteContent]);

  useEffect(() => {
    localStorage.setItem('jz_posts', JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem('jz_credits', JSON.stringify(credits));
  }, [credits]);

  useEffect(() => {
    localStorage.setItem('jz_curriculum', JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem('jz_seo', JSON.stringify(seo));
    document.title = seo.metaTitle;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', seo.metaDescription);
  }, [seo]);

  useEffect(() => {
    localStorage.setItem('jz_inquiries', JSON.stringify(inquiries));
  }, [inquiries]);

  // Handle consultation inquiry submit
  const handleConsultationSubmit = (
    inquiryData: Omit<ConsultationInquiry, 'id' | 'createdAt' | 'status'>
  ) => {
    const newInquiry: ConsultationInquiry = {
      ...inquiryData,
      id: `inq-${Date.now()}`,
      createdAt: new Date().toLocaleString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }),
      status: 'pending',
    };
    setInquiries((prev) => [newInquiry, ...prev]);
  };

  // Reset all data to factory initial state
  const handleResetAllData = () => {
    localStorage.removeItem('jz_theme');
    localStorage.removeItem('jz_site_content');
    localStorage.removeItem('jz_posts');
    localStorage.removeItem('jz_credits');
    localStorage.removeItem('jz_curriculum');
    localStorage.removeItem('jz_seo');
    localStorage.removeItem('jz_inquiries');

    setTheme(INITIAL_THEME);
    setSiteContent(INITIAL_SITE_CONTENT);
    setPosts(INITIAL_POSTS);
    setCredits(INITIAL_PRODUCER_CREDITS);
    setCourses(INITIAL_CURRICULUM);
    setSeo(INITIAL_SEO);
    setInquiries(INITIAL_INQUIRIES);
  };

  const handleSelectCourse = (courseId: string) => {
    setSelectedCourseForConsult(courseId);
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToContact = (type?: 'lesson' | 'production') => {
    if (type) {
      setActiveInquiryType(type);
    }
    const targetId = type === 'production' ? 'work-contact' : 'contact';
    const element = document.getElementById(targetId) || document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToPortfolio = () => {
    const element = document.getElementById('portfolio');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Dynamically select font class
  const fontClass =
    theme.fontFamily === 'serif'
      ? 'font-serif'
      : theme.fontFamily === 'mono'
      ? 'font-mono'
      : "font-['Plus_Jakarta_Sans','Noto_Sans_KR',sans-serif]";

  return (
    <div
      className={`min-h-screen text-neutral-200 transition-colors duration-300 ${fontClass}`}
      style={{ backgroundColor: theme.backgroundColor }}
    >
      {/* GNB Navigation Bar */}
      <Navbar
        content={siteContent}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenConsultation={() => scrollToContact('lesson')}
        selectedCategory={selectedReleaseCategory}
        onSelectCategory={setSelectedReleaseCategory}
      />

      {/* Hero Section */}
      <Hero
        content={siteContent}
        onOpenConsultation={() => scrollToContact('lesson')}
        onScrollToPortfolio={scrollToPortfolio}
      />

      {/* Official Releases Showcase */}
      <AudioPlayer
        tracks={INITIAL_AUDIO_TRACKS}
        selectedCategory={selectedReleaseCategory}
        onSelectCategory={setSelectedReleaseCategory}
      />

      {/* Rates & Estimates: Lesson Price & Music Production */}
      <PricingSection onScrollToContact={scrollToContact} />

      {/* Blog & Reviews: Stories, Release Reviews & Production Tips */}
      <BlogReviews
        posts={posts}
        content={siteContent}
        onScrollToContact={() => scrollToContact('lesson')}
        onSelectCourse={handleSelectCourse}
      />

      {/* Contact Section: Reservation Form & Location Map */}
      <ContactSection
        content={siteContent}
        courses={courses}
        selectedCourseId={selectedCourseForConsult}
        activeInquiryType={activeInquiryType}
        onInquiryTypeChange={setActiveInquiryType}
        onSubmitInquiry={handleConsultationSubmit}
      />

      {/* Footer */}
      <Footer
        content={siteContent}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Full Integrated Admin Dashboard Modal */}
      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        posts={posts}
        setPosts={setPosts}
        theme={theme}
        setTheme={setTheme}
        content={siteContent}
        setContent={setSiteContent}
        credits={credits}
        setCredits={setCredits}
        courses={courses}
        setCourses={setCourses}
        seo={seo}
        setSeo={setSeo}
        inquiries={inquiries}
        setInquiries={setInquiries}
        onResetAllData={handleResetAllData}
      />
    </div>
  );
}
