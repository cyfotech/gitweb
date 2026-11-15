import React, { Fragment, useCallback, useEffect, useState } from 'react';
import BackToServices from '../../components/navigation/BackToServices';
import ScrollNavigation from '../../components/navigation/ScrollNavigation';
import { inquiriesApi } from '../../api/inquiries';

/**
 * USA Payroll Management — main service page
 * Route: /services/payroll-management
 *
 * Converted from the static "Smart Tax Expertss — USA Payroll Management Service Page" HTML.
 * Self-contained: styles are injected via the <style> tag below, fonts come from Google Fonts,
 * and all interactive widgets (pay-run animation, calculators, map, W-2 explorer, FAQ, form)
 * are driven by the single `state` object in the component.
 */

const PAGE_CSS = `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Manrope:wght@600;700;800&family=IBM+Plex+Mono:wght@500;600&display=swap');
body{margin:0;background:#F1F4F2}
a{color:#0E7A49}a:hover{color:#0A5A36}
*{box-sizing:border-box}
.h{font-family:Manrope,Inter,sans-serif;letter-spacing:-0.025em}
.mono{font-family:'IBM Plex Mono',ui-monospace,monospace}
.wrap{max-width:1240px;margin:0 auto}
.eyebrow{font-family:'IBM Plex Mono',monospace;font-size:13px;letter-spacing:.14em;text-transform:uppercase;margin:0 0 16px}
.btn{display:inline-flex;align-items:center;gap:10px;min-height:48px;padding:0 24px;border-radius:999px;font:600 15px Inter,sans-serif;text-decoration:none;cursor:pointer;border:0;transition:transform .25s ease,background .25s ease,box-shadow .25s ease}
.btn:hover{transform:translateY(-2px)}
.btn-mint{background:#37E191;color:#0B1A1E}.btn-mint:hover{background:#6CEBB0;color:#0B1A1E;box-shadow:0 12px 32px rgba(55,225,145,.28)}
.btn-ghost{background:transparent;color:#FFFFFF;box-shadow:inset 0 0 0 1.5px rgba(255,255,255,.35)}.btn-ghost:hover{color:#FFFFFF;box-shadow:inset 0 0 0 1.5px #37E191}
.btn-ink{background:#0B1A1E;color:#FFFFFF}.btn-ink:hover{background:#0E7A49;color:#FFFFFF}
.arrow{transition:transform .25s ease}.btn:hover .arrow,.lnk:hover .arrow,.dbtn:hover .arrow{transform:translateX(4px)}
.lnk{display:inline-flex;align-items:center;gap:8px;font-weight:600;font-size:15px;text-decoration:none;color:#0E7A49}
.tab{cursor:pointer;border:0;font:600 14px Inter,sans-serif;transition:all .25s ease}
.doubt{display:flex;flex-wrap:wrap;align-items:center;gap:14px 18px;margin-top:36px;padding:14px 14px 14px 22px;border-radius:999px;background:#FFFFFF;box-shadow:inset 0 0 0 1px #DCE3E1}
.doubt-dark{background:rgba(255,255,255,.05);box-shadow:inset 0 0 0 1px rgba(255,255,255,.14)}
.dq{display:flex;align-items:center;gap:12px;margin:0;font-size:16px;font-weight:500;flex:1 1 260px}
.qmark{flex:none;width:30px;height:30px;border-radius:50%;display:grid;place-items:center;background:#F2B544;color:#0B1A1E;font:800 15px Manrope,sans-serif;animation:nudge 3s ease-in-out infinite}
.dbtn{display:inline-flex;align-items:center;gap:10px;min-height:48px;padding:0 22px;border-radius:999px;background:#0B1A1E;color:#FFFFFF;font:600 15px Inter,sans-serif;text-decoration:none;transition:background .25s ease}
.dbtn:hover{background:#0E7A49;color:#FFFFFF}
.doubt-dark .dbtn{background:#37E191;color:#0B1A1E}.doubt-dark .dbtn:hover{background:#6CEBB0;color:#0B1A1E}
.svc-num{font-family:'IBM Plex Mono',monospace;font-size:13px;font-weight:600;letter-spacing:.1em;display:inline-flex;align-items:center;gap:10px;padding:8px 14px;border-radius:999px}
.perf{background-image:radial-gradient(circle at 8px 0,#F1F4F2 6px,transparent 6.5px);background-size:16px 10px;background-repeat:repeat-x;height:10px}
.marquee{display:flex;gap:56px;width:max-content;animation:marquee 34s linear infinite}
.float1{animation:float 6s ease-in-out infinite}.float2{animation:float 7s ease-in-out -2s infinite}
.pulse{transform-box:fill-box;transform-origin:center;animation:pulse 2.2s ease-out infinite}
.token{animation:travel 22s linear infinite}
.packet{animation:packet 6s cubic-bezier(.6,0,.4,1) infinite}
.orbit{animation:spin 60s linear infinite}.orbit:hover{animation-play-state:paused}
.counter{animation:spin 60s linear infinite reverse}.orbit:hover .counter{animation-play-state:paused}
.blink{animation:blink 1.6s ease-in-out infinite}
.fill{transition:height .55s cubic-bezier(.2,.8,.2,1),width .55s cubic-bezier(.2,.8,.2,1),left .55s cubic-bezier(.2,.8,.2,1),opacity .4s ease}
.ln{transition:opacity .45s ease,transform .45s cubic-bezier(.2,.8,.2,1)}
.panel-in{animation:fade .5s ease both}
.tile{transition:background .25s ease,transform .25s ease,color .25s ease;cursor:pointer;border:0}
.tile:hover{transform:scale(1.1)}
.slide{transition:transform .7s cubic-bezier(.7,0,.2,1)}
.acc{transition:flex-grow .6s cubic-bezier(.7,0,.2,1),background .4s ease}
.card-h{transition:transform .35s ease,box-shadow .35s ease}.card-h:hover{transform:translateY(-6px);box-shadow:0 26px 54px rgba(11,26,30,.12)}
.subnav a{color:#4A5A5E;text-decoration:none;font:500 14px Inter,sans-serif;padding:10px 14px;border-radius:999px;white-space:nowrap;transition:all .2s ease}
.subnav a:hover{color:#0B1A1E;background:#E3E9E6}
input[type=range]{width:100%;height:28px;cursor:pointer;accent-color:#0E7A49}
input,select,textarea{font:400 15px Inter,sans-serif}
.progress{position:fixed;top:0;left:0;height:3px;width:100%;background:#37E191;transform-origin:left;transform:scaleX(0);z-index:50}
.scan{animation:scan 3.2s ease-in-out infinite}
.tick{stroke-dasharray:30;stroke-dashoffset:30;animation:tick .5s .2s ease forwards}
.stamp{animation:stamp .5s cubic-bezier(.2,1.6,.4,1) both}
.bob{animation:bob 2.6s ease-in-out infinite}
@keyframes marquee{to{transform:translateX(-50%)}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
@keyframes pulse{0%{transform:scale(1);opacity:1}70%{transform:scale(2.6);opacity:0}100%{opacity:0}}
@keyframes travel{from{left:0%}to{left:100%}}
@keyframes packet{0%{left:0%;opacity:0}8%{opacity:1}92%{opacity:1}100%{left:100%;opacity:0}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes blink{0%,100%{opacity:1}50%{opacity:.35}}
@keyframes fade{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
@keyframes nudge{0%,80%,100%{transform:rotate(0)}85%{transform:rotate(-14deg)}90%{transform:rotate(12deg)}95%{transform:rotate(-6deg)}}
@keyframes scan{0%,100%{top:8%}50%{top:84%}}
@keyframes tick{to{stroke-dashoffset:0}}
@keyframes stamp{from{opacity:0;transform:scale(1.8) rotate(-14deg)}to{opacity:1;transform:scale(1) rotate(-8deg)}}
@keyframes bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
@keyframes rv{from{opacity:0;transform:translateY(48px)}to{opacity:1;transform:none}}
@keyframes grow{from{transform:scaleX(0)}to{transform:scaleX(1)}}
@supports (animation-timeline: view()){
.rv{animation:rv linear both;animation-timeline:view();animation-range:entry 0% cover 25%}
.grow-x{transform-origin:left;animation:grow linear both;animation-timeline:view();animation-range:entry 10% cover 40%}
.progress{animation:grow linear both;animation-timeline:scroll(root)}
}
@media (max-width: 640px){
  .hero-pill-fica{left: 0px !important; top: -14px !important;}
  .hero-pill-ot{right: 12px !important; bottom: -20px !important; left: auto !important;}
  .conveyor-track, .conveyor-token { display: none !important; }
  .stations-grid {
    display: flex !important;
    overflow-x: auto !important;
    scroll-snap-type: x mandatory !important;
    gap: 16px !important;
    padding: 8px 4px 18px !important;
    -webkit-overflow-scrolling: touch !important;
    scrollbar-width: thin !important;
  }
  .stations-grid > a {
    flex: 0 0 140px !important;
    scroll-snap-align: start !important;
  }
  section {
    padding-left: 18px !important;
    padding-right: 18px !important;
    padding-top: clamp(48px, 12vw, 72px) !important;
    padding-bottom: clamp(48px, 12vw, 72px) !important;
  }
  section#top {
    padding-top: calc(72px + 20px) !important;
  }
  .wrap {
    padding-left: 0 !important;
    padding-right: 0 !important;
  }
  .h {
    word-break: break-word;
  }
  .doubt {
    border-radius: 20px !important;
    padding: 16px !important;
    flex-direction: column !important;
    align-items: stretch !important;
    gap: 14px !important;
    max-width: 100% !important;
    box-sizing: border-box !important;
  }
  .dq {
    flex: none !important;
    width: 100% !important;
    font-size: 15px !important;
  }
  .dbtn {
    width: 100% !important;
    justify-content: center !important;
    text-align: center !important;
    box-sizing: border-box !important;
    white-space: normal !important;
    padding: 12px 18px !important;
    min-height: 48px !important;
    line-height: 1.3 !important;
  }
  .perf {
    background-size: 12px 8px !important;
  }
  .card, .rv {
    max-width: 100% !important;
    box-sizing: border-box !important;
  }
  table {
    display: block !important;
    overflow-x: auto !important;
    max-width: 100% !important;
    -webkit-overflow-scrolling: touch !important;
  }
}

/* ===== Responsive layout + theme-aware corrections ===== */
/* Hide the page-internal header — the global site header handles navigation */
.stx > header {
  display: none !important;
}
.stx {
  width: 100%;
  max-width: 100%;
  min-width: 0;
  overflow-x: clip;
  color: #0B1A1E;
  background: #F1F4F2;
  -webkit-text-size-adjust: 100%;
  text-size-adjust: 100%;
}
.stx *, .stx *::before, .stx *::after { box-sizing: border-box; }
.stx .wrap { width: 100%; max-width: 1240px; min-width: 0; }
.stx :where(div, section, article, aside, nav, main, header, footer, form) { min-width: 0; }
.stx :where(img, video, iframe, canvas, svg) { max-width: 100%; }
.stx :where(h1,h2,h3,h4,h5,h6,p,li,a,button,label,span) { overflow-wrap: anywhere; }
.stx :where(p,li) { text-wrap: pretty; }
.stx button, .stx input, .stx select, .stx textarea { max-width: 100%; }
.stx input, .stx select, .stx textarea { min-width: 0; }
.stx .btn, .stx .dbtn, .stx .tab { max-width: 100%; }
.stx .subnav { max-width: 100%; }
.stx .subnav > .wrap { min-width: 0; }
.stx .card-h, .stx .rv, .stx .panel-in { min-width: 0; }
.stx .card-h { overflow-wrap: anywhere; }
.stx .marquee { will-change: transform; }
.stx .tile:hover, .stx .card-h:hover { transform: none; }
.stx :target { scroll-margin-top: 86px; }

/* Support the common theme-switching patterns used by the parent application. */
html[data-theme="dark"] body,
body[data-theme="dark"],
html.dark body,
body.dark,
body.dark-theme,
.dark-theme body,
.dark-mode body,
html[data-theme="dark"] .stx,
body[data-theme="dark"] .stx,
html.dark .stx,
body.dark .stx,
.dark .stx,
.theme-dark .stx,
[data-mode="dark"] .stx,
body.dark-theme .stx,
.dark-theme .stx,
body.dark-mode .stx,
.dark-mode .stx,
.stx[data-theme="dark"] {
  background: #08131F !important;
  color: #E5EDF5 !important;
  color-scheme: dark;
}
html[data-theme="dark"] .stx #why,
body[data-theme="dark"] .stx #why,
html.dark .stx #why,
body.dark .stx #why,
.dark .stx #why,
.theme-dark .stx #why,
[data-mode="dark"] .stx #why,
.stx[data-theme="dark"] #why {
  background: #0F1E2C !important;
  border-color: rgba(203,213,225,.16) !important;
}
html[data-theme="dark"] .stx .subnav,
body[data-theme="dark"] .stx .subnav,
html.dark .stx .subnav,
body.dark .stx .subnav,
.dark .stx .subnav,
.theme-dark .stx .subnav,
[data-mode="dark"] .stx .subnav,
.stx[data-theme="dark"] .subnav {
  background: rgba(8,19,31,.94) !important;
  border-color: rgba(203,213,225,.18) !important;
}
html[data-theme="dark"] .stx .subnav a,
body[data-theme="dark"] .stx .subnav a,
html.dark .stx .subnav a,
body.dark .stx .subnav a,
.dark .stx .subnav a,
.theme-dark .stx .subnav a,
[data-mode="dark"] .stx .subnav a,
.stx[data-theme="dark"] .subnav a { color: #CBD5E1 !important; }
html[data-theme="dark"] .stx .subnav a:hover,
body[data-theme="dark"] .stx .subnav a:hover,
html.dark .stx .subnav a:hover,
body.dark .stx .subnav a:hover,
.dark .stx .subnav a:hover,
.theme-dark .stx .subnav a:hover,
[data-mode="dark"] .stx .subnav a:hover,
.stx[data-theme="dark"] .subnav a:hover { color: #37E191 !important; background: rgba(55,225,145,.10) !important; }

/* Turn pale, white panels into readable dark surfaces when the site is in dark mode. */
html[data-theme="dark"] .stx [style*="background: rgb(255, 255, 255)"],
body[data-theme="dark"] .stx [style*="background: rgb(255, 255, 255)"],
html.dark .stx [style*="background: rgb(255, 255, 255)"],
body.dark .stx [style*="background: rgb(255, 255, 255)"],
.dark .stx [style*="background: rgb(255, 255, 255)"],
.theme-dark .stx [style*="background: rgb(255, 255, 255)"],
[data-mode="dark"] .stx [style*="background: rgb(255, 255, 255)"],
.stx[data-theme="dark"] [style*="background: rgb(255, 255, 255)"],
html[data-theme="dark"] .stx [style*="background:#FFFFFF"],
body[data-theme="dark"] .stx [style*="background:#FFFFFF"],
html.dark .stx [style*="background:#FFFFFF"],
body.dark .stx [style*="background:#FFFFFF"],
.dark .stx [style*="background:#FFFFFF"],
.theme-dark .stx [style*="background:#FFFFFF"],
[data-mode="dark"] .stx [style*="background:#FFFFFF"],
.stx[data-theme="dark"] [style*="background:#FFFFFF"],
html[data-theme="dark"] .stx [style*="background: rgb(247, 249, 248)"],
body[data-theme="dark"] .stx [style*="background: rgb(247, 249, 248)"],
html.dark .stx [style*="background: rgb(247, 249, 248)"],
body.dark .stx [style*="background: rgb(247, 249, 248)"],
.dark .stx [style*="background: rgb(247, 249, 248)"],
.theme-dark .stx [style*="background: rgb(247, 249, 248)"],
[data-mode="dark"] .stx [style*="background: rgb(247, 249, 248)"],
.stx[data-theme="dark"] [style*="background: rgb(247, 249, 248)"],
html[data-theme="dark"] .stx [style*="background: rgb(241, 244, 242)"],
body[data-theme="dark"] .stx [style*="background: rgb(241, 244, 242)"],
html.dark .stx [style*="background: rgb(241, 244, 242)"],
body.dark .stx [style*="background: rgb(241, 244, 242)"],
.dark .stx [style*="background: rgb(241, 244, 242)"],
.theme-dark .stx [style*="background: rgb(241, 244, 242)"],
[data-mode="dark"] .stx [style*="background: rgb(241, 244, 242)"],
.stx[data-theme="dark"] [style*="background: rgb(241, 244, 242)"],
html[data-theme="dark"] .stx [style*="background: rgb(227, 233, 230)"],
body[data-theme="dark"] .stx [style*="background: rgb(227, 233, 230)"],
html.dark .stx [style*="background: rgb(227, 233, 230)"],
body.dark .stx [style*="background: rgb(227, 233, 230)"],
.dark .stx [style*="background: rgb(227, 233, 230)"],
.theme-dark .stx [style*="background: rgb(227, 233, 230)"],
[data-mode="dark"] .stx [style*="background: rgb(227, 233, 230)"],
.stx[data-theme="dark"] [style*="background: rgb(227, 233, 230)"],
html[data-theme="dark"] .stx [style*="background: rgb(238, 242, 240)"],
body[data-theme="dark"] .stx [style*="background: rgb(238, 242, 240)"],
html.dark .stx [style*="background: rgb(238, 242, 240)"],
body.dark .stx [style*="background: rgb(238, 242, 240)"],
.dark .stx [style*="background: rgb(238, 242, 240)"],
.theme-dark .stx [style*="background: rgb(238, 242, 240)"],
[data-mode="dark"] .stx [style*="background: rgb(238, 242, 240)"],
.stx[data-theme="dark"] [style*="background: rgb(238, 242, 240)"] {
  background: #132433 !important;
  color: #E5EDF5 !important;
  border-color: rgba(203,213,225,.18) !important;
}
html[data-theme="dark"] .stx [style*="background: rgb(255, 255, 255)"] :is(h1,h2,h3,h4,h5,h6,p,li,label,small),
html.dark .stx [style*="background: rgb(255, 255, 255)"] :is(h1,h2,h3,h4,h5,h6,p,li,label,small),
body.dark .stx [style*="background: rgb(255, 255, 255)"] :is(h1,h2,h3,h4,h5,h6,p,li,label,small),
.dark .stx [style*="background: rgb(255, 255, 255)"] :is(h1,h2,h3,h4,h5,h6,p,li,label,small),
.theme-dark .stx [style*="background: rgb(255, 255, 255)"] :is(h1,h2,h3,h4,h5,h6,p,li,label,small),
[data-mode="dark"] .stx [style*="background: rgb(255, 255, 255)"] :is(h1,h2,h3,h4,h5,h6,p,li,label,small),
.stx[data-theme="dark"] [style*="background: rgb(255, 255, 255)"] :is(h1,h2,h3,h4,h5,h6,p,li,label,small) { color: #D5E0EA !important; }
html[data-theme="dark"] .stx [style*="background: rgb(255, 255, 255)"] .h,
html.dark .stx [style*="background: rgb(255, 255, 255)"] .h,
body.dark .stx [style*="background: rgb(255, 255, 255)"] .h,
.dark .stx [style*="background: rgb(255, 255, 255)"] .h,
.theme-dark .stx [style*="background: rgb(255, 255, 255)"] .h,
[data-mode="dark"] .stx [style*="background: rgb(255, 255, 255)"] .h,
.stx[data-theme="dark"] [style*="background: rgb(255, 255, 255)"] .h { color: #F8FAFC !important; }
html[data-theme="dark"] .stx [style*="color: rgb(74, 90, 94)"],
body[data-theme="dark"] .stx [style*="color: rgb(74, 90, 94)"],
html.dark .stx [style*="color: rgb(74, 90, 94)"],
body.dark .stx [style*="color: rgb(74, 90, 94)"],
.dark .stx [style*="color: rgb(74, 90, 94)"],
.theme-dark .stx [style*="color: rgb(74, 90, 94)"],
[data-mode="dark"] .stx [style*="color: rgb(74, 90, 94)"],
.stx[data-theme="dark"] [style*="color: rgb(74, 90, 94)"],
html[data-theme="dark"] .stx [style*="color:#4A5A5E"],
html.dark .stx [style*="color:#4A5A5E"],
body.dark .stx [style*="color:#4A5A5E"],
.dark .stx [style*="color:#4A5A5E"],
.theme-dark .stx [style*="color:#4A5A5E"],
[data-mode="dark"] .stx [style*="color:#4A5A5E"],
.stx[data-theme="dark"] [style*="color:#4A5A5E"] { color: #C2CFDC !important; }
html[data-theme="dark"] .stx .lnk,
body[data-theme="dark"] .stx .lnk,
html.dark .stx .lnk,
body.dark .stx .lnk,
.dark .stx .lnk,
.theme-dark .stx .lnk,
[data-mode="dark"] .stx .lnk,
.stx[data-theme="dark"] .lnk { color: #55E6A1 !important; }
html[data-theme="dark"] .stx input:not([type="range"]),
html[data-theme="dark"] .stx select,
html[data-theme="dark"] .stx textarea,
html.dark .stx input:not([type="range"]),
html.dark .stx select,
html.dark .stx textarea,
body.dark .stx input:not([type="range"]),
body.dark .stx select,
body.dark .stx textarea,
.dark .stx input:not([type="range"]),
.dark .stx select,
.dark .stx textarea,
.theme-dark .stx input:not([type="range"]),
.theme-dark .stx select,
.theme-dark .stx textarea,
[data-mode="dark"] .stx input:not([type="range"]),
[data-mode="dark"] .stx select,
[data-mode="dark"] .stx textarea,
.stx[data-theme="dark"] input:not([type="range"]),
.stx[data-theme="dark"] select,
.stx[data-theme="dark"] textarea {
  color: #F1F5F9 !important;
  background: #0D1B28 !important;
  border-color: #526273 !important;
}
html[data-theme="dark"] .stx input::placeholder,
html.dark .stx input::placeholder,
body.dark .stx input::placeholder,
.dark .stx input::placeholder,
.theme-dark .stx input::placeholder,
[data-mode="dark"] .stx input::placeholder,
.stx[data-theme="dark"] input::placeholder,
html[data-theme="dark"] .stx textarea::placeholder,
html.dark .stx textarea::placeholder,
body.dark .stx textarea::placeholder,
.dark .stx textarea::placeholder,
.theme-dark .stx textarea::placeholder,
[data-mode="dark"] .stx textarea::placeholder,
.stx[data-theme="dark"] textarea::placeholder { color: #AAB8C7 !important; opacity: 1; }


/* FAQ Section Theme Overrides */
.stx #faq {
  background: var(--bg-main, #F1F4F2) !important;
}
.stx #faq .eyebrow {
  color: var(--primary-accent, #37E191) !important;
}
.stx #faq h2, .stx #faq .h {
  color: var(--text-primary, #0B1A1E) !important;
}
.stx #faq .faq-card {
  background: var(--card-surface, #FFFFFF) !important;
  border: 1px solid var(--border-color, #DCE3E1) !important;
  border-radius: 20px !important;
  transition: all .25s ease;
}
.stx #faq .faq-btn {
  color: var(--text-primary, #0B1A1E) !important;
}
.stx #faq .faq-btn span:first-child {
  color: inherit !important;
}
.stx #faq .faq-ans {
  color: var(--text-secondary, #4A5A5E) !important;
}
.stx #faq .faq-icon {
  background: var(--bg-secondary, #E3E9E6) !important;
  color: var(--text-primary, #0B1A1E) !important;
}
.stx #faq .faq-icon.open {
  background: var(--primary-accent, #37E191) !important;
  color: #0B1A1E !important;
  transform: rotate(45deg);
}

/* Dark Theme specific rules for #faq */
html[data-theme="dark"] .stx #faq,
html.dark .stx #faq,
body.dark .stx #faq,
.dark .stx #faq,
.stx[data-theme="dark"] #faq {
  background: #08131F !important;
}
html[data-theme="dark"] .stx #faq h2,
html.dark .stx #faq h2,
body.dark .stx #faq h2,
.dark .stx #faq h2,
.stx[data-theme="dark"] #faq h2,
html[data-theme="dark"] .stx #faq .h,
html.dark .stx #faq .h,
body.dark .stx #faq .h,
.dark .stx #faq .h,
.stx[data-theme="dark"] #faq .h {
  color: #FFFFFF !important;
}
html[data-theme="dark"] .stx #faq .faq-card,
html.dark .stx #faq .faq-card,
body.dark .stx #faq .faq-card,
.dark .stx #faq .faq-card,
.stx[data-theme="dark"] #faq .faq-card {
  background: #102434 !important;
  border-color: rgba(55, 225, 145, 0.22) !important;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25) !important;
}
html[data-theme="dark"] .stx #faq .faq-btn,
html.dark .stx #faq .faq-btn,
body.dark .stx #faq .faq-btn,
.dark .stx #faq .faq-btn,
.stx[data-theme="dark"] #faq .faq-btn,
html[data-theme="dark"] .stx #faq .faq-btn span,
html.dark .stx #faq .faq-btn span,
body.dark .stx #faq .faq-btn span,
.dark .stx #faq .faq-btn span,
.stx[data-theme="dark"] #faq .faq-btn span {
  color: #FFFFFF !important;
  font-weight: 600 !important;
}
html[data-theme="dark"] .stx #faq .faq-ans,
html.dark .stx #faq .faq-ans,
body.dark .stx #faq .faq-ans,
.dark .stx #faq .faq-ans,
.stx[data-theme="dark"] #faq .faq-ans {
  color: #CBD5E1 !important;
  line-height: 1.7 !important;
}
html[data-theme="dark"] .stx #faq .faq-icon,
html.dark .stx #faq .faq-icon,
body.dark .stx #faq .faq-icon,
.dark .stx #faq .faq-icon,
.stx[data-theme="dark"] #faq .faq-icon {
  background: rgba(255, 255, 255, 0.12) !important;
  color: #FFFFFF !important;
}
html[data-theme="dark"] .stx #faq .faq-icon.open,
html.dark .stx #faq .faq-icon.open,
body.dark .stx #faq .faq-icon.open,
.dark .stx #faq .faq-icon.open,
.stx[data-theme="dark"] #faq .faq-icon.open {
  background: #37E191 !important;
  color: #0B1A1E !important;
}

@media (max-width: 1024px) {
  .stx .wrap { max-width: 100%; }
  .stx .acc { min-width: min(100%, 280px) !important; }
  .stx #cpa [style*="grid-template-columns: repeat(5"] { grid-template-columns: repeat(3, minmax(0,1fr)) !important; }
  .stx .months-grid { grid-template-columns: repeat(6, minmax(0,1fr)) !important; }
}
@media (max-width: 767px) {
  .stx section { padding: 56px 18px !important; }
  .stx section#top { padding: 0 !important; }
  .stx section#top > .wrap { padding: 54px 18px 64px !important; gap: 34px !important; }
  .stx section#top > div:first-of-type { padding: 22px 18px 0 !important; }
  .stx header .wrap { padding: 14px 18px !important; gap: 14px !important; }
  .stx header nav { width: 100%; gap: 18px !important; flex-wrap: nowrap !important; overflow-x: auto; padding: 4px 0 8px; scrollbar-width: thin; }
  .stx header nav a { flex: 0 0 auto; white-space: nowrap; }
  .stx header .btn { width: 100%; justify-content: center; }
  .stx .wrap { padding-left: 0 !important; padding-right: 0 !important; }
  .stx h1 { font-size: clamp(34px, 9vw, 54px) !important; line-height: 1.06 !important; }
  .stx h2 { font-size: clamp(29px, 7.2vw, 42px) !important; line-height: 1.1 !important; }
  .stx .eyebrow { font-size: 11px !important; letter-spacing: .11em !important; line-height: 1.5 !important; }
  .stx p { font-size: clamp(14px, 3.8vw, 17px); line-height: 1.65 !important; }
  .stx .btn, .stx .dbtn { white-space: normal; line-height: 1.35; }
  .stx .doubt { width: 100%; }
  .stx .doubt .dbtn { width: 100%; }
  .stx .subnav > .wrap { padding: 8px 14px !important; }
  .stx .subnav a { font-size: 12px !important; padding: 9px 11px !important; }
  .stx .months-grid { grid-template-columns: repeat(4, minmax(0,1fr)) !important; }
  .stx #multistate .state-map-grid { gap: 3px !important; }
  .stx #multistate .state-map-grid .tile { min-height: 28px !important; font-size: 9px !important; border-radius: 6px !important; }
  .stx #cpa [style*="grid-template-columns: repeat(5"] { grid-template-columns: 1fr !important; gap: 20px !important; }
  .stx #cpa [style*="top: 36px"] , .stx #cpa [style*="top: 29px"] { display: none !important; }
  .stx #accounting [style*="grid-template-columns: 1fr 96px 96px"] { grid-template-columns: minmax(0,1fr) 64px 64px !important; gap: 5px !important; padding-left: 10px !important; padding-right: 10px !important; font-size: 11px !important; }
  .stx [style*="grid-template-columns: repeat(12"] { grid-template-columns: repeat(4, minmax(0,1fr)) !important; }
  .stx .acc { flex: 1 1 100% !important; min-width: 0 !important; min-height: auto !important; padding: 22px !important; }
  .stx .acc .h { font-size: 18px !important; }
  .stx .card-h { border-radius: 20px !important; }
  .stx [style*="padding: 44px"] { padding: 22px !important; }
  .stx [style*="padding: 40px"] { padding: 22px !important; }
  .stx [style*="padding: 36px"] { padding: 20px !important; }
  .stx [style*="padding: 32px"] { padding: 20px !important; }
  .stx [style*="padding: 30px"] { padding: 20px !important; }
  .stx [style*="padding: 28px"] { padding: 18px !important; }
  .stx [style*="padding: 24px"] { padding: 18px !important; }
  .stx [style*="min-height: 420px"] { min-height: auto !important; }
  .stx .rv { max-width: 100%; }
  .stx .orbit button { min-height: 34px !important; max-width: 94px !important; padding: 4px 7px !important; font-size: 10px !important; white-space: normal !important; line-height: 1.15 !important; }
  .stx .orbit .counter { white-space: normal !important; }
  .stx .hero-pill-fica { left: 0 !important; top: -10px !important; }
  .stx .hero-pill-ot { right: 6px !important; bottom: -14px !important; }
  .stx .stamp { right: 10px !important; bottom: 10px !important; font-size: 10px !important; }
  .stx .perf { background-size: 12px 8px !important; }
  .stx table { display: block; width: 100%; max-width: 100%; overflow-x: auto; }
  .stx .stations-grid { display: flex !important; overflow-x: auto !important; scroll-snap-type: x mandatory; padding: 8px 4px 16px !important; gap: 12px !important; }
  .stx .stations-grid > a { flex: 0 0 138px !important; scroll-snap-align: start; }
  .stx .tile:hover, .stx .card-h:hover { transform: none !important; }
  .stx .rv { animation-range: entry 0% cover 18% !important; }
  /* FAQ: un-stick the left panel on mobile so it doesn't overlap */
  .stx #faq [style*="position: sticky"] { position: relative !important; top: auto !important; }
  /* Also target by z-index approach - make FAQ flex container stack vertically */
  .stx #faq > .wrap { flex-direction: column !important; }
  .stx #faq > .wrap > div:first-child { position: relative !important; top: auto !important; flex: none !important; width: 100% !important; max-width: 100% !important; }
  .stx #faq > .wrap > div:last-child { width: 100% !important; max-width: 100% !important; }
  /* Reduce FAQ section padding on mobile */
  .stx #faq { padding: 56px 18px !important; }
  /* Who-is-it-for cards: on mobile, allow horizontal scroll for the card set */
  .stx #who > .wrap > div[style*="display: flex"] { overflow-x: auto !important; scroll-snap-type: x mandatory !important; padding-bottom: 12px !important; }
  .stx #who > .wrap > div[style*="display: flex"] > div { flex: 0 0 260px !important; scroll-snap-align: start !important; }
  /* fit cards: single column on mobile */
  .stx .fit-cards-grid { grid-template-columns: 1fr !important; }
}
@media (max-width: 420px) {
  .stx section { padding-left: 14px !important; padding-right: 14px !important; }
  .stx section#top > .wrap { padding-left: 14px !important; padding-right: 14px !important; }
  .stx header .wrap { padding-left: 14px !important; padding-right: 14px !important; }
  .stx .btn { width: 100%; justify-content: center; padding-left: 16px !important; padding-right: 16px !important; }
  .stx .months-grid { gap: 4px !important; }
  .stx #multistate [style*="grid-template-columns: repeat(2"] { grid-template-columns: 1fr !important; }
  .stx .doubt { padding: 14px !important; }
  .stx [style*="font-size: 88px"] { font-size: clamp(48px, 16vw, 68px) !important; }
  .stx [style*="font-size: 200px"] { font-size: 120px !important; }
}
@media (min-width: 768px) and (max-width: 1024px) {
  .stx section { padding-left: 24px !important; padding-right: 24px !important; }
  .stx .wrap { padding-left: 0 !important; padding-right: 0 !important; }
  .stx .months-grid { grid-template-columns: repeat(6, minmax(0,1fr)) !important; }
}

@media (prefers-reduced-motion: reduce){*{animation:none !important;transition:none !important}}
`;

// Turns an inline CSS string ("a-b:1px;c:red") into a React style object.
const css = (str) => {
  const o = {};
  String(str).split(';').forEach((decl) => {
    const i = decl.indexOf(':');
    if (i < 0) return;
    const k = decl.slice(0, i).trim();
    const v = decl.slice(i + 1).trim();
    if (!k) return;
    o[k.startsWith('--') ? k : k.replace(/^-webkit-/, 'webkit-').replace(/-([a-z])/g, (_, c) => c.toUpperCase())] = v;
  });
  return o;
};

const INITIAL_STATE = { aud: 0, run: 0, view: 'emp', part: 3, wages: 85000, suta: 27, hours: 46, ytd: 120000, loc: 1, ded: 1, picked: ['CA', 'NY', 'FL'], focus: 'CA', form: 0, rec: false, w2: 0, step: 0, sw: 0, swSel: 0, fit: 0, faqCat: 0, faq: 0, ob: 0, doubt: 0, doubtOpen: false, who: 0, size: 1, sent: false, submitting: false, submitError: "" };

// Derives every value/handler the markup needs from the current state.
function buildVals(s, setState) {
  const fmt = (n) => '$' + Math.round(n).toLocaleString('en-US');
  const fmt2 = (n) => '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const pill = (on, dark) => on
    ? 'min-height:44px;padding:0 20px;border-radius:999px;background:' + (dark ? '#37E191' : '#0B1A1E') + ';color:' + (dark ? '#0B1A1E' : '#FFFFFF')
    : 'min-height:44px;padding:0 20px;border-radius:999px;background:transparent;color:' + (dark ? '#C9D6D8' : '#0B1A1E') + ';box-shadow:inset 0 0 0 1.5px ' + (dark ? 'rgba(255,255,255,0.25)' : '#B8C4C1');

  // HERO
  const AUD = [
    { name: 'US Businesses', text: 'Payroll processing, federal and state payroll tax, benefits deductions, reporting and reconciliation, handled through structured preparation and review so your employees are paid correctly and your books stay consistent.', cta: 'Request a Payroll Consultation' },
    { name: 'CPA Firms', text: 'An experienced offshore payroll team that works inside your firm’s procedures and software, prepares registers, returns and reconciliations, and hands everything to your professionals for review and sign-off.', cta: 'Discuss CPA Payroll Outsourcing' }
  ];
  const audTabs = AUD.map((a, i) => ({ name: a.name, pressed: String(s.aud === i), style: pill(s.aud === i, true), pick: () => setState({ aud: i }) }));
  const RL = [
    { label: 'Regular · 80 hrs × $30.00', amt: '2,400.00', dot: '#0B1A1E', plus: true },
    { label: 'Overtime · 4 hrs × $45.00', amt: '180.00', dot: '#F2B544', plus: true },
    { label: 'Federal income tax (per W-4)', amt: '−236.00', dot: '#2B4ACB' },
    { label: 'Social Security 6.2%', amt: '−154.07', dot: '#2B4ACB' },
    { label: 'Medicare 1.45%', amt: '−36.03', dot: '#2B4ACB' },
    { label: 'State income tax', amt: '−98.40', dot: '#7A5410' },
    { label: '401(k) 5%', amt: '−129.00', dot: '#0E7A49' },
    { label: 'Health premium (Sec. 125)', amt: '−95.00', dot: '#0E7A49' }
  ];
  const NETS = [0, 2400, 2580, 2344, 2189.93, 2153.90, 2055.50, 1926.50, 1831.50];
  const shown = Math.min(s.run, RL.length);
  const runLines = RL.map((l, i) => {
    const on = i < shown;
    return { ...l, color: l.plus ? '#0B1A1E' : '#B23A2E', style: 'display:flex;justify-content:space-between;align-items:center;gap:12px;padding:9px 0;border-bottom:1px dashed #DCE3E1;font-size:14px;' + (on ? 'opacity:1;transform:none' : 'opacity:0.12;transform:translateX(12px)') };
  });
  const runDone = s.run >= 10;
  const runStatus = s.run === 0 ? 'COLLECTING INPUTS' : (s.run <= 8 ? 'CALCULATING' : (s.run === 9 ? 'IN REVIEW' : 'APPROVED'));
  const runChipStyle = 'font-size:11px;font-weight:600;letter-spacing:.08em;padding:6px 10px;border-radius:999px;white-space:nowrap;' + (runDone ? 'background:#DDF7EA;color:#0E7A49' : (s.run === 9 ? 'background:#FDF1D8;color:#7A5410' : 'background:#E4E9FB;color:#1E3699'));

  // ANATOMY
  const PARTS = [
    { name: 'Salary & hourly wages', text: 'Every pay run starts with the right rate. Salaried pay is divided by pay frequency; hourly pay is built from approved timesheets.', svc: 'Payroll Processing & Administration', href: '#processing' },
    { name: 'Regular hours & overtime', text: 'Non-exempt employees earn overtime above 40 hours a week under federal law, and some states add daily rules. Hours and approvals are checked before calculation.', svc: 'Payroll Processing & Administration', href: '#processing' },
    { name: 'Bonuses & commissions', text: 'Supplemental pay changes gross wages and can be withheld differently from regular wages. We process it in the right cycle and record it clearly.', svc: 'Payroll Processing & Administration', href: '#processing' },
    { name: 'Federal income tax withholding', text: 'Withheld from employee wages using the employee’s Form W-4 and the applicable IRS withholding methods. A wrong W-4 setup affects every paycheck that follows.', svc: 'Federal Payroll Tax Management', href: '#federal' },
    { name: 'Social Security & Medicare', text: 'FICA taxes are shared: the employee’s portion is withheld and the employer matches it. Social Security stops at the annual wage base; Additional Medicare starts above $200,000.', svc: 'Federal Payroll Tax Management', href: '#federal' },
    { name: 'Federal & state unemployment', text: 'FUTA and SUTA are employer-paid in most states. Each has its own wage base and rate, and the state credit affects the FUTA you owe.', svc: 'Federal Payroll Tax Management', href: '#federal' },
    { name: 'State & local income tax', text: 'Where the employee actually works decides which state and local taxes apply, even when the company is headquartered somewhere else.', svc: 'State & Local Payroll Tax Management', href: '#state' },
    { name: 'Benefits & retirement deductions', text: 'Health premiums, 401(k), HSA and FSA contributions each have their own tax treatment, which changes the wages different taxes are calculated on.', svc: 'Employee Benefits & Payroll Deductions', href: '#benefits' },
    { name: 'Tax deposits & reporting', text: 'Withheld and employer taxes must be deposited on schedule and reported on quarterly and annual returns that tie back to the payroll register.', svc: 'Payroll Tax Filing & Reporting', href: '#filing' },
    { name: 'Pay statements & W-2s', text: 'Employees receive a statement each pay period and a Form W-2 after year-end. Both must agree with what was actually paid and withheld.', svc: 'Year-End Payroll Processing', href: '#yearend' },
    { name: 'Payroll accounting & reconciliation', text: 'Every cycle creates expenses, liabilities and cash movements. They are posted to the general ledger and reconciled with bank and tax records.', svc: 'Payroll Accounting & Reconciliation', href: '#accounting' }
  ];
  const parts = PARTS.map((p, i) => ({
    n: String(i + 1).padStart(2, '0'), name: p.name, pressed: String(s.part === i), pick: () => setState({ part: i }),
    style: 'display:flex;gap:12px;align-items:center;text-align:left;min-height:56px;padding:10px 16px;border-radius:16px;font-size:15px;' + (s.part === i ? 'background:#0B1A1E;color:#FFFFFF;box-shadow:0 10px 24px rgba(11,26,30,.18)' : 'background:#F1F4F2;color:#0B1A1E;box-shadow:inset 0 0 0 1px #DCE3E1')
  }));
  const cp = PARTS[s.part];
  const isEmp = s.view === 'emp';
  const W = s.wages, SR = s.suta / 10;
  const erSS = 0.062 * Math.min(W, 184500), erMed = 0.0145 * W, futa = 0.006 * Math.min(W, 7000), sutaAmt = SR / 100 * 7000;
  const erTot = erSS + erMed + futa + sutaAmt;
  const mx = Math.max(erSS, erMed, futa, sutaAmt, 1);
  const erBars = [
    { label: 'Social Security (employer 6.2%)', v: erSS, c: '#0E7A49', note: W > 184500 ? 'Wage base reached: no tax on wages above $184,500.' : 'Matches the employee’s 6.2% up to the wage base.' },
    { label: 'Medicare (employer 1.45%)', v: erMed, c: '#2B4ACB', note: 'No wage base. Additional 0.9% Medicare is employee-only.' },
    { label: 'FUTA (0.6% after credit)', v: futa, c: '#F2B544', note: 'First $7,000 of wages; credit reduction states pay more.' },
    { label: 'SUTA (example ' + SR.toFixed(1) + '%)', v: sutaAmt, c: '#7A5410', note: 'Rate and wage base are assigned by each state.' }
  ].map(b => ({ ...b, amt: fmt(b.v), w: (b.v / mx * 100).toFixed(1) + '%' }));

  // STATIONS
  const stations = [['Payroll Processing', '#processing'], ['Federal Payroll Tax', '#federal'], ['State & Local Tax', '#state'], ['Benefits & Deductions', '#benefits'], ['Onboarding & Setup', '#onboarding'], ['Multi-State Payroll', '#multistate'], ['Tax Filing & Reporting', '#filing'], ['Accounting & Reconciliation', '#accounting'], ['Year-End Processing', '#yearend']].map((x, i) => ({ n: '0' + (i + 1), name: x[0], href: x[1] }));

  // PROCESSING
  const procList = ['Weekly, biweekly, semimonthly & monthly runs', 'Hourly and salaried payroll', 'Timesheet & attendance processing', 'Overtime for non-exempt employees', 'Bonus, incentive & commission pay', 'Holiday & paid-leave payments', 'Salary revisions & retro adjustments', 'New hire & termination final pay', 'Gross-to-net calculations', 'Payroll registers & pay statements'];
  const H = s.hours, RATE = 24;
  const reg = Math.min(H, 40) * RATE, ot = Math.max(0, H - 40) * RATE * 1.5;
  const hourBlocks = [];
  for (let i = 0; i < 60; i++) {
    const on = i < H, isOt = i >= 40;
    hourBlocks.push({ h: on ? (isOt ? '100%' : '70%') : '18%', c: on ? (isOt ? '#F2B544' : '#0B1A1E') : '#DCE3E1', o: on ? '1' : '0.7' });
  }

  // FEDERAL
  const Y = s.ytd;
  const ss = 0.062 * Math.min(Y, 184500), med = 0.0145 * Y, add = 0.009 * Math.max(0, Y - 200000), fu = 0.006 * Math.min(Y, 7000);
  const badge = (state) => {
    const m = { on: ['WITHHOLDING', 'background:rgba(55,225,145,.14);color:#37E191'], off: ['CAPPED · STOPPED', 'background:rgba(242,181,68,.16);color:#F2B544'], wait: ['NOT YET', 'background:rgba(255,255,255,.08);color:#A9BBBE'], er: ['EMPLOYER-PAID', 'background:rgba(157,176,255,.16);color:#9DB0FF'] }[state];
    return { badge: m[0], badgeStyle: 'font-size:10px;font-weight:600;letter-spacing:.06em;padding:5px 9px;border-radius:999px;' + m[1] };
  };
  const fedMeters = [
    { code: 'FICA · SS', name: 'Social Security 6.2%', amt: fmt(ss), c: '#37E191', w: (Math.min(Y, 184500) / 184500 * 100).toFixed(1) + '%', note: 'Withheld until year-to-date wages reach $184,500, then stops for the rest of the year.', ...badge(Y >= 184500 ? 'off' : 'on') },
    { code: 'FICA · MEDICARE', name: 'Medicare 1.45%', amt: fmt(med), c: '#9DB0FF', w: (Y / 260000 * 100).toFixed(1) + '%', note: 'Applies to all wages, with no wage base limit.', ...badge('on') },
    { code: 'ADDITIONAL MEDICARE', name: 'Additional Medicare 0.9%', amt: fmt(add), c: '#C7A7FF', w: (Math.max(0, Y - 200000) / 60000 * 100).toFixed(1) + '%', note: 'Employer must withhold once an employee’s wages pass $200,000 in the year. No employer match.', ...badge(Y > 200000 ? 'on' : 'wait') },
    { code: 'FUTA', name: 'Federal unemployment 0.6%', amt: fmt(fu), c: '#F2B544', w: (Math.min(Y, 7000) / 7000 * 100).toFixed(1) + '%', note: 'Employer-paid on the first $7,000 per employee, after the state credit.', ...badge(Y >= 7000 ? 'off' : 'er') }
  ];
  const fedList = ['Form 941 preparation & filing support', 'Form 940 preparation & filing support', 'Federal payroll tax liability calculations', 'Deposit scheduling & reconciliation', 'Employment tax payment documentation', 'Return-to-register reconciliation', 'Discrepancy review & correction support'];

  // STATE & LOCAL
  const LOCS = [
    { name: 'Austin, TX', state: ['No state income tax on wages', 'Texas unemployment tax (employer)', 'New-hire reporting'], local: [], sOn: true, lOn: false },
    { name: 'Los Angeles, CA', state: ['California income tax withholding', 'State Disability Insurance (employee)', 'UI & ETT (employer)', 'New-hire reporting'], local: [], sOn: true, lOn: false },
    { name: 'Philadelphia, PA', state: ['Pennsylvania income tax withholding', 'PA unemployment (employer & employee)', 'New-hire reporting'], local: ['Philadelphia City Wage Tax'], sOn: true, lOn: true },
    { name: 'New York City, NY', state: ['New York State income tax withholding', 'Disability & Paid Family Leave (employee)', 'Unemployment insurance (employer)', 'New-hire reporting'], local: ['NYC resident income tax withholding'], sOn: true, lOn: true }
  ];
  const locs = LOCS.map((l, i) => ({ name: l.name, pressed: String(s.loc === i), style: pill(s.loc === i, false), pick: () => setState({ loc: i }) }));
  const cl = LOCS[s.loc];
  const layer = (on, bg, fg, chipBg) => ({ style: 'border-radius:22px;padding:22px 24px;' + (on ? 'background:' + bg + ';color:' + fg + ';opacity:1' : 'background:#E3E9E6;color:#4A5A5E;opacity:.55'), chip: 'font-size:13px;font-weight:500;padding:8px 12px;border-radius:10px;background:' + (on ? chipBg : 'rgba(255,255,255,.6)') });
  const layers = [
    { tag: 'FEDERAL', status: 'APPLIES EVERYWHERE', items: ['FIT withholding', 'Social Security', 'Medicare', 'FUTA'], ...layer(true, '#0B1A1E', '#FFFFFF', 'rgba(255,255,255,.1)') },
    { tag: 'STATE', status: 'BY WORK LOCATION', items: cl.state, ...layer(cl.sOn, '#37E191', '#0B1A1E', 'rgba(255,255,255,.55)') },
    { tag: 'LOCAL', status: cl.lOn ? 'APPLIES HERE' : 'NONE AT THIS LOCATION', items: cl.lOn ? cl.local : ['No local wage tax'], ...layer(cl.lOn, '#F2B544', '#0B1A1E', 'rgba(255,255,255,.55)') }
  ];
  const stateList = ['State income tax withholding', 'State payroll tax registration coordination', 'SUI / SUTA calculations & wage reporting', 'State withholding return preparation', 'Disability insurance contributions', 'Paid family & medical leave contributions', 'City & county income tax withholding', 'Local tax reporting & reconciliation'];

  // BENEFITS
  const DED = [
    { name: 'Health insurance premium', tag: 'SECTION 125', fit: 1, fica: 1, text: 'Premiums paid through a cafeteria plan generally come out before both federal income tax and Social Security and Medicare are calculated.' },
    { name: 'Traditional 401(k)', tag: 'PRE-TAX FIT', fit: 1, fica: 0, text: 'Reduces wages for federal income tax, but Social Security and Medicare are still calculated on the full amount. This is why W-2 Box 1 is often lower than Box 3.' },
    { name: 'Roth 401(k)', tag: 'AFTER-TAX', fit: 0, fica: 0, text: 'Taken after all taxes are calculated. It reduces take-home pay but not taxable wages; the employer match is recorded separately.' },
    { name: 'HSA (through payroll)', tag: 'SECTION 125', fit: 1, fica: 1, text: 'Employee HSA contributions made through a cafeteria plan generally reduce both income-tax and FICA wages, subject to eligibility and annual limits.' },
    { name: 'Health or dependent-care FSA', tag: 'SECTION 125', fit: 1, fica: 1, text: 'Eligible FSA elections come out before income tax and FICA, according to the plan arrangement.' },
    { name: 'Dental & vision', tag: 'SECTION 125', fit: 1, fica: 1, text: 'When offered through the cafeteria plan, these premiums are treated like health premiums. If not, they are after-tax.' },
    { name: 'Child support & garnishments', tag: 'AFTER-TAX', fit: 0, fica: 0, text: 'Court-ordered and legally required deductions are taken from pay after taxes, following the withholding order and federal and state limits.' },
    { name: 'Other authorised deductions', tag: 'VARIES', fit: 0, fica: 0, text: 'Loan repayments, union dues and similar items are usually after-tax. Each is set up according to the client’s payroll arrangements.' }
  ];
  const deds = DED.map((d, i) => ({
    name: d.name, tag: d.tag, pressed: String(s.ded === i), pick: () => setState({ ded: i }),
    style: 'display:flex;justify-content:space-between;align-items:center;gap:12px;min-height:56px;padding:0 20px;border-radius:16px;font-size:15px;' + (s.ded === i ? 'background:#0B1A1E;color:#FFFFFF' : 'background:#F1F4F2;color:#0B1A1E;box-shadow:inset 0 0 0 1px #DCE3E1')
  }));
  const cd = DED[s.ded];

  // ONBOARDING
  const OBF = [['Legal name', 'Jordan A. Rivera'], ['SSN', '•••-••-4821'], ['Form W-4', 'Single · Step 4(c) $0'], ['Form I-9', 'Coordinated with employer'], ['Work location', 'Denver, CO'], ['State certificate', 'Colorado DR 0004'], ['Pay rate & frequency', '$68,000 · Biweekly'], ['Direct deposit', 'Account ••••5520'], ['Benefits & deductions', 'Medical · 401(k) 5%']];
  const obN = Math.min(s.ob, OBF.length);
  const obFields = OBF.map((f, i) => {
    const on = i < obN, cur = i === obN;
    return { k: f[0], v: on ? f[1] + '  ✓' : (cur ? 'verifying…' : '—'), c: on ? '#37E191' : '#A9BBBE', style: 'display:flex;justify-content:space-between;gap:12px;padding:10px 14px;border-radius:12px;' + (on ? 'background:rgba(55,225,145,.08)' : (cur ? 'background:rgba(255,255,255,.08);box-shadow:inset 0 0 0 1px rgba(55,225,145,.5)' : 'background:rgba(255,255,255,.03)')) };
  });
  const obList = ['Employee master data setup', 'W-4 collection & configuration', 'I-9 process coordination', 'State withholding certificates', 'Salary & hourly rate configuration', 'Work location & state setup', 'Direct deposit recording', 'New-hire reporting coordination'];

  // MULTI-STATE MAP
  const T = [['AK', 0, 0], ['ME', 10, 0], ['WI', 5, 1], ['VT', 9, 1], ['NH', 10, 1], ['WA', 0, 2], ['ID', 1, 2], ['MT', 2, 2], ['ND', 3, 2], ['MN', 4, 2], ['IL', 5, 2], ['MI', 6, 2], ['NY', 8, 2], ['MA', 9, 2], ['OR', 0, 3], ['NV', 1, 3], ['WY', 2, 3], ['SD', 3, 3], ['IA', 4, 3], ['IN', 5, 3], ['OH', 6, 3], ['PA', 7, 3], ['NJ', 8, 3], ['CT', 9, 3], ['RI', 10, 3], ['CA', 0, 4], ['UT', 1, 4], ['CO', 2, 4], ['NE', 3, 4], ['MO', 4, 4], ['KY', 5, 4], ['WV', 6, 4], ['VA', 7, 4], ['MD', 8, 4], ['DE', 9, 4], ['AZ', 1, 5], ['NM', 2, 5], ['KS', 3, 5], ['AR', 4, 5], ['TN', 5, 5], ['NC', 6, 5], ['SC', 7, 5], ['DC', 8, 5], ['OK', 3, 6], ['LA', 4, 6], ['MS', 5, 6], ['AL', 6, 6], ['GA', 7, 6], ['HI', 0, 7], ['TX', 3, 7], ['FL', 8, 7]];
  const NAMES = { AK: 'Alaska', ME: 'Maine', WI: 'Wisconsin', VT: 'Vermont', NH: 'New Hampshire', WA: 'Washington', ID: 'Idaho', MT: 'Montana', ND: 'North Dakota', MN: 'Minnesota', IL: 'Illinois', MI: 'Michigan', NY: 'New York', MA: 'Massachusetts', OR: 'Oregon', NV: 'Nevada', WY: 'Wyoming', SD: 'South Dakota', IA: 'Iowa', IN: 'Indiana', OH: 'Ohio', PA: 'Pennsylvania', NJ: 'New Jersey', CT: 'Connecticut', RI: 'Rhode Island', CA: 'California', UT: 'Utah', CO: 'Colorado', NE: 'Nebraska', MO: 'Missouri', KY: 'Kentucky', WV: 'West Virginia', VA: 'Virginia', MD: 'Maryland', DE: 'Delaware', AZ: 'Arizona', NM: 'New Mexico', KS: 'Kansas', AR: 'Arkansas', TN: 'Tennessee', NC: 'North Carolina', SC: 'South Carolina', DC: 'District of Columbia', OK: 'Oklahoma', LA: 'Louisiana', MS: 'Mississippi', AL: 'Alabama', GA: 'Georgia', HI: 'Hawaii', TX: 'Texas', FL: 'Florida' };
  const NOTAX = ['AK', 'FL', 'NV', 'NH', 'SD', 'TN', 'TX', 'WA', 'WY'];
  const LOCAL = ['PA', 'OH', 'KY', 'IN', 'MD', 'MI', 'MO', 'NY'];
  const toggle = (c) => setState(st => {
    if (c === 'TX') return { focus: 'TX' };
    const has = st.picked.indexOf(c) >= 0;
    return { picked: has ? st.picked.filter(x => x !== c) : st.picked.concat([c]), focus: c };
  });
  const tiles = T.map(([c, x, y]) => {
    const hq = c === 'TX', on = s.picked.indexOf(c) >= 0, nt = NOTAX.indexOf(c) >= 0, f = s.focus === c;
    const bg = hq ? '#F2B544' : (on ? '#37E191' : (nt ? '#1B3338' : '#203A40'));
    const fg = hq || on ? '#0B1A1E' : '#C9D6D8';
    return {
      code: c, pressed: String(on || hq), aria: NAMES[c] + (hq ? ', headquarters' : (on ? ', remote employee added' : '')), pick: () => toggle(c),
      style: 'grid-column:' + (x + 1) + ';grid-row:' + (y + 1) + ';aspect-ratio:1/1;min-height:36px;border-radius:9px;font-size:12px;font-weight:600;padding:0;background:' + bg + ';color:' + fg + ';' + (nt && !on && !hq ? 'box-shadow:inset 0 0 0 1.5px #5E7A80;' : '') + (f ? 'outline:2.5px solid #FFFFFF;outline-offset:2px;' : '')
    };
  });
  const all = ['TX'].concat(s.picked);
  const withholdCount = all.filter(c => NOTAX.indexOf(c) < 0).length;
  const fc = s.focus;
  const focusRows = [
    { k: 'State income tax withholding', v: NOTAX.indexOf(fc) >= 0 ? 'None on wages' : 'Required' },
    { k: 'State unemployment insurance', v: 'Register & report' },
    { k: 'Local income taxes', v: LOCAL.indexOf(fc) >= 0 ? 'In some localities' : 'Generally none' },
    { k: 'New-hire reporting', v: 'Required' }
  ];

  // FILING
  const MON = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  const FORMS = [
    { code: '941', freq: 'QUARTERLY', name: 'Employer’s Quarterly Federal Tax Return', m: [0, 3, 6, 9], due: { 0: 'JAN 31', 3: 'APR 30', 6: 'JUL 31', 9: 'OCT 31' }, note: 'Form 941 reports federal income tax withheld and Social Security and Medicare taxes each quarter. It is due by the last day of the month after the quarter ends, and we reconcile it to deposits and the register first.' },
    { code: '940', freq: 'ANNUAL', name: 'Employer’s Annual FUTA Tax Return', m: [0], due: { 0: 'JAN 31' }, note: 'Form 940 reports FUTA wages, tax and the state unemployment credit for the prior year. It is generally due January 31.' },
    { code: 'W-2 / W-3', freq: 'ANNUAL', name: 'Wage & Tax Statements and Transmittal', m: [0], due: { 0: 'JAN 31' }, note: 'W-2s go to employees and, with the W-3 transmittal, to the Social Security Administration, generally by January 31. Totals must agree with the four quarterly 941s.' },
    { code: '1099-NEC', freq: 'ANNUAL', name: 'Nonemployee Compensation', m: [0], due: { 0: 'JAN 31' }, note: 'Reports qualifying payments to independent contractors. Generally due to recipients and the IRS by January 31.' },
    { code: '944', freq: 'ANNUAL', name: 'Annual Federal Tax Return (if IRS-designated)', m: [0], due: { 0: 'JAN 31' }, note: 'Small employers notified by the IRS file Form 944 annually instead of quarterly 941s.' },
    { code: '941-X', freq: 'AS NEEDED', name: 'Corrections to a previously filed 941', m: [], due: {}, note: 'Used to correct qualifying errors on a filed Form 941. We help identify the discrepancy and prepare the supporting reconciliation.' },
    { code: '1094-C / 1095-C', freq: 'ANNUAL', name: 'ACA reporting for applicable large employers', m: [], due: {}, note: 'Applicable large employers report health coverage offers. We coordinate the payroll and benefits data behind these forms where applicable.' }
  ];
  const cf = FORMS[s.form];
  const monthCells = MON.map((m, i) => {
    const on = cf.m.indexOf(i) >= 0;
    return { m, due: on ? cf.due[i] : '', style: 'border-radius:12px;padding:12px 6px;text-align:center;' + (on ? 'background:#0B1A1E;color:#37E191;transform:translateY(-6px)' : 'background:#F1F4F2;color:#4A5A5E') };
  });
  const forms = FORMS.map((f, i) => ({
    code: f.code, freq: f.freq, name: f.name, pressed: String(s.form === i), pick: () => setState({ form: i }),
    style: 'display:flex;flex-direction:column;padding:18px 20px;border-radius:18px;min-height:110px;' + (s.form === i ? 'background:#37E191;color:#0B1A1E' : 'background:#FFFFFF;color:#0B1A1E;box-shadow:inset 0 0 0 1.5px #DCE3E1')
  }));
  const stateForms = ['State withholding returns', 'State unemployment insurance returns', 'State wage reporting', 'Local payroll tax returns', 'Annual state payroll statements', 'Jurisdiction-specific filings'];

  // ACCOUNTING
  const JE = [['Wages & salaries expense', '50,000', ''], ['Employer payroll tax expense', '3,825', ''], ['Federal income tax withheld', '', '5,500'], ['Social Security payable (EE + ER)', '', '6,200'], ['Medicare payable (EE + ER)', '', '1,450'], ['Cash · net payroll', '', '40,675']];
  const jeRows = JE.map((r, i) => ({ acct: r[0], dr: r[1], cr: r[2], style: 'display:grid;grid-template-columns:1fr 96px 96px;gap:8px;padding:12px 16px;font-size:14px;border-top:1px solid rgba(255,255,255,.06);' + (s.rec ? 'background:rgba(55,225,145,.06)' : '') }));
  const RC = [['Payroll register', '$53,825'], ['General ledger', '$53,825'], ['Bank & tax payments', '$53,825']];
  const recCols = RC.map((c, i) => ({ k: c[0], v: s.rec ? c[1] + ' ✓' : 'Pending', style: 'border-radius:14px;padding:12px 14px;transition-delay:' + (i * 0.15) + 's;' + (s.rec ? 'background:#37E191;color:#0B1A1E' : 'background:#12262B;color:#C9D6D8') }));
  const acctList = ['Wage & salary expense recording', 'Employer payroll tax expense', 'Withholding & tax liabilities', 'Benefit & retirement accounting', 'Payroll journal entries', 'General ledger posting support', 'Payroll bank reconciliation', 'Tax liability reconciliation', 'Department expense allocation', 'Month-end & year-end reconciliation'];

  // W-2
  const W2 = [
    { box: 'BOX 1', label: 'Wages, tips, other comp.', val: '68,400.00', why: 'Gross salary of $72,000 minus the $3,600 traditional 401(k) deferral. Pre-tax retirement contributions lower income-tax wages, so Box 1 is smaller than Box 3.' },
    { box: 'BOX 2', label: 'Federal income tax withheld', val: '6,840.00', why: 'The total federal income tax withheld across every pay run in the year, based on the employee’s Form W-4. Sample amount.' },
    { box: 'BOX 3', label: 'Social Security wages', val: '72,000.00', why: 'Traditional 401(k) deferrals do not reduce Social Security wages, so the full salary appears here, up to the $184,500 wage base.' },
    { box: 'BOX 4', label: 'Social Security tax withheld', val: '4,464.00', why: '6.2% of Box 3. We check that it never exceeds 6.2% of the wage base for the year.' },
    { box: 'BOX 5', label: 'Medicare wages', val: '72,000.00', why: 'Medicare wages have no cap. Additional Medicare applies only above $200,000.' },
    { box: 'BOX 6', label: 'Medicare tax withheld', val: '1,044.00', why: '1.45% of Box 5. Year-end review confirms the rate was applied on every pay run.' },
    { box: 'BOX 12 · D', label: 'Elective 401(k) deferrals', val: '3,600.00', why: 'Code D reports traditional 401(k) deferrals: here, 5% of salary. This is the difference between Box 1 and Box 3.' },
    { box: 'BOX 16–17', label: 'State wages & tax', val: 'Per state', why: 'State wages and withholding are reported for each state where the employee worked, which matters for multi-state and remote employees.' }
  ];
  const w2Boxes = W2.map((b, i) => ({
    box: b.box, label: b.label, val: b.val, pressed: String(s.w2 === i), pick: () => setState({ w2: i }),
    style: 'display:flex;flex-direction:column;padding:14px 16px;border-radius:10px;min-height:84px;' + (s.w2 === i ? 'background:#0B1A1E;color:#FFFFFF' : 'background:#F7F9F8;color:#0B1A1E;box-shadow:inset 0 0 0 1px #B8C4C1')
  }));
  const cw = W2[s.w2];
  const yeList = ['Annual register review', 'Wage & withholding reconciliation', 'Social Security wage base review', 'Medicare & Additional Medicare review', 'FUTA reporting support', 'W-2 & W-3 preparation support', 'Contractor 1099 reporting', 'Benefit reporting information', 'ACA reporting coordination', 'Liability reconciliation', 'Year-end journal entries', 'Discrepancy correction support'];

  // PROCESS
  const ST = [
    { short: 'UNDERSTAND', title: 'Understand your payroll requirements', text: 'We learn your business, employee types, work locations, pay frequency, software, benefits and current accounting procedures.', tags: ['Workforce mix', 'Work locations', 'Existing software', 'Reporting duties'] },
    { short: 'COLLECT', title: 'Collect and verify payroll information', text: 'Timesheets, salary changes, bonuses, commissions and approved deductions are collected. Missing items and discrepancies are raised before processing.', tags: ['Timesheets', 'Approvals', 'Changes', 'Exceptions'] },
    { short: 'CALCULATE', title: 'Calculate earnings and deductions', text: 'Gross pay, overtime, bonuses, commissions, withholding and benefit deductions are calculated. Employer payroll taxes are calculated separately.', tags: ['Gross-to-net', 'Withholding', 'Employer taxes'] },
    { short: 'REVIEW', title: 'Prepare payroll reports for review', text: 'Registers, summaries and tax liability reports are prepared and checked against supporting records and approved inputs by a separate reviewer.', tags: ['Payroll register', 'Tax liabilities', 'Reviewer check'] },
    { short: 'FINALISE', title: 'Finalise payroll and coordinate payments', text: 'After review and your approval, payroll is finalised. Salary disbursement and tax deposits are coordinated under the agreed responsibilities.', tags: ['Client approval', 'Disbursement', 'Deposits'] },
    { short: 'RECONCILE', title: 'Manage reporting and reconciliation', text: 'Returns are prepared and payroll data is reconciled to accounting records, tax liabilities and payment confirmations.', tags: ['Returns', 'GL tie-out', 'Bank tie-out'] },
    { short: 'RECORDS', title: 'Maintain payroll records', text: 'Registers, supporting documents, filing information and reconciliations are kept under agreed recordkeeping procedures and retention requirements.', tags: ['Working papers', 'Audit trail', 'Retention'] }
  ];
  const steps = ST.map((x, i) => ({ ...x, n: String(i + 1).padStart(2, '0') }));
  const stepBars = ST.map((x, i) => ({ short: x.short, label: 'Step ' + (i + 1) + ': ' + x.title, pressed: String(s.step === i), pick: () => setState({ step: i }), bg: i <= s.step ? '#37E191' : 'rgba(255,255,255,.14)', c: i === s.step ? '#37E191' : '#A9BBBE' }));

  // SOFTWARE
  const SW = [
    { name: 'QuickBooks', g: 1, use: 'Bookkeeping, payroll-related accounting entries, financial reporting and general ledger workflows, depending on the product and client setup.' },
    { name: 'Drake Tax', g: 2, use: 'US tax preparation workflows and related tax reporting activities.' },
    { name: 'Intuit ProConnect', g: 2, use: 'Professional tax preparation and tax-related workflows.' },
    { name: 'UltraTax CS', g: 2, use: 'Thomson Reuters’ professional tax preparation platform used by accounting and tax firms.' },
    { name: 'CCH ProSystem fx', g: 2, use: 'Professional tax and accounting environment used by accounting firms.' },
    { name: 'Intuit ProSeries', g: 2, use: 'Individual and business tax preparation workflows.' }
  ];
  const FIL = ['All platforms', 'Payroll accounting & GL', 'Tax preparation & reporting'];
  const swFilters = FIL.map((f, i) => ({ name: f, pressed: String(s.sw === i), style: pill(s.sw === i, false), pick: () => setState({ sw: i, swSel: i === 2 ? 1 : 0 }) }));
  const swNodes = SW.map((x, i) => {
    const a = (i / 6) * Math.PI * 2 - Math.PI / 2;
    const left = 50 + 42 * Math.cos(a), top = 50 + 42 * Math.sin(a);
    const match = s.sw === 0 || x.g === s.sw, sel = s.swSel === i;
    return {
      name: x.name, pressed: String(sel), pick: () => setState({ swSel: i }),
      style: 'position:absolute;left:' + left.toFixed(2) + '%;top:' + top.toFixed(2) + '%;transform:translate(-50%,-50%);min-height:48px;padding:0 16px;border-radius:14px;font:700 14px Manrope,sans-serif;white-space:nowrap;transition:all .35s;' + (sel ? 'background:#37E191;color:#0B1A1E;box-shadow:0 12px 30px rgba(55,225,145,.35)' : (match ? 'background:#FFFFFF;color:#0B1A1E;box-shadow:0 8px 24px rgba(11,26,30,.1),inset 0 0 0 1px #DCE3E1' : 'background:#E3E9E6;color:#4A5A5E;opacity:.45'))
    };
  });
  const csw = SW[s.swSel];

  // CPA
  const FL = [['Your firm', 'Shares client data & procedures'], ['STE preparer', 'Processes payroll & workpapers'], ['STE reviewer', 'Checks figures & documentation'], ['Your CPA', 'Reviews, judges & signs off'], ['Your client', 'Receives your firm’s work']];
  const flow = FL.map((f, i) => ({ n: String(i + 1), who: f[0], what: f[1], style: 'width:72px;height:72px;margin:0 auto;border-radius:22px;display:grid;place-items:center;font-size:24px;font-weight:800;' + (i === 0 || i >= 3 ? 'background:#FFFFFF;color:#0B1A1E' : 'background:#37E191;color:#0B1A1E') }));
  const cpaList = ['Recurring client payroll processing', 'Salary & wage calculations', 'Hourly & overtime payroll', 'Federal payroll tax calculations', 'State & local withholding support', 'FUTA & SUTA calculations', 'Payroll register preparation', 'Payroll tax return preparation', 'Form 941 & 940 support', 'W-2 & W-3 preparation support', 'Benefit deduction processing', 'Payroll journal entries', 'Payroll reconciliation', 'Year-end payroll support', 'Documentation & working papers'];
  const cpaExpect = ['Work to your client-specific procedures', 'Organised data & supporting documents', 'Consistent reporting formats', 'Defined review & approval stages', 'A single designated contact', 'Support for recurring schedules', 'Confidential handling of client data', 'Delivery within agreed scope & deadlines'];

  // FIT ACCORDION
  const FIT = [
    { name: 'Small & growing businesses', text: 'Regular payroll calculations, deductions, payroll reports and accounting records, without building an in-house payroll function.', cta: 'Start with a payroll review', href: '#consult' },
    { name: 'Hourly & salaried teams', text: 'Attendance, working hours, overtime, salary processing and employee deductions handled each cycle with review before release.', cta: 'See payroll processing', href: '#processing' },
    { name: 'Multi-state employers', text: 'Work-location records, state withholding, unemployment tax and reporting for employees spread across jurisdictions.', cta: 'See multi-state payroll', href: '#multistate' },
    { name: 'CPA firms', text: 'Recurring payroll processing, tax reporting preparation, payroll accounting and reconciliation inside your firm’s existing workflow.', cta: 'See CPA outsourcing', href: '#cpa' },
    { name: 'Accounting & bookkeeping practices', text: 'Payroll accounting entries, liability reconciliation, wage reporting and year-end payroll support for your client base.', cta: 'See reconciliation', href: '#accounting' }
  ];
  const fits = FIT.map((f, i) => {
    const open = s.fit === i;
    return {
      ...f, n: '0' + (i + 1), open, expanded: String(open), pick: () => setState({ fit: i }),
      style: 'flex:' + (open ? '3.2' : '1') + ' 1 200px;min-width:0;min-height:420px;border-radius:28px;padding:28px;display:flex;flex-direction:column;' + (open ? 'background:#0B1A1E;color:#FFFFFF' : (i % 2 ? 'background:#FFFFFF;color:#0B1A1E;box-shadow:inset 0 0 0 1px #DCE3E1' : 'background:#E3E9E6;color:#0B1A1E'))
    };
  });

  // FAQ
  const FQ = [
    { c: 1, q: 'What is included in USA payroll management?', a: 'Salary and wage calculations, overtime, bonuses, payroll deductions, federal and state tax withholding, employer payroll taxes, employee payments, payroll reporting and accounting reconciliation. The exact scope depends on your workforce, locations and arrangements.' },
    { c: 1, q: 'What is the difference between payroll processing and payroll management?', a: 'Processing calculates earnings, deductions and net pay for a pay period. Management covers the wider responsibility: employee setup, tax calculations, compliance reporting, benefit deductions, payment coordination, reconciliations and year-end reporting.' },
    { c: 2, q: 'What payroll taxes do US employers need to manage?', a: 'Generally federal income tax withholding, Social Security, Medicare, FUTA and state unemployment taxes. Depending on location, state and local income taxes, disability insurance and paid family leave contributions may also apply.' },
    { c: 2, q: 'What is the difference between FUTA and SUTA?', a: 'FUTA is the federal unemployment tax under the Federal Unemployment Tax Act. SUTA, often called State Unemployment Insurance (SUI), is administered by each state. FUTA is employer-paid; SUTA is generally an employer contribution, with state-specific exceptions.' },
    { c: 2, q: 'What is Form 941?', a: 'The Employer’s Quarterly Federal Tax Return. It reports federal income tax withheld, Social Security and Medicare wages and taxes, and applicable adjustments.' },
    { c: 2, q: 'What is Form 940?', a: 'The Employer’s Annual Federal Unemployment Tax Return. It reports FUTA wages, the tax due and available state unemployment tax credits.' },
    { c: 2, q: 'What is the difference between Form W-2 and Form 1099-NEC?', a: 'A W-2 reports wages and withholding for employees. A 1099-NEC reports qualifying nonemployee compensation paid to independent contractors. The right form depends on the actual working relationship.' },
    { c: 1, q: 'How frequently should US payroll be processed?', a: 'Common schedules are weekly, biweekly, semimonthly and monthly. The right one depends on your business, employee arrangements and applicable state payday laws.' },
    { c: 1, q: 'Can payroll be outsourced for employees in different states?', a: 'Yes. The provider must account for each employee’s state and local requirements, including withholding, unemployment insurance, registration and jurisdiction-specific reporting.' },
    { c: 3, q: 'Can Smart Tax Expertss support CPA firms with payroll outsourcing?', a: 'Yes. Depending on the engagement, we prepare payroll calculations, tax reporting, registers, accounting entries and reconciliations within your firm’s procedures and review.' },
    { c: 3, q: 'Which payroll and accounting software do you work with?', a: 'Drake, Intuit ProConnect, Thomson Reuters UltraTax CS, QuickBooks, CCH ProSystem fx and Intuit ProSeries, depending on the client’s software environment and engagement requirements.' },
    { c: 3, q: 'Does payroll outsourcing include payroll tax filing?', a: 'It can. This may include preparing federal and state payroll returns, coordinating filing and maintaining documentation. Filing is performed subject to the required authorizations and agreed responsibilities.' },
    { c: 3, q: 'What information is required to start?', a: 'Typically business registration and tax details, employee details, W-4 information, compensation records, pay frequency, work locations, attendance data, benefits information and previous payroll records.' },
    { c: 3, q: 'Can payroll outsourcing include bookkeeping and reconciliation?', a: 'Yes. We can record salary expense, employer taxes, withholding liabilities, benefit contributions and payroll payments, and reconcile payroll accounts with the general ledger.' },
    { c: 3, q: 'How do you maintain payroll accuracy?', a: 'We work from verified client information, review inputs, follow established calculation procedures, prepare registers and include review stages before finalisation. Accuracy also depends on complete, timely information and approvals from the client.' },
    { c: 1, q: 'Is payroll outsourcing suitable for small businesses?', a: 'Yes. Small businesses can outsource recurring payroll instead of managing every calculation and filing in-house. Scope depends on employee count, pay frequency and tax obligations.' }
  ];
  const CATS = ['All', 'Payroll basics', 'Taxes & forms', 'Working with us'];
  const faqCats = CATS.map((c, i) => ({ name: c, pressed: String(s.faqCat === i), style: pill(s.faqCat === i, false), pick: () => setState({ faqCat: i, faq: -1 }) }));
  const faqs = FQ.map((f, i) => ({ ...f, i })).filter(f => s.faqCat === 0 || f.c === s.faqCat).map(f => {
    const open = s.faq === f.i;
    return {
      q: f.q, a: f.a, open, expanded: String(open), toggle: () => setState({ faq: open ? -1 : f.i }),
      iconStyle: 'flex:none;width:36px;height:36px;border-radius:50%;display:grid;place-items:center;font-size:22px;transition:transform .3s,background .3s;'
    };
  });

  // DOUBT ROTATOR
  const DB = [
    ['Will my employees be paid correctly every cycle?', 'Every pay run is prepared, then checked by a separate reviewer against approved inputs before you approve it.'],
    ['Do I lose control of payroll if I outsource it?', 'No. Payroll is finalised only after your approval, and payments follow the responsibilities you authorise.'],
    ['Can you handle employees in more than one state?', 'Yes. Each employee’s work location sets the state and local withholding, unemployment and reporting we apply.'],
    ['What if my payroll records are already messy?', 'We start by reconciling registers, the general ledger and tax filings, and flag discrepancies before the next cycle.'],
    ['How do I know my payroll data is safe?', 'We work with controlled access and secure information exchange, and mask sensitive identifiers in working files.'],
    ['We are a CPA firm. Will you work in our software?', 'Yes, within your firm’s procedures, using the platforms and permissions your engagement provides.']
  ];
  const cdb = DB[s.doubt];
  const doubtDots = DB.map((d, i) => ({ label: 'Show doubt ' + (i + 1), pick: () => setState({ doubt: i, doubtOpen: false }), style: 'width:' + (s.doubt === i ? '34px' : '12px') + ';height:12px;min-height:12px;border-radius:6px;padding:0;background:' + (s.doubt === i ? '#37E191' : 'rgba(255,255,255,.25)') }));
  const doubtBtnStyle = 'margin-top:20px;min-height:52px;padding:14px 22px;border-radius:18px;font-size:16px;line-height:1.5;text-align:left;width:100%;transition:all .35s;' + (s.doubtOpen ? 'background:#37E191;color:#0B1A1E' : 'background:transparent;color:#FFFFFF;box-shadow:inset 0 0 0 1.5px rgba(55,225,145,.6)');

  const chip = (on) => 'min-height:44px;padding:0 16px;border-radius:999px;font-size:14px;' + (on ? 'background:#0B1A1E;color:#FFFFFF' : 'background:#FFFFFF;color:#0B1A1E;box-shadow:inset 0 0 0 1.5px #B8C4C1');
  const whoChips = ['US business', 'CPA firm', 'Accounting practice'].map((n, i) => ({ name: n, pressed: String(s.who === i), style: chip(s.who === i), pick: () => setState({ who: i }) }));
  const sizeChips = ['1–10', '11–50', '51–200', '200+'].map((n, i) => ({ name: n, pressed: String(s.size === i), style: chip(s.size === i), pick: () => setState({ size: i }) }));

  const related = [
    { tag: 'SERVICE', name: 'USA Tax Preparation', text: 'Individual and business returns prepared with organised workpapers.', href: '/usa-tax-preparation-services/' },
    { tag: 'SERVICE', name: 'Bookkeeping & Accounting', text: 'Clean books that payroll entries post into every month.', href: '/bookkeeping-services-usa/' },
    { tag: 'SERVICE', name: 'Tax Planning & Advisory', text: 'Owner compensation and estimated payments, planned ahead.', href: '/tax-planning-services/' },
    { tag: 'SERVICE', name: 'US Tax Filing', text: 'Extensions, amended returns and e-filing coordination.', href: '/us-tax-filing-services/' },
    { tag: 'OUTSOURCING', name: 'CPA Outsourcing', text: 'Extra preparation and review capacity for accounting firms.', href: '/cpa-outsourcing-services/' },
    { tag: 'SERVICE', name: 'AP & AR Outsourcing', text: 'Clear visibility of what you owe and what you are owed.', href: '/accounts-payable-receivable-outsourcing/' }
  ];
  const sw = SW.map(x => x.name);

  return {
    audTabs, heroText: AUD[s.aud].text, heroCta: AUD[s.aud].cta,
    runLines, runPct: (shown / RL.length * 100).toFixed(0) + '%', netShown: shown === 0 ? '—' : fmt2(NETS[shown]), runDone, runStatus, runChipStyle,
    softwareLoop: sw.concat(sw),
    isEmp, isEr: !isEmp, empPressed: String(isEmp), erPressed: String(!isEmp), empTabStyle: pill(isEmp, false), erTabStyle: pill(!isEmp, false),
    showEmp: () => setState({ view: 'emp' }), showEr: () => setState({ view: 'er' }),
    parts, partN: String(s.part + 1).padStart(2, '0'), partName: cp.name, partText: cp.text, partSvc: cp.svc, partHref: cp.href,
    wages: W, wagesFmt: fmt(W), onWages: (e) => setState({ wages: Number(e.target.value) }),
    suta: s.suta, sutaFmt: SR.toFixed(1) + '%', onSuta: (e) => setState({ suta: Number(e.target.value) }),
    erBars, erTotalFmt: fmt(erTot), erCostFmt: fmt(W + erTot),
    stations,
    procList, hours: H, onHours: (e) => setState({ hours: Number(e.target.value) }), hourBlocks, regPay: fmt2(reg), otPay: fmt2(ot), grossPay: fmt2(reg + ot),
    ytd: Y, ytdFmt: fmt(Y), onYtd: (e) => setState({ ytd: Number(e.target.value) }), fedMeters, fedList,
    locs, layers, stateList,
    deds, dedName: cd.name, dedText: cd.text, fitH: cd.fit ? '100%' : '0%', ficaH: cd.fica ? '100%' : '0%', fitLabel: cd.fit ? '−$100' : '$0', ficaLabel: cd.fica ? '−$100' : '$0',
    obFields, obPct: Math.round(obN / OBF.length * 100) + '%', obList,
    tiles, stateCount: String(all.length), withholdCount: String(withholdCount), focusTag: fc === 'TX' ? 'HEADQUARTERS' : (s.picked.indexOf(fc) >= 0 ? 'REMOTE EMPLOYEE ADDED' : 'REMOVED FROM PAYROLL'), focusName: NAMES[fc], focusRows,
    resetMap: () => setState({ picked: [], focus: 'TX' }),
    monthCells, forms, formNote: cf.note, stateForms,
    jeRows, recCols, reconcile: () => setState(st => ({ rec: !st.rec })), recLabel: s.rec ? 'Reconciled ✓' : 'Run reconciliation', recBtnStyle: 'min-height:44px;padding:0 20px;border-radius:999px;' + (s.rec ? 'background:#37E191;color:#0B1A1E' : 'background:transparent;color:#FFFFFF;box-shadow:inset 0 0 0 1.5px #37E191'), acctList,
    w2Boxes, w2Tag: cw.box, w2Title: cw.label, w2Why: cw.why, yeList,
    steps, stepBars, stepX: (-100 * s.step) + '%',
    prevStep: () => setState(st => ({ step: (st.step + 6) % 7 })), nextStep: () => setState(st => ({ step: (st.step + 1) % 7 })),
    swFilters, swNodes, swName: csw.name, swUse: csw.use,
    flow, cpaList, cpaExpect,
    fits,
    faqCats, faqs,
    doubtN: String(s.doubt + 1), doubtTotal: String(DB.length), doubtQ: cdb[0], doubtBtn: s.doubtOpen ? cdb[1] : 'Show the answer  →', doubtOpenStr: String(s.doubtOpen), doubtBtnStyle, doubtDots,
    revealDoubt: () => setState(st => ({ doubtOpen: !st.doubtOpen })),
    whoChips, sizeChips,
    related,
    notSent: !s.sent, sent: s.sent,
    submitting: s.submitting, submitError: s.submitError,
    onSubmit: async (e) => {
      e.preventDefault();
      if (s.submitting) return;
      const form = e.target;
      const nameInput = form.querySelector('input[type="text"][required]');
      const emailInput = form.querySelector('input[type="email"][required]');
      const statesInput = form.querySelector('input[placeholder*="Texas"]');
      const msgInput = form.querySelector('textarea');

      const name = (nameInput && nameInput.value || "").trim();
      const email = (emailInput && emailInput.value || "").trim();
      const states = (statesInput && statesInput.value || "").trim();
      const msg = (msgInput && msgInput.value || "").trim();

      if (!name) {
        setState({ submitError: "Please enter your name." });
        return;
      }
      if (!email || !/.+@.+\..+/.test(email)) {
        setState({ submitError: "Please enter a valid email address." });
        return;
      }

      setState({ submitting: true, submitError: "" });
      try {
        const whoObj = WHO_CHIPS[s.who] || {};
        const whoLabel = whoObj.name || "Employer";
        const sizeObj = SIZE_CHIPS[s.size] || {};
        const sizeLabel = sizeObj.name || "Small team";
        await inquiriesApi.submit({
          name,
          email,
          inquiryType: "USA Payroll Management Inquiry",
          subject: "Payroll - " + whoLabel + " (" + sizeLabel + ")",
          message: [
            "Client Type: " + whoLabel,
            "Team Size: " + sizeLabel,
            states ? "States with employees: " + states : "",
            msg ? "Help requested: " + msg : ""
          ].filter(Boolean).join("\n") || "Payroll consultation request.",
          sourcePage: "/services/payroll-management"
        });
        setState({ sent: true, submitting: false, submitError: "" });
      } catch (err) {
        setState({ submitting: false, submitError: err?.message || "Submission failed. Please try again." });
      }
    }
  };
}

export default function PayrollManagementPage() {
  const [state, setRaw] = useState(INITIAL_STATE);

  // Class-style setState: accepts an object or an updater fn; a null result means "no change".
  const setState = useCallback((u) => {
    setRaw((prev) => {
      const next = typeof u === 'function' ? u(prev) : u;
      return next ? { ...prev, ...next } : prev;
    });
  }, []);

  useEffect(() => {
    const prevTitle = document.title;
    document.title = 'USA Payroll Management Services | Smart Tax Expertss';
    const t1 = setInterval(() => setState((s) => ({ run: (s.run + 1) % 13 })), 900);
    const t2 = setInterval(() => setState((s) => ({ ob: (s.ob + 1) % 11 })), 1000);
    const t3 = setInterval(() => setState((s) => ({ step: (s.step + 1) % 7 })), 6000);
    const t4 = setInterval(() => setState((s) => (s.doubtOpen ? null : { doubt: (s.doubt + 1) % 6 })), 5000);
    return () => {
      clearInterval(t1); clearInterval(t2); clearInterval(t3); clearInterval(t4);
      document.title = prevTitle;
    };
  }, [setState]);

  const {
    audTabs, heroText, heroCta, runLines, runPct, netShown, runDone, runStatus, runChipStyle, softwareLoop, isEmp, isEr, empPressed, erPressed, empTabStyle, erTabStyle, showEmp, showEr, parts, partN, partName, partText, partSvc, partHref, wages, wagesFmt, onWages, suta, sutaFmt, onSuta, erBars, erTotalFmt, erCostFmt, stations, procList, hours, onHours, hourBlocks, regPay, otPay, grossPay, ytd, ytdFmt, onYtd, fedMeters, fedList, locs, layers, stateList, deds, dedName, dedText, fitH, ficaH, fitLabel, ficaLabel, obFields, obPct, obList, tiles, stateCount, withholdCount, focusTag, focusName, focusRows, resetMap, monthCells, forms, formNote, stateForms, jeRows, recCols, reconcile, recLabel, recBtnStyle, acctList, w2Boxes, w2Tag, w2Title, w2Why, yeList, steps, stepBars, stepX, prevStep, nextStep, swFilters, swNodes, swName, swUse, flow, cpaList, cpaExpect, fits, faqCats, faqs, doubtN, doubtTotal, doubtQ, doubtBtn, doubtOpenStr, doubtBtnStyle, doubtDots, revealDoubt, whoChips, sizeChips, related, notSent, sent, submitting, submitError, onSubmit
  } = buildVals(state, setState);

  return (
    <>
      <style>{PAGE_CSS}</style>
      <ScrollNavigation />
      <div className="stx" style={{ fontFamily: "Inter, sans-serif", color: "#0B1A1E", background: "#F1F4F2", minHeight: "100vh" }} data-document-role="page" data-label="USA Payroll Management — Main Service Page">
        <div className="progress" aria-hidden="true"></div>

        {/* ================= TOP BAR ================= */}
        <header style={{ background: "#0B1A1E", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <div className="wrap" style={{ padding: "18px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "24px", flexWrap: "wrap" }}>
            <a href="#top" style={{ display: "flex", alignItems: "center", gap: "12px", textDecoration: "none", color: "#FFFFFF" }}>
              <span style={{ width: "38px", height: "38px", borderRadius: "10px", background: "#37E191", display: "grid", placeItems: "center", color: "#0B1A1E", font: "800 16px Manrope, sans-serif" }}>ST</span>
              <span className="h" style={{ fontSize: "19px", fontWeight: "700" }}>Smart Tax Expertss</span>
            </a>
            <nav aria-label="Main" style={{ display: "flex", gap: "28px", flexWrap: "wrap" }}>
              <a href="/services/" style={{ color: "#A9BBBE", textDecoration: "none", fontSize: "15px" }}>Services</a>
              <a href="/cpa-outsourcing-services/" style={{ color: "#A9BBBE", textDecoration: "none", fontSize: "15px" }}>CPA Outsourcing</a>
              <a href="/about/" style={{ color: "#A9BBBE", textDecoration: "none", fontSize: "15px" }}>About</a>
              <a href="/contact/" style={{ color: "#A9BBBE", textDecoration: "none", fontSize: "15px" }}>Contact</a>
            </nav>
            <a href="#consult" className="btn btn-mint" style={{ minHeight: "44px", padding: "0 20px", fontSize: "14px" }}>Request a Payroll Consultation</a>
          </div>
        </header>

        {/* ================= 1. HERO (same pattern as first page) ================= */}
        <section id="top" style={{ background: "#0B1A1E", color: "#FFFFFF", position: "relative", overflow: "hidden" }}>
          <div aria-hidden="true" style={{ position: "absolute", inset: "0", backgroundImage: "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)", backgroundSize: "56px 56px" }}></div>

          <div style={{ position: "relative", maxWidth: "1240px", margin: "0 auto", padding: "34px 32px 0", display: "flex", justifyContent: "flex-start" }}>
            <BackToServices />
          </div>
          <div className="wrap" style={{ padding: "80px 32px 96px", display: "flex", flexWrap: "wrap", gap: "56px", alignItems: "center", position: "relative" }}>
            <div style={{ flex: "1 1 540px", minWidth: "0" }}>
              <nav aria-label="Breadcrumb" style={{ fontSize: "13px", color: "#A9BBBE", marginBottom: "26px" }}>
                <a href="/" style={{ color: "#A9BBBE", textDecoration: "none" }}>Home</a> <span aria-hidden="true">/</span> <a href="/services/" style={{ color: "#A9BBBE", textDecoration: "none" }}>Services</a> <span aria-hidden="true">/</span> <span style={{ color: "#37E191" }}>USA Payroll Management</span>
              </nav>
              <div style={{ display: "inline-flex", gap: "6px", background: "rgba(255,255,255,0.06)", padding: "6px", borderRadius: "999px", marginBottom: "28px" }} role="group" aria-label="Choose your audience">
                {audTabs.map((t, _i) => (<Fragment key={_i}>
                  <button className="tab" onClick={t.pick} aria-pressed={t.pressed} style={css(t.style)}>{t.name}</button>
                </Fragment>))}
              </div>
              <p className="eyebrow" style={{ color: "#37E191" }}>USA Payroll Management Services</p>
              <h1 className="h" style={{ margin: "0", fontSize: "clamp(40px, 5.4vw, 70px)", lineHeight: "1.02", fontWeight: "800" }}>Every paycheck calculated, <span style={{ color: "#37E191" }}>reviewed</span> and reconciled.</h1>
              <p className="panel-in" style={{ margin: "28px 0 0", fontSize: "19px", lineHeight: "1.6", color: "#C9D6D8", maxWidth: "590px" }}>{heroText}</p>
              <div style={{ display: "flex", gap: "14px", flexWrap: "wrap", marginTop: "36px" }}>
                <a href="#consult" className="btn btn-mint">{heroCta} <span className="arrow" aria-hidden="true">→</span></a>
                <a href="#services" className="btn btn-ghost">Explore All 9 Payroll Services</a>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", marginTop: "56px", borderTop: "1px solid rgba(255,255,255,0.12)" }}>
                <div style={{ padding: "22px 18px 0 0" }}><div className="h" style={{ fontSize: "34px", fontWeight: "800" }}>5–10</div><div style={{ fontSize: "13px", color: "#A9BBBE", marginTop: "4px" }}>Years of experience</div></div>
                <div style={{ padding: "22px 18px 0 18px", borderLeft: "1px solid rgba(255,255,255,0.12)" }}><div className="h" style={{ fontSize: "34px", fontWeight: "800" }}>250–500</div><div style={{ fontSize: "13px", color: "#A9BBBE", marginTop: "4px" }}>Clients supported</div></div>
                <div style={{ padding: "22px 18px 0 18px", borderLeft: "1px solid rgba(255,255,255,0.12)" }}><div className="h" style={{ fontSize: "34px", fontWeight: "800" }}>3</div><div style={{ fontSize: "13px", color: "#A9BBBE", marginTop: "4px" }}>Specialist roles: accountants, payroll reviewers, tax specialists</div></div>
                <div style={{ padding: "22px 0 0 18px", borderLeft: "1px solid rgba(255,255,255,0.12)" }}><div className="h" style={{ fontSize: "34px", fontWeight: "800" }}>4</div><div style={{ fontSize: "13px", color: "#A9BBBE", marginTop: "4px" }}>Pay frequencies: weekly to monthly</div></div>
              </div>
            </div>

            {/* Live pay-run stub */}
            <div style={{ flex: "1 1 420px", minWidth: "0", position: "relative", display: "flex", justifyContent: "center" }}>
              <div style={{ width: "100%", maxWidth: "470px", position: "relative" }}>
                <div style={{ background: "#FFFFFF", color: "#0B1A1E", borderRadius: "22px 22px 0 0", padding: "26px 28px 18px", position: "relative", overflow: "hidden" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px" }}>
                    <div>
                      <div className="mono" style={{ fontSize: "11px", letterSpacing: "0.12em", color: "#4A5A5E" }}>PAY RUN · SAMPLE EMPLOYEE</div>
                      <div className="h" style={{ fontSize: "20px", fontWeight: "800", marginTop: "4px" }}>Biweekly · Hourly</div>
                    </div>
                    <span className="mono" style={css(runChipStyle)}>{runStatus}</span>
                  </div>
                  <div style={{ height: "6px", borderRadius: "3px", background: "#EEF2F0", marginTop: "18px", overflow: "hidden" }}><div className="fill" style={css(`height: 100%; width: ${runPct}; background: #37E191; border-radius: 3px`)}></div></div>
                  <div style={{ marginTop: "16px" }}>
                    {runLines.map((l, _i) => (<Fragment key={_i}>
                      <div className="ln" style={css(l.style)}>
                        <span style={{ display: "flex", alignItems: "center", gap: "10px" }}><span style={css(`width: 8px; height: 8px; border-radius: 2px; background: ${l.dot}`)}></span>{l.label}</span>
                        <span className="mono" style={css(`font-weight: 600; color: ${l.color}`)}>{l.amt}</span>
                      </div>
                    </Fragment>))}
                  </div>
                  {runDone && (<>
                    <div className="stamp mono" style={{ position: "absolute", right: "22px", bottom: "18px", border: "2.5px solid #0E7A49", color: "#0E7A49", fontSize: "13px", fontWeight: "600", letterSpacing: "0.14em", padding: "6px 12px", borderRadius: "8px", background: "rgba(255,255,255,0.9)" }}>REVIEWED ✓</div>
                  </>)}
                </div>
                <div className="perf" style={{ backgroundColor: "#FFFFFF", transform: "rotate(180deg)" }}></div>
                <div style={{ background: "#37E191", color: "#0B1A1E", borderRadius: "0 0 22px 22px", padding: "18px 28px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontWeight: "600" }}>Net pay</span>
                  <span className="h" style={{ fontSize: "30px", fontWeight: "800" }}>{netShown}</span>
                </div>
                <div className="float1 hero-pill-fica" style={{ position: "absolute", top: "-18px", left: "-28px", background: "#12262B", border: "1px solid rgba(255,255,255,0.14)", borderRadius: "14px", padding: "12px 16px", color: "#FFFFFF" }}>
                  <div className="mono" style={{ fontSize: "11px", color: "#37E191" }}>FICA WAGES</div>
                  <div style={{ fontSize: "14px", fontWeight: "600", marginTop: "2px" }}>Section 125 applied</div>
                </div>
                <div className="float2 hero-pill-ot" style={{ position: "absolute", bottom: "-20px", right: "24px", background: "#F2B544", color: "#0B1A1E", borderRadius: "14px", padding: "12px 16px", zIndex: "5", boxShadow: "0 4px 16px rgba(242,181,68,0.35)" }}>
                  <div className="mono" style={{ fontSize: "11px" }}>OVERTIME</div>
                  <div style={{ fontSize: "14px", fontWeight: "600", marginTop: "2px" }}>4 hrs at 1.5×</div>
                </div>
                <p style={{ fontSize: "12px", color: "#A9BBBE", margin: "14px 0 0", textAlign: "center" }}>Sample figures for illustration. Withholding depends on Form W-4, work state and benefit elections.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ================= SOFTWARE MARQUEE ================= */}
        <section aria-label="Software we work with" style={{ background: "#12262B", overflow: "hidden", padding: "20px 0", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="marquee">
            {softwareLoop.map((sw, _i) => (<Fragment key={_i}>
              <span className="h" style={{ color: "#A9BBBE", fontSize: "18px", fontWeight: "600", whiteSpace: "nowrap", display: "inline-flex", alignItems: "center", gap: "56px" }}>{sw} <span aria-hidden="true" style={{ color: "#37E191" }}>●</span></span>
            </Fragment>))}
          </div>
        </section>

        {/* ================= STICKY SUB-NAV ================= */}
        <nav aria-label="Payroll services" className="subnav" style={{ position: "sticky", top: "0", zIndex: "20", background: "rgba(241,244,242,0.92)", backdropFilter: "blur(10px)", borderBottom: "1px solid #DCE3E1" }}>
          <div className="wrap" style={{ padding: "10px 32px", display: "flex", gap: "2px", overflowX: "auto", alignItems: "center" }}>
            <span className="mono" style={{ fontSize: "12px", color: "#0E7A49", marginRight: "12px", whiteSpace: "nowrap" }}>PAY CYCLE</span>
            <a href="#processing">Processing</a>
            <a href="#federal">Federal Tax</a>
            <a href="#state">State &amp; Local</a>
            <a href="#benefits">Benefits</a>
            <a href="#onboarding">Onboarding</a>
            <a href="#multistate">Multi-State</a>
            <a href="#filing">Tax Filing</a>
            <a href="#accounting">Reconciliation</a>
            <a href="#yearend">Year-End</a>
            <a href="#cpa">For CPA Firms</a>
            <a href="#faq">FAQ</a>
          </div>
        </nav>

        {/* ================= 2. PAYCHECK ANATOMY ================= */}
        <section id="anatomy" style={{ padding: "112px 32px 104px" }}>
          <div className="wrap">
            <div className="rv" style={{ display: "flex", flexWrap: "wrap", gap: "32px", justifyContent: "space-between", alignItems: "flex-end" }}>
              <div style={{ flex: "1 1 560px", minWidth: "0" }}>
                <p className="eyebrow" style={{ color: "#0E7A49" }}>Understanding USA payroll management</p>
                <h2 className="h" style={{ margin: "0", fontSize: "clamp(34px, 4.2vw, 56px)", lineHeight: "1.04", fontWeight: "800" }}>One paycheck.<br />Eleven moving parts.</h2>
              </div>
              <div style={{ display: "flex", gap: "6px", background: "#E3E9E6", padding: "6px", borderRadius: "999px" }} role="group" aria-label="Choose a view">
                <button className="tab" onClick={showEmp} aria-pressed={empPressed} style={css(empTabStyle)}>Employee paycheck</button>
                <button className="tab" onClick={showEr} aria-pressed={erPressed} style={css(erTabStyle)}>Employer cost</button>
              </div>
            </div>
            <p className="rv" style={{ maxWidth: "760px", fontSize: "18px", lineHeight: "1.65", color: "#4A5A5E", margin: "24px 0 0" }}>US payroll is not one payment. Every cycle combines earnings, withholding, employer contributions, benefits and reporting, and each part follows different federal, state and local rules. Select any part to see which of our services handles it.</p>

            {isEmp && (<>
              <div className="panel-in" style={{ display: "flex", flexWrap: "wrap", gap: "24px", marginTop: "48px" }}>
                <div style={{ flex: "1 1 520px", minWidth: "0", background: "#FFFFFF", borderRadius: "28px", padding: "24px", border: "1px solid #DCE3E1", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "10px", alignContent: "start" }}>
                  {parts.map((p, _i) => (<Fragment key={_i}>
                    <button className="tab" onClick={p.pick} aria-pressed={p.pressed} style={css(p.style)}><span className="mono" style={{ fontSize: "12px", opacity: "0.7" }}>{p.n}</span><span>{p.name}</span></button>
                  </Fragment>))}
                </div>
                <div style={{ flex: "1 1 380px", minWidth: "0", background: "#0B1A1E", color: "#FFFFFF", borderRadius: "28px", padding: "36px", position: "relative", overflow: "hidden" }}>
                  <div aria-hidden="true" className="h" style={{ position: "absolute", right: "-10px", top: "-30px", fontSize: "200px", fontWeight: "800", color: "#12262B", lineHeight: "1" }}>{partN}</div>
                  <div style={{ position: "relative" }}>
                    <div className="mono" style={{ fontSize: "12px", color: "#37E191", letterSpacing: "0.12em" }}>PAYCHECK PART {partN} OF 11</div>
                    <div className="h panel-in" style={{ fontSize: "30px", fontWeight: "800", marginTop: "14px", lineHeight: "1.15" }}>{partName}</div>
                    <p style={{ fontSize: "16px", lineHeight: "1.65", color: "#C9D6D8", margin: "16px 0 0" }}>{partText}</p>
                    <div style={{ marginTop: "28px", paddingTop: "22px", borderTop: "1px solid rgba(255,255,255,0.12)" }}>
                      <div style={{ fontSize: "13px", color: "#A9BBBE" }}>Handled in</div>
                      <a href={partHref} className="lnk" style={{ color: "#37E191", marginTop: "8px", fontSize: "17px" }}>{partSvc} <span className="arrow" aria-hidden="true">→</span></a>
                    </div>
                  </div>
                </div>
              </div>
            </>)}

            {isEr && (<>
              <div className="panel-in" style={{ display: "flex", flexWrap: "wrap", gap: "24px", marginTop: "48px" }}>
                <div style={{ flex: "1 1 380px", minWidth: "0", background: "#FFFFFF", borderRadius: "28px", padding: "32px", border: "1px solid #DCE3E1" }}>
                  <div className="h" style={{ fontSize: "22px", fontWeight: "800" }}>What an employee costs beyond salary</div>
                  <label htmlFor="wages" style={{ display: "block", marginTop: "26px", fontSize: "14px", color: "#4A5A5E" }}>Annual wages <span className="h" style={{ color: "#0B1A1E", fontSize: "24px", fontWeight: "800", marginLeft: "6px" }}>{wagesFmt}</span></label>
                  <input id="wages" type="range" min="25000" max="300000" step="1000" value={wages} onChange={onWages} />
                  <label htmlFor="suta" style={{ display: "block", marginTop: "18px", fontSize: "14px", color: "#4A5A5E" }}>Example state unemployment (SUTA) rate <span className="h" style={{ color: "#0B1A1E", fontSize: "24px", fontWeight: "800", marginLeft: "6px" }}>{sutaFmt}</span></label>
                  <input id="suta" type="range" min="5" max="60" step="1" value={suta} onChange={onSuta} style={{ accentColor: "#2B4ACB" }} />
                  <p style={{ fontSize: "13px", lineHeight: "1.6", color: "#4A5A5E", margin: "18px 0 0" }}>Employer FICA uses the 2026 Social Security wage base of $184,500. FUTA assumes the full 5.4% state credit. SUTA is applied to a $7,000 example wage base; actual rates and wage bases vary by state and employer.</p>
                </div>
                <div style={{ flex: "1.3 1 480px", minWidth: "0", background: "#FFFFFF", borderRadius: "28px", padding: "32px", border: "1px solid #DCE3E1" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: "8px" }}>
                    <div className="mono" style={{ fontSize: "12px", color: "#4A5A5E", letterSpacing: "0.1em" }}>EMPLOYER PAYROLL TAXES · ANNUAL</div>
                    <div className="h" style={{ fontSize: "30px", fontWeight: "800", color: "#0E7A49" }}>{erTotalFmt}</div>
                  </div>
                  <div style={{ display: "grid", gap: "16px", marginTop: "26px" }}>
                    {erBars.map((b, _i) => (<Fragment key={_i}>
                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", fontWeight: "600" }}><span>{b.label}</span><span className="mono">{b.amt}</span></div>
                        <div style={{ height: "14px", borderRadius: "7px", background: "#EEF2F0", marginTop: "8px", overflow: "hidden" }}><div className="fill" style={css(`height: 100%; width: ${b.w}; background: ${b.c}; border-radius: 7px`)}></div></div>
                        <div style={{ fontSize: "12px", color: "#4A5A5E", marginTop: "6px" }}>{b.note}</div>
                      </div>
                    </Fragment>))}
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "26px", padding: "18px 20px", borderRadius: "18px", background: "#0B1A1E", color: "#FFFFFF", flexWrap: "wrap", gap: "8px" }}>
                    <span style={{ fontSize: "14px", color: "#C9D6D8" }}>Wages + employer payroll taxes (before benefits)</span>
                    <span className="h" style={{ fontSize: "24px", fontWeight: "800", color: "#37E191" }}>{erCostFmt}</span>
                  </div>
                </div>
              </div>
            </>)}
          </div>
        </section>

        {/* ================= 3. SERVICES CONVEYOR (INDEX) ================= */}
        <section id="services" style={{ padding: "104px 32px", background: "#0B1A1E", color: "#FFFFFF", overflow: "hidden" }}>
          <div className="wrap">
            <div className="rv" style={{ display: "flex", flexWrap: "wrap", gap: "32px", justifyContent: "space-between", alignItems: "flex-end" }}>
              <div style={{ flex: "1 1 560px", minWidth: "0" }}>
                <p className="eyebrow" style={{ color: "#37E191" }}>Our USA payroll management services</p>
                <h2 className="h" style={{ margin: "0", fontSize: "clamp(34px, 4.2vw, 56px)", lineHeight: "1.04", fontWeight: "800" }}>Nine services.<br />One continuous pay cycle.</h2>
              </div>
              <p style={{ flex: "1 1 380px", margin: "0", fontSize: "17px", lineHeight: "1.65", color: "#C9D6D8" }}>Engage one service or the whole cycle. Each station below opens a working model of the service, so you can see exactly what we do before you speak to us.</p>
            </div>
            <div className="rv" style={{ position: "relative", marginTop: "64px", padding: "0 8px" }}>
              <div className="conveyor-track" style={{ position: "absolute", left: "8px", right: "8px", top: "34px", height: "4px", borderRadius: "2px", background: "repeating-linear-gradient(90deg, rgba(255,255,255,0.18) 0 12px, transparent 12px 20px)" }}></div>
              <div aria-hidden="true" className="token conveyor-token" style={{ position: "absolute", top: "22px", marginLeft: "-14px", width: "28px", height: "28px", borderRadius: "8px", background: "#37E191", boxShadow: "0 0 0 8px rgba(55,225,145,0.18), 0 0 30px rgba(55,225,145,0.6)", display: "grid", placeItems: "center", color: "#0B1A1E", font: "800 13px Manrope, sans-serif" }}>$</div>
              <div className="stations-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(118px, 1fr))", gap: "12px", position: "relative" }}>
                {stations.map((st, _i) => (<Fragment key={_i}>
                  <a href={st.href} className="card-h" style={{ textDecoration: "none", color: "#FFFFFF", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "12px", padding: "14px 8px 18px", borderRadius: "20px" }}>
                    <span className="h" style={{ width: "72px", height: "72px", borderRadius: "22px", background: "#12262B", border: "1.5px solid rgba(255,255,255,0.16)", display: "grid", placeItems: "center", fontSize: "22px", fontWeight: "800", color: "#37E191" }}>{st.n}</span>
                    <span style={{ fontSize: "14px", fontWeight: "600", lineHeight: "1.35" }}>{st.name}</span>
                  </a>
                </Fragment>))}
              </div>
            </div>
          </div>
        </section>

        {/* ================= S1. PAYROLL PROCESSING ================= */}
        <section id="processing" style={{ padding: "120px 32px 104px" }}>
          <div className="wrap" style={{ display: "flex", flexWrap: "wrap", gap: "56px", alignItems: "center" }}>
            <div className="rv" style={{ flex: "1 1 420px", minWidth: "0" }}>
              <span className="svc-num" style={{ background: "#DDF7EA", color: "#0E7A49" }}>SERVICE 01 / 09</span>
              <h2 className="h" style={{ margin: "20px 0 0", fontSize: "clamp(32px, 3.6vw, 46px)", lineHeight: "1.06", fontWeight: "800" }}>Payroll Processing &amp; Administration</h2>
              <p style={{ fontSize: "17px", lineHeight: "1.65", color: "#4A5A5E", margin: "20px 0 0" }}>We work with the hours, approvals and compensation changes you provide, calculate gross-to-net for every employee and prepare the payroll register for review before anything is released.</p>
              <ul style={{ listStyle: "none", padding: "0", margin: "26px 0 0", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: "10px 20px" }}>
                {procList.map((li, _i) => (<Fragment key={_i}>
                  <li style={{ display: "flex", gap: "10px", alignItems: "flex-start", fontSize: "15px" }}><svg aria-hidden="true" width="18" height="18" viewBox="0 0 18 18" style={{ flex: "none", marginTop: "2px" }}><circle cx="9" cy="9" r="9" fill="#DDF7EA"></circle><path d="M5 9.2l2.6 2.6L13 6.4" fill="none" stroke="#0E7A49" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg>{li}</li>
                </Fragment>))}
              </ul>
              <div className="doubt"><p className="dq"><span className="qmark" aria-hidden="true">?</span>What if someone works overtime or leaves mid-cycle?</p><a href="#consult" className="dbtn">Overtime and final pay are calculated in-cycle <span className="arrow" aria-hidden="true">→</span></a></div>
            </div>
            <div className="rv" style={{ flex: "1.15 1 500px", minWidth: "0", background: "#FFFFFF", borderRadius: "28px", border: "1px solid #DCE3E1", padding: "32px", position: "relative", overflow: "hidden" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: "8px" }}>
                <div className="h" style={{ fontSize: "21px", fontWeight: "800" }}>Timesheet → Gross pay</div>
                <div className="mono" style={{ fontSize: "11px", color: "#4A5A5E" }}>EXAMPLE · $24.00/HR · NON-EXEMPT</div>
              </div>
              <label htmlFor="hours" style={{ display: "block", marginTop: "24px", fontSize: "14px", color: "#4A5A5E" }}>Hours worked this week <span className="h" style={{ color: "#0B1A1E", fontSize: "26px", fontWeight: "800", marginLeft: "6px" }}>{hours} hrs</span></label>
              <input id="hours" type="range" min="20" max="60" step="1" value={hours} onChange={onHours} />
              <div style={{ display: "flex", gap: "4px", marginTop: "20px", height: "120px", alignItems: "flex-end" }} aria-hidden="true">
                {hourBlocks.map((hb, _i) => (<Fragment key={_i}>
                  <div className="fill" style={css(`flex: 1; height: ${hb.h}; background: ${hb.c}; border-radius: 3px; opacity: ${hb.o}`)}></div>
                </Fragment>))}
              </div>
              <div style={{ position: "relative", height: "22px", marginTop: "6px" }}>
                <div className="mono" style={{ position: "absolute", left: "0", fontSize: "11px", color: "#4A5A5E" }}>0</div>
                <div className="mono" style={{ position: "absolute", left: "66.6%", transform: "translateX(-50%)", fontSize: "11px", color: "#0B1A1E", fontWeight: "600" }}>40 HRS · FLSA LINE</div>
                <div className="mono" style={{ position: "absolute", right: "0", fontSize: "11px", color: "#4A5A5E" }}>60</div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "12px", marginTop: "18px" }}>
                <div style={{ background: "#F1F4F2", borderRadius: "16px", padding: "14px 16px" }}><div style={{ fontSize: "12px", color: "#4A5A5E" }}>Regular pay</div><div className="h" style={{ fontSize: "22px", fontWeight: "800", marginTop: "4px" }}>{regPay}</div></div>
                <div style={{ background: "#FDF1D8", borderRadius: "16px", padding: "14px 16px" }}><div style={{ fontSize: "12px", color: "#6B4E0F" }}>Overtime at 1.5×</div><div className="h" style={{ fontSize: "22px", fontWeight: "800", marginTop: "4px" }}>{otPay}</div></div>
                <div style={{ background: "#0B1A1E", color: "#FFFFFF", borderRadius: "16px", padding: "14px 16px" }}><div style={{ fontSize: "12px", color: "#A9BBBE" }}>Gross pay</div><div className="h" style={{ fontSize: "22px", fontWeight: "800", marginTop: "4px", color: "#37E191" }}>{grossPay}</div></div>
              </div>
              <p style={{ fontSize: "12px", lineHeight: "1.55", color: "#4A5A5E", margin: "16px 0 0" }}>Federal rule: overtime for non-exempt employees above 40 hours in a workweek. Some states, such as California, add daily overtime rules that we apply where relevant.</p>
            </div>
          </div>
        </section>

        {/* ================= S2. FEDERAL PAYROLL TAX ================= */}
        <section id="federal" style={{ padding: "104px 32px", background: "#FFFFFF", borderTop: "1px solid #DCE3E1", borderBottom: "1px solid #DCE3E1" }}>
          <div className="wrap">
            <div className="rv" style={{ display: "flex", flexWrap: "wrap", gap: "40px", justifyContent: "space-between", alignItems: "flex-end" }}>
              <div style={{ flex: "1 1 560px", minWidth: "0" }}>
                <span className="svc-num" style={{ background: "#E4E9FB", color: "#2B4ACB" }}>SERVICE 02 / 09</span>
                <h2 className="h" style={{ margin: "20px 0 0", fontSize: "clamp(32px, 3.6vw, 46px)", lineHeight: "1.06", fontWeight: "800" }}>Federal Payroll Tax Management</h2>
              </div>
              <p style={{ flex: "1 1 400px", margin: "0", fontSize: "17px", lineHeight: "1.65", color: "#4A5A5E" }}>Federal income tax, Social Security, Medicare and FUTA each follow their own thresholds. Drag the year-to-date wages to see where each tax starts, keeps going or stops.</p>
            </div>

            <div className="rv" style={{ marginTop: "48px", background: "#0B1A1E", color: "#FFFFFF", borderRadius: "28px", padding: "40px 36px" }}>
              <label htmlFor="ytd" style={{ display: "block", fontSize: "14px", color: "#A9BBBE" }}>Employee year-to-date wages <span className="h" style={{ color: "#FFFFFF", fontSize: "30px", fontWeight: "800", marginLeft: "8px" }}>{ytdFmt}</span></label>
              <div style={{ position: "relative", marginTop: "46px" }}>
                <div style={{ position: "absolute", left: "2.7%", top: "-34px", transform: "translateX(-50%)" }} className="mono"><span style={{ fontSize: "11px", color: "#F2B544" }}>FUTA $7K</span></div>
                <div style={{ position: "absolute", left: "70.96%", top: "-34px", transform: "translateX(-50%)" }} className="mono"><span style={{ fontSize: "11px", color: "#37E191" }}>SS $184.5K</span></div>
                <div style={{ position: "absolute", left: "76.92%", top: "-18px", transform: "translateX(-10%)" }} className="mono"><span style={{ fontSize: "11px", color: "#9DB0FF" }}>+0.9% MEDICARE $200K</span></div>
                <input id="ytd" type="range" min="0" max="260000" step="1000" value={ytd} onChange={onYtd} style={{ accentColor: "#37E191" }} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "14px", marginTop: "30px" }}>
                {fedMeters.map((m, _i) => (<Fragment key={_i}>
                  <div style={{ background: "#12262B", borderRadius: "20px", padding: "20px", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: "8px", alignItems: "center" }}>
                      <span className="mono" style={{ fontSize: "11px", color: "#A9BBBE", letterSpacing: "0.08em" }}>{m.code}</span>
                      <span className="mono" style={css(m.badgeStyle)}>{m.badge}</span>
                    </div>
                    <div style={{ fontSize: "15px", fontWeight: "600", marginTop: "10px" }}>{m.name}</div>
                    <div className="h" style={css(`font-size: 26px; font-weight: 800; margin-top: 8px; color: ${m.c}`)}>{m.amt}</div>
                    <div style={{ height: "6px", borderRadius: "3px", background: "rgba(255,255,255,0.08)", marginTop: "12px", overflow: "hidden" }}><div className="fill" style={css(`height: 100%; width: ${m.w}; background: ${m.c}`)}></div></div>
                    <div style={{ fontSize: "12px", color: "#A9BBBE", marginTop: "10px", lineHeight: "1.5" }}>{m.note}</div>
                  </div>
                </Fragment>))}
              </div>
              <p style={{ fontSize: "12px", color: "#A9BBBE", margin: "20px 0 0", lineHeight: "1.55" }}>Employee-side amounts shown; the employer matches Social Security and regular Medicare. 2026 Social Security wage base $184,500 (SSA). Federal income tax depends on Form W-4 and IRS Publication 15-T, so it is not estimated here.</p>
            </div>

            <div className="rv" style={{ display: "flex", flexWrap: "wrap", gap: "32px", marginTop: "40px", alignItems: "flex-start" }}>
              <div style={{ flex: "1 1 520px", minWidth: "0" }}>
                <div className="h" style={{ fontSize: "20px", fontWeight: "800" }}>Federal reporting &amp; deposits we support</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "16px" }}>
                  {fedList.map((f, _i) => (<Fragment key={_i}>
                    <span style={{ fontSize: "14px", padding: "10px 14px", borderRadius: "12px", background: "#F1F4F2", border: "1px solid #DCE3E1" }}>{f}</span>
                  </Fragment>))}
                </div>
                <p style={{ fontSize: "14px", color: "#4A5A5E", margin: "16px 0 0", lineHeight: "1.6" }}>Filing and payment activities are carried out under the relevant authorizations and agreed engagement responsibilities.</p>
              </div>
              <div style={{ flex: "1 1 400px", minWidth: "0" }}>
                <div className="doubt" style={{ marginTop: "0" }}><p className="dq"><span className="qmark" aria-hidden="true">?</span>Who keeps track of the Social Security wage base?</p><a href="#consult" className="dbtn">We check it on every pay run <span className="arrow" aria-hidden="true">→</span></a></div>
                <a href="/tax-planning-services/" className="lnk" style={{ marginTop: "18px" }}>Related: Tax Planning &amp; Advisory <span className="arrow" aria-hidden="true">→</span></a>
              </div>
            </div>
          </div>
        </section>

        {/* ================= S3. STATE & LOCAL ================= */}
        <section id="state" style={{ padding: "112px 32px" }}>
          <div className="wrap" style={{ display: "flex", flexWrap: "wrap-reverse", gap: "56px", alignItems: "center" }}>
            <div className="rv" style={{ flex: "1.15 1 520px", minWidth: "0" }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }} role="group" aria-label="Choose an employee work location">
                {locs.map((lc, _i) => (<Fragment key={_i}>
                  <button className="tab" onClick={lc.pick} aria-pressed={lc.pressed} style={css(lc.style)}>{lc.name}</button>
                </Fragment>))}
              </div>
              <div style={{ position: "relative", marginTop: "26px", display: "grid", gap: "14px" }}>
                {layers.map((ly, _i) => (<Fragment key={_i}>
                  <div className="fill" style={css(ly.style)}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                      <span className="mono" style={{ fontSize: "12px", letterSpacing: "0.12em", fontWeight: "600" }}>{ly.tag}</span>
                      <span className="mono" style={{ fontSize: "11px", opacity: "0.8" }}>{ly.status}</span>
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "14px" }}>
                      {ly.items.map((it, _i) => (<Fragment key={_i}>
                        <span className="panel-in" style={css(ly.chip)}>{it}</span>
                      </Fragment>))}
                    </div>
                  </div>
                </Fragment>))}
              </div>
              <p style={{ fontSize: "12px", color: "#4A5A5E", margin: "14px 0 0", lineHeight: "1.55" }}>Obligations shown are typical examples by work location and change over time. We confirm each employee's requirements during setup.</p>
            </div>
            <div className="rv" style={{ flex: "1 1 400px", minWidth: "0" }}>
              <span className="svc-num" style={{ background: "#DDF7EA", color: "#0E7A49" }}>SERVICE 03 / 09</span>
              <h2 className="h" style={{ margin: "20px 0 0", fontSize: "clamp(32px, 3.6vw, 46px)", lineHeight: "1.06", fontWeight: "800" }}>State &amp; Local Payroll Tax Management</h2>
              <p style={{ fontSize: "17px", lineHeight: "1.65", color: "#4A5A5E", margin: "20px 0 0" }}>Federal rules are the same nationwide. State and local rules are not. A company headquartered in Texas with an employee working from California takes on California withholding and registration duties. Pick a city to see how the layers stack up.</p>
              <ul style={{ listStyle: "none", padding: "0", margin: "24px 0 0", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "10px 20px" }}>
                {stateList.map((li, _i) => (<Fragment key={_i}>
                  <li style={{ display: "flex", gap: "10px", alignItems: "flex-start", fontSize: "15px" }}><span aria-hidden="true" style={{ flex: "none", marginTop: "7px", width: "8px", height: "8px", borderRadius: "2px", background: "#0E7A49" }}></span>{li}</li>
                </Fragment>))}
              </ul>
              <div className="doubt"><p className="dq"><span className="qmark" aria-hidden="true">?</span>Hiring your first employee in another state?</p><a href="#consult" className="dbtn">We map that state's duties first <span className="arrow" aria-hidden="true">→</span></a></div>
            </div>
          </div>
        </section>

        {/* ================= S4. BENEFITS & DEDUCTIONS ================= */}
        <section id="benefits" style={{ padding: "104px 32px", background: "#FFFFFF", borderTop: "1px solid #DCE3E1", borderBottom: "1px solid #DCE3E1" }}>
          <div className="wrap">
            <div className="rv" style={{ display: "flex", flexWrap: "wrap", gap: "40px", justifyContent: "space-between", alignItems: "flex-end" }}>
              <div style={{ flex: "1 1 560px", minWidth: "0" }}>
                <span className="svc-num" style={{ background: "#FDF1D8", color: "#7A5410" }}>SERVICE 04 / 09</span>
                <h2 className="h" style={{ margin: "20px 0 0", fontSize: "clamp(32px, 3.6vw, 46px)", lineHeight: "1.06", fontWeight: "800" }}>Employee Benefits &amp; Payroll Deductions</h2>
              </div>
              <p style={{ flex: "1 1 400px", margin: "0", fontSize: "17px", lineHeight: "1.65", color: "#4A5A5E" }}>Not every deduction is treated the same way. Some reduce income-tax wages, some also reduce Social Security and Medicare wages, and some reduce neither. Select one to see where $100 lands.</p>
            </div>
            <div className="rv" style={{ display: "flex", flexWrap: "wrap", gap: "24px", marginTop: "48px" }}>
              <div style={{ flex: "1 1 360px", minWidth: "0", display: "grid", gap: "10px", alignContent: "start" }}>
                {deds.map((d, _i) => (<Fragment key={_i}>
                  <button className="tab" onClick={d.pick} aria-pressed={d.pressed} style={css(d.style)}><span>{d.name}</span><span className="mono" style={{ fontSize: "11px", opacity: "0.75" }}>{d.tag}</span></button>
                </Fragment>))}
              </div>
              <div style={{ flex: "1.4 1 520px", minWidth: "0", background: "#F1F4F2", borderRadius: "28px", padding: "36px", border: "1px solid #DCE3E1" }}>
                <div className="mono" style={{ fontSize: "12px", color: "#4A5A5E", letterSpacing: "0.1em" }}>A $100 DEDUCTION FOR</div>
                <div className="h panel-in" style={{ fontSize: "30px", fontWeight: "800", marginTop: "8px" }}>{dedName}</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px", marginTop: "28px" }}>
                  <div style={{ background: "#FFFFFF", borderRadius: "20px", padding: "22px", border: "1px solid #DCE3E1" }}>
                    <div style={{ fontSize: "13px", color: "#4A5A5E" }}>Federal income-tax wages</div>
                    <div style={{ display: "flex", alignItems: "flex-end", gap: "14px", marginTop: "16px", height: "120px" }}>
                      <div style={{ flex: "1", height: "100%", background: "#E3E9E6", borderRadius: "10px", position: "relative", overflow: "hidden" }}><div className="fill" style={css(`position: absolute; left: 0; right: 0; bottom: 0; height: ${fitH}; background: #2B4ACB`)}></div></div>
                      <div className="h" style={{ fontSize: "22px", fontWeight: "800", color: "#2B4ACB", minWidth: "80px" }}>{fitLabel}</div>
                    </div>
                  </div>
                  <div style={{ background: "#FFFFFF", borderRadius: "20px", padding: "22px", border: "1px solid #DCE3E1" }}>
                    <div style={{ fontSize: "13px", color: "#4A5A5E" }}>Social Security &amp; Medicare wages</div>
                    <div style={{ display: "flex", alignItems: "flex-end", gap: "14px", marginTop: "16px", height: "120px" }}>
                      <div style={{ flex: "1", height: "100%", background: "#E3E9E6", borderRadius: "10px", position: "relative", overflow: "hidden" }}><div className="fill" style={css(`position: absolute; left: 0; right: 0; bottom: 0; height: ${ficaH}; background: #0E7A49`)}></div></div>
                      <div className="h" style={{ fontSize: "22px", fontWeight: "800", color: "#0E7A49", minWidth: "80px" }}>{ficaLabel}</div>
                    </div>
                  </div>
                </div>
                <p className="panel-in" style={{ fontSize: "16px", lineHeight: "1.65", margin: "22px 0 0" }}>{dedText}</p>
                <p style={{ fontSize: "12px", color: "#4A5A5E", margin: "12px 0 0", lineHeight: "1.5" }}>General federal treatment; plan documents and some states can differ. Bars show the share of the $100 that comes off taxable wages.</p>
              </div>
            </div>
            <div className="rv" style={{ display: "flex", flexWrap: "wrap", gap: "20px 32px", marginTop: "36px", alignItems: "center", justifyContent: "space-between" }}>
              <div className="doubt" style={{ marginTop: "0", flex: "1 1 560px" }}><p className="dq"><span className="qmark" aria-hidden="true">?</span>Not sure which deductions are pre-tax?</p><a href="#consult" className="dbtn">Each one is set up with its tax treatment <span className="arrow" aria-hidden="true">→</span></a></div>
              <a href="/bookkeeping-services-usa/" className="lnk">Related: Bookkeeping &amp; Accounting <span className="arrow" aria-hidden="true">→</span></a>
            </div>
          </div>
        </section>

        {/* ================= S5. ONBOARDING ================= */}
        <section id="onboarding" style={{ padding: "112px 32px" }}>
          <div className="wrap" style={{ display: "flex", flexWrap: "wrap", gap: "56px", alignItems: "center" }}>
            <div className="rv" style={{ flex: "1 1 420px", minWidth: "0" }}>
              <span className="svc-num" style={{ background: "#E4E9FB", color: "#2B4ACB" }}>SERVICE 05 / 09</span>
              <h2 className="h" style={{ margin: "20px 0 0", fontSize: "clamp(32px, 3.6vw, 46px)", lineHeight: "1.06", fontWeight: "800" }}>Employee Onboarding &amp; Payroll Setup</h2>
              <p style={{ fontSize: "17px", lineHeight: "1.65", color: "#4A5A5E", margin: "20px 0 0" }}>Payroll accuracy starts before the first paycheck. A wrong withholding certificate or work location carries into every later calculation and into year-end reporting, so each employee record is built and checked field by field.</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "10px 20px", marginTop: "24px" }}>
                {obList.map((li, _i) => (<Fragment key={_i}>
                  <div style={{ display: "flex", gap: "10px", alignItems: "flex-start", fontSize: "15px" }}><span aria-hidden="true" style={{ flex: "none", marginTop: "7px", width: "8px", height: "8px", borderRadius: "2px", background: "#2B4ACB" }}></span>{li}</div>
                </Fragment>))}
              </div>
              <p style={{ fontSize: "14px", color: "#4A5A5E", margin: "18px 0 0", lineHeight: "1.6" }}>For independent contractors we organize Form W-9 details and payment records. Employment eligibility verification and employer registrations remain the employer's obligations under the agreed arrangement.</p>
              <div className="doubt"><p className="dq"><span className="qmark" aria-hidden="true">?</span>Worried a wrong W-4 will cost you later?</p><a href="#consult" className="dbtn">Setup is verified before the first paycheck <span className="arrow" aria-hidden="true">→</span></a></div>
            </div>
            <div className="rv" style={{ flex: "1 1 460px", minWidth: "0", display: "flex", justifyContent: "center" }}>
              <div style={{ width: "100%", maxWidth: "480px", background: "#0B1A1E", color: "#FFFFFF", borderRadius: "28px", padding: "30px", position: "relative", overflow: "hidden" }}>
                <div className="scan" aria-hidden="true" style={{ position: "absolute", left: "0", right: "0", height: "2px", background: "linear-gradient(90deg, transparent, #37E191, transparent)", opacity: "0.7" }}></div>
                <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                  <div className="bob" style={{ width: "64px", height: "64px", borderRadius: "20px", background: "#12262B", display: "grid", placeItems: "center", border: "1.5px solid rgba(255,255,255,0.16)" }}>
                    <svg aria-hidden="true" width="34" height="34" viewBox="0 0 34 34"><circle cx="17" cy="12" r="6" fill="none" stroke="#37E191" strokeWidth="2"></circle><path d="M6 30c1.5-6 6-9 11-9s9.5 3 11 9" fill="none" stroke="#37E191" strokeWidth="2" strokeLinecap="round"></path></svg>
                  </div>
                  <div style={{ flex: "1" }}>
                    <div className="mono" style={{ fontSize: "11px", color: "#37E191", letterSpacing: "0.12em" }}>NEW HIRE · EMPLOYEE RECORD</div>
                    <div className="h" style={{ fontSize: "20px", fontWeight: "800", marginTop: "4px" }}>Setup {obPct} complete</div>
                  </div>
                </div>
                <div style={{ height: "6px", borderRadius: "3px", background: "rgba(255,255,255,0.08)", marginTop: "18px", overflow: "hidden" }}><div className="fill" style={css(`height: 100%; width: ${obPct}; background: #37E191`)}></div></div>
                <div style={{ display: "grid", gap: "8px", marginTop: "20px" }}>
                  {obFields.map((f, _i) => (<Fragment key={_i}>
                    <div className="ln" style={css(f.style)}>
                      <span style={{ fontSize: "13px", color: "#A9BBBE" }}>{f.k}</span>
                      <span className="mono" style={css(`font-size: 13px; font-weight: 600; color: ${f.c}`)}>{f.v}</span>
                    </div>
                  </Fragment>))}
                </div>
                <p style={{ fontSize: "11px", color: "#A9BBBE", margin: "14px 0 0" }}>Sample record. Sensitive identifiers are masked in every working file.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ================= S6. MULTI-STATE ================= */}
        <section id="multistate" style={{ padding: "104px 32px", background: "#0B1A1E", color: "#FFFFFF" }}>
          <div className="wrap">
            <div className="rv" style={{ display: "flex", flexWrap: "wrap", gap: "40px", justifyContent: "space-between", alignItems: "flex-end" }}>
              <div style={{ flex: "1 1 560px", minWidth: "0" }}>
                <span className="svc-num" style={{ background: "rgba(55,225,145,0.14)", color: "#37E191" }}>SERVICE 06 / 09</span>
                <h2 className="h" style={{ margin: "20px 0 0", fontSize: "clamp(32px, 3.6vw, 46px)", lineHeight: "1.06", fontWeight: "800" }}>Multi-State &amp; Remote Employee Payroll</h2>
              </div>
              <p style={{ flex: "1 1 400px", margin: "0", fontSize: "17px", lineHeight: "1.65", color: "#C9D6D8" }}>Your headquarters is in Texas. Now tap the states where remote employees work. Each one adds its own withholding, unemployment insurance and reporting.</p>
            </div>
            <div className="rv" style={{ display: "flex", flexWrap: "wrap", gap: "32px", marginTop: "48px", alignItems: "stretch" }}>
              <div style={{ flex: "1.4 1 560px", minWidth: "0", background: "#12262B", borderRadius: "28px", padding: "28px", border: "1px solid rgba(255,255,255,0.08)" }}>
                <div className="state-map-grid" style={{ display: "grid", gridTemplateColumns: "repeat(11, minmax(0, 1fr))", gridTemplateRows: "repeat(8, auto)", gap: "6px" }} role="group" aria-label="US states, select to add a remote employee">
                  {tiles.map((t, _i) => (<Fragment key={_i}>
                    <button className="tile mono" onClick={t.pick} aria-pressed={t.pressed} aria-label={t.aria} style={css(t.style)}>{t.code}</button>
                  </Fragment>))}
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "18px", marginTop: "20px", fontSize: "12px", color: "#C9D6D8" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}><span style={{ width: "12px", height: "12px", borderRadius: "3px", background: "#F2B544" }}></span>HQ</span>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}><span style={{ width: "12px", height: "12px", borderRadius: "3px", background: "#37E191" }}></span>Remote employee added</span>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}><span style={{ width: "12px", height: "12px", borderRadius: "3px", background: "#1B3338", boxShadow: "inset 0 0 0 1.5px #5E7A80" }}></span>No state income tax on wages</span>
                </div>
              </div>
              <div style={{ flex: "1 1 340px", minWidth: "0", display: "flex", flexDirection: "column", gap: "16px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "12px" }}>
                  <div style={{ background: "#37E191", color: "#0B1A1E", borderRadius: "20px", padding: "18px" }}><div className="h" style={{ fontSize: "40px", fontWeight: "800", lineHeight: "1" }}>{stateCount}</div><div style={{ fontSize: "13px", fontWeight: "600", marginTop: "6px" }}>States on payroll</div></div>
                  <div style={{ background: "#12262B", borderRadius: "20px", padding: "18px", border: "1px solid rgba(255,255,255,0.08)" }}><div className="h" style={{ fontSize: "40px", fontWeight: "800", lineHeight: "1" }}>{withholdCount}</div><div style={{ fontSize: "13px", color: "#C9D6D8", marginTop: "6px" }}>With state income tax withholding</div></div>
                </div>
                <div className="panel-in" style={{ background: "#FFFFFF", color: "#0B1A1E", borderRadius: "22px", padding: "24px", flex: "1" }}>
                  <div className="mono" style={{ fontSize: "11px", color: "#4A5A5E", letterSpacing: "0.1em" }}>{focusTag}</div>
                  <div className="h" style={{ fontSize: "26px", fontWeight: "800", marginTop: "6px" }}>{focusName}</div>
                  <div style={{ display: "grid", gap: "10px", marginTop: "16px" }}>
                    {focusRows.map((r, _i) => (<Fragment key={_i}>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", fontSize: "14px", paddingBottom: "10px", borderBottom: "1px solid #E3E9E6" }}><span style={{ color: "#4A5A5E" }}>{r.k}</span><span style={{ fontWeight: "600", textAlign: "right" }}>{r.v}</span></div>
                    </Fragment>))}
                  </div>
                </div>
                <button className="tab" onClick={resetMap} style={{ minHeight: "44px", borderRadius: "999px", background: "transparent", color: "#FFFFFF", boxShadow: "inset 0 0 0 1.5px rgba(255,255,255,0.3)" }}>Reset map</button>
              </div>
            </div>
            <div className="rv doubt doubt-dark" style={{ color: "#FFFFFF" }}><p className="dq"><span className="qmark" aria-hidden="true">?</span>Remote team spread across several states?</p><a href="#consult" className="dbtn">One process, every jurisdiction reconciled <span className="arrow" aria-hidden="true">→</span></a></div>
          </div>
        </section>

        {/* ================= S7. PAYROLL TAX FILING ================= */}
        <section id="filing" style={{ padding: "112px 32px" }}>
          <div className="wrap">
            <div className="rv" style={{ display: "flex", flexWrap: "wrap", gap: "40px", justifyContent: "space-between", alignItems: "flex-end" }}>
              <div style={{ flex: "1 1 560px", minWidth: "0" }}>
                <span className="svc-num" style={{ background: "#FDF1D8", color: "#7A5410" }}>SERVICE 07 / 09</span>
                <h2 className="h" style={{ margin: "20px 0 0", fontSize: "clamp(32px, 3.6vw, 46px)", lineHeight: "1.06", fontWeight: "800" }}>Payroll Tax Filing &amp; Reporting</h2>
              </div>
              <p style={{ flex: "1 1 400px", margin: "0", fontSize: "17px", lineHeight: "1.65", color: "#4A5A5E" }}>Select a form to light up its deadlines across the year. Every figure filed is reconciled back to the payroll register and the books first.</p>
            </div>
            <div className="rv" style={{ marginTop: "48px", background: "#FFFFFF", borderRadius: "28px", padding: "32px", border: "1px solid #DCE3E1" }}>
              <div className="months-grid" style={{ display: "grid", gridTemplateColumns: "repeat(12, minmax(0, 1fr))", gap: "6px" }}>
                {monthCells.map((mc, _i) => (<Fragment key={_i}>
                  <div className="fill" style={css(mc.style)}>
                    <div className="mono" style={{ fontSize: "11px", fontWeight: "600" }}>{mc.m}</div>
                    <div className="mono" style={{ fontSize: "10px", marginTop: "6px", minHeight: "14px" }}>{mc.due}</div>
                  </div>
                </Fragment>))}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "12px", marginTop: "24px" }}>
                {forms.map((fm, _i) => (<Fragment key={_i}>
                  <button className="tab card-h" onClick={fm.pick} aria-pressed={fm.pressed} style={css(fm.style)}>
                    <span style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px" }}><span className="h" style={{ fontSize: "22px", fontWeight: "800" }}>{fm.code}</span><span className="mono" style={{ fontSize: "10px", letterSpacing: "0.08em", opacity: "0.8" }}>{fm.freq}</span></span>
                    <span style={{ fontSize: "13px", fontWeight: "500", lineHeight: "1.45", marginTop: "8px", textAlign: "left", opacity: "0.85" }}>{fm.name}</span>
                  </button>
                </Fragment>))}
              </div>
              <div className="panel-in" style={{ marginTop: "20px", background: "#F1F4F2", borderRadius: "18px", padding: "18px 22px", fontSize: "15px", lineHeight: "1.6" }}>{formNote}</div>
            </div>
            <div className="rv" style={{ display: "flex", flexWrap: "wrap", gap: "32px", marginTop: "36px" }}>
              <div style={{ flex: "1 1 520px", minWidth: "0" }}>
                <div className="h" style={{ fontSize: "20px", fontWeight: "800" }}>State &amp; local reporting</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "14px" }}>
                  {stateForms.map((f, _i) => (<Fragment key={_i}>
                    <span style={{ fontSize: "14px", padding: "10px 14px", borderRadius: "12px", background: "#FFFFFF", border: "1px solid #DCE3E1" }}>{f}</span>
                  </Fragment>))}
                </div>
                <p style={{ fontSize: "14px", color: "#4A5A5E", margin: "14px 0 0", lineHeight: "1.6" }}>Requirements depend on employer size, IRS filing designation, employee locations and workforce. Filing is performed under the required authorizations.</p>
              </div>
              <div style={{ flex: "1 1 400px", minWidth: "0" }}>
                <div className="doubt" style={{ marginTop: "0" }}><p className="dq"><span className="qmark" aria-hidden="true">?</span>Afraid of missing a 941 deadline?</p><a href="#consult" className="dbtn">Every due date sits in your calendar <span className="arrow" aria-hidden="true">→</span></a></div>
                <a href="/us-tax-filing-services/" className="lnk" style={{ marginTop: "18px" }}>Related: US Tax Filing Services <span className="arrow" aria-hidden="true">→</span></a>
              </div>
            </div>
          </div>
        </section>

        {/* ================= S8. PAYROLL ACCOUNTING & RECONCILIATION ================= */}
        <section id="accounting" style={{ padding: "104px 32px", background: "#FFFFFF", borderTop: "1px solid #DCE3E1", borderBottom: "1px solid #DCE3E1" }}>
          <div className="wrap" style={{ display: "flex", flexWrap: "wrap-reverse", gap: "56px", alignItems: "center" }}>
            <div className="rv" style={{ flex: "1.25 1 560px", minWidth: "0", background: "#0B1A1E", color: "#FFFFFF", borderRadius: "28px", padding: "32px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                <div>
                  <div className="mono" style={{ fontSize: "11px", color: "#37E191", letterSpacing: "0.12em" }}>MONTHLY PAYROLL JOURNAL ENTRY · EXAMPLE</div>
                  <div className="h" style={{ fontSize: "22px", fontWeight: "800", marginTop: "4px" }}>$50,000 in wages, recorded properly</div>
                </div>
                <button className="tab" onClick={reconcile} style={css(recBtnStyle)}>{recLabel}</button>
              </div>
              <div style={{ marginTop: "22px", borderRadius: "18px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.1)" }}>
                <div className="mono" style={{ display: "grid", gridTemplateColumns: "1fr 96px 96px", gap: "8px", padding: "12px 16px", background: "#12262B", fontSize: "11px", color: "#A9BBBE", letterSpacing: "0.08em" }}><span>ACCOUNT</span><span style={{ textAlign: "right" }}>DEBIT</span><span style={{ textAlign: "right" }}>CREDIT</span></div>
                {jeRows.map((r, _i) => (<Fragment key={_i}>
                  <div className="ln" style={css(r.style)}><span>{r.acct}</span><span className="mono" style={{ textAlign: "right" }}>{r.dr}</span><span className="mono" style={{ textAlign: "right" }}>{r.cr}</span></div>
                </Fragment>))}
                <div className="mono" style={{ display: "grid", gridTemplateColumns: "1fr 96px 96px", gap: "8px", padding: "14px 16px", background: "#12262B", fontSize: "14px", fontWeight: "600" }}><span>Totals</span><span style={{ textAlign: "right", color: "#37E191" }}>53,825</span><span style={{ textAlign: "right", color: "#37E191" }}>53,825</span></div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "10px", marginTop: "18px" }}>
                {recCols.map((c, _i) => (<Fragment key={_i}>
                  <div className="fill" style={css(c.style)}>
                    <div style={{ fontSize: "12px", opacity: "0.8" }}>{c.k}</div>
                    <div className="h" style={{ fontSize: "17px", fontWeight: "800", marginTop: "4px" }}>{c.v}</div>
                  </div>
                </Fragment>))}
              </div>
              <p style={{ fontSize: "12px", color: "#A9BBBE", margin: "14px 0 0", lineHeight: "1.5" }}>Illustrative figures. Federal income tax withheld shown as a sample amount; employer FICA at 7.65%. FUTA, SUTA and benefits omitted for clarity.</p>
            </div>
            <div className="rv" style={{ flex: "1 1 400px", minWidth: "0" }}>
              <span className="svc-num" style={{ background: "#DDF7EA", color: "#0E7A49" }}>SERVICE 08 / 09</span>
              <h2 className="h" style={{ margin: "20px 0 0", fontSize: "clamp(32px, 3.6vw, 46px)", lineHeight: "1.06", fontWeight: "800" }}>Payroll Accounting &amp; Reconciliation</h2>
              <p style={{ fontSize: "17px", lineHeight: "1.65", color: "#4A5A5E", margin: "20px 0 0" }}>Payroll and bookkeeping should never drift apart. Every cycle creates wage expense, employer tax expense, withholding liabilities and cash movements. We post them, then tie the register, the general ledger and the bank together.</p>
              <ul style={{ listStyle: "none", padding: "0", margin: "24px 0 0", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "10px 20px" }}>
                {acctList.map((li, _i) => (<Fragment key={_i}>
                  <li style={{ display: "flex", gap: "10px", alignItems: "flex-start", fontSize: "15px" }}><span aria-hidden="true" style={{ flex: "none", marginTop: "7px", width: "8px", height: "8px", borderRadius: "2px", background: "#0E7A49" }}></span>{li}</li>
                </Fragment>))}
              </ul>
              <div className="doubt"><p className="dq"><span className="qmark" aria-hidden="true">?</span>Does your payroll register match your books?</p><a href="#consult" className="dbtn">We reconcile both every cycle <span className="arrow" aria-hidden="true">→</span></a></div>
              <a href="/bookkeeping-services-usa/" className="lnk" style={{ marginTop: "18px" }}>Related: Bookkeeping &amp; Accounting <span className="arrow" aria-hidden="true">→</span></a>
            </div>
          </div>
        </section>

        {/* ================= S9. YEAR-END ================= */}
        <section id="yearend" style={{ padding: "112px 32px" }}>
          <div className="wrap">
            <div className="rv" style={{ display: "flex", flexWrap: "wrap", gap: "40px", justifyContent: "space-between", alignItems: "flex-end" }}>
              <div style={{ flex: "1 1 560px", minWidth: "0" }}>
                <span className="svc-num" style={{ background: "#E4E9FB", color: "#2B4ACB" }}>SERVICE 09 / 09</span>
                <h2 className="h" style={{ margin: "20px 0 0", fontSize: "clamp(32px, 3.6vw, 46px)", lineHeight: "1.06", fontWeight: "800" }}>Year-End Payroll Processing</h2>
              </div>
              <p style={{ flex: "1 1 400px", margin: "0", fontSize: "17px", lineHeight: "1.65", color: "#4A5A5E" }}>Why is Box 1 lower than Box 3 on a W-2? Year-end is where every pay run of the year has to add up. Click any box on this sample W-2 to see where its number comes from.</p>
            </div>
            <div className="rv" style={{ display: "flex", flexWrap: "wrap", gap: "24px", marginTop: "48px" }}>
              <div style={{ flex: "1.3 1 560px", minWidth: "0", background: "#FFFFFF", borderRadius: "22px", border: "2px solid #0B1A1E", padding: "22px", position: "relative" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", paddingBottom: "14px", borderBottom: "2px solid #0B1A1E" }}>
                  <span className="h" style={{ fontSize: "26px", fontWeight: "800" }}>W-2 <span style={{ fontSize: "14px", fontWeight: "600" }}>Wage and Tax Statement</span></span>
                  <span className="mono" style={{ fontSize: "11px", background: "#F2B544", padding: "4px 10px", borderRadius: "6px" }}>SAMPLE · $72,000 SALARY</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "8px", marginTop: "14px" }}>
                  {w2Boxes.map((b, _i) => (<Fragment key={_i}>
                    <button className="tab" onClick={b.pick} aria-pressed={b.pressed} style={css(b.style)}>
                      <span className="mono" style={{ fontSize: "11px", textAlign: "left", opacity: "0.8" }}>{b.box} · {b.label}</span>
                      <span className="h" style={{ fontSize: "22px", fontWeight: "800", textAlign: "left", marginTop: "6px" }}>{b.val}</span>
                    </button>
                  </Fragment>))}
                </div>
              </div>
              <div style={{ flex: "1 1 380px", minWidth: "0", display: "flex", flexDirection: "column", gap: "16px" }}>
                <div className="panel-in" style={{ background: "#0B1A1E", color: "#FFFFFF", borderRadius: "22px", padding: "28px", flex: "1" }}>
                  <div className="mono" style={{ fontSize: "12px", color: "#37E191", letterSpacing: "0.12em" }}>{w2Tag}</div>
                  <div className="h" style={{ fontSize: "26px", fontWeight: "800", marginTop: "10px" }}>{w2Title}</div>
                  <p style={{ fontSize: "16px", lineHeight: "1.65", color: "#C9D6D8", margin: "14px 0 0" }}>{w2Why}</p>
                </div>
                <div style={{ background: "#FFFFFF", borderRadius: "22px", padding: "24px", border: "1px solid #DCE3E1" }}>
                  <div className="h" style={{ fontSize: "17px", fontWeight: "800" }}>Our year-end support includes</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "12px" }}>
                    {yeList.map((y, _i) => (<Fragment key={_i}>
                      <span style={{ fontSize: "13px", padding: "7px 11px", borderRadius: "999px", background: "#F1F4F2" }}>{y}</span>
                    </Fragment>))}
                  </div>
                </div>
              </div>
            </div>
            <div className="rv doubt"><p className="dq"><span className="qmark" aria-hidden="true">?</span>Dreading W-2 season every January?</p><a href="#consult" className="dbtn">Reconciliation starts before December <span className="arrow" aria-hidden="true">→</span></a></div>
          </div>
        </section>

        {/* ================= PROCESS SLIDER ================= */}
        <section id="process" style={{ padding: "104px 32px", background: "#0B1A1E", color: "#FFFFFF", overflow: "hidden" }}>
          <div className="wrap">
            <div className="rv" style={{ display: "flex", flexWrap: "wrap", gap: "32px", justifyContent: "space-between", alignItems: "flex-end" }}>
              <div style={{ flex: "1 1 560px", minWidth: "0" }}>
                <p className="eyebrow" style={{ color: "#37E191" }}>Our payroll management process</p>
                <h2 className="h" style={{ margin: "0", fontSize: "clamp(34px, 4.2vw, 56px)", lineHeight: "1.04", fontWeight: "800" }}>Seven steps from<br />timesheet to records.</h2>
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <button className="tab" onClick={prevStep} aria-label="Previous step" style={{ width: "52px", height: "52px", borderRadius: "50%", background: "transparent", color: "#FFFFFF", boxShadow: "inset 0 0 0 1.5px rgba(255,255,255,0.3)", fontSize: "20px" }}>←</button>
                <button className="tab" onClick={nextStep} aria-label="Next step" style={{ width: "52px", height: "52px", borderRadius: "50%", background: "#37E191", color: "#0B1A1E", fontSize: "20px" }}>→</button>
              </div>
            </div>
            <div className="rv" style={{ display: "flex", gap: "6px", marginTop: "40px" }}>
              {stepBars.map((sb, _i) => (<Fragment key={_i}>
                <button className="tab" onClick={sb.pick} aria-label={sb.label} aria-pressed={sb.pressed} style={{ flex: "1", minHeight: "44px", background: "transparent", padding: "0", display: "flex", flexDirection: "column", gap: "10px", textAlign: "left", color: "#FFFFFF" }}>
                  <span style={css(`display: block; width: 100%; height: 4px; border-radius: 2px; background: ${sb.bg}; transition: background .4s`)}></span>
                  <span className="mono" style={css(`font-size: 11px; color: ${sb.c}`)}>{sb.short}</span>
                </button>
              </Fragment>))}
            </div>
            <div style={{ overflow: "hidden", marginTop: "30px", borderRadius: "28px" }}>
              <div className="slide" style={css(`display: flex; transform: translateX(${stepX})`)}>
                {steps.map((s, _i) => (<Fragment key={_i}>
                  <div style={{ flex: "0 0 100%", display: "flex", flexWrap: "wrap", gap: "32px", background: "#12262B", borderRadius: "28px", padding: "44px", minHeight: "300px", alignItems: "center" }}>
                    <div className="h" style={{ fontSize: "140px", fontWeight: "800", color: "#37E191", lineHeight: "0.85", flex: "none" }}>{s.n}</div>
                    <div style={{ flex: "1 1 380px", minWidth: "0" }}>
                      <div className="h" style={{ fontSize: "32px", fontWeight: "800" }}>{s.title}</div>
                      <p style={{ fontSize: "17px", lineHeight: "1.65", color: "#C9D6D8", margin: "14px 0 0" }}>{s.text}</p>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "18px" }}>
                        {s.tags.map((tg, _i) => (<Fragment key={_i}>
                          <span style={{ fontSize: "13px", padding: "7px 12px", borderRadius: "999px", background: "rgba(55,225,145,0.1)", color: "#9DF2C7", border: "1px solid rgba(55,225,145,0.25)" }}>{tg}</span>
                        </Fragment>))}
                      </div>
                    </div>
                  </div>
                </Fragment>))}
              </div>
            </div>
          </div>
        </section>

        {/* ================= SOFTWARE ORBIT ================= */}
        <section id="software" style={{ padding: "112px 32px" }}>
          <div className="wrap" style={{ display: "flex", flexWrap: "wrap", gap: "56px", alignItems: "center" }}>
            <div className="rv" style={{ flex: "1 1 420px", minWidth: "0" }}>
              <p className="eyebrow" style={{ color: "#0E7A49" }}>Payroll software &amp; accounting platforms</p>
              <h2 className="h" style={{ margin: "0", fontSize: "clamp(34px, 4vw, 52px)", lineHeight: "1.05", fontWeight: "800" }}>We work inside the platforms you already use.</h2>
              <p style={{ fontSize: "17px", lineHeight: "1.65", color: "#4A5A5E", margin: "20px 0 0" }}>Our team works in established US accounting and tax platforms. Filter by the job to see which tool supports which part of the payroll cycle.</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "24px" }} role="group" aria-label="Filter software by use">
                {swFilters.map((f, _i) => (<Fragment key={_i}>
                  <button className="tab" onClick={f.pick} aria-pressed={f.pressed} style={css(f.style)}>{f.name}</button>
                </Fragment>))}
              </div>
              <div className="panel-in" style={{ marginTop: "22px", background: "#FFFFFF", borderRadius: "20px", padding: "22px", border: "1px solid #DCE3E1" }}>
                <div className="h" style={{ fontSize: "20px", fontWeight: "800" }}>{swName}</div>
                <p style={{ fontSize: "15px", lineHeight: "1.6", color: "#4A5A5E", margin: "8px 0 0" }}>{swUse}</p>
              </div>
              <p style={{ fontSize: "13px", color: "#4A5A5E", margin: "16px 0 0", lineHeight: "1.55" }}>Access and activities depend on the client's subscription, permissions, configuration and engagement scope. Product names are trademarks of their respective owners.</p>
            </div>
            <div className="rv" style={{ flex: "1 1 460px", minWidth: "0", display: "flex", justifyContent: "center" }}>
              <div style={{ position: "relative", width: "100%", maxWidth: "500px", aspectRatio: "1 / 1" }}>
                <div aria-hidden="true" style={{ position: "absolute", inset: "8%", borderRadius: "50%", border: "1.5px dashed #B8C4C1" }}></div>
                <div aria-hidden="true" style={{ position: "absolute", inset: "28%", borderRadius: "50%", border: "1px solid #DCE3E1" }}></div>
                <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)", width: "34%", aspectRatio: "1 / 1", borderRadius: "50%", background: "#0B1A1E", color: "#FFFFFF", display: "grid", placeItems: "center", textAlign: "center" }}>
                  <div><div className="h" style={{ fontSize: "28px", fontWeight: "800", color: "#37E191" }}>STE</div><div className="mono" style={{ fontSize: "10px", color: "#A9BBBE", marginTop: "4px" }}>PAYROLL TEAM</div></div>
                </div>
                <div className="orbit" style={{ position: "absolute", inset: "0" }}>
                  {swNodes.map((n, _i) => (<Fragment key={_i}>
                    <button className="tab" onClick={n.pick} aria-pressed={n.pressed} style={css(n.style)}><span className="counter" style={{ display: "block" }}>{n.name}</span></button>
                  </Fragment>))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= CPA FIRMS ================= */}
        <section id="cpa" style={{ padding: "104px 32px", background: "#0B1A1E", color: "#FFFFFF", position: "relative", overflow: "hidden" }}>
          <div aria-hidden="true" style={{ position: "absolute", inset: "0", backgroundImage: "radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)", backgroundSize: "22px 22px" }}></div>
          <div className="wrap" style={{ position: "relative" }}>
            <div className="rv" style={{ display: "flex", flexWrap: "wrap", gap: "32px", justifyContent: "space-between", alignItems: "flex-end" }}>
              <div style={{ flex: "1 1 600px", minWidth: "0" }}>
                <p className="eyebrow" style={{ color: "#37E191" }}>USA payroll outsourcing for CPA firms</p>
                <h2 className="h" style={{ margin: "0", fontSize: "clamp(34px, 4.2vw, 56px)", lineHeight: "1.04", fontWeight: "800" }}>A practical extension of your accounting team.</h2>
              </div>
              <p style={{ flex: "1 1 380px", margin: "0", fontSize: "17px", lineHeight: "1.65", color: "#C9D6D8" }}>We prepare. Our reviewers check. Your licensed professionals keep the client relationship, the judgments and the sign-off.</p>
            </div>
            <div className="rv" style={{ marginTop: "56px", background: "#12262B", borderRadius: "28px", padding: "40px 32px", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div style={{ position: "relative" }}>
                <div style={{ position: "absolute", left: "10%", right: "10%", top: "36px", height: "2px", background: "rgba(255,255,255,0.14)" }}></div>
                <div aria-hidden="true" style={{ position: "absolute", left: "10%", right: "10%", top: "29px", height: "16px" }}>
                  <div className="packet" style={{ position: "absolute", top: "0", marginLeft: "-8px", width: "16px", height: "16px", borderRadius: "4px", background: "#37E191", boxShadow: "0 0 22px #37E191" }}></div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(5, minmax(0, 1fr))", gap: "8px", position: "relative" }}>
                  {flow.map((f, _i) => (<Fragment key={_i}>
                    <div style={{ textAlign: "center" }}>
                      <div className="h" style={css(f.style)}>{f.n}</div>
                      <div style={{ fontSize: "15px", fontWeight: "700", marginTop: "14px" }}>{f.who}</div>
                      <div style={{ fontSize: "13px", color: "#A9BBBE", marginTop: "6px", lineHeight: "1.45" }}>{f.what}</div>
                    </div>
                  </Fragment>))}
                </div>
              </div>
            </div>
            <div className="rv" style={{ display: "flex", flexWrap: "wrap", gap: "24px", marginTop: "24px" }}>
              <div style={{ flex: "1 1 460px", minWidth: "0", background: "#FFFFFF", color: "#0B1A1E", borderRadius: "28px", padding: "32px" }}>
                <div className="h" style={{ fontSize: "22px", fontWeight: "800" }}>What we take off your desk</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "10px 18px", marginTop: "18px" }}>
                  {cpaList.map((li, _i) => (<Fragment key={_i}>
                    <div style={{ display: "flex", gap: "10px", alignItems: "flex-start", fontSize: "14px" }}><svg aria-hidden="true" width="16" height="16" viewBox="0 0 18 18" style={{ flex: "none", marginTop: "2px" }}><circle cx="9" cy="9" r="9" fill="#DDF7EA"></circle><path d="M5 9.2l2.6 2.6L13 6.4" fill="none" stroke="#0E7A49" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg>{li}</div>
                  </Fragment>))}
                </div>
              </div>
              <div style={{ flex: "1 1 340px", minWidth: "0", background: "#37E191", color: "#0B1A1E", borderRadius: "28px", padding: "32px", display: "flex", flexDirection: "column" }}>
                <div className="h" style={{ fontSize: "22px", fontWeight: "800" }}>What your firm can expect</div>
                <div style={{ display: "grid", gap: "10px", marginTop: "18px", flex: "1" }}>
                  {cpaExpect.map((li, _i) => (<Fragment key={_i}>
                    <div style={{ display: "flex", gap: "10px", alignItems: "flex-start", fontSize: "15px", fontWeight: "500" }}><span aria-hidden="true" style={{ flex: "none", marginTop: "8px", width: "7px", height: "7px", borderRadius: "50%", background: "#0B1A1E" }}></span>{li}</div>
                  </Fragment>))}
                </div>
                <a href="#consult" className="btn btn-ink" style={{ marginTop: "24px", alignSelf: "flex-start" }}>Discuss CPA Outsourcing <span className="arrow" aria-hidden="true">→</span></a>
              </div>
            </div>
            <div className="rv doubt doubt-dark" style={{ color: "#FFFFFF" }}><p className="dq"><span className="qmark" aria-hidden="true">?</span>Will your clients deal with an outside team?</p><a href="/cpa-outsourcing-services/" className="dbtn">No. You keep the relationship and sign-off <span className="arrow" aria-hidden="true">→</span></a></div>
          </div>
        </section>

        {/* ================= WHO WE SUPPORT (CARDS GRID) ================= */}
        <section id="fit" style={{ padding: "112px 32px" }}>
          <div className="wrap">
            <div className="rv" style={{ display: "flex", flexWrap: "wrap", gap: "32px", justifyContent: "space-between", alignItems: "flex-end" }}>
              <div style={{ flex: "1 1 560px", minWidth: "0" }}>
                <p className="eyebrow" style={{ color: "#0E7A49" }}>Designed around your business</p>
                <h2 className="h" style={{ margin: "0", fontSize: "clamp(34px, 4.2vw, 56px)", lineHeight: "1.04", fontWeight: "800" }}>Payroll support at<br />the level you need.</h2>
              </div>
              <p style={{ flex: "1 1 380px", margin: "0", fontSize: "17px", lineHeight: "1.65", color: "#4A5A5E" }}>Scope, responsibilities and delivery schedule are agreed before the engagement begins. See what support looks like for each type of business.</p>
            </div>
            <div className="rv fit-cards-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px", marginTop: "48px" }}>
              {fits.map((f, _i) => (<Fragment key={_i}>
                <div className="fit-card card-h" style={{ background: f.open ? "#0B1A1E" : "#FFFFFF", color: f.open ? "#FFFFFF" : "#0B1A1E", borderRadius: "24px", padding: "28px", border: f.open ? "none" : "1px solid #DCE3E1", display: "flex", flexDirection: "column", gap: "14px", cursor: "pointer" }} onClick={f.pick}>
                  <span className="mono" style={{ fontSize: "13px", opacity: "0.6" }}>{f.n}</span>
                  <div className="h" style={{ fontSize: "20px", fontWeight: "800", lineHeight: "1.2" }}>{f.name}</div>
                  <p style={{ fontSize: "15px", lineHeight: "1.6", margin: "0", flex: "1", color: f.open ? "#C9D6D8" : "#4A5A5E" }}>{f.text}</p>
                  <a href={f.href} className="lnk" style={{ color: f.open ? "#37E191" : "#0E7A49", fontSize: "14px", fontWeight: "600", display: "inline-flex", alignItems: "center", gap: "6px", textDecoration: "none" }} onClick={e => e.stopPropagation()}>{f.cta} <span className="arrow" aria-hidden="true">→</span></a>
                </div>
              </Fragment>))}
            </div>
          </div>
        </section>

        {/* ================= WHY STE (BENTO) ================= */}
        <section id="why" style={{ padding: "104px 32px", background: "#FFFFFF", borderTop: "1px solid #DCE3E1", borderBottom: "1px solid #DCE3E1" }}>
          <div className="wrap">
            <div className="rv" style={{ maxWidth: "760px" }}>
              <p className="eyebrow" style={{ color: "#0E7A49" }}>Why businesses and CPA firms choose Smart Tax Expertss</p>
              <h2 className="h" style={{ margin: "0", fontSize: "clamp(34px, 4.2vw, 56px)", lineHeight: "1.04", fontWeight: "800" }}>Accounting knowledge behind every pay run.</h2>
            </div>
            <div className="rv" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "16px", marginTop: "48px" }}>
              <div className="card-h" style={{ background: "#0B1A1E", color: "#FFFFFF", borderRadius: "28px", padding: "32px", gridRow: "span 2", display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: "340px" }}>
                <div className="mono" style={{ fontSize: "12px", color: "#37E191", letterSpacing: "0.12em" }}>EXPERIENCE</div>
                <div><div className="h" style={{ fontSize: "88px", fontWeight: "800", lineHeight: "0.9" }}>5–10</div><div style={{ fontSize: "17px", color: "#C9D6D8", marginTop: "12px", lineHeight: "1.5" }}>Years across US taxation, accounting and related financial workflows.</div></div>
              </div>
              <div className="card-h" style={{ background: "#37E191", borderRadius: "28px", padding: "28px" }}>
                <div className="h" style={{ fontSize: "52px", fontWeight: "800", lineHeight: "1" }}>250–500</div>
                <div style={{ fontSize: "15px", marginTop: "10px", lineHeight: "1.5", fontWeight: "500" }}>Clients supported across accounting and tax service requirements.</div>
              </div>
              <div className="card-h" style={{ background: "#F1F4F2", borderRadius: "28px", padding: "28px", border: "1px solid #DCE3E1" }}>
                <div className="h" style={{ fontSize: "20px", fontWeight: "800" }}>Preparer + reviewer</div>
                <div style={{ fontSize: "15px", color: "#4A5A5E", marginTop: "10px", lineHeight: "1.55" }}>Payroll figures pass through defined review stages before they are finalised.</div>
              </div>
              <div className="card-h" style={{ background: "#F1F4F2", borderRadius: "28px", padding: "28px", border: "1px solid #DCE3E1" }}>
                <div className="h" style={{ fontSize: "20px", fontWeight: "800" }}>A mixed specialist team</div>
                <div style={{ fontSize: "15px", color: "#4A5A5E", marginTop: "10px", lineHeight: "1.55" }}>Accountants, payroll reviewers and tax specialists support different stages of each engagement.</div>
              </div>
              <div className="card-h" style={{ background: "#E4E9FB", borderRadius: "28px", padding: "28px" }}>
                <div className="h" style={{ fontSize: "20px", fontWeight: "800", color: "#1E3699" }}>Confidential by design</div>
                <div style={{ fontSize: "15px", color: "#1E2A55", marginTop: "10px", lineHeight: "1.55" }}>Payroll holds SSNs, pay and bank details. We work with controlled access and secure information exchange.</div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= FAQ ================= */}
        <section id="faq" style={{ padding: "112px 32px" }}>
          <div className="wrap" style={{ display: "flex", flexWrap: "wrap", gap: "56px", alignItems: "flex-start" }}>
            <div className="rv" style={{ flex: "1 1 340px", minWidth: "0", position: "sticky", top: "90px" }}>
              <p className="eyebrow" style={{ color: "#0E7A49" }}>Frequently asked questions</p>
              <h2 className="h" style={{ margin: "0", fontSize: "clamp(34px, 4vw, 52px)", lineHeight: "1.05", fontWeight: "800" }}>Questions about USA payroll management.</h2>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "28px" }} role="group" aria-label="Filter questions">
                {faqCats.map((c, _i) => (<Fragment key={_i}>
                  <button className="tab" onClick={c.pick} aria-pressed={c.pressed} style={css(c.style)}>{c.name}</button>
                </Fragment>))}
              </div>
              <a href="#consult" className="btn btn-ink" style={{ marginTop: "28px" }}>Ask Our Payroll Team <span className="arrow" aria-hidden="true">→</span></a>
            </div>
            <div className="rv" style={{ flex: "1.6 1 560px", minWidth: "0", display: "grid", gap: "10px" }}>
              {faqs.map((f, _i) => (<Fragment key={_i}>
                <div className="faq-card">
                  <button className="tab faq-btn" onClick={f.toggle} aria-expanded={f.expanded} style={{ width: "100%", background: "transparent", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px", padding: "20px 22px", textAlign: "left", fontSize: "17px", minHeight: "64px" }}>
                    <span>{f.q}</span><span aria-hidden="true" className={"faq-icon" + (f.open ? " open" : "")} style={css(f.iconStyle)}>{f.open ? "×" : "+"}</span>
                  </button>
                  {f.open && (<>
                    <p className="panel-in faq-ans" style={{ margin: "0", padding: "0 22px 22px", fontSize: "16px", lineHeight: "1.65" }}>{f.a}</p>
                  </>)}
                </div>
              </Fragment>))}
            </div>
          </div>
        </section>

        {/* ================= FINAL CTA ================= */}
        <section id="consult" style={{ padding: "112px 32px", background: "#0B1A1E", color: "#FFFFFF", position: "relative", overflow: "hidden" }}>
          <div aria-hidden="true" style={{ position: "absolute", inset: "0", backgroundImage: "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)", backgroundSize: "56px 56px" }}></div>
          <div className="wrap" style={{ display: "flex", flexWrap: "wrap", gap: "56px", alignItems: "flex-start", position: "relative" }}>
            <div className="rv" style={{ flex: "1 1 460px", minWidth: "0" }}>
              <p className="eyebrow" style={{ color: "#37E191" }}>Let Smart Tax Expertss support your US payroll</p>
              <h2 className="h" style={{ margin: "0", fontSize: "clamp(36px, 4.4vw, 60px)", lineHeight: "1.02", fontWeight: "800" }}>Still have a doubt? <span style={{ color: "#37E191" }}>Ask it here.</span></h2>
              <div style={{ marginTop: "36px", background: "#12262B", borderRadius: "24px", padding: "28px", border: "1px solid rgba(255,255,255,0.08)", minHeight: "230px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><span className="mono" style={{ fontSize: "11px", color: "#A9BBBE", letterSpacing: "0.12em" }}>COMMON DOUBT {doubtN} OF {doubtTotal}</span><span className="blink" style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#37E191" }}></span></div>
                <p className="h panel-in" style={{ fontSize: "26px", fontWeight: "800", margin: "16px 0 0", lineHeight: "1.25" }}>{doubtQ}</p>
                <button className="tab" onClick={revealDoubt} aria-expanded={doubtOpenStr} style={css(doubtBtnStyle)}>{doubtBtn}</button>
                <div style={{ display: "flex", gap: "6px", marginTop: "20px" }}>
                  {doubtDots.map((d, _i) => (<Fragment key={_i}>
                    <button className="tab" onClick={d.pick} aria-label={d.label} style={css(d.style)}></button>
                  </Fragment>))}
                </div>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "28px" }}>
                <a href="mailto:[YOUR EMAIL]" className="btn btn-ghost">Talk to Our Payroll Team</a>
                <a href="#consult-form" className="btn btn-mint">Get a Payroll Outsourcing Quote <span className="arrow" aria-hidden="true">→</span></a>
              </div>
            </div>
            <div id="consult-form" className="rv" style={{ flex: "1 1 460px", minWidth: "0", background: "#FFFFFF", color: "#0B1A1E", borderRadius: "28px", padding: "36px" }}>
              {notSent && (<>
                <form onSubmit={onSubmit}>
                  <div className="h" style={{ fontSize: "26px", fontWeight: "800" }}>Request a Payroll Consultation</div>
                  <p style={{ fontSize: "15px", color: "#4A5A5E", margin: "8px 0 0" }}>Tell us about your workforce and we will propose a scope.</p>
                  <div style={{ fontSize: "14px", fontWeight: "600", marginTop: "24px" }}>I am a</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "10px" }} role="group" aria-label="I am a">
                    {whoChips.map((c, _i) => (<Fragment key={_i}>
                      <button type="button" className="tab" onClick={c.pick} aria-pressed={c.pressed} style={css(c.style)}>{c.name}</button>
                    </Fragment>))}
                  </div>
                  <div style={{ fontSize: "14px", fontWeight: "600", marginTop: "20px" }}>Employees on payroll</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "10px" }} role="group" aria-label="Employees on payroll">
                    {sizeChips.map((c, _i) => (<Fragment key={_i}>
                      <button type="button" className="tab" onClick={c.pick} aria-pressed={c.pressed} style={css(c.style)}>{c.name}</button>
                    </Fragment>))}
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "14px", marginTop: "20px" }}>
                    <label style={{ display: "grid", gap: "6px", fontSize: "14px", fontWeight: "600" }}>Full name<input required type="text" style={{ minHeight: "48px", borderRadius: "12px", border: "1.5px solid #B8C4C1", padding: "0 14px" }} /></label>
                    <label style={{ display: "grid", gap: "6px", fontSize: "14px", fontWeight: "600" }}>Work email<input required type="email" style={{ minHeight: "48px", borderRadius: "12px", border: "1.5px solid #B8C4C1", padding: "0 14px" }} /></label>
                  </div>
                  <label style={{ display: "grid", gap: "6px", fontSize: "14px", fontWeight: "600", marginTop: "14px" }}>States with employees<input type="text" placeholder="e.g. Texas, California" style={{ minHeight: "48px", borderRadius: "12px", border: "1.5px solid #B8C4C1", padding: "0 14px" }} /></label>
                  <label style={{ display: "grid", gap: "6px", fontSize: "14px", fontWeight: "600", marginTop: "14px" }}>What do you need help with?<textarea rows="3" style={{ borderRadius: "12px", border: "1.5px solid #B8C4C1", padding: "12px 14px", resize: "vertical" }}></textarea></label>
                  {submitError && (
                    <div style={{ color: "#EF4444", fontSize: "13px", fontWeight: 600, marginTop: "12px" }}>
                      {submitError}
                    </div>
                  )}
                  <button type="submit" disabled={submitting} className="btn btn-ink" style={{ marginTop: "22px", width: "100%", justifyContent: "center", opacity: submitting ? 0.7 : 1 }}>{submitting ? "Sending..." : "Request a Payroll Consultation"} <span className="arrow" aria-hidden="true">→</span></button>
                </form>
              </>)}
              {sent && (<>
                <div className="panel-in" style={{ textAlign: "center", padding: "48px 12px" }}>
                  <svg aria-hidden="true" width="72" height="72" viewBox="0 0 72 72" style={{ display: "block", margin: "0 auto" }}><circle cx="36" cy="36" r="36" fill="#DDF7EA"></circle><path className="tick" d="M24 37l8 8 16-17" fill="none" stroke="#0E7A49" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                  <div className="h" style={{ fontSize: "26px", fontWeight: "800", marginTop: "22px" }}>Request received</div>
                  <p style={{ fontSize: "16px", color: "#4A5A5E", lineHeight: "1.6", margin: "10px 0 0" }}>Our payroll team will be in touch to discuss your requirements.</p>
                </div>
              </>)}
            </div>
          </div>
        </section>

        {/* ================= RELATED SERVICES ================= */}
        <section aria-label="Related services" style={{ padding: "96px 32px" }}>
          <div className="wrap">
            <div className="rv" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "16px" }}>
              <h2 className="h" style={{ margin: "0", fontSize: "clamp(28px, 3vw, 40px)", fontWeight: "800" }}>Connected services</h2>
              <a href="/services/" className="lnk">View all services <span className="arrow" aria-hidden="true">→</span></a>
            </div>
            <div className="rv" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "14px", marginTop: "32px" }}>
              {related.map((r, _i) => (<Fragment key={_i}>
                <a href={r.href} className="card-h" style={{ display: "flex", flexDirection: "column", background: "#FFFFFF", border: "1px solid #DCE3E1", borderRadius: "22px", padding: "24px", textDecoration: "none", color: "#0B1A1E", minHeight: "170px" }}>
                  <span className="mono" style={{ fontSize: "11px", color: "#0E7A49", letterSpacing: "0.1em" }}>{r.tag}</span>
                  <span className="h" style={{ fontSize: "20px", fontWeight: "800", marginTop: "10px" }}>{r.name}</span>
                  <span style={{ fontSize: "14px", color: "#4A5A5E", marginTop: "8px", lineHeight: "1.5", flex: "1" }}>{r.text}</span>
                  <span className="lnk" style={{ marginTop: "14px", fontSize: "14px" }}>Explore <span className="arrow" aria-hidden="true">→</span></span>
                </a>
              </Fragment>))}
            </div>
          </div>
        </section>

        <footer style={{ background: "#08130F", color: "#A9BBBE", padding: "32px" }}>
          <div className="wrap" style={{ display: "flex", justifyContent: "space-between", gap: "16px", flexWrap: "wrap", fontSize: "13px" }}>
            <span>Smart Tax Expertss · US payroll, accounting, tax preparation &amp; CPA outsourcing support</span>
            <span>Information on this page is general and is not tax or legal advice.</span>
          </div>
        </footer>

      </div>
    </>
  );
}
