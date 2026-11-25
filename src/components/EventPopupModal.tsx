import React, { useEffect } from 'react';
import { X, ArrowRight, Sparkles, CalendarClock } from 'lucide-react';
import { EventPopupConfig } from '../types';

interface EventPopupModalProps {
  isOpen: boolean;
  config: EventPopupConfig;
  onClose: () => void;
  onDismissToday: () => void;
  onAction: () => void;
}

export const EventPopupModal: React.FC<EventPopupModalProps> = ({
  isOpen,
  config,
  onClose,
  onDismissToday,
  onAction,
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const hasSecondaryOffer = Boolean(
    config.secondaryHeadline?.trim() && config.secondarySalePrice?.trim()
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="event-popup-title"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-[440px] max-h-[92vh] overflow-y-auto rounded-2xl border border-white/20 bg-[#0e0e0e] text-white shadow-[0_24px_80px_rgba(0,0,0,0.85)]"
      >
        {/* Subtle studio top spotlight */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-48 w-80 rounded-full bg-amber-400/15 blur-3xl"
        />

        {/* Top Header */}
        <div className="relative flex items-center justify-between px-5 sm:px-6 pt-5 pb-3">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-400/15 border border-amber-400/35 text-[#ffffff] text-[10px] sm:text-[11px] font-mono font-bold tracking-widest uppercase">
            <Sparkles className="h-3 w-3 shrink-0" />
            <span className="text-[#ffffff]">{config.badge}</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="팝업 닫기"
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>

        {/* Main Content */}
        <div className="relative px-5 sm:px-6 pb-5 sm:pb-6 pt-1 text-center space-y-4">
          <div className="space-y-1.5">
            <p className="text-[11px] sm:text-xs font-mono tracking-wider text-neutral-400 uppercase">
              JG MUSIC STUDIO
            </p>
            <h2
              id="event-popup-title"
              className="text-2xl sm:text-[28px] font-extrabold tracking-tight text-white leading-tight break-keep"
            >
              {config.title}
            </h2>
          </div>

          {/* Highlight Offer Box 1 */}
          <div className="rounded-xl border border-white/15 bg-neutral-900/90 px-4 py-4 sm:px-5 sm:py-5 space-y-2.5 shadow-inner">
            <p className="text-sm sm:text-base font-bold text-neutral-100 break-keep">
              {config.headline}
            </p>

            <div className="flex flex-wrap items-baseline justify-center gap-2 sm:gap-3">
              <span className="text-base sm:text-lg font-mono text-neutral-500 line-through decoration-neutral-400/80">
                {config.originalPrice}
              </span>
              <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 text-amber-300 self-center shrink-0" />
              <span className="text-[37px] leading-none font-extrabold font-mono tracking-tight text-[#ff3030] no-underline not-italic">
                {config.salePrice}
              </span>
            </div>

            {config.periodText && (
              <div className="inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-md bg-white/5 border border-white/10 text-xs sm:text-[13px] font-semibold text-neutral-200">
                <CalendarClock className="h-3.5 w-3.5 text-amber-300 shrink-0" />
                <span>{config.periodText}</span>
              </div>
            )}
          </div>

          {/* Highlight Offer Box 2: MIDI String Full Arrangement */}
          {hasSecondaryOffer && (
            <div className="rounded-xl border border-white/15 bg-neutral-900/90 px-4 py-4 sm:px-5 sm:py-5 space-y-2.5 shadow-inner">
              <p className="text-sm sm:text-base font-bold text-neutral-100 break-keep">
                {config.secondaryHeadline}
              </p>

              <div className="flex flex-wrap items-baseline justify-center gap-2 sm:gap-3">
                {config.secondaryOriginalPrice && (
                  <>
                    <span className="text-base sm:text-lg font-mono text-neutral-500 line-through decoration-neutral-400/80">
                      {config.secondaryOriginalPrice}
                    </span>
                    <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 text-amber-300 self-center shrink-0" />
                  </>
                )}
                <span className="text-[37px] leading-none font-extrabold font-mono tracking-tight text-[#ff3030] no-underline not-italic">
                  {config.secondarySalePrice}
                </span>
              </div>

              {config.secondaryPeriodText && (
                <div className="inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-md bg-white/5 border border-white/10 text-xs sm:text-[13px] font-semibold text-neutral-200">
                  <CalendarClock className="h-3.5 w-3.5 text-amber-300 shrink-0" />
                  <span>{config.secondaryPeriodText}</span>
                </div>
              )}
            </div>
          )}

          {config.description && (
            <p className="text-xs sm:text-[13px] text-neutral-400 leading-relaxed whitespace-pre-line break-keep">
              {config.description}
            </p>
          )}

          {/* Primary CTA */}
          <button
            type="button"
            onClick={onAction}
            className="w-full inline-flex items-center justify-center gap-2 py-3 sm:py-3.5 px-5 rounded-xl text-[13px] sm:text-sm font-bold text-black bg-white hover:bg-neutral-200 transition-all shadow-lg cursor-pointer"
          >
            <span>{config.ctaText}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {/* Bottom Dismiss Bar */}
        <div className="flex items-center border-t border-white/10 bg-[#080808] divide-x divide-white/10 text-xs">
          <button
            type="button"
            onClick={onDismissToday}
            className="flex-1 py-3 px-4 text-neutral-400 hover:text-white hover:bg-white/5 transition-colors font-medium cursor-pointer"
          >
            오늘 하루 보지 않기
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 px-4 text-neutral-300 hover:text-white hover:bg-white/5 transition-colors font-semibold cursor-pointer"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
