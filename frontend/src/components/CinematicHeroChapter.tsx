import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FinancialDonutChart } from "./FinancialDonutChart";
import "./CinematicHeroChapter.css";

/* ------------------------------------------------------------------ */
/*  Types                                                               */
/* ------------------------------------------------------------------ */
interface CinematicHeroChapterProps {
  cmsContent?: Record<string, unknown>;
  onOpenConsultation?: (category?: string, service?: string) => void;
  onExploreWork?: () => void;
  onOpenCalculator?: () => void;
}

/* ------------------------------------------------------------------ */
/*  Service data                                                        */
/* ------------------------------------------------------------------ */
const services = [
  {
    label: "TAX",
    title: "USA Tax Preparation",
    category: "USA TAX PREPARATION",
    description:
      "Every return is prepared, reviewed, and finalized under a considered workflow, minimizing risk and supporting individuals, businesses, nonprofits, and trusts with their tax compliance.",
    items: [
      "Individual returns: Form 1040, 1040-SR, 1040-NR",
      "Partnerships: Form 1065 & Schedule K-1s",
      "S Corporations: Form 1120-S",
      "C Corporations: Form 1120",
      "Prior-year, amended, and extension returns",
    ],
    forms: ["1040", "1065", "1120-S", "1120", "990"],
  },
  {
    label: "BKP",
    title: "Bookkeeping & Accounting",
    category: "BOOKKEEPING",
    description:
      "Every transaction recorded, classified and reconciled so your books show where the business really stands every month, not only at tax time.",
    items: [
      "Full-cycle daily, weekly or monthly bookkeeping",
      "Bank, credit card, PayPal and Stripe reconciliation",
      "General Ledger & Chart of Accounts setup",
      "P&L, Balance Sheet and Cash Flow generation",
      "Month-end and year-end close packages",
    ],
    forms: ["QBO", "Xero", "P&L", "Balance Sheet"],
  },
  {
    label: "PAY",
    title: "Payroll Management",
    category: "PAYROLL MANAGEMENT",
    description:
      "Wages calculated, withholding applied, employer taxes accounted for and every pay run reconciled, through to year-end W-2s.",
    items: [
      "Hourly & salaried gross-to-net calculations",
      "Federal, state and local multi-state withholding",
      "Social Security, Medicare, FUTA & SUTA filing",
      "401(k), HSA and benefit pre-tax deductions",
      "Contractor compliance & Form 1099-NEC",
    ],
    forms: ["W-2", "W-3", "941", "940"],
  },
  {
    label: "PLN",
    title: "Tax Planning & Advisory",
    category: "TAX PLANNING",
    description:
      "Tax planning looks ahead, with projections and estimates while there is still time to act. We help businesses evaluate financial decisions and plan for tax obligations.",
    items: [
      "Annual income and tax liability projections",
      "Quarterly estimated tax calculations (1040-ES)",
      "Entity structure & S-Corp compensation evaluation",
      "Section 179 & bonus depreciation acceleration",
      "Year-end tax optimization roadmap",
    ],
    forms: ["1040", "1120", "1065", "1120-S"],
  },
  {
    label: "AP/AR",
    title: "Accounts Payable & Receivable",
    category: "ACCOUNTS MANAGEMENT",
    description:
      "A clear picture of what your business owes and what it needs to collect — invoices verified, balances tracked and aging reported.",
    items: [
      "Vendor onboarding and W-9 verification",
      "2-way and 3-way invoice matching",
      "Payment run approval workflows",
      "Customer invoicing and unapplied cash clearing",
      "Granular 30/60/90-day aging reports",
    ],
    forms: ["INVOICES", "PAYMENTS", "AGING", "REPORTS"],
  },
  {
    label: "INTL",
    title: "International Tax Services",
    category: "INTERNATIONAL TAX",
    description:
      "Foreign accounts, overseas companies and cross-border payments carry their own US reporting rules. We organize the information and prepare the required forms.",
    items: [
      "FBAR: FinCEN Form 114 reporting",
      "FATCA: Form 8938 specified foreign assets",
      "Foreign corporations: Form 5471",
      "Foreign-owned US entities: Form 5472",
      "Foreign Tax Credit (Form 1116) optimization",
    ],
    forms: ["1040-NR", "5471", "5472", "FBAR"],
  },
  {
    label: "FILE",
    title: "Tax Filing & E-File",
    category: "TAX FILING",
    description:
      "Preparing a return and submitting it are separate stages. We coordinate authorization, e-filing, acknowledgments and any rejection fixes.",
    items: [
      "Direct electronic transmission to IRS & State",
      "Form 8879 e-signature collection",
      "IRS MeF acknowledgment tracking",
      "Immediate reject code resolution",
      "Form 4868 / 7004 extension filings",
    ],
    forms: ["1040", "1065", "1120", "1120-S", "990"],
  },
];

const features = [
  {
    icon: "♢",
    label: "PROCESS",
    title: "Structured review",
    description: "Clear checkpoints",
  },
  {
    icon: "▤",
    label: "DOCUMENTS",
    title: "Organized intake",
    description: "Review-ready flow",
  },
  {
    icon: "▥",
    label: "VISIBILITY",
    title: "Clear milestones",
    description: "Progress at a glance",
  },
  {
    icon: "♙",
    label: "DELIVERY",
    title: "Human oversight",
    description: "Quality-minded workflow",
  },
];

/* ------------------------------------------------------------------ */
/*  Portfolio Mix data (shown in donut chart view)                      */
/* ------------------------------------------------------------------ */
const portfolioMix = [
  {
    id: "tax-preparation",
    name: "Tax Preparation",
    value: 1280000,
    color: "#07884d",
    description: "Prepared and reviewed returns across individual and business clients.",
    metric: "4,200+ returns",
  },
  {
    id: "bookkeeping",
    name: "Bookkeeping & Accounting",
    value: 920000,
    color: "#20b97a",
    description: "Reconciliations, monthly close, and reliable financial records.",
    metric: "3,500+ closes",
  },
  {
    id: "payroll",
    name: "Payroll Management",
    value: 610000,
    color: "#d3a753",
    description: "Accurate payroll processing and employee pay-cycle support.",
    metric: "1,800+ pay runs",
  },
  {
    id: "advisory",
    name: "Tax Planning & Advisory",
    value: 480000,
    color: "#728fb5",
    description: "Strategic planning, projections, and entity structure guidance.",
    metric: "900+ advisory sessions",
  },
];

/* ------------------------------------------------------------------ */
/*  Component                                                           */
/* ------------------------------------------------------------------ */
export function CinematicHeroChapter({
  onOpenConsultation,
  onExploreWork,
  onOpenCalculator,
}: CinematicHeroChapterProps) {
  const navigate = useNavigate();
  const [activeService, setActiveService] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [activeView, setActiveView] = useState<"orbital" | "portfolio">("orbital");

  const currentService = services[activeService];

  const selectService = useCallback((index: number) => {
    setActiveService(((index % services.length) + services.length) % services.length);
  }, []);

  const nextService = useCallback(() => {
    setActiveService((prev) => (prev + 1) % services.length);
  }, []);

  /* Auto-rotate every 3 s, pause while hovering/focusing the dashboard */
  useEffect(() => {
    if (isPaused) return;
    const timer = window.setInterval(() => {
      setActiveService((prev) => (prev + 1) % services.length);
    }, 3000);
    return () => window.clearInterval(timer);
  }, [isPaused]);

  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);
  const handleFocus = () => setIsPaused(true);
  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
      setIsPaused(false);
    }
  };

  /* Button handlers — fall back to navigation if no prop provided */
  const handleConsultation = () => {
    if (onOpenConsultation) {
      onOpenConsultation("cpa", "tax-prep-outsourcing");
    } else {
      navigate("/contact");
    }
  };

  const handleCalculator = () => {
    if (onOpenCalculator) {
      onOpenCalculator();
    } else {
      navigate("/tax-calculator");
    }
  };

  const handleExplore = () => {
    if (onExploreWork) {
      onExploreWork();
    } else {
      navigate("/services");
    }
  };

  return (
    <div className="cinematic-hero">

      {/* ── Hero layout ── */}
      <section className="hero-main">

        {/* Left column */}
        <div className="hero-left">

          <div className="hero-eyebrow">
            <span></span>
            STRATEGIC US TAX &amp; CPA ADVISORY
            <i></i>
          </div>

          <h1 className="hero-heading">
            Financial clarity.
            <span>Engineered</span>
            <span>for growth.</span>
          </h1>

          <p className="hero-description">
            High-precision tax preparation, bespoke entity advisory,
            and scalable white-label CPA capacity engineered for
            modern accounting firms and expanding enterprises.
          </p>

          {/* Action Buttons */}
          <div className="hero-buttons">
            <button
              type="button"
              className="hero-button primary"
              onClick={handleConsultation}
            >
              Book Strategic Consultation <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0,display:'inline-block',marginLeft:'2px'}}>
                <path d="M5 12h14M13 6l6 6-6 6"/>
              </svg>
            </button>

            <button
              type="button"
              className="hero-button secondary"
              onClick={handleCalculator}
            >
              ▦&nbsp;&nbsp;Calculate Your US Taxes
            </button>

            <button
              type="button"
              className="hero-button outline"
              onClick={handleExplore}
            >
              Explore Practices <span>⌄</span>
            </button>
          </div>

          {/* Static feature cards */}
          <div className="hero-features">
            {features.map((feature) => (
              <div className="hero-feature" key={feature.label}>
                <div className="feature-icon">{feature.icon}</div>
                <small>{feature.label}</small>
                <strong>{feature.title}</strong>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>

        </div>

        {/* Right column — interactive dashboard */}
        <div className="hero-right">

          <div className="dashboard-top">
            <button
              type="button"
              className={`dashboard-pill${activeView === "orbital" ? " active" : ""}`}
              onClick={() => setActiveView("orbital")}
              aria-pressed={activeView === "orbital"}
            >
              ◈&nbsp;&nbsp;7-Service Orbital
            </button>

            <button
              type="button"
              className={`dashboard-pill${activeView === "portfolio" ? " active" : " transparent"}`}
              onClick={() => setActiveView("portfolio")}
              aria-pressed={activeView === "portfolio"}
            >
              ◷&nbsp;&nbsp;Portfolio Mix
            </button>
          </div>

          <div
            className="service-dashboard"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onFocus={handleFocus}
            onBlur={handleBlur}
          >
            {activeView === "orbital" ? (
              <>
                {/* Header */}
                <div className="dashboard-header">
                  <span>
                    <i></i>
                    TRANSACTION JOURNEY → {services.length} INTERCONNECTED PRACTICES
                  </span>
                  <strong>{currentService.label} ACTIVE</strong>
                </div>

                <div className="dashboard-content">

                  {/* Orbital diagram */}
                  <div className="orbital-area" aria-label="7-service orbital wheel">
                    <div className="orbital-ring"></div>

                    {services.map((service, index) => (
                      <button
                        key={service.label}
                        type="button"
                        className={`orbital-node node-${index + 1}${activeService === index ? " selected" : ""}`}
                        onClick={() => selectService(index)}
                        aria-label={`Show ${service.title}`}
                        aria-pressed={activeService === index}
                      >
                        {service.label}
                      </button>
                    ))}

                    <div className="orbital-center">
                      <span>ONE HUB</span>
                      <strong>7 Unified Services</strong>
                      <small>SECURE · RELIABLE · SCALABLE</small>
                    </div>
                  </div>

                  {/* Dynamic service details */}
                  <div className="dashboard-details">

                    <div className="detail-heading">
                      <div className="detail-icon">▤</div>
                      <div>
                        <small>
                          {String(activeService + 1).padStart(2, "0")} — {currentService.category}
                        </small>
                        <h3>{currentService.title}</h3>
                      </div>
                    </div>

                    <p className="detail-description">{currentService.description}</p>

                    <ul className="detail-list">
                      {currentService.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>

                    <div className="form-tags">
                      <strong>KEY TAGS:</strong>
                      {currentService.forms.map((form) => (
                        <span key={form}>{form}</span>
                      ))}
                    </div>

                    <div className="dashboard-progress">
                      <div
                        className="progress-line"
                        role="progressbar"
                        aria-label="Service progress"
                        aria-valuemin={0}
                        aria-valuemax={services.length}
                        aria-valuenow={activeService + 1}
                      >
                        <span
                          style={{
                            width: `${((activeService + 1) / services.length) * 100}%`,
                          }}
                        />
                      </div>

                      <strong>
                        Step {String(activeService + 1).padStart(2, "0")} of 0{services.length}
                      </strong>

                      <button
                        type="button"
                        className="progress-next"
                        onClick={nextService}
                        aria-label="Next service"
                      >
                        <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
                      </button>
                    </div>

                  </div>
                </div>
              </>
            ) : (
              /* Portfolio Mix view */
              <div className="portfolio-view">
                <div className="dashboard-header">
                  <span>
                    <i></i>
                    PORTFOLIO MIX · SERVICE REVENUE BREAKDOWN
                  </span>
                  <strong>LIVE DATA</strong>
                </div>
                <FinancialDonutChart
                  data={portfolioMix}
                  title="Financial operations"
                  subtitle="A clearer view of work delivered across your firm."
                  centerLabel="PORTFOLIO MIX"
                  valueFormatter={(v) =>
                    `$${new Intl.NumberFormat("en-US", {
                      notation: "compact",
                      maximumFractionDigits: 2,
                    }).format(v)}`
                  }
                  totalFormatter={(v) =>
                    `$${new Intl.NumberFormat("en-US", {
                      notation: "compact",
                      maximumFractionDigits: 2,
                    }).format(v)}`
                  }
                  tone="home"
                />
              </div>
            )}
          </div>
        </div>

      </section>
    </div>
  );
}

export default CinematicHeroChapter;
