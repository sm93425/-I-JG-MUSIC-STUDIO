import React, { useState, useEffect } from 'react';
import { ArrowUp, Instagram } from 'lucide-react';
import { SiteContent } from '../types';

interface FooterProps {
  content: SiteContent;
  onOpenAdmin: () => void;
}

const NAVER_PC_URL =
  'https://map.naver.com/p/entry/place/2052860666?placePath=%2Fhome%3Fentry%3Dplt%26from%3Dmap%26fromPanelNum%3D1%26additionalHeight%3D76%26timestamp%3D202611190047%26locale%3Dko%26svcName%3Dmap_pcv5&searchType=place&lng=126.9553560&lat=37.2671906&c=15.00,0,0,0,dh';

const NAVER_MOBILE_URL =
  'https://m.place.naver.com/place/2052860666/home?entry=pll&abtExp=N-NMB-COV-26-MED%3A3&bk_query=%EC%A0%9C%EC%9D%B4%EC%A7%80%EB%AE%A4%EC%A7%81';

export const Footer: React.FC<FooterProps> = ({ content, onOpenAdmin }) => {
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

  return (
    <footer className="border-t border-white/10 bg-[#070707] text-neutral-400 py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-12 border-b border-white/5">
          {/* Brand */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-base font-bold tracking-tight text-white">
                {content.studioName}
              </span>
              <span className="text-xs text-neutral-500 font-mono">
                {content.studioSubName}
              </span>
            </div>
            <p className="text-xs text-neutral-400 max-w-md leading-relaxed font-medium">
              작곡 · 편곡 | MIDI 작곡 레슨 I 스트링 편곡
            </p>
          </div>

          {/* Social Links & Back to Top */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <a
                href="https://www.instagram.com/jg.musicstudio/"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="p-2 text-neutral-400 hover:text-white rounded-md hover:bg-white/5 transition-colors"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="https://pf.kakao.com/_sQkxeX"
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
                href={isMobile ? NAVER_MOBILE_URL : NAVER_PC_URL}
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
        <div className="pt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs text-neutral-400">
          <div className="space-y-1">
            <p>
              제이지뮤직스튜디오(JG MUSIC STUDIO) · 대표 : 장성민
            </p>
            <p>
              {content.studioAddress} · 문의: {content.contactPhone}
            </p>
          </div>

          <div className="flex items-center gap-4 text-neutral-400">
            <button
              onClick={onOpenAdmin}
              className="hover:text-white transition-colors underline underline-offset-4"
            >
              스튜디오 관리자 모드
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
