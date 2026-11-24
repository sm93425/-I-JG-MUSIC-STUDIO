import React from 'react';
import { ArrowUpRight, Sparkles, ExternalLink } from 'lucide-react';
import { CustomHomepageCategory } from '../types';
import { OptimizedImage } from './OptimizedImage';

interface CustomSectionRendererProps {
  section: CustomHomepageCategory;
  onScrollToContact?: (type?: 'lesson' | 'production') => void;
}

export const CustomSectionRenderer: React.FC<CustomSectionRendererProps> = ({
  section,
  onScrollToContact,
}) => {
  const handleCta = () => {
    if (section.ctaAction === 'link' && section.ctaUrl) {
      window.location.href = section.ctaUrl;
      return;
    }
    if (onScrollToContact) {
      onScrollToContact(section.ctaAction === 'production' ? 'production' : 'lesson');
    } else {
      const target = document.getElementById(
        section.ctaAction === 'production' ? 'work-contact' : 'contact'
      );
      target?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id={section.id}
      className="py-14 sm:py-20 lg:py-28 border-t border-white/10 bg-[#0a0a0a] scroll-mt-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          {section.badge && (
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-neutral-300 mb-3 sm:mb-4 font-mono">
              <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-white" />
              <span>{section.badge}</span>
            </div>
          )}
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            {section.title}
          </h2>
          {section.subtitle && (
            <p className="mt-3 sm:mt-4 text-[13px] sm:text-base text-neutral-400 max-w-2xl mx-auto leading-relaxed whitespace-pre-line break-keep">
              {section.subtitle}
            </p>
          )}
        </div>

        {/* Items Rendering */}
        {section.items.length > 0 && section.layout === 'list' && (
          <div className="max-w-4xl mx-auto rounded-2xl border border-white/15 bg-neutral-900/60 divide-y divide-white/10 overflow-hidden mb-10">
            {section.items.map((item) => (
              <div
                key={item.id}
                className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/[0.03] transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg font-bold text-white">{item.title}</h3>
                    {item.badge && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-white text-black font-bold">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  {item.description && (
                    <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed whitespace-pre-line">
                      {item.description}
                    </p>
                  )}
                </div>
                {item.subtitle && (
                  <div className="text-sm font-mono font-bold text-white shrink-0">
                    {item.subtitle}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {section.items.length > 0 && section.layout !== 'list' && (
          <div
            className={`grid gap-6 mb-10 ${
              section.layout === 'banner'
                ? 'grid-cols-1 max-w-4xl mx-auto'
                : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
            }`}
          >
            {section.items.map((item) => {
              const cardBody = (
                <div className="h-full rounded-2xl border border-white/10 bg-neutral-900/60 overflow-hidden hover:border-white/25 transition-all flex flex-col">
                  {item.imageUrl && (
                    <div className="aspect-video w-full bg-black overflow-hidden border-b border-white/10">
                      <OptimizedImage
                        src={item.imageUrl}
                        alt={item.title}
                        sizes="(max-width: 767px) 92vw, (max-width: 1023px) 46vw, 400px"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-2">
                      {item.badge && (
                        <span className="inline-block text-[10px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/10 text-neutral-200 border border-white/10">
                          {item.badge}
                        </span>
                      )}
                      <h3 className="text-lg font-bold text-white leading-snug whitespace-pre-line">
                        {item.title}
                      </h3>
                      {item.subtitle && (
                        <p className="text-xs font-mono text-neutral-300">{item.subtitle}</p>
                      )}
                      {item.description && (
                        <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed whitespace-pre-line">
                          {item.description}
                        </p>
                      )}
                    </div>
                    {item.linkUrl && (
                      <div className="pt-2 inline-flex items-center gap-1 text-xs font-semibold text-white">
                        <span>자세히 보기</span>
                        <ExternalLink className="h-3.5 w-3.5" />
                      </div>
                    )}
                  </div>
                </div>
              );

              return item.linkUrl ? (
                <a
                  key={item.id}
                  href={item.linkUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="block"
                >
                  {cardBody}
                </a>
              ) : (
                <div key={item.id}>{cardBody}</div>
              );
            })}
          </div>
        )}

        {/* Optional CTA Button */}
        {section.ctaText && (
          <div className="text-center">
            <button
              type="button"
              onClick={handleCta}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-sm font-bold text-black bg-white hover:bg-neutral-200 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 cursor-pointer"
            >
              <span>{section.ctaText}</span>
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
