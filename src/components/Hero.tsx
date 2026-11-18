import React from 'react';
import { Calendar } from 'lucide-react';
import { SiteContent } from '../types';

interface HeroProps {
  content: SiteContent;
  onOpenConsultation: () => void;
  onScrollToPortfolio?: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  content,
  onOpenConsultation,
}) => {
  return (
    <section className="relative overflow-hidden pt-16 pb-24 lg:pt-28 lg:pb-36">
      {/* Background Studio Visual with Measured Contrast Scrim */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <img
          src="/src/assets/images/hero_music_studio_1794239965350.jpg"
          alt="제이지뮤직스튜디오 전문 컨트롤룸"
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover object-center scale-105 opacity-35 filter brightness-90 contrast-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/80 to-[#0a0a0a]/40" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent" />
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Headline, Subtitle and CTA with Subtle Forward Hover Lift */}
          <div className="lg:col-span-7 py-4 transition-all duration-300 ease-out hover:scale-[1.02] hover:-translate-y-1">
            {/* Subtle Studio Subname kicker */}
            {content.studioSubName && (
              <div className="inline-flex items-center mb-6">
                <span className="text-[27px] font-bold leading-[34px] text-neutral-200">
                  {content.studioSubName}
                </span>
              </div>
            )}

            {/* Refined Display Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[64px] font-extrabold tracking-tight text-white leading-[1.1] text-balance mb-6 drop-shadow-[0_4px_20px_rgba(0,0,0,0.45)]">
              {content.heroHeadline ? content.heroHeadline.replace(/,$/, '') : 'MAKE YOUR OWN MUSIC'}
            </h1>

            {/* Value proposition subheadline */}
            <p className="text-base sm:text-lg text-neutral-300 leading-relaxed max-w-2xl mb-10 text-pretty whitespace-pre-line">
              {content.heroSubheadline || '음악적 아이디어를 하나의 완성된 작품으로\n작곡부터 편곡, 프로듀싱까지 함께합니다.'}
            </p>

            {/* CTA Button */}
            <div>
              <button
                onClick={onOpenConsultation}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-black bg-white hover:bg-neutral-200 rounded-md transition-all shadow-lg hover:shadow-white/20 cursor-pointer"
              >
                <Calendar className="h-4 w-4" />
                <span>1:1 방문 상담 예약</span>
              </button>
            </div>
          </div>

          {/* Right Column: Uploaded Logo Image with Subtle Forward Hover Lift */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative flex items-center justify-center">
              <img
                src="/assets/aistudio/KakaoTalk_20261029_152546267_01_40abeb0d.png"
                alt="제이지뮤직스튜디오 공식 로고"
                style={{
                  width: '500px',
                  height: '500px',
                  borderWidth: '4px',
                  borderRadius: '0px',
                  borderStyle: 'none',
                  borderColor: '#ffffff',
                }}
                className="max-w-full object-contain drop-shadow-[0_0_50px_rgba(255,255,255,0.16)] transition-all duration-300 ease-out hover:scale-[1.035] hover:-translate-y-1.5 hover:drop-shadow-[0_14px_55px_rgba(255,255,255,0.26)]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
