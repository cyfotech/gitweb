import React, { ReactNode } from 'react';
import { useVisualEditor } from '../context/VisualEditorContext';
import { Edit3 } from 'lucide-react';

interface CmsSectionMedia {
  backgroundImage?: string | null;
  backgroundVideo?: string | null;
  imagePosition?: string | null;
  imageAltText?: string | null;
}

interface EditableSectionContainerProps {
  sectionKey: string;
  sectionId?: string;
  sectionTitle?: string;
  children: ReactNode;
  className?: string;
  isEnabled?: boolean;
  sectionData?: CmsSectionMedia | null;
}

export function EditableSectionContainer({
  sectionKey,
  sectionId,
  sectionTitle,
  children,
  className = '',
  isEnabled = true,
  sectionData,
}: EditableSectionContainerProps) {
  const visualEditor = useVisualEditor();

  const isEditorActive = visualEditor?.draftState?.isEditorActive;
  const isSelected =
    isEditorActive &&
    (visualEditor?.draftState?.selectedSectionKey === sectionKey ||
      (sectionId && visualEditor?.draftState?.selectedSectionId === sectionId));

  const handleClick = (e: React.MouseEvent) => {
    if (!isEditorActive) return;
    e.stopPropagation();
    visualEditor.selectSection(sectionId || null, sectionKey);
  };

  if (!isEnabled) return null;

  const backgroundPosition = sectionData?.imagePosition === 'left'
    ? 'left center'
    : sectionData?.imagePosition === 'right'
      ? 'right center'
      : sectionData?.imagePosition || 'center';
  const hasBackgroundMedia = Boolean(sectionData?.backgroundImage || sectionData?.backgroundVideo);

  if (!isEditorActive && !hasBackgroundMedia) {
    return <>{children}</>;
  }

  return (
    <div
      id={`section-${sectionKey}`}
      onClick={handleClick}
      className={isEditorActive
        ? `relative group/editor transition-all duration-200 cursor-pointer ${
          isSelected
            ? 'ring-2 ring-teal-400 ring-offset-2 ring-offset-[#030F14] shadow-[0_0_25px_rgba(45,212,191,0.25)] rounded-2xl'
            : 'hover:ring-1 hover:ring-teal-400/50'
        } ${className}`
        : className}
      data-editor-section-key={sectionKey}
      data-editor-section-id={sectionId}
      style={hasBackgroundMedia ? { position: 'relative', isolation: 'isolate' } : undefined}
    >
      {hasBackgroundMedia && (
        <div
          aria-hidden={!sectionData?.imageAltText}
          aria-label={sectionData?.imageAltText || undefined}
          role={sectionData?.imageAltText ? 'img' : undefined}
          className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
          style={{
            backgroundImage: sectionData?.backgroundImage ? `url("${sectionData.backgroundImage}")` : undefined,
            backgroundPosition,
            backgroundSize: 'cover',
            opacity: sectionData?.backgroundImage ? 0.3 : undefined,
          }}
        >
          {sectionData?.backgroundVideo && (
            <video
              src={sectionData.backgroundVideo}
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 h-full w-full object-cover"
              style={{ objectPosition: backgroundPosition, opacity: 0.3 }}
            />
          )}
        </div>
      )}
      {isEditorActive && <div
        className={`absolute top-2 right-4 z-40 flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide backdrop-blur-md transition-all ${
          isSelected
            ? 'bg-teal-500 text-slate-900 shadow-lg opacity-100 scale-100'
            : 'bg-slate-900/85 text-teal-300 border border-teal-500/30 opacity-0 group-hover/editor:opacity-100'
        }`}
      >
        <Edit3 size={11} className={isSelected ? 'animate-bounce' : ''} />
        <span>{sectionTitle || sectionKey.replace(/_/g, ' ').toUpperCase()}</span>
        <span className="text-[9px] px-1.5 py-0.2 rounded bg-black/20 uppercase font-mono">
          {isSelected ? 'ACTIVE' : 'CLICK TO EDIT'}
        </span>
      </div>}

      <div className={hasBackgroundMedia ? 'relative z-10' : undefined}>{children}</div>
    </div>
  );
}
