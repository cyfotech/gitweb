import React from 'react';
import {
  BadgeCheck,
  CheckCircle2,
  FileCheck2,
  ShieldCheck,
} from 'lucide-react';
import './AuditReportCard.css';

const metrics = [
  {
    value: '99.8%',
    label: 'Diagnostic First-Pass Accuracy',
    note: 'Audited across 12,000+ business returns',
  },
  {
    value: '98.6%',
    label: 'Turnaround Compliance',
    note: 'Delivered within agreed 48h SLA window',
  },
  {
    value: '< 0.2%',
    label: 'IRS e-File Rejection Rate',
    note: 'Strict schema pre-validation prior to filing',
  },
  {
    value: '72%',
    label: 'CPA Review Hours Saved',
    note: 'Average partner review time eliminated',
  },
];

const checklist = [
  'Cross-reference of prior year Form 1040/1120 depreciation schedules',
  'Reconciliation of M-1/M-3 book-to-tax timing differences',
  'Pass-through entity K-1 basis limitation analysis (Form 6198 / 7203)',
  'State nexus apportionment & multi-jurisdiction franchise review',
  'Section 199A Qualified Business Income deduction calculation',
];

export function AuditReportCard() {
  return (
    <article
      className="audit-report-card"
      aria-labelledby="audit-report-title"
    >
      <header className="audit-report-card__header">
        <div className="audit-report-card__title-group">
          <div className="audit-report-card__eyebrow">
            <BadgeCheck
              className="audit-report-card__icon audit-report-card__icon--small"
              aria-hidden="true"
            />
            <span>Quality Control &amp; Verification</span>
          </div>

          <h3 id="audit-report-title">
            Quality Assurance &amp; Diagnostic Review Standard
          </h3>

          <p>
            Every workpaper bundle passes our rigorous diagnostic checklist
            prior to partner review.
          </p>
        </div>

        <span className="audit-report-card__protocol">
          <ShieldCheck size={13} aria-hidden="true" />
          <span>
            Zero-Defect
            <br />
            Protocol
          </span>
        </span>
      </header>

      <div
        className="audit-report-card__metrics"
        aria-label="Quality assurance metrics"
      >
        {metrics.map((metric, index) => (
          <section
            className="audit-metric"
            style={{ '--audit-index': index } as React.CSSProperties}
            key={metric.label}
          >
            <strong className="audit-metric__value">{metric.value}</strong>
            <span className="audit-metric__label">{metric.label}</span>
            <span className="audit-metric__note">{metric.note}</span>
          </section>
        ))}
      </div>

      <section
        className="audit-report-card__checklist"
        aria-labelledby="audit-checklist-title"
      >
        <h4 id="audit-checklist-title">
          <FileCheck2
            className="audit-report-card__icon audit-report-card__icon--small"
            aria-hidden="true"
          />
          <span>
            Mandatory Diagnostic Audit Checklist (Included on Every File)
          </span>
        </h4>

        <ul>
          {checklist.map((item) => (
            <li key={item}>
              <CheckCircle2
                className="audit-report-card__icon--check"
                aria-hidden="true"
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}

export default AuditReportCard;