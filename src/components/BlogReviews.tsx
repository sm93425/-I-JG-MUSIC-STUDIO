import React from 'react';
import { ArrowUpRight, MapPin, CheckCircle2, Headphones } from 'lucide-react';
import { Post, SiteContent } from '../types';

interface BlogReviewsProps {
  posts?: Post[];
  content?: SiteContent;
  onScrollToContact?: () => void;
  onSelectCourse?: (courseId: string) => void;
}

export const BlogReviews: React.FC<BlogReviewsProps> = ({
  content,
  onScrollToContact,
  onSelectCourse,
}) => {
  const handleConsultClick = (courseId?: string) => {
    if (courseId && onSelectCourse) {
      onSelectCourse(courseId);
    } else if (onScrollToContact) {
      onScrollToContact();
    } else {
      const element = document.getElementById('contact');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section id="lesson" className="py-20 lg:py-28 border-t border-white/10 bg-[#0d0d0d] scroll-mt-20">
      <div id="blog" className="sr-only" />
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-neutral-300 mb-4 font-mono">
            <span className="text-white text-xs select-none bg-[#000000]">▶</span>
            <span className="text-[17px] font-semibold uppercase tracking-widest text-neutral-200">
              START YOUR MUSIC
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            레슨 상담 신청
          </h2>
        </div>

        {/* 3 Core Points Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Card 1 */}
          <div className="rounded-2xl border border-white/10 bg-neutral-900/60 p-7 hover:border-white/20 transition-all">
            <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center text-white mb-5">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-3 leading-snug">
              나만의 음악적 방향을 찾아가는<br />현업 프로듀서의 1:1 개인 레슨
            </h3>
            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
              처음 음악을 시작하는 순간부터 자신만의 음악을 완성하기까지, 각자의 속도와 목표에 맞춰 함께합니다.
            </p>
          </div>

          {/* Card 2 */}
          <div className="rounded-2xl border border-white/10 bg-neutral-900/60 p-7 hover:border-white/20 transition-all">
            <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center text-white mb-5">
              <Headphones className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-3 leading-snug">
              디테일이 만드는 음악의 차이
            </h3>
            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
              작은 차이가 모여 하나의 완성도를 만듭니다.<br />사운드의 질감과 공간감, 섬세한 표현까지 음악의 디테일을 깊이 있게 다룹니다.
            </p>
          </div>

          {/* Card 3 */}
          <div className="rounded-2xl border border-white/10 bg-neutral-900/60 p-7 hover:border-white/20 transition-all">
            <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center text-white mb-5">
              <MapPin className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-3 leading-snug">
              무료 방문 상담 신청
            </h3>
            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed whitespace-pre-line">
              직접 방문하여 체험 레슨을 경험해보세요.{'\n'}레슨 과정부터 음악과 관련된 다양한 궁금증까지 편안하게 상담하실 수 있습니다.
            </p>
          </div>
        </div>

        {/* Interactive Action Hub: Connects Directly to Lesson Consultation */}
        <div className="rounded-2xl border border-white/15 bg-gradient-to-br from-neutral-900 via-neutral-900/90 to-black p-8 sm:p-12 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-2 text-center lg:text-left">
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-widest font-mono">
              FAST CONSULTATION
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              지금 바로 1:1 맞춤 상담을 예약하세요
            </h3>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto shrink-0 justify-center">
            <button
              onClick={() => handleConsultClick()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-sm font-bold text-black bg-white hover:bg-neutral-200 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 cursor-pointer"
            >
              <span>레슨 상담 신청하기</span>
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

