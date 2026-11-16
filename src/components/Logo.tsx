import React from 'react';
import Link from 'next/link';

export default function Logo({
  variant = 'dark',
  size = 'md',
  showTagline = true,
  className = ''
}: {
  variant?: 'dark' | 'light' | 'white';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  className?: string;
}) {
  const isLight = variant === 'light' || variant === 'white';

  const titleSizes = {
    sm: 'text-lg sm:text-xl',
    md: 'text-xl sm:text-2xl',
    lg: 'text-2xl sm:text-3xl',
    xl: 'text-3xl sm:text-4xl md:text-5xl',
  };

  const taglineSizes = {
    sm: 'text-[8px] tracking-[0.25em]',
    md: 'text-[9px] sm:text-[10px] tracking-[0.3em]',
    lg: 'text-[11px] tracking-[0.32em]',
    xl: 'text-xs sm:text-sm tracking-[0.35em]',
  };

  return (
    <Link href="/" className={`inline-flex flex-col group select-none ${className}`}>
      <div className="flex items-center space-x-1">
        <span
          className={`font-serif font-semibold tracking-tight transition-colors ${titleSizes[size]} ${
            isLight
              ? 'text-white group-hover:text-brandLightPink'
              : 'text-brandBlack group-hover:text-brandPink'
          }`}
        >
          Soumili's
        </span>
        <span
          className={`font-serif font-light tracking-wide transition-colors ${titleSizes[size]} text-brandPink group-hover:opacity-90`}
        >
          Makeover
        </span>
        <span className="w-1.5 h-1.5 rounded-full bg-brandPink self-end mb-1.5 animate-pulse" />
      </div>

      {showTagline && (
        <span
          className={`font-sans font-medium uppercase mt-0.5 transition-colors ${taglineSizes[size]} ${
            isLight ? 'text-brandLightPink/85' : 'text-brandBlack/70 group-hover:text-brandPink'
          }`}
        >
          Beauty • Elegance • Perfection
        </span>
      )}
    </Link>
  );
}
