import React, { useState } from 'react';
import { 
  BookOpen, 
  Calendar, 
  CheckSquare, 
  FileText, 
  ArrowUpRight, 
  AlertCircle,
  HelpCircle,
  Download
} from 'lucide-react';
import { IRS_TAX_BRACKETS_2025, STANDARD_DEDUCTIONS_2025, FilingStatus } from '../data/taxCalculator';

interface TaxResourcesSectionProps {
  onOpenConsultation: () => void;
}

const DEADLINES_2025 = [
  {
    date: 'January 15, 2025',
    title: 'Q4 2024 Estimated Tax Payment',
    description: 'Deadline for individuals and businesses paying fourth-quarter estimated taxes (Form 1040-ES).'
  },
  {
    date: 'January 31, 2025',
    title: 'W-2 & 1099-NEC Distribution',
    description: 'Employers must furnish Form W-2 to employees and Form 1099-NEC to independent contractors and the IRS.'
  },
  {
    date: 'March 15, 2025',
    title: 'S-Corporation & Partnership Filing (Form 1120-S / 1065)',
    description: 'Crucial deadline for calendar-year pass-through entities. Extension request (Form 7004) grants 6 additional months.'
  },
  {
    date: 'April 15, 2025',
    title: 'Individual & C-Corporation Tax Day (Form 1040 / 1120)',
    description: 'Federal income tax filing & payment deadline. Last day to contribute to traditional and Roth IRAs for 2024.'
  },
  {
    date: 'June 16, 2025',
    title: 'Q2 2025 Estimated Tax Payment',
    description: 'Second-quarter estimated payment due for self-employed individuals and pass-through owners.'
  },
  {
    date: 'September 15, 2025',
    title: 'Extended S-Corp & Partnership Deadline',
    description: 'Final deadline for calendar-year S-Corporations and Partnerships that filed Form 7004.'
  },
  {
    date: 'October 15, 2025',
    title: 'Extended Individual Tax Deadline',
    description: 'Final deadline for individual taxpayers who filed Form 4868 automatic 6-month extension.'
  }
];

const PREPARATION_CHECKLIST_ITEMS = [
  { id: 'c1', label: 'W-2 Wage Statements from all employers' },
  { id: 'c2', label: '1099-NEC & 1099-MISC for freelance / independent contractor income' },
  { id: 'c3', label: '1099-INT and 1099-DIV for bank interest and investment dividends' },
  { id: 'c4', label: '1099-B Brokerage Consolidated Statements (crypto, stocks, capital gains)' },
  { id: 'c5', label: 'Schedule K-1 statements from Partnerships, S-Corps, and Estates' },
  { id: 'c6', label: 'Form 1098 Mortgage Interest Statement and Real Estate property tax receipts' },
  { id: 'c7', label: 'Year-end Profit & Loss statement and Balance sheet (for business owners)' },
  { id: 'c8', label: 'Vehicle mileage logs and equipment asset purchase receipts (Section 179)' },
  { id: 'c9', label: 'Form 1095-A Health Insurance Marketplace Statement (if applicable)' },
  { id: 'c10', label: 'Prior Year Federal & State Tax Returns (Forms 1040 or 1120)' }
];

export function TaxResourcesSection({ onOpenConsultation }: TaxResourcesSectionProps) {
  const [resourceTab, setResourceTab] = useState<'brackets' | 'deadlines' | 'checklist'>('deadlines');
  const [selectedStatus, setSelectedStatus] = useState<FilingStatus>('marriedJoint');
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({
    c1: true,
    c3: true
  });

  const toggleCheck = (id: string) => {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const completedCount = Object.values(checkedItems).filter(Boolean).length;

  return (
    <section id="resources" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 relative bg-white dark:bg-[#071C24] transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-[#E4F0EE] dark:bg-[rgba(44,207,197,0.12)] text-[#315F69] dark:text-[#79F1E8] border border-[#DCE5E2] dark:border-[rgba(121,241,232,0.25)] mb-3">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Compliance Knowledge Base</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#17252B] dark:text-[#F3FBFC]">
              Tax Resources & Filing Schedules
            </h2>
            <p className="mt-3 text-base text-[#526168] dark:text-[#A8C0C6]">
              Verified statutory brackets, IRS compliance deadlines, and interactive document readiness checklists to streamline your filing cycle.
            </p>
          </div>

          {/* Tab Selector */}
          <div className="flex items-center p-1 rounded-2xl bg-black/5 dark:bg-white/5 border border-[#DCE5E2] dark:border-[rgba(121,241,232,0.18)] self-start md:self-auto">
            <button
              onClick={() => setResourceTab('deadlines')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                resourceTab === 'deadlines'
                  ? 'bg-[#315F69] text-white dark:bg-[#2CCFC5] dark:text-[#031117] shadow-sm'
                  : 'text-[#526168] dark:text-[#A8C0C6] hover:text-[#17252B] dark:hover:text-[#F3FBFC]'
              }`}
            >
              Filing Deadlines
            </button>
            <button
              onClick={() => setResourceTab('brackets')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                resourceTab === 'brackets'
                  ? 'bg-[#315F69] text-white dark:bg-[#2CCFC5] dark:text-[#031117] shadow-sm'
                  : 'text-[#526168] dark:text-[#A8C0C6] hover:text-[#17252B] dark:hover:text-[#F3FBFC]'
              }`}
            >
              IRS Brackets 2025
            </button>
            <button
              onClick={() => setResourceTab('checklist')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                resourceTab === 'checklist'
                  ? 'bg-[#315F69] text-white dark:bg-[#2CCFC5] dark:text-[#031117] shadow-sm'
                  : 'text-[#526168] dark:text-[#A8C0C6] hover:text-[#17252B] dark:hover:text-[#F3FBFC]'
              }`}
            >
              Filing Checklist
            </button>
          </div>
        </div>

        {/* Tab 1: Key Deadlines */}
        {resourceTab === 'deadlines' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {DEADLINES_2025.map((item, idx) => (
              <div
                key={idx}
                className="glass-panel rounded-2xl p-6 border border-[#DCE5E2] dark:border-[rgba(121,241,232,0.18)] shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-[#315F69] dark:text-[#79F1E8] mb-2">
                    <Calendar className="w-4 h-4 shrink-0" />
                    <span>{item.date}</span>
                  </div>
                  <h3 className="text-base font-bold text-[#17252B] dark:text-[#F3FBFC] mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#526168] dark:text-[#A8C0C6] leading-relaxed">
                    {item.description}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#DCE5E2] dark:border-[rgba(121,241,232,0.1)] flex items-center justify-between text-[11px]">
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">IRS Statutory Date</span>
                  <button
                    onClick={onOpenConsultation}
                    className="text-[#315F69] dark:text-[#79F1E8] font-bold hover:underline"
                  >
                    Get Filing Help →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: 2025 Tax Brackets Table */}
        {resourceTab === 'brackets' && (
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-[#DCE5E2] dark:border-[rgba(121,241,232,0.22)] shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-xl font-bold text-[#17252B] dark:text-[#F3FBFC]">
                  Official 2025 IRS Income Tax Brackets (Rev. Proc. 2024-40)
                </h3>
                <p className="text-xs text-[#526168] dark:text-[#A8C0C6]">
                  Standard Deduction for {selectedStatus}: <strong className="text-[#17252B] dark:text-[#F3FBFC]">${STANDARD_DEDUCTIONS_2025[selectedStatus].toLocaleString()}</strong>
                </p>
              </div>

              {/* Status Switcher */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/5 dark:bg-white/5 border border-[#DCE5E2] dark:border-[rgba(121,241,232,0.15)] text-xs font-semibold">
                <button
                  onClick={() => setSelectedStatus('single')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    selectedStatus === 'single'
                      ? 'bg-[#315F69] text-white dark:bg-[#2CCFC5] dark:text-[#031117]'
                      : 'text-[#526168] dark:text-[#A8C0C6]'
                  }`}
                >
                  Single
                </button>
                <button
                  onClick={() => setSelectedStatus('marriedJoint')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    selectedStatus === 'marriedJoint'
                      ? 'bg-[#315F69] text-white dark:bg-[#2CCFC5] dark:text-[#031117]'
                      : 'text-[#526168] dark:text-[#A8C0C6]'
                  }`}
                >
                  Married Filing Jointly
                </button>
                <button
                  onClick={() => setSelectedStatus('headOfHousehold')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    selectedStatus === 'headOfHousehold'
                      ? 'bg-[#315F69] text-white dark:bg-[#2CCFC5] dark:text-[#031117]'
                      : 'text-[#526168] dark:text-[#A8C0C6]'
                  }`}
                >
                  Head of Household
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-[#DCE5E2] dark:border-[rgba(121,241,232,0.18)] text-[#526168] dark:text-[#A8C0C6]">
                    <th className="py-3 px-4 font-bold">Marginal Rate</th>
                    <th className="py-3 px-4 font-bold">Taxable Income Range (Single or Joint)</th>
                    <th className="py-3 px-4 font-bold">Calculated Baseline Tax</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DCE5E2]/60 dark:divide-[rgba(121,241,232,0.1)] text-[#17252B] dark:text-[#F3FBFC]">
                  {IRS_TAX_BRACKETS_2025[selectedStatus].map((bracket, i) => (
                    <tr key={i} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-[#315F69] dark:text-[#79F1E8]">
                        {(bracket.rate * 100).toFixed(0)}%
                      </td>
                      <td className="py-3.5 px-4">
                        ${bracket.min.toLocaleString()} {bracket.max ? `to $${bracket.max.toLocaleString()}` : 'and above'}
                      </td>
                      <td className="py-3.5 px-4 text-[#526168] dark:text-[#A8C0C6]">
                        {bracket.min === 0 ? '10% of taxable income' : `Base tax + ${(bracket.rate * 100).toFixed(0)}% of excess over $${bracket.min.toLocaleString()}`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Interactive Checklist */}
        {resourceTab === 'checklist' && (
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-[#DCE5E2] dark:border-[rgba(121,241,232,0.22)] shadow-xl max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-[#17252B] dark:text-[#F3FBFC]">
                  Client Tax Readiness Self-Audit
                </h3>
                <p className="text-xs text-[#526168] dark:text-[#A8C0C6]">
                  Check off the documents you have collected. When ready, upload to our secure portal.
                </p>
              </div>

              <div className="text-right">
                <span className="text-xs font-bold text-[#315F69] dark:text-[#79F1E8]">
                  {completedCount} of {PREPARATION_CHECKLIST_ITEMS.length} Ready
                </span>
                <div className="w-24 h-2 rounded-full bg-gray-200 dark:bg-gray-800 mt-1 overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all"
                    style={{ width: `${(completedCount / PREPARATION_CHECKLIST_ITEMS.length) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3 mb-8">
              {PREPARATION_CHECKLIST_ITEMS.map((item) => (
                <label
                  key={item.id}
                  className="flex items-start gap-3 p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-[#DCE5E2] dark:border-[rgba(121,241,232,0.12)] cursor-pointer hover:bg-black/10 dark:hover:bg-white/10 transition-all text-xs sm:text-sm"
                >
                  <input
                    type="checkbox"
                    checked={!!checkedItems[item.id]}
                    onChange={() => toggleCheck(item.id)}
                    className="mt-0.5 rounded accent-[#315F69] dark:accent-[#2CCFC5] w-4 h-4 cursor-pointer"
                  />
                  <span className={checkedItems[item.id] ? 'line-through text-gray-400 dark:text-gray-500' : 'text-[#17252B] dark:text-[#F3FBFC]'}>
                    {item.label}
                  </span>
                </label>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#DCE5E2] dark:border-[rgba(121,241,232,0.18)]">
              <span className="text-xs text-[#526168] dark:text-[#A8C0C6]">
                Need help collecting missing K-1s or prior-year transcripts?
              </span>
              <button
                onClick={onOpenConsultation}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#315F69] text-white dark:bg-[#2CCFC5] dark:text-[#031117] flex items-center gap-1.5 shadow-sm"
              >
                <span>Request Preparation Intake</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
