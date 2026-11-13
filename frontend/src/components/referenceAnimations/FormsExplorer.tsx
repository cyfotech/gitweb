import React, { useState } from 'react';
import { Search, FileSpreadsheet, ArrowRight, CheckCircle2 } from 'lucide-react';
import './ReferenceAnimations.css';

interface FormItem {
  cat: 'Individual' | 'Business' | 'Payroll' | 'International';
  code: string;
  name: string;
  desc: string;
}

const FORMS_CATALOG: FormItem[] = [
  { cat: 'Individual', code: '1040', name: 'U.S. Individual Income Tax Return', desc: 'Personal income tax filing for employees, investors & families.' },
  { cat: 'Individual', code: '1040-SR', name: 'U.S. Tax Return for Seniors', desc: 'Filing for taxpayers age 65+ with specialized standard deduction tiers.' },
  { cat: 'Individual', code: '1040-NR', name: 'U.S. Nonresident Alien Income Tax', desc: 'Filing for foreign nationals with US-sourced trade or business income.' },
  { cat: 'Individual', code: 'Sch C', name: 'Profit or Loss From Business', desc: 'Sole proprietorship & single-member LLC operational income and expenses.' },
  { cat: 'Individual', code: 'Sch D', name: 'Capital Gains and Losses', desc: '1099-B stock brokerage transactions, crypto & capital property sales.' },
  { cat: 'Individual', code: 'Sch E', name: 'Supplemental Income and Loss', desc: 'Rental real estate, royalties, partnerships, S corporations & estates.' },
  { cat: 'Individual', code: '1040-X', name: 'Amended U.S. Individual Return', desc: 'Correcting omissions, deductions, or misreported prior-year figures.' },

  { cat: 'Business', code: '1065', name: 'U.S. Return of Partnership Income', desc: 'Multi-member LLCs & partnerships with partner Schedule K-1 packages.' },
  { cat: 'Business', code: '1120-S', name: 'U.S. Income Tax Return for S Corp', desc: 'S Corporation returns with Form 7203 shareholder basis tracking.' },
  { cat: 'Business', code: '1120', name: 'U.S. Corporation Income Tax Return', desc: 'C Corporation corporate taxation, Schedule M-1 adjustments & NOLs.' },
  { cat: 'Business', code: '990', name: 'Return of Organization Exempt From Tax', desc: 'Nonprofit public charities & private foundations compliance.' },
  { cat: 'Business', code: '1041', name: 'U.S. Income Tax Return for Estates & Trusts', desc: 'Fiduciary reporting and income distribution Schedule K-1s.' },
  { cat: 'Business', code: '4562', name: 'Depreciation and Amortization', desc: 'Section 179 immediate expensing & MACRS asset bonus depreciation.' },
  { cat: 'Business', code: '8995', name: 'Qualified Business Income Deduction', desc: 'Section 199A 20% pass-through tax deduction calculation.' },

  { cat: 'Payroll', code: '941', name: "Employer's Quarterly Federal Tax Return", desc: 'Withholding income taxes, Social Security, and Medicare reporting.' },
  { cat: 'Payroll', code: '940', name: "Employer's Annual Federal Unemployment", desc: 'FUTA tax calculation with state unemployment credits (SUTA).' },
  { cat: 'Payroll', code: 'W-2', name: 'Wage and Tax Statement', desc: 'Annual employee earnings, federal & state tax withholdings.' },
  { cat: 'Payroll', code: '1099-NEC', name: 'Nonemployee Compensation', desc: 'Reporting payments of $600+ to independent contractors & vendors.' },

  { cat: 'International', code: 'FinCEN 114', name: 'Report of Foreign Bank Accounts (FBAR)', desc: 'Mandatory annual report for foreign aggregate accounts exceeding $10,000.' },
  { cat: 'International', code: '8938', name: 'Statement of Specified Foreign Assets (FATCA)', desc: 'IRS filing for foreign financial assets held by US persons.' },
  { cat: 'International', code: '5471', name: 'Information Return of U.S. Persons (Foreign Corp)', desc: 'Reporting control or ownership in offshore corporate entities.' },
  { cat: 'International', code: '5472', name: 'Information Return of 25% Foreign-Owned U.S. Corp', desc: 'Reporting reportable transactions between US entity and foreign owners.' },
  { cat: 'International', code: '1116', name: 'Foreign Tax Credit', desc: 'Mitigating double taxation for foreign taxes paid on foreign income.' },
];

export function FormsExplorer() {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [search, setSearch] = useState('');

  const filtered = FORMS_CATALOG.filter((f) => {
    const matchesCat = activeCategory === 'All' || f.cat === activeCategory;
    const matchesSearch =
      search.trim() === '' ||
      f.code.toLowerCase().includes(search.toLowerCase()) ||
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.desc.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="ref-anim-card" aria-label="Interactive US Tax Forms Directory">
      <div className="ref-anim-header">
        <div className="flex items-center gap-2">
          <FileSpreadsheet className="w-4 h-4 text-emerald-500 dark:text-[#49E3D6]" />
          <span className="text-xs font-bold text-[#12242B] dark:text-[#F4FBFC] uppercase tracking-wider font-mono">
            IRS Form Matrix &bull; Multi-Jurisdictional Scope
          </span>
        </div>
        <div className="ref-anim-badge">
          <span>{filtered.length} Forms Supported</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between mb-4">
        {/* Category Pills */}
        <div className="flex flex-wrap gap-1">
          {['All', 'Individual', 'Business', 'Payroll', 'International'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                activeCategory === cat
                  ? 'bg-[#12242B] dark:bg-[#49E3D6] text-white dark:text-[#03141A]'
                  : 'bg-black/5 dark:bg-white/5 text-gray-500 hover:text-gray-900 dark:hover:text-white'
              }`}
              type="button"
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search form, e.g. 1040, K-1..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs pl-8 pr-3 py-1.5 rounded-full border border-[#DCE5E2] dark:border-gray-800 bg-white dark:bg-[#071C25] text-[#12242B] dark:text-[#F4FBFC]"
          />
        </div>
      </div>

      {/* Forms Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-96 overflow-y-auto pr-1">
        {filtered.map((item) => (
          <div
            key={item.code}
            className="p-3 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-[#DCE5E2] dark:border-gray-800 hover:border-emerald-500/50 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-start mb-1">
                <span className="font-mono text-sm font-bold text-emerald-600 dark:text-[#49E3D6]">
                  {item.code}
                </span>
                <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/5 text-gray-400">
                  {item.cat}
                </span>
              </div>
              <div className="text-xs font-bold text-[#12242B] dark:text-[#F4FBFC] line-clamp-1">
                {item.name}
              </div>
              <p className="text-[11px] text-[#476067] dark:text-[#A8C0C6] mt-1 line-clamp-2 leading-relaxed">
                {item.desc}
              </p>
            </div>
            <div className="pt-2 mt-2 border-t border-dashed border-[#E2EBE8] dark:border-gray-800 flex items-center gap-1 text-[10px] text-emerald-600 dark:text-[#49E3D6] font-semibold">
              <CheckCircle2 className="w-3 h-3" />
              <span>Full Preparation &amp; Review Available</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}