import React from 'react';
import { Calendar } from 'lucide-react';
import { HomepageConfig, SiteContent } from '../types';
import { INITIAL_HOMEPAGE_CONFIG } from '../data/initialData';
import { OptimizedImage } from './OptimizedImage';

interface HeroProps {
  content: SiteContent;
  homepageConfig?: HomepageConfig;
  onOpenConsultation: () => void;
  onScrollToPortfolio?: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  content,
  homepageConfig = INITIAL_HOMEPAGE_CONFIG,
  onOpenConsultation,
}) => {
  const { hero } = homepageConfig;

  return (
    <section className="relative overflow-hidden pt-10 pb-16 sm:pt-16 sm:pb-24 lg:pt-28 lg:pb-36">
      {/* Background Studio Visual with Measured Contrast Scrim */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <OptimizedImage
          src="/src/assets/images/hero_music_studio_1794239965350.jpg"
          alt="제이지뮤직스튜디오 전문 컨트롤룸"
          referrerPolicy="no-referrer"
          sizes="100vw"
          priority
          className="h-full w-full object-cover object-center scale-105 opacity-35 filter brightness-90 contrast-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/80 to-[#0a0a0a]/40" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left Column: Headline, Subtitle and CTA with Subtle Forward Hover Lift */}
          <div className="lg:col-span-7 py-2 sm:py-4 transition-all duration-300 ease-out lg:hover:scale-[1.02] lg:hover:-translate-y-1">
            {/* Subtle Studio Subname kicker */}
            {content.studioSubName && (
              <div className="inline-flex items-center mb-3 sm:mb-6">
                <span className="text-base sm:text-xl lg:text-[27px] font-bold leading-snug lg:leading-[34px] text-neutral-200 tracking-wide">
                  {content.studioSubName}
                </span>
              </div>
            )}

            {/* Refined Display Headline */}
            <h1 className="text-[30px] sm:text-5xl lg:text-[64px] font-extrabold tracking-tight text-white leading-[1.15] lg:leading-[1.1] text-balance mb-4 sm:mb-6 drop-shadow-[0_4px_20px_rgba(0,0,0,0.45)]">
              {content.heroHeadline ? content.heroHeadline.replace(/,$/, '') : 'MAKE YOUR OWN MUSIC'}
            </h1>

            {/* Value proposition subheadline */}
            <p className="text-sm sm:text-base lg:text-lg text-neutral-300 leading-relaxed max-w-2xl mb-7 sm:mb-10 text-pretty whitespace-pre-line">
              {content.heroSubheadline || '음악적 아이디어를 하나의 완성된 작품으로\n작곡부터 편곡, 프로듀싱까지 함께합니다.'}
            </p>

            {/* CTA Button */}
            <div>
              <button
                onClick={onOpenConsultation}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 sm:px-6 sm:py-3.5 text-[13px] sm:text-sm font-semibold text-black bg-white hover:bg-neutral-200 rounded-md transition-all shadow-lg hover:shadow-white/20 cursor-pointer"
              >
                <Calendar className="h-4 w-4" />
                <span>{hero.ctaText || '1:1 방문 상담 예약'}</span>
              </button>
            </div>
          </div>

          {/* Right Column: Uploaded Logo Image with Subtle Forward Hover Lift */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative flex items-center justify-center w-full max-w-[240px] sm:max-w-[360px] lg:max-w-[500px]">
              <OptimizedImage
                src={hero.logoUrl || '/assets/aistudio/KakaoTalk_20261029_152546267_01_40abeb0d.png'}
                alt="제이지뮤직스튜디오 공식 로고"
                sizes="(max-width: 639px) 240px, (max-width: 1023px) 360px, 500px"
                priority
                className="w-[240px] h-[240px] sm:w-[360px] sm:h-[360px] lg:w-[500px] lg:h-[500px] max-w-full object-contain drop-shadow-[0_0_50px_rgba(255,255,255,0.16)] transition-all duration-300 ease-out lg:hover:scale-[1.035] lg:hover:-translate-y-1.5 hover:drop-shadow-[0_14px_55px_rgba(255,255,255,0.26)]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
