import React, { useState } from 'react';
import { Scale, CheckCircle2, AlertCircle, ArrowRightLeft, DollarSign } from 'lucide-react';

interface Entry {
  id: string;
  account: string;
  type: 'debit' | 'credit';
  amount: number;
  category: string;
}

export function LedgerIllustration() {
  const [selectedMonth, setSelectedMonth] = useState('Current Quarter');
  const [activeAccountHover, setActiveAccountHover] = useState<string | null>(null);

  const initialEntries: Entry[] = [
    { id: '1', account: 'Cash & Operating Reserve', type: 'debit', amount: 148500, category: 'Current Assets' },
    { id: '2', account: 'Accounts Receivable (Trade)', type: 'debit', amount: 62400, category: 'Current Assets' },
    { id: '3', account: 'Section 179 Depreciable Tech', type: 'debit', amount: 89000, category: 'Fixed Assets' },
    { id: '4', account: 'Accounts Payable & Accrued', type: 'credit', amount: 37900, category: 'Current Liabilities' },
    { id: '5', account: 'Retained Earnings / Equity', type: 'credit', amount: 112000, category: 'Shareholders Equity' },
    { id: '6', account: 'Revenue: Professional Advisory', type: 'credit', amount: 150000, category: 'Gross Receipts' }
  ];

  const totalDebits = initialEntries
    .filter((e) => e.type === 'debit')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalCredits = initialEntries
    .filter((e) => e.type === 'credit')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const isBalanced = totalDebits === totalCredits;

  return (
    <div className="w-full rounded-3xl p-6 sm:p-8 bg-white/70 dark:bg-[#071C25]/80 backdrop-blur-xl border border-[#DCE5E2] dark:border-[rgba(121,241,232,0.2)] shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#DCE5E2] dark:border-[rgba(121,241,232,0.15)]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono uppercase tracking-wider bg-[#E4F0EE] dark:bg-[rgba(44,207,197,0.12)] text-[#315F69] dark:text-[#7DF5E8] mb-1">
            <Scale className="w-3 h-3" />
            <span>GAAP & Tax-Basis Trial Balance</span>
          </div>
          <h3 className="text-xl font-bold text-[#12242B] dark:text-[#F4FBFC]">
            Dynamic Ledger & Dual-Entry Reconciliation
          </h3>
          <p className="text-xs text-[#526168] dark:text-[#A8C0C6] mt-0.5">
            Illustrative financial ledger structure demonstrating error-free M-1/M-3 book-to-tax synchronization.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 font-semibold flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Trial Balance Reconciled</span>
          </span>
        </div>
      </div>

      {/* Ledger Table Matrix */}
      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[#DCE5E2] dark:border-[rgba(121,241,232,0.15)] text-[#526168] dark:text-[#A8C0C6] font-mono">
              <th className="pb-3 font-semibold">Account Description</th>
              <th className="pb-3 font-semibold">Classification</th>
              <th className="pb-3 font-semibold text-right">Debit ($)</th>
              <th className="pb-3 font-semibold text-right">Credit ($)</th>
              <th className="pb-3 font-semibold text-right">Audit Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5 dark:divide-white/5 font-mono">
            {initialEntries.map((entry) => {
              const isHovered = activeAccountHover === entry.id;
              return (
                <tr
                  key={entry.id}
                  onMouseEnter={() => setActiveAccountHover(entry.id)}
                  onMouseLeave={() => setActiveAccountHover(null)}
                  className={`transition-colors ${
                    isHovered ? 'bg-[#315F69]/5 dark:bg-[#49E3D6]/10' : ''
                  }`}
                >
                  <td className="py-3 pr-4 font-sans font-medium text-[#12242B] dark:text-[#F4FBFC]">
                    {entry.account}
                  </td>
                  <td className="py-3 text-[#526168] dark:text-[#A8C0C6]">
                    {entry.category}
                  </td>
                  <td className="py-3 text-right font-semibold text-[#12242B] dark:text-[#F4FBFC]">
                    {entry.type === 'debit' ? `$${entry.amount.toLocaleString()}` : '—'}
                  </td>
                  <td className="py-3 text-right font-semibold text-[#12242B] dark:text-[#F4FBFC]">
                    {entry.type === 'credit' ? `$${entry.amount.toLocaleString()}` : '—'}
                  </td>
                  <td className="py-3 text-right">
                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 dark:text-[#49E3D6]">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Verified</span>
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-[#12242B] dark:border-[#49E3D6] font-bold font-mono text-sm text-[#12242B] dark:text-[#F4FBFC]">
              <td className="pt-4 font-sans uppercase tracking-wider" colSpan={2}>
                Total Trial Balance (Delta: $0.00)
              </td>
              <td className="pt-4 text-right text-[#315F69] dark:text-[#49E3D6]">
                ${totalDebits.toLocaleString()}
              </td>
              <td className="pt-4 text-right text-[#315F69] dark:text-[#49E3D6]">
                ${totalCredits.toLocaleString()}
              </td>
              <td className="pt-4 text-right text-xs text-emerald-600 dark:text-[#49E3D6]">
                Balanced
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="mt-4 pt-3 border-t border-dashed border-[#DCE5E2] dark:border-[rgba(121,241,232,0.15)] flex flex-wrap items-center justify-between text-[11px] text-[#526168] dark:text-[#A8C0C6]">
        <span>Illustrative Financial Projection — Not Actual Company Data</span>
        <span className="font-mono">Standards: US GAAP / Tax Basis / IRC Title 26</span>
      </div>
    </div>
  );
}
