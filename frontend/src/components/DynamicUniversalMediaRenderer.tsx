import React from 'react';
import { FinancialAnalyticsDashboard } from './FinancialAnalyticsDashboard';
import { BarChart3, Image as ImageIcon, Video, Sparkles, AlertCircle } from 'lucide-react';

export type UniversalMediaType = 'chart' | 'image' | 'video' | 'gif' | 'lottie' | 'embed';

export interface UniversalMediaProps {
  mediaType?: UniversalMediaType | string;
  mediaUrl?: string | null;
  altText?: string;
  chartConfig?: any;
  className?: string;
  aspectRatio?: string;
  objectFit?: 'contain' | 'cover' | 'fill';
  autoplay?: boolean;
  loop?: boolean;
  controls?: boolean;
  muted?: boolean;
  fallbackComponent?: React.ReactNode;
}

export function DynamicUniversalMediaRenderer({
  mediaType = 'chart',
  mediaUrl,
  altText = 'Media Showcase',
  chartConfig,
  className = '',
  aspectRatio = 'aspect-video',
  objectFit = 'contain',
  autoplay = true,
  loop = true,
  controls = true,
  muted = true,
  fallbackComponent
}: UniversalMediaProps) {
  const normalizedType = (mediaType || 'chart').toLowerCase();

  // 1. VIDEO RENDERER
  if (normalizedType === 'video' && mediaUrl) {
    return (
      <div className={`w-full rounded-2xl overflow-hidden bg-black/60 border border-teal-500/20 shadow-2xl relative ${className}`}>
        <video
          src={mediaUrl}
          autoPlay={autoplay}
          loop={loop}
          muted={muted}
          controls={controls}
          playsInline
          style={{ objectFit }}
          className="w-full h-full max-h-[500px]"
        >
          Your browser does not support HTML5 video streaming.
        </video>
      </div>
    );
  }

  // 2. GIF RENDERER
  if (normalizedType === 'gif' && mediaUrl) {
    return (
      <div className={`w-full rounded-2xl overflow-hidden bg-black/40 border border-teal-500/20 shadow-2xl flex items-center justify-center p-2 relative ${className}`}>
        <img
          src={mediaUrl}
          alt={altText || 'Animated Feature Showcase'}
          style={{ objectFit }}
          className="w-full h-auto max-h-[500px] rounded-xl shadow-lg"
          loading="lazy"
        />
        <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-black/70 border border-teal-500/40 text-[10px] font-mono font-bold text-teal-300">
          GIF ANIMATION
        </div>
      </div>
    );
  }

  // 3. IMAGE RENDERER (JPG, PNG, WEBP, SVG)
  if (normalizedType === 'image' && mediaUrl) {
    return (
      <div className={`w-full rounded-2xl overflow-hidden bg-black/40 border border-teal-500/20 shadow-2xl flex items-center justify-center p-2 relative ${className}`}>
        <img
          src={mediaUrl}
          alt={altText || 'Visual Media'}
          style={{ objectFit }}
          className="w-full h-auto max-h-[500px] rounded-xl shadow-lg"
          loading="lazy"
        />
      </div>
    );
  }

  // 4. EMBED RENDERER (IFRAME / TRUSTED URL)
  if (normalizedType === 'embed' && mediaUrl) {
    return (
      <div className={`w-full ${aspectRatio} rounded-2xl overflow-hidden bg-black/60 border border-teal-500/20 shadow-2xl ${className}`}>
        <iframe
          src={mediaUrl}
          title={altText || 'Embedded Media Content'}
          className="w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  // 5. CHART RENDERER (DEFAULT FOR ANALYTICS HUBS)
  if (normalizedType === 'chart') {
    return <FinancialAnalyticsDashboard />;
  }

  // 6. FALLBACK IF SPECIFIED, OTHERWISE DEFAULT CHART
  if (fallbackComponent) {
    return <>{fallbackComponent}</>;
  }

  return <FinancialAnalyticsDashboard />;
}

