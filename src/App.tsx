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
  INITIAL_HOMEPAGE_CONFIG,
} from './data/initialData';
import { INITIAL_RELEASES } from './data/releasesData';
import {
  ConsultationInquiry,
  CurriculumCourse,
  HomepageConfig,
  Post,
  ProducerCredit,
  ReleaseCategory,
  ReleaseItem,
  SeoConfig,
  SiteContent,
  ThemeConfig,
} from './types';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { AudioPlayer } from './components/AudioPlayer';
import { PricingSection } from './components/PricingSection';
import { BlogReviews } from './components/BlogReviews';
import { ContactSection } from './components/ContactSection';
import { CustomSectionRenderer } from './components/CustomSectionRenderer';
import { Footer } from './components/Footer';
import { AdminModal } from './components/AdminModal';

const mergeHomepageConfig = (saved: Partial<HomepageConfig> | null): HomepageConfig => {
  if (!saved) return INITIAL_HOMEPAGE_CONFIG;
  return {
    sectionOrder: saved.sectionOrder || INITIAL_HOMEPAGE_CONFIG.sectionOrder,
    customCategories: saved.customCategories || INITIAL_HOMEPAGE_CONFIG.customCategories,
    portfolioCategories:
      saved.portfolioCategories || INITIAL_HOMEPAGE_CONFIG.portfolioCategories,
    sections: { ...INITIAL_HOMEPAGE_CONFIG.sections, ...(saved.sections || {}) },
    navLabels: (() => {
      const mergedNav = { ...INITIAL_HOMEPAGE_CONFIG.navLabels, ...(saved.navLabels || {}) };
      if (mergedNav.topCta === '레슨 상담 신청') {
        mergedNav.topCta = '방문 상담 예약';
      }
      return mergedNav;
    })(),
    hero: { ...INITIAL_HOMEPAGE_CONFIG.hero, ...(saved.hero || {}) },
    portfolio: { ...INITIAL_HOMEPAGE_CONFIG.portfolio, ...(saved.portfolio || {}) },
    lessonPricing: (() => {
      const merged = {
        ...INITIAL_HOMEPAGE_CONFIG.lessonPricing,
        ...(saved.lessonPricing || {}),
        plans: saved.lessonPricing?.plans || INITIAL_HOMEPAGE_CONFIG.lessonPricing.plans,
      };
      if (merged.subtitle === '제이지뮤직스튜디오의 1:1 개인 레슨 수업 금액을 안내해 드립니다.') {
        merged.subtitle = INITIAL_HOMEPAGE_CONFIG.lessonPricing.subtitle;
      }
      if (merged.footnotePrimary === '※ 월 수강료는 주 1회, 월 4회 기준입니다. 원데이 클래스는 별도입니다.') {
        merged.footnotePrimary = INITIAL_HOMEPAGE_CONFIG.lessonPricing.footnotePrimary;
      }
      return merged;
    })(),
    productionPricing: (() => {
      const merged = {
        ...INITIAL_HOMEPAGE_CONFIG.productionPricing,
        ...(saved.productionPricing || {}),
        services:
          saved.productionPricing?.services || INITIAL_HOMEPAGE_CONFIG.productionPricing.services,
      };
      if (merged.cardBadge === '현업 프로 사운드') {
        merged.cardBadge = '';
      }
      if (merged.subtitle === '제이지뮤직스튜디오의 음원 제작 및 편곡 표준 견적을 안내해 드립니다.') {
        merged.subtitle = INITIAL_HOMEPAGE_CONFIG.productionPricing.subtitle;
      }
      merged.services = merged.services.map((svc) => {
        if (svc.id === 'svc-1') {
          return {
            ...svc,
            note:
              svc.note === '작·편곡부터 믹싱/마스터링까지 풀 프로덕션'
                ? '작˙편곡부터 믹싱/마스터링까지\n풀 프로덕션'
                : svc.note,
            price: svc.price === '상담 문의' ? '1,200,000원~' : svc.price,
            priceNote: svc.price === '상담 문의' ? '(가요 4분 기준)' : svc.priceNote,
          };
        }
        if (svc.id === 'svc-2') {
          return {
            ...svc,
            note: svc.note === '메인 멜로디 및 트랙 작곡' ? '메인 멜로디 작곡' : svc.note,
            price: svc.price === '상담 문의' ? '500,000원~' : svc.price,
            priceNote: svc.price === '상담 문의' ? '(가요 4분 기준)' : svc.priceNote,
          };
        }
        if (svc.id === 'svc-3') {
          return {
            ...svc,
            note: svc.note === '장르별 상업 음원 표준 편곡' ? '장르별 음원 편곡' : svc.note,
            price: svc.price === '상담 문의' ? '500,000원~' : svc.price,
            priceNote: svc.price === '상담 문의' ? '(가요 4분 기준)' : svc.priceNote,
          };
        }
        if (
          svc.id === 'svc-4' &&
          (svc.note === '가요 4분 기준 정밀 오케스트레이션' || svc.note === '가요 4분 기준 RMO 편곡')
        ) {
          return { ...svc, note: '가요 RMO 편곡' };
        }
        if (
          svc.id === 'svc-5' &&
          (svc.note === '가요 4분 기준 어쿠스틱/EP 반주' || svc.note === '가요 4분 기준 피아노 편곡')
        ) {
          return { ...svc, note: '가요 피아노 편곡' };
        }
        return svc;
      });
      return merged;
    })(),
    lessonSection: (() => {
      const merged = {
        ...INITIAL_HOMEPAGE_CONFIG.lessonSection,
        ...(saved.lessonSection || {}),
        cards: saved.lessonSection?.cards || INITIAL_HOMEPAGE_CONFIG.lessonSection.cards,
      };
      merged.cards = merged.cards.map((card) => {
        if (
          card.id === 'card-2' &&
          card.description ===
            '작은 차이가 모여 하나의 완성도를 만듭니다.\n사운드의 질감과 공간감, 섬세한 표현까지 음악의 디테일을 깊이 있게 다룹니다.'
        ) {
          return {
            ...card,
            description:
              '작은 차이가 모여 하나의 완성도를 만듭니다.\n사운드의 질감과 공간감, 섬세한 표현까지\n음악의 디테일을 깊이 있게 다룹니다.',
          };
        }
        return card;
      });
      return merged;
    })(),
    contactSection: {
      ...INITIAL_HOMEPAGE_CONFIG.contactSection,
      ...(saved.contactSection || {}),
      lessonCourses:
        saved.contactSection?.lessonCourses || INITIAL_HOMEPAGE_CONFIG.contactSection.lessonCourses,
      productionTypes:
        saved.contactSection?.productionTypes ||
        INITIAL_HOMEPAGE_CONFIG.contactSection.productionTypes,
      experienceLevels:
        saved.contactSection?.experienceLevels ||
        INITIAL_HOMEPAGE_CONFIG.contactSection.experienceLevels,
    },
    footerSection: {
      ...INITIAL_HOMEPAGE_CONFIG.footerSection,
      ...(saved.footerSection || {}),
    },
  };
};

export default function App() {
  // --- Persistent States from LocalStorage ---
  const [theme, setTheme] = useState<ThemeConfig>(() => {
    try {
      const saved = localStorage.getItem('jz_theme');
      return saved ? { ...INITIAL_THEME, ...JSON.parse(saved) } : INITIAL_THEME;
    } catch {
      return INITIAL_THEME;
    }
  });

  const [siteContent, setSiteContent] = useState<SiteContent>(() => {
    try {
      const saved = localStorage.getItem('jz_site_content');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (
          parsed.heroHeadline === '아이디어가 완전한 트랙이 되는 곳.' ||
          parsed.heroHeadline === 'MAKE YOUR OWN MUSIC,'
        ) {
          parsed.heroHeadline = 'MAKE YOUR OWN MUSIC';
        }
        return { ...INITIAL_SITE_CONTENT, ...parsed };
      }
      return INITIAL_SITE_CONTENT;
    } catch {
      return INITIAL_SITE_CONTENT;
    }
  });

  const [releases, setReleases] = useState<ReleaseItem[]>(() => {
    try {
      const saved = localStorage.getItem('jz_releases');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
      return INITIAL_RELEASES;
    } catch {
      return INITIAL_RELEASES;
    }
  });

  const [homepageConfig, setHomepageConfig] = useState<HomepageConfig>(() => {
    try {
      const saved = localStorage.getItem('jz_homepage_config');
      return saved ? mergeHomepageConfig(JSON.parse(saved)) : INITIAL_HOMEPAGE_CONFIG;
    } catch {
      return INITIAL_HOMEPAGE_CONFIG;
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
    try {
      localStorage.setItem('jz_releases', JSON.stringify(releases));
    } catch (err) {
      console.error('Failed to save releases to localStorage:', err);
    }
  }, [releases]);

  useEffect(() => {
    try {
      localStorage.setItem('jz_homepage_config', JSON.stringify(homepageConfig));
    } catch (err) {
      console.error('Failed to save homepageConfig to localStorage:', err);
    }
  }, [homepageConfig]);

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
    localStorage.removeItem('jz_releases');
    localStorage.removeItem('jz_homepage_config');
    localStorage.removeItem('jz_posts');
    localStorage.removeItem('jz_credits');
    localStorage.removeItem('jz_curriculum');
    localStorage.removeItem('jz_seo');
    localStorage.removeItem('jz_inquiries');

    setTheme(INITIAL_THEME);
    setSiteContent(INITIAL_SITE_CONTENT);
    setReleases(INITIAL_RELEASES);
    setHomepageConfig(INITIAL_HOMEPAGE_CONFIG);
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

  const {
    sections,
    sectionOrder = INITIAL_HOMEPAGE_CONFIG.sectionOrder,
    customCategories = [],
  } = homepageConfig;

  const renderSectionById = (sectionId: string) => {
    switch (sectionId) {
      case 'hero':
        return (
          sections.heroVisible && (
            <Hero
              key="hero"
              content={siteContent}
              homepageConfig={homepageConfig}
              onOpenConsultation={() => scrollToContact('lesson')}
              onScrollToPortfolio={scrollToPortfolio}
            />
          )
        );
      case 'portfolio':
        return (
          sections.portfolioVisible && (
            <AudioPlayer
              key="portfolio"
              tracks={INITIAL_AUDIO_TRACKS}
              releases={releases}
              homepageConfig={homepageConfig}
              selectedCategory={selectedReleaseCategory}
              onSelectCategory={setSelectedReleaseCategory}
            />
          )
        );
      case 'pricing':
        return (
          sections.pricingVisible && (
            <PricingSection
              key="pricing"
              homepageConfig={homepageConfig}
              showLessonPricing={true}
              showProductionPricing={false}
              onScrollToContact={scrollToContact}
            />
          )
        );
      case 'productionPricing':
        return (
          sections.productionPricingVisible && (
            <PricingSection
              key="productionPricing"
              homepageConfig={homepageConfig}
              showLessonPricing={false}
              showProductionPricing={true}
              onScrollToContact={scrollToContact}
            />
          )
        );
      case 'lesson':
        return (
          sections.lessonVisible && (
            <BlogReviews
              key="lesson"
              posts={posts}
              content={siteContent}
              homepageConfig={homepageConfig}
              onScrollToContact={() => scrollToContact('lesson')}
              onSelectCourse={handleSelectCourse}
            />
          )
        );
      case 'contact':
        return (
          sections.contactVisible && (
            <ContactSection
              key="contact"
              content={siteContent}
              courses={courses}
              homepageConfig={homepageConfig}
              selectedCourseId={selectedCourseForConsult}
              activeInquiryType={activeInquiryType}
              onInquiryTypeChange={setActiveInquiryType}
              onSubmitInquiry={handleConsultationSubmit}
            />
          )
        );
      default: {
        const customSec = customCategories.find((c) => c.id === sectionId);
        if (!customSec || !customSec.visible) return null;
        return (
          <CustomSectionRenderer
            key={customSec.id}
            section={customSec}
            onScrollToContact={scrollToContact}
          />
        );
      }
    }
  };

  return (
    <div
      className={`min-h-screen w-full overflow-x-clip text-neutral-200 transition-colors duration-300 ${fontClass}`}
      style={{ backgroundColor: theme.backgroundColor }}
    >
      {/* GNB Navigation Bar */}
      <Navbar
        content={siteContent}
        releases={releases}
        homepageConfig={homepageConfig}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenConsultation={() => scrollToContact('lesson')}
        selectedCategory={selectedReleaseCategory}
        onSelectCategory={setSelectedReleaseCategory}
      />

      {/* Ordered Homepage Sections (Built-in + Custom Categories) */}
      {sectionOrder.map((secId) => renderSectionById(secId))}

      {/* Footer */}
      {sections.footerVisible && (
        <Footer
          content={siteContent}
          homepageConfig={homepageConfig}
        />
      )}

      {/* Full Integrated Admin Dashboard Modal */}
      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        releases={releases}
        setReleases={setReleases}
        homepageConfig={homepageConfig}
        setHomepageConfig={setHomepageConfig}
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
