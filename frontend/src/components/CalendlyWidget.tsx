import React, { useEffect, useRef } from 'react';
import { BOOKING_CONFIG } from '../config/bookingConfig';

/**
 * SMT Smart Tax Experts — Calendly Widget integration.
 *
 * Loads the official Calendly embed script exactly once (guarded), then
 * exposes two safe wrappers:
 *   - openCalendlyPopup(url)   opens the official popup widget
 *   - <CalendlyInline url />   renders the official inline widget
 *
 * The URL resolves in this order:
 *   1. An explicit `url` prop / argument.
 *   2. The admin-configured URL (passed via `dynamicUrl`).
 *   3. The static default in `bookingConfig.ts` (VITE_CALENDLY_URL fallback).
 *
 * We never load the Calendly script more than once, and we never claim an
 * appointment is booked — Calendly itself creates the booking and fires the
 * webhook our backend listens to.
 */

declare global {
  interface Window {
    Calendly?: {
      initPopupWidget?: (opts: { url: string }) => void;
      initInlineWidget?: (opts: {
        url: string;
        parentElement: HTMLElement;
        prefill?: Record<string, unknown>;
      }) => void;
    };
  }
}

/** Resolve a Calendly URL, preferring the dynamic admin value. */
export function resolveCalendlyUrl(url?: string, dynamicUrl?: string): string {
  const candidate = url || dynamicUrl || BOOKING_CONFIG.calendlyUrl;
  if (/^https:\/\/calendly\.com\//.test(candidate)) return candidate;
  // Fall back to the safe default for anything malformed.
  return BOOKING_CONFIG.calendlyUrl;
}

let scriptLoadPromise: Promise<void> | null = null;

function ensureCalendlyScript(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();
  if (window.Calendly) return Promise.resolve();
  if (!scriptLoadPromise) {
    scriptLoadPromise = new Promise((resolve) => {
      // First check if already attached on page
      if (window.Calendly) {
        resolve();
        return;
      }
      const existing = document.querySelector('script[src*="calendly.com/assets/external/widget.js"]');
      if (existing) {
        existing.addEventListener('load', () => resolve());
        existing.addEventListener('error', () => resolve());
        // If already loaded
        setTimeout(() => resolve(), 300);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://assets.calendly.com/assets/external/widget.js';
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => {
        console.warn('[Calendly] Failed to load external script');
        resolve();
      };
      document.head.appendChild(script);
    });
  }
  return scriptLoadPromise;
}

/** Open the official Calendly popup widget. */
export async function openCalendlyPopup(url?: string, dynamicUrl?: string): Promise<void> {
  const targetUrl = resolveCalendlyUrl(url, dynamicUrl);
  try {
    await ensureCalendlyScript();
    const widget = window.Calendly;
    if (widget?.initPopupWidget) {
      widget.initPopupWidget({ url: targetUrl });
      return;
    }
  } catch (err) {
    console.warn('[Calendly] initPopupWidget error, falling back to window.open:', err);
  }
  // Safe fallback if blocked or widget unavailable
  window.open(targetUrl, '_blank', 'noopener,noreferrer');
}

interface CalendlyInlineProps {
  url?: string;
  dynamicUrl?: string;
  height?: number;
  prefill?: Record<string, unknown>;
  className?: string;
}

/** Official inline Calendly widget (rendered inside the page). */
export function CalendlyInline({ url, dynamicUrl, height = 700, prefill, className }: CalendlyInlineProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    const target = resolveCalendlyUrl(url, dynamicUrl);

    ensureCalendlyScript().then(() => {
      const widget = window.Calendly;
      if (!widget?.initInlineWidget || !containerRef.current) return;
      containerRef.current.innerHTML = '';
      widget.initInlineWidget({
        url: target,
        parentElement: containerRef.current,
        prefill,
      });
    }).catch((err) => {
      console.warn('[Calendly] inline widget failed to load.', err);
    });

    return () => {
      cancelled = true;
    };
  }, [url, dynamicUrl, height, JSON.stringify(prefill)]);

  return <div ref={containerRef} className={className} style={{ minHeight: height, width: '100%' }} aria-label="Calendly scheduling widget" />;
}
