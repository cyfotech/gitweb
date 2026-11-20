import React from 'react';

interface BrandLogoProps {
  className?: string;
  isDark?: boolean;
}

export function BrandLogo({ className = '', isDark }: BrandLogoProps) {
  return (
    <div className={`flex items-center cursor-pointer select-none ${className}`}>
      {/*
        New Smart Tax Experts logo — single asset used for both themes.
        The logo has a transparent/white background and works on all backgrounds.
        On dark backgrounds a subtle brightness filter ensures visibility.
      */}
      <img
        src="/assets/aistudio/ste_logo_new.png"
        alt="Smart Tax Experts"
        className={`w-auto object-contain transition-opacity duration-200 ${
          isDark === true
            ? 'h-10 sm:h-11 md:h-12 brightness-[1.15]'
            : isDark === false
              ? 'h-10 sm:h-11 md:h-12'
              : 'h-10 sm:h-11 md:h-12 dark:brightness-[1.1]'
        }`}
        style={{ maxWidth: '160px' }}
        loading="eager"
        draggable={false}
      />
    </div>
  );
}
