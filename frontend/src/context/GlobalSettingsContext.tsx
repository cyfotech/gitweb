import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import apiClient from '../api/client';
import { SocialChannelItem, detectSocialPlatform } from '../utils/socialMediaDetector';
import { ConsultationSettingsData, defaultConsultationSettings } from '../types/consultationSettings';

export interface GlobalSettingsData {
  brandName: string;
  tagline: string;
  description: string;
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
  businessHours: string;
  operationalTitle: string;
  operationalLine1: string;
  operationalLine2: string;
  operationalLine3: string;
  mapLocation: string;
  mapEmbedUrl: string;
  contactHeading: string;
  contactDescription: string;
  copyright: string;
  // Social links legacy object
  twitter?: string;
  linkedin?: string;
  facebook?: string;
  instagram?: string;
  youtube?: string;
  // Dynamic Social Channels list
  socialChannels: SocialChannelItem[];
  // Dynamic Consultation & Calendly Settings
  consultationSettings: ConsultationSettingsData;
}

const defaultSocialChannels: SocialChannelItem[] = [
  {
    id: 'ch-linkedin',
    platform: 'linkedin',
    name: 'LinkedIn',
    url: 'https://linkedin.com/company/smart-tax-experts',
    active: true,
    order: 0,
  },
  {
    id: 'ch-x',
    platform: 'x',
    name: 'X (Twitter)',
    url: 'https://x.com/smarttaxexperts',
    active: true,
    order: 1,
  },
  {
    id: 'ch-facebook',
    platform: 'facebook',
    name: 'Facebook',
    url: 'https://facebook.com/smarttaxexperts',
    active: true,
    order: 2,
  },
  {
    id: 'ch-instagram',
    platform: 'instagram',
    name: 'Instagram',
    url: 'https://instagram.com/smarttaxexperts',
    active: true,
    order: 3,
  },
];

const defaultSettings: GlobalSettingsData = {
  brandName: 'Smart Tax Experts (STE)',
  tagline: 'Premier Tax Preparation & GAAP Accounting',
  description: 'Premier tax preparation, GAAP accounting, and scalable CPA outsourcing. Delivering precision compliance, forensic tax optimization, and 24-48h turnaround SLAs.',
  email: 'brian@smarttaxexpertss.com',
  phone: '+1 214 837 7128',
  whatsapp: '+1 214 837 7128',
  address: '5900 BALCONES DR STE 100 AUSTIN TX 78731-4298 USA',
  businessHours: 'Mon – Fri: 8:00 AM – 7:00 PM EST',
  operationalTitle: 'Active Operational Window',
  operationalLine1: 'Mon – Fri: 8:00 AM – 7:00 PM EST',
  operationalLine2: 'Offshore Processing: 24-Hour Continuous Cycle',
  operationalLine3: 'Peak Season Support: 7 Days / Week',
  mapLocation: '5900 BALCONES DR STE 100 AUSTIN TX 78731-4298 USA',
  mapEmbedUrl: 'https://maps.google.com/maps?q=5900+BALCONES+DR+STE+100+AUSTIN+TX+78731-4298+USA&t=&z=13&ie=UTF8&iwloc=&output=embed',
  contactHeading: 'Let’s discuss your tax, accounting & outsourcing requirements.',
  contactDescription: 'Whether you are a CPA firm looking to expand your team’s capacity, a business seeking dependable accounting support, or an individual who needs help with US tax preparation — tell us what you need. We’ll route it to the right desk.',
  copyright: 'Smart Tax Experts (STE). All rights reserved.',
  socialChannels: defaultSocialChannels,
  consultationSettings: defaultConsultationSettings,
};

interface GlobalSettingsContextType {
  settings: GlobalSettingsData;
  loading: boolean;
  refreshSettings: () => Promise<void>;
  updateSettings: (newSettings: Partial<GlobalSettingsData>) => Promise<boolean>;
}

const GlobalSettingsContext = createContext<GlobalSettingsContextType>({
  settings: defaultSettings,
  loading: true,
  refreshSettings: async () => {},
  updateSettings: async () => false,
});

export const GlobalSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<GlobalSettingsData>(defaultSettings);
  const [loading, setLoading] = useState(true);

  const refreshSettings = useCallback(async () => {
    try {
      const data: any = await apiClient.get('/settings');
      if (data) {
        const fc = data.footer_content || {};
        const sl = data.social_links || {};
        const contact = data.contact_info || {};
        const scRaw = data.social_channels;

        let parsedChannels: SocialChannelItem[] = [];

        if (Array.isArray(scRaw) && scRaw.length > 0) {
          parsedChannels = scRaw;
        } else if (typeof scRaw === 'object' && scRaw !== null && Array.isArray((scRaw as any).channels)) {
          parsedChannels = (scRaw as any).channels;
        } else {
          // If no dynamic list yet, construct from existing social_links or defaults
          const legacy = [
            { key: 'linkedin', name: 'LinkedIn', url: sl.linkedin },
            { key: 'x', name: 'X (Twitter)', url: sl.twitter },
            { key: 'facebook', name: 'Facebook', url: sl.facebook },
            { key: 'instagram', name: 'Instagram', url: sl.instagram },
            { key: 'youtube', name: 'YouTube', url: sl.youtube },
          ].filter(item => Boolean(item.url && item.url.trim()));

          if (legacy.length > 0) {
            parsedChannels = legacy.map((item, idx) => {
              const detected = detectSocialPlatform(item.url);
              return {
                id: `migrated-${idx}`,
                platform: detected.id,
                name: detected.name || item.name,
                url: item.url,
                active: true,
                order: idx,
              };
            });
          } else {
            parsedChannels = defaultSocialChannels;
          }
        }

        setSettings({
          brandName: contact.brandName || fc.brandName || defaultSettings.brandName,
          tagline: contact.tagline || defaultSettings.tagline,
          description: fc.description || defaultSettings.description,
          email: contact.email || fc.email || defaultSettings.email,
          phone: contact.phone || fc.phone || defaultSettings.phone,
          whatsapp: contact.whatsapp || defaultSettings.whatsapp,
          address: contact.address || fc.address || defaultSettings.address,
          businessHours: contact.businessHours || defaultSettings.businessHours,
          operationalTitle: contact.operationalTitle || defaultSettings.operationalTitle,
          operationalLine1: contact.operationalLine1 || contact.businessHours || defaultSettings.operationalLine1,
          operationalLine2: contact.operationalLine2 || defaultSettings.operationalLine2,
          operationalLine3: contact.operationalLine3 || defaultSettings.operationalLine3,
          mapLocation: contact.mapLocation || defaultSettings.mapLocation,
          mapEmbedUrl: contact.mapEmbedUrl || defaultSettings.mapEmbedUrl,
          contactHeading: contact.contactHeading || defaultSettings.contactHeading,
          contactDescription: contact.contactDescription || defaultSettings.contactDescription,
          copyright: fc.copyright || defaultSettings.copyright,
          twitter: sl.twitter || '',
          linkedin: sl.linkedin || '',
          facebook: sl.facebook || '',
          instagram: sl.instagram || '',
          youtube: sl.youtube || '',
          socialChannels: parsedChannels,
          consultationSettings: data.consultation_settings
            ? { ...defaultConsultationSettings, ...data.consultation_settings }
            : defaultConsultationSettings,
        });
      }
    } catch (err) {
      console.warn('Failed to fetch dynamic global settings, falling back to defaults:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshSettings();
  }, [refreshSettings]);

  const updateSettings = async (newSettings: Partial<GlobalSettingsData>): Promise<boolean> => {
    try {
      const merged = { ...settings, ...newSettings };

      // Sync primary channels to legacy social_links for backward compatibility
      const legacySocialLinks: Record<string, string> = {
        twitter: merged.twitter || '',
        linkedin: merged.linkedin || '',
        facebook: merged.facebook || '',
        instagram: merged.instagram || '',
        youtube: merged.youtube || '',
      };

      if (merged.socialChannels && Array.isArray(merged.socialChannels)) {
        merged.socialChannels.forEach((ch) => {
          if (ch.active && ch.url) {
            if (ch.platform === 'x' || ch.platform === 'twitter') legacySocialLinks.twitter = ch.url;
            if (ch.platform === 'linkedin') legacySocialLinks.linkedin = ch.url;
            if (ch.platform === 'facebook') legacySocialLinks.facebook = ch.url;
            if (ch.platform === 'instagram') legacySocialLinks.instagram = ch.url;
            if (ch.platform === 'youtube') legacySocialLinks.youtube = ch.url;
          }
        });
      }

      const payload = {
        settings: {
          footer_content: {
            brandName: merged.brandName,
            description: merged.description,
            email: merged.email,
            phone: merged.phone,
            address: merged.address,
            copyright: merged.copyright,
          },
          contact_info: {
            brandName: merged.brandName,
            tagline: merged.tagline,
            email: merged.email,
            phone: merged.phone,
            whatsapp: merged.whatsapp,
            address: merged.address,
            businessHours: merged.operationalLine1 || merged.businessHours,
            operationalTitle: merged.operationalTitle,
            operationalLine1: merged.operationalLine1,
            operationalLine2: merged.operationalLine2,
            operationalLine3: merged.operationalLine3,
            mapLocation: merged.mapLocation,
            mapEmbedUrl: merged.mapEmbedUrl,
            contactHeading: merged.contactHeading,
            contactDescription: merged.contactDescription,
          },
          social_links: legacySocialLinks,
          social_channels: merged.socialChannels || [],
          consultation_settings: merged.consultationSettings || defaultConsultationSettings,
        },
      };

      await apiClient.put('/settings/bulk', payload);
      setSettings(merged);
      return true;
    } catch (err) {
      console.error('Failed to update global settings:', err);
      return false;
    }
  };

  return (
    <GlobalSettingsContext.Provider value={{ settings, loading, refreshSettings, updateSettings }}>
      {children}
    </GlobalSettingsContext.Provider>
  );
};

export const useGlobalSettings = () => useContext(GlobalSettingsContext);
