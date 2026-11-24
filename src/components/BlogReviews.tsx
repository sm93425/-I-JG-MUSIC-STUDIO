import React from 'react';
import { ArrowUpRight, MapPin, CheckCircle2, Headphones } from 'lucide-react';
import { HomepageConfig, Post, SiteContent } from '../types';
import { INITIAL_HOMEPAGE_CONFIG } from '../data/initialData';

interface BlogReviewsProps {
  posts?: Post[];
  content?: SiteContent;
  homepageConfig?: HomepageConfig;
  onScrollToContact?: () => void;
  onSelectCourse?: (courseId: string) => void;
}

export const BlogReviews: React.FC<BlogReviewsProps> = ({
  homepageConfig = INITIAL_HOMEPAGE_CONFIG,
  onScrollToContact,
  onSelectCourse,
}) => {
  const { lessonSection } = homepageConfig;

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

  const cardIcons = [
    <CheckCircle2 key="icon-0" className="h-5 w-5" />,
    <Headphones key="icon-1" className="h-5 w-5" />,
    <MapPin key="icon-2" className="h-5 w-5" />,
  ];

  return (
    <section id="lesson" className="py-14 sm:py-20 lg:py-28 border-t border-white/10 bg-[#0d0d0d] scroll-mt-20">
      <div id="blog" className="sr-only" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 sm:gap-2.5 px-3.5 sm:px-4 py-1 sm:py-1.5 rounded-full bg-white/5 border border-white/10 text-neutral-300 mb-3 sm:mb-4 font-mono">
            <span className="text-white text-[10px] sm:text-xs select-none bg-[#000000]">▶</span>
            <span className="text-xs sm:text-[17px] font-semibold uppercase tracking-widest text-neutral-200">
              {lessonSection.badge}
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            {lessonSection.title}
          </h2>
        </div>

        {/* Core Points Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
          {lessonSection.cards.map((card, idx) => (
            <div key={card.id} className="rounded-2xl border border-white/10 bg-neutral-900/60 p-5 sm:p-7 hover:border-white/20 transition-all">
              <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-white/10 flex items-center justify-center text-white mb-4 sm:mb-5">
                {cardIcons[idx % cardIcons.length]}
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white mb-2.5 sm:mb-3 leading-snug whitespace-pre-line break-keep">
                {card.title}
              </h3>
              <p className="text-[13px] sm:text-sm text-neutral-400 leading-relaxed whitespace-pre-line tracking-[-0.02em] sm:tracking-normal break-keep">
                {card.description}
              </p>
            </div>
          ))}
        </div>

        {/* Interactive Action Hub: Connects Directly to Lesson Consultation */}
        <div className="rounded-2xl border border-white/15 bg-gradient-to-br from-neutral-900 via-neutral-900/90 to-black p-6 sm:p-12 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8">
          <div className="space-y-1.5 sm:space-y-2 text-center lg:text-left">
            <span className="text-[10px] sm:text-xs font-semibold text-neutral-400 uppercase tracking-widest font-mono">
              {lessonSection.ctaKicker}
            </span>
            <h3 className="text-xl sm:text-3xl font-extrabold text-white break-keep">
              {lessonSection.ctaTitle}
            </h3>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto shrink-0 justify-center">
            <button
              onClick={() => handleConsultClick()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl text-[13px] sm:text-sm font-bold text-black bg-white hover:bg-neutral-200 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 cursor-pointer"
            >
              <span>{lessonSection.ctaButtonText}</span>
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
