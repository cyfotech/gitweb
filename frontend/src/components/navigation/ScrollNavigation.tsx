import { useCallback, useEffect, useState } from 'react';

/**
 * ScrollNavigation
 * ----------------
 * Two floating controls (↑ Scroll to Top, ↓ Scroll to Bottom) fixed to the
 * right edge of the viewport, stacked vertically. They fade in/out based on
 * scroll position:
 *   - Scroll-to-Top is shown once the user scrolls down ~160px.
 *   - Scroll-to-Bottom is hidden when the user is near the bottom.
 *
 * Uses a single passive scroll listener, smooth scrolling, and proper cleanup.
 */
const VISIBLE_THRESHOLD = 160; // px from top before "up" appears
const BOTTOM_EPSILON = 240; // px from bottom before "down" hides

export default function ScrollNavigation() {
  const [showTop, setShowTop] = useState(false);
  const [showBottom, setShowBottom] = useState(false);

  const update = useCallback(() => {
    const doc = document.documentElement;
    const scrollY = window.scrollY || window.pageYOffset;
    const maxScroll = Math.max(0, doc.scrollHeight - window.innerHeight);

    setShowTop(scrollY > VISIBLE_THRESHOLD);
    setShowBottom(maxScroll - scrollY > BOTTOM_EPSILON);
  }, []);

  useEffect(() => {
    update();
    // passive listener to avoid blocking scroll
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [update]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToBottom = () => {
    const doc = document.documentElement;
    window.scrollTo({ top: doc.scrollHeight, behavior: 'smooth' });
  };

  const baseBtn: React.CSSProperties = {
    width: '46px',
    height: '46px',
    borderRadius: '14px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(12, 22, 28, 0.92)',
    border: '1px solid rgba(255,255,255,0.14)',
    color: '#37E191',
    fontSize: '18px',
    lineHeight: '1',
    cursor: 'pointer',
    boxShadow: '0 8px 24px -8px rgba(0,0,0,0.45)',
    transition: 'opacity .35s ease, transform .3s ease, border-color .3s ease, background .3s ease',
    opacity: 0,
    pointerEvents: 'none',
    touchAction: 'manipulation',
  };

  const btnVisible: React.CSSProperties = {
    opacity: 1,
    pointerEvents: 'auto',
  };

  return (
    <div
      className="scrollnav"
      aria-label="Scroll controls"
      style={{
        position: 'fixed',
        right: '20px',
        bottom: '104px',
        zIndex: 60,
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}
    >
      <button
        type="button"
        className="scrollnav-up"
        onClick={scrollToTop}
        disabled={!showTop}
        title="Scroll to Top"
        aria-label="Scroll to Top"
        style={showTop ? { ...baseBtn, ...btnVisible } : { ...baseBtn }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.borderColor = 'rgba(55,225,145,0.7)';
          const span = e.currentTarget.querySelector('span');
          if (span) span.style.transform = 'translateY(-2px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.14)';
          const span = e.currentTarget.querySelector('span');
          if (span) span.style.transform = 'translateY(0)';
        }}
      >
        <span style={{ display: 'inline-block', transition: 'transform .3s ease' }} aria-hidden="true">
          ↑
        </span>
      </button>

      <button
        type="button"
        className="scrollnav-down"
        onClick={scrollToBottom}
        disabled={!showBottom}
        title="Scroll to Bottom"
        aria-label="Scroll to Bottom"
        style={showBottom ? { ...baseBtn, ...btnVisible } : { ...baseBtn }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(2px)';
          e.currentTarget.style.borderColor = 'rgba(55,225,145,0.7)';
          const span = e.currentTarget.querySelector('span');
          if (span) span.style.transform = 'translateY(2px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.14)';
          const span = e.currentTarget.querySelector('span');
          if (span) span.style.transform = 'translateY(0)';
        }}
      >
        <span style={{ display: 'inline-block', transition: 'transform .3s ease' }} aria-hidden="true">
          ↓
        </span>
      </button>
    </div>
  );
}
