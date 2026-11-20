import React, { useState } from 'react';
import {
  Calendar,
  Link as LinkIcon,
  Clock,
  Globe,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Plus,
  Trash2,
  Mail,
  Sliders,
  Sparkles,
  ArrowUpDown,
  Lock,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  FileText,
  Eye,
  Check,
} from 'lucide-react';
import {
  ConsultationSettingsData,
  CustomFormField,
  ServiceCalendlyMapping,
} from '../../types/consultationSettings';
import { settingsApi } from '../../api/settings';

interface CalendlyManagerProps {
  settings: ConsultationSettingsData;
  onChange: (updated: ConsultationSettingsData) => void;
  onSave: () => void;
  saving: boolean;
}

export function CalendlyManagerTab({ settings, onChange, onSave, saving }: CalendlyManagerProps) {
  const [testingConnection, setTestingConnection] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [previewEmailType, setPreviewEmailType] = useState<'customer' | 'admin' | 'cancellation' | 'reschedule'>('customer');
  const [activeSection, setActiveSection] = useState<'calendly' | 'content' | 'services' | 'form' | 'notifications'>('calendly');

  // Test Calendly Connection handler
  const handleTestConnection = async () => {
    setTestingConnection(true);
    setTestResult(null);
    try {
      const res: any = await settingsApi.testCalendly(settings.defaultCalendlyUrl, settings.calendlyApiToken);
      setTestResult({
        success: res.success,
        message: res.message || 'Connection verified successfully!',
      });
      onChange({
        ...settings,
        connectionStatus: res.success ? 'verified' : 'error',
        lastTestedAt: new Date().toISOString(),
      });
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err.response?.data?.error || err.message || 'Connection test failed. Check URL or Token.',
      });
      onChange({
        ...settings,
        connectionStatus: 'error',
        lastTestedAt: new Date().toISOString(),
      });
    } finally {
      setTestingConnection(false);
    }
  };

  // Add Custom Form Field
  const handleAddField = () => {
    const newField: CustomFormField = {
      id: `field-${Date.now()}`,
      name: `custom_${Date.now()}`,
      label: 'New Form Field',
      type: 'text',
      placeholder: 'Enter information...',
      required: false,
      enabled: true,
      order: (settings.customFields || []).length + 1,
    };
    onChange({
      ...settings,
      customFields: [...(settings.customFields || []), newField],
    });
  };

  // Delete Form Field
  const handleDeleteField = (id: string) => {
    onChange({
      ...settings,
      customFields: (settings.customFields || []).filter(f => f.id !== id),
    });
  };

  // Update Field Property
  const handleUpdateField = (id: string, updates: Partial<CustomFormField>) => {
    const updated = (settings.customFields || []).map(f => {
      if (f.id !== id) return f;
      return { ...f, ...updates };
    });
    onChange({ ...settings, customFields: updated });
  };

  // Move Field Up/Down
  const handleMoveField = (index: number, direction: 'up' | 'down') => {
    const fields = [...(settings.customFields || [])];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= fields.length) return;
    const temp = fields[index];
    fields[index] = fields[targetIndex];
    fields[targetIndex] = temp;
    // update order numbers
    fields.forEach((f, i) => { f.order = i + 1; });
    onChange({ ...settings, customFields: fields });
  };

  // Add Service Calendly Mapping
  const handleAddServiceMapping = () => {
    const newMapping: ServiceCalendlyMapping = {
      serviceSlug: 'custom-tax-service',
      serviceName: 'Custom Tax Consultation',
      calendlyUrl: settings.defaultCalendlyUrl || 'https://calendly.com/smarttaxexperts/strategic-consultation',
      assignedProfessional: 'Senior US CPA',
      durationMinutes: 45,
      consultationType: 'online',
    };
    onChange({
      ...settings,
      serviceMappings: [...(settings.serviceMappings || []), newMapping],
    });
  };

  // Delete Service Mapping
  const handleDeleteServiceMapping = (index: number) => {
    const updated = (settings.serviceMappings || []).filter((_, i) => i !== index);
    onChange({ ...settings, serviceMappings: updated });
  };

  // Update Service Mapping
  const handleUpdateServiceMapping = (index: number, updates: Partial<ServiceCalendlyMapping>) => {
    const updated = (settings.serviceMappings || []).map((m, i) => {
      if (i !== index) return m;
      return { ...m, ...updates };
    });
    onChange({ ...settings, serviceMappings: updated });
  };

  return (
    <div className="space-y-6 animate-fade-in text-slate-900 dark:text-white">
      
      {/* Sub-navigation tabs inside Consultation & Calendly Settings */}
      <div className="flex border-b border-teal-500/20 gap-2 overflow-x-auto pb-1 text-xs font-bold">
        {[
          { id: 'calendly', label: 'Calendly Configuration', icon: <Calendar size={14} /> },
          { id: 'content', label: 'Public Content & Copy', icon: <FileText size={14} /> },
          { id: 'services', label: 'Service-Specific Event Links', icon: <LinkIcon size={14} /> },
          { id: 'form', label: 'Form & Custom Fields', icon: <Sliders size={14} /> },
          { id: 'notifications', label: 'Email Notifications & Previews', icon: <Mail size={14} /> },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveSection(tab.id as any)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeSection === tab.id
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* SECTION 1: CALENDLY CONFIGURATION */}
      {activeSection === 'calendly' && (
        <div className="bg-white/80 dark:bg-[#071A22]/80 border border-teal-500/20 rounded-3xl p-6 sm:p-7 backdrop-blur-xl shadow-xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-teal-500/15">
            <div>
              <h2 className="font-bold text-base flex items-center gap-2">
                <Calendar className="w-5 h-5 text-teal-500" />
                <span>Calendly Global Integration & Event Engine</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Configure official scheduling links, appointment duration, timezone, and popup behavior across the live site.
              </p>
            </div>

            {/* Connection status chip */}
            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold px-3 py-1 rounded-full border flex items-center gap-1.5 ${
                settings.connectionStatus === 'verified'
                  ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                  : settings.connectionStatus === 'error'
                  ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30'
                  : 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30'
              }`}>
                <span className={`w-2 h-2 rounded-full ${
                  settings.connectionStatus === 'verified' ? 'bg-emerald-500' : settings.connectionStatus === 'error' ? 'bg-rose-500' : 'bg-amber-500'
                }`} />
                <span>{settings.connectionStatus === 'verified' ? 'Calendly Connected' : settings.connectionStatus === 'error' ? 'Connection Error' : 'Untested / Ready'}</span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Enable/Disable Toggle */}
            <div className="md:col-span-2 p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-teal-500/15 flex items-center justify-between">
              <div>
                <span className="font-bold block text-slate-900 dark:text-white">Enable Calendly Integration</span>
                <span className="text-[11px] text-slate-500">When enabled, customers can schedule meetings via live Calendly widgets</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.calendlyEnabled}
                  onChange={(e) => onChange({ ...settings, calendlyEnabled: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600" />
              </label>
            </div>

            {/* Default Scheduling URL */}
            <div className="md:col-span-2 space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px]">
                Default Calendly Scheduling URL *
              </label>
              <input
                type="url"
                required
                value={settings.defaultCalendlyUrl}
                onChange={(e) => onChange({ ...settings, defaultCalendlyUrl: e.target.value })}
                placeholder="https://calendly.com/your-firm/discovery"
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/5 dark:bg-[#031117] border border-teal-500/25 text-slate-900 dark:text-white font-mono text-xs focus:outline-none focus:border-teal-400"
              />
            </div>

            {/* Event Type & Appointment Duration */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px]">
                Default Event Type / Label
              </label>
              <input
                type="text"
                value={settings.calendlyEventType}
                onChange={(e) => onChange({ ...settings, calendlyEventType: e.target.value })}
                placeholder="30-Minute Discovery Session"
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/5 dark:bg-[#031117] border border-teal-500/25 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-teal-400"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px]">
                Default Duration (Minutes)
              </label>
              <select
                value={settings.defaultDurationMinutes}
                onChange={(e) => onChange({ ...settings, defaultDurationMinutes: parseInt(e.target.value, 10) })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/5 dark:bg-[#031117] border border-teal-500/25 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-teal-400"
              >
                <option value={15}>15 Minutes (Discovery Call)</option>
                <option value={30}>30 Minutes (Standard Consultation)</option>
                <option value={45}>45 Minutes (CPA Scope Review)</option>
                <option value={60}>60 Minutes (Comprehensive Tax Advisory)</option>
              </select>
            </div>

            {/* Timezone & Display Mode */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px]">
                Default Timezone
              </label>
              <select
                value={settings.defaultTimezone}
                onChange={(e) => onChange({ ...settings, defaultTimezone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/5 dark:bg-[#031117] border border-teal-500/25 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-teal-400"
              >
                <option value="America/New_York (EST)">America/New York (EST/EDT)</option>
                <option value="America/Chicago (CST)">America/Chicago (CST/CDT)</option>
                <option value="America/Denver (MST)">America/Denver (MST/MDT)</option>
                <option value="America/Los_Angeles (PST)">America/Los Angeles (PST/PDT)</option>
                <option value="UTC">UTC Universal</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px]">
                Booking Interface Mode
              </label>
              <select
                value={settings.bookingDisplayMode}
                onChange={(e) => onChange({ ...settings, bookingDisplayMode: e.target.value as any })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/5 dark:bg-[#031117] border border-teal-500/25 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-teal-400"
              >
                <option value="popup">Popup Modal / Floating Drawer (Recommended)</option>
                <option value="inline">Inline Embedded Calendar (Inside Page)</option>
                <option value="redirect">Direct Window Tab Redirect</option>
              </select>
            </div>

            {/* Secure Calendly V2 API Token (Optional) */}
            <div className="md:col-span-2 p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-teal-500/15 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[11px] text-teal-600 dark:text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Lock size={12} />
                  <span>Calendly API V2 Personal Access Token (Optional Secure Backend Storage)</span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Protected & never exposed in frontend bundles</span>
              </div>
              <input
                type="password"
                value={settings.calendlyApiToken || ''}
                onChange={(e) => onChange({ ...settings, calendlyApiToken: e.target.value })}
                placeholder="e.g. eyJhbGciOi... (calendly_token)"
                className="w-full px-3.5 py-2 rounded-xl bg-black/5 dark:bg-[#031117] border border-teal-500/20 text-slate-900 dark:text-white font-mono text-xs focus:outline-none"
              />
            </div>
          </div>

          {/* Test Connection Button & Result */}
          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-teal-500/15">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={testingConnection || !settings.defaultCalendlyUrl}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-500 text-white shadow-md transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
              >
                <RefreshCw size={13} className={testingConnection ? 'animate-spin' : ''} />
                <span>{testingConnection ? 'Testing Connection...' : 'Test Connection'}</span>
              </button>
              {settings.defaultCalendlyUrl && (
                <a
                  href={settings.defaultCalendlyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 rounded-xl text-xs font-medium bg-black/5 dark:bg-white/5 border border-teal-500/20 text-slate-700 dark:text-slate-300 hover:text-teal-400 flex items-center gap-1.5"
                >
                  <ExternalLink size={12} />
                  <span>Open URL in New Tab</span>
                </a>
              )}
            </div>

            {testResult && (
              <div className={`text-xs px-3 py-1.5 rounded-xl border flex items-center gap-2 ${
                testResult.success ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400' : 'bg-rose-500/15 border-rose-500/30 text-rose-400'
              }`}>
                {testResult.success ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
                <span>{testResult.message}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SECTION 2: PUBLIC CONTENT & COPY */}
      {activeSection === 'content' && (
        <div className="bg-white/80 dark:bg-[#071A22]/80 border border-teal-500/20 rounded-3xl p-6 sm:p-7 backdrop-blur-xl shadow-xl space-y-4">
          <div className="pb-3 border-b border-teal-500/15">
            <h2 className="font-bold text-base flex items-center gap-2">
              <FileText className="w-5 h-5 text-teal-500" />
              <span>Public-Facing Consultation Copy & Instructions</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Edit buttons, titles, supporting text, and customer instructions without changing frontend source code.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px]">
                Book Consultation Button Text
              </label>
              <input
                type="text"
                value={settings.bookButtonText}
                onChange={(e) => onChange({ ...settings, bookButtonText: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/5 dark:bg-[#031117] border border-teal-500/25 text-slate-900 dark:text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px]">
                Header Badge / Eyebrow Text
              </label>
              <input
                type="text"
                value={settings.headerEyebrow}
                onChange={(e) => onChange({ ...settings, headerEyebrow: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/5 dark:bg-[#031117] border border-teal-500/25 text-slate-900 dark:text-white"
              />
            </div>

            <div className="md:col-span-2 space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px]">
                Consultation Page Main Heading
              </label>
              <input
                type="text"
                value={settings.headerTitle}
                onChange={(e) => onChange({ ...settings, headerTitle: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/5 dark:bg-[#031117] border border-teal-500/25 text-slate-900 dark:text-white font-bold"
              />
            </div>

            <div className="md:col-span-2 space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px]">
                Consultation Description & Scope Summary
              </label>
              <textarea
                rows={2}
                value={settings.headerDescription}
                onChange={(e) => onChange({ ...settings, headerDescription: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-black/5 dark:bg-[#031117] border border-teal-500/25 text-slate-900 dark:text-white leading-relaxed"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px]">
                Calendly Popup Heading
              </label>
              <input
                type="text"
                value={settings.popupHeading}
                onChange={(e) => onChange({ ...settings, popupHeading: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/5 dark:bg-[#031117] border border-teal-500/25 text-slate-900 dark:text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px]">
                Popup Trigger Delay (Seconds)
              </label>
              <input
                type="number"
                min={3}
                max={120}
                value={settings.popupDelaySeconds}
                onChange={(e) => onChange({ ...settings, popupDelaySeconds: parseInt(e.target.value, 10) || 15 })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/5 dark:bg-[#031117] border border-teal-500/25 text-slate-900 dark:text-white"
              />
            </div>

            <div className="md:col-span-2 space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px]">
                Popup Subheading Text
              </label>
              <input
                type="text"
                value={settings.popupSubheading}
                onChange={(e) => onChange({ ...settings, popupSubheading: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/5 dark:bg-[#031117] border border-teal-500/25 text-slate-900 dark:text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px]">
                NDA & Privacy Disclaimer Line
              </label>
              <input
                type="text"
                value={settings.ndaConfidentialityText}
                onChange={(e) => onChange({ ...settings, ndaConfidentialityText: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/5 dark:bg-[#031117] border border-teal-500/25 text-slate-900 dark:text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px]">
                Cancellation Policy Notice
              </label>
              <input
                type="text"
                value={settings.cancellationPolicyNotice}
                onChange={(e) => onChange({ ...settings, cancellationPolicyNotice: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/5 dark:bg-[#031117] border border-teal-500/25 text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: SERVICE-SPECIFIC EVENT LINKS */}
      {activeSection === 'services' && (
        <div className="bg-white/80 dark:bg-[#071A22]/80 border border-teal-500/20 rounded-3xl p-6 sm:p-7 backdrop-blur-xl shadow-xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-teal-500/15">
            <div>
              <h2 className="font-bold text-base flex items-center gap-2">
                <LinkIcon className="w-5 h-5 text-teal-500" />
                <span>Service-Specific Calendly Event Mappings</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Route different services to dedicated Calendly events, custom durations, and assigned tax directors.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddServiceMapping}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-500 text-white shadow-sm cursor-pointer"
            >
              <Plus size={14} />
              <span>Add Service Link</span>
            </button>
          </div>

          <div className="space-y-3">
            {(settings.serviceMappings || []).map((mapping, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-teal-500/15 space-y-3 text-xs"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-teal-500/20 text-teal-400 font-bold text-[10px] flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {mapping.serviceName}
                    </span>
                    <span className="font-mono text-[10px] text-slate-400">({mapping.serviceSlug})</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteServiceMapping(idx)}
                    className="text-slate-400 hover:text-rose-500 p-1"
                    title="Remove mapping"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                  <div>
                    <label className="text-[10px] text-slate-500 block mb-0.5">Service Name</label>
                    <input
                      type="text"
                      value={mapping.serviceName}
                      onChange={(e) => handleUpdateServiceMapping(idx, { serviceName: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-black/5 dark:bg-[#031117] border border-teal-500/20 text-slate-900 dark:text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-500 block mb-0.5">Service Slug Key</label>
                    <input
                      type="text"
                      value={mapping.serviceSlug}
                      onChange={(e) => handleUpdateServiceMapping(idx, { serviceSlug: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-black/5 dark:bg-[#031117] border border-teal-500/20 text-slate-900 dark:text-white font-mono text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-500 block mb-0.5">Assigned Professional</label>
                    <input
                      type="text"
                      value={mapping.assignedProfessional || ''}
                      onChange={(e) => handleUpdateServiceMapping(idx, { assignedProfessional: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-black/5 dark:bg-[#031117] border border-teal-500/20 text-slate-900 dark:text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-500 block mb-0.5">Duration (Mins)</label>
                    <select
                      value={mapping.durationMinutes}
                      onChange={(e) => handleUpdateServiceMapping(idx, { durationMinutes: parseInt(e.target.value, 10) })}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-black/5 dark:bg-[#031117] border border-teal-500/20 text-slate-900 dark:text-white text-xs"
                    >
                      <option value={15}>15 Mins</option>
                      <option value={30}>30 Mins</option>
                      <option value={45}>45 Mins</option>
                      <option value={60}>60 Mins</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2 lg:col-span-3">
                    <label className="text-[10px] text-slate-500 block mb-0.5">Dedicated Calendly Event Link</label>
                    <input
                      type="url"
                      value={mapping.calendlyUrl}
                      onChange={(e) => handleUpdateServiceMapping(idx, { calendlyUrl: e.target.value })}
                      placeholder="https://calendly.com/firm/specific-service"
                      className="w-full px-2.5 py-1.5 rounded-lg bg-black/5 dark:bg-[#031117] border border-teal-500/20 text-slate-900 dark:text-white font-mono text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-500 block mb-0.5">Method</label>
                    <select
                      value={mapping.consultationType}
                      onChange={(e) => handleUpdateServiceMapping(idx, { consultationType: e.target.value as any })}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-black/5 dark:bg-[#031117] border border-teal-500/20 text-slate-900 dark:text-white text-xs"
                    >
                      <option value="online">Online Video</option>
                      <option value="phone">Direct Phone</option>
                      <option value="in_person">In-Person</option>
                      <option value="any">Client Choice</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 4: FORM & CUSTOM FIELD BUILDER */}
      {activeSection === 'form' && (
        <div className="bg-white/80 dark:bg-[#071A22]/80 border border-teal-500/20 rounded-3xl p-6 sm:p-7 backdrop-blur-xl shadow-xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-teal-500/15">
            <div>
              <h2 className="font-bold text-base flex items-center gap-2">
                <Sliders className="w-5 h-5 text-teal-500" />
                <span>Consultation Form & Custom Fields Architecture</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Customize titles, reorder fields, mark as required/optional, or add custom questions to the customer intake form.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddField}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-500 text-white shadow-sm cursor-pointer"
            >
              <Plus size={14} />
              <span>Add Custom Field</span>
            </button>
          </div>

          {/* Form Step Headers */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="text-[11px] text-slate-500 block mb-1">Step 1 Title</label>
              <input
                type="text"
                value={settings.step1Label}
                onChange={(e) => onChange({ ...settings, step1Label: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-black/5 dark:bg-[#031117] border border-teal-500/20 text-slate-900 dark:text-white text-xs"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-500 block mb-1">Step 2 Title</label>
              <input
                type="text"
                value={settings.step2Label}
                onChange={(e) => onChange({ ...settings, step2Label: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-black/5 dark:bg-[#031117] border border-teal-500/20 text-slate-900 dark:text-white text-xs"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-500 block mb-1">Step 3 Title</label>
              <input
                type="text"
                value={settings.step3Label}
                onChange={(e) => onChange({ ...settings, step3Label: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-black/5 dark:bg-[#031117] border border-teal-500/20 text-slate-900 dark:text-white text-xs"
              />
            </div>
          </div>

          {/* Field List with Reorder Controls */}
          <div className="space-y-2.5 pt-2">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
              Active Fields (Drag/Reorder & Configure)
            </span>

            {(settings.customFields || []).map((field, index) => (
              <div
                key={field.id}
                className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-teal-500/15 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
              >
                {/* Reorder arrows */}
                <div className="flex items-center gap-2">
                  <div className="flex flex-col">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => handleMoveField(index, 'up')}
                      className="text-slate-400 hover:text-teal-400 disabled:opacity-20 cursor-pointer"
                    >
                      <ChevronUp size={14} />
                    </button>
                    <button
                      type="button"
                      disabled={index === (settings.customFields || []).length - 1}
                      onClick={() => handleMoveField(index, 'down')}
                      className="text-slate-400 hover:text-teal-400 disabled:opacity-20 cursor-pointer"
                    >
                      <ChevronDown size={14} />
                    </button>
                  </div>
                  <span className="font-mono text-xs font-bold text-teal-500 w-5">#{index + 1}</span>
                </div>

                {/* Field details */}
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={field.label}
                    onChange={(e) => handleUpdateField(field.id, { label: e.target.value })}
                    placeholder="Field Label"
                    className="px-2.5 py-1.5 rounded-lg bg-black/5 dark:bg-[#031117] border border-teal-500/20 text-slate-900 dark:text-white text-xs font-semibold"
                  />
                  <select
                    value={field.type}
                    onChange={(e) => handleUpdateField(field.id, { type: e.target.value as any })}
                    className="px-2.5 py-1.5 rounded-lg bg-black/5 dark:bg-[#031117] border border-teal-500/20 text-slate-900 dark:text-white text-xs"
                  >
                    <option value="text">Text Input</option>
                    <option value="email">Email Address</option>
                    <option value="tel">Phone Number</option>
                    <option value="select">Dropdown Options</option>
                    <option value="textarea">Multi-line Textarea</option>
                  </select>
                  <input
                    type="text"
                    value={field.placeholder || ''}
                    onChange={(e) => handleUpdateField(field.id, { placeholder: e.target.value })}
                    placeholder="Placeholder Text"
                    className="px-2.5 py-1.5 rounded-lg bg-black/5 dark:bg-[#031117] border border-teal-500/20 text-slate-900 dark:text-white text-xs text-slate-400"
                  />
                </div>

                {/* Toggles: Required & Active */}
                <div className="flex items-center gap-3 shrink-0">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={field.required}
                      onChange={(e) => handleUpdateField(field.id, { required: e.target.checked })}
                      className="rounded text-teal-600 focus:ring-teal-400"
                    />
                    <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">Required</span>
                  </label>

                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={field.enabled}
                      onChange={(e) => handleUpdateField(field.id, { enabled: e.target.checked })}
                      className="rounded text-teal-600 focus:ring-teal-400"
                    />
                    <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">Active</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => handleDeleteField(field.id)}
                    className="text-slate-400 hover:text-rose-500 p-1"
                    title="Delete field"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Success & Error messages */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-3 border-t border-teal-500/15">
            <div>
              <label className="text-[11px] text-slate-500 block mb-1">Form Success Confirmation Text</label>
              <textarea
                rows={2}
                value={settings.formSuccessMessage}
                onChange={(e) => onChange({ ...settings, formSuccessMessage: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-black/5 dark:bg-[#031117] border border-teal-500/20 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-500 block mb-1">Validation Error Message</label>
              <textarea
                rows={2}
                value={settings.validationErrorMessage}
                onChange={(e) => onChange({ ...settings, validationErrorMessage: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-black/5 dark:bg-[#031117] border border-teal-500/20 text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>
      )}

      {/* SECTION 5: NOTIFICATIONS & EMAIL PREVIEWS */}
      {activeSection === 'notifications' && (
        <div className="bg-white/80 dark:bg-[#071A22]/80 border border-teal-500/20 rounded-3xl p-6 sm:p-7 backdrop-blur-xl shadow-xl space-y-5">
          <div className="pb-3 border-b border-teal-500/15">
            <h2 className="font-bold text-base flex items-center gap-2">
              <Mail className="w-5 h-5 text-teal-500" />
              <span>Email Notification Templates & Live Previews</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Customize subject lines, email templates, and view formatted email previews before saving.
            </p>
          </div>

          {/* Notification selector tabs */}
          <div className="flex gap-2">
            {[
              { id: 'customer', label: 'Customer Confirmation' },
              { id: 'admin', label: 'Admin Intake Alert' },
              { id: 'cancellation', label: 'Cancellation Notice' },
              { id: 'reschedule', label: 'Rescheduling Notice' },
            ].map(item => (
              <button
                key={item.id}
                type="button"
                onClick={() => setPreviewEmailType(item.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                  previewEmailType === item.id
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'bg-black/5 dark:bg-white/5 text-slate-600 dark:text-slate-400'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 text-xs">
            {/* Template Editor */}
            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1 uppercase tracking-wider">
                  Admin Alert Recipient Email
                </label>
                <input
                  type="email"
                  value={settings.adminNotificationEmail}
                  onChange={(e) => onChange({ ...settings, adminNotificationEmail: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-black/5 dark:bg-[#031117] border border-teal-500/25 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1 uppercase tracking-wider">
                  Email Subject Line
                </label>
                <input
                  type="text"
                  value={
                    previewEmailType === 'customer'
                      ? settings.customerEmailSubject
                      : previewEmailType === 'cancellation'
                      ? settings.cancellationNoticeSubject
                      : previewEmailType === 'reschedule'
                      ? settings.rescheduleNoticeSubject
                      : '[Action Required] New Consultation Booking - {{fullName}}'
                  }
                  onChange={(e) => {
                    if (previewEmailType === 'customer') onChange({ ...settings, customerEmailSubject: e.target.value });
                    if (previewEmailType === 'cancellation') onChange({ ...settings, cancellationNoticeSubject: e.target.value });
                    if (previewEmailType === 'reschedule') onChange({ ...settings, rescheduleNoticeSubject: e.target.value });
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-black/5 dark:bg-[#031117] border border-teal-500/25 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1 uppercase tracking-wider">
                  Template Body (Supports Variables: &#123;&#123;fullName&#125;&#125;, &#123;&#123;referenceNo&#125;&#125;, &#123;&#123;serviceName&#125;&#125;)
                </label>
                <textarea
                  rows={8}
                  value={
                    previewEmailType === 'customer'
                      ? settings.customerEmailTemplate
                      : previewEmailType === 'cancellation'
                      ? settings.cancellationNoticeTemplate
                      : settings.rescheduleNoticeTemplate
                  }
                  onChange={(e) => {
                    if (previewEmailType === 'customer') onChange({ ...settings, customerEmailTemplate: e.target.value });
                    if (previewEmailType === 'cancellation') onChange({ ...settings, cancellationNoticeTemplate: e.target.value });
                    if (previewEmailType === 'reschedule') onChange({ ...settings, rescheduleNoticeTemplate: e.target.value });
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-black/5 dark:bg-[#031117] border border-teal-500/25 text-slate-900 dark:text-white font-mono leading-relaxed"
                />
              </div>
            </div>

            {/* Live Email Preview Box */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 flex items-center gap-1.5">
                <Eye size={13} />
                <span>Rendered Customer View Preview</span>
              </span>

              <div className="p-5 rounded-2xl bg-white dark:bg-[#041217] border border-teal-500/20 text-slate-800 dark:text-slate-200 shadow-inner space-y-3 font-sans text-xs">
                <div className="border-b border-teal-500/15 pb-2 text-[11px] text-slate-500 space-y-0.5 font-mono">
                  <div><strong>From:</strong> Smart Tax Experts &lt;advisory@smarttaxexperts.com&gt;</div>
                  <div><strong>To:</strong> rachel.sterling@client.com</div>
                  <div><strong>Subject:</strong> {
                    (previewEmailType === 'customer' ? settings.customerEmailSubject : settings.cancellationNoticeSubject)
                      .replace('{{referenceNo}}', 'STE-CONS-829104')
                  }</div>
                </div>

                <div className="py-2 whitespace-pre-wrap leading-relaxed">
                  {(previewEmailType === 'customer' ? settings.customerEmailTemplate : settings.cancellationNoticeTemplate)
                    .replace('{{fullName}}', 'Rachel Sterling')
                    .replace('{{serviceName}}', 'Tax Preparation Outsourcing')
                    .replace('{{preferredContactMethod}}', 'Phone')
                    .replace('{{referenceNo}}', 'STE-CONS-829104')
                    .replace('{{reason}}', 'Customer internal postponement')}
                </div>

                <div className="pt-3 border-t border-teal-500/15 text-[10px] text-slate-400 text-center font-mono">
                  Smart Tax Experts | 5900 BALCONES DR STE 100 AUSTIN TX 78731-4298 USA
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Save Button Strip */}
      <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-teal-600 hover:bg-teal-500 shadow-lg shadow-teal-900/30 transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
        >
          {saving ? <RefreshCw size={14} className="animate-spin" /> : <Check size={14} />}
          <span>{saving ? 'Publishing Settings...' : 'Save Consultation Settings'}</span>
        </button>
      </div>

    </div>
  );
}

