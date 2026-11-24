import React, { useState, useRef } from 'react';
import { Menu, X, ArrowUpRight, ChevronDown, Music, Film, Disc } from 'lucide-react';
import { SiteContent, ReleaseCategory, ReleaseItem, HomepageConfig } from '../types';
import { INITIAL_RELEASES } from '../data/releasesData';
import { INITIAL_HOMEPAGE_CONFIG } from '../data/initialData';
import { OptimizedImage } from './OptimizedImage';

interface NavbarProps {
  content: SiteContent;
  releases?: ReleaseItem[];
  homepageConfig?: HomepageConfig;
  onOpenAdmin: () => void;
  onOpenConsultation: () => void;
  selectedCategory?: ReleaseCategory;
  onSelectCategory?: (category: ReleaseCategory) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  content,
  releases = INITIAL_RELEASES,
  homepageConfig = INITIAL_HOMEPAGE_CONFIG,
  onOpenAdmin,
  onOpenConsultation,
  selectedCategory = 'ALL',
  onSelectCategory,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [portfolioDropdownOpen, setPortfolioDropdownOpen] = useState(false);
  const logoClickCountRef = useRef(0);
  const logoClickTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleLogoAdminTrigger = (e: React.MouseEvent) => {
    e.preventDefault();
    logoClickCountRef.current += 1;

    if (logoClickTimerRef.current) {
      clearTimeout(logoClickTimerRef.current);
    }

    if (logoClickCountRef.current >= 10) {
      logoClickCountRef.current = 0;
      onOpenAdmin();
      return;
    }

    logoClickTimerRef.current = setTimeout(() => {
      logoClickCountRef.current = 0;
    }, 5000);
  };

  const countAll = releases.length;
  const {
    sections,
    navLabels,
    portfolio,
    hero,
    portfolioCategories = INITIAL_HOMEPAGE_CONFIG.portfolioCategories,
    customCategories = [],
  } = homepageConfig;

  const handleCategoryClick = (category: ReleaseCategory) => {
    onSelectCategory?.(category);
    setPortfolioDropdownOpen(false);
    setMobileMenuOpen(false);
    const element = document.getElementById('portfolio');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const getCategoryIcon = (catId: string) => {
    if (catId === 'PROGRAM') return <Film className="h-3.5 w-3.5 opacity-70" />;
    if (catId === 'BGM') return <Disc className="h-3.5 w-3.5 opacity-70" />;
    return <Music className="h-3.5 w-3.5 opacity-70" />;
  };

  const getCountLabel = (catId: string, count: number) => {
    return catId === 'PROGRAM' ? `${count}개 작품` : `${count}곡`;
  };

  const otherNavLinks = [
    ...(sections.pricingVisible ? [{ label: navLabels.pricing, href: '#pricing' }] : []),
    ...(sections.productionPricingVisible
      ? [{ label: navLabels.productionPricing, href: '#production-pricing' }]
      : []),
    ...(sections.lessonVisible ? [{ label: navLabels.lesson, href: '#lesson' }] : []),
    ...customCategories
      .filter((cat) => cat.visible && cat.showInNav && cat.navLabel.trim())
      .map((cat) => ({ label: cat.navLabel, href: `#${cat.id}` })),
    ...(sections.contactVisible
      ? [
          { label: navLabels.workContact, href: '#work-contact' },
          { label: navLabels.location, href: '#location' },
        ]
      : []),
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#0a0a0a]/90 backdrop-blur-md transition-colors">
      <div className="mx-auto flex h-16 sm:h-20 max-w-[1440px] items-center justify-between gap-2 sm:gap-6 px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Brand Wordmark */}
        <a
          href="#"
          className="group flex items-center gap-2 sm:gap-3 min-w-0 whitespace-nowrap text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white cursor-pointer"
        >
          <div
            onClick={(e) => {
              e.stopPropagation();
              handleLogoAdminTrigger(e);
            }}
            className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-black border border-white/20 overflow-hidden shrink-0 shadow-sm transition-transform group-hover:scale-105 cursor-pointer"
          >
            <OptimizedImage
              src={hero.logoUrl || '/assets/aistudio/KakaoTalk_20261029_152546267_01_40abeb0d.png'}
              alt="JG MUSIC STUDIO 로고"
              sizes="(max-width: 639px) 32px, 40px"
              maxWidth={320}
              priority
              className="h-full w-full object-contain"
            />
          </div>
          <span className="text-[15px] sm:text-lg font-bold tracking-tight text-white group-hover:text-neutral-300 transition-colors truncate">
            {content.studioName}
          </span>
        </a>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-7 text-sm font-medium text-neutral-300 flex-nowrap">
          {sections.portfolioVisible && (
            <div
              className="relative py-2"
              onMouseEnter={() => setPortfolioDropdownOpen(true)}
              onMouseLeave={() => setPortfolioDropdownOpen(false)}
            >
              <a
                href="#portfolio"
                onClick={(e) => {
                  e.preventDefault();
                  handleCategoryClick('ALL');
                }}
                className="flex items-center gap-1.5 whitespace-nowrap shrink-0 hover:text-white transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-white hover:after:w-full after:transition-all"
              >
                <span>{navLabels.portfolio}</span>
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform duration-200 ${
                    portfolioDropdownOpen ? 'rotate-180 text-white' : 'text-neutral-400'
                  }`}
                />
              </a>

              {/* Dropdown Menu for Dynamic Subcategories */}
              <div
                className={`absolute left-0 top-full pt-1.5 w-60 z-50 transition-all duration-200 origin-top-left ${
                  portfolioDropdownOpen
                    ? 'opacity-100 scale-100 pointer-events-auto'
                    : 'opacity-0 scale-95 pointer-events-none'
                }`}
              >
                <div className="rounded-xl border border-white/10 bg-[#121212]/95 backdrop-blur-xl p-2 shadow-2xl ring-1 ring-black/40 space-y-1">
                  <div className="px-2.5 py-1.5 text-[10px] font-semibold text-neutral-500 uppercase tracking-wider border-b border-white/5 flex items-center justify-between">
                    <span>{portfolio.badge}</span>
                    <span>{portfolioCategories.length} CATEGORIES</span>
                  </div>

                  {portfolioCategories.map((cat) => {
                    const count = releases.filter((r) => (r.category || 'MUSIC') === cat.id).length;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => handleCategoryClick(cat.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors ${
                          selectedCategory === cat.id
                            ? 'bg-white text-black'
                            : 'text-neutral-200 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {getCategoryIcon(cat.id)}
                          <span>{cat.label}</span>
                        </div>
                        <span
                          className={`text-[10px] font-normal ${
                            selectedCategory === cat.id ? 'text-neutral-700' : 'text-neutral-400'
                          }`}
                        >
                          {getCountLabel(cat.id, count)}
                        </span>
                      </button>
                    );
                  })}

                  <div className="pt-1 mt-1 border-t border-white/5">
                    <button
                      type="button"
                      onClick={() => handleCategoryClick('ALL')}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                        selectedCategory === 'ALL'
                          ? 'bg-white/15 text-white'
                          : 'text-neutral-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <span>{portfolio.allTabLabel}보기 (ALL)</span>
                      <span className="text-[10px]">전체 {countAll}개 작품</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Other navigation links */}
          {otherNavLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="whitespace-nowrap shrink-0 hover:text-white transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-white hover:after:w-full after:transition-all"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: Actions */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          <button
            onClick={onOpenConsultation}
            className="group inline-flex items-center gap-1 sm:gap-1.5 px-2.5 py-1.5 sm:px-4 sm:py-2 text-[11px] sm:text-xs font-semibold text-black bg-white hover:bg-neutral-200 rounded-md transition-colors whitespace-nowrap shrink-0 shadow-sm"
          >
            <span>{navLabels.topCta}</span>
            <ArrowUpRight className="h-3 w-3 sm:h-3.5 sm:w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 sm:p-2 text-neutral-400 hover:text-white focus:outline-none"
            aria-label="메뉴 열기"
          >
            {mobileMenuOpen ? <X className="h-5 w-5 sm:h-6 sm:w-6" /> : <Menu className="h-5 w-5 sm:h-6 sm:w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-white/10 bg-[#0d0d0d] px-4 sm:px-6 py-5 transition-all">
          <div className="flex flex-col gap-4">
            {sections.portfolioVisible && (
              <div className="space-y-2 pb-2 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => handleCategoryClick('ALL')}
                    className="text-[15px] font-bold text-white hover:text-neutral-300"
                  >
                    {navLabels.portfolio}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCategoryClick('ALL')}
                    className="text-xs text-neutral-400 hover:text-white"
                  >
                    {portfolio.allTabLabel}보기
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-1">
                  {portfolioCategories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => handleCategoryClick(cat.id)}
                      className={`py-2 px-2 text-xs font-semibold rounded-lg border text-center transition-all truncate ${
                        selectedCategory === cat.id
                          ? 'bg-white text-black border-white'
                          : 'bg-neutral-900 text-neutral-300 border-white/10 hover:border-white/30'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {otherNavLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-[15px] font-medium text-neutral-200 hover:text-white py-1"
              >
                {link.label}
              </a>
            ))}

            <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenConsultation();
                }}
                className="w-full py-3 text-center text-[13px] font-semibold text-black bg-white rounded-md"
              >
                {navLabels.topCta}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
