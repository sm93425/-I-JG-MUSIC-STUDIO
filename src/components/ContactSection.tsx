import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  CheckCircle2,
  Send,
  Navigation,
  Instagram
} from 'lucide-react';
import { ConsultationInquiry, CurriculumCourse, HomepageConfig, SiteContent } from '../types';
import { INITIAL_HOMEPAGE_CONFIG } from '../data/initialData';

interface ContactSectionProps {
  content: SiteContent;
  courses: CurriculumCourse[];
  homepageConfig?: HomepageConfig;
  selectedCourseId?: string;
  activeInquiryType?: 'lesson' | 'production';
  onInquiryTypeChange?: (type: 'lesson' | 'production') => void;
  onSubmitInquiry: (
    inquiry: Omit<ConsultationInquiry, 'id' | 'createdAt' | 'status'>
  ) => void | Promise<void>;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  content,
  homepageConfig = INITIAL_HOMEPAGE_CONFIG,
  selectedCourseId,
  activeInquiryType,
  onInquiryTypeChange,
  onSubmitInquiry,
}) => {
  const { contactSection } = homepageConfig;
  const lessonCourses = contactSection.lessonCourses.length > 0
    ? contactSection.lessonCourses
    : ['[취미반]미디 작곡'];
  const productionTypes = contactSection.productionTypes.length > 0
    ? contactSection.productionTypes
    : ['음원 제작 (Full Production)'];
  const experienceLevels = contactSection.experienceLevels.length > 0
    ? contactSection.experienceLevels
    : ['완전 입문(처음 시작)'];

  const [internalInquiryType, setInternalInquiryType] = useState<'lesson' | 'production'>('lesson');
  const inquiryType = activeInquiryType ?? internalInquiryType;
  const setInquiryType = (type: 'lesson' | 'production') => {
    setInternalInquiryType(type);
    onInquiryTypeChange?.(type);
  };

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    courseId: lessonCourses[0],
    productionType: productionTypes[0],
    daw: '',
    genre: '',
    experienceLevel: experienceLevels[0],
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const syncFromHash = () => {
      if (window.location.hash === '#work-contact') {
        setInternalInquiryType('production');
        onInquiryTypeChange?.('production');
      }
    };
    syncFromHash();
    window.addEventListener('hashchange', syncFromHash);
    return () => window.removeEventListener('hashchange', syncFromHash);
  }, [onInquiryTypeChange]);

  useEffect(() => {
    if (selectedCourseId) {
      setFormData((prev) => ({ ...prev, courseId: selectedCourseId }));
    }
  }, [selectedCourseId]);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      courseId: lessonCourses.includes(prev.courseId) ? prev.courseId : lessonCourses[0],
      productionType: productionTypes.includes(prev.productionType)
        ? prev.productionType
        : productionTypes[0],
      experienceLevel: experienceLevels.includes(prev.experienceLevel)
        ? prev.experienceLevel
        : experienceLevels[0],
    }));
  }, [lessonCourses, productionTypes, experienceLevels]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (!formData.name.trim() || !formData.phone.trim()) {
      setErrorMsg('이름과 연락처를 입력해주세요.');
      return;
    }

    setErrorMsg('');
    setIsSubmitting(true);
    try {
      await onSubmitInquiry({
        inquiryType,
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        courseId:
          inquiryType === 'production'
            ? formData.productionType
            : formData.courseId,
        daw: formData.daw,
        genre: formData.genre,
        experienceLevel: formData.experienceLevel,
        message: formData.message,
      });
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-14 sm:py-20 lg:py-28 border-t border-white/10 bg-[#0a0a0a]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-10 sm:mb-14">
          <div className="text-[11px] sm:text-xs font-semibold tracking-wider uppercase text-neutral-400 mb-1.5 sm:mb-2">
            {contactSection.kicker}
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            {contactSection.title}
          </h2>
          <p className="mt-2 sm:mt-3 text-[13px] sm:text-base text-neutral-400 max-w-2xl break-keep">
            {contactSection.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Location & Direct Contact Info */}
          <div className="lg:col-span-5 space-y-6 sm:space-y-8 min-w-0">
            {/* Visual Studio Map Blueprint Card */}
            <div id="location" className="rounded-xl border border-white/10 bg-neutral-900/80 p-4 sm:p-6 relative overflow-hidden scroll-mt-28">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-white shrink-0" />
                  <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-white">
                    {contactSection.locationCardTitle}
                  </span>
                </div>
                <span className="text-[10px] sm:text-[11px] font-mono text-neutral-400">
                  {contactSection.regionTag}
                </span>
              </div>

              {/* Stylized Dark Grid Map Representation */}
              <div className="h-48 w-full rounded-lg bg-neutral-950 border border-white/10 relative p-4 flex flex-col justify-between overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:16px_16px] opacity-40" />

                {/* Visual landmark indicators */}
                <div className="relative z-10 flex justify-between items-start text-[11px] font-mono">
                  <span className="px-2 py-0.5 rounded bg-white/10 text-neutral-300">
                    {contactSection.landmarkTag}
                  </span>
                  <span className="text-neutral-500">{contactSection.roomTag}</span>
                </div>

                <div className="relative z-10 flex items-center justify-center">
                  <div className="relative flex items-center justify-center">
                    <span className="absolute h-8 w-8 rounded-full bg-white/10 animate-ping" />
                    <div className="relative h-4 w-4 rounded-full bg-white flex items-center justify-center">
                      <div className="h-1.5 w-1.5 rounded-full bg-black" />
                    </div>
                  </div>
                </div>

                <div className="relative z-10 flex justify-between items-end text-xs">
                  <div className="font-semibold text-white">
                    {content.studioName}
                  </div>
                  <a
                    href={contactSection.mapLinkUrl || 'https://map.kakao.com'}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-neutral-400 hover:text-white"
                  >
                    <Navigation className="h-3 w-3" />
                    지도 앱 길찾기
                  </a>
                </div>
              </div>

              <div className="mt-4 space-y-2 text-xs text-neutral-300">
                <div className="flex items-start gap-2">
                  <span className="text-neutral-400 shrink-0">주소:</span>
                  <span className="text-white font-medium whitespace-pre-line leading-relaxed">
                    {content.studioAddress.replace(' (', '\n(')}
                  </span>
                </div>
              </div>
            </div>

            {/* Direct Contact Details */}
            <div className="rounded-xl border border-white/10 bg-neutral-900/40 p-4 sm:p-6 space-y-4">
              <h3 className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-neutral-400">
                빠른 상담 채널
              </h3>

              <div className="space-y-3.5 text-[13px] sm:text-sm">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-neutral-300">
                  <Phone className="h-4 w-4 text-white shrink-0" />
                  <span className="text-neutral-400 shrink-0">전화/문자:</span>
                  <a href={`tel:${content.contactPhone}`} className="text-white font-mono font-medium hover:underline break-all">
                    {content.contactPhone}
                  </a>
                </div>

                <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-neutral-300">
                  <Mail className="h-4 w-4 text-white shrink-0" />
                  <span className="text-neutral-400 shrink-0">이메일:</span>
                  <a href={`mailto:${content.contactEmail}`} className="text-neutral-200 hover:underline break-all">
                    {content.contactEmail}
                  </a>
                </div>

                <div className="flex items-center gap-3 text-neutral-300">
                  <a
                    href={contactSection.kakaoUrl || 'https://pf.kakao.com/_sQkxeX'}
                    target="_blank"
                    rel="noreferrer"
                    className="flex flex-wrap items-center gap-2 sm:gap-3 text-neutral-300 hover:text-white group transition-colors min-w-0"
                  >
                    <div className="w-4 h-4 rounded-full bg-[#FEE500] flex items-center justify-center shrink-0 shadow-sm">
                      <svg className="w-2.5 h-2.5 text-[#191919] fill-current" viewBox="0 0 24 24">
                        <path d="M12 3c-5.523 0-10 3.582-10 8 0 2.852 1.848 5.357 4.636 6.713-.205.772-.743 2.793-.852 3.228-.135.54.197.533.414.389.17-.113 2.702-1.835 3.799-2.585.65.094 1.32.145 2.003.145 5.523 0 10-3.582 10-8s-4.477-8-10-8z"/>
                      </svg>
                    </div>
                    <span className="text-neutral-400 shrink-0">카카오톡:</span>
                    <span className="text-white font-medium bg-white/10 px-2.5 py-0.5 rounded group-hover:bg-white/20 transition-colors text-xs sm:text-sm break-words">
                      {content.kakaoId}
                    </span>
                  </a>
                </div>

                <div className="flex items-center gap-3 text-neutral-300">
                  <a
                    href={content.instagramUrl || 'https://www.instagram.com/jg.musicstudio/'}
                    target="_blank"
                    rel="noreferrer"
                    className="flex flex-wrap items-center gap-2 sm:gap-3 text-neutral-300 hover:text-white group transition-colors min-w-0"
                  >
                    <Instagram className="h-4 w-4 text-white shrink-0 group-hover:scale-110 transition-transform" />
                    <span className="text-neutral-400 shrink-0">인스타그램:</span>
                    <span className="text-white font-medium group-hover:underline break-all">
                      {contactSection.instagramHandle}
                    </span>
                  </a>
                </div>

                <div className="flex items-start gap-3 text-neutral-300 pt-1 border-t border-white/5">
                  <Clock className="h-4 w-4 text-white shrink-0 mt-1" />
                  <div className="space-y-1">
                    <span className="text-neutral-400 block text-[11px] sm:text-xs">운영 시간</span>
                    <p className="text-xs sm:text-sm text-neutral-200 font-medium break-keep">
                      {contactSection.weekdayHours}
                    </p>
                    <p className="text-xs sm:text-sm text-neutral-200 font-medium break-keep">
                      {contactSection.weekendHours}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: 1:1 Consultation Reservation Form */}
          <div className="lg:col-span-7 min-w-0">
            <div id="work-contact" className="rounded-xl border border-white/15 bg-neutral-900/90 backdrop-blur-md p-4 sm:p-8 lg:p-10 shadow-xl scroll-mt-28">
              {/* Inquiry Type Tab Switcher */}
              <div className="flex items-center gap-1 p-1 bg-neutral-950 rounded-lg border border-white/10 mb-5 sm:mb-6">
                <button
                  type="button"
                  onClick={() => setInquiryType('lesson')}
                  className={`flex-1 py-2 text-xs font-semibold rounded-md transition-all ${
                    inquiryType === 'lesson'
                      ? 'bg-white text-black shadow-sm'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  레슨 상담 신청
                </button>
                <button
                  type="button"
                  onClick={() => setInquiryType('production')}
                  className={`flex-1 py-2 text-xs font-semibold rounded-md transition-all ${
                    inquiryType === 'production'
                      ? 'bg-white text-black shadow-sm'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  작업 의뢰 / 문의
                </button>
              </div>

              <div className="mb-5 sm:mb-6">
                <h3 className="text-lg sm:text-xl font-bold text-white">
                  {inquiryType === 'lesson' ? '1:1 레슨 방문 상담 신청서' : '음원 제작 & 작업 문의 신청서'}
                </h3>
              </div>

              {submitted ? (
                <div className="py-12 px-6 rounded-lg border border-white/10 bg-neutral-950/60 text-center space-y-4 animate-in fade-in">
                  <CheckCircle2 className="h-12 w-12 text-white mx-auto" />
                  <h4 className="text-lg font-bold text-white">
                    상담 신청이 정상적으로 접수되었습니다.
                  </h4>
                  <p className="text-xs text-neutral-400 max-w-md mx-auto leading-relaxed">
                    입력해주신 연락처(<span className="text-white font-mono">{formData.phone}</span>)로 24시간 이내에 원장이 직접 연락드려 방문 미팅 일정을 안내해 드리겠습니다.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        name: '',
                        phone: '',
                        email: '',
                        courseId: lessonCourses[0],
                        productionType: productionTypes[0],
                        daw: '',
                        genre: '',
                        experienceLevel: experienceLevels[0],
                        message: '',
                      });
                    }}
                    className="mt-4 px-4 py-2 text-xs font-medium text-neutral-300 hover:text-white border border-white/10 rounded-md"
                  >
                    추가 상담 접수하기
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {errorMsg && (
                    <div className="p-3 text-xs text-red-300 bg-red-950/50 border border-red-800/60 rounded-md">
                      {errorMsg}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                        이름 <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="홍길동"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 text-[13px] sm:text-xs bg-neutral-950 border border-white/10 rounded-md text-white placeholder-neutral-600 focus:outline-none focus:border-white/30"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                        연락처 (휴대폰) <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="010-0000-0000"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 text-[13px] sm:text-xs bg-neutral-950 border border-white/10 rounded-md text-white placeholder-neutral-600 focus:outline-none focus:border-white/30"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                        이메일 (선택)
                      </label>
                      <input
                        type="email"
                        placeholder="name@example.com"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 text-[13px] sm:text-xs bg-neutral-950 border border-white/10 rounded-md text-white placeholder-neutral-600 focus:outline-none focus:border-white/30"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                        {inquiryType === 'lesson' ? '희망 수강 과정' : '작업 의뢰 분야'}
                      </label>
                      {inquiryType === 'lesson' ? (
                        <select
                          value={formData.courseId}
                          onChange={(e) =>
                            setFormData({ ...formData, courseId: e.target.value })
                          }
                          className="w-full px-3.5 py-2.5 text-[13px] sm:text-xs bg-neutral-950 border border-white/10 rounded-md text-white focus:outline-none focus:border-white/30"
                        >
                          {lessonCourses.map((courseOption) => (
                            <option key={courseOption} value={courseOption} className="bg-neutral-900 text-white">
                              {courseOption}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <select
                          value={formData.productionType}
                          onChange={(e) =>
                            setFormData({ ...formData, productionType: e.target.value })
                          }
                          className="w-full px-3.5 py-2.5 text-[13px] sm:text-xs bg-neutral-950 border border-white/10 rounded-md text-white focus:outline-none focus:border-white/30"
                        >
                          {productionTypes.map((prodOption) => (
                            <option key={prodOption} value={prodOption} className="bg-neutral-900 text-white">
                              {prodOption}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                      현재 음악 경험
                    </label>
                    <select
                      value={formData.experienceLevel}
                      onChange={(e) =>
                        setFormData({ ...formData, experienceLevel: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 text-[13px] sm:text-xs bg-neutral-950 border border-white/10 rounded-md text-white focus:outline-none focus:border-white/30"
                    >
                      {experienceLevels.map((expOption) => (
                        <option key={expOption} value={expOption} className="bg-neutral-900 text-white">
                          {expOption}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                      상담 희망 시간대 및 문의 사항
                    </label>
                    <textarea
                      rows={4}
                      placeholder={
                        inquiryType === 'production'
                          ? '예) 발라드 편곡을 의뢰드리고 싶어서 문의 드립니다.\n전체 스트링 편곡 문의 드립니다.'
                          : '예) 평일 저녁 7시 이후 또는 주말 점심 방문을 희망합니다.\n음악은 처음 접해보는데 관심이 있어서 상담 받고 싶습니다.'
                      }
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 text-[13px] sm:text-xs bg-neutral-950 border border-white/10 rounded-md text-white placeholder-neutral-600 focus:outline-none focus:border-white/30 leading-relaxed"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 px-6 text-[13px] sm:text-sm font-semibold text-black bg-white hover:bg-neutral-200 disabled:opacity-60 disabled:cursor-not-allowed rounded-md transition-all flex items-center justify-center gap-2 shadow-lg"
                    >
                      <Send className="h-4 w-4" />
                      <span>
                        {isSubmitting
                          ? '상담 신청 접수 중...'
                          : inquiryType === 'lesson'
                          ? '1:1 방문 상담 신청하기'
                          : '작업 의뢰 문의 접수하기'}
                      </span>
                    </button>
                    <p className="text-[11px] sm:text-xs text-neutral-400 text-center mt-2.5">
                      {contactSection.submitNotice}
                    </p>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
