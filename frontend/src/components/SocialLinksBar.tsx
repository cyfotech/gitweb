import React from 'react';
import {
  SOCIAL_PLATFORMS,
  detectSocialPlatform,
  normalizeSocialUrl,
  SocialChannelItem,
} from '../utils/socialMediaDetector';

interface SocialLinksBarProps {
  channels?: SocialChannelItem[];
  fallbackLinks?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
    youtube?: string;
  };
  variant?: 'footer' | 'navbar' | 'contact' | 'floating' | 'card';
  iconSize?: number;
  className?: string;
}

export const SocialLinksBar: React.FC<SocialLinksBarProps> = ({
  channels = [],
  fallbackLinks = {},
  variant = 'footer',
  iconSize = 16,
  className = '',
}) => {
  // Combine dynamic channels or build from fallback fields if channels array is empty
  let activeList: SocialChannelItem[] = [];

  if (channels && channels.length > 0) {
    activeList = channels
      .filter((c) => c.active && c.url && c.url.trim().length > 0)
      .sort((a, b) => a.order - b.order);
  } else {
    // Construct from legacy object keys if present
    const legacyEntries: { platform: string; url?: string }[] = [
      { platform: 'linkedin', url: fallbackLinks.linkedin },
      { platform: 'x', url: fallbackLinks.twitter },
      { platform: 'facebook', url: fallbackLinks.facebook },
      { platform: 'instagram', url: fallbackLinks.instagram },
      { platform: 'youtube', url: fallbackLinks.youtube },
    ];

    legacyEntries.forEach((item, idx) => {
      if (item.url && item.url.trim().length > 0) {
        const detected = detectSocialPlatform(item.url);
        activeList.push({
          id: `legacy-${idx}`,
          platform: detected.id,
          name: detected.name,
          url: item.url,
          active: true,
          order: idx,
        });
      }
    });
  }

  if (activeList.length === 0) {
    return null;
  }

  // Variant-specific styling presets
  const getContainerClasses = () => {
    switch (variant) {
      case 'navbar':
        return 'flex items-center gap-2';
      case 'contact':
      case 'card':
        return 'flex flex-wrap items-center gap-2.5 mt-2';
      case 'floating':
        return 'fixed bottom-6 right-6 z-40 flex flex-col items-center gap-2.5 p-2 rounded-2xl bg-white/80 dark:bg-[#071A22]/90 backdrop-blur-xl border border-teal-500/20 shadow-2xl';
      case 'footer':
      default:
        return 'flex flex-wrap items-center gap-2.5 mt-4';
    }
  };

  return (
    <div className={`${getContainerClasses()} ${className}`} aria-label="Social media channels">
      {activeList.map((channel) => {
        const cfg = SOCIAL_PLATFORMS[channel.platform] || detectSocialPlatform(channel.url);
        const Icon = cfg.IconComponent;
        const href = normalizeSocialUrl(channel.url);

        return (
          <a
            key={channel.id}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            title={`${cfg.name} - ${settingsTitle(channel.name, cfg.name)}`}
            aria-label={channel.name || cfg.name}
            className="w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:-translate-y-1 shadow-sm border bg-[#041a1e]/80 dark:bg-[#031417]/90 border-teal-500/30 hover:border-teal-400 group text-slate-200"
            style={{
              ['--hover-color' as any]: cfg.color,
            }}
          >
            <span
              className="transition-colors duration-200 group-hover:text-[var(--hover-color)] text-slate-200 flex items-center justify-center"
            >
              <Icon size={iconSize || 16} />
            </span>
          </a>
        );
      })}
    </div>
  );
};

function settingsTitle(customName?: string, platformName?: string) {
  if (customName && customName !== platformName) {
    return `${customName} (${platformName})`;
  }
  return platformName || 'Profile';
}

export default SocialLinksBar;
