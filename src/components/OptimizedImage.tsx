import React from 'react';
import { IMAGE_VARIANTS } from '../data/imageVariants';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  maxWidth?: number;
  priority?: boolean;
  includeDimensions?: boolean;
  referrerPolicy?: React.HTMLAttributeReferrerPolicy;
  decoding?: 'sync' | 'async' | 'auto';
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className,
  sizes,
  maxWidth,
  priority = false,
  includeDimensions = true,
  referrerPolicy,
  decoding = 'async',
}) => {
  const normalizedSrc = src.trim();
  const variant = IMAGE_VARIANTS[normalizedSrc];

  const loading: 'eager' | 'lazy' = priority ? 'eager' : 'lazy';
  const fetchPriority: 'high' | 'auto' = priority ? 'high' : 'auto';

  if (!variant) {
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        loading={loading}
        decoding={decoding}
        fetchPriority={fetchPriority}
        referrerPolicy={referrerPolicy}
      />
    );
  }

  const allEntries = Object.entries(variant.webp)
    .map(([widthStr, url]) => [Number(widthStr), url] as const)
    .sort((a, b) => a[0] - b[0]);

  const filteredEntries =
    maxWidth !== undefined
      ? allEntries.filter(([width]) => width <= maxWidth)
      : allEntries;

  const activeEntries =
    filteredEntries.length > 0
      ? filteredEntries
      : allEntries.length > 0
      ? [allEntries[0]]
      : [];

  const webpSrcSet = activeEntries.map(([width, url]) => `${url} ${width}w`).join(', ');

  return (
    <picture className="contents">
      {webpSrcSet && (
        <source type="image/webp" srcSet={webpSrcSet} sizes={sizes} />
      )}
      <img
        src={src}
        alt={alt}
        className={className}
        width={includeDimensions ? variant.w : undefined}
        height={includeDimensions ? variant.h : undefined}
        loading={loading}
        decoding={decoding}
        fetchPriority={fetchPriority}
        referrerPolicy={referrerPolicy}
      />
    </picture>
  );
};
