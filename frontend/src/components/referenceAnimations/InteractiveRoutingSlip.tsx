import React, { useState } from 'react';
import {
  Send,
  CheckCircle2,
  Building2,
  Briefcase,
  Users,
  Clock,
  ShieldCheck,
  Sparkles,
  LoaderCircle,
  FileCheck2
} from 'lucide-react';
import { inquiriesApi } from '../../api/inquiries';
import confetti from 'canvas-confetti';
import './ReferenceAnimations.css';

const ROLES = [
  { id: 'cpa_firm', code: 'CPA', label: 'CPA / Accounting Practice', desk: 'CPA Outsourcing Desk', icon: Building2 },
  { id: 'business', code: 'BIZ', label: 'Company / Business Owner', desk: 'Business Accounting Desk', icon: Briefcase },
  { id: 'individual', code: 'IND', label: 'Individual / Family Taxpayer', desk: 'Individual Tax Desk', icon: Users },
];

const AVAILABLE_SERVICES = [
  'USA Tax Preparation',
  'Bookkeeping & Accounting',
  'Payroll Management',
  'Tax Planning & Advisory',
  'Accounts Payable & Receivable',
  'Foreign Compliance (FBAR)',
  'US Tax Filing & Extensions',
];

const SCOPES = ['Ongoing Recurring Support', 'One-Time Project / Catch-Up', 'Peak Season Workload'];
const TIMELINES = ['Immediate / ASAP', 'Within 30 Days', 'Next Filing Season', 'Exploring Options'];

export function InteractiveRoutingSlip() {
  const [role, setRole] = useState<string>('cpa_firm');
  const [selectedServices, setSelectedServices] = useState<string[]>(['USA Tax Preparation']);
  const [scope, setScope] = useState<string>('Ongoing Recurring Support');
  const [timeline, setTimeline] = useState<string>('Immediate / ASAP');
  const [name, setName] = useState('');
  const [organization, setOrganization] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const activeRoleObj = ROLES.find((r) => r.id === role) || ROLES[0];

  const toggleService = (srv: string) => {
    setSelectedServices((prev) =>
      prev.includes(srv) ? prev.filter((s) => s !== srv) : [...prev, srv]
    );
  };

  // Calculate live completion progress of routing slip
  const filledFields = [
    role,
    selectedServices.length > 0 ? 'yes' : '',
    scope,
    timeline,
    name.trim(),
    email.trim() && /.+@.+\..+/.test(email) ? 'yes' : '',
  ].filter(Boolean).length;
  const progressPct = Math.round((filledFields / 6) * 100);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setSubmitError('Please provide your name and a valid email address.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    const consolidatedMessage = `
Selected Services: ${selectedServices.join(', ')}
Scope: ${scope}
Timeline: ${timeline}
Client Notes: ${message.trim() || 'No additional notes provided.'}
    `.trim();

    try {
      await inquiriesApi.create({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        organization: organization.trim() || undefined,
        inquiry_type: role,
        message: consolidatedMessage,
      });

      setIsSubmitted(true);
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#10B981', '#34D399', '#49E3D6', '#059669'],
      });
    } catch (err: any) {
      setSubmitError(err?.message || 'Failed to transmit routing enquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="ref-anim-card" aria-label="Interactive Live Routing Slip & Intake Engine">
      <div className="ref-anim-header">
        <div className="flex items-center gap-2">
          <FileCheck2 className="w-4 h-4 text-emerald-500 dark:text-[#49E3D6]" />
          <span className="text-xs font-bold text-[#12242B] dark:text-[#F4FBFC] uppercase tracking-wider font-mono">
            Direct Routing Engine &bull; Automated Slip Generator
          </span>
        </div>
        <div className="ref-anim-badge">
          <span>{isSubmitted ? '● DISPATCHED' : `● ${progressPct}% CONFIGURED`}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form Configuration (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1.5">
              1. Select Your Practice Classification:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {ROLES.map((r) => {
                const Icon = r.icon;
                const isSelected = role === r.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRole(r.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-500/10 shadow-sm'
                        : 'border-[#DCE5E2] dark:border-gray-800 bg-black/[0.02] dark:bg-white/[0.02]'
                    }`}
                  >
                    <Icon className={`w-4 h-4 mb-1 ${isSelected ? 'text-emerald-500' : 'text-gray-400'}`} />
                    <span className="text-xs font-bold text-[#12242B] dark:text-[#F4FBFC] leading-tight">
                      {r.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1.5">
              2. Select Required Service Capabilities:
            </label>
            <div className="flex flex-wrap gap-1.5">
              {AVAILABLE_SERVICES.map((srv) => {
                const isSelected = selectedServices.includes(srv);
                return (
                  <button
                    key={srv}
                    type="button"
                    onClick={() => toggleService(srv)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-[#12242B] dark:bg-[#49E3D6] text-white dark:text-[#03141A] font-bold'
                        : 'bg-black/5 dark:bg-white/5 text-[#476067] dark:text-[#A8C0C6] hover:bg-black/10'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '}
                    {srv}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                Engagement Scope:
              </label>
              <select
                value={scope}
                onChange={(e) => setScope(e.target.value)}
                className="w-full text-xs p-2 rounded-xl border border-[#DCE5E2] dark:border-gray-800 bg-white dark:bg-[#071C25] text-[#12242B] dark:text-[#F4FBFC]"
              >
                {SCOPES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                Required Timeline:
              </label>
              <select
                value={timeline}
                onChange={(e) => setTimeline(e.target.value)}
                className="w-full text-xs p-2 rounded-xl border border-[#DCE5E2] dark:border-gray-800 bg-white dark:bg-[#071C25] text-[#12242B] dark:text-[#F4FBFC]"
              >
                {TIMELINES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-2 pt-2 border-t border-[#E2EBE8] dark:border-gray-800">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Full Name *"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="text-xs p-2 rounded-xl border border-[#DCE5E2] dark:border-gray-800 bg-white dark:bg-[#071C25] text-[#12242B] dark:text-[#F4FBFC]"
              />
              <input
                type="email"
                placeholder="Business Email *"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="text-xs p-2 rounded-xl border border-[#DCE5E2] dark:border-gray-800 bg-white dark:bg-[#071C25] text-[#12242B] dark:text-[#F4FBFC]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Firm / Organization (Optional)"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                className="text-xs p-2 rounded-xl border border-[#DCE5E2] dark:border-gray-800 bg-white dark:bg-[#071C25] text-[#12242B] dark:text-[#F4FBFC]"
              />
              <input
                type="tel"
                placeholder="Phone Number (Optional)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="text-xs p-2 rounded-xl border border-[#DCE5E2] dark:border-gray-800 bg-white dark:bg-[#071C25] text-[#12242B] dark:text-[#F4FBFC]"
              />
            </div>

            <textarea
              placeholder="Brief context or filing details..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={2}
              className="w-full text-xs p-2 rounded-xl border border-[#DCE5E2] dark:border-gray-800 bg-white dark:bg-[#071C25] text-[#12242B] dark:text-[#F4FBFC]"
            />

            {submitError && (
              <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs">
                {submitError}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting || isSubmitted}
              className="w-full py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-[#49E3D6] dark:hover:bg-[#7DF5E8] dark:text-[#03141A] font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <LoaderCircle className="w-4 h-4 animate-spin" />
                  <span>Transmitting to {activeRoleObj.desk}...</span>
                </>
              ) : isSubmitted ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Routing Slip Dispatched Successfully!</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Dispatch Digital Routing Slip</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Live Digital Routing Slip Ticket (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-center">
          <div className="ref-slip-ticket">
            <div className="ref-slip-header">
              <div>
                <span className="text-[9px] uppercase font-bold text-gray-400 font-mono">DIGITAL ROUTING SLIP</span>
                <div className="text-xs font-bold font-mono text-emerald-600 dark:text-[#49E3D6]">
                  REF-{Math.abs(role.length * 3421).toString().slice(0, 4)}
                </div>
              </div>
              <span className={`text-[9.5px] px-2.5 py-0.5 rounded-full font-mono font-bold ${
                isSubmitted ? 'bg-emerald-500 text-white' : 'bg-black/5 dark:bg-white/10 text-[#12242B] dark:text-[#F4FBFC]'
              }`}>
                {isSubmitted ? 'DISPATCHED' : progressPct === 100 ? 'READY' : `${progressPct}% DRAFTING`}
              </span>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="ref-slip-row">
                <span className="text-gray-400">Assigned Desk:</span>
                <span className="font-bold text-[#12242B] dark:text-[#F4FBFC]">{activeRoleObj.desk}</span>
              </div>
              <div className="ref-slip-row">
                <span className="text-gray-400">Classification:</span>
                <span className="font-mono text-emerald-600 dark:text-[#49E3D6] font-bold">{activeRoleObj.code}</span>
              </div>
              <div className="ref-slip-row">
                <span className="text-gray-400">Services Picked:</span>
                <span className="font-bold">{selectedServices.length} Selected</span>
              </div>
              <div className="ref-slip-row">
                <span className="text-gray-400">Scope Cadence:</span>
                <span className="truncate max-w-[140px] text-right font-medium">{scope}</span>
              </div>
              <div className="ref-slip-row">
                <span className="text-gray-400">Timeline SLA:</span>
                <span className="font-mono font-bold text-emerald-600 dark:text-[#49E3D6]">{timeline}</span>
              </div>
              <div className="ref-slip-row">
                <span className="text-gray-400">Contact:</span>
                <span className="truncate max-w-[140px] text-right font-medium">
                  {name ? `${name}` : 'Awaiting details...'}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-dashed border-[#DCE5E2] dark:border-gray-800 text-center">
              <div className="text-[8.5px] uppercase font-bold tracking-widest text-gray-400 font-mono">
                ENCRYPTED &bull; SOC-2 &bull; CIRCULAR 230
              </div>
              <div className="text-[10px] text-gray-500 mt-0.5">
                Target Response Time: Within 24-48 Hours
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}