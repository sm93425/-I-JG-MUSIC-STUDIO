import React, { useState } from 'react';
import { Menu, X, SlidersHorizontal, ArrowUpRight, ChevronDown, Music, Film, Disc } from 'lucide-react';
import { SiteContent, ReleaseCategory } from '../types';

interface NavbarProps {
  content: SiteContent;
  onOpenAdmin: () => void;
  onOpenConsultation: () => void;
  selectedCategory?: ReleaseCategory;
  onSelectCategory?: (category: ReleaseCategory) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  content,
  onOpenAdmin,
  onOpenConsultation,
  selectedCategory = 'ALL',
  onSelectCategory,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [portfolioDropdownOpen, setPortfolioDropdownOpen] = useState(false);

  const handleCategoryClick = (category: ReleaseCategory) => {
    onSelectCategory?.(category);
    setPortfolioDropdownOpen(false);
    setMobileMenuOpen(false);
    const element = document.getElementById('portfolio');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const otherNavLinks = [
    { label: '레슨 금액', href: '#pricing' },
    { label: '음원 제작 견적', href: '#production-pricing' },
    { label: '레슨 문의', href: '#lesson' },
    { label: '작업 문의', href: '#work-contact' },
    { label: '오시는 길', href: '#location' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#0a0a0a]/90 backdrop-blur-md transition-colors">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-8 px-6 lg:px-8">
        {/* Zone 1: Brand Wordmark (Single text element) */}
        <a
          href="#"
          className="group flex items-center gap-3 whitespace-nowrap shrink-0 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-black border border-white/20 overflow-hidden shrink-0 shadow-sm transition-transform group-hover:scale-105">
            <img
              src="/assets/aistudio/KakaoTalk_20261029_152546267_01_40abeb0d.png"
              alt="JG MUSIC STUDIO 로고"
              className="h-full w-full object-contain"
            />
          </div>
          <span className="text-lg font-bold tracking-tight text-white group-hover:text-neutral-300 transition-colors">
            {content.studioName}
          </span>
        </a>

        {/* Zone 2: Navigation Links with Category Dropdown for 발매 작품 */}
        <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-neutral-300">
          {/* Portfolio Item with 3 Subcategories */}
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
              <span>발매 작품</span>
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform duration-200 ${
                  portfolioDropdownOpen ? 'rotate-180 text-white' : 'text-neutral-400'
                }`}
              />
            </a>

            {/* Dropdown Menu for 3 Subcategories */}
            <div
              className={`absolute left-0 top-full pt-1.5 w-60 z-50 transition-all duration-200 origin-top-left ${
                portfolioDropdownOpen
                  ? 'opacity-100 scale-100 pointer-events-auto'
                  : 'opacity-0 scale-95 pointer-events-none'
              }`}
            >
              <div className="rounded-xl border border-white/10 bg-[#121212]/95 backdrop-blur-xl p-2 shadow-2xl ring-1 ring-black/40 space-y-1">
                <div className="px-2.5 py-1.5 text-[10px] font-semibold text-neutral-500 uppercase tracking-wider border-b border-white/5 flex items-center justify-between">
                  <span>DISCOGRAPHY</span>
                  <span>3 CATEGORIES</span>
                </div>

                {/* Subcategory 1: MUSIC */}
                <button
                  type="button"
                  onClick={() => handleCategoryClick('MUSIC')}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors ${
                    selectedCategory === 'MUSIC'
                      ? 'bg-white text-black'
                      : 'text-neutral-200 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Music className="h-3.5 w-3.5 opacity-70" />
                    <span>1. MUSIC</span>
                  </div>
                  <span className={`text-[10px] font-normal ${selectedCategory === 'MUSIC' ? 'text-neutral-700' : 'text-neutral-400'}`}>
                    117곡
                  </span>
                </button>

                {/* Subcategory 2: PROGRAM */}
                <button
                  type="button"
                  onClick={() => handleCategoryClick('PROGRAM')}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors ${
                    selectedCategory === 'PROGRAM'
                      ? 'bg-white text-black'
                      : 'text-neutral-200 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Film className="h-3.5 w-3.5 opacity-70" />
                    <span>2. PROGRAM</span>
                  </div>
                  <span className={`text-[10px] font-normal ${selectedCategory === 'PROGRAM' ? 'text-neutral-700' : 'text-neutral-400'}`}>
                    18개 작품
                  </span>
                </button>

                {/* Subcategory 3: BGM */}
                <button
                  type="button"
                  onClick={() => handleCategoryClick('BGM')}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors ${
                    selectedCategory === 'BGM'
                      ? 'bg-white text-black'
                      : 'text-neutral-200 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Disc className="h-3.5 w-3.5 opacity-70" />
                    <span>3. BGM</span>
                  </div>
                  <span className={`text-[10px] font-normal ${selectedCategory === 'BGM' ? 'text-neutral-700' : 'text-neutral-400'}`}>
                    9곡
                  </span>
                </button>

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
                    <span>전체보기 (ALL)</span>
                    <span className="text-[10px]">전체 144개 작품</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

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

        {/* Zone 3: Actions (Primary CTA + Discreet Admin Mode) */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenAdmin}
            title="관리자 대시보드"
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-neutral-400 hover:text-white border border-white/10 hover:border-white/20 rounded-md transition-colors"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">관리자</span>
          </button>

          <button
            onClick={onOpenConsultation}
            className="group inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-black bg-white hover:bg-neutral-200 rounded-md transition-colors whitespace-nowrap shrink-0 shadow-sm"
          >
            <span>레슨 상담 신청</span>
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-neutral-400 hover:text-white focus:outline-none"
            aria-label="메뉴 열기"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-white/10 bg-[#0d0d0d] px-6 py-5 transition-all">
          <div className="flex flex-col gap-4">
            {/* Mobile 발매 작품 + 3 Subcategories */}
            <div className="space-y-2 pb-2 border-b border-white/10">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => handleCategoryClick('ALL')}
                  className="text-base font-bold text-white hover:text-neutral-300"
                >
                  발매 작품
                </button>
                <button
                  type="button"
                  onClick={() => handleCategoryClick('ALL')}
                  className="text-xs text-neutral-400 hover:text-white"
                >
                  전체보기
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => handleCategoryClick('MUSIC')}
                  className={`py-2 px-2 text-xs font-semibold rounded-lg border text-center transition-all ${
                    selectedCategory === 'MUSIC'
                      ? 'bg-white text-black border-white'
                      : 'bg-neutral-900 text-neutral-300 border-white/10 hover:border-white/30'
                  }`}
                >
                  1. MUSIC
                </button>
                <button
                  type="button"
                  onClick={() => handleCategoryClick('PROGRAM')}
                  className={`py-2 px-2 text-xs font-semibold rounded-lg border text-center transition-all ${
                    selectedCategory === 'PROGRAM'
                      ? 'bg-white text-black border-white'
                      : 'bg-neutral-900 text-neutral-300 border-white/10 hover:border-white/30'
                  }`}
                >
                  2. PROGRAM
                </button>
                <button
                  type="button"
                  onClick={() => handleCategoryClick('BGM')}
                  className={`py-2 px-2 text-xs font-semibold rounded-lg border text-center transition-all ${
                    selectedCategory === 'BGM'
                      ? 'bg-white text-black border-white'
                      : 'bg-neutral-900 text-neutral-300 border-white/10 hover:border-white/30'
                  }`}
                >
                  3. BGM
                </button>
              </div>
            </div>

            {otherNavLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-medium text-neutral-200 hover:text-white py-1"
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
                className="w-full py-3 text-center text-sm font-semibold text-black bg-white rounded-md"
              >
                1:1 맞춤 상담 신청하기
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdmin();
                }}
                className="w-full py-2.5 text-center text-xs text-neutral-400 hover:text-white border border-white/10 rounded-md flex items-center justify-center gap-2"
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
                관리자 모드 열기
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
