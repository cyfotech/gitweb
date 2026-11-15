import { Fragment, useEffect, useRef, useState } from 'react';
import usePageData from './usePageData';
import './App.css';

const NAV = [
  ['#who', 'Who we help'],
  ['#roles', 'Professionals'],
  ['#models', 'Hiring models'],
  ['#process', 'Process'],
  ['#pricing', 'Pricing'],
  ['#faq', 'FAQ'],
];

/* Sticky header: inline nav on laptop/desktop, slide-down menu on tablet/mobile */
function Header() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    const onResize = () => window.innerWidth > 900 && setOpen(false);
    window.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const close = () => setOpen(false);

  return (
    <header className="hdr">
      <div className="wrap hdr-in">
        <a href="#top" className="d hdr-logo" onClick={close}>
          Smart Tax <span style={{ color: '#37E191' }}>Expertss</span>
        </a>
        <nav className="navlinks" aria-label="Page sections">
          {NAV.map(([href, label]) => (
            <a key={href} className="navl" href={href}>{label}</a>
          ))}
        </nav>
        <div className="hdr-right">
          <a className="btn b1 hdr-cta" href="#enquiry">
            Request professionals <span className="ar" aria-hidden="true">→</span>
          </a>
          <button
            type="button"
            className={'burger' + (open ? ' on' : '')}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)}
          >
            <span /><span /><span />
          </button>
        </div>
      </div>
      <nav id="mobile-menu" className={'mnav' + (open ? ' open' : '')} aria-label="Page sections (mobile)">
        <div className="wrap">
          {NAV.map(([href, label]) => (
            <a key={href} className="navl" href={href} onClick={close}>{label}</a>
          ))}
          <a className="btn b1" href="#enquiry" onClick={close} style={{ marginTop: 12 }}>
            Request professionals <span className="ar" aria-hidden="true">→</span>
          </a>
        </div>
      </nav>
    </header>
  );
}

export default function App() {
  const root = useRef(null);
  const {
    clockUS, clockIN, auds, audLine, laneA, routine, senior, modeA, modeB, modeAcls, modeBcls, setModeA, setModeB, meterW, meterC, meterLabel, boardNote, who, why, whyShift, whyPct, whyCount, whyPrev, whyNext, fit, fitMsg, match, roles, patterns, isOngoing, isSeasonal, isProject, hrs, setHrs, cells, months, models, steps, stepPct, stepPrev, stepNext, gantt, cases, ucShift, ucPrev, ucNext, inds, sws, marquee, stages, seats, seatAria, faqs, sent, notSent, fsteps, fLabel, dA, dB, dC, dD, proPills, swPills, agree, togAgree, needAgree, backVis, backCls, fBack, fNext, notLast, isLast, fSend, noSubmit,
  } = usePageData();

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


{/* NAV */}
<Header />

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
        <h2 className="d" style={{ fontSize: "clamp(38px, 5vw, 68px)", fontWeight: "800" }}>Need an accountant, bookkeeper or tax professional? <span style={{ color: "#37E191" }}>Let's find the right person</span> for your business.</h2>
        <div role="group" aria-label="I am hiring for" style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "34px" }}>
          {auds.map((a, _i) => (<Fragment key={_i}>
            <button type="button" className={`tabd ${a.cls}`} aria-pressed={a.pressed} onClick={a.pick}>{a.label}</button>
          </Fragment>))}
        </div>
        <p style={{ fontSize: "19px", color: "#D5DEE7", margin: "24px 0 0", maxWidth: "600px", minHeight: "92px", textWrap: "pretty" }}>{audLine}</p>
        <p style={{ fontSize: "16px", color: "#A9B8C7", margin: "14px 0 0", maxWidth: "600px" }}>Our team is already in place. No job posts, no resume rounds, no weeks of screening on your side. Tell us the work, choose the professional you want from our team, and get started. <strong style={{ color: "#FFFFFF" }}>You decide who joins, what work gets done and how they fit your operations.</strong></p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "14px", marginTop: "34px" }}>
          <a className="btn b1" href="#enquiry">Request Accounting Professionals <span className="ar" aria-hidden="true">→</span></a>
          <a className="btn b3" href="#models">Explore Hiring Options</a>
        </div>
      </div>

      {/* team board */}
      <div className="fade heroboard" style={{ background: "#0D1D30", border: "1px solid rgba(255,255,255,.14)", borderRadius: "26px", padding: "26px", boxShadow: "0 40px 90px -40px rgba(0,0,0,.8)" }}>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "14px" }}>
          <p className="m" style={{ margin: "0", fontSize: "13px", letterSpacing: ".12em", textTransform: "uppercase", color: "#A9B8C7" }}>Team board · illustrative</p>
          <div role="group" aria-label="Compare" style={{ display: "flex", background: "rgba(255,255,255,.08)", borderRadius: "999px", padding: "4px" }}>
            <button type="button" className={`tabd ${modeAcls}`} style={{ borderColor: "transparent", minHeight: "44px" }} aria-pressed={modeA} onClick={setModeA}>Today</button>
            <button type="button" className={`tabd ${modeBcls}`} style={{ borderColor: "transparent", minHeight: "44px" }} aria-pressed={modeB} onClick={setModeB}>With a dedicated seat</button>
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

{/* 02 WHO WE HELP */}
<section id="who" className="sec">
  <div className="wrap">
    <div className="rv">
      <p className="eb" style={{ color: "#0E7A49" }}>02 · Who we help</p>
      <h2 className="d h2">Different businesses have different hiring problems. We help you find the right people for them.</h2>
      <p className="lead">A CPA firm hiring its fifth tax preparer has very different requirements from a small business looking for its first bookkeeper. So we start with your business and the work involved, not with one staffing arrangement for everyone.</p>
    </div>
    <div role="group" aria-label="Business type" className="rv" style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "44px" }}>
      {who.map((w, _i) => (<Fragment key={_i}>
        <button type="button" className={`tab ${w.cls}`} aria-pressed={w.pressed} onClick={w.pick}>{w.label}</button>
      </Fragment>))}
    </div>
    {who.map((w, _i) => (<Fragment key={_i}>
      {w.on && (<>
        <div className="card fade" style={{ marginTop: "22px", padding: "clamp(24px, 4vw, 52px)", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(380px, 100%), 1fr))", gap: "44px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "18px", alignItems: "flex-start" }}>
            <p className="m" style={{ margin: "0", fontSize: "13px", color: "#55605C", letterSpacing: ".1em" }}>{w.num} / 06</p>
            <h3 className="d" style={{ fontSize: "clamp(26px, 3vw, 40px)", fontWeight: "700" }}>{w.h}</h3>
            <p style={{ margin: "0", color: "#2B3A47" }}>{w.p}</p>
            <a className="btn b4" href="#enquiry" style={{ marginTop: "8px" }}>{w.cta} <span className="ar" aria-hidden="true">→</span></a>
          </div>
          <div style={{ background: "#F2F4F0", borderRadius: "18px", padding: "28px" }}>
            <p className="m" style={{ margin: "0 0 16px", fontSize: "13px", letterSpacing: ".1em", textTransform: "uppercase", color: "#55605C" }}>{w.useLabel}</p>
            <ul className="ck">{w.uses.map((u, _i) => (<Fragment key={_i}><li className="pop" style={{ animationDelay: u.delay }}>{u.t}</li></Fragment>))}</ul>
          </div>
        </div>
      </>)}
    </Fragment>))}
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
        <a className="btn b1" href="#enquiry" style={{ marginTop: "auto" }}>Discuss My Accounting Staffing Needs <span className="ar" aria-hidden="true">→</span></a>
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
          <button type="button" className={`rowbtn ${r.cls}`} aria-pressed={r.pressed} onClick={r.pick}><span>{r.c}</span><span aria-hidden="true">→</span></button>
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
              <a className="btn b1" href="#roles" style={{ marginTop: "32px" }}>Explore Professionals You Can Hire <span className="ar" aria-hidden="true">→</span></a>
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
    <div className="rv" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(300px, 100%), 1fr))", gap: "12px", marginTop: "44px" }}>
      {roles.map((r, _i) => (<Fragment key={_i}>
        <button type="button" className={`rowbtn ${r.cls}`} style={{ background: "#FFFFFF" }} aria-pressed={r.pressed} onClick={r.pick}><span><span className="m" style={{ fontSize: "13px", opacity: ".7" }}>{r.num}</span>&nbsp;&nbsp;{r.label}</span><span aria-hidden="true">+</span></button>
      </Fragment>))}
    </div>
    {roles.map((r, _i) => (<Fragment key={_i}>
      {r.on && (<>
        <div className="card fade" style={{ marginTop: "20px", overflow: "hidden" }}>
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
              <a className="btn b4" href="#enquiry" style={{ marginTop: "10px" }}>{r.cta} <span className="ar" aria-hidden="true">→</span></a>
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
      <h2 className="d h2">You don't have to hire everyone full-time. Choose based on your actual workload.</h2>
      <p className="lead" style={{ color: "#D5DEE7" }}>One of the biggest hiring mistakes is choosing a full-time position before understanding how much work the role actually involves. Move the dial to see a starting point.</p>
    </div>
    <div className="rv" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(420px, 100%), 1fr))", gap: "28px", marginTop: "48px" }}>
      <div style={{ background: "#0D1D30", border: "1px solid rgba(255,255,255,.14)", borderRadius: "24px", padding: "clamp(22px, 3vw, 36px)" }}>
        <p style={{ margin: "0 0 12px", fontWeight: "600" }}>How does the work arrive?</p>
        <div role="group" aria-label="Workload pattern" style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          {patterns.map((p, _i) => (<Fragment key={_i}>
            <button type="button" className={`tabd ${p.cls}`} aria-pressed={p.pressed} onClick={p.pick}>{p.label}</button>
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
            <p className="m" style={{ margin: "28px 0 10px", fontSize: "12px", letterSpacing: ".1em", textTransform: "uppercase", color: "#A9B8C7" }}>A tax practice's year · illustrative</p>
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
              <a className="btn b4" href="#enquiry" style={{ marginTop: "8px" }}>{mm.cta} <span className="ar" aria-hidden="true">→</span></a>
            </div>
          </>)}
        </Fragment>))}
        <p style={{ margin: "auto 0 0", paddingTop: "16px", fontSize: "14px", borderTop: "1px solid rgba(6,19,31,.25)", width: "100%" }}>Starting points only. The final recommendation depends on workload, required availability and the continuity you need.</p>
      </div>
    </div>
    <div className="rv" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(320px, 100%), 1fr))", gap: "20px", marginTop: "28px" }}>
      {models.map((mm, _i) => (<Fragment key={_i}>
        <div style={{ borderRadius: "22px", padding: "28px", border: `1.5px solid ${mm.bd}`, background: mm.bg, transition: "all .4s", display: "flex", flexDirection: "column", gap: "14px" }}>
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
    <div className="rv" style={{ marginTop: "36px", textAlign: "center" }}><a className="btn b1" href="#enquiry">Help Me Choose the Right Model <span className="ar" aria-hidden="true">→</span></a></div>
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
              <button type="button" className={`stepb ${s.cls}`} aria-pressed={s.pressed} aria-label={s.aria} onClick={s.pick}><b>{s.num}</b></button>
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
        <a className="btn b1" href="#enquiry">Choose My Professional <span className="ar" aria-hidden="true">→</span></a>
      </div>
    </div>
  </div>
</section>

{/* 07 TIMELINE */}
<section id="timeline" className="sec" style={{ background: "#FFFFFF" }}>
  <div className="wrap">
    <div className="rv">
      <p className="eb" style={{ color: "#0E7A49" }}>07 · Getting started</p>
      <h2 className="d h2">How quickly can work start?</h2>
      <p className="lead">Hiring is usually tied to a deadline: a tax season approaching, a team member leaving, a growing client workload. Because our team already exists, the slow parts of hiring are gone. What is left mostly depends on you.</p>
    </div>
    <div style={{ display: "grid", gap: "14px", marginTop: "48px" }}>
      {gantt.map((g, _i) => (<Fragment key={_i}>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "8px 24px" }}>
          <p style={{ flex: "1 1 250px", margin: "0", fontWeight: "600" }}>{g.t}</p>
          <div style={{ flex: "999 1 380px", minWidth: "0", background: "#F2F4F0", borderRadius: "9px", padding: "0" }}>
            <div className={`bar sx ganttbar ${g.cls}`} style={{ marginLeft: g.l, width: g.w, backgroundColor: g.bg, display: "flex", alignItems: "center", padding: "0 12px", minWidth: "max-content" }}><span className="m" style={{ fontSize: "13px", color: "#06131F", whiteSpace: "nowrap" }}>{g.est}</span></div>
          </div>
        </div>
      </Fragment>))}
    </div>
    <div className="rv" style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "20px", marginTop: "36px" }}>
      <p style={{ margin: "0", maxWidth: "760px", fontSize: "15px", color: "#55605C" }}>There are no job posts, resume rounds or screening on your side. The start date depends on how soon you can meet and choose, the availability of the professional you want, and onboarding and system access. Typical time from first conversation to work starting: [YOUR TYPICAL START TIME].</p>
      <a className="btn b2" href="#enquiry">Discuss My Start Date <span className="ar" aria-hidden="true">→</span></a>
    </div>
  </div>
</section>

{/* 08 AFTER HIRE */}
<section id="after" className="sec" style={{ background: "#07121F", color: "#FFFFFF" }}>
  <div className="wrap">
    <div className="rv">
      <p className="eb" style={{ color: "#37E191" }}>08 · What happens after you hire someone?</p>
      <h2 className="d h2">We stay involved after you choose.</h2>
      <p className="lead" style={{ color: "#D5DEE7" }}>You also need a clear arrangement for employment, communication, attendance, performance and continuity. The exact split depends on the agreed engagement model and employing structure.</p>
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(420px, 100%), 1fr))", gap: "22px", marginTop: "48px" }}>
      <div className="rv" style={{ borderRadius: "24px", padding: "clamp(24px, 3vw, 40px)", background: "rgba(55,225,145,.08)", border: "1.5px solid rgba(55,225,145,.45)" }}>
        <p className="m" style={{ margin: "0", fontSize: "13px", letterSpacing: ".12em", textTransform: "uppercase", color: "#37E191" }}>Where included in your agreement</p>
        <h3 className="d" style={{ fontSize: "30px", fontWeight: "700", margin: "12px 0 22px" }}>What Smart Tax Expertss handles</h3>
        <ul className="ck ckd" style={{ color: "#D5DEE7", fontSize: "16px" }}>
          <li>Providing professionals from our in-house team.</li>
          <li>Matching them to your role and software.</li>
          <li>Introductions and onboarding coordination.</li>
          <li>Employment documentation.</li>
          <li>Salary and HR administration.</li>
          <li>Attendance and leave coordination.</li>
          <li>Employee support and employment-related communication.</li>
          <li>Performance concern escalation.</li>
          <li>A replacement from our team where required.</li>
          <li>Transition and knowledge-transfer coordination.</li>
        </ul>
      </div>
      <div className="rv" style={{ borderRadius: "24px", padding: "clamp(24px, 3vw, 40px)", background: "rgba(255,184,77,.08)", border: "1.5px solid rgba(255,184,77,.5)" }}>
        <p className="m" style={{ margin: "0", fontSize: "13px", letterSpacing: ".12em", textTransform: "uppercase", color: "#FFB84D" }}>In a client-managed arrangement</p>
        <h3 className="d" style={{ fontSize: "30px", fontWeight: "700", margin: "12px 0 22px" }}>What you continue to control</h3>
        <ul className="ck cka" style={{ color: "#D5DEE7", fontSize: "16px" }}>
          <li>Assigning daily tasks.</li>
          <li>Setting work priorities.</li>
          <li>Defining accounting procedures.</li>
          <li>Explaining client-specific requirements.</li>
          <li>Providing authorized system access.</li>
          <li>Reviewing completed work.</li>
          <li>Approving financial transactions.</li>
          <li>Managing your customer relationships.</li>
          <li>Making final business decisions.</li>
          <li>Approving tax returns and filings through authorized personnel.</li>
        </ul>
      </div>
    </div>
    <div className="rv" style={{ marginTop: "22px", borderRadius: "24px", background: "#0D1D30", border: "1px solid rgba(255,255,255,.14)", padding: "clamp(24px, 3vw, 40px)", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(360px, 100%), 1fr))", gap: "28px", alignItems: "center" }}>
      <div>
        <h3 className="d" style={{ fontSize: "30px", fontWeight: "700" }}>Who employs the professional?</h3>
        <p style={{ margin: "14px 0 0", color: "#D5DEE7", fontSize: "16px" }}>This should never be left unclear. The professionals are part of our team: Smart Tax Expertss or its designated Indian employing entity employs them and manages the agreed employment responsibilities. Your US business manages the assigned work under the contract. The employing entity, supervision structure, payroll obligations and legal responsibilities must match the real arrangement and be documented properly.</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "14px", alignItems: "flex-start" }}>
        <p style={{ margin: "0", fontSize: "19px" }}>You know your clients and your internal processes better than anyone else. The professional should work the way your business operates.</p>
        <a className="btn b1" href="#enquiry">Understand How the Engagement Works <span className="ar" aria-hidden="true">→</span></a>
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
    <div className="rv card" style={{ marginTop: "40px", overflow: "hidden" }}>
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
          {cases.map((u, _i) => (<Fragment key={_i}><button type="button" className={`dot ${u.cls}`} aria-label={u.aria} aria-pressed={u.pressed} onClick={u.pick}><i></i></button></Fragment>))}
        </div>
        <a className="btn b4" href="#enquiry">Discuss a Similar Requirement <span className="ar" aria-hidden="true">→</span></a>
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
          <button type="button" className={`tab ${n.cls}`} aria-pressed={n.pressed} onClick={n.pick}>{n.label}</button>
        </Fragment>))}
      </div>
      <div>
        {inds.map((n, _i) => (<Fragment key={_i}>
          {n.on && (<>
            <div className="pop" style={{ borderRadius: "22px", background: "#F2F4F0", padding: "clamp(24px, 3vw, 40px)", display: "flex", flexDirection: "column", gap: "16px", alignItems: "flex-start" }}>
              <h3 className="d" style={{ fontSize: "30px", fontWeight: "700" }}>{n.label}</h3>
              <p style={{ margin: "0", fontSize: "18px" }}>{n.text}</p>
              <a className="btn b4" href="#enquiry">Find Professionals for My Industry <span className="ar" aria-hidden="true">→</span></a>
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
      <h2 className="d h2">Your business already has its systems. Let's find someone who knows how to use them.</h2>
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
          <button type="button" className={`rowbtn ${w.cls}`} style={{ background: "#F2F4F0" }} aria-pressed={w.pressed} onClick={w.pick}><span>{w.label}</span><span aria-hidden="true">→</span></button>
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
        <a className="btn b2" href="#enquiry" style={{ marginTop: "20px" }}>Find Someone Who Knows My Software <span className="ar" aria-hidden="true">→</span></a>
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
        <a className="btn b4" href="#enquiry">Discuss Our Security &amp; Data Handling Process <span className="ar" aria-hidden="true">→</span></a>
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
        <button type="button" className={`tab ${g.cls}`} aria-pressed={g.pressed} onClick={g.pick}>Stage {g.num}</button>
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
        <a className="btn b4" href="#enquiry" style={{ marginTop: "20px" }}>Plan My Offshore Accounting Team <span className="ar" aria-hidden="true">→</span></a>
      </div>
      <div role="img" aria-label={seatAria} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(170px, 100%), 1fr))", gap: "14px" }}>
        {seats.map((e, _i) => (<Fragment key={_i}>
          <div className={`seat ${e.cls}`}><span className="m" style={{ fontSize: "12px", letterSpacing: ".1em", textTransform: "uppercase", opacity: ".8" }}>{e.state}</span><span style={{ fontWeight: "600", fontSize: "17px" }}>{e.role}</span></div>
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
        <a className="btn b2" href="#enquiry" style={{ marginTop: "22px" }}>Understand Our Continuity Arrangements <span className="ar" aria-hidden="true">→</span></a>
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
          <a className="btn b1" href="#enquiry">Request a Staffing Proposal <span className="ar" aria-hidden="true">→</span></a>
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
      <a className="btn b2" href="#enquiry" style={{ marginTop: "26px" }}>Talk to Our Team <span className="ar" aria-hidden="true">→</span></a>
    </div>
    <div className="rv" style={{ gridColumn: "span 1", borderTop: "1.5px solid #0F1B2A" }}>
      {faqs.map((q, _i) => (<Fragment key={_i}>
        <div style={{ borderBottom: "1px solid rgba(15,27,42,.18)" }}>
          <h3 style={{ margin: "0" }}><button type="button" className={`faqb ${q.cls}`} aria-expanded={q.open} onClick={q.tog}><span>{q.q}</span><span className="pm" aria-hidden="true">+</span></button></h3>
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
      <h2 className="d h2">Tell us what kind of professional you need. We'll take it from there.</h2>
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
              {proPills.map((p, _i) => (<Fragment key={_i}><button type="button" className={`pill ${p.cls}`} aria-pressed={p.on} onClick={p.tog}>{p.t}</button></Fragment>))}
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
              {swPills.map((p, _i) => (<Fragment key={_i}><button type="button" className={`pill ${p.cls}`} aria-pressed={p.on} onClick={p.tog}>{p.t}</button></Fragment>))}
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
            <button type="button" className={`btn b3 fback ${backCls}`} style={{ visibility: backVis }} onClick={fBack}>← Back</button>
            {notLast && (<>
              <button type="button" className="btn b1" onClick={fNext}>Continue <span className="ar" aria-hidden="true">→</span></button>
            </>)}
            {isLast && (<>
              <button type="button" className="btn b1" onClick={fSend}>Request a Hiring Consultation <span className="ar" aria-hidden="true">→</span></button>
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
      <h2 className="d" style={{ fontSize: "clamp(38px, 5.4vw, 76px)", fontWeight: "800", textWrap: "balance" }}>Don't let hiring delays hold back your accounting business.</h2>
      <p style={{ margin: "24px 0 0", fontSize: "19px", maxWidth: "620px" }}>You already know what needs to get done. The right person to take responsibility for it is already on our team. One dedicated bookkeeper, an experienced US tax preparer, a payroll specialist or an entire team: tell us what your business needs, choose your professional, and start.</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "14px", marginTop: "32px" }}>
        <a className="btn b4" href="#enquiry">Choose My Professional <span className="ar" aria-hidden="true">→</span></a>
        <a className="btn b2" href="#enquiry">Talk to Our Team</a>
      </div>
    </div>
    <div className="seat3grid" aria-hidden="true" style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "12px" }}>
      <div className="seat on" style={{ minHeight: "110px" }}><span className="m" style={{ fontSize: "12px" }}>FILLED</span><span style={{ fontWeight: "600" }}>Bookkeeper</span></div>
      <div className="seat on" style={{ minHeight: "110px" }}><span className="m" style={{ fontSize: "12px" }}>FILLED</span><span style={{ fontWeight: "600" }}>Tax preparer</span></div>
      <div className="seat off seatpulse" style={{ minHeight: "110px", borderColor: "#06131F" }}><span className="m" style={{ fontSize: "12px" }}>OPEN</span><span style={{ fontWeight: "600" }}>Your next hire</span></div>
    </div>
  </div>
  <div className="wrap"><p className="d" style={{ marginTop: "64px", paddingTop: "28px", borderTop: "1.5px solid rgba(6,19,31,.3)", fontSize: "clamp(20px, 2.4vw, 30px)", fontWeight: "600", maxWidth: "900px" }}>Let's find the right accounting professional for your business, with clear expectations from the very beginning.</p></div>
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
