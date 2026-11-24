import React from 'react';
import { CheckCircle2, Sliders, Music2, Cpu, Mic } from 'lucide-react';
import { ProducerCredit, SiteContent } from '../types';
import { OptimizedImage } from './OptimizedImage';

interface AboutProps {
  content: SiteContent;
  credits: ProducerCredit[];
}

export const About: React.FC<AboutProps> = ({ content, credits }) => {
  return (
    <section id="about" className="py-20 lg:py-28 border-t border-white/10 bg-[#0a0a0a]">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-14">
          <div className="text-xs font-semibold tracking-wider uppercase text-neutral-400 mb-2">
            PRODUCER & STUDIO
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            스튜디오 소개 및 디렉터 프로필
          </h2>
          <p className="mt-3 text-base text-neutral-400 max-w-2xl">
            단순히 툴의 사용법만 가르치는 곳이 아닙니다. 실제 차트와 방송에서 증명된 사운드 메이킹 노하우를 그대로 전수합니다.
          </p>
        </div>

        {/* 2-Column Producer Profile & Studio Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          {/* Left Column: Producer Image & Fast Spec */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="relative rounded-xl overflow-hidden border border-white/10 aspect-[4/3] bg-neutral-900 group">
              <OptimizedImage
                src="/src/assets/images/producer_workstation_1794239966408.jpg"
                alt="제이지뮤직스튜디오 프로듀서 작업 공간"
                referrerPolicy="no-referrer"
                sizes="(max-width: 1023px) 92vw, 500px"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-xs font-medium text-neutral-300">
                  {content.producerRole}
                </span>
                <div className="text-xl font-bold tracking-tight">
                  {content.producerName}
                </div>
              </div>
            </div>

            {/* Quote Card */}
            <div className="mt-6 p-6 rounded-xl border border-white/10 bg-neutral-900/60 backdrop-blur-sm">
              <blockquote className="text-sm font-medium italic text-neutral-200 leading-relaxed">
                {content.producerQuote}
              </blockquote>
              <div className="mt-3 text-xs text-neutral-400 font-medium">
                — {content.producerName}
              </div>
            </div>
          </div>

          {/* Right Column: Bio & Verified Credits */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold text-white mb-4">
                "머릿속의 영감을 실제 스트리밍되는 상업 사운드로"
              </h3>
              <p className="text-sm sm:text-base text-neutral-300 leading-relaxed mb-6">
                {content.producerBio}
              </p>
              <p className="text-sm text-neutral-400 leading-relaxed mb-8">
                {content.studioPhilosophy}
              </p>

              {/* Major Credits List */}
              <div className="mb-8">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-3">
                  주요 디스코그래피 & 공식 크레딧
                </h4>
                <div className="divide-y divide-white/5 border-y border-white/10">
                  {credits.map((credit, idx) => (
                    <div
                      key={idx}
                      className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-sm"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs text-neutral-500 tabular-nums">
                          {credit.year}
                        </span>
                        <span className="font-medium text-white">
                          {credit.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-neutral-400">
                        <span>{credit.artistOrProject}</span>
                        <span aria-hidden="true" className="text-neutral-600">·</span>
                        <span className="text-neutral-300 font-mono">{credit.role}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Studio Monitoring & Hardware Spec */}
            <div className="pt-6 border-t border-white/10">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-3 flex items-center gap-2">
                <Sliders className="h-3.5 w-3.5" />
                <span>스튜디오 모니터링 & 마스터링 환경</span>
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-neutral-300">
                {content.studioEquipment.map((eq, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-neutral-400 shrink-0 mt-0.5" />
                    <span>{eq}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
