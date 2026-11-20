import { Fragment, useEffect, useRef, useState } from 'react';

/* ===== Styles (scoped to .pg, injected by the component) ===== */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,600;12..96,700;12..96,800&family=DM+Mono:wght@400;500&family=Inter:wght@400;500;600;700&display=swap');



:where(.pg) a { color: #0E7A49; }
:where(.pg) a:hover { color: #0A5A36; }
.pg, .pg * { box-sizing: border-box; }
.pg { background: #F2F4F0; }
.pg { font-family: Inter, system-ui, sans-serif; color: #0F1B2A; font-size: 17px; line-height: 1.6; overflow-x: clip; }
.d { font-family: 'Bricolage Grotesque', Inter, system-ui, sans-serif; letter-spacing: -0.03em; line-height: 1.05; margin: 0; }
.m { font-family: 'DM Mono', ui-monospace, monospace; }
.wrap { max-width: 1240px; margin: 0 auto; padding: 0 28px; }
.sec { padding: 112px 0; }
.eb { font-family: 'DM Mono', ui-monospace, monospace; font-size: 13px; letter-spacing: .14em; text-transform: uppercase; margin: 0 0 18px; }
.h2 { font-size: clamp(32px, 4.3vw, 58px); font-weight: 700; text-wrap: balance; }
.lead { font-size: 19px; max-width: 720px; margin: 22px 0 0; text-wrap: pretty; }
.btn { display: inline-flex; align-items: center; justify-content: center; gap: 10px; min-height: 52px; padding: 0 26px; border-radius: 999px; font: 600 16px Inter, sans-serif; text-decoration: none; cursor: pointer; border: 0; transition: transform .25s, box-shadow .25s, background .25s; }
.btn:hover { transform: translateY(-2px); }
.btn .ar { display: inline-block; transition: transform .25s; }
.btn:hover .ar { transform: translateX(5px); }
.b1, .b1:hover { background: #37E191; color: #06131F; box-shadow: 0 10px 30px -12px rgba(55,225,145,.7); }
.b2, .b2:hover { background: transparent; color: #0F1B2A; box-shadow: inset 0 0 0 1.5px #0F1B2A; }
.b3, .b3:hover { background: transparent; color: #FFFFFF; box-shadow: inset 0 0 0 1.5px rgba(255,255,255,.55); }
.b4, .b4:hover { background: #07121F; color: #FFFFFF; }
.tab { min-height: 46px; padding: 0 18px; border-radius: 999px; border: 1.5px solid rgba(15,27,42,.22); background: transparent; color: #0F1B2A; font: 500 15px Inter, sans-serif; cursor: pointer; transition: background .25s, color .25s, border-color .25s; }
.tab:hover { border-color: #0F1B2A; }
.tab.on { background: #0F1B2A; border-color: #0F1B2A; color: #FFFFFF; }
.tabd { min-height: 46px; padding: 0 18px; border-radius: 999px; border: 1.5px solid rgba(255,255,255,.3); background: transparent; color: #E6EDF3; font: 500 15px Inter, sans-serif; cursor: pointer; transition: background .25s, color .25s, border-color .25s; }
.tabd:hover { border-color: #FFFFFF; }
.tabd.on { background: #37E191; border-color: #37E191; color: #06131F; }
.ck { list-style: none; margin: 0; padding: 0; display: grid; gap: 10px; }
.ck li { position: relative; padding-left: 30px; }
.ck li::before { content: ""; position: absolute; left: 4px; top: 7px; width: 12px; height: 7px; border-left: 2.5px solid #22AE68; border-bottom: 2.5px solid #22AE68; transform: rotate(-45deg); }
.ckd li::before { border-color: #37E191; }
.cka li::before { border-color: #FFB84D; }
.card { background: #FFFFFF; border-radius: 22px; border: 1px solid rgba(15,27,42,.1); }
.pop { animation: pop .55s cubic-bezier(.2,.9,.3,1.2) both; }
.fade { animation: fade .5s ease both; }
.chip { display: inline-flex; align-items: center; min-height: 36px; padding: 0 14px; border-radius: 10px; font-size: 14px; font-weight: 500; }
.chA { border: 1.5px dashed #FFB84D; color: #FFD9A0; }
.chAon { background: #FFB84D; color: #201400; }
.chB { background: #37E191; color: #06131F; }
.jit { animation: jit 1.6s ease-in-out infinite; }
.seatpulse { animation: seatpulse 2.2s ease-in-out infinite; }
.grow { animation: grow 7s ease-in-out infinite; }
.track { display: flex; transition: transform .7s cubic-bezier(.65,0,.2,1); }
.slide { flex: 0 0 100%; min-width: 0; }
.dot { width: 44px; height: 44px; border: 0; background: transparent; cursor: pointer; display: grid; place-items: center; padding: 0; }
.dot i { display: block; width: 10px; height: 10px; border-radius: 50%; background: rgba(15,27,42,.25); transition: all .3s; }
.dot.on i { width: 26px; border-radius: 6px; background: #22AE68; }
.rnd { width: 52px; height: 52px; border-radius: 50%; border: 1.5px solid #0F1B2A; background: transparent; color: #0F1B2A; font-size: 20px; cursor: pointer; transition: background .25s, color .25s; }
.rnd:hover { background: #0F1B2A; color: #FFFFFF; }
.rowbtn { display: flex; width: 100%; align-items: center; justify-content: space-between; gap: 16px; min-height: 60px; padding: 12px 20px; border-radius: 14px; border: 1.5px solid rgba(6,19,31,.16); background: #FFFFFF; color: #0F1B2A; font: 500 16px Inter, sans-serif; text-align: left; cursor: pointer; transition: all .25s; }
.role-grid { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); }
@media (max-width: 1023px){ .role-grid { grid-template-columns: repeat(2, minmax(0,1fr)); } }
@media (max-width: 639px){ .role-grid { grid-template-columns: 1fr; } }
.rowbtn:hover { border-color: #06131F; }
.rowbtn.on { background: #06131F; border-color: #06131F; color: #FFFFFF; transform: translateX(8px); }
.stepb { flex: 1 0 64px; min-height: 64px; border: 0; background: transparent; cursor: pointer; padding: 0; display: flex; flex-direction: column; align-items: center; gap: 8px; color: #55605C; font: 500 13px 'DM Mono', monospace; }
.stepb b { display: grid; place-items: center; width: 44px; height: 44px; border-radius: 50%; background: #FFFFFF; border: 1.5px solid rgba(15,27,42,.25); color: #0F1B2A; font-weight: 500; transition: all .3s; }
.stepb.done b { background: #CFF5E0; border-color: #22AE68; }
.stepb.on b { background: #0F1B2A; border-color: #0F1B2A; color: #37E191; transform: scale(1.18); }
.cell { aspect-ratio: 1; border-radius: 5px; transition: background .35s, transform .35s; }
.bar { height: 34px; border-radius: 9px; transform-origin: left center; }
.hatch { background: repeating-linear-gradient(135deg, #FFB84D 0 8px, #FFD9A0 8px 16px); }
.loop li { animation: loopglow 9.8s linear infinite; }
.seat { border-radius: 18px; padding: 20px; min-height: 132px; display: flex; flex-direction: column; justify-content: space-between; transition: all .45s cubic-bezier(.2,.9,.3,1.1); }
.seat.off { border: 1.5px dashed rgba(6,19,31,.35); color: #3F4D48; background: transparent; }
.seat.on { border: 1.5px solid #06131F; background: #06131F; color: #FFFFFF; transform: translateY(-4px); }
.faqb { display: flex; width: 100%; align-items: center; justify-content: space-between; gap: 20px; min-height: 68px; padding: 14px 4px; border: 0; background: transparent; cursor: pointer; text-align: left; font: 600 18px Inter, sans-serif; color: #0F1B2A; }
.faqb span.pm { flex: 0 0 34px; height: 34px; border-radius: 50%; border: 1.5px solid #0F1B2A; display: grid; place-items: center; font-size: 20px; line-height: 1; transition: transform .3s, background .3s, color .3s; }
.faqb.on span.pm { transform: rotate(45deg); background: #0F1B2A; color: #37E191; }
.f { width: 100%; min-height: 50px; padding: 12px 14px; border-radius: 12px; border: 1.5px solid rgba(255,255,255,.28); background: rgba(255,255,255,.06); color: #FFFFFF; font: 400 16px Inter, sans-serif; }
.f::placeholder { color: #9FB0C0; }
.f:focus { outline: 2px solid #37E191; outline-offset: 1px; }
select.f option { color: #0F1B2A; }
.lb { display: block; font-size: 14px; font-weight: 600; color: #E6EDF3; margin-bottom: 8px; }
.pill { min-height: 44px; padding: 0 14px; border-radius: 10px; border: 1.5px solid rgba(255,255,255,.28); background: transparent; color: #E6EDF3; font: 500 14px Inter, sans-serif; cursor: pointer; transition: all .2s; }
.pill.on { background: #37E191; border-color: #37E191; color: #06131F; }
.navl { color: #C9D5E0; text-decoration: none; font-size: 15px; font-weight: 500; padding: 12px 2px; }
.navl:hover { color: #37E191; }
.mq { display: flex; gap: 14px; width: max-content; animation: mq 38s linear infinite; }
.mqw:hover .mq { animation-play-state: paused; }
@keyframes pop {
  from { opacity: 0; transform: translateY(14px) scale(.9); }
  to { opacity: 1; transform: none; }
}
@keyframes fade {
  from { opacity: 0; transform: translateY(18px); }
  to { opacity: 1; transform: none; }
}
@keyframes jit {
  0%, 100% { transform: translateX(0) rotate(0); }
  25% { transform: translateX(-2px) rotate(-.6deg); }
  75% { transform: translateX(2px) rotate(.6deg); }
}
@keyframes seatpulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(55,225,145,.45); }
  50% { box-shadow: 0 0 0 12px rgba(55,225,145,0); }
}
@keyframes grow {
  0% { width: 42%; }
  70%, 88% { width: 97%; }
  100% { width: 42%; }
}
@keyframes rv {
  from { opacity: 0; transform: translateY(46px); }
  to { opacity: 1; transform: none; }
}
@keyframes sx {
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
}
@keyframes loopglow {
  0%, 12% { background: #37E191; color: #06131F; }
  14.3%, 100% { background: rgba(255,255,255,.06); color: #E6EDF3; }
}
@keyframes mq {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
@media (prefers-reduced-motion: reduce) {
  .pop, .fade, .jit, .grow, .mq, .seatpulse, .loop li { animation: none !important; }
  .track { transition: none; }
}

/* ====================================================================
   Global helpers
   ==================================================================== */
.pg img, .pg video { max-width: 100%; height: auto; }
.f { max-width: 100%; font-family: Inter, system-ui, sans-serif; }
textarea.f { resize: vertical; }
.btn { padding-top: 12px; padding-bottom: 12px; line-height: 1.3; text-align: center; }

/* Scroll reveal (IntersectionObserver driven; content stays visible without JS) */
.pg.ready .rv { opacity: 0; transform: translateY(36px); transition: opacity .7s ease, transform .7s cubic-bezier(.2,.7,.2,1); }
.pg.ready .rv.in { opacity: 1; transform: none; }
.pg.ready .sx { transform: scaleX(0); transition: transform 1s cubic-bezier(.65,0,.2,1); }
.pg.ready .sx.in { transform: scaleX(1); }
@media (prefers-reduced-motion: reduce) {
  .pg.ready .rv, .pg.ready .sx { opacity: 1; transform: none; transition: none; }
}



/* ====================================================================
   LARGE MONITORS  (>= 1700px)
   ==================================================================== */
@media (min-width: 1700px) {
  .pg { font-size: 18px; }
  .wrap { max-width: 1440px; padding: 0 40px; }
  .sec { padding: 132px 0; }
  .lead { font-size: 21px; max-width: 800px; }
}
@media (min-width: 2300px) {
  .pg { font-size: 20px; }
  .wrap { max-width: 1680px; }
  .h2 { font-size: 66px; }
}

/* ====================================================================
   SMALL LAPTOPS / LARGE TABLETS LANDSCAPE  (<= 1100px)
   ==================================================================== */
@media (max-width: 1100px) {
  .sec { padding: 92px 0; }
  .navlinks { gap: 16px; }
  .navl { font-size: 14px; }
}

/* ====================================================================
   TABLETS  (<= 900px)
   ==================================================================== */
@media (max-width: 900px) {
  .sec { padding: 72px 0; }
  .rowbtn.on { transform: none; }
  .stick { position: static !important; }
  .h2 { font-size: clamp(30px, 6vw, 46px); }
  .lead { font-size: 18px; }
  .wrap { padding: 0 24px; }
}

/* ====================================================================
   PHONES  (<= 640px)
   ==================================================================== */
@media (max-width: 640px) {
  .pg { font-size: 16px; }
  .wrap { padding: 0 18px; }
  .sec { padding: 56px 0; }
  .lead { font-size: 17px; margin-top: 16px; }
  .eb { font-size: 12px; letter-spacing: .1em; margin-bottom: 14px; }

  /* full-width, thumb-friendly buttons */
  .btn { width: 100%; padding-left: 20px; padding-right: 20px; }
  .btn.b4, .btn.b1, .btn.b2, .btn.b3 { white-space: normal; }

  /* tabs / pills stay compact and wrap */
  .tab, .tabd { min-height: 44px; padding: 0 14px; font-size: 14px; }
  .rowbtn { padding: 12px 16px; font-size: 15px; min-height: 56px; }

  /* cards */
  .card { border-radius: 18px; }
  .seat { min-height: 104px; padding: 16px; }
  .heroboard { padding: 18px !important; border-radius: 20px !important; }

  /* FAQ */
  .faqb { font-size: 16px; min-height: 60px; gap: 12px; }
  .faqa { padding-right: 8px !important; }

  /* marquee chips */
  .mqi { font-size: 20px !important; padding: 8px 18px !important; }

  /* timeline bars: drop the offset so labels never overflow */
  .ganttbar { margin-left: 0 !important; width: 100% !important; min-width: 0 !important; height: auto !important; min-height: 34px; padding: 6px 12px !important; }
  .ganttbar span { white-space: normal !important; }

  /* form */
  .fback.hid { display: none; }
  .pill { min-height: 44px; }

  /* disable hover lift on touch-size screens */
  .btn:hover { transform: none; }
}

/* very small phones */
@media (max-width: 480px) {
  .seat3grid { grid-template-columns: 1fr !important; }
  .heroboard { padding: 14px !important; }
}
@media (max-width: 360px) {
  .wrap { padding: 0 14px; }
}

/* ====================================================================
   Landscape phones: keep the header short
   ==================================================================== */
@media (max-height: 480px) and (orientation: landscape) {
  .sec { padding: 48px 0; }
}

/* ====================================================================
   Dark theme (site-wide .dark class on <html>)
   ==================================================================== */
.dark .pg { background: #07121F !important; color: #EAF0F5 !important; }
.dark .pg .wrap, .dark .pg .sec { color: inherit; }

/* Force all sections with hardcoded light/white/mint backgrounds to adopt dark background in dark mode */
.dark .pg section,
.dark .pg section.sec,
.dark .pg section#why,
.dark .pg section#timeline,
.dark .pg section#industries,
.dark .pg section#software,
.dark .pg section#pricing,
.dark .pg section#who,
.dark .pg section#roles,
.dark .pg section#process,
.dark .pg section#cases,
.dark .pg section#continuity,
.dark .pg section#faq,
.dark .pg section[style*="background: #FFFFFF"],
.dark .pg section[style*="background: rgb(255, 255, 255)"],
.dark .pg section[style*="background:#FFFFFF"],
.dark .pg section[style*="background: #D9F7E6"],
.dark .pg section[style*="background: rgb(217, 247, 230)"] {
  background: #07121F !important;
  color: #EAF0F5 !important;
}

/* Headings in dark mode */
.dark .pg h1,
.dark .pg h2,
.dark .pg h3,
.dark .pg h4,
.dark .pg .d,
.dark .pg .h2 {
  color: #FFFFFF !important;
}

/* Paragraphs & general text */
.dark .pg p,
.dark .pg .lead,
.dark .pg li,
.dark .pg span {
  color: #C9D4DE;
}

.dark .pg .lead {
  color: #C9D4DE !important;
}

/* Monospace & small tags */
.dark .pg .m { color: #9FB0BF !important; }
.dark .pg .eb { color: #49DDB5 !important; }

/* Cards & containers in dark mode */
.dark .pg .card {
  background: #0E1E2C !important;
  border-color: rgba(255, 255, 255, 0.12) !important;
  color: #EAF0F5 !important;
}
.dark .pg .card p,
.dark .pg .card h3,
.dark .pg .card h2,
.dark .pg .card span {
  color: #EAF0F5 !important;
}
.dark .pg .card strong {
  color: #FFFFFF !important;
}
.dark .pg .card .m {
  color: #9FB0BF !important;
}

/* Inner containers that had light background #F2F4F0 */
.dark .pg [style*="background: #F2F4F0"],
.dark .pg [style*="background: rgb(242, 244, 240)"],
.dark .pg [style*="background:#F2F4F0"],
.dark .pg [style*="F2F4F0"],
.dark .pg [style*="242, 244, 240"] {
  background: #0D1D30 !important;
  color: #EAF0F5 !important;
  border-color: rgba(255, 255, 255, 0.12) !important;
}

.dark .pg [style*="F2F4F0"] p,
.dark .pg [style*="242, 244, 240"] p,
.dark .pg [style*="F2F4F0"] span,
.dark .pg [style*="242, 244, 240"] span,
.dark .pg [style*="F2F4F0"] li,
.dark .pg [style*="242, 244, 240"] li {
  color: #C9D4DE !important;
}

.dark .pg [style*="F2F4F0"] .m,
.dark .pg [style*="242, 244, 240"] .m {
  color: #9FB0BF !important;
}

/* Interactive elements */
.dark .pg .rowbtn {
  background: #0E1E2C !important;
  border-color: rgba(255,255,255,.16) !important;
  color: #EAF0F5 !important;
}
.dark .pg .rowbtn:hover { border-color: #49DDB5 !important; }
.dark .pg .rowbtn.on {
  background: #49DDB5 !important;
  border-color: #49DDB5 !important;
  color: #06131F !important;
}
.dark .pg .rowbtn .m { color: #49DDB5 !important; }
.dark .pg .rowbtn.on .m { color: #06131F !important; }

.dark .pg .ck li::before { border-color: #49DDB5 !important; }

.dark .pg .tab {
  color: #C9D4DE !important;
  border-color: rgba(255,255,255,.22) !important;
  background: transparent !important;
}
.dark .pg .tab:hover { border-color: #49DDB5 !important; }
.dark .pg .tab.on {
  background: #37E191 !important;
  border-color: #37E191 !important;
  color: #06131F !important;
}

.dark .pg .rnd {
  color: #EAF0F5 !important;
  border-color: rgba(255,255,255,.35) !important;
}
.dark .pg .rnd:hover {
  background: #EAF0F5 !important;
  color: #06131F !important;
}

.dark .pg .faqb { color: #EAF0F5 !important; }
.dark .pg .faqb span.pm {
  border-color: rgba(255,255,255,.4) !important;
  color: #EAF0F5 !important;
}
.dark .pg .faqb.on span.pm {
  background: #EAF0F5 !important;
  color: #06131F !important;
}

.dark .pg .stepb { color: #9FB0BF !important; }
.dark .pg .stepb b {
  background: #152A3A !important;
  border-color: rgba(255,255,255,.2) !important;
  color: #EAF0F5 !important;
}
.dark .pg .stepb.done b {
  background: #123B3A !important;
  border-color: #49DDB5 !important;
  color: #49DDB5 !important;
}
.dark .pg .stepb.on b {
  background: #EAF0F5 !important;
  border-color: #EAF0F5 !important;
  color: #06131F !important;
}

.dark .pg .seat.off {
  color: #B7C4CE !important;
  border-color: rgba(255,255,255,.28) !important;
}
.dark .pg .seat.on {
  background: #0E1E2C !important;
  border-color: #49DDB5 !important;
  color: #EAF0F5 !important;
}

.dark .pg .dot i { background: rgba(255,255,255,.3) !important; }
.dark .pg .dot.on i { background: #49DDB5 !important; }
.dark .pg .chip.chA { color: #FFD9A0 !important; }

/* Chips in pricing & other sections */
.dark .pg .chip {
  background: #112538 !important;
  border-color: rgba(255, 255, 255, 0.15) !important;
  color: #EAF0F5 !important;
}

/* Bottom CTA section (bright mint) keeps dark text on its mint surface */
.dark .pg section[style*="background: #37E191"],
.dark .pg section[style*="background: rgb(55, 225, 145)"],
.dark .pg section[style*="background:#37E191"] {
  background: #37E191 !important;
  color: #06131F !important;
}
.dark .pg section[style*="background: #37E191"] h2,
.dark .pg section[style*="background: #37E191"] .d,
.dark .pg section[style*="background: #37E191"] p,
.dark .pg section[style*="background: #37E191"] span {
  color: #06131F !important;
}
.dark .pg section[style*="background: #37E191"] .btn.b4 {
  background: #07121F !important;
  color: #FFFFFF !important;
}

/* ====================================================================
   USE CASES SECTION (#cases) — EXACT TEXT CONTRAST IN DARK THEME
   - Cream-colored cards: dark navy text & amber/brown label
   - Mint-colored cards: deep navy text & forest-green label
   - Dark navy backgrounds: bright white headings & light grey body
   ==================================================================== */
.dark .pg #cases .card h3 {
  color: #FFFFFF !important;
}

/* Main dark navy card outer labels & text */
.dark .pg #cases .card > .track .slide > p.m {
  color: #9FB0BF !important;
}
.dark .pg #cases .card > .track .slide > p:not(.m) {
  color: #C9D4DE !important;
}
.dark .pg #cases .card > .track .slide > p:not(.m) strong {
  color: #FFFFFF !important;
}
.dark .pg #cases .card > .track .slide > p:not(.m) span.m {
  color: #9FB0BF !important;
}

/* Cream-colored card ("The situation" / #FFF3DD) in dark theme */
.dark .pg #cases [style*="FFF3DD"],
.dark .pg #cases [style*="255, 243, 221"] {
  background: #FFF3DD !important;
}
.dark .pg #cases [style*="FFF3DD"] p.m,
.dark .pg #cases [style*="255, 243, 221"] p.m {
  color: #7A4F00 !important;
  font-weight: 700 !important;
}
.dark .pg #cases [style*="FFF3DD"] p:not(.m),
.dark .pg #cases [style*="255, 243, 221"] p:not(.m) {
  color: #0A192F !important;
}

/* Middle light grey card ("What is needed" / #F2F4F0) in dark theme */
/* If kept transparent/navy on dark background: */
.dark .pg #cases [style*="F2F4F0"] p.m,
.dark .pg #cases [style*="242, 244, 240"] p.m {
  color: #A9B8C7 !important;
  font-weight: 600 !important;
}
.dark .pg #cases [style*="F2F4F0"] p:not(.m),
.dark .pg #cases [style*="242, 244, 240"] p:not(.m) {
  color: #E6EDF3 !important;
}

/* Mint-colored card ("How the work is divided" / #D9F7E6) in dark theme */
.dark .pg #cases [style*="D9F7E6"],
.dark .pg #cases [style*="217, 247, 230"] {
  background: #D9F7E6 !important;
}
.dark .pg #cases [style*="D9F7E6"] p.m,
.dark .pg #cases [style*="217, 247, 230"] p.m {
  color: #065F3E !important;
  font-weight: 700 !important;
}
.dark .pg #cases [style*="D9F7E6"] p:not(.m),
.dark .pg #cases [style*="217, 247, 230"] p:not(.m) {
  color: #061B28 !important;
}


`;

/* ===== State + content ===== */
/**
 * All state + content for the page.
 * Ported 1:1 from the original class component’s state/renderVals().
 */
const INITIAL = {
  aud: 0, mode: 0, heroAuto: true, who: 0, why: 0, whyAuto: true, fit: {},
  match: 0, role: 0, pattern: 0, hrs: 20, step: 0, uc: 0, ind: 0, sw: 0,
  stage: 0, faq: 0, fstep: 0, sent: false, agree: false, needAgree: false,
  pros: {}, sws: {}, tick: 0,
};

const clock = (tz) => {
  try {
    return new Date().toLocaleTimeString('en-US', { timeZone: tz, hour: '2-digit', minute: '2-digit' });
  } catch (e) {
    return '';
  }
};
const L = (arr) => arr.map((t, i) => ({ t, delay: (i * 0.06).toFixed(2) + 's' }));

function usePageData() {
  const [state, setState] = useState(INITIAL);
  const up = (o) => setState((p) => ({ ...p, ...o }));
  const tog = (key, v) =>
    setState((p) => ({ ...p, [key]: { ...p[key], [v]: !p[key][v] } }));

  // auto-rotating hero board + "why" carousel
  useEffect(() => {
    const id = setInterval(() => {
      setState((p) => {
        const n = { ...p, tick: p.tick + 1 };
        if (p.heroAuto) n.mode = p.mode ? 0 : 1;
        if (p.whyAuto && p.tick % 2 === 1) n.why = (p.why + 1) % 10;
        return n;
      });
    }, 4200);
    return () => clearInterval(id);
  }, []);

  const s = state;
  const set = (o) => () => up(o);
  const sel = (key, i, extra) => ({ on: s[key] === i, cls: s[key] === i ? 'on' : '', pressed: s[key] === i ? 'true' : 'false', pick: set(Object.assign({ [key]: i }, extra || {})) });
  const num = (i) => (i < 9 ? '0' : '') + (i + 1);

  /* HERO */
  const audData = [
    { label: 'CPA & tax firms', line: 'Tax season brings more documents than your team can comfortably process. Choose tax preparers and bookkeepers from our team in India who work inside your procedures, while your authorized US professionals keep review, approval and filing.', laneA: 'Your senior team', routine: ['Organize tax documents', 'Enter return data', 'Prepare draft returns', 'Build workpapers'], senior: ['Technical review', 'Approve & file', 'Client conversations'] },
    { label: 'Bookkeeping firms', line: 'Every new client is good for business and creates recurring work. Choose a dedicated bookkeeper from our team who maintains books, reconciles accounts and prepares reports using your chart of accounts and monthly checklist.', laneA: 'Your senior accountants', routine: ['Categorize transactions', 'Bank & card reconciliations', 'Record vendor bills', 'Monthly report prep'], senior: ['Review the books', 'Client decisions', 'Take on new accounts'] },
    { label: 'Growing businesses', line: 'Not every business needs a full accounting department. Choose a part-time or full-time professional from our team to maintain your books, process invoices, reconcile accounts or support payroll, based on the actual work you need done.', laneA: 'Your finance lead', routine: ['Process invoices', 'Reconcile bank accounts', 'Prepare payroll inputs', 'Month-end schedules'], senior: ['Review results', 'Approve payments', 'Financial decisions'] }
  ];
  const A = audData[s.aud];
  const auds = audData.map((a, i) => Object.assign({ label: a.label }, sel('aud', i)));
  const modeB = s.mode === 1;

  /* WHO */
  const whoData = [
    { label: 'US CPA Firms', h: 'Additional capacity, inside your established procedures.', p: 'You already have clients, established processes and a team responsible for reviewing and delivering accounting services. What you need is additional capacity. Choose tax preparers, bookkeepers, staff accountants and other accounting professionals from our existing team, ready to work within your firm’s established procedures.', useLabel: 'You can use them for', uses: ['Individual and business tax preparation support', 'Monthly bookkeeping', 'Bank and credit card reconciliations', 'General ledger maintenance', 'Financial statement preparation', 'Tax workpaper organization', 'Accounts payable and receivable', 'Seasonal accounting support'], cta: 'Hire Professionals for My CPA Firm' },
    { label: 'Tax Preparation Firms', h: 'More preparation capacity when deadlines tighten.', p: 'Tax season brings more work, tighter deadlines and greater pressure on existing staff. If your team is spending too much time organizing documents, preparing draft returns and handling repetitive preparation work, additional professionals may help distribute the workload.', useLabel: 'We match you based on', uses: ['The tax forms your firm prepares', 'The tax software you use', 'The level of preparation experience you require'], cta: 'Find Tax Preparation Professionals' },
    { label: 'Bookkeeping & Accounting Firms', h: 'Recurring work needs recurring capacity.', p: 'Adding more clients is good for business, but every new account also creates recurring work. Choose professionals from our team who can support that workload, with no recruitment process for you to manage.', useLabel: 'Someone who can', uses: ['Maintain client books', 'Reconcile accounts', 'Prepare reports', 'Follow your existing bookkeeping procedures'], cta: 'Build My Bookkeeping Team' },
    { label: 'Small & Medium-Sized Businesses', h: 'The right amount of accounting help, not a whole department.', p: 'Not every business needs a full accounting department. Depending on your workload, a part-time or full-time professional may be a more suitable arrangement than hiring an entire local department.', useLabel: 'You might simply need someone to', uses: ['Maintain your books', 'Process invoices', 'Reconcile bank accounts', 'Prepare monthly financial information'], cta: 'Hire an Accountant for My Business' },
    { label: 'Fractional CFO & Advisory Firms', h: 'Keep senior time on analysis and advice.', p: 'Your senior team should be spending time on financial analysis, business decisions and client advisory work, not getting stuck preparing every schedule and reconciliation. An accountant or financial analyst can support the underlying accounting work.', useLabel: 'How the work divides', uses: ['The professional prepares schedules and reconciliations', 'Your senior professionals review results', 'Your senior professionals advise clients'], cta: 'Find Accounting Support' },
    { label: 'Growing Outsourced Accounting Businesses', h: 'Plan a team with different specializations.', p: 'If your own accounting practice is expanding, you may need multiple professionals with different specializations. We can help you plan which professionals to add from our team as your requirements grow.', useLabel: 'Team planning for', uses: ['Bookkeepers', 'Accountants', 'Payroll specialists', 'Tax preparers', 'Senior review positions'], cta: 'Plan My Accounting Team' }
  ];
  const who = whoData.map((w, i) => Object.assign({}, w, { num: num(i), uses: L(w.uses) }, sel('who', i)));

  /* WHY */
  const whyData = [
    ['Your accounting workload is growing faster than your team.', 'New clients and responsibilities arrive, but the team is the same size. Bookkeeping, reconciliations, tax preparation and reporting compete for everyone’s time.', 'Add bookkeepers, accountants or tax professionals from our team to handle defined responsibilities and distribute the workload.', 'Your CPA firm adds 20 new bookkeeping clients. Instead of loading your existing accountants, you choose a dedicated bookkeeper from our team for the additional accounts.'],
    ['Hiring experienced accounting professionals locally is expensive.', 'Salary, recruitment expenses, benefits, employment costs, training and overheads. For smaller firms, another local full-time employee may not make commercial sense.', 'Our team in India gives you experienced professionals who are ready to start. Evaluate the total engagement cost against local hiring. The objective is not the cheapest person, but skills and cost that make sense for the work.', 'A US bookkeeping firm needs QuickBooks support without another local full-time position. It explores a dedicated professional in India with relevant software experience.'],
    ['Your senior accountants are spending too much time on routine work.', 'Hours go into categorizing transactions, organizing documents, preparing routine schedules and chasing missing information instead of work that needs judgement.', 'Divide responsibilities by complexity. An offshore professional handles assigned preparation; your senior team reviews, corrects, interprets and approves.', 'A senior accountant spends 12 hours each week on reconciliations and workpapers. A dedicated accountant prepares those schedules under your procedures.'],
    ['Tax season creates more work than your existing team can handle.', 'Documents arrive at different times, new clients come in, and deadlines remain fixed. Permanent hires just for seasonal demand may not be practical.', 'Add tax preparation professionals from our team for an agreed period. Your authorized US tax professionals keep technical review, approval and filing.', 'A practice handling 500 individual returns a year sees a sharp increase between January and April and adds preparers from our team for that period.'],
    ['You need a specific skill, not another general accountant.', 'The team exists, but nobody is experienced in multi-entity accounting, payroll reconciliations, US tax preparation, QuickBooks cleanup or financial reporting.', 'Choose a professional who already has the exact role and experience you need, rather than hiring someone and hoping they learn everything after joining.', 'A firm with three bookkeepers needs someone experienced in business tax preparation using Drake or ProConnect, and chooses a professional with exactly that experience.'],
    ['Your business needs accounting support, but not a full-time employee.', 'Bookkeeping for 15 hours a week, payroll support twice a month, or a temporary backlog does not justify a full-time position.', 'Part-time and project-based arrangements define the hours, responsibilities and duration before hiring.', 'A US consulting business needs about 20 hours of bookkeeping support each week. A part-time dedicated bookkeeper may fit better than a full-time accountant.'],
    ['Recruitment is taking too much of your time.', 'Job descriptions, vacancies, resumes, interviews, skills checks and joining dates consume management time, and the selected candidate may still lack practical experience.', 'Skip it. Our team is already in place. Tell us the work, meet the professionals we match to it, and choose.', 'A managing partner needs another senior bookkeeper but cannot spend several weeks on recruitment. They choose one from our team and work begins after onboarding.'],
    ['Your team is becoming dependent on a few key employees.', 'When work depends on one or two people, a short absence delays monthly closing, leaves reconciliations incomplete and makes documentation hard to follow.', 'An additional professional takes on documented workflows and recurring assignments. Proper SOPs, documentation and handover procedures matter just as much.', 'A second professional follows the documented month-end checklist, so closing no longer depends on one person being available.'],
    ['You want to expand without building every function locally.', 'A whole new local team means recruitment, employment costs, training, infrastructure and management growing at the same rate as revenue.', 'Offshore staffing adds professionals in India while your business retains its client relationships and established operating model.', 'A bookkeeping company plans to grow from 40 to 70 accounts, adding bookkeepers and a senior accountant from our team as the workload increases.'],
    ['You need more time for clients and business development.', 'Often the biggest underlying reason. When you are personally involved in every transaction and reconciliation, growth becomes difficult.', 'Distribute routine accounting responsibilities among appropriately selected professionals and spend your time where you are directly needed.', 'A CPA firm owner delegates defined bookkeeping responsibilities and focuses on client advisory, technical review and business development.']
  ];
  const why = whyData.map((y, i) => ({ n: num(i), t: y[0], prob: y[1], help: y[2], ex: y[3], hidden: s.why === i ? 'false' : 'true' }));
  const goWhy = (d) => () => up({ why: (s.why + d + 10) % 10, whyAuto: false });

  const fitData = ['You have recurring accounting work that needs additional capacity.', 'Local hiring costs do not fit your budget.', 'You need a specific accounting or tax skill.', 'Your senior team is overloaded with routine preparation work.', 'Your workload increases during particular months.', 'You want a professional who can work with your existing systems.', 'You have established processes and someone available to supervise the work.'];
  const fit = fitData.map((t, i) => ({ t: t, on: !!s.fit[i], tog: () => tog('fit', i) }));
  const fitN = fit.filter((q) => q.on).length;
  const fitMsg = fitN === 0 ? '0 of 7 ticked' : fitN + ' of 7 apply to you. It makes sense to explore dedicated staffing.';

  /* MATCH */
  const matchData = [['Too many monthly bookkeeping accounts', 'Dedicated Bookkeeper', 'Transaction recording and reconciliations'], ['Tax season workload', 'Tax Preparer', 'Assigned tax preparation work'], ['Delayed monthly closing', 'Staff Accountant', 'Journal entries and account reconciliations'], ['Payroll administration workload', 'Payroll Specialist', 'Payroll inputs and reporting support'], ['Unpaid invoices and vendor bills', 'AP/AR Specialist', 'Invoice and receivable management'], ['Incomplete financial schedules', 'Senior Accountant', 'Reporting and reconciliation preparation'], ['Accounting backlog', 'Project-Based Bookkeeper', 'Historical bookkeeping cleanup'], ['Too much senior accountant workload', 'Junior / Mid-Level Accountant', 'Routine preparation tasks']];
  const match = matchData.map((r, i) => Object.assign({ c: r[0], p: r[1], r: r[2] }, sel('match', i)));

  /* ROLES */
  const roleData = [
    { label: 'US Tax Preparers', intro: 'If your firm handles individual and business tax returns, you may need additional preparation capacity. We match you with team members by the returns they have worked on, their software experience and their level of responsibility.', pos: ['Individual Tax Return Preparer', 'Business Tax Return Preparer', 'Tax Associate', 'Senior Tax Preparer', 'Tax Reviewer', 'Tax Workpaper Specialist', 'Seasonal Tax Preparation Professional'], workLabel: 'What can they work on? Depending on experience', work: ['Form 1040 and associated schedules', 'Form 1065 partnership returns', 'Form 1120-S S corporation returns', 'Form 1120 C corporation returns', 'Tax document organization', 'Supporting schedules and workpapers', 'Identifying missing information', 'Preparing draft returns for review', 'Addressing reviewer comments'], sw: 'Drake Tax, ProConnect, UltraTax CS, CCH Axcess, CCH ProSystem fx, ProSeries and Lacerte.', ex: 'Your firm receives 150 individual returns during filing season. Tax preparation professionals handle assigned preparation tasks while your authorized US tax professionals retain technical oversight, required review and filing responsibilities.', cta: 'Hire a US Tax Preparer' },
    { label: 'Dedicated Bookkeepers', intro: 'Bookkeeping is not just entering transactions into software. A good bookkeeper understands how transactions affect accounts, how reconciliations work and why the books must be accurate before reports are prepared.', pos: ['Junior Bookkeeper', 'US Bookkeeping Specialist', 'QuickBooks Bookkeeper', 'Full-Charge Bookkeeper', 'Senior Bookkeeper', 'Bookkeeping Team Lead'], workLabel: 'Typical responsibilities', work: ['Recording and categorizing transactions', 'Bank and credit card reconciliations', 'Recording bills and customer invoices', 'Accounts payable and receivable support', 'Vendor and customer statement reconciliation', 'Maintaining bookkeeping records', 'Identifying unmatched or unusual transactions', 'Preparing monthly reports', 'Supporting month-end closing'], sw: 'QuickBooks Online, QuickBooks Desktop, Xero, Sage and other accounting platforms.', ex: 'You manage 25 small business clients. A dedicated bookkeeper handles assigned accounts using your chart of accounts, monthly checklist and reporting procedures. Your senior accountant reviews the completed work.', cta: 'Hire a Dedicated Bookkeeper' },
    { label: 'Accountants & Senior Accounting Professionals', intro: 'When your business grows, basic bookkeeping may no longer be enough. You may need someone who understands general ledger accounting, adjusting entries, balance sheet reconciliations, accruals and monthly reporting.', pos: ['Staff Accountant', 'General Ledger Accountant', 'Senior Accountant', 'Accounting Analyst', 'Financial Reporting Accountant', 'Reconciliation Specialist', 'Accounting Team Lead'], workLabel: 'Typical responsibilities', work: ['Journal entries', 'Accruals and prepayments', 'General ledger maintenance', 'Balance sheet reconciliations', 'Fixed asset schedules', 'Revenue and expense accounting', 'Intercompany reconciliations', 'Month-end and year-end close support', 'Trial balance review', 'Financial statement preparation'], sw: '', ex: 'Your business operates through multiple entities with monthly reporting. An experienced accountant prepares the schedules and maintains the general ledger. Your finance manager retains review and financial decisions.', cta: 'Hire an Accountant' },
    { label: 'Payroll Specialists', intro: 'Payroll requires accuracy, confidentiality and an understanding of the company’s payroll processes. Add professionals from our team to support payroll administration and related accounting work.', pos: ['Payroll Administrator', 'Payroll Processing Specialist', 'Payroll Accountant', 'Payroll Reconciliation Specialist', 'Multi-State Payroll Support Professional'], workLabel: 'Typical responsibilities', work: ['Preparing payroll inputs', 'Checking timesheets and employee changes', 'Reviewing payroll registers', 'Supporting payroll reconciliations', 'Maintaining payroll-related records', 'Preparing payroll reports', 'Coordinating information for payroll tax processes', 'Supporting payroll accounting entries'], sw: 'ADP, Gusto, Paychex, Rippling, Paylocity and UKG.', ex: 'Your business has 80 employees and runs payroll twice a month. A payroll specialist organizes information, verifies inputs and prepares reconciliation schedules under your approved procedures. The employer and authorized payroll personnel retain approval and legal responsibilities.', cta: 'Hire a Payroll Specialist' },
    { label: 'Accounts Payable & Receivable Professionals', intro: 'If your business handles a high volume of invoices and payments, you may need dedicated AP/AR support.', pos: ['Accounts Payable Specialist', 'Accounts Receivable Specialist', 'Billing Specialist', 'Cash Application Specialist', 'Collections Support Professional'], workLabel: 'Typical responsibilities', work: ['Vendor invoice processing', 'Invoice data verification', 'Vendor statement reconciliation', 'Payment preparation support', 'Customer invoicing', 'Payment allocation', 'Accounts receivable aging', 'Outstanding payment follow-ups', 'Billing records and reporting'], sw: '', ex: 'Your construction company receives hundreds of invoices every month. An AP specialist organizes invoices, verifies required documentation and prepares payment schedules for authorized approval.', cta: 'Hire AP/AR Professionals' },
    { label: 'Specialized Accounting & Finance Professionals', intro: 'Some businesses need skills beyond regular bookkeeping and accounting. These roles require a more specific assessment of practical experience, technical knowledge and the level of responsibility involved.', pos: ['Sales Tax Support Specialists', 'Form 1099 Preparation Support', 'Audit Documentation Specialists', 'Financial Analysts', 'Budgeting and Forecasting Analysts', 'Controller Support Professionals', 'Multi-Entity Accounting Specialists', 'Accounting Cleanup Professionals'], workLabel: 'How we approach these roles', work: ['Assessment of practical experience', 'Assessment of technical knowledge', 'Clarity on the level of responsibility', 'Availability confirmed position by position'], sw: '', ex: '', cta: 'Discuss a Specialized Role' }
  ];
  const roles = roleData.map((r, i) => Object.assign({}, r, { num: num(i), pos: L(r.pos), work: L(r.work), hasSw: !!r.sw, hasEx: !!r.ex }, sel('role', i)));

  /* MODELS */
  const patterns = ['Ongoing, every week', 'Seasonal peaks', 'One defined project'].map((l, i) => Object.assign({ label: l }, sel('pattern', i)));
  const rec = s.pattern === 0 ? (s.hrs > 25 ? 0 : 1) : 2;
  const modelData = [
    { name: 'Full-Time Dedicated Professional', for: 'For businesses with ongoing work and a regular workload.', desc: 'Works an agreed full-time schedule and is assigned primarily or exclusively to your engagement, depending on the contract. You assign daily tasks, set priorities and integrate them into your workflow.', ex: 'A CPA firm managing bookkeeping for 40 small businesses hires one dedicated bookkeeper who becomes familiar with its clients, procedures and reporting expectations.', inc: ['Agreed full-time working hours', 'A named professional', 'Defined responsibilities', 'Regular communication', 'Client-specific SOPs and reporting', 'Ongoing work continuity', 'Employment and HR support as contracted'], when: ['You have work throughout the month', 'The role requires consistent attention', 'You want someone familiar with your processes', 'You expect the workload to continue long term'], cta: 'Discuss Full-Time Hiring' },
    { name: 'Part-Time Dedicated Professional', for: 'For businesses with recurring but limited work.', desc: 'Works a predefined number of hours per week or month. You get an agreed level of availability without committing to a full-time schedule.', ex: 'A small consulting company needs about 20 hours of bookkeeping support each week: transaction recording, bank reconciliation, invoice organization and monthly reporting.', inc: ['Fixed weekly or monthly hours', 'An agreed work schedule', 'Defined responsibilities', 'Regular task updates', 'A named professional where agreed', 'Scope and availability reviewed as needed'], when: ['Your work is recurring but limited', 'You have a predictable monthly workload', 'You do not need full-time availability', 'You want continuity without full-time staffing'], cta: 'Discuss Part-Time Hiring' },
    { name: 'Flexible Hybrid & Project-Based Hiring', for: 'For changing workloads, seasonal demand or specific projects.', desc: 'Three people for tax season, an accountant for a cleanup project, or extra support during a month-end backlog. Resources may be shared, project-allocated or dedicated for a defined period, depending on the agreement.', ex: 'A US tax firm takes on two tax preparers from our team for an agreed seasonal period. They handle assigned preparation work while the senior team manages technical review and filing.', inc: ['Project-specific or seasonal allocation', 'Defined deliverables and timelines', 'Agreed resource availability', 'Temporary capacity for increased workload', 'Scope-based commercial arrangements', 'A possibility of moving into a recurring engagement'], when: ['You need temporary support', 'Your workload changes during the year', 'You have a backlog to clear', 'You need specific skills for a defined project'], cta: s.pattern === 1 ? 'Request Seasonal Staffing' : 'Request Project-Based Staffing' }
  ];
  const models = modelData.map((m, i) => Object.assign({}, m, { num: i + 1, on: rec === i, inc: L(m.inc), when: L(m.when), bd: rec === i ? '#37E191' : 'rgba(255,255,255,.16)', bg: rec === i ? 'rgba(55,225,145,.1)' : 'transparent' }));
  const cells = []; for (let i = 0; i < 40; i++) cells.push({ bg: i < s.hrs ? '#37E191' : 'rgba(255,255,255,.1)' });
  const mh = [92, 96, 100, 88, 34, 30, 28, 30, 40, 46, 30, 34];
  const months = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'].map((l, i) => ({ l: l, h: mh[i] + '%', bg: i < 4 ? '#FFB84D' : 'rgba(255,255,255,.22)', delay: (i * 0.05).toFixed(2) + 's' }));

  /* PROCESS */
  const T = 'Smart Tax Expertss', Y = 'You', B = 'You + Smart Tax Expertss';
  const stepData = [
    ['Tell us the work', B, 'One conversation about what you need done. No recruitment brief, no job description to write.', 'We want to understand', ['What type of business you operate', 'The role and what the professional will do every day', 'Which software they must know', 'Working hours and US time-zone overlap', 'Full-time, part-time or project-based', 'When you want to start'], 'A clear requirement we can match against our team.'],
    ['We match professionals from our team', T, 'We already have the people. Instead of sourcing and screening strangers, we put forward professionals from our own team whose experience fits your work.', 'For each professional you see', ['Role and experience', 'US accounting or tax exposure', 'Tax forms and return types handled, where relevant', 'Software they have actually worked on', 'Availability and working hours'], 'Matched professionals to choose from, not a pile of resumes.'],
    ['You choose your professional', Y, 'This is your call. Speak with the professionals we put forward and pick the one you want on your work. You are never required to accept someone simply because we suggested them.', 'You can', ['Meet the professional', 'Ask technical questions', 'Explain your internal processes', 'Decide whether they fit your team'], ''],
    ['Onboarding to your procedures', B, 'Before handling live work, the professional learns how your business operates. Access to sensitive information is provided only after the applicable legal, contractual and security requirements are satisfied.', 'This may involve', ['Software access and training', 'Accounting procedures and client-specific SOPs', 'Reporting formats and task management tools', 'Communication channels', 'Review, approval and escalation processes', 'Security and confidentiality instructions'], ''],
    ['Work starts', B, 'The professional begins working to the agreed schedule and responsibilities, as an extension of your team.', 'In a dedicated staffing arrangement', ['Your team assigns the work', 'Your team manages day-to-day priorities', 'You review and approve the work', 'We handle the employment and HR support included in your agreement'], '']
  ];
  const steps = stepData.map((d, i) => Object.assign({ num: i + 1, t: d[0], lead: d[1], leadBg: d[1] === Y ? '#FFB84D' : (d[1] === T ? '#37E191' : '#CFE0F5'), p: d[2], listLabel: d[3], list: L(d[4]), get: d[5], hasGet: !!d[5], aria: 'Step ' + (i + 1) + ': ' + d[0] }, sel('step', i), { cls: s.step === i ? 'on' : (i < s.step ? 'done' : '') }));

  const gantt = [
    ['Share your requirement', '0%', '20%', 'One conversation', '#37E191', ''],
    ['We match professionals from our team', '16%', '24%', 'No sourcing or screening stage', '#37E191', ''],
    ['You meet and choose', '36%', '26%', 'Depends on your availability', '#FFB84D', 'hatch'],
    ['Onboarding and system access', '58%', '26%', 'Depends on your systems and security setup', '#FFB84D', 'hatch'],
    ['Work starts', '82%', '18%', 'Agreed start date', '#9BF0C6', '']
  ].map((g) => ({ t: g[0], l: g[1], w: g[2], est: g[3], bg: g[4], cls: g[5] }));

  /* USE CASES */
  const caseData = [
    ['A CPA firm that needs more tax preparers', 'An established team of five handles individual and business returns. As deadlines approach, more documents arrive than the team can comfortably process, and seniors spend too long on initial preparation.', 'Two tax preparers with relevant individual and business tax preparation experience.', 'Offshore professionals prepare assigned draft work. The firm instructs and reviews. Authorized US professionals handle approvals and filing. The firm retains its client relationships.', 'Flexible seasonal or full-time dedicated hiring'],
    ['A bookkeeping firm that has taken on more clients', 'The firm adds 15 new monthly clients: transaction recording, bank reconciliations, vendor bills and monthly reports. The existing team is struggling to finish on schedule.', 'A dedicated QuickBooks bookkeeper, assessed on reconciliations, categorization and monthly bookkeeping.', 'The professional manages assigned bookkeeping using the firm’s procedures. The senior accountant reviews the work and handles client-specific decisions.', 'Full-time dedicated hiring'],
    ['An e-commerce business that needs better financial records', 'An online retailer is paid through multiple gateways and marketplaces. Sales, refunds, platform fees and settlements are not always easy to reconcile.', 'An accountant or bookkeeper with relevant e-commerce reconciliation experience.', 'The professional prepares settlement reconciliations, records assigned transactions and organizes supporting schedules. The finance manager reviews the results.', 'Full-time or part-time dedicated hiring'],
    ['A US business that needs payroll support', 'A company with a regular payroll cycle spends considerable time collecting employee information, checking payroll inputs and preparing reports.', 'A payroll specialist familiar with its payroll software and procedures.', 'The professional supports data preparation, register checks and reconciliations. Authorized personnel retain payroll approval and the employer’s legal obligations.', 'Part-time or full-time dedicated hiring'],
    ['A firm with months of bookkeeping backlog', 'Several client accounts are behind on reconciliations and transaction recording. The firm wants them up to date before normal monthly reporting continues.', 'A bookkeeping cleanup specialist for a defined period, with accounts, periods, software, outputs and deadlines defined before work starts.', 'The professional works through the backlog, identifies missing information and prepares the accounts for review.', 'Project-based staffing'],
    ['A fractional CFO firm that needs reporting support', 'Too much senior time goes into preparing reconciliations, organizing schedules and compiling financial data.', 'An experienced accountant or financial analyst with general ledger, reporting and spreadsheet-based analysis experience.', 'The professional prepares financial schedules and reports. The CFO team reviews, interprets the numbers and provides strategic recommendations.', 'Full-time or part-time dedicated hiring']
  ];
  const cases = caseData.map((c, i) => Object.assign({ num: num(i), t: c[0], sit: c[1], need: c[2], split: c[3], model: c[4], hidden: s.uc === i ? 'false' : 'true', aria: 'Use case ' + (i + 1) }, sel('uc', i)));

  /* INDUSTRIES + SOFTWARE */
  const indData = [['CPA, Tax & Accounting Firms', 'Tax preparation, bookkeeping, general ledger accounting, reconciliation, workpaper preparation, financial reporting and accounting support.'], ['E-Commerce & Retail', 'Marketplace reconciliation, payment gateway settlements, sales recording, refunds, inventory-related accounting and monthly reporting.'], ['Real Estate & Property Management', 'Rental income tracking, property-level bookkeeping, vendor payments, expense recording and financial reporting.'], ['Healthcare Practices', 'Bookkeeping, expense recording, vendor accounting, payroll administration support and reporting, with appropriate privacy and access controls.'], ['Construction & Contracting', 'Vendor invoices, accounts payable, job-cost accounting support, project expense tracking, billing support and reconciliations.'], ['Professional Services', 'Client billing, time-based invoicing, expense recording, accounts receivable, monthly bookkeeping and profitability reporting.'], ['Restaurants & Hospitality', 'Daily sales reconciliation, vendor accounting, payroll-related accounting, expense classification and financial reporting.'], ['Technology & SaaS', 'Subscription billing reconciliation, deferred revenue support, expense accounting, general ledger maintenance and monthly financial reporting.'], ['Manufacturing & Distribution', 'Purchasing records, inventory-related accounting, vendor reconciliation, cost schedules and financial reporting.'], ['Nonprofit Organizations', 'Fund accounting support, grant-related transaction tracking, reconciliations and reporting preparation, subject to the candidate’s relevant experience.']];
  const inds = indData.map((n, i) => Object.assign({ label: n[0], text: n[1] }, sel('ind', i)));
  const swData = [
    ['US Tax Preparation Software', ['Drake Tax', 'Intuit ProConnect Tax', 'Thomson Reuters UltraTax CS', 'CCH ProSystem fx Tax', 'CCH Axcess Tax', 'Intuit ProSeries', 'Intuit Lacerte', 'TaxSlayer Pro'], 'Individual and business tax preparation, supporting schedules, workpapers, document organization and draft return preparation.'],
    ['Bookkeeping & Accounting Software', ['QuickBooks Online', 'QuickBooks Desktop', 'Xero', 'Sage', 'NetSuite', 'Microsoft Dynamics', 'Zoho Books'], 'Transaction recording, reconciliations, general ledger maintenance, accounts payable, accounts receivable and monthly financial reporting.'],
    ['Payroll Software', ['ADP', 'Gusto', 'Paychex', 'Rippling', 'Paylocity', 'UKG', 'OnPay'], 'Payroll input preparation, employee information updates, payroll register checks, payroll reporting and reconciliation support.'],
    ['Practice Management & Workflow', ['TaxDome', 'Karbon', 'Canopy', 'ShareFile', 'SmartVault', 'Microsoft 365', 'Trello', 'Asana'], 'Client document organization, task management, internal coordination, workflow tracking and review management.'],
    ['Reporting & Productivity Tools', ['Microsoft Excel', 'Google Sheets', 'Microsoft Power BI', 'Google Workspace', 'Microsoft Teams', 'Zoom'], 'Depending on the position, experience with reporting, spreadsheet and communication tools may also be required.']
  ];
  const sws = swData.map((w, i) => Object.assign({ label: w[0], names: L(w[1]), work: w[2] }, sel('sw', i)));
  const mqNames = ['Drake Tax', 'QuickBooks Online', 'ADP', 'UltraTax CS', 'Xero', 'Gusto', 'CCH Axcess', 'Sage', 'Paychex', 'Lacerte', 'NetSuite', 'TaxDome', 'ProSeries', 'Karbon'];
  const marquee = mqNames.concat(mqNames).map((t) => ({ t: t }));

  /* TEAM */
  const stageData = [
    ['Start with one professional', 'You might begin with one bookkeeper, accountant or tax preparer. Define the role, responsibilities, working hours and reporting process.', [], [0]],
    ['Establish your workflow', 'Once the professional starts, establish:', ['Daily and weekly responsibilities', 'Reporting expectations', 'Work allocation', 'Review procedures', 'Communication schedules', 'Performance indicators'], [0]],
    ['Add specialized professionals', 'As work increases, you may need different skills. A CPA firm may start with one bookkeeper and later add a tax preparer or payroll specialist.', [], [0, 3, 4]],
    ['Introduce senior review or coordination', 'When the team becomes larger, you may need a senior accountant, tax reviewer or team lead to coordinate work and support technical oversight.', [], [0, 3, 4, 5]],
    ['Build a structured offshore accounting team', 'An example team for a growing accounting practice: two dedicated bookkeepers, one senior accountant, one tax preparer, one payroll specialist and one senior reviewer or team lead.', [], [0, 1, 2, 3, 4, 5]]
  ];
  const stages = stageData.map((g, i) => Object.assign({ num: i + 1, t: g[0], p: g[1], list: L(g[2]), hasList: g[2].length > 0 }, sel('stage', i)));
  const filled = stageData[s.stage][3];
  const seats = ['Dedicated bookkeeper', 'Dedicated bookkeeper', 'Senior accountant', 'Tax preparer', 'Payroll specialist', 'Senior reviewer / team lead'].map((r, i) => ({ role: r, cls: filled.indexOf(i) > -1 ? 'on' : 'off', state: filled.indexOf(i) > -1 ? 'Filled' : 'Open seat' }));

  /* FAQ */
  const faqData = [
    ['Can I hire just one accountant or bookkeeper?', 'Yes. You can begin with one professional. You do not need to hire an entire team.'],
    ['Do I have to go through resumes and screening?', 'No. Our team is already in place. You tell us the work, we put forward professionals from our team who fit it, and you choose. There are no job posts, resume rounds or screening stages on your side.'],
    ['Can I meet the professionals before choosing?', 'Yes. You can speak with the professionals we put forward and ask your own technical questions. The final choice is yours.'],
    ['Do you only have US tax preparers?', 'No. Our team includes bookkeepers, accountants, payroll specialists, AP/AR professionals, financial analysts and other accounting-related roles.'],
    ['Can I hire someone with QuickBooks Online experience?', 'Yes. Tell us QuickBooks Online is mandatory and we will match you with professionals who have practical experience on it.'],
    ['Can I request someone experienced in Form 1040 or business tax returns?', 'Yes. You can specify whether you need individual tax preparation, partnership returns, S corporation returns or C corporation returns, and we match on that specific experience.'],
    ['Can the professional work during US business hours?', 'You can specify the required time-zone overlap and schedule. Availability will depend on the candidate and the agreed employment arrangement.'],
    ['Who manages the professional’s daily work?', 'In a client-managed dedicated staffing model, your business generally assigns tasks, sets priorities and reviews the work. Employment and HR responsibilities are handled according to the actual contractual arrangement.'],
    ['Who is the legal employer?', 'The employing entity depends on the engagement structure. If Smart Tax Expertss or its designated Indian entity employs the professional, that entity’s employment responsibilities should be documented in the agreement.'],
    ['Can I hire someone for only three or six months?', 'A fixed-term or project-based arrangement can be discussed, subject to candidate availability, applicable employment requirements and contractual terms.'],
    ['Can I increase working hours later?', 'Potentially, yes. Any change depends on the professional’s availability and the revised commercial and employment arrangements.'],
    ['What happens if the professional leaves?', 'The agreed continuity process should cover notice, handover, access revocation and a replacement from our team. The actual replacement terms and timeframes will be specified in your agreement.'],
    ['Can I use my existing accounting and tax software?', 'Yes, subject to technical feasibility, licensing and security requirements. You can specify the platforms candidates should know.'],
    ['Do you provide tax return review and filing?', 'This page focuses on dedicated staffing. Preparation, review and filing services are separate scopes. Any review or filing responsibility must be specifically agreed and carried out by appropriately authorized professionals.'],
    ['Will my business and customer information remain confidential?', 'Confidentiality obligations and appropriate security arrangements should be established before access is granted. US tax information may also require specific legal authorization for offshore disclosure.'],
    ['Is dedicated staffing the same as outsourcing accounting services?', 'No. In dedicated staffing, a professional works with your business under an agreed staffing and management arrangement. In managed accounting outsourcing, the service provider takes responsibility for a defined scope of work and delivery. We can discuss which structure is more appropriate for your requirements.'],
    ['How quickly can work start?', 'Because the team already exists, there is no sourcing or screening stage. The start date depends on how soon you can meet and choose, the availability of the professional you want, and onboarding and system access. We can give you a realistic start date after understanding your requirements.']
  ];
  const faqs = faqData.map((f, i) => ({ q: f[0], a: f[1], open: s.faq === i, cls: s.faq === i ? 'on' : '', tog: set({ faq: s.faq === i ? -1 : i }) }));

  /* FORM */
  const pill = (key, arr) => arr.map((t) => ({ t: t, on: !!s[key][t], cls: s[key][t] ? 'on' : '', tog: () => tog(key, t) }));
  const fNames = ['Part A of 4 · Your business', 'Part B of 4 · Your hiring requirement', 'Part C of 4 · The work', 'Part D of 4 · Budget and extras'];
  const show = (i) => (s.fstep === i ? 'block' : 'none');

  return {
    clockUS: clock('America/New_York'), clockIN: clock('Asia/Kolkata'),
    auds: auds, audLine: A.line, laneA: A.laneA, routine: L(A.routine), senior: L(A.senior),
    modeA: !modeB, modeB: modeB, modeAcls: modeB ? '' : 'on', modeBcls: modeB ? 'on' : '',
    setModeA: set({ mode: 0, heroAuto: false }), setModeB: set({ mode: 1, heroAuto: false }),
    meterW: modeB ? '22%' : '86%', meterC: modeB ? '#37E191' : '#FFB84D', meterLabel: modeB ? 'Lower' : 'High',
    boardNote: modeB ? 'Preparation moves to the dedicated seat. Review, approval and client relationships stay with your team.' : 'Routine preparation crowds out the work that needs senior judgement.',
    who: who,
    why: why, whyShift: '-' + (s.why * 100) + '%', whyPct: ((s.why + 1) * 10) + '%', whyCount: num(s.why) + ' / 10', whyPrev: goWhy(-1), whyNext: goWhy(1),
    fit: fit, fitMsg: fitMsg,
    match: match, roles: roles,
    patterns: patterns, isOngoing: s.pattern === 0, isSeasonal: s.pattern === 1, isProject: s.pattern === 2,
    hrs: s.hrs, setHrs: (e) => up({ hrs: Number(e.target.value) }), cells: cells, months: months, models: models,
    steps: steps, stepPct: (s.step / 4 * 100) + '%', stepPrev: set({ step: (s.step + 4) % 5 }), stepNext: set({ step: (s.step + 1) % 5 }),
    gantt: gantt,
    cases: cases, ucShift: '-' + (s.uc * 100) + '%', ucPrev: set({ uc: (s.uc + 5) % 6 }), ucNext: set({ uc: (s.uc + 1) % 6 }),
    inds: inds, sws: sws, marquee: marquee,
    stages: stages, seats: seats, seatAria: 'Team board showing ' + filled.length + ' of 6 seats filled',
    faqs: faqs,
    sent: s.sent, notSent: !s.sent, fsteps: [0, 1, 2, 3].map((i) => ({ bg: i <= s.fstep ? '#37E191' : 'rgba(255,255,255,.16)' })), fLabel: fNames[s.fstep],
    dA: show(0), dB: show(1), dC: show(2), dD: show(3),
    proPills: pill('pros', ['US Tax Preparer', 'Senior Tax Preparer / Reviewer', 'Bookkeeper', 'QuickBooks Specialist', 'Staff Accountant', 'Senior Accountant', 'Payroll Specialist', 'Accounts Payable Specialist', 'Accounts Receivable Specialist', 'Financial Reporting Professional', 'Other']),
    swPills: pill('sws', ['QuickBooks Online', 'QuickBooks Desktop', 'Xero', 'Drake Tax', 'ProConnect', 'UltraTax', 'ProSeries', 'CCH', 'Lacerte', 'ADP', 'Gusto', 'Paychex', 'Other', 'No Specific Software Requirement']),
    agree: s.agree, togAgree: () => up({ agree: !s.agree, needAgree: false }), needAgree: s.needAgree,
    backVis: s.fstep === 0 ? 'hidden' : 'visible', backCls: s.fstep === 0 ? 'hid' : '', fBack: set({ fstep: Math.max(0, s.fstep - 1) }), fNext: set({ fstep: Math.min(3, s.fstep + 1) }),
    notLast: s.fstep < 3, isLast: s.fstep === 3,
    fSend: () => (s.agree ? up({ sent: true }) : up({ needAgree: true })),
    noSubmit: (e) => { e.preventDefault(); }
  };
}

/* ===== Page ===== */
const NAV = [
  ['#roles', 'Professionals'],
  ['#models', 'Hiring models'],
  ['#process', 'Process'],
  ['#pricing', 'Pricing'],
  ['#faq', 'FAQ'],
];


export default function App() {
  const root = useRef(null);
  const {
    clockUS, clockIN, auds, audLine, laneA, routine, senior, modeA, modeB, modeAcls, modeBcls, setModeA, setModeB, meterW, meterC, meterLabel, boardNote, who, why, whyShift, whyPct, whyCount, whyPrev, whyNext, fit, fitMsg, match, roles, patterns, isOngoing, isSeasonal, isProject, hrs, setHrs, cells, months, models, steps, stepPct, stepPrev, stepNext, gantt, cases, ucShift, ucPrev, ucNext, inds, sws, marquee, stages, seats, seatAria, faqs, sent, notSent, fsteps, fLabel, dA, dB, dC, dD, proPills, swPills, agree, togAgree, needAgree, backVis, backCls, fBack, fNext, notLast, isLast, fSend, noSubmit,
  } = usePageData();

  /* page-level settings (restored on unmount) */
  useEffect(() => {
    const h = document.documentElement.style, b = document.body.style;
    const prev = [h.scrollBehavior, h.scrollPaddingTop, b.margin];
    h.scrollBehavior = 'smooth';
    h.scrollPaddingTop = '84px';
    b.margin = '0';
    return () => { [h.scrollBehavior, h.scrollPaddingTop, b.margin] = prev; };
  }, []);

  /* Scroll-reveal: works on every screen size (no scroll-timeline dependency) */
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    el.classList.add('ready');
    if (!('IntersectionObserver' in window)) {
      el.querySelectorAll('.rv, .sx').forEach((n) => n.classList.add('in'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.04, rootMargin: '0px 0px -6% 0px' }
    );
    el.querySelectorAll('.rv, .sx').forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);

  return (
    <div className="pg" ref={root}>
      <style>{CSS}</style>


      {/* 01 HERO */}
      <section id="top" style={{ background: "#07121F", color: "#FFFFFF", position: "relative", overflow: "hidden" }}>
        <div aria-hidden="true" style={{ position: "absolute", inset: "0", backgroundImage: "linear-gradient(rgba(255,255,255,.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.045) 1px, transparent 1px)", backgroundSize: "56px 56px", maskImage: "radial-gradient(ellipse at 75% 40%, #000 0%, transparent 70%)", WebkitMaskImage: "radial-gradient(ellipse at 75% 40%, #000 0%, transparent 70%)" }}></div>
        <div className="wrap" style={{ position: "relative", paddingTop: "34px", paddingBottom: "96px" }}>
          <div className="m" style={{ display: "flex", flexWrap: "wrap", gap: "10px 28px", fontSize: "13px", color: "#A9B8C7", letterSpacing: ".06em" }}>
            <span><span style={{ color: "#FFB84D" }}>●</span> New York {clockUS}</span>
            <span><span style={{ color: "#37E191" }}>●</span> India {clockIN}</span>
            <span>Tell us the work → choose your professional → work starts</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(480px, 100%), 1fr))", gap: "56px", alignItems: "center", marginTop: "54px" }}>
            <div className="fade">
              <h1 className="eb" style={{ color: "#37E191" }}>Hire dedicated accounting professionals in India for your US business</h1>
              <h2 className="d" style={{ fontSize: "clamp(38px, 5vw, 68px)", fontWeight: "800" }}>Need an accountant, bookkeeper or tax professional? <span style={{ color: "#37E191" }}>Let’s find the right person</span> for your business.</h2>
              <div role="group" aria-label="I am hiring for" style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "34px" }}>
                {auds.map((a, _i) => (<Fragment key={_i}>
                  <button type="button" className={"tabd " + a.cls} aria-pressed={a.pressed} onClick={a.pick}>{a.label}</button>
                </Fragment>))}
              </div>
              <p style={{ fontSize: "19px", color: "#D5DEE7", margin: "24px 0 0", maxWidth: "600px", minHeight: "92px", textWrap: "pretty" }}>{audLine}</p>
              <p style={{ fontSize: "16px", color: "#A9B8C7", margin: "14px 0 0", maxWidth: "600px" }}>Our team is already in place. No job posts, no resume rounds, no weeks of screening on your side. Tell us the work, choose the professional you want from our team, and get started. <strong style={{ color: "#FFFFFF" }}>You decide who joins, what work gets done and how they fit your operations.</strong></p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "14px", marginTop: "34px" }}>
                <a className="btn b1" href="#enquiry">Request Accounting Professionals <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0,display:'inline-block'}}><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>
                <a className="btn b3" href="#models">Explore Hiring Options</a>
              </div>
            </div>

            {/* team board */}
            <div className="fade heroboard" style={{ background: "#0D1D30", border: "1px solid rgba(255,255,255,.14)", borderRadius: "26px", padding: "26px", boxShadow: "0 40px 90px -40px rgba(0,0,0,.8)" }}>
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "14px" }}>
                <p className="m" style={{ margin: "0", fontSize: "13px", letterSpacing: ".12em", textTransform: "uppercase", color: "#A9B8C7" }}>Team board · illustrative</p>
                <div role="group" aria-label="Compare" style={{ display: "flex", background: "rgba(255,255,255,.08)", borderRadius: "999px", padding: "4px" }}>
                  <button type="button" className={"tabd " + modeAcls} style={{ borderColor: "transparent", minHeight: "44px" }} aria-pressed={modeA} onClick={setModeA}>Today</button>
                  <button type="button" className={"tabd " + modeBcls} style={{ borderColor: "transparent", minHeight: "44px" }} aria-pressed={modeB} onClick={setModeB}>With a dedicated seat</button>
                </div>
              </div>
              <div style={{ display: "grid", gap: "16px", marginTop: "22px" }}>
                <div style={{ borderRadius: "18px", background: "rgba(255,184,77,.07)", border: "1px solid rgba(255,184,77,.3)", padding: "18px" }}>
                  <p style={{ margin: "0 0 12px", fontSize: "14px", fontWeight: "600", color: "#FFD9A0" }}>{laneA} · US</p>
                  {modeA && (<>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                      {routine.map((c, _i) => (<Fragment key={_i}><span className="chip chAon pop jit" style={{ animationDelay: c.delay }}>{c.t}</span></Fragment>))}
                      {senior.map((c, _i) => (<Fragment key={_i}><span className="chip chA" style={{ opacity: ".55" }}>{c.t} · waiting</span></Fragment>))}
                    </div>
                  </>)}
                  {modeB && (<>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                      {senior.map((c, _i) => (<Fragment key={_i}><span className="chip chAon pop" style={{ animationDelay: c.delay }}>{c.t}</span></Fragment>))}
                    </div>
                  </>)}
                </div>
                <div style={{ borderRadius: "18px", background: "rgba(55,225,145,.07)", border: "1px solid rgba(55,225,145,.3)", padding: "18px", minHeight: "128px" }}>
                  <p style={{ margin: "0 0 12px", fontSize: "14px", fontWeight: "600", color: "#9BF0C6" }}>Dedicated professional · India</p>
                  {modeA && (<>
                    <div className="seatpulse" style={{ border: "1.5px dashed #37E191", borderRadius: "12px", minHeight: "56px", display: "grid", placeItems: "center", color: "#9BF0C6", fontSize: "15px" }}>Open seat — the work has nowhere to go</div>
                  </>)}
                  {modeB && (<>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                      {routine.map((c, _i) => (<Fragment key={_i}><span className="chip chB pop" style={{ animationDelay: c.delay }}>{c.t}</span></Fragment>))}
                    </div>
                  </>)}
                </div>
              </div>
              <div style={{ marginTop: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", color: "#A9B8C7" }}><span>Senior time spent on routine preparation</span><span className="m" style={{ color: "#FFFFFF" }}>{meterLabel}</span></div>
                <div style={{ height: "10px", borderRadius: "6px", background: "rgba(255,255,255,.1)", marginTop: "10px", overflow: "hidden" }}><div style={{ height: "100%", borderRadius: "6px", width: meterW, background: meterC, transition: "width .9s cubic-bezier(.65,0,.2,1), background .9s" }}></div></div>
                <p style={{ margin: "14px 0 0", fontSize: "14px", color: "#A9B8C7" }}>{boardNote}</p>
              </div>
            </div>
          </div>

          <ul className="ck ckd rv" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(300px, 100%), 1fr))", gap: "14px 32px", marginTop: "72px", paddingTop: "34px", borderTop: "1px solid rgba(255,255,255,.14)", color: "#D5DEE7", fontSize: "16px" }}>
            <li>Hire individual professionals or build an accounting team.</li>
            <li>Choose full-time, part-time or project-based arrangements.</li>
            <li>Choose your professional from our existing team.</li>
            <li>Skip resume rounds and screening on your side.</li>
            <li>Start quickly, with agreed employment and HR support.</li>
            <li>Build capacity as your business grows.</li>
          </ul>
        </div>
      </section>

      {/* 03 WHY */}
      <section id="why" className="sec" style={{ background: "#FFFFFF" }}>
        <div className="wrap">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(420px, 100%), 1fr))", gap: "56px", alignItems: "end" }}>
            <div className="rv">
              <p className="eb" style={{ color: "#0E7A49" }}>03 · Why businesses need dedicated professionals</p>
              <h2 className="d h2">Your business is growing. But is your accounting team keeping up?</h2>
              <p className="lead">Every new client brings more bookkeeping, reconciliations and reporting. Every tax season adds preparation work and tighter deadlines. At some point, the existing team simply does not have the capacity to handle everything comfortably.</p>
            </div>
            <div className="rv" role="img" aria-label="Illustration: workload keeps growing while team size stays the same" style={{ background: "#F2F4F0", borderRadius: "20px", padding: "26px" }}>
              <p className="m" style={{ margin: "0 0 18px", fontSize: "13px", letterSpacing: ".1em", textTransform: "uppercase", color: "#55605C" }}>The gap · illustrative</p>
              <p style={{ margin: "0 0 8px", fontSize: "14px", fontWeight: "600" }}>Workload</p>
              <div style={{ height: "30px", borderRadius: "8px", background: "rgba(15,27,42,.08)" }}><div className="grow" style={{ height: "100%", width: "42%", borderRadius: "8px", background: "#FFB84D" }}></div></div>
              <p style={{ margin: "18px 0 8px", fontSize: "14px", fontWeight: "600" }}>Team capacity</p>
              <div style={{ height: "30px", borderRadius: "8px", background: "rgba(15,27,42,.08)" }}><div style={{ height: "100%", width: "42%", borderRadius: "8px", background: "#0F1B2A" }}></div></div>
              <p style={{ margin: "16px 0 0", fontSize: "14px", color: "#55605C" }}>New clients, a filing season, a new hire on payroll: the top bar moves. The bottom one only moves when you add a person.</p>
            </div>
          </div>

          <div className="rv" style={{ marginTop: "56px", borderRadius: "26px", background: "#07121F", color: "#FFFFFF", overflow: "hidden" }}>
            <div className="track" style={{ transform: `translateX(${whyShift})` }}>
              {why.map((y, _i) => (<Fragment key={_i}>
                <article className="slide" aria-hidden={y.hidden} style={{ padding: "clamp(26px, 4vw, 56px)" }}>
                  <div style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", gap: "12px 24px" }}>
                    <span className="d" style={{ fontSize: "clamp(60px, 8vw, 112px)", fontWeight: "800", color: "transparent", WebkitTextStroke: "1.5px #37E191" }}>{y.n}</span>
                    <h3 className="d" style={{ fontSize: "clamp(24px, 3vw, 40px)", fontWeight: "700", flex: "1 1 320px", textWrap: "balance" }}>{y.t}</h3>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))", gap: "18px", marginTop: "30px" }}>
                    <div style={{ borderRadius: "16px", border: "1px solid rgba(255,184,77,.4)", padding: "22px" }}>
                      <p className="m" style={{ margin: "0 0 10px", fontSize: "12px", letterSpacing: ".12em", textTransform: "uppercase", color: "#FFB84D" }}>The pressure</p>
                      <p style={{ margin: "0", color: "#D5DEE7", fontSize: "16px" }}>{y.prob}</p>
                    </div>
                    <div style={{ borderRadius: "16px", border: "1px solid rgba(55,225,145,.45)", padding: "22px" }}>
                      <p className="m" style={{ margin: "0 0 10px", fontSize: "12px", letterSpacing: ".12em", textTransform: "uppercase", color: "#37E191" }}>Where dedicated staffing helps</p>
                      <p style={{ margin: "0", color: "#D5DEE7", fontSize: "16px" }}>{y.help}</p>
                    </div>
                    <div style={{ borderRadius: "16px", background: "rgba(255,255,255,.07)", padding: "22px" }}>
                      <p className="m" style={{ margin: "0 0 10px", fontSize: "12px", letterSpacing: ".12em", textTransform: "uppercase", color: "#A9B8C7" }}>Example</p>
                      <p style={{ margin: "0", color: "#FFFFFF", fontSize: "16px" }}>{y.ex}</p>
                    </div>
                  </div>
                </article>
              </Fragment>))}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "16px", padding: "0 clamp(26px, 4vw, 56px) 30px" }}>
              <div style={{ flex: "1 1 200px", height: "4px", borderRadius: "2px", background: "rgba(255,255,255,.14)" }}><div style={{ height: "100%", borderRadius: "2px", background: "#37E191", width: whyPct, transition: "width .7s" }}></div></div>
              <span className="m" style={{ fontSize: "14px", color: "#A9B8C7" }}>{whyCount}</span>
              <div style={{ display: "flex", gap: "10px" }}>
                <button type="button" className="rnd" style={{ borderColor: "#FFFFFF", color: "#FFFFFF" }} aria-label="Previous reason" onClick={whyPrev}>←</button>
                <button type="button" className="rnd" style={{ borderColor: "#37E191", background: "#37E191", color: "#06131F" }} aria-label="Next reason" onClick={whyNext}>→</button>
              </div>
            </div>
          </div>

          <div className="rv" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(420px, 100%), 1fr))", gap: "22px", marginTop: "56px" }}>
            <div className="card" style={{ padding: "clamp(24px, 3vw, 40px)", background: "#F2F4F0", border: "0" }}>
              <h3 className="d" style={{ fontSize: "28px", fontWeight: "700" }}>Is offshore accounting staffing the right decision for you?</h3>
              <p style={{ margin: "12px 0 20px", color: "#2B3A47", fontSize: "16px" }}>Tick what is true for your business today.</p>
              <div style={{ display: "grid", gap: "4px" }}>
                {fit.map((q, _i) => (<Fragment key={_i}>
                  <label style={{ display: "flex", gap: "14px", alignItems: "center", minHeight: "46px", cursor: "pointer", fontSize: "16px" }}><input type="checkbox" checked={q.on} onChange={q.tog} style={{ width: "22px", height: "22px", accentColor: "#22AE68", flex: "0 0 22px" }} /><span>{q.t}</span></label>
                </Fragment>))}
              </div>
              <p className="m" style={{ margin: "20px 0 0", fontSize: "14px", color: "#0E7A49" }}>{fitMsg}</p>
            </div>
            <div className="card" style={{ padding: "clamp(24px, 3vw, 40px)", display: "flex", flexDirection: "column", gap: "18px", alignItems: "flex-start" }}>
              <p className="m" style={{ margin: "0", fontSize: "13px", letterSpacing: ".1em", textTransform: "uppercase", color: "#8A5A00" }}>And when it may not be</p>
              <p style={{ margin: "0", fontSize: "19px", textWrap: "pretty" }}>It may not be the right arrangement if you have very little work, no clear responsibilities, no capacity to supervise a dedicated resource, or no suitable legal and security arrangements for offshore access.</p>
              <p className="d" style={{ fontSize: "26px", fontWeight: "700" }}>The first step should be to understand the work, not immediately commit to hiring.</p>
              <a className="btn b1" href="#enquiry" style={{ marginTop: "auto" }}>Discuss My Accounting Staffing Needs <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0,display:'inline-block'}}><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>
            </div>
          </div>
        </div>
      </section>

      {/* MATCHER */}
      <section className="sec" style={{ background: "#D9F7E6" }}>
        <div className="wrap">
          <div className="rv">
            <p className="eb" style={{ color: "#0A5A36" }}>What can you do with additional capacity?</p>
            <h2 className="d h2">Pick the problem. See the seat that solves it.</h2>
          </div>
          <div className="rv" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(420px, 100%), 1fr))", gap: "36px", marginTop: "44px", alignItems: "start" }}>
            <div style={{ display: "grid", gap: "10px" }}>
              {match.map((r, _i) => (<Fragment key={_i}>
                <button type="button" className={`rowbtn ${r.cls} `} aria-pressed={r.pressed} onClick={r.pick}><span>{r.c}</span><span aria-hidden="true">→</span></button>
              </Fragment>))}
            </div>
            <div className="stick" style={{ position: "sticky", top: "100px" }}>
              {match.map((r, _i) => (<Fragment key={_i}>
                {r.on && (<>
                  <div className="pop" style={{ background: "#06131F", color: "#FFFFFF", borderRadius: "26px", padding: "clamp(26px, 4vw, 48px)" }}>
                    <p className="m" style={{ margin: "0", fontSize: "13px", letterSpacing: ".12em", textTransform: "uppercase", color: "#37E191" }}>Professional you can hire</p>
                    <p className="d" style={{ fontSize: "clamp(32px, 4vw, 54px)", fontWeight: "800", marginTop: "14px" }}>{r.p}</p>
                    <div style={{ height: "1px", background: "rgba(255,255,255,.18)", margin: "28px 0" }}></div>
                    <p className="m" style={{ margin: "0", fontSize: "13px", letterSpacing: ".12em", textTransform: "uppercase", color: "#A9B8C7" }}>Potential responsibility</p>
                    <p style={{ margin: "10px 0 0", fontSize: "21px" }}>{r.r}</p>
                    <a className="btn b1" href="#roles" style={{ marginTop: "32px" }}>Explore Professionals You Can Hire <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0,display:'inline-block'}}><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>
                  </div>
                </>)}
              </Fragment>))}
            </div>
          </div>
        </div>
      </section>

      {/* 04 ROLES */}
      <section id="roles" className="sec">
        <div className="wrap">
          <div className="rv">
            <p className="eb" style={{ color: "#0E7A49" }}>04 · Professionals you can hire</p>
            <h2 className="d h2">What kind of accounting professional are you looking for?</h2>
            <p className="lead">Someone who handles basic transaction entry may not be suitable for month-end closing. General accounting experience is not the same as practical US tax preparation. Identify the position properly first.</p>
          </div>
          <div className="rv role-grid" style={{ display: "grid", gap: "12px", marginTop: "44px" }}>
            {roles.map((r, _i) => (<Fragment key={_i}>
              <button type="button" className={`rowbtn ${r.cls} `} aria-pressed={r.pressed} onClick={r.pick}><span><span className="m" style={{ fontSize: "13px", opacity: ".7" }}>{r.num}</span>&nbsp;&nbsp;{r.label}</span><span aria-hidden="true">+</span></button>
            </Fragment>))}
          </div>
          {roles.map((r, _i) => (<Fragment key={_i}>
            {r.on && (<>
              <div className="card fade" style={{ marginTop: "20px", overflow: "visible" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(360px, 100%), 1fr))" }}>
                  <div style={{ padding: "clamp(24px, 4vw, 48px)", display: "flex", flexDirection: "column", gap: "18px", alignItems: "flex-start" }}>
                    <h3 className="d" style={{ fontSize: "clamp(28px, 3.4vw, 44px)", fontWeight: "700" }}>{r.label}</h3>
                    <p style={{ margin: "0", color: "#2B3A47" }}>{r.intro}</p>
                    <p className="m" style={{ margin: "8px 0 0", fontSize: "13px", letterSpacing: ".1em", textTransform: "uppercase", color: "#55605C" }}>Positions you can request</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                      {r.pos.map((p, _i) => (<Fragment key={_i}><span className="chip pop" style={{ background: "#D9F7E6", color: "#06131F", animationDelay: p.delay }}>{p.t}</span></Fragment>))}
                    </div>
                    {r.hasSw && (<>
                      <p style={{ margin: "6px 0 0", fontSize: "15px", color: "#2B3A47" }}><strong>Software experience to consider:</strong> {r.sw}</p>
                    </>)}
                    <a className="btn b4" href="#enquiry" style={{ marginTop: "10px" }}>{r.cta} <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0,display:'inline-block'}}><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>
                  </div>
                  <div style={{ padding: "clamp(24px, 4vw, 48px)", background: "#07121F", color: "#FFFFFF", display: "flex", flexDirection: "column", gap: "20px" }}>
                    <p className="m" style={{ margin: "0", fontSize: "13px", letterSpacing: ".1em", textTransform: "uppercase", color: "#37E191" }}>{r.workLabel}</p>
                    <ul className="ck ckd" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(220px, 100%), 1fr))", gap: "10px 20px", color: "#D5DEE7", fontSize: "16px" }}>{r.work.map((k, _i) => (<Fragment key={_i}><li>{k.t}</li></Fragment>))}</ul>
                    {r.hasEx && (<>
                      <div style={{ marginTop: "auto", borderRadius: "16px", background: "rgba(255,255,255,.07)", padding: "20px" }}>
                        <p className="m" style={{ margin: "0 0 8px", fontSize: "12px", letterSpacing: ".12em", textTransform: "uppercase", color: "#FFB84D" }}>Example</p>
                        <p style={{ margin: "0", fontSize: "16px" }}>{r.ex}</p>
                      </div>
                    </>)}
                  </div>
                </div>
              </div>
            </>)}
          </Fragment>))}
        </div>
      </section>

      {/* 05 MODELS */}
      <section id="models" className="sec" style={{ background: "#07121F", color: "#FFFFFF" }}>
        <div className="wrap">
          <div className="rv">
            <p className="eb" style={{ color: "#37E191" }}>05 · Choose your hiring model</p>
            <h2 className="d h2">You don’t have to hire everyone full-time. Choose based on your actual workload.</h2>
            <p className="lead" style={{ color: "#D5DEE7" }}>One of the biggest hiring mistakes is choosing a full-time position before understanding how much work the role actually involves. Move the dial to see a starting point.</p>
          </div>
          <div className="rv" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(420px, 100%), 1fr))", gap: "28px", marginTop: "48px" }}>
            <div style={{ background: "#0D1D30", border: "1px solid rgba(255,255,255,.14)", borderRadius: "24px", padding: "clamp(22px, 3vw, 36px)" }}>
              <p style={{ margin: "0 0 12px", fontWeight: "600" }}>How does the work arrive?</p>
              <div role="group" aria-label="Workload pattern" style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                {patterns.map((p, _i) => (<Fragment key={_i}>
                  <button type="button" className={"tabd " + p.cls} aria-pressed={p.pressed} onClick={p.pick}>{p.label}</button>
                </Fragment>))}
              </div>
              {isOngoing && (<>
                <div className="fade">
                  <label htmlFor="hrs" style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", margin: "28px 0 10px", fontWeight: "600" }}><span>Hours of work per week</span><span className="d" style={{ fontSize: "40px", color: "#37E191" }}>{hrs}<span style={{ fontSize: "18px" }}> hrs</span></span></label>
                  <input id="hrs" type="range" min="5" max="40" step="1" value={hrs} onChange={setHrs} style={{ width: "100%", height: "44px", accentColor: "#37E191" }} />
                  <p className="m" style={{ margin: "18px 0 10px", fontSize: "12px", letterSpacing: ".1em", textTransform: "uppercase", color: "#A9B8C7" }}>One working week · 5 days × 8 hours</p>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(8, minmax(0, 1fr))", gap: "6px" }}>
                    {cells.map((c, _i) => (<Fragment key={_i}><div className="cell" style={{ background: c.bg }}></div></Fragment>))}
                  </div>
                </div>
              </>)}
              {isSeasonal && (<>
                <div className="fade">
                  <p className="m" style={{ margin: "28px 0 10px", fontSize: "12px", letterSpacing: ".1em", textTransform: "uppercase", color: "#A9B8C7" }}>A tax practice’s year · illustrative</p>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(12, minmax(0, 1fr))", gap: "6px", alignItems: "end", height: "150px" }}>
                    {months.map((mo, _i) => (<Fragment key={_i}><div className="pop" style={{ height: mo.h, background: mo.bg, borderRadius: "6px", animationDelay: mo.delay }}></div></Fragment>))}
                  </div>
                  <div className="m" style={{ display: "grid", gridTemplateColumns: "repeat(12, minmax(0, 1fr))", gap: "6px", fontSize: "11px", color: "#A9B8C7", textAlign: "center", marginTop: "8px" }}>
                    {months.map((mo, _i) => (<Fragment key={_i}><span>{mo.l}</span></Fragment>))}
                  </div>
                  <p style={{ margin: "16px 0 0", fontSize: "15px", color: "#D5DEE7" }}>Deadlines stay fixed while documents arrive at different times. Extra preparers cover the peak; your year-round team stays the same size.</p>
                </div>
              </>)}
              {isProject && (<>
                <div className="fade">
                  <p className="m" style={{ margin: "28px 0 10px", fontSize: "12px", letterSpacing: ".1em", textTransform: "uppercase", color: "#A9B8C7" }}>A defined project · illustrative</p>
                  <div style={{ display: "grid", gap: "10px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}><span style={{ flex: "0 0 96px", fontSize: "14px", color: "#A9B8C7" }}>Scope</span><div className="bar pop" style={{ flex: "0 0 24%", background: "#FFB84D" }}></div></div>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}><span style={{ flex: "0 0 96px", fontSize: "14px", color: "#A9B8C7" }}>Clear backlog</span><div className="bar pop" style={{ flex: "0 0 56%", background: "#37E191", animationDelay: ".15s" }}></div></div>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}><span style={{ flex: "0 0 96px", fontSize: "14px", color: "#A9B8C7" }}>Hand over</span><div className="bar pop" style={{ flex: "0 0 18%", background: "#9BF0C6", animationDelay: ".3s" }}></div></div>
                  </div>
                  <p style={{ margin: "16px 0 0", fontSize: "15px", color: "#D5DEE7" }}>Accounts, periods, software, outputs and deadlines are defined before work starts. The engagement can move into a recurring arrangement afterwards.</p>
                </div>
              </>)}
            </div>
            <div style={{ background: "#37E191", color: "#06131F", borderRadius: "24px", padding: "clamp(22px, 3vw, 36px)", display: "flex", flexDirection: "column", gap: "14px", alignItems: "flex-start" }}>
              <p className="m" style={{ margin: "0", fontSize: "13px", letterSpacing: ".12em", textTransform: "uppercase" }}>A starting point for you</p>
              {models.map((mm, _i) => (<Fragment key={_i}>
                {mm.on && (<>
                  <div className="pop" style={{ display: "flex", flexDirection: "column", gap: "14px", alignItems: "flex-start" }}>
                    <p className="d" style={{ fontSize: "clamp(32px, 4vw, 52px)", fontWeight: "800" }}>{mm.name}</p>
                    <p style={{ margin: "0", fontSize: "18px", fontWeight: "600" }}>{mm.for}</p>
                    <p style={{ margin: "0", fontSize: "16px" }}>{mm.ex}</p>
                    <a className="btn b4" href="#enquiry" style={{ marginTop: "8px" }}>{mm.cta} <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0,display:'inline-block'}}><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>
                  </div>
                </>)}
              </Fragment>))}
              <p style={{ margin: "auto 0 0", paddingTop: "16px", fontSize: "14px", borderTop: "1px solid rgba(6,19,31,.25)", width: "100%" }}>Starting points only. The final recommendation depends on workload, required availability and the continuity you need.</p>
            </div>
          </div>
          <div className="rv" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(320px, 100%), 1fr))", gap: "20px", marginTop: "28px" }}>
            {models.map((mm, _i) => (<Fragment key={_i}>
              <div style={{ borderRadius: "22px", padding: "28px", border: `1.5px solid ${mm.bd} `, background: mm.bg, transition: "all .4s", display: "flex", flexDirection: "column", gap: "14px" }}>
                <p className="m" style={{ margin: "0", fontSize: "13px", letterSpacing: ".1em", color: "#37E191" }}>OPTION {mm.num}</p>
                <h3 className="d" style={{ fontSize: "26px", fontWeight: "700" }}>{mm.name}</h3>
                <p style={{ margin: "0", color: "#D5DEE7", fontSize: "16px" }}>{mm.desc}</p>
                <p className="m" style={{ margin: "6px 0 0", fontSize: "12px", letterSpacing: ".1em", textTransform: "uppercase", color: "#A9B8C7" }}>Typically includes</p>
                <ul className="ck ckd" style={{ fontSize: "15px", color: "#D5DEE7" }}>{mm.inc.map((k, _i) => (<Fragment key={_i}><li>{k.t}</li></Fragment>))}</ul>
                <p className="m" style={{ margin: "6px 0 0", fontSize: "12px", letterSpacing: ".1em", textTransform: "uppercase", color: "#FFB84D" }}>Choose this when</p>
                <ul className="ck cka" style={{ fontSize: "15px", color: "#D5DEE7" }}>{mm.when.map((k, _i) => (<Fragment key={_i}><li>{k.t}</li></Fragment>))}</ul>
              </div>
            </Fragment>))}
          </div>
          <div className="rv" style={{ marginTop: "36px", textAlign: "center" }}><a className="btn b1" href="#enquiry">Help Me Choose the Right Model <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0,display:'inline-block'}}><path d="M5 12h14M13 6l6 6-6 6"/></svg></a></div>
        </div>
      </section>

      {/* 06 PROCESS */}
      <section id="process" className="sec">
        <div className="wrap">
          <div className="rv">
            <p className="eb" style={{ color: "#0E7A49" }}>06 · How it works</p>
            <h2 className="d h2">Our team is already in place. You choose the talent, and the work starts.</h2>
            <p className="lead">No job posts, no resume rounds, no weeks of screening and shortlisting on your side. The bookkeepers, tax preparers, accountants and payroll specialists are already part of Smart Tax Expertss. Five steps from first conversation to live work.</p>
          </div>
          <div className="rv card" style={{ marginTop: "48px", padding: "clamp(20px, 3vw, 40px)" }}>
            <div style={{ overflowX: "auto", paddingBottom: "6px" }}>
              <div style={{ position: "relative", minWidth: "420px" }}>
                <div aria-hidden="true" style={{ position: "absolute", left: "10%", right: "10%", top: "21px", height: "3px", background: "rgba(15,27,42,.12)", borderRadius: "2px" }}><div style={{ height: "100%", width: stepPct, background: "#22AE68", borderRadius: "2px", transition: "width .6s cubic-bezier(.65,0,.2,1)" }}></div></div>
                <div role="group" aria-label="Steps to get started" style={{ position: "relative", display: "flex" }}>
                  {steps.map((s, _i) => (<Fragment key={_i}>
                    <button type="button" className={`stepb ${s.cls} `} aria-pressed={s.pressed} aria-label={s.aria} onClick={s.pick}><b>{s.num}</b></button>
                  </Fragment>))}
                </div>
              </div>
            </div>
            {steps.map((s, _i) => (<Fragment key={_i}>
              {s.on && (<>
                <div className="fade" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(360px, 100%), 1fr))", gap: "40px", marginTop: "34px" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "16px", alignItems: "flex-start" }}>
                    <span className="chip m" style={{ background: s.leadBg, color: "#06131F", fontSize: "13px" }}>Led by: {s.lead}</span>
                    <h3 className="d" style={{ fontSize: "clamp(26px, 3.2vw, 42px)", fontWeight: "700" }}>Step {s.num}: {s.t}</h3>
                    <p style={{ margin: "0", color: "#2B3A47" }}>{s.p}</p>
                    {s.hasGet && (<>
                      <p style={{ margin: "0", padding: "14px 18px", borderRadius: "12px", background: "#D9F7E6", fontSize: "16px" }}><strong>What you get:</strong> {s.get}</p>
                    </>)}
                  </div>
                  <div style={{ background: "#F2F4F0", borderRadius: "18px", padding: "26px" }}>
                    <p className="m" style={{ margin: "0 0 14px", fontSize: "13px", letterSpacing: ".1em", textTransform: "uppercase", color: "#55605C" }}>{s.listLabel}</p>
                    <ul className="ck" style={{ fontSize: "16px" }}>{s.list.map((k, _i) => (<Fragment key={_i}><li className="pop" style={{ animationDelay: k.delay }}>{k.t}</li></Fragment>))}</ul>
                  </div>
                </div>
              </>)}
            </Fragment>))}
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "16px", marginTop: "34px", paddingTop: "24px", borderTop: "1px solid rgba(15,27,42,.12)" }}>
              <div style={{ display: "flex", gap: "10px" }}>
                <button type="button" className="rnd" aria-label="Previous step" onClick={stepPrev}>←</button>
                <button type="button" className="rnd" style={{ background: "#0F1B2A", color: "#FFFFFF" }} aria-label="Next step" onClick={stepNext}>→</button>
              </div>
              <a className="btn b1" href="#enquiry">Choose My Professional <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0,display:'inline-block'}}><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>
            </div>
          </div>
        </div>
      </section>

      {/* 09 USE CASES */}
      <section id="cases" className="sec">
        <div className="wrap">
          <div className="rv" style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "end", gap: "24px" }}>
            <div style={{ flex: "1 1 520px" }}>
              <p className="eb" style={{ color: "#0E7A49" }}>09 · Real-world hiring use cases</p>
              <h2 className="d h2">What does this actually look like in your business?</h2>
              <p className="lead" style={{ fontSize: "16px", color: "#55605C" }}>Illustrative scenarios, not claims of specific completed Smart Tax Expertss projects.</p>
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <button type="button" className="rnd" aria-label="Previous use case" onClick={ucPrev}>←</button>
              <button type="button" className="rnd" style={{ background: "#0F1B2A", color: "#FFFFFF" }} aria-label="Next use case" onClick={ucNext}>→</button>
            </div>
          </div>
          <div className="rv card" style={{ marginTop: "40px", overflow: "visible" }}>
            <div className="track" style={{ transform: `translateX(${ucShift})` }}>
              {cases.map((u, _i) => (<Fragment key={_i}>
                <article className="slide" aria-hidden={u.hidden} style={{ padding: "clamp(24px, 4vw, 52px)" }}>
                  <p className="m" style={{ margin: "0", fontSize: "13px", letterSpacing: ".1em", color: "#55605C" }}>USE CASE {u.num} / 06</p>
                  <h3 className="d" style={{ fontSize: "clamp(26px, 3.4vw, 44px)", fontWeight: "700", marginTop: "12px", maxWidth: "900px" }}>{u.t}</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(250px, 100%), 1fr))", gap: "16px", marginTop: "30px" }}>
                    <div style={{ borderRadius: "16px", background: "#FFF3DD", padding: "22px" }}><p className="m" style={{ margin: "0 0 10px", fontSize: "12px", letterSpacing: ".12em", textTransform: "uppercase", color: "#8A5A00" }}>The situation</p><p style={{ margin: "0", fontSize: "16px" }}>{u.sit}</p></div>
                    <div style={{ borderRadius: "16px", background: "#F2F4F0", padding: "22px" }}><p className="m" style={{ margin: "0 0 10px", fontSize: "12px", letterSpacing: ".12em", textTransform: "uppercase", color: "#55605C" }}>What is needed</p><p style={{ margin: "0", fontSize: "16px" }}>{u.need}</p></div>
                    <div style={{ borderRadius: "16px", background: "#D9F7E6", padding: "22px" }}><p className="m" style={{ margin: "0 0 10px", fontSize: "12px", letterSpacing: ".12em", textTransform: "uppercase", color: "#0A5A36" }}>How the work is divided</p><p style={{ margin: "0", fontSize: "16px" }}>{u.split}</p></div>
                  </div>
                  <p style={{ margin: "24px 0 0", fontSize: "16px" }}><span className="m" style={{ fontSize: "13px", letterSpacing: ".1em", textTransform: "uppercase", color: "#55605C" }}>Suggested model&nbsp;&nbsp;</span><strong>{u.model}</strong></p>
                </article>
              </Fragment>))}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "12px", padding: "0 clamp(24px, 4vw, 52px) 26px" }}>
              <div role="group" aria-label="Choose use case" style={{ display: "flex" }}>
                {cases.map((u, _i) => (<Fragment key={_i}><button type="button" className={`dot ${u.cls} `} aria-label={u.aria} aria-pressed={u.pressed} onClick={u.pick}><i></i></button></Fragment>))}
              </div>
              <a className="btn b4" href="#enquiry">Discuss a Similar Requirement <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0,display:'inline-block'}}><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>
            </div>
          </div>
        </div>
      </section>

      {/* 10 INDUSTRIES */}
      <section id="industries" className="sec" style={{ background: "#FFFFFF" }}>
        <div className="wrap">
          <div className="rv">
            <p className="eb" style={{ color: "#0E7A49" }}>10 · Industries we serve</p>
            <h2 className="d h2">Accounting professionals for different industries.</h2>
            <p className="lead">A retail business reports differently from a construction company. A CPA firm needs different skills from a SaaS company. The industry, transaction types and software shape which of our professionals we match to you.</p>
          </div>
          <div className="rv" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(420px, 100%), 1fr))", gap: "32px", marginTop: "44px", alignItems: "start" }}>
            <div role="group" aria-label="Industry" style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {inds.map((n, _i) => (<Fragment key={_i}>
                <button type="button" className={`tab ${n.cls} `} aria-pressed={n.pressed} onClick={n.pick}>{n.label}</button>
              </Fragment>))}
            </div>
            <div>
              {inds.map((n, _i) => (<Fragment key={_i}>
                {n.on && (<>
                  <div className="pop" style={{ borderRadius: "22px", background: "#F2F4F0", padding: "clamp(24px, 3vw, 40px)", display: "flex", flexDirection: "column", gap: "16px", alignItems: "flex-start" }}>
                    <h3 className="d" style={{ fontSize: "30px", fontWeight: "700" }}>{n.label}</h3>
                    <p style={{ margin: "0", fontSize: "18px" }}>{n.text}</p>
                    <a className="btn b4" href="#enquiry">Find Professionals for My Industry <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0,display:'inline-block'}}><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>
                  </div>
                </>)}
              </Fragment>))}
            </div>
          </div>
        </div>
      </section>

      {/* 11 SOFTWARE */}
      <section id="software" className="sec" style={{ paddingTop: "0", background: "#FFFFFF" }}>
        <div className="wrap">
          <div className="rv" style={{ borderTop: "1px solid rgba(15,27,42,.12)", paddingTop: "96px" }}>
            <p className="eb" style={{ color: "#0E7A49" }}>11 · Accounting, tax and payroll software</p>
            <h2 className="d h2">Your business already has its systems. Let’s find someone who knows how to use them.</h2>
            <p className="lead">Changing accounting software just because you are hiring offshore makes little sense. We match you with professionals who already work on your stack.</p>
          </div>
        </div>
        <div className="mqw rv" aria-hidden="true" style={{ overflow: "hidden", marginTop: "44px" }}>
          <div className="mq">
            {marquee.map((x, _i) => (<Fragment key={_i}><span className="d mqi" style={{ fontSize: "30px", fontWeight: "600", padding: "12px 26px", borderRadius: "999px", border: "1.5px solid rgba(15,27,42,.2)", whiteSpace: "nowrap", color: "#0F1B2A" }}>{x.t}</span></Fragment>))}
          </div>
        </div>
        <div className="wrap">
          <div className="rv" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(420px, 100%), 1fr))", gap: "32px", marginTop: "48px", alignItems: "start" }}>
            <div style={{ display: "grid", gap: "10px" }}>
              {sws.map((w, _i) => (<Fragment key={_i}>
                <button type="button" className={`rowbtn ${w.cls} `} style={{ background: "#F2F4F0" }} aria-pressed={w.pressed} onClick={w.pick}><span>{w.label}</span><span aria-hidden="true">→</span></button>
              </Fragment>))}
            </div>
            <div>
              {sws.map((w, _i) => (<Fragment key={_i}>
                {w.on && (<>
                  <div className="fade" style={{ borderRadius: "22px", background: "#07121F", color: "#FFFFFF", padding: "clamp(24px, 3vw, 40px)" }}>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                      {w.names.map((k, _i) => (<Fragment key={_i}><span className="chip pop" style={{ background: "rgba(255,255,255,.1)", color: "#FFFFFF", animationDelay: k.delay }}>{k.t}</span></Fragment>))}
                    </div>
                    <p style={{ margin: "22px 0 0", color: "#D5DEE7", fontSize: "16px" }}><strong style={{ color: "#37E191" }}>Typical work:</strong> {w.work}</p>
                  </div>
                </>)}
              </Fragment>))}
              <p style={{ margin: "20px 0 0", fontSize: "16px" }}>A software name on a profile is not proof of practical knowledge. Tell us whether a platform is mandatory or preferred; we match on how our professionals have actually used it, and you can test that yourself when you meet them.</p>
              <a className="btn b2" href="#enquiry" style={{ marginTop: "20px" }}>Find Someone Who Knows My Software <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0,display:'inline-block'}}><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>
            </div>
          </div>
          <p style={{ margin: "40px 0 0", fontSize: "14px", color: "#55605C", fontStyle: "italic" }}>The software listed represents platforms that may be included in your requirements. Experience and certifications vary by professional. Listing a product does not imply an official partnership or endorsement.</p>
        </div>
      </section>

      {/* 12 SECURITY */}
      <section id="security" className="sec" style={{ background: "#07121F", color: "#FFFFFF" }}>
        <div className="wrap">
          <div className="rv">
            <p className="eb" style={{ color: "#37E191" }}>12 · Quality, confidentiality and data security</p>
            <h2 className="d h2">Your accounting data is sensitive. The way it is handled matters.</h2>
            <p className="lead" style={{ color: "#D5DEE7" }}>An offshore professional may access financial records, business information and potentially personal taxpayer data. Before an engagement begins, the parties should establish how information is accessed, stored, processed and protected.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(420px, 100%), 1fr))", gap: "22px", marginTop: "48px" }}>
            <div className="rv" style={{ background: "#0D1D30", border: "1px solid rgba(255,255,255,.14)", borderRadius: "24px", padding: "clamp(24px, 3vw, 40px)" }}>
              <h3 className="d" style={{ fontSize: "28px", fontWeight: "700" }}>The review loop</h3>
              <p style={{ margin: "10px 0 22px", color: "#A9B8C7", fontSize: "15px" }}>Good accounting work needs a proper review process. A typical workflow:</p>
              <ol className="loop" style={{ listStyle: "none", margin: "0", padding: "0", display: "grid", gap: "8px", counterReset: "lp" }}>
                <li style={{ padding: "12px 16px", borderRadius: "12px", fontSize: "16px", animationDelay: "0s" }}>1. Your firm provides the SOP and work instructions.</li>
                <li style={{ padding: "12px 16px", borderRadius: "12px", fontSize: "16px", animationDelay: "1.4s" }}>2. The professional completes the assigned work.</li>
                <li style={{ padding: "12px 16px", borderRadius: "12px", fontSize: "16px", animationDelay: "2.8s" }}>3. Supporting schedules and documentation are prepared.</li>
                <li style={{ padding: "12px 16px", borderRadius: "12px", fontSize: "16px", animationDelay: "4.2s" }}>4. Your designated reviewer checks the work.</li>
                <li style={{ padding: "12px 16px", borderRadius: "12px", fontSize: "16px", animationDelay: "5.6s" }}>5. Errors or missing information are communicated.</li>
                <li style={{ padding: "12px 16px", borderRadius: "12px", fontSize: "16px", animationDelay: "7s" }}>6. Corrections are completed.</li>
                <li style={{ padding: "12px 16px", borderRadius: "12px", fontSize: "16px", animationDelay: "8.4s" }}>7. Authorized personnel approve the final deliverable.</li>
              </ol>
            </div>
            <div className="rv" style={{ display: "grid", gap: "22px", alignContent: "start" }}>
              <div style={{ background: "#0D1D30", border: "1px solid rgba(255,255,255,.14)", borderRadius: "24px", padding: "clamp(24px, 3vw, 40px)" }}>
                <h3 className="d" style={{ fontSize: "28px", fontWeight: "700" }}>Controlled system access</h3>
                <p style={{ margin: "10px 0 20px", color: "#A9B8C7", fontSize: "15px" }}>Access limited to what the assigned work needs. Where supported:</p>
                <ul className="ck ckd" style={{ color: "#D5DEE7", fontSize: "16px" }}>
                  <li>Multi-factor authentication.</li>
                  <li>Role-based permissions.</li>
                  <li>Approved devices and software.</li>
                  <li>Secure document-sharing methods.</li>
                  <li>Access logging.</li>
                  <li>Restrictions on unauthorized downloads and sharing.</li>
                  <li>Timely access revocation when an assignment ends.</li>
                </ul>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(200px, 100%), 1fr))", gap: "22px" }}>
                <div style={{ background: "#0D1D30", border: "1px solid rgba(255,255,255,.14)", borderRadius: "20px", padding: "24px" }}><h3 className="d" style={{ fontSize: "21px", fontWeight: "700" }}>Confidentiality</h3><p style={{ margin: "10px 0 0", color: "#D5DEE7", fontSize: "15px" }}>Obligations covering business information, financial records, client information and other protected data.</p></div>
                <div style={{ background: "#0D1D30", border: "1px solid rgba(255,255,255,.14)", borderRadius: "20px", padding: "24px" }}><h3 className="d" style={{ fontSize: "21px", fontWeight: "700" }}>Employee awareness</h3><p style={{ margin: "10px 0 0", color: "#D5DEE7", fontSize: "15px" }}>Onboarding may cover confidentiality, security policies, password practices, document handling and incident escalation.</p></div>
              </div>
            </div>
          </div>
          <div className="rv" style={{ marginTop: "22px", borderRadius: "24px", background: "#FFB84D", color: "#201400", padding: "clamp(24px, 3vw, 40px)", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(360px, 100%), 1fr))", gap: "28px" }}>
            <div>
              <p className="m" style={{ margin: "0", fontSize: "13px", letterSpacing: ".12em", textTransform: "uppercase" }}>Important</p>
              <h3 className="d" style={{ fontSize: "30px", fontWeight: "700", marginTop: "10px" }}>US tax information and offshore access</h3>
              <p style={{ margin: "14px 0 0", fontSize: "16px" }}>Internal Revenue Code Section 7216 and its related regulations can apply to the disclosure or use of tax return information by tax return preparers and related service providers. <strong>A standard NDA alone does not automatically satisfy these requirements.</strong></p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px", alignItems: "flex-start" }}>
              <p style={{ margin: "0", fontSize: "16px" }}>Before sharing protected taxpayer information with an offshore professional, your US tax firm should obtain appropriate legal and compliance guidance, including any required taxpayer consent. Written information security programs and applicable FTC Safeguards Rule obligations should also be assessed according to the parties' actual roles.</p>
              <p style={{ margin: "0", fontSize: "16px", fontWeight: "600" }}>Our approach: security responsibilities and permitted data access are agreed before work begins, not after a problem occurs.</p>
              <a className="btn b4" href="#enquiry">Discuss Our Security &amp; Data Handling Process <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0,display:'inline-block'}}><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>
            </div>
          </div>
        </div>
      </section>

      {/* 13 TEAM */}
      <section id="team" className="sec" style={{ background: "#D9F7E6" }}>
        <div className="wrap">
          <div className="rv">
            <p className="eb" style={{ color: "#0A5A36" }}>13 · Building and expanding your team</p>
            <h2 className="d h2">Start with one professional. Add more when your business needs them.</h2>
            <p className="lead">You do not need to build an entire offshore department on day one. Step through the stages and watch the seats fill.</p>
          </div>
          <div role="group" aria-label="Team stage" className="rv" style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "44px" }}>
            {stages.map((g, _i) => (<Fragment key={_i}>
              <button type="button" className={`tab ${g.cls} `} aria-pressed={g.pressed} onClick={g.pick}>Stage {g.num}</button>
            </Fragment>))}
          </div>
          <div className="rv" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(400px, 100%), 1fr))", gap: "36px", marginTop: "28px", alignItems: "start" }}>
            <div>
              {stages.map((g, _i) => (<Fragment key={_i}>
                {g.on && (<>
                  <div className="fade" style={{ display: "flex", flexDirection: "column", gap: "16px", alignItems: "flex-start" }}>
                    <h3 className="d" style={{ fontSize: "clamp(28px, 3.4vw, 44px)", fontWeight: "700" }}>{g.t}</h3>
                    <p style={{ margin: "0", fontSize: "18px" }}>{g.p}</p>
                    {g.hasList && (<>
                      <ul className="ck" style={{ fontSize: "16px" }}>{g.list.map((k, _i) => (<Fragment key={_i}><li>{k.t}</li></Fragment>))}</ul>
                    </>)}
                  </div>
                </>)}
              </Fragment>))}
              <p style={{ margin: "24px 0 0", fontSize: "15px", color: "#2B3A47" }}>The right structure depends on your workload, client portfolio and management requirements. You do not need every role shown.</p>
              <a className="btn b4" href="#enquiry" style={{ marginTop: "20px" }}>Plan My Offshore Accounting Team <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0,display:'inline-block'}}><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>
            </div>
            <div role="img" aria-label={seatAria} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(170px, 100%), 1fr))", gap: "14px" }}>
              {seats.map((e, _i) => (<Fragment key={_i}>
                <div className={`seat ${e.cls} `}><span className="m" style={{ fontSize: "12px", letterSpacing: ".1em", textTransform: "uppercase", opacity: ".8" }}>{e.state}</span><span style={{ fontWeight: "600", fontSize: "17px" }}>{e.role}</span></div>
              </Fragment>))}
            </div>
          </div>
        </div>
      </section>

      {/* 14 CONTINUITY */}
      <section id="continuity" className="sec">
        <div className="wrap">
          <div className="rv">
            <p className="eb" style={{ color: "#0E7A49" }}>14 · Performance, replacement and continuity</p>
            <h2 className="d h2">What happens if the professional is not the right fit?</h2>
            <p className="lead">No match can guarantee a perfect fit from day one. Sometimes more training is needed; sometimes the role turns out different from the job description. What matters is a clear process for addressing it.</p>
          </div>
          <ol style={{ listStyle: "none", margin: "48px 0 0", padding: "0", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(220px, 100%), 1fr))", gap: "14px" }}>
            <li className="card rv" style={{ padding: "24px" }}><span className="d" style={{ fontSize: "44px", fontWeight: "800", color: "#22AE68" }}>1</span><h3 style={{ margin: "8px 0 8px", fontSize: "18px" }}>Understand the concern</h3><p style={{ margin: "0", fontSize: "15px", color: "#2B3A47" }}>Technical knowledge, accuracy, communication, turnaround, availability, SOP understanding or professionalism.</p></li>
            <li className="card rv" style={{ padding: "24px" }}><span className="d" style={{ fontSize: "44px", fontWeight: "800", color: "#22AE68" }}>2</span><h3 style={{ margin: "8px 0 8px", fontSize: "18px" }}>Review the original requirements</h3><p style={{ margin: "0", fontSize: "15px", color: "#2B3A47" }}>Does the actual work match the job description and the expectations discussed when you chose them?</p></li>
            <li className="card rv" style={{ padding: "24px" }}><span className="d" style={{ fontSize: "44px", fontWeight: "800", color: "#22AE68" }}>3</span><h3 style={{ margin: "8px 0 8px", fontSize: "18px" }}>Agree on corrective action</h3><p style={{ margin: "0", fontSize: "15px", color: "#2B3A47" }}>Additional training, clearer instructions or a performance improvement period, where appropriate.</p></li>
            <li className="card rv" style={{ padding: "24px" }}><span className="d" style={{ fontSize: "44px", fontWeight: "800", color: "#22AE68" }}>4</span><h3 style={{ margin: "8px 0 8px", fontSize: "18px" }}>Review the outcome</h3><p style={{ margin: "0", fontSize: "15px", color: "#2B3A47" }}>Has the concern been addressed within the agreed review period?</p></li>
            <li className="card rv" style={{ padding: "24px", background: "#07121F", color: "#FFFFFF" }}><span className="d" style={{ fontSize: "44px", fontWeight: "800", color: "#37E191" }}>5</span><h3 style={{ margin: "8px 0 8px", fontSize: "18px" }}>Discuss replacement if required</h3><p style={{ margin: "0", fontSize: "15px", color: "#D5DEE7" }}>A replacement from our team is discussed according to the contractual terms.</p></li>
          </ol>
          <div className="rv card" style={{ marginTop: "22px", padding: "clamp(24px, 3vw, 40px)", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(360px, 100%), 1fr))", gap: "28px", alignItems: "center" }}>
            <div>
              <h3 className="d" style={{ fontSize: "28px", fontWeight: "700" }}>What about leave or resignation?</h3>
              <p style={{ margin: "12px 0 0", fontSize: "16px", color: "#2B3A47" }}>Continuity planning should cover planned leave, unexpected absence and resignation. Replacement timelines, fees, notice periods and backup-resource commitments should be confirmed in writing.</p>
              <a className="btn b2" href="#enquiry" style={{ marginTop: "22px" }}>Understand Our Continuity Arrangements <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0,display:'inline-block'}}><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>
            </div>
            <ul className="ck" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(200px, 100%), 1fr))", fontSize: "16px" }}>
              <li>Task documentation.</li>
              <li>Knowledge transfer.</li>
              <li>Handover of ongoing work.</li>
              <li>Transition coordination.</li>
              <li>Replacement from our team.</li>
              <li>Revocation of system access.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 15 PRICING */}
      <section id="pricing" className="sec" style={{ background: "#FFFFFF" }}>
        <div className="wrap">
          <div className="rv">
            <p className="eb" style={{ color: "#0E7A49" }}>15 · Pricing and engagement</p>
            <h2 className="d h2">What does it cost to hire an accounting professional in India?</h2>
            <p className="lead">A junior bookkeeper and a senior US tax reviewer should not be priced as if they are the same role. Cost depends on the professional, their experience and how the engagement is structured.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(420px, 100%), 1fr))", gap: "22px", marginTop: "48px" }}>
            <div className="rv" style={{ borderRadius: "24px", background: "#F2F4F0", padding: "clamp(24px, 3vw, 40px)" }}>
              <h3 className="d" style={{ fontSize: "28px", fontWeight: "700" }}>Factors that influence pricing</h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "22px" }}>
                <span className="chip" style={{ background: "#FFFFFF", border: "1px solid rgba(15,27,42,.15)" }}>Position and specialization</span>
                <span className="chip" style={{ background: "#FFFFFF", border: "1px solid rgba(15,27,42,.15)" }}>Years of relevant experience</span>
                <span className="chip" style={{ background: "#FFFFFF", border: "1px solid rgba(15,27,42,.15)" }}>US accounting or tax exposure</span>
                <span className="chip" style={{ background: "#FFFFFF", border: "1px solid rgba(15,27,42,.15)" }}>Software proficiency</span>
                <span className="chip" style={{ background: "#FFFFFF", border: "1px solid rgba(15,27,42,.15)" }}>Professional qualifications</span>
                <span className="chip" style={{ background: "#FFFFFF", border: "1px solid rgba(15,27,42,.15)" }}>Full-time or part-time schedule</span>
                <span className="chip" style={{ background: "#FFFFFF", border: "1px solid rgba(15,27,42,.15)" }}>US working-hour overlap</span>
                <span className="chip" style={{ background: "#FFFFFF", border: "1px solid rgba(15,27,42,.15)" }}>Project duration</span>
                <span className="chip" style={{ background: "#FFFFFF", border: "1px solid rgba(15,27,42,.15)" }}>Management and review requirements</span>
                <span className="chip" style={{ background: "#FFFFFF", border: "1px solid rgba(15,27,42,.15)" }}>Employment and infrastructure arrangements</span>
              </div>
              <p style={{ margin: "26px 0 0", fontSize: "16px" }}>We prefer discussing the actual role and expected workload before suggesting a staffing arrangement.</p>
            </div>
            <div className="rv" style={{ borderRadius: "24px", background: "#07121F", color: "#FFFFFF", padding: "clamp(24px, 3vw, 40px)", display: "flex", flexDirection: "column", gap: "20px", alignItems: "flex-start" }}>
              <p className="m" style={{ margin: "0", fontSize: "13px", letterSpacing: ".12em", textTransform: "uppercase", color: "#37E191" }}>Before you commit</p>
              <h3 className="d" style={{ fontSize: "28px", fontWeight: "700" }}>What your staffing proposal should include</h3>
              <ul className="ck ckd" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(230px, 100%), 1fr))", gap: "10px 20px", color: "#D5DEE7", fontSize: "15px", width: "100%" }}>
                <li>Role and experience level.</li>
                <li>Hiring model.</li>
                <li>Working hours.</li>
                <li>Monthly, hourly or project-based commercial terms.</li>
                <li>Services included.</li>
                <li>Employment and HR responsibilities.</li>
                <li>Equipment and software arrangements.</li>
                <li>Additional charges, if any.</li>
                <li>Payment terms.</li>
                <li>Notice and termination conditions.</li>
                <li>Replacement provisions.</li>
              </ul>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginTop: "auto" }}>
                <a className="btn b1" href="#enquiry">Request a Staffing Proposal <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0,display:'inline-block'}}><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>
                <a className="btn b3" href="#enquiry">Discuss My Hiring Budget</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 16 FAQ */}
      <section id="faq" className="sec">
        <div className="wrap" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(360px, 100%), 1fr))", gap: "48px", alignItems: "start" }}>
          <div className="rv">
            <p className="eb" style={{ color: "#0E7A49" }}>16 · Frequently asked questions</p>
            <h2 className="d h2">The questions firms ask before they hire.</h2>
            <p className="lead" style={{ fontSize: "17px" }}>Something specific to your firm? Ask it on the enquiry form and we will cover it on the first call.</p>
            <a className="btn b2" href="#enquiry" style={{ marginTop: "26px" }}>Talk to Our Team <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0,display:'inline-block'}}><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>
          </div>
          <div className="rv" style={{ gridColumn: "span 1", borderTop: "1.5px solid #0F1B2A" }}>
            {faqs.map((q, _i) => (<Fragment key={_i}>
              <div style={{ borderBottom: "1px solid rgba(15,27,42,.18)" }}>
                <h3 style={{ margin: "0" }}><button type="button" className={`faqb ${q.cls} `} aria-expanded={q.open} onClick={q.tog}><span>{q.q}</span><span className="pm" aria-hidden="true">+</span></button></h3>
                {q.open && (<>
                  <p className="fade faqa" style={{ margin: "0", padding: "0 54px 22px 4px", color: "#2B3A47", fontSize: "16px" }}>{q.a}</p>
                </>)}
              </div>
            </Fragment>))}
          </div>
        </div>
      </section>

      {/* 17 ENQUIRY */}
      <section id="enquiry" className="sec" style={{ background: "#07121F", color: "#FFFFFF" }}>
        <div className="wrap" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(380px, 100%), 1fr))", gap: "48px", alignItems: "start" }}>
          <div className="rv">
            <p className="eb" style={{ color: "#37E191" }}>17 · Hiring enquiry</p>
            <h2 className="d h2">Tell us what kind of professional you need. We’ll take it from there.</h2>
            <p className="lead" style={{ color: "#D5DEE7", fontSize: "17px" }}>You do not need to prepare a brief or a job description. Our team is ready; three ways to start:</p>
            <div style={{ display: "grid", gap: "12px", marginTop: "30px" }}>
              <div style={{ borderRadius: "18px", border: "1.5px solid #37E191", padding: "20px", display: "flex", gap: "16px", alignItems: "flex-start" }}><span className="d" style={{ fontSize: "30px", fontWeight: "800", color: "#37E191" }}>1</span><div><p style={{ margin: "0", fontWeight: "600", fontSize: "18px" }}>Send your requirement</p><p style={{ margin: "4px 0 0", color: "#A9B8C7", fontSize: "15px" }}>Four short parts on this form. We review it and come back with professionals from our team who fit the work.</p></div></div>
              <div style={{ borderRadius: "18px", border: "1px solid rgba(255,255,255,.2)", padding: "20px", display: "flex", gap: "16px", alignItems: "flex-start" }}><span className="d" style={{ fontSize: "30px", fontWeight: "800", color: "#FFB84D" }}>2</span><div><p style={{ margin: "0", fontWeight: "600", fontSize: "18px" }}>Book a consultation call</p><p style={{ margin: "4px 0 0", color: "#A9B8C7", fontSize: "15px" }}>Talk the role through with our team first. <a href="#enquiry" style={{ color: "#37E191" }}>[YOUR BOOKING LINK]</a></p></div></div>
              <div style={{ borderRadius: "18px", border: "1px solid rgba(255,255,255,.2)", padding: "20px", display: "flex", gap: "16px", alignItems: "flex-start" }}><span className="d" style={{ fontSize: "30px", fontWeight: "800", color: "#FFB84D" }}>3</span><div><p style={{ margin: "0", fontWeight: "600", fontSize: "18px" }}>Call or email us</p><p style={{ margin: "4px 0 0", color: "#A9B8C7", fontSize: "15px" }}>[YOUR US PHONE NUMBER] · [YOUR EMAIL ADDRESS]</p></div></div>
            </div>
          </div>

          <div className="rv" style={{ background: "#0D1D30", border: "1px solid rgba(255,255,255,.14)", borderRadius: "26px", padding: "clamp(22px, 3vw, 38px)" }}>
            {sent && (<>
              <div className="pop" role="status" style={{ minHeight: "420px", display: "flex", flexDirection: "column", justifyContent: "center", gap: "18px", alignItems: "flex-start" }}>
                <span style={{ width: "64px", height: "64px", borderRadius: "50%", background: "#37E191", display: "grid", placeItems: "center" }} aria-hidden="true"><span style={{ width: "26px", height: "14px", borderLeft: "4px solid #06131F", borderBottom: "4px solid #06131F", transform: "rotate(-45deg) translate(2px,-3px)" }}></span></span>
                <h3 className="d" style={{ fontSize: "34px", fontWeight: "700" }}>Thank you for sharing your requirements.</h3>
                <p style={{ margin: "0", color: "#D5DEE7" }}>Our team will review your enquiry and contact you to discuss the role, the professionals who fit it and your start date.</p>
              </div>
            </>)}
            {notSent && (<>
              <form onSubmit={noSubmit}>
                <div style={{ display: "flex", gap: "8px" }} aria-hidden="true">
                  {fsteps.map((t, _i) => (<Fragment key={_i}><div style={{ flex: "1", height: "5px", borderRadius: "3px", background: t.bg, transition: "background .4s" }}></div></Fragment>))}
                </div>
                <p className="m" style={{ margin: "16px 0 4px", fontSize: "13px", letterSpacing: ".12em", textTransform: "uppercase", color: "#37E191" }}>{fLabel}</p>

                <fieldset style={{ border: "0", margin: "0", padding: "0", minWidth: "0", display: dA }}>
                  <legend className="d" style={{ fontSize: "28px", fontWeight: "700", padding: "0", marginBottom: "22px" }}>Your business details</legend>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(230px, 100%), 1fr))", gap: "16px" }}>
                    <div><label className="lb" htmlFor="f-name">Full name</label><input className="f" id="f-name" type="text" autoComplete="name" placeholder="Enter your full name" /></div>
                    <div><label className="lb" htmlFor="f-email">Business email</label><input className="f" id="f-email" type="email" autoComplete="email" placeholder="Enter your professional email address" /></div>
                    <div><label className="lb" htmlFor="f-phone">Phone number</label><input className="f" id="f-phone" type="tel" autoComplete="tel" placeholder="Include your country code" /></div>
                    <div><label className="lb" htmlFor="f-co">Company name</label><input className="f" id="f-co" type="text" autoComplete="organization" placeholder="Enter your firm or business name" /></div>
                    <div><label className="lb" htmlFor="f-web">Company website</label><input className="f" id="f-web" type="url" placeholder="https://www.yourcompany.com" /></div>
                    <div><label className="lb" htmlFor="f-loc">Where is your business located?</label><input className="f" id="f-loc" type="text" placeholder="Country and US state, if applicable" /></div>
                  </div>
                  <label className="lb" htmlFor="f-type" style={{ marginTop: "16px" }}>What type of business do you operate?</label>
                  <select className="f" id="f-type"><option>CPA Firm</option><option>Tax Preparation Firm</option><option>Bookkeeping Firm</option><option>Accounting Firm</option><option>Fractional CFO / Advisory Firm</option><option>Small or Medium-Sized Business</option><option>Enterprise</option><option>Other</option></select>
                </fieldset>

                <fieldset style={{ border: "0", margin: "0", padding: "0", minWidth: "0", display: dB }}>
                  <legend className="d" style={{ fontSize: "28px", fontWeight: "700", padding: "0", marginBottom: "22px" }}>Your hiring requirement</legend>
                  <p className="lb" id="l-pro">Which professional are you looking for? <span style={{ fontWeight: "400", color: "#A9B8C7" }}>Select all that apply</span></p>
                  <div role="group" aria-labelledby="l-pro" style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {proPills.map((p, _i) => (<Fragment key={_i}><button type="button" className={`pill ${p.cls} `} aria-pressed={p.on} onClick={p.tog}>{p.t}</button></Fragment>))}
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(230px, 100%), 1fr))", gap: "16px", marginTop: "18px" }}>
                    <div><label className="lb" htmlFor="f-count">How many professionals?</label><select className="f" id="f-count"><option>1</option><option>2–3</option><option>4–5</option><option>6–10</option><option>More than 10</option><option>Not Sure Yet</option></select></div>
                    <div><label className="lb" htmlFor="f-model">Preferred hiring model</label><select className="f" id="f-model"><option>Full-Time Dedicated</option><option>Part-Time Dedicated</option><option>Flexible / Project-Based</option><option>Seasonal Staffing</option><option>I Need Your Recommendation</option></select></div>
                    <div><label className="lb" htmlFor="f-exp">Experience level</label><select className="f" id="f-exp"><option>Junior</option><option>Mid-Level</option><option>Senior</option><option>Reviewer / Team Lead</option><option>Open to Recommendations</option></select></div>
                    <div><label className="lb" htmlFor="f-sched">Working schedule</label><select className="f" id="f-sched"><option>US Eastern Time Overlap</option><option>US Central Time Overlap</option><option>US Mountain Time Overlap</option><option>US Pacific Time Overlap</option><option>Flexible Working Hours</option><option>To Be Discussed</option></select></div>
                  </div>
                  <label className="lb" htmlFor="f-when" style={{ marginTop: "16px" }}>When do you need the professional?</label>
                  <select className="f" id="f-when"><option>As Soon as Possible</option><option>Within 2–4 Weeks</option><option>Within 1–2 Months</option><option>Before the Next Tax Season</option><option>Just Exploring Options</option></select>
                  <p className="lb" id="l-sw" style={{ marginTop: "18px" }}>Which software should they know? <span style={{ fontWeight: "400", color: "#A9B8C7" }}>Select all that apply</span></p>
                  <div role="group" aria-labelledby="l-sw" style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {swPills.map((p, _i) => (<Fragment key={_i}><button type="button" className={`pill ${p.cls} `} aria-pressed={p.on} onClick={p.tog}>{p.t}</button></Fragment>))}
                  </div>
                </fieldset>

                <fieldset style={{ border: "0", margin: "0", padding: "0", minWidth: "0", display: dC }}>
                  <legend className="d" style={{ fontSize: "28px", fontWeight: "700", padding: "0", marginBottom: "22px" }}>Explain the work</legend>
                  <label className="lb" htmlFor="f-work">What will the professional be responsible for?</label>
                  <textarea className="f" id="f-work" rows="7" placeholder="Tell us about the work you need help with. For example, monthly bookkeeping for multiple clients, Form 1040 preparation, bank reconciliations, payroll processing, accounts payable or financial reporting. You can also mention the software you use and any specific experience required."></textarea>
                  <label className="lb" htmlFor="f-jd" style={{ marginTop: "16px" }}>Do you already have a job description? <span style={{ fontWeight: "400", color: "#A9B8C7" }}>Optional · PDF, DOC or DOCX</span></label>
                  <input className="f" id="f-jd" type="file" accept=".pdf,.doc,.docx" />
                </fieldset>

                <fieldset style={{ border: "0", margin: "0", padding: "0", minWidth: "0", display: dD }}>
                  <legend className="d" style={{ fontSize: "28px", fontWeight: "700", padding: "0", marginBottom: "22px" }}>Budget and anything else</legend>
                  <label className="lb" htmlFor="f-budget">Do you have a budget in mind?</label>
                  <select className="f" id="f-budget"><option>Yes, I Have a Fixed Budget</option><option>I Have a Budget Range</option><option>I Need a Cost Estimate</option><option>Open to Recommendations</option></select>
                  <label className="lb" htmlFor="f-more" style={{ marginTop: "16px" }}>Anything else we should know? <span style={{ fontWeight: "400", color: "#A9B8C7" }}>Optional</span></label>
                  <textarea className="f" id="f-more" rows="4" placeholder="Share any additional requirements, challenges or expectations that will help us understand the position."></textarea>
                  <label style={{ display: "flex", gap: "14px", alignItems: "flex-start", marginTop: "18px", fontSize: "15px", color: "#D5DEE7", cursor: "pointer" }}><input type="checkbox" checked={agree} onChange={togAgree} style={{ width: "22px", height: "22px", flex: "0 0 22px", accentColor: "#37E191", marginTop: "2px" }} /><span>I agree that Smart Tax Expertss may use the information provided to contact me about my staffing enquiry, in accordance with its <a href="#enquiry" style={{ color: "#37E191" }}>Privacy Policy</a>.</span></label>
                  {needAgree && (<>
                    <p role="alert" style={{ margin: "12px 0 0", color: "#FFB84D", fontSize: "15px" }}>Please tick the privacy acknowledgement to send your enquiry.</p>
                  </>)}
                </fieldset>

                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "12px", marginTop: "28px" }}>
                  <button type="button" className={`btn b3 fback ${backCls} `} style={{ visibility: backVis }} onClick={fBack}>← Back</button>
                  {notLast && (<>
                    <button type="button" className="btn b1" onClick={fNext}>Continue <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0,display:'inline-block'}}><path d="M5 12h14M13 6l6 6-6 6"/></svg></button>
                  </>)}
                  {isLast && (<>
                    <button type="button" className="btn b1" onClick={fSend}>Request a Hiring Consultation <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0,display:'inline-block'}}><path d="M5 12h14M13 6l6 6-6 6"/></svg></button>
                  </>)}
                </div>
              </form>
            </>)}
          </div>
        </div>
      </section>

      {/* 18 FINAL CTA */}
      <section className="sec" style={{ background: "#37E191", color: "#06131F", position: "relative", overflow: "hidden" }}>
        <div className="wrap rv" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(420px, 100%), 1fr))", gap: "48px", alignItems: "center" }}>
          <div>
            <h2 className="d" style={{ fontSize: "clamp(38px, 5.4vw, 76px)", fontWeight: "800", textWrap: "balance" }}>Don’t let hiring delays hold back your accounting business.</h2>
            <p style={{ margin: "24px 0 0", fontSize: "19px", maxWidth: "620px" }}>You already know what needs to get done. The right person to take responsibility for it is already on our team. One dedicated bookkeeper, an experienced US tax preparer, a payroll specialist or an entire team: tell us what your business needs, choose your professional, and start.</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "14px", marginTop: "32px" }}>
              <a className="btn b4" href="#enquiry">Choose My Professional <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0,display:'inline-block'}}><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>
              <a className="btn b2" href="#enquiry">Talk to Our Team</a>
            </div>
          </div>
          <div className="seat3grid" aria-hidden="true" style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "12px" }}>
            <div className="seat on" style={{ minHeight: "110px" }}><span className="m" style={{ fontSize: "12px" }}>FILLED</span><span style={{ fontWeight: "600" }}>Bookkeeper</span></div>
            <div className="seat on" style={{ minHeight: "110px" }}><span className="m" style={{ fontSize: "12px" }}>FILLED</span><span style={{ fontWeight: "600" }}>Tax preparer</span></div>
            <div className="seat off seatpulse" style={{ minHeight: "110px", borderColor: "#06131F" }}><span className="m" style={{ fontSize: "12px" }}>OPEN</span><span style={{ fontWeight: "600" }}>Your next hire</span></div>
          </div>
        </div>
        <div className="wrap"><p className="d" style={{ marginTop: "64px", paddingTop: "28px", borderTop: "1.5px solid rgba(6,19,31,.3)", fontSize: "clamp(20px, 2.4vw, 30px)", fontWeight: "600", maxWidth: "900px" }}>Let’s find the right accounting professional for your business, with clear expectations from the very beginning.</p></div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: "#07121F", color: "#A9B8C7", padding: "56px 0" }}>
        <div className="wrap" style={{ display: "flex", flexWrap: "wrap", gap: "32px", justifyContent: "space-between" }}>
          <div style={{ flex: "1 1 280px" }}>
            <p className="d" style={{ color: "#FFFFFF", fontSize: "22px", fontWeight: "700" }}>Smart Tax <span style={{ color: "#37E191" }}>Expertss</span></p>
            <p style={{ margin: "12px 0 0", fontSize: "15px", maxWidth: "380px" }}>A ready, in-house team of accounting professionals in India for US businesses. You choose the talent, the work starts, and the staffing support is clearly defined.</p>
          </div>
          <nav aria-label="Related services" style={{ flex: "1 1 280px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(200px, 100%), 1fr))", gap: "4px 24px", alignContent: "start" }}>
            <a className="navl" href="#top">USA Tax Preparation Services</a>
            <a className="navl" href="#top">Bookkeeping Services</a>
            <a className="navl" href="#top">Payroll Management Services</a>
            <a className="navl" href="#top">Tax Planning Services</a>
            <a className="navl" href="#top">Outsourced Accounting Services</a>
            <a className="navl" href="#enquiry">Contact Us</a>
          </nav>
        </div>
      </footer>


    </div>
  );
}
