import React from 'react';
import { ArrowUpRight, Music2, Headphones, Sparkles, Check, HelpCircle } from 'lucide-react';

interface PricingSectionProps {
  onScrollToContact?: (type?: 'lesson' | 'production') => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ onScrollToContact }) => {
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

  const lessonPlans = [
    { name: 'MIDI 취미반', time: '60분', price: '180,000원', popular: true },
    { name: 'MIDI 전문반', time: '90분', price: '280,000원', popular: false },
    { name: '피아노 반주 취미반', time: '60분', price: '160,000원', popular: false },
    { name: 'MIDI 원데이 클래스', time: '80분', price: '60,000원', popular: false, isOneDay: true },
  ];

  const productionServices = [
    { service: '음원 제작 올인원', price: '상담 문의', note: '작·편곡부터 믹싱/마스터링까지 풀 프로덕션' },
    { service: '작곡', price: '상담 문의', note: '메인 멜로디 및 트랙 작곡' },
    { service: '편곡', price: '상담 문의', note: '장르별 상업 음원 표준 편곡' },
    { service: '미디 스트링 편곡', price: '250,000원', note: '가요 4분 기준 정밀 오케스트레이션' },
    { service: '피아노 편곡', price: '200,000원', note: '가요 4분 기준 어쿠스틱/EP 반주' },
    { service: 'MR / BGM 제작', price: '상담 문의', note: '커버음원 MR / 각종 BGM 등' },
  ];

  return (
    <>
      {/* Section 1: LESSON PRICE */}
      <section id="pricing" className="py-20 lg:py-28 border-t border-white/10 bg-[#0a0a0a] scroll-mt-20">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold uppercase tracking-widest text-neutral-300 mb-4 font-mono">
              <Sparkles className="h-3.5 w-3.5 text-white" />
              <span>RATES & ESTIMATES</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              LESSON PRICE
            </h2>
            <p className="mt-4 text-sm sm:text-base text-neutral-400 max-w-2xl mx-auto leading-relaxed">
              제이지뮤직스튜디오의 1:1 개인 레슨 수업 금액을 안내해 드립니다.
            </p>
          </div>

          {/* Card 1: 레슨 금액표 */}
          <div className="rounded-2xl border border-white/15 bg-neutral-900/60 backdrop-blur-sm p-6 sm:p-10 flex flex-col justify-between hover:border-white/25 transition-all shadow-xl">
            <div>
              {/* Header */}
              <div className="flex items-start justify-between gap-4 mb-6 pb-6 border-b border-white/10">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-neutral-400 mb-1.5">
                    <Headphones className="h-4 w-4 text-white" />
                    <span>JG MUSIC STUDIO · LESSON PRICE</span>
                  </div>
                  <h3 className="text-[25px] font-extrabold text-white tracking-tight">
                    레슨 금액표
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1 font-mono">
                    1:1 PRIVATE LESSON · 주 1회 / 월 4회 기준
                  </p>
                </div>
                <span className="shrink-0 px-3 py-1 rounded-full text-[11px] font-semibold bg-white/10 text-neutral-200 border border-white/10">
                  1:1 개인 레슨
                </span>
              </div>

              {/* Lesson Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                      <th className="py-3 px-3">CLASS</th>
                      <th className="py-3 px-3 text-center">TIME</th>
                      <th className="py-3 px-3 text-right">MONTHLY</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {lessonPlans.map((plan) => (
                      <tr
                        key={plan.name}
                        className={`transition-colors group hover:bg-white/5 ${
                          plan.popular ? 'bg-white/[0.02]' : ''
                        }`}
                      >
                        <td className="py-4 px-3">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-sm sm:text-base group-hover:text-neutral-100">
                              {plan.name}
                            </span>
                            {plan.popular && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white text-black font-extrabold">
                                추천
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-3 text-center font-mono text-neutral-300 text-xs sm:text-sm">
                          {plan.time}
                        </td>
                        <td className="py-4 px-3 text-right font-mono font-bold text-white text-sm sm:text-base">
                          {plan.price}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Footnote */}
              <div className="mt-6 p-4 rounded-xl bg-white/[0.03] border border-white/5 text-xs text-neutral-400 leading-relaxed space-y-1.5">
                <p className="flex items-start gap-1.5 text-neutral-300 font-medium">
                  <Check className="h-3.5 w-3.5 text-white shrink-0 mt-0.5" />
                  <span>※ 월 수강료는 주 1회, 월 4회 기준입니다. 원데이 클래스는 별도입니다.</span>
                </p>
                <p className="text-[12px] text-neutral-400 pl-5">
                  모든 수업은 대표 프로듀서의 1:1 직강으로 진행됩니다.
                </p>
              </div>
            </div>

            {/* CTA Button */}
            <div className="mt-8 pt-6 border-t border-white/10">
              <button
                type="button"
                onClick={() => handleConsult('lesson')}
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl text-xs sm:text-sm font-bold text-black bg-white hover:bg-neutral-200 transition-all shadow-lg hover:shadow-xl cursor-pointer"
              >
                <span>1:1 레슨 방문 상담 예약하기</span>
                <ArrowUpRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: PRODUCTION ESTIMATE (Dedicated Page Section Below) */}
      <section id="production-pricing" className="py-20 lg:py-28 border-t border-white/10 bg-[#0c0c0c] scroll-mt-20">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold uppercase tracking-widest text-neutral-300 mb-4 font-mono">
              <Music2 className="h-3.5 w-3.5 text-white" />
              <span>PRODUCTION ESTIMATE</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              MUSIC PRODUCTION
            </h2>
            <p className="mt-4 text-sm sm:text-base text-neutral-400 max-w-2xl mx-auto leading-relaxed">
              제이지뮤직스튜디오의 음원 제작 및 편곡 표준 견적을 안내해 드립니다.
            </p>
          </div>

          {/* Card 2: 음원 제작 견적 */}
          <div className="rounded-2xl border border-white/15 bg-neutral-900/60 backdrop-blur-sm p-6 sm:p-10 flex flex-col justify-between hover:border-white/25 transition-all shadow-xl">
            <div>
              {/* Header */}
              <div className="flex items-start justify-between gap-4 mb-6 pb-6 border-b border-white/10">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-neutral-400 mb-1.5">
                    <Music2 className="h-4 w-4 text-white" />
                    <span>JG MUSIC STUDIO · PRODUCTION ESTIMATE</span>
                  </div>
                  <h3 className="text-[25px] font-extrabold text-white tracking-tight">
                    음원 제작 견적
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1 font-mono">
                    MUSIC PRODUCTION & ARRANGEMENT
                  </p>
                </div>
                <span className="shrink-0 px-3 py-1 rounded-full text-[11px] font-semibold bg-white/10 text-neutral-200 border border-white/10">
                  현업 프로 사운드
                </span>
              </div>

              {/* Production Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                      <th className="py-3 px-3">SERVICE</th>
                      <th className="py-3 px-3 text-right">PRICE</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {productionServices.map((row) => (
                      <tr
                        key={row.service}
                        className="transition-colors group hover:bg-white/5"
                      >
                        <td className="py-4 px-3">
                          <div className="space-y-0.5">
                            <span className="font-bold text-white text-sm sm:text-base group-hover:text-neutral-100 block">
                              {row.service}
                            </span>
                            <span className="text-[11px] text-neutral-500 block">
                              {row.note}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-3 text-right align-middle">
                          {row.price === '상담 문의' ? (
                            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-neutral-200 border border-white/10 font-mono">
                              상담 문의
                            </span>
                          ) : (
                            <div className="text-right">
                              <span className="font-mono font-bold text-white text-sm sm:text-base block">
                                {row.price}
                              </span>
                              <span className="text-[10px] text-neutral-400 font-mono block">
                                (가요 4분 기준)
                              </span>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Production Footnote */}
              <div className="mt-6 p-4 rounded-xl bg-white/[0.03] border border-white/5 text-xs text-neutral-400 leading-relaxed space-y-1.5">
                <p className="flex items-start gap-1.5 text-neutral-300 font-medium">
                  <HelpCircle className="h-3.5 w-3.5 text-white shrink-0 mt-0.5" />
                  <span>곡 길이, 트랙 구성 및 마감 일정에 따라 상세 견적이 조율될 수 있습니다.</span>
                </p>
                <p className="text-[12px] text-neutral-400 pl-5">
                  방송 OST, 웹툰/드라마 테마곡 및 상업 발매 음원 제작 레퍼런스를 보유하고 있습니다.
                </p>
              </div>
            </div>

            {/* CTA Button */}
            <div className="mt-8 pt-6 border-t border-white/10">
              <button
                type="button"
                onClick={() => handleConsult('production')}
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl text-xs sm:text-sm font-bold text-neutral-200 bg-white/10 hover:bg-white/20 border border-white/10 hover:border-white/20 transition-all shadow-lg hover:shadow-xl cursor-pointer"
              >
                <span>음원 제작 및 작업 의뢰 문의하기</span>
                <ArrowUpRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
