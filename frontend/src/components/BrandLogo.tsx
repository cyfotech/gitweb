import React from 'react';

interface BrandLogoProps {
  className?: string;
  isDark?: boolean;
}

export function BrandLogo({ className = '', isDark }: BrandLogoProps) {
  return (
    <div className={`flex items-center gap-2 cursor-pointer select-none ${className}`}>
      {/* Light Theme STE Logo: Rendered directly from official vector PDF */}
      <img
        src="/assets/aistudio/ste_logo_light.png"
        alt="Smart Tax Experts"
        className={`h-8 sm:h-9 md:h-10 w-auto object-contain transition-opacity duration-200 ${
          isDark === true 
            ? 'hidden' 
            : isDark === false 
              ? 'block' 
              : 'dark:hidden block'
        }`}
        loading="eager"
      />

      {/* Dark Theme STE Logo: Clean transparent asset with official white text & STE green emblem */}
      <img
        src="/assets/aistudio/ste_logo_dark.png"
        alt="Smart Tax Experts"
        className={`h-8 sm:h-9 md:h-10 w-auto object-contain transition-opacity duration-200 ${
          isDark === true 
            ? 'block' 
            : isDark === false 
              ? 'hidden' 
              : 'hidden dark:block'
        }`}
        loading="eager"
      />
    </div>
  );
}
