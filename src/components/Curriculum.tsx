import React, { useState } from 'react';
import { Check, Clock, Users, BookOpen, ArrowRight, X } from 'lucide-react';
import { CurriculumCourse } from '../types';

interface CurriculumProps {
  courses: CurriculumCourse[];
  onSelectCourseForConsult: (courseId: string) => void;
}

export const Curriculum: React.FC<CurriculumProps> = ({
  courses,
  onSelectCourseForConsult,
}) => {
  const [selectedCourseForModal, setSelectedCourseForModal] = useState<CurriculumCourse | null>(null);

  return (
    <section id="curriculum" className="py-20 lg:py-28 border-t border-white/10 bg-[#0d0d0d]">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="text-xs font-semibold tracking-wider uppercase text-neutral-400 mb-2">
              CURRICULUM & MASTERCLASS
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              수준별 1:1 맞춤 커리큘럼
            </h2>
            <p className="mt-3 text-base text-neutral-400 max-w-2xl">
              입문자부터 프로 지망생까지, 불필요한 이론 암기를 배제하고 즉시 써먹는 큐베이스 실전 트랙 메이킹을 학습합니다.
            </p>
          </div>
          <div className="text-xs text-neutral-400 border border-white/10 rounded-md px-4 py-2 self-start md:self-auto bg-neutral-900/60">
            Steinberg Cubase Pro 13 기반 실습
          </div>
        </div>

        {/* 3 Course Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {courses.map((course) => {
            const isPopular = course.isPopular;

            return (
              <div
                key={course.id}
                className={`relative rounded-xl border flex flex-col justify-between p-6 sm:p-8 transition-all ${
                  isPopular
                    ? 'border-white/30 bg-neutral-900 shadow-xl ring-1 ring-white/20'
                    : 'border-white/10 bg-neutral-950/60 hover:border-white/20'
                }`}
              >
                {/* Popular Indicator (clean unboxed text or minimal top tag) */}
                {isPopular && (
                  <div className="absolute -top-3 right-6 px-3 py-0.5 text-[11px] font-bold uppercase tracking-wider text-black bg-white rounded-sm shadow">
                    가장 많이 찾는 과정
                  </div>
                )}

                <div>
                  {/* Level & Duration */}
                  <div className="flex items-center justify-between text-xs text-neutral-400 mb-4 pb-4 border-b border-white/5">
                    <span className="font-semibold text-white tracking-wide">
                      {course.level}
                    </span>
                    <span className="flex items-center gap-1 font-mono">
                      <Clock className="h-3.5 w-3.5" />
                      {course.duration}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3">
                    {course.name}
                  </h3>

                  <p className="text-xs text-neutral-300 leading-relaxed mb-6">
                    {course.description}
                  </p>

                  {/* Target audience */}
                  <div className="mb-6 p-3 rounded-lg bg-white/5 text-xs text-neutral-300">
                    <span className="font-semibold text-white block mb-1">
                      추천 대상:
                    </span>
                    {course.targetAudience}
                  </div>

                  {/* Key points checklist */}
                  <div className="space-y-2.5 mb-8">
                    <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400 block mb-2">
                      주요 마스터 항목
                    </span>
                    {course.keyPoints.map((point, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-neutral-300">
                        <Check className="h-4 w-4 text-white shrink-0 mt-0.5" />
                        <span className="leading-snug">{point}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="pt-6 border-t border-white/10 flex flex-col gap-2.5">
                  <button
                    onClick={() => setSelectedCourseForModal(course)}
                    className="w-full py-2.5 px-4 text-xs font-medium text-neutral-300 hover:text-white border border-white/10 hover:border-white/25 rounded-md transition-colors flex items-center justify-center gap-2"
                  >
                    <BookOpen className="h-3.5 w-3.5" />
                    <span>주차별 상세 커리큘럼 보기</span>
                  </button>

                  <button
                    onClick={() => onSelectCourseForConsult(course.id)}
                    className={`w-full py-2.5 px-4 text-xs font-semibold rounded-md transition-colors flex items-center justify-center gap-2 ${
                      isPopular
                        ? 'bg-white text-black hover:bg-neutral-200'
                        : 'bg-neutral-800 text-white hover:bg-neutral-700'
                    }`}
                  >
                    <span>이 과정으로 상담 신청</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed Syllabus Modal */}
      {selectedCourseForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-xl border border-white/20 bg-neutral-900 p-6 sm:p-8 shadow-2xl">
            {/* Close button */}
            <button
              onClick={() => setSelectedCourseForModal(null)}
              className="absolute top-6 right-6 p-1.5 text-neutral-400 hover:text-white hover:bg-white/10 rounded-md transition-colors"
              aria-label="닫기"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Modal Header */}
            <div className="mb-6 pr-8">
              <span className="text-xs font-semibold uppercase text-neutral-400">
                {selectedCourseForModal.level}
              </span>
              <h3 className="text-2xl font-bold text-white mt-1">
                {selectedCourseForModal.name}
              </h3>
              <p className="text-xs text-neutral-400 mt-2">
                총 {selectedCourseForModal.duration} · {selectedCourseForModal.recommendedDaw}
              </p>
            </div>

            {/* Syllabus Week-by-Week Breakdown */}
            <div className="space-y-4 mb-8">
              {selectedCourseForModal.syllabus.map((syl) => (
                <div
                  key={syl.week}
                  className="p-4 rounded-lg border border-white/5 bg-black/40"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-mono text-xs font-bold text-neutral-400 bg-white/10 px-2 py-0.5 rounded">
                      {syl.week < 10 ? `0${syl.week}` : syl.week}주차
                    </span>
                    <h4 className="text-sm font-semibold text-white">
                      {syl.title}
                    </h4>
                  </div>
                  <ul className="pl-6 list-disc space-y-1 text-xs text-neutral-300">
                    {syl.topics.map((t, idx) => (
                      <li key={idx}>{t}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Modal Footer CTA */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-4">
              <button
                onClick={() => setSelectedCourseForModal(null)}
                className="px-4 py-2 text-xs font-medium text-neutral-400 hover:text-white transition-colors"
              >
                닫기
              </button>
              <button
                onClick={() => {
                  const id = selectedCourseForModal.id;
                  setSelectedCourseForModal(null);
                  onSelectCourseForConsult(id);
                }}
                className="px-5 py-2.5 text-xs font-semibold text-black bg-white hover:bg-neutral-200 rounded-md transition-colors"
              >
                이 과정으로 1:1 방문 상담 신청
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
