import React, { useState, useEffect } from 'react';
import { ArrowUp, Instagram } from 'lucide-react';
import { HomepageConfig, SiteContent } from '../types';
import { INITIAL_HOMEPAGE_CONFIG } from '../data/initialData';

interface FooterProps {
  content: SiteContent;
  homepageConfig?: HomepageConfig;
}

export const Footer: React.FC<FooterProps> = ({
  content,
  homepageConfig = INITIAL_HOMEPAGE_CONFIG,
}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(
        navigator.userAgent
      );
      setIsMobile(mobileUA || window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const { footerSection, contactSection } = homepageConfig;

  return (
    <footer className="border-t border-white/10 bg-[#070707] text-neutral-400 py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 sm:gap-8 pb-8 sm:pb-12 border-b border-white/5">
          {/* Brand */}
          <div className="space-y-1.5 sm:space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[15px] sm:text-base font-bold tracking-tight text-white">
                {content.studioName}
              </span>
              <span className="text-[11px] sm:text-xs text-neutral-500 font-mono">
                {content.studioSubName}
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-neutral-400 max-w-md leading-relaxed font-medium break-keep">
              {footerSection.tagline}
            </p>
          </div>

          {/* Social Links & Back to Top */}
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <a
                href={content.instagramUrl || 'https://www.instagram.com/jg.musicstudio/'}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="p-2 text-neutral-400 hover:text-white rounded-md hover:bg-white/5 transition-colors"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href={contactSection.kakaoUrl || 'https://pf.kakao.com/_sQkxeX'}
                target="_blank"
                rel="noreferrer"
                aria-label="KakaoTalk"
                className="p-2 text-neutral-400 hover:text-[#FEE500] rounded-md hover:bg-white/5 transition-colors"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 3c-5.523 0-10 3.582-10 8 0 2.852 1.848 5.357 4.636 6.713-.205.772-.743 2.793-.852 3.228-.135.54.197.533.414.389.17-.113 2.702-1.835 3.799-2.585.65.094 1.32.145 2.003.145 5.523 0 10-3.582 10-8s-4.477-8-10-8z" />
                </svg>
              </a>
              <a
                href={isMobile ? footerSection.naverMobileUrl : footerSection.naverPcUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="Naver Place"
                className="p-2 text-neutral-400 hover:text-[#03C75A] rounded-md hover:bg-white/5 transition-colors"
              >
                <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M16.273 12.845L7.376 0H0v24h7.727V11.155L16.624 24H24V0h-7.727v12.845z" />
                </svg>
              </a>
            </div>

            <button
              onClick={scrollToTop}
              className="p-2 text-neutral-400 hover:text-white border border-white/10 rounded-md hover:border-white/20 transition-colors flex items-center gap-1.5 text-xs"
              aria-label="맨 위로 가기"
            >
              <ArrowUp className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">TOP</span>
            </button>
          </div>
        </div>

        {/* Business Details */}
        <div className="pt-6 sm:pt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-[11px] sm:text-xs text-neutral-400">
          <div className="space-y-1 break-keep">
            <p>{footerSection.businessInfo}</p>
            <p className="whitespace-pre-line leading-relaxed">
              {`${content.studioAddress}\n문의 : ${content.contactPhone}`}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
