import React, { useState } from 'react';
import { Play, Music, Film, Disc, Maximize2, X } from 'lucide-react';
import { AudioTrack, HomepageConfig, ReleaseCategory, ReleaseItem } from '../types';
import { INITIAL_RELEASES } from '../data/releasesData';
import { INITIAL_HOMEPAGE_CONFIG } from '../data/initialData';

export type { ReleaseItem };

interface AudioPlayerProps {
  tracks?: AudioTrack[];
  releases?: ReleaseItem[];
  homepageConfig?: HomepageConfig;
  selectedCategory?: ReleaseCategory;
  onSelectCategory?: (category: ReleaseCategory) => void;
}

export const getReleaseCategory = (item: ReleaseItem): string => {
  return item.category || 'MUSIC';
};

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  releases = INITIAL_RELEASES,
  homepageConfig = INITIAL_HOMEPAGE_CONFIG,
  selectedCategory,
  onSelectCategory,
}) => {
  const [internalCategory, setInternalCategory] = useState<ReleaseCategory>('ALL');
  const [previewItem, setPreviewItem] = useState<ReleaseItem | null>(null);
  const activeCategory = selectedCategory !== undefined ? selectedCategory : internalCategory;

  const {
    portfolio,
    portfolioCategories = INITIAL_HOMEPAGE_CONFIG.portfolioCategories,
  } = homepageConfig;

  const handleCategorySelect = (category: ReleaseCategory) => {
    if (onSelectCategory) {
      onSelectCategory(category);
    } else {
      setInternalCategory(category);
    }
  };

  const getTabIcon = (catId: string) => {
    if (catId === 'PROGRAM') return <Film className="w-3.5 h-3.5" />;
    if (catId === 'BGM') return <Disc className="w-3.5 h-3.5" />;
    return <Music className="w-3.5 h-3.5" />;
  };

  const countAll = releases.length;
  const categoryTabs: { key: ReleaseCategory; label: string; count: number; icon: React.ReactNode }[] = [
    { key: 'ALL', label: portfolio.allTabLabel, count: countAll, icon: null },
    ...portfolioCategories.map((cat) => ({
      key: cat.id,
      label: cat.label,
      count: releases.filter((r) => getReleaseCategory(r) === cat.id).length,
      icon: getTabIcon(cat.id),
    })),
  ];

  // Filter releases by selected category
  const filteredReleases = releases.filter((release) => {
    if (activeCategory === 'ALL') return true;
    return getReleaseCategory(release) === activeCategory;
  });

  // Sort by portfolioCategories order first, then newest releaseOrder
  const categoryPriority: Record<string, number> = {};
  portfolioCategories.forEach((cat, idx) => {
    categoryPriority[cat.id] = idx + 1;
  });

  const displayedReleases = [...filteredReleases].sort((a, b) => {
    const catA = getReleaseCategory(a);
    const catB = getReleaseCategory(b);
    if (catA !== catB) {
      return (categoryPriority[catA] || 99) - (categoryPriority[catB] || 99);
    }
    return b.releaseOrder - a.releaseOrder;
  });

  return (
    <section id="portfolio" className="py-14 sm:py-20 lg:py-28 border-t border-white/10 bg-[#0a0a0a]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header & Category Controls */}
        <div className="mb-8 sm:mb-10 flex flex-col xl:flex-row xl:items-end justify-between gap-5 sm:gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-white/10 text-neutral-300 border border-white/10">
                {portfolio.badge}
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              {portfolio.title}
            </h2>
            <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-neutral-400 tracking-wider">
              {portfolio.subtitle}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full xl:w-auto">
            {/* Dynamic Categories + ALL filter tabs */}
            <div className="flex flex-wrap items-center gap-1 p-1 bg-neutral-900/90 rounded-xl border border-white/10 text-[11px] sm:text-xs shadow-inner max-w-full">
              {categoryTabs.map((tab) => {
                const isActive = activeCategory === tab.key;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => handleCategorySelect(tab.key)}
                    className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-white text-black shadow-sm'
                        : 'text-neutral-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold transition-colors ${
                        isActive
                          ? 'bg-neutral-200 text-black'
                          : 'bg-white/10 text-neutral-400'
                      }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Releases Grid */}
        {displayedReleases.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl">
            <p className="text-neutral-400 text-sm">해당 카테고리의 발매작이 없습니다.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6 md:gap-8">
            {displayedReleases.map((release) => {
              const itemCat = getReleaseCategory(release);
              const catDef = portfolioCategories.find((c) => c.id === itemCat);
              const isPoster = catDef ? catDef.aspectRatio === 'poster' : itemCat === 'PROGRAM';
              const tagLabel = catDef?.shortTag || itemCat;

              const cardInner = (
                <>
                  <div
                    className={`relative w-full rounded-xl overflow-hidden border border-white/10 bg-neutral-900 shadow-xl transition-all duration-300 group-hover:border-white/30 group-hover:shadow-2xl group-hover:-translate-y-1 ${
                      isPoster ? 'aspect-[3/4]' : 'aspect-square'
                    }`}
                  >
                    {/* Category Chip Badge */}
                    <div className="absolute top-2.5 left-2.5 z-10">
                      <span
                        className={`text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md backdrop-blur-md border shadow-sm ${
                          itemCat === 'MUSIC'
                            ? 'bg-black/75 text-neutral-200 border-white/20'
                            : itemCat === 'PROGRAM'
                            ? 'bg-amber-950/80 text-amber-200 border-amber-500/30'
                            : itemCat === 'BGM'
                            ? 'bg-emerald-950/80 text-emerald-200 border-emerald-500/30'
                            : 'bg-sky-950/80 text-sky-200 border-sky-500/30'
                        }`}
                      >
                        {tagLabel}
                      </span>
                    </div>

                    <img
                      src={release.coverUrl}
                      alt={`${release.title}${release.artist ? ` - ${release.artist}` : ''}`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="h-11 w-11 rounded-full bg-white text-black flex items-center justify-center shadow-lg transition-transform group-hover:scale-110">
                        {release.youtubeUrl ? (
                          <Play className="h-5 w-5 fill-current translate-x-0.5" />
                        ) : (
                          <Maximize2 className="h-5 w-5" />
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-2.5 sm:mt-3.5 space-y-0.5 sm:space-y-1 text-left">
                    <h3 className="text-[13px] sm:text-base font-bold text-white group-hover:text-neutral-200 transition-colors leading-snug line-clamp-2">
                      {release.title}
                    </h3>
                    {release.artist && (
                      <p className="text-[11px] sm:text-sm text-neutral-400 font-medium truncate">
                        {release.artist}
                      </p>
                    )}
                  </div>
                </>
              );

              return release.youtubeUrl ? (
                <a
                  key={release.id}
                  href={release.youtubeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-xl"
                >
                  {cardInner}
                </a>
              ) : (
                <button
                  key={release.id}
                  type="button"
                  onClick={() => setPreviewItem(release)}
                  className="group block w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-xl"
                >
                  {cardInner}
                </button>
              );
            })}
          </div>
        )}

        {/* Poster Lightbox Modal */}
        {previewItem && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
            onClick={() => setPreviewItem(null)}
          >
            <div
              className="relative max-w-lg w-full bg-[#121212] border border-white/20 rounded-2xl p-6 shadow-2xl flex flex-col items-center gap-4"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setPreviewItem(null)}
                className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                aria-label="닫기"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="w-full max-h-[65vh] rounded-xl overflow-hidden border border-white/10 bg-black flex items-center justify-center">
                <img
                  src={previewItem.coverUrl}
                  alt={previewItem.title}
                  className="max-h-[65vh] w-auto object-contain"
                />
              </div>

              <div className="w-full text-center space-y-1.5">
                <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {previewItem.artist || getReleaseCategory(previewItem)}
                </span>
                <h3 className="text-xl font-bold text-white tracking-tight">
                  {previewItem.title}
                </h3>
                <p className="text-xs text-neutral-400">
                  제이지뮤직스튜디오 (JG MUSIC STUDIO) 공식 참여 사운드트랙 / OST 작품
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
