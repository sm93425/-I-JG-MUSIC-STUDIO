import React from 'react';
import { ArrowUpRight, Music2, Headphones, Sparkles, Check, HelpCircle } from 'lucide-react';
import { HomepageConfig } from '../types';
import { INITIAL_HOMEPAGE_CONFIG } from '../data/initialData';

interface PricingSectionProps {
  homepageConfig?: HomepageConfig;
  showLessonPricing?: boolean;
  showProductionPricing?: boolean;
  onScrollToContact?: (type?: 'lesson' | 'production') => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({
  homepageConfig = INITIAL_HOMEPAGE_CONFIG,
  showLessonPricing = true,
  showProductionPricing = true,
  onScrollToContact,
}) => {
  const handleConsult = (type: 'lesson' | 'production') => {
    if (onScrollToContact) {
      onScrollToContact(type);
      return;
    }
    if (type === 'production') {
      const element = document.getElementById('work-contact');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const { lessonPricing, productionPricing } = homepageConfig;

  return (
    <>
      {/* Section 1: LESSON PRICE */}
      {showLessonPricing && (
        <section id="pricing" className="py-14 sm:py-20 lg:py-28 border-t border-white/10 bg-[#0a0a0a] scroll-mt-20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
              <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-neutral-300 mb-3 sm:mb-4 font-mono">
                <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-white" />
                <span>{lessonPricing.badge}</span>
              </div>
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                {lessonPricing.title}
              </h2>
              <p className="mt-3 sm:mt-4 text-[13px] sm:text-base text-neutral-400 max-w-2xl mx-auto leading-relaxed break-keep whitespace-pre-line">
                {lessonPricing.subtitle}
              </p>
            </div>

            {/* Card 1: 레슨 금액표 */}
            <div className="rounded-2xl border border-white/15 bg-neutral-900/60 backdrop-blur-sm p-4 sm:p-10 flex flex-col justify-between hover:border-white/25 transition-all shadow-xl">
              <div>
                {/* Header */}
                <div className="relative mb-5 sm:mb-6 pb-5 sm:pb-6 border-b border-white/10">
                  <div className="w-full min-w-0">
                    <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-mono uppercase tracking-wider sm:tracking-widest text-neutral-400 mb-1 sm:mb-1.5 pr-24 sm:pr-28">
                      <Headphones className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white shrink-0" />
                      <span className="truncate">{lessonPricing.cardKicker}</span>
                    </div>
                    <h3 className="text-xl sm:text-[25px] font-extrabold text-white tracking-tight pr-24 sm:pr-28">
                      {lessonPricing.cardTitle}
                    </h3>
                    <p className="w-full text-[12px] text-neutral-400 mt-1.5 font-mono tracking-[-0.04em] sm:tracking-normal whitespace-nowrap">
                      {lessonPricing.cardSubtitle}
                    </p>
                  </div>
                  <span className="absolute top-0 right-0 shrink-0 px-2.5 py-1 sm:px-3 rounded-full text-[10px] sm:text-[11px] font-semibold bg-white/10 text-neutral-200 border border-white/10">
                    {lessonPricing.cardBadge}
                  </span>
                </div>

                {/* Lesson Table */}
                <div className="w-full">
                  <table className="w-full text-left text-xs sm:text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                        <th className="py-2.5 sm:py-3 px-1.5 sm:px-3">CLASS</th>
                        <th className="py-2.5 sm:py-3 px-1.5 sm:px-3 text-center whitespace-nowrap">TIME</th>
                        <th className="py-2.5 sm:py-3 px-1.5 sm:px-3 text-right whitespace-nowrap">MONTHLY</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {lessonPricing.plans.map((plan) => (
                        <tr
                          key={plan.id}
                          className={`transition-colors group hover:bg-white/5 ${
                            plan.popular ? 'bg-white/[0.02]' : ''
                          }`}
                        >
                          <td className="py-3.5 sm:py-4 px-1.5 sm:px-3">
                            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                              <span className="font-bold text-white text-[13px] sm:text-base group-hover:text-neutral-100 break-keep">
                                {plan.name}
                              </span>
                              {plan.popular && (
                                <span className="text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full bg-white text-black font-extrabold shrink-0">
                                  추천
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-3.5 sm:py-4 px-1.5 sm:px-3 text-center font-mono text-neutral-300 text-[12px] sm:text-sm whitespace-nowrap">
                            {plan.time}
                          </td>
                          <td className="py-3.5 sm:py-4 px-1.5 sm:px-3 text-right font-mono font-bold text-white text-[13px] sm:text-base whitespace-nowrap">
                            {plan.price}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Footnote */}
                <div className="mt-5 sm:mt-6 p-3.5 sm:p-4 rounded-xl bg-white/[0.03] border border-white/5 text-[11px] sm:text-xs text-neutral-400 leading-relaxed space-y-1.5">
                  {lessonPricing.footnotePrimary && (
                    <p className="flex items-start gap-1.5 text-neutral-300 font-medium break-keep">
                      <Check className="h-3.5 w-3.5 text-white shrink-0 mt-0.5" />
                      <span className="whitespace-pre-line">{lessonPricing.footnotePrimary}</span>
                    </p>
                  )}
                  {lessonPricing.footnoteSecondary && (
                    <p className="text-[11px] sm:text-[12px] text-neutral-400 pl-5 break-keep">
                      {lessonPricing.footnoteSecondary}
                    </p>
                  )}
                </div>
              </div>

              {/* CTA Button */}
              <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => handleConsult('lesson')}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 sm:py-3.5 px-5 sm:px-6 rounded-xl text-[13px] sm:text-sm font-bold text-black bg-white hover:bg-neutral-200 transition-all shadow-lg hover:shadow-xl cursor-pointer"
                >
                  <span>{lessonPricing.ctaText}</span>
                  <ArrowUpRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Section 2: PRODUCTION ESTIMATE */}
      {showProductionPricing && (
        <section id="production-pricing" className="py-14 sm:py-20 lg:py-28 border-t border-white/10 bg-[#0c0c0c] scroll-mt-20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
              <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-neutral-300 mb-3 sm:mb-4 font-mono">
                <Music2 className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-white" />
                <span>{productionPricing.badge}</span>
              </div>
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                {productionPricing.title}
              </h2>
              <p className="mt-3 sm:mt-4 text-[13px] sm:text-base text-neutral-400 max-w-2xl mx-auto leading-relaxed break-keep whitespace-pre-line">
                {productionPricing.subtitle}
              </p>
            </div>

            {/* Card 2: 음원 제작 견적 */}
            <div className="rounded-2xl border border-white/15 bg-neutral-900/60 backdrop-blur-sm p-4 sm:p-10 flex flex-col justify-between hover:border-white/25 transition-all shadow-xl">
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-2 sm:gap-4 mb-5 sm:mb-6 pb-5 sm:pb-6 border-b border-white/10 leading-snug sm:leading-[45px]">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-mono uppercase tracking-wider sm:tracking-widest text-neutral-400 mb-1 sm:mb-1.5 leading-normal">
                      <Music2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white shrink-0" />
                      <span className="truncate">{productionPricing.cardKicker}</span>
                    </div>
                    <h3 className="text-xl sm:text-[25px] font-extrabold text-white tracking-tight">
                      {productionPricing.cardTitle}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-neutral-400 mt-1 font-mono leading-normal">
                      {productionPricing.cardSubtitle}
                    </p>
                  </div>
                  {productionPricing.cardBadge && (
                    <span className="shrink-0 px-2.5 py-1 sm:px-3 rounded-full text-[10px] sm:text-[11px] font-semibold bg-white/10 text-neutral-200 border border-white/10 leading-normal">
                      {productionPricing.cardBadge}
                    </span>
                  )}
                </div>

                {/* Production Table */}
                <div className="w-full">
                  <table className="w-full text-left text-xs sm:text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                        <th className="py-2.5 sm:py-3 px-1.5 sm:px-3 text-[11px] sm:text-[13px] leading-tight sm:leading-[13.7143px]">SERVICE</th>
                        <th className="py-2.5 sm:py-3 px-1.5 sm:px-3 text-right text-[11px] sm:text-[13px] leading-tight sm:leading-[13.7143px] whitespace-nowrap">PRICE</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {productionPricing.services.map((row) => (
                        <tr
                          key={row.id}
                          className="transition-colors group hover:bg-white/5"
                        >
                          <td className="py-3.5 sm:py-4 px-1.5 sm:px-3 pr-2">
                            <div className="space-y-0.5">
                              <span className="font-bold text-white text-[13px] sm:text-base group-hover:text-neutral-100 block break-keep">
                                {row.service}
                              </span>
                              <span className="text-[11px] sm:text-xs text-neutral-400 sm:text-neutral-500 block break-keep leading-snug whitespace-pre-line">
                                {row.note}
                              </span>
                            </div>
                          </td>
                          <td className="py-3.5 sm:py-4 px-1.5 sm:px-3 text-right align-middle whitespace-nowrap">
                            {row.price === '상담 문의' ? (
                              <span className="inline-block px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold bg-white/10 text-neutral-200 border border-white/10 font-mono">
                                상담 문의
                              </span>
                            ) : (
                              <div className="text-right">
                                <span className="font-mono font-bold text-white text-[13px] sm:text-base block">
                                  {row.price}
                                </span>
                                {row.priceNote && (
                                  <span className="text-[10px] text-neutral-400 font-mono block">
                                    {row.priceNote}
                                  </span>
                                )}
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Production Footnote */}
                <div className="mt-5 sm:mt-6 p-3.5 sm:p-4 rounded-xl bg-white/[0.03] border border-white/5 text-[11px] sm:text-xs text-neutral-400 leading-relaxed space-y-1.5">
                  {productionPricing.footnotePrimary && (
                    <p className="flex items-start gap-1.5 text-neutral-300 font-medium break-keep">
                      <HelpCircle className="h-3.5 w-3.5 text-white shrink-0 mt-0.5" />
                      <span>{productionPricing.footnotePrimary}</span>
                    </p>
                  )}
                  {productionPricing.footnoteSecondary && (
                    <p className="text-[11px] sm:text-[12px] text-neutral-400 pl-5 break-keep">
                      {productionPricing.footnoteSecondary}
                    </p>
                  )}
                </div>
              </div>

              {/* CTA Button */}
              <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => handleConsult('production')}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 sm:py-3.5 px-5 sm:px-6 rounded-xl text-[13px] sm:text-sm font-bold text-neutral-200 bg-white/10 hover:bg-white/20 border border-white/10 hover:border-white/20 transition-all shadow-lg hover:shadow-xl cursor-pointer"
                >
                  <span>{productionPricing.ctaText}</span>
                  <ArrowUpRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
};
