import { useNavigate, useLocation } from 'react-router-dom';

/**
 * BackToServices
 * ---------------
 * A premium "← Back to Services" button for service detail pages.
 *
 * Behavior:
 *  - If the visitor navigated here from the Our Core Services section
 *    (router state `fromCore`), clicking returns to `/services` and
 *    smooth-scrolls to the core services ("#explorer") section.
 *  - If the page was opened directly, it falls back to the main services page.
 *
 * It is intentionally a small, theme-compatible control: transparent/soft
 * background, subtle border, mint accent, and a gentle hover that nudges the
 * arrow left.
 */
export default function BackToServices() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = (e) => {
    e.preventDefault();
    const fromCore = location.state && location.state.fromCore === true;
    if (fromCore) {
      navigate('/services', { state: { scrollToExplorer: true } });
    } else {
      navigate('/services');
    }
  };

  return (
    <a
      href="/services"
      onClick={handleClick}
      className="bts back-to-services"
      aria-label="Back to Services"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '10px',
        padding: '11px 18px',
        borderRadius: '999px',
        border: '1px solid rgba(255,255,255,0.32)',
        background: 'rgba(255,255,255,0.08)',
        color: '#F2F6F7',
        font: '600 14px/1 "Manrope", system-ui, sans-serif',
        textDecoration: 'none',
        letterSpacing: '0.01em',
        cursor: 'pointer',
        boxShadow: '0 4px 18px rgba(0,0,0,0.25)',
        transition: 'border-color .3s ease, background .3s ease, color .3s ease, transform .3s ease, box-shadow .3s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'rgba(55,225,145,0.7)';
        e.currentTarget.style.background = 'rgba(55,225,145,0.16)';
        e.currentTarget.style.color = '#ffffff';
        e.currentTarget.style.boxShadow = '0 6px 22px rgba(0,0,0,0.35)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.28)';
        e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
        e.currentTarget.style.color = '#E8EDF0';
      }}
    >
      <span aria-hidden="true" style={{ display: 'inline-flex', color: '#37E191', transition: 'transform .3s ease' }}>
        ←
      </span>
      <span>Back to Services</span>
    </a>
  );
}
