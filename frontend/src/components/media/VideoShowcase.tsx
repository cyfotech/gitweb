import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Info, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles,
  Layers,
  ShieldCheck,
  Video
} from 'lucide-react';

interface VideoShowcaseProps {
  posterImage?: string;
  title?: string;
  subtitle?: string;
  onExploreWork?: () => void;
  cmsContent?: {
    parsedContent?: {
      posterImage?: string;
      videoUrl?: string;
      mediaMode?: 'simulation' | 'player';
      badgeText?: string;
      integrityNotice?: string;
      exploreButtonText?: string;
      simulationLabel?: string;
      playerLabel?: string;
      metrics?: Array<{ label: string; value: string; detail: string }>;
    } | null;
  } | null;
}

const DEFAULT_METRICS = [
  { label: 'Throughput', value: '400+ Returns/Wk', detail: 'Peak Q1 capacity' },
  { label: 'Turnaround', value: '48h SLA', detail: 'Guaranteed review' },
  { label: 'Zero Retention', value: 'SOC 2 Type II', detail: 'Encrypted VDI' },
];

export function VideoShowcase({
  posterImage = '/assets/aistudio/Preferred_Tax_Consultancy_Light_and_Dark_UI_Mockup_5df4cb50.png',
  title = 'Financial Intelligence in Motion',
  subtitle = 'Observe how our diagnostic review engines and certified tax accountants orchestrate complex tax filings with surgical precision.',
  onExploreWork,
  cmsContent,
}: VideoShowcaseProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [mediaMode, setMediaMode] = useState<'simulation' | 'player'>('simulation');
  const [customVideoSrc, setCustomVideoSrc] = useState<string>('');
  const [videoLoadError, setVideoLoadError] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const content = cmsContent?.parsedContent;
  const metrics = Array.isArray(content?.metrics) && content.metrics.length
    ? content.metrics.filter((metric) => typeof metric?.label === 'string' && typeof metric?.value === 'string' && typeof metric?.detail === 'string').slice(0, 3)
    : DEFAULT_METRICS;
  const poster = content?.posterImage || posterImage;

  useEffect(() => {
    setCustomVideoSrc(content?.videoUrl || '');
    setMediaMode(content?.mediaMode || (content?.videoUrl ? 'player' : 'simulation'));
  }, [content?.mediaMode, content?.videoUrl]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
        setVideoLoadError(false);
      }).catch(() => {
        setVideoLoadError(true);
        setIsPlaying(false);
      });
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <div className="w-full rounded-3xl overflow-hidden bg-[#071C25] text-white border border-[rgba(121,241,232,0.2)] shadow-2xl relative">
      {/* Top Banner Notice - Transparent & Truthful per Section 3 instructions */}
      <div className="bg-[#031117] px-6 py-2.5 border-b border-[rgba(121,241,232,0.15)] flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-[#A8C0C6]">
        <div className="flex items-center gap-2">
          <Info className="w-3.5 h-3.5 text-[#49E3D6]" />
          <span>
            <strong className="text-[#F4FBFC]">Verified Media Integrity:</strong> {content?.integrityNotice || 'No local MP4 file bundled in repository. Displaying high-precision procedural motion simulation.'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMediaMode('simulation')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
              mediaMode === 'simulation'
                ? 'bg-[#49E3D6] text-[#03181E]'
                : 'bg-white/5 hover:bg-white/10 text-white'
            }`}
          >
            {content?.simulationLabel || 'Procedural Experience'}
          </button>
          <button
            onClick={() => setMediaMode('player')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
              mediaMode === 'player'
                ? 'bg-[#49E3D6] text-[#03181E]'
                : 'bg-white/5 hover:bg-white/10 text-white'
            }`}
          >
            {content?.playerLabel || 'Direct Video Player'}
          </button>
        </div>
      </div>

      {/* Main View Area */}
      {mediaMode === 'simulation' ? (
        /* PROCEDURAL MOTION VISUALIZATION */
        <div className="relative min-h-[420px] sm:min-h-[500px] flex items-center justify-center p-8 overflow-hidden bg-gradient-to-br from-[#071C25] via-[#05161D] to-[#020A0E]">
          {/* Ambient luminous glow circles */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[#49E3D6]/10 blur-3xl pointer-events-none animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-[#1E8289]/15 blur-3xl pointer-events-none" />

          {/* Procedural Grid Lines */}
          <div className="absolute inset-0 tech-grid-pattern opacity-40 pointer-events-none" />

          {/* Central Interactive Content */}
          <div className="relative z-10 max-w-2xl text-center flex flex-col items-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider bg-[rgba(44,207,197,0.15)] text-[#49E3D6] border border-[#49E3D6]/30 mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{content?.badgeText || 'Real-Time Production Telemetry'}</span>
            </div>

            <h3 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[#F4FBFC] font-serif-editorial">
              {title}
            </h3>

            <p className="mt-3 text-sm sm:text-base text-[#A8C0C6] leading-relaxed max-w-xl">
              {subtitle}
            </p>

            {/* Interactive Pulse Telemetry Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full mt-8">
              {metrics.map((metric, index) => (
                <div key={`${metric.label}-${index}`} className={`p-3.5 rounded-2xl bg-white/5 backdrop-blur-md border border-[rgba(121,241,232,0.15)] text-left ${index === 2 ? 'col-span-2 sm:col-span-1' : ''}`}>
                  <span className="text-[10px] font-mono text-[#7DF5E8] uppercase tracking-wider block">{metric.label}</span>
                  <span className={`text-lg font-bold font-mono ${index === 2 ? 'text-emerald-400' : 'text-white'}`}>{metric.value}</span>
                  <span className="text-[10px] text-[#A8C0C6] block mt-0.5">{metric.detail}</span>
                </div>
              ))}
            </div>

            {onExploreWork && (
              <button
                onClick={onExploreWork}
                className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold bg-[#49E3D6] text-[#03181E] hover:bg-[#7DF5E8] hover:scale-105 transition-all shadow-lg"
              >
                <span>{content?.exploreButtonText || 'Explore Verified Service Catalog'}</span>
                <Layers className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ) : (
        /* REAL HTML5 VIDEO PLAYER (With Error, Poster & Input Handling) */
        <div className="relative min-h-[420px] bg-black flex flex-col justify-between">
          <div className="p-4 bg-[#05141A] border-b border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
            <span className="font-mono text-[#A8C0C6]">
              Load custom video stream or test file:
            </span>
            <div className="flex items-center gap-2 flex-1 max-w-md">
              <input
                type="text"
                placeholder="Paste MP4 / WebM video URL (e.g. /video.mp4)..."
                value={customVideoSrc}
                onChange={(e) => {
                  setCustomVideoSrc(e.target.value);
                  setVideoLoadError(false);
                  setVideoLoaded(false);
                }}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#49E3D6]"
              />
            </div>
          </div>

          <div className="relative flex-1 flex items-center justify-center p-4">
            {customVideoSrc ? (
              <video
                ref={videoRef}
                src={customVideoSrc}
                poster={poster}
                playsInline
                muted={isMuted}
                onLoadedData={() => setVideoLoaded(true)}
                onError={() => {
                  setVideoLoadError(true);
                  setIsPlaying(false);
                }}
                className="max-h-[380px] w-auto rounded-xl shadow-lg object-contain"
              />
            ) : (
              <div className="text-center p-8 max-w-md">
                <Video className="w-12 h-12 text-[#49E3D6] mx-auto mb-3 opacity-80" />
                <h4 className="text-base font-bold text-white mb-1">
                  Ready for Video Playback
                </h4>
                <p className="text-xs text-[#A8C0C6] leading-relaxed">
                  No video asset was placed in the project repository. Enter any verified MP4 video URL above or switch back to Procedural Experience for interactive animated visual graphics.
                </p>
              </div>
            )}

            {videoLoadError && (
              <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center p-6 text-center">
                <AlertCircle className="w-10 h-10 text-rose-400 mb-2" />
                <div className="text-sm font-bold text-white">Video Source Unavailable</div>
                <div className="text-xs text-[#A8C0C6] max-w-sm mt-1">
                  The provided URL could not be loaded or decoded by the browser. Confirm the file exists and is in a web-compatible format (H.264/MP4).
                </div>
              </div>
            )}
          </div>

          {/* Controls Bar */}
          <div className="p-3 bg-[#05141A] border-t border-white/10 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <button
                onClick={togglePlay}
                disabled={!customVideoSrc || videoLoadError}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-40 text-white transition-all"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
              <button
                onClick={toggleMute}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all"
                aria-label={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <span className="font-mono text-[11px] text-[#A8C0C6]">
                {isPlaying ? 'Playing' : 'Paused'}
              </span>
            </div>

            <div className="text-[11px] font-mono text-[#A8C0C6]">
              HTML5 Verified Player
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
