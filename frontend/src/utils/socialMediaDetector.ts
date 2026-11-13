import React from 'react';
import {
  FaLinkedin,
  FaInstagram,
  FaFacebook,
  FaXTwitter,
  FaYoutube,
  FaWhatsapp,
  FaTelegram,
  FaGithub,
  FaGitlab,
  FaPinterest,
  FaSnapchat,
  FaReddit,
  FaDiscord,
  FaTiktok,
  FaThreads,
  FaMedium,
  FaBehance,
  FaDribbble,
  FaTwitch,
  FaSpotify,
  FaSkype,
  FaGlobe,
  FaEnvelope,
  FaLink,
} from 'react-icons/fa6';

export interface SocialPlatformConfig {
  id: string;
  name: string;
  color: string; // Brand HEX color
  bgLight: string;
  bgDark: string;
  domainPatterns: RegExp[];
  placeholder: string;
  defaultLabel: string;
  IconComponent: React.ComponentType<{ className?: string; size?: number | string; style?: React.CSSProperties }>;
}

export interface SocialChannelItem {
  id: string; // unique item id (uuid or timestamp)
  platform: string; // e.g. 'linkedin', 'instagram', 'custom'
  name: string; // e.g. 'LinkedIn'
  url: string;
  active: boolean;
  order: number;
}

export const SOCIAL_PLATFORMS: Record<string, SocialPlatformConfig> = {
  linkedin: {
    id: 'linkedin',
    name: 'LinkedIn',
    color: '#0A66C2',
    bgLight: 'rgba(10, 102, 194, 0.1)',
    bgDark: 'rgba(10, 102, 194, 0.2)',
    domainPatterns: [/linkedin\.com/i, /lnkd\.in/i],
    placeholder: 'https://linkedin.com/company/your-firm',
    defaultLabel: 'LinkedIn Profile',
    IconComponent: FaLinkedin,
  },
  x: {
    id: 'x',
    name: 'X (Twitter)',
    color: '#000000',
    bgLight: 'rgba(0, 0, 0, 0.08)',
    bgDark: 'rgba(255, 255, 255, 0.15)',
    domainPatterns: [/x\.com/i, /twitter\.com/i, /t\.co/i],
    placeholder: 'https://x.com/your-firm',
    defaultLabel: 'X / Twitter Profile',
    IconComponent: FaXTwitter,
  },
  instagram: {
    id: 'instagram',
    name: 'Instagram',
    color: '#E4405F',
    bgLight: 'rgba(228, 64, 95, 0.1)',
    bgDark: 'rgba(228, 64, 95, 0.2)',
    domainPatterns: [/instagram\.com/i, /instagr\.am/i],
    placeholder: 'https://instagram.com/your-firm',
    defaultLabel: 'Instagram Profile',
    IconComponent: FaInstagram,
  },
  facebook: {
    id: 'facebook',
    name: 'Facebook',
    color: '#1877F2',
    bgLight: 'rgba(24, 119, 242, 0.1)',
    bgDark: 'rgba(24, 119, 242, 0.2)',
    domainPatterns: [/facebook\.com/i, /fb\.com/i, /fb\.watch/i],
    placeholder: 'https://facebook.com/your-firm',
    defaultLabel: 'Facebook Page',
    IconComponent: FaFacebook,
  },
  youtube: {
    id: 'youtube',
    name: 'YouTube',
    color: '#FF0000',
    bgLight: 'rgba(255, 0, 0, 0.1)',
    bgDark: 'rgba(255, 0, 0, 0.2)',
    domainPatterns: [/youtube\.com/i, /youtu\.be/i],
    placeholder: 'https://youtube.com/@your-channel',
    defaultLabel: 'YouTube Channel',
    IconComponent: FaYoutube,
  },
  whatsapp: {
    id: 'whatsapp',
    name: 'WhatsApp',
    color: '#25D366',
    bgLight: 'rgba(37, 211, 102, 0.1)',
    bgDark: 'rgba(37, 211, 102, 0.2)',
    domainPatterns: [/wa\.me/i, /whatsapp\.com/i, /api\.whatsapp\.com/i],
    placeholder: 'https://wa.me/18005557829',
    defaultLabel: 'WhatsApp Chat',
    IconComponent: FaWhatsapp,
  },
  telegram: {
    id: 'telegram',
    name: 'Telegram',
    color: '#26A5E4',
    bgLight: 'rgba(38, 165, 228, 0.1)',
    bgDark: 'rgba(38, 165, 228, 0.2)',
    domainPatterns: [/t\.me/i, /telegram\.me/i, /telegram\.org/i],
    placeholder: 'https://t.me/your-channel',
    defaultLabel: 'Telegram Channel',
    IconComponent: FaTelegram,
  },
  github: {
    id: 'github',
    name: 'GitHub',
    color: '#24292F',
    bgLight: 'rgba(36, 41, 47, 0.1)',
    bgDark: 'rgba(255, 255, 255, 0.15)',
    domainPatterns: [/github\.com/i],
    placeholder: 'https://github.com/your-org',
    defaultLabel: 'GitHub Organization',
    IconComponent: FaGithub,
  },
  gitlab: {
    id: 'gitlab',
    name: 'GitLab',
    color: '#FC6D26',
    bgLight: 'rgba(252, 109, 38, 0.1)',
    bgDark: 'rgba(252, 109, 38, 0.2)',
    domainPatterns: [/gitlab\.com/i],
    placeholder: 'https://gitlab.com/your-org',
    defaultLabel: 'GitLab Repository',
    IconComponent: FaGitlab,
  },
  threads: {
    id: 'threads',
    name: 'Threads',
    color: '#000000',
    bgLight: 'rgba(0, 0, 0, 0.08)',
    bgDark: 'rgba(255, 255, 255, 0.15)',
    domainPatterns: [/threads\.net/i],
    placeholder: 'https://threads.net/@your-firm',
    defaultLabel: 'Threads Profile',
    IconComponent: FaThreads,
  },
  tiktok: {
    id: 'tiktok',
    name: 'TikTok',
    color: '#000000',
    bgLight: 'rgba(0, 0, 0, 0.08)',
    bgDark: 'rgba(255, 255, 255, 0.15)',
    domainPatterns: [/tiktok\.com/i],
    placeholder: 'https://tiktok.com/@your-firm',
    defaultLabel: 'TikTok Profile',
    IconComponent: FaTiktok,
  },
  reddit: {
    id: 'reddit',
    name: 'Reddit',
    color: '#FF4500',
    bgLight: 'rgba(255, 69, 0, 0.1)',
    bgDark: 'rgba(255, 69, 0, 0.2)',
    domainPatterns: [/reddit\.com/i, /redd\.it/i],
    placeholder: 'https://reddit.com/r/your-community',
    defaultLabel: 'Reddit Community',
    IconComponent: FaReddit,
  },
  discord: {
    id: 'discord',
    name: 'Discord',
    color: '#5865F2',
    bgLight: 'rgba(88, 101, 242, 0.1)',
    bgDark: 'rgba(88, 101, 242, 0.2)',
    domainPatterns: [/discord\.gg/i, /discord\.com/i],
    placeholder: 'https://discord.gg/your-invite',
    defaultLabel: 'Discord Server',
    IconComponent: FaDiscord,
  },
  pinterest: {
    id: 'pinterest',
    name: 'Pinterest',
    color: '#BD081C',
    bgLight: 'rgba(189, 8, 28, 0.1)',
    bgDark: 'rgba(189, 8, 28, 0.2)',
    domainPatterns: [/pinterest\.com/i, /pin\.it/i],
    placeholder: 'https://pinterest.com/your-firm',
    defaultLabel: 'Pinterest Board',
    IconComponent: FaPinterest,
  },
  snapchat: {
    id: 'snapchat',
    name: 'Snapchat',
    color: '#FFFC00',
    bgLight: 'rgba(255, 252, 0, 0.15)',
    bgDark: 'rgba(255, 252, 0, 0.2)',
    domainPatterns: [/snapchat\.com/i],
    placeholder: 'https://snapchat.com/add/your-account',
    defaultLabel: 'Snapchat Account',
    IconComponent: FaSnapchat,
  },
  medium: {
    id: 'medium',
    name: 'Medium',
    color: '#000000',
    bgLight: 'rgba(0, 0, 0, 0.08)',
    bgDark: 'rgba(255, 255, 255, 0.15)',
    domainPatterns: [/medium\.com/i],
    placeholder: 'https://medium.com/@your-firm',
    defaultLabel: 'Medium Publication',
    IconComponent: FaMedium,
  },
  behance: {
    id: 'behance',
    name: 'Behance',
    color: '#1769FF',
    bgLight: 'rgba(23, 105, 255, 0.1)',
    bgDark: 'rgba(23, 105, 255, 0.2)',
    domainPatterns: [/behance\.net/i],
    placeholder: 'https://behance.net/your-portfolio',
    defaultLabel: 'Behance Portfolio',
    IconComponent: FaBehance,
  },
  dribbble: {
    id: 'dribbble',
    name: 'Dribbble',
    color: '#EA4C89',
    bgLight: 'rgba(234, 76, 137, 0.1)',
    bgDark: 'rgba(234, 76, 137, 0.2)',
    domainPatterns: [/dribbble\.com/i],
    placeholder: 'https://dribbble.com/your-agency',
    defaultLabel: 'Dribbble Showcase',
    IconComponent: FaDribbble,
  },
  twitch: {
    id: 'twitch',
    name: 'Twitch',
    color: '#9146FF',
    bgLight: 'rgba(145, 70, 255, 0.1)',
    bgDark: 'rgba(145, 70, 255, 0.2)',
    domainPatterns: [/twitch\.tv/i],
    placeholder: 'https://twitch.tv/your-stream',
    defaultLabel: 'Twitch Stream',
    IconComponent: FaTwitch,
  },
  spotify: {
    id: 'spotify',
    name: 'Spotify',
    color: '#1DB954',
    bgLight: 'rgba(29, 185, 84, 0.1)',
    bgDark: 'rgba(29, 185, 84, 0.2)',
    domainPatterns: [/spotify\.com/i],
    placeholder: 'https://open.spotify.com/show/your-podcast',
    defaultLabel: 'Spotify Podcast',
    IconComponent: FaSpotify,
  },
  skype: {
    id: 'skype',
    name: 'Skype',
    color: '#00AFF0',
    bgLight: 'rgba(0, 175, 240, 0.1)',
    bgDark: 'rgba(0, 175, 240, 0.2)',
    domainPatterns: [/skype\.com/i, /skype:/i],
    placeholder: 'https://join.skype.com/your-link',
    defaultLabel: 'Skype Contact',
    IconComponent: FaSkype,
  },
  email: {
    id: 'email',
    name: 'Email Newsletter',
    color: '#0D9488',
    bgLight: 'rgba(13, 148, 136, 0.1)',
    bgDark: 'rgba(13, 148, 136, 0.2)',
    domainPatterns: [/^mailto:/i, /substack\.com/i],
    placeholder: 'mailto:info@smarttaxexperts.com',
    defaultLabel: 'Email / Newsletter',
    IconComponent: FaEnvelope,
  },
  website: {
    id: 'website',
    name: 'Official Website / Blog',
    color: '#059669',
    bgLight: 'rgba(5, 150, 105, 0.1)',
    bgDark: 'rgba(5, 150, 105, 0.2)',
    domainPatterns: [],
    placeholder: 'https://smarttaxexperts.com',
    defaultLabel: 'Website / External Link',
    IconComponent: FaGlobe,
  },
  custom: {
    id: 'custom',
    name: 'Custom Channel',
    color: '#64748B',
    bgLight: 'rgba(100, 116, 139, 0.1)',
    bgDark: 'rgba(100, 116, 139, 0.2)',
    domainPatterns: [],
    placeholder: 'https://...',
    defaultLabel: 'Custom Link',
    IconComponent: FaLink,
  },
};

/**
 * Automatically inspects a URL string and detects the corresponding platform configuration.
 */
export function detectSocialPlatform(url: string): SocialPlatformConfig {
  if (!url || typeof url !== 'string') return SOCIAL_PLATFORMS.custom;
  const trimmed = url.trim().toLowerCase();

  // Test each configured platform
  for (const [key, cfg] of Object.entries(SOCIAL_PLATFORMS)) {
    if (key === 'website' || key === 'custom') continue;
    for (const pattern of cfg.domainPatterns) {
      if (pattern.test(trimmed)) {
        return cfg;
      }
    }
  }

  // If starts with http:// or https:// and not matched above, categorize as website
  if (/^https?:\/\//i.test(trimmed)) {
    return SOCIAL_PLATFORMS.website;
  }

  return SOCIAL_PLATFORMS.custom;
}

/**
 * Validates whether a given URL is safe and well-formatted.
 * Prevents javascript: or dangerous URI schemes.
 */
export function validateSocialUrl(url: string): { valid: boolean; error?: string } {
  if (!url || !url.trim()) {
    return { valid: false, error: 'URL cannot be empty' };
  }
  const trimmed = url.trim();

  // Reject malicious schemes
  if (/^(javascript|data|vbscript):/i.test(trimmed)) {
    return { valid: false, error: 'Unsafe URL protocol detected' };
  }

  // Allow safe protocols
  if (/^(https?:\/\/|mailto:|tel:|skype:)/i.test(trimmed)) {
    return { valid: true };
  }

  // Allow raw domain names (will auto-prepend https:// upon usage)
  if (/^[a-zA-Z0-9][-a-zA-Z0-9]*\.[a-zA-Z]{2,}/.test(trimmed)) {
    return { valid: true };
  }

  return { valid: false, error: 'Please enter a valid website or profile URL (e.g. https://...)' };
}

/**
 * Normalizes a URL so it's guaranteed to be safely clickable with https://
 */
export function normalizeSocialUrl(url: string): string {
  if (!url) return '#';
  const trimmed = url.trim();
  if (/^(https?:\/\/|mailto:|tel:|skype:)/i.test(trimmed)) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

