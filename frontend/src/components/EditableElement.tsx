import React, { ReactNode, useRef, useState, useEffect } from 'react';
import { useVisualEditor, ElementType, ChartConfig, MetricConfig } from '../context/VisualEditorContext';
import {
  Type,
  Image as ImageIcon,
  Square,
  Sliders,
  Trash2,
  Copy,
  EyeOff,
  Upload,
  Edit2,
  BarChart2,
  CreditCard,
  Layers,
  Sparkles,
  Link,
  X
} from 'lucide-react';

interface EditableElementProps {
  sectionKey: string;
  elementKey: string;
  elementType: ElementType;
  label: string;
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  value?: any;
  chartConfig?: ChartConfig;
  metricConfig?: MetricConfig;
  as?: keyof React.JSX.IntrinsicElements;
  onReplaceMedia?: () => void;
}

export function EditableElement({
  sectionKey,
  elementKey,
  elementType,
  label,
  children,
  className = '',
  style,
  value,
  chartConfig,
  metricConfig,
  as: Component = 'div',
  onReplaceMedia,
}: EditableElementProps) {
  const visualEditor = useVisualEditor();
  const [isHovered, setIsHovered] = useState(false);
  const elementRef = useRef<HTMLElement>(null);

  const isEditorActive = visualEditor?.draftState?.isEditorActive;
  const isSelected =
    isEditorActive &&
    visualEditor?.draftState?.selectedElement?.sectionKey === sectionKey &&
    visualEditor?.draftState?.selectedElement?.elementKey === elementKey;

  // Pull any stored per-element design/layout styles (`_style_<elementKey>`)
  // from the section's JSON so inspector Design/Layout edits visibly update the
  // preview immediately. Falls back to the `style` prop when no stored styles exist.
  const mergedStyle = React.useMemo(() => {
    if (!isEditorActive) return style ?? undefined;
    const targetSection = visualEditor?.draftState?.sections.find(
      (s) => s.sectionKey === sectionKey
    );
    if (!targetSection?.content) return style ?? undefined;
    let parsed: Record<string, any> = {};
    try {
      parsed = JSON.parse(targetSection.content);
    } catch {
      return style ?? undefined;
    }
    const rawStored = parsed[`_style_${elementKey}`];
    if (!rawStored || typeof rawStored !== 'object' || Array.isArray(rawStored)) return style ?? undefined;
    const stored = rawStored as Record<string, unknown>;
    // Strip undefined values so a cleared property returns to default, and
    // drop numeric keys / array values that would make the DOM attempt an
    // indexed style write ("Indexed property setter is not supported").
    const cleaned: React.CSSProperties = {};
    (Object.keys(stored) as string[]).forEach((k) => {
      if (!k || /^\d+$/.test(k)) return;            // numeric key → unsafe
      const v = stored[k];
      if (v === undefined || v === null || v === '') return;
      if (typeof v !== 'string' && typeof v !== 'number') return; // array/object value → unsafe
      cleaned[k as keyof React.CSSProperties] = v as any;
    });
    return { ...(style ?? {}), ...cleaned };
  }, [isEditorActive, visualEditor?.draftState?.sections, sectionKey, elementKey, style]);

  const handleClick = (e: React.MouseEvent) => {
    if (!isEditorActive) return;
    e.stopPropagation();

    const rect = elementRef.current?.getBoundingClientRect() || null;
    visualEditor.selectElement({
      sectionKey,
      elementKey,
      elementType,
      label,
      currentValue: value,
      chartConfig: chartConfig,
      metricConfig: metricConfig,
      targetBoundingRect: rect,
    });
  };

  const ElementTag = Component as React.ElementType;

  // If outside visual editor (public live production), render clean element
  if (!isEditorActive) {
    return (
      <ElementTag className={className} style={mergedStyle}>
        {children}
      </ElementTag>
    );
  }

  const getBadgeIcon = () => {
    switch (elementType) {
      case 'heading':
      case 'subheading':
      case 'paragraph':
        return <Type size={10} />;
      case 'image':
      case 'video':
        return <ImageIcon size={10} />;
      case 'button':
      case 'link':
        return <Square size={10} />;
      case 'chart':
      case 'metric':
        return <BarChart2 size={10} />;
      case 'card':
        return <CreditCard size={10} />;
      default:
        return <Sliders size={10} />;
    }
  };

  return (
    <ElementTag
      ref={elementRef}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-cms-section={sectionKey}
      data-cms-element={elementKey}
      data-cms-type={elementType}
      data-cms-editable="true"
      style={mergedStyle}
      className={`relative transition-all duration-150 cursor-pointer ${isSelected
        ? 'outline-none ring-2 ring-cyan-400 ring-offset-2 ring-offset-slate-950 rounded-lg shadow-[0_0_20px_rgba(6,182,212,0.45)]'
        : isHovered
          ? 'ring-1 ring-cyan-400/60 rounded-md bg-cyan-500/5'
          : ''
        } ${className}`}
    >
      {/* Visual Hover/Selection Tag with exact screenshot badge styling */}
      {(isHovered || isSelected) && (
        <div
          className={`absolute -top-6 left-2 z-50 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-wider shadow-xl backdrop-blur transition-all pointer-events-none ${isSelected
            ? 'bg-gradient-to-r from-teal-400 to-cyan-400 text-slate-950 ring-2 ring-white/70 shadow-[0_0_15px_rgba(45,212,191,0.5)]'
            : 'bg-[#051821]/95 text-teal-300 border border-teal-500/50'
            }`}
        >
          {getBadgeIcon()}
          <span>{label}</span>
          <span className="text-[8px] font-mono opacity-85 ml-1 border-l border-current pl-1.5">
            {elementType.toUpperCase()} • {sectionKey}.{elementKey}
          </span>
        </div>
      )}

      {/* Floating Toolbar when selected — exactly like screenshot toolbar */}
      {isSelected && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute -top-12 right-2 z-50 flex items-center gap-1.5 px-2 py-1.5 rounded-2xl bg-[#03151D]/98 border border-teal-400/60 shadow-[0_4px_25px_rgba(0,0,0,0.8)] backdrop-blur-xl animate-fade-in text-white pointer-events-auto"
        >
          {/* EDIT */}
          <button
            type="button"
            onClick={() => {
              // Focus bottom dock
            }}
            title="Edit in Inspector"
            className="p-1 px-2 rounded-xl hover:bg-teal-500/25 text-teal-300 hover:text-white transition-all text-xs flex items-center gap-1 font-bold"
          >
            <Edit2 size={12} />
            <span className="text-[11px] font-extrabold">EDIT</span>
          </button>

          {/* DUPLICATE */}
          <button
            type="button"
            onClick={() => {
              if (value) {
                visualEditor.updateElementDraft(sectionKey, `${elementKey}_copy`, value);
              }
            }}
            title="Duplicate Element"
            className="p-1 px-2 rounded-xl hover:bg-cyan-500/25 text-cyan-300 hover:text-white transition-all text-xs flex items-center gap-1 font-bold"
          >
            <Copy size={12} />
            <span className="text-[11px] font-extrabold">DUPLICATE</span>
          </button>

          {/* HIDE */}
          <button
            type="button"
            onClick={() => {
              visualEditor.deleteElement(sectionKey, elementKey);
            }}
            title="Hide Content"
            className="p-1 px-2 rounded-xl hover:bg-amber-500/25 text-amber-300 hover:text-white transition-all text-xs flex items-center gap-1 font-bold"
          >
            <EyeOff size={12} />
            <span className="text-[11px] font-extrabold">HIDE</span>
          </button>

          {/* DELETE */}
          <button
            type="button"
            onClick={() => {
              if (window.confirm(`Delete "${label}"?`)) {
                visualEditor.deleteElement(sectionKey, elementKey);
              }
            }}
            title="Delete Content"
            className="p-1 px-2 rounded-xl hover:bg-rose-500/25 text-rose-300 hover:text-white transition-all text-xs flex items-center gap-1 font-bold"
          >
            <Trash2 size={12} />
            <span className="text-[11px] font-extrabold">DELETE</span>
          </button>

          <div className="h-3.5 w-px bg-teal-500/30 mx-0.5" />

          {/* DESELECT */}
          <button
            type="button"
            onClick={() => visualEditor.selectElement(null)}
            title="Close / Deselect"
            className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-all text-xs"
          >
            <X size={13} />
          </button>
        </div>
      )}

      {children}
    </ElementTag>
  );
}
