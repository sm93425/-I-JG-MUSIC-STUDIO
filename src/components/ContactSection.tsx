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
import { ConsultationInquiry, CurriculumCourse, SiteContent } from '../types';

interface ContactSectionProps {
  content: SiteContent;
  courses: CurriculumCourse[];
  selectedCourseId?: string;
  activeInquiryType?: 'lesson' | 'production';
  onInquiryTypeChange?: (type: 'lesson' | 'production') => void;
  onSubmitInquiry: (inquiry: Omit<ConsultationInquiry, 'id' | 'createdAt' | 'status'>) => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  content,
  courses,
  selectedCourseId,
  activeInquiryType,
  onInquiryTypeChange,
  onSubmitInquiry,
}) => {
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
    courseId: '[취미반]미디 작곡',
    productionType: '음원 제작 (Full Production)',
    daw: '',
    genre: '',
    experienceLevel: '완전 입문(처음 시작)',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      setErrorMsg('이름과 연락처를 입력해주세요.');
      return;
    }

    setErrorMsg('');
    onSubmitInquiry({
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      courseId:
        inquiryType === 'production'
          ? `[작업의뢰] ${formData.productionType}`
          : formData.courseId,
      daw: formData.daw,
      genre: formData.genre,
      experienceLevel: formData.experienceLevel,
      message: formData.message,
    });

    setSubmitted(true);
  };

  return (
    <section id="contact" className="py-20 lg:py-28 border-t border-white/10 bg-[#0a0a0a]">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-14">
          <div className="text-xs font-semibold tracking-wider uppercase text-neutral-400 mb-2">
            LOCATION & CONSULTATION
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            방문 상담 예약
          </h2>
          <p className="mt-3 text-base text-neutral-400 max-w-2xl">
            방문 및 체험레슨은 사전 예약제로 운영됩니다.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Location & Direct Contact Info */}
          <div className="lg:col-span-5 space-y-8">
            {/* Visual Studio Map Blueprint Card */}
            <div id="location" className="rounded-xl border border-white/10 bg-neutral-900/80 p-6 relative overflow-hidden scroll-mt-28">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-white" />
                  <span className="text-xs font-bold uppercase tracking-wider text-white">
                    스튜디오 위치 안내
                  </span>
                </div>
                <span className="text-[11px] font-mono text-neutral-400">
                  SUWON-SI, GYEONGGI-DO
                </span>
              </div>

              {/* Stylized Dark Grid Map Representation */}
              <div className="h-48 w-full rounded-lg bg-neutral-950 border border-white/10 relative p-4 flex flex-col justify-between overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:16px_16px] opacity-40" />
                
                {/* Visual landmark indicators */}
                <div className="relative z-10 flex justify-between items-start text-[11px] font-mono">
                  <span className="px-2 py-0.5 rounded bg-white/10 text-neutral-300">
                    수원 호매실
                  </span>
                  <span className="text-neutral-500">202호 (사전예약제)</span>
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
                    제이지뮤직스튜디오
                  </div>
                  <a
                    href="https://map.kakao.com"
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
                  <span className="text-white font-medium">경기도 수원시 권선구 호매실동 407 202호 (제이지뮤직스튜디오)</span>
                </div>
              </div>
            </div>

            {/* Direct Contact Details */}
            <div className="rounded-xl border border-white/10 bg-neutral-900/40 p-6 space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                빠른 상담 채널
              </h3>

              <div className="space-y-3.5 text-sm">
                <div className="flex items-center gap-3 text-neutral-300">
                  <Phone className="h-4 w-4 text-white shrink-0" />
                  <span className="text-neutral-400">전화/문자:</span>
                  <a href="tel:050-71348-0425" className="text-white font-mono font-medium hover:underline">
                    050-71348-0425
                  </a>
                </div>

                <div className="flex items-center gap-3 text-neutral-300">
                  <Mail className="h-4 w-4 text-white shrink-0" />
                  <span className="text-neutral-400">이메일:</span>
                  <a href="mailto:jg_musicstudio@naver.com" className="text-neutral-200 hover:underline">
                    jg_musicstudio@naver.com
                  </a>
                </div>

                <div className="flex items-center gap-3 text-neutral-300">
                  <a
                    href="https://pf.kakao.com/_sQkxeX"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 text-neutral-300 hover:text-white group transition-colors"
                  >
                    <div className="w-4 h-4 rounded-full bg-[#FEE500] flex items-center justify-center shrink-0 shadow-sm">
                      <svg className="w-2.5 h-2.5 text-[#191919] fill-current" viewBox="0 0 24 24">
                        <path d="M12 3c-5.523 0-10 3.582-10 8 0 2.852 1.848 5.357 4.636 6.713-.205.772-.743 2.793-.852 3.228-.135.54.197.533.414.389.17-.113 2.702-1.835 3.799-2.585.65.094 1.32.145 2.003.145 5.523 0 10-3.582 10-8s-4.477-8-10-8z"/>
                      </svg>
                    </div>
                    <span className="text-neutral-400">카카오톡:</span>
                    <span className="text-white font-medium bg-white/10 px-2.5 py-0.5 rounded group-hover:bg-white/20 transition-colors">
                      채널 : 제이지뮤직스튜디오
                    </span>
                  </a>
                </div>

                <div className="flex items-center gap-3 text-neutral-300">
                  <a
                    href="https://www.instagram.com/jg.musicstudio/"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 text-neutral-300 hover:text-white group transition-colors"
                  >
                    <Instagram className="h-4 w-4 text-white shrink-0 group-hover:scale-110 transition-transform" />
                    <span className="text-neutral-400">인스타그램:</span>
                    <span className="text-white font-medium group-hover:underline">
                      @jg.musicstudio
                    </span>
                  </a>
                </div>

                <div className="flex items-start gap-3 text-neutral-300 pt-1 border-t border-white/5">
                  <Clock className="h-4 w-4 text-white shrink-0 mt-1" />
                  <div className="space-y-1">
                    <span className="text-neutral-400 block text-xs">운영 시간</span>
                    <p className="text-xs sm:text-sm text-neutral-200 font-medium">
                      평일 12:00 ~ 23:00 (사전 예약 필수)
                    </p>
                    <p className="text-xs sm:text-sm text-neutral-200 font-medium">
                      주말 11:00 ~ 18:00 (사전 예약 필수)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: 1:1 Consultation Reservation Form */}
          <div className="lg:col-span-7">
            <div id="work-contact" className="rounded-xl border border-white/15 bg-neutral-900/90 backdrop-blur-md p-6 sm:p-8 lg:p-10 shadow-xl scroll-mt-28">
              {/* Inquiry Type Tab Switcher */}
              <div className="flex items-center gap-1 p-1 bg-neutral-950 rounded-lg border border-white/10 mb-6">
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

              <div className="mb-6">
                <h3 className="text-xl font-bold text-white">
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
                        courseId: '[취미반]미디 작곡',
                        productionType: '음원 제작 (Full Production)',
                        daw: '',
                        genre: '',
                        experienceLevel: '완전 입문(처음 시작)',
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
                        className="w-full px-3.5 py-2.5 text-xs bg-neutral-950 border border-white/10 rounded-md text-white placeholder-neutral-600 focus:outline-none focus:border-white/30"
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
                        className="w-full px-3.5 py-2.5 text-xs bg-neutral-950 border border-white/10 rounded-md text-white placeholder-neutral-600 focus:outline-none focus:border-white/30"
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
                        className="w-full px-3.5 py-2.5 text-xs bg-neutral-950 border border-white/10 rounded-md text-white placeholder-neutral-600 focus:outline-none focus:border-white/30"
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
                          className="w-full px-3.5 py-2.5 text-xs bg-neutral-950 border border-white/10 rounded-md text-white focus:outline-none focus:border-white/30"
                        >
                          <option value="[취미반]미디 작곡" className="bg-neutral-900 text-white">[취미반]미디 작곡</option>
                          <option value="[전문반]미디 작곡" className="bg-neutral-900 text-white">[전문반]미디 작곡</option>
                          <option value="[80분]원데이클래스" className="bg-neutral-900 text-white">[80분]원데이클래스</option>
                        </select>
                      ) : (
                        <select
                          value={formData.productionType}
                          onChange={(e) =>
                            setFormData({ ...formData, productionType: e.target.value })
                          }
                          className="w-full px-3.5 py-2.5 text-xs bg-neutral-950 border border-white/10 rounded-md text-white focus:outline-none focus:border-white/30"
                        >
                          <option value="음원 제작 (Full Production)" className="bg-neutral-900 text-white">음원 제작 (Full Production)</option>
                          <option value="작곡 및 편곡 (Composition & Arrangement)" className="bg-neutral-900 text-white">작곡 및 편곡 (Composition & Arrangement)</option>
                          <option value="MIDI 스트링 편곡 (MIDI String Arrangement)" className="bg-neutral-900 text-white">MIDI 스트링 편곡 (MIDI String Arrangement)</option>
                          <option value="피아노 편곡 (Piano Arrangement)" className="bg-neutral-900 text-white">피아노 편곡 (Piano Arrangement)</option>
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
                      className="w-full px-3.5 py-2.5 text-xs bg-neutral-950 border border-white/10 rounded-md text-white focus:outline-none focus:border-white/30"
                    >
                      <option value="완전 입문(처음 시작)" className="bg-neutral-900 text-white">완전 입문(처음 시작)</option>
                      <option value="기초(1년이내)" className="bg-neutral-900 text-white">기초(1년이내)</option>
                      <option value="중급(3년이내)" className="bg-neutral-900 text-white">중급(3년이내)</option>
                      <option value="고급(5년이상)" className="bg-neutral-900 text-white">고급(5년이상)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                      상담 희망 시간대 및 문의 사항
                    </label>
                    <textarea
                      rows={4}
                      placeholder="예) 평일 저녁 7시 이후 또는 주말 오후 방문을 희망합니다. 현재 비트는 찍는데 믹싱과 완곡 편곡에 대해 상담받고 싶습니다."
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 text-xs bg-neutral-950 border border-white/10 rounded-md text-white placeholder-neutral-600 focus:outline-none focus:border-white/30 leading-relaxed"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3.5 px-6 text-xs font-semibold text-black bg-white hover:bg-neutral-200 rounded-md transition-all flex items-center justify-center gap-2 shadow-lg"
                    >
                      <Send className="h-4 w-4" />
                      <span>
                        {inquiryType === 'lesson'
                          ? '1:1 방문 상담 신청하기'
                          : '작업 의뢰 문의 접수하기'}
                      </span>
                    </button>
                    <p className="text-xs text-neutral-400 text-center mt-2.5">
                      상담 신청 이후 개별적으로 연락 드립니다.
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
