import React, { useState, useEffect, useCallback } from 'react';
import {
  Globe,
  Mail,
  Phone,
  MapPin,
  Clock,
  MessageSquare,
  Search,
  Save,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Link as LinkIcon,
  Building,
  Navigation,
  Plus,
  Trash2,
  ExternalLink,
  Eye,
  Check,
  X as CloseIcon,
  ArrowUpDown,
  Share2,
} from 'lucide-react';
import { AdminLayout } from '../components/AdminLayout';
import { ThreeDCard, MagneticButton } from '../components/ThreeDComponents';
import { useGlobalSettings, GlobalSettingsData } from '../../context/GlobalSettingsContext';
import {
  SOCIAL_PLATFORMS,
  detectSocialPlatform,
  validateSocialUrl,
  normalizeSocialUrl,
  SocialChannelItem,
} from '../../utils/socialMediaDetector';
import { SocialLinksBar } from '../../components/SocialLinksBar';

type TabId = 'brand' | 'contact' | 'social' | 'templates';

interface EmailTemplate {
  id: string;
  formType: string;
  subject: string;
  greeting: string;
  message: string;
  footer: string;
  isActive: boolean;
  updatedAt: string;
}

interface Toast {
  type: 'success' | 'error';
  message: string;
}

interface FieldProps {
  label: string;
  icon: React.ReactNode;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  multiline?: boolean;
}

function Field({ label, icon, value, onChange, type = 'text', placeholder, multiline }: FieldProps) {
  const base =
    'w-full bg-white dark:bg-slate-900/60 border border-teal-500/25 dark:border-teal-500/20 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-teal-500 dark:focus:border-teal-400/60 focus:ring-1 focus:ring-teal-500/30 transition-colors font-medium shadow-sm';
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
        <span className="text-teal-600 dark:text-teal-400">{icon}</span>
        {label}
      </label>
      {multiline ? (
        <textarea
          rows={3}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`${base} resize-none`}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={base}
        />
      )}
    </div>
  );
}

export function GlobalSettingsPage() {
  const { settings, loading, refreshSettings, updateSettings } = useGlobalSettings();

  const [activeTab, setActiveTab] = useState<TabId>('contact');
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);

  // Local form state
  const [form, setForm] = useState<GlobalSettingsData>(settings);

  // Email Templates State
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loadingTemplates, setLoadingTemplates] = useState(false);
  const [selectedTemplateType, setSelectedTemplateType] = useState<string>('consultation');
  const [templateForm, setTemplateForm] = useState<{
    subject: string;
    greeting: string;
    message: string;
    footer: string;
    isActive: boolean;
  }>({
    subject: '',
    greeting: '',
    message: '',
    footer: '',
    isActive: true,
  });
  const [savingTemplate, setSavingTemplate] = useState(false);

  useEffect(() => {
    setForm(settings);
  }, [settings]);

  const fetchEmailTemplates = async () => {
    setLoadingTemplates(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('adminToken') || '';
      const res = await fetch('/api/v1/settings/templates', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (res.ok) {
        const data = await res.json();
        setTemplates(data);
        const match = data.find((t: EmailTemplate) => t.formType === selectedTemplateType) || data[0];
        if (match) {
          setSelectedTemplateType(match.formType);
          setTemplateForm({
            subject: match.subject || '',
            greeting: match.greeting || '',
            message: match.message || '',
            footer: match.footer || '',
            isActive: match.isActive ?? true,
          });
        }
      }
    } catch {
      // Handled silently
    } finally {
      setLoadingTemplates(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'templates') {
      fetchEmailTemplates();
    }
  }, [activeTab]);

  const handleSelectTemplate = (type: string) => {
    setSelectedTemplateType(type);
    const match = templates.find((t) => t.formType === type);
    if (match) {
      setTemplateForm({
        subject: match.subject || '',
        greeting: match.greeting || '',
        message: match.message || '',
        footer: match.footer || '',
        isActive: match.isActive ?? true,
      });
    }
  };

  const handleSaveTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTemplateType) return;
    setSavingTemplate(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('adminToken') || '';
      const res = await fetch(`/api/v1/settings/templates/${selectedTemplateType}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(templateForm),
      });
      const data = await res.json();
      if (res.ok) {
        showToast('success', `Email template for ${selectedTemplateType} saved successfully!`);
        fetchEmailTemplates();
      } else {
        showToast('error', data.error || 'Failed to update email template');
      }
    } catch (err: any) {
      showToast('error', err.message || 'Error saving template');
    } finally {
      setSavingTemplate(false);
    }
  };

  const showToast = useCallback((type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);

      // Validate all active social channel URLs
      if (form.socialChannels && form.socialChannels.length > 0) {
        for (const ch of form.socialChannels) {
          if (ch.active && ch.url && ch.url.trim()) {
            const val = validateSocialUrl(ch.url);
            if (!val.valid) {
              showToast('error', `Invalid URL for ${ch.name || 'channel'}: ${val.error}`);
              setSaving(false);
              return;
            }
          }
        }
      }

      const success = await updateSettings(form);
      if (success) {
        showToast('success', 'Global brand & contact information synchronized to database!');
        await refreshSettings();
      } else {
        showToast('error', 'Failed to save settings to database.');
      }
    } catch (err: any) {
      showToast('error', err.message || 'An error occurred while saving.');
    } finally {
      setSaving(false);
    }
  };

  // Social Channel Helpers
  const handleAddChannel = (presetId?: string) => {
    const preset = presetId ? SOCIAL_PLATFORMS[presetId] : SOCIAL_PLATFORMS.custom;
    const newChannel: SocialChannelItem = {
      id: `ch-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      platform: preset ? preset.id : 'custom',
      name: preset ? preset.name : 'Custom Channel',
      url: preset && preset.placeholder && !preset.placeholder.includes('your-') ? preset.placeholder : '',
      active: true,
      order: (form.socialChannels?.length || 0),
    };
    setForm({
      ...form,
      socialChannels: [...(form.socialChannels || []), newChannel],
    });
  };

  const handleUpdateChannel = (id: string, updates: Partial<SocialChannelItem>) => {
    const updated = (form.socialChannels || []).map((ch) => {
      if (ch.id !== id) return ch;
      const next = { ...ch, ...updates };
      // If URL changed and user didn't explicitly override platform, auto-detect platform
      if (updates.url !== undefined) {
        const detected = detectSocialPlatform(updates.url);
        next.platform = detected.id;
        if (!updates.name) {
          next.name = detected.name;
        }
      }
      return next;
    });
    setForm({ ...form, socialChannels: updated });
  };

  const handleDeleteChannel = (id: string) => {
    const filtered = (form.socialChannels || []).filter((ch) => ch.id !== id);
    setForm({ ...form, socialChannels: filtered });
  };

  const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
    { id: 'contact', label: 'Contact & Headquarters', icon: <Phone size={15} /> },
    { id: 'brand', label: 'Brand & Corporate Identity', icon: <Globe size={15} /> },
    { id: 'social', label: 'Social Channels', icon: <LinkIcon size={15} /> },
    { id: 'templates', label: 'Email Templates', icon: <Mail size={15} /> },
  ];

  return (
    <AdminLayout>
      <div className="p-5 sm:p-8 max-w-5xl mx-auto space-y-8 animate-fade-in">

        {/* Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-teal-900/40 via-cyan-900/30 to-emerald-900/40 border border-teal-500/20 p-6 sm:p-10 backdrop-blur-2xl shadow-2xl">
          <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-teal-500/15 text-cyan-300 border border-teal-500/25 mb-3">
                <Sparkles size={13} className="text-cyan-300 animate-spin" style={{ animationDuration: '6s' }} />
                <span>Authoritative Single Source of Truth</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
                Global Brand & Contact Settings
              </h1>
              <p className="mt-2 text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                Configure corporate identity, direct advisory communication lines, office address, and operational hours. Updates dynamically propagate to the public Contact Us page, footer, and inquiry points.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <MagneticButton
                onClick={refreshSettings}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-teal-700 dark:text-teal-300 bg-white/90 dark:bg-[#071A22] border border-teal-500/30 hover:border-teal-500 shadow-md transition-all cursor-pointer"
              >
                <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                <span>Refresh</span>
              </MagneticButton>
              <MagneticButton
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-teal-600 hover:bg-teal-500 shadow-lg shadow-teal-900/40 transition-all cursor-pointer disabled:opacity-50"
              >
                {saving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
                <span>{saving ? 'Saving...' : 'Save All Changes'}</span>
              </MagneticButton>
            </div>
          </div>
        </div>

        {/* Toast Notification */}
        {toast && (
          <div
            className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl text-sm font-medium border shadow-lg transition-all
              ${toast.type === 'success'
                ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                : 'bg-rose-500/15 border-rose-500/30 text-rose-300'
              }`}
          >
            {toast.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
            <span>{toast.message}</span>
          </div>
        )}

        {/* Tab Buttons */}
        <div className="flex border-b border-teal-500/20 gap-2 text-xs font-semibold overflow-x-auto pb-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all cursor-pointer font-semibold ${
                activeTab === tab.id
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* TAB 1: Contact & Headquarters */}
        {activeTab === 'contact' && (
          <div className="space-y-6">
            <ThreeDCard className="bg-white/80 dark:bg-[#071A22]/70 border border-teal-500/20 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-xl space-y-6">
              <h2 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Phone className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span>Direct Advisory Contact Lines</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Field
                  label="Contact Email (Official Advisory)"
                  icon={<Mail size={14} />}
                  value={form.email}
                  onChange={(v) => setForm({ ...form, email: v })}
                  placeholder="advisory@preferredtax.com"
                />
                <Field
                  label="Contact Phone Number"
                  icon={<Phone size={14} />}
                  value={form.phone}
                  onChange={(v) => setForm({ ...form, phone: v })}
                  placeholder="+1 (800) 555-PTAX (7829)"
                />
                <Field
                  label="WhatsApp Direct Support"
                  icon={<MessageSquare size={14} />}
                  value={form.whatsapp}
                  onChange={(v) => setForm({ ...form, whatsapp: v })}
                  placeholder="+1 (800) 555-7829"
                />
                <Field
                  label="Active Operational Hours"
                  icon={<Clock size={14} />}
                  value={form.businessHours}
                  onChange={(v) => setForm({ ...form, businessHours: v })}
                  placeholder="Mon - Fri: 8:00 AM - 7:00 PM EST"
                />
              </div>

              <div className="pt-4 border-t border-teal-500/15 space-y-4">
                <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock size={14} className="text-teal-600 dark:text-teal-400" />
                  <span>Active Operational Window (Contact Sidebar Card 03)</span>
                </h3>

                <Field
                  label="Card Title"
                  icon={<Sparkles size={14} />}
                  value={form.operationalTitle}
                  onChange={(v) => setForm({ ...form, operationalTitle: v })}
                  placeholder="Active Operational Window"
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Field
                    label="Line 1 (Support / Office Hours)"
                    icon={<Clock size={14} />}
                    value={form.operationalLine1}
                    onChange={(v) => setForm({ ...form, operationalLine1: v })}
                    placeholder="Mon – Fri: 8:00 AM – 7:00 PM EST"
                  />
                  <Field
                    label="Line 2 (Offshore / Processing Cycle)"
                    icon={<Clock size={14} />}
                    value={form.operationalLine2}
                    onChange={(v) => setForm({ ...form, operationalLine2: v })}
                    placeholder="Offshore Processing: 24-Hour Continuous Cycle"
                  />
                  <Field
                    label="Line 3 (Peak Support / Weekend SLA)"
                    icon={<Clock size={14} />}
                    value={form.operationalLine3}
                    onChange={(v) => setForm({ ...form, operationalLine3: v })}
                    placeholder="Peak Season Support: 7 Days / Week"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-teal-500/15 space-y-4">
                <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin size={14} className="text-teal-600 dark:text-teal-400" />
                  <span>Physical Headquarters & Map Embed</span>
                </h3>

                <Field
                  label="Office Physical Address"
                  icon={<MapPin size={14} />}
                  value={form.address}
                  onChange={(v) => setForm({ ...form, address: v })}
                  placeholder="100 Wall Street, 24th Floor, New York, NY 10005"
                  multiline
                />

                <Field
                  label="Google Maps Embed URL"
                  icon={<Navigation size={14} />}
                  value={form.mapEmbedUrl}
                  onChange={(v) => setForm({ ...form, mapEmbedUrl: v })}
                  placeholder="https://maps.google.com/maps?q=100+Wall+Street+New+York&output=embed"
                />
              </div>

              <div className="pt-4 border-t border-teal-500/15 space-y-4">
                <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Building size={14} className="text-teal-600 dark:text-teal-400" />
                  <span>Public Contact Us Page Copy</span>
                </h3>

                <Field
                  label="Contact Page Main Heading"
                  icon={<Sparkles size={14} />}
                  value={form.contactHeading}
                  onChange={(v) => setForm({ ...form, contactHeading: v })}
                  placeholder="Contact Our Advisory & Outsourcing Leadership"
                />

                <Field
                  label="Contact Page Subheading / Narrative"
                  icon={<Globe size={14} />}
                  value={form.contactDescription}
                  onChange={(v) => setForm({ ...form, contactDescription: v })}
                  placeholder="Whether exploring CPA capacity augmentation or tax planning..."
                  multiline
                />
              </div>
            </ThreeDCard>
          </div>
        )}

        {/* TAB 2: Brand Identity */}
        {activeTab === 'brand' && (
          <ThreeDCard className="bg-white/80 dark:bg-[#071A22]/70 border border-teal-500/20 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-xl space-y-6">
            <h2 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span>Corporate Branding & Legal Representation</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field
                label="Brand / Firm Name"
                icon={<Building size={14} />}
                value={form.brandName}
                onChange={(v) => setForm({ ...form, brandName: v })}
                placeholder="Smart Tax Experts (STE)"
              />
              <Field
                label="Primary Firm Tagline"
                icon={<Sparkles size={14} />}
                value={form.tagline}
                onChange={(v) => setForm({ ...form, tagline: v })}
                placeholder="Premier Tax Preparation & GAAP Accounting"
              />
            </div>

            <Field
              label="Company Narrative Summary (Appears in Footer & Metas)"
              icon={<Globe size={14} />}
              value={form.description}
              onChange={(v) => setForm({ ...form, description: v })}
              multiline
            />

            <Field
              label="Legal Copyright Statement"
              icon={<Globe size={14} />}
              value={form.copyright}
              onChange={(v) => setForm({ ...form, copyright: v })}
              placeholder="Smart Tax Experts (STE). All rights reserved."
            />
          </ThreeDCard>
        )}

        {/* TAB 3: Social Channels */}
        {activeTab === 'social' && (
          <div className="space-y-6">
            <ThreeDCard className="bg-white/80 dark:bg-[#071A22]/70 border border-teal-500/20 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-teal-500/15">
                <div>
                  <h2 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                    <Share2 className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                    <span>Intelligent Social Media Management System</span>
                  </h2>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    Automatic URL platform detection, official brand icons, active/inactive controls, and direct synchronization across website headers, footers, and contact coordinates.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <MagneticButton
                    onClick={() => handleAddChannel()}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-teal-600 hover:bg-teal-500 shadow-md shadow-teal-900/30 transition-all cursor-pointer"
                  >
                    <Plus size={14} />
                    <span>Add Social Channel</span>
                  </MagneticButton>
                </div>
              </div>

              {/* Quick Add Presets Bar */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                  Quick Add Platform:
                </span>
                <div className="flex flex-wrap gap-2">
                  {Object.values(SOCIAL_PLATFORMS)
                    .filter((p) => p.id !== 'custom' && p.id !== 'website')
                    .slice(0, 14)
                    .map((preset) => {
                      const Icon = preset.IconComponent;
                      const alreadyAdded = (form.socialChannels || []).some(
                        (c) => c.platform === preset.id
                      );
                      return (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => handleAddChannel(preset.id)}
                          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                            alreadyAdded
                              ? 'bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-teal-500/10 text-slate-400 dark:text-slate-500 hover:border-teal-500/30'
                              : 'bg-white dark:bg-[#071A22] border-slate-200 dark:border-teal-500/20 text-slate-700 dark:text-slate-300 hover:border-teal-500 hover:text-teal-600 dark:hover:text-teal-400 hover:scale-105'
                          }`}
                          title={`Add ${preset.name}`}
                        >
                          <span style={{ color: preset.color }}>
                            <Icon size={12} />
                          </span>
                          <span>{preset.name}</span>
                        </button>
                      );
                    })}
                </div>
              </div>

              {/* Dynamic Channels List */}
              <div className="space-y-4 pt-2">
                {(!form.socialChannels || form.socialChannels.length === 0) ? (
                  <div className="text-center py-12 rounded-2xl border border-dashed border-teal-500/30 bg-teal-500/5">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      No social channels configured yet. Click "Add Social Channel" or choose a platform above.
                    </p>
                  </div>
                ) : (
                  form.socialChannels.map((channel, idx) => {
                    const cfg = SOCIAL_PLATFORMS[channel.platform] || detectSocialPlatform(channel.url);
                    const Icon = cfg.IconComponent;
                    const urlValidation = channel.url ? validateSocialUrl(channel.url) : { valid: true };

                    return (
                      <div
                        key={channel.id}
                        className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                          channel.active
                            ? 'bg-white dark:bg-[#05151c] border-teal-500/20 shadow-sm'
                            : 'bg-slate-100/70 dark:bg-black/20 border-slate-200 dark:border-white/5 opacity-70'
                        }`}
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          {/* Left: Official Icon with Brand Color + Name + Auto-Detection Badge */}
                          <div className="flex items-center gap-3 shrink-0">
                            <div
                              className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border shadow-sm transition-transform hover:scale-110"
                              style={{
                                backgroundColor: cfg.bgLight,
                                borderColor: `${cfg.color}40`,
                              }}
                            >
                              <span style={{ color: cfg.color }}>
                                <Icon size={20} />
                              </span>
                            </div>

                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-sm text-slate-900 dark:text-white">
                                  {cfg.name}
                                </span>
                                <span
                                  className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded border"
                                  style={{
                                    backgroundColor: cfg.bgLight,
                                    color: cfg.color,
                                    borderColor: `${cfg.color}50`,
                                  }}
                                >
                                  {channel.platform === 'custom' ? 'Custom' : 'Auto-Detected'}
                                </span>
                              </div>
                              <span className="text-[11px] text-slate-500 font-mono">
                                Order #{idx + 1}
                              </span>
                            </div>
                          </div>

                          {/* Middle: URL Input with real-time auto detection */}
                          <div className="flex-1 w-full space-y-1">
                            <input
                              type="text"
                              value={channel.url}
                              onChange={(e) => handleUpdateChannel(channel.id, { url: e.target.value })}
                              placeholder={cfg.placeholder || 'https://...'}
                              className={`w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900/60 border text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none font-medium transition-colors ${
                                !urlValidation.valid && channel.url
                                  ? 'border-rose-500/60 focus:border-rose-500'
                                  : 'border-teal-500/25 focus:border-teal-500'
                              }`}
                            />
                            {!urlValidation.valid && channel.url && (
                              <p className="text-[10px] text-rose-500 font-medium">
                                {urlValidation.error}
                              </p>
                            )}
                          </div>

                          {/* Right: Actions (Active Toggle, Open Link, Delete) */}
                          <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                            {/* Active Toggle Button */}
                            <button
                              type="button"
                              onClick={() => handleUpdateChannel(channel.id, { active: !channel.active })}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                                channel.active
                                  ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
                                  : 'bg-slate-200 dark:bg-white/5 border-slate-300 dark:border-white/10 text-slate-600 dark:text-slate-400'
                              }`}
                              title={channel.active ? 'Channel is active on public site' : 'Channel is disabled'}
                            >
                              {channel.active ? <Check size={12} /> : <CloseIcon size={12} />}
                              <span>{channel.active ? 'Active' : 'Disabled'}</span>
                            </button>

                            {/* Open External Profile */}
                            {channel.url && urlValidation.valid && (
                              <a
                                href={normalizeSocialUrl(channel.url)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 bg-slate-100 dark:bg-white/5 border border-teal-500/20 hover:border-teal-500 transition-all cursor-pointer"
                                title="Open Live Profile in New Tab"
                              >
                                <ExternalLink size={14} />
                              </a>
                            )}

                            {/* Delete Channel */}
                            <button
                              type="button"
                              onClick={() => handleDeleteChannel(channel.id)}
                              className="p-2 rounded-xl text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-rose-500/30 transition-all cursor-pointer"
                              title="Delete Social Channel"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </ThreeDCard>

            {/* LIVE PREVIEW BOX: How Social Links Look on Public Pages */}
            <ThreeDCard className="bg-white/80 dark:bg-[#071A22]/70 border border-teal-500/20 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-teal-500/15">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    Live Public Website Preview
                  </h3>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-500/15 text-teal-700 dark:text-cyan-300 border border-teal-500/30 uppercase">
                  Real-Time Sync
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400">
                Below is how your active social channels will render on the public website footer and contact channels with authentic brand icons and smooth hover animations:
              </p>

              {/* Public Footer Preview Render */}
              <div className="p-5 rounded-2xl bg-[#041416] border border-teal-500/20 text-slate-200 space-y-2">
                <span className="text-[10px] font-mono text-teal-400 uppercase tracking-wider block">
                  Footer & Contact Channels Preview
                </span>
                <SocialLinksBar
                  channels={form.socialChannels}
                  variant="footer"
                  iconSize={16}
                />
              </div>
            </ThreeDCard>
          </div>
        )}

        {/* TAB 4: Automated Email Templates */}
        {activeTab === 'templates' && (
          <div className="space-y-6">
            <ThreeDCard className="p-6 sm:p-8 rounded-3xl bg-white/80 dark:bg-[#071A22]/80 border border-teal-500/20 shadow-xl backdrop-blur-xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-teal-500/15 gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Mail className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                    <span>Automated Email Templates</span>
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Customize subject lines, greetings, confirmation copy, and footers for all customer form submissions.
                  </p>
                </div>
                {loadingTemplates && (
                  <span className="text-xs text-teal-500 flex items-center gap-1.5 font-medium animate-pulse">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Loading templates...
                  </span>
                )}
              </div>

              {/* Template Selector Chips */}
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-2">
                  Select Form Notification Template:
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { type: 'consultation', label: 'Consultation Request' },
                    { type: 'contact', label: 'Contact Inquiry' },
                    { type: 'services_enquiry', label: 'Service Enquiry' },
                    { type: 'cpa', label: 'CPA Outsourcing' },
                    { type: 'callback', label: 'Callback Request' },
                    { type: 'career', label: 'Career Application' },
                    { type: 'blog', label: 'Blog Inquiry' },
                  ].map((item) => (
                    <button
                      key={item.type}
                      type="button"
                      onClick={() => handleSelectTemplate(item.type)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        selectedTemplateType === item.type
                          ? 'bg-teal-600 text-white shadow-md shadow-teal-600/30'
                          : 'bg-black/5 dark:bg-white/5 border border-teal-500/15 text-slate-700 dark:text-slate-300 hover:bg-black/10 dark:hover:bg-white/10'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Variables Cheat Sheet */}
              <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-xs text-slate-700 dark:text-slate-300 space-y-1.5">
                <div className="font-bold text-teal-700 dark:text-teal-300 flex items-center gap-1.5">
                  <Sparkles size={13} />
                  <span>Available Dynamic Variables (replaces automatically on send):</span>
                </div>
                <div className="flex flex-wrap gap-2 pt-1 font-mono text-[11px] text-teal-800 dark:text-cyan-200">
                  <span className="bg-white/80 dark:bg-black/40 px-2 py-0.5 rounded border border-teal-500/20">{`{{customerName}}`}</span>
                  <span className="bg-white/80 dark:bg-black/40 px-2 py-0.5 rounded border border-teal-500/20">{`{{referenceNumber}}`}</span>
                  <span className="bg-white/80 dark:bg-black/40 px-2 py-0.5 rounded border border-teal-500/20">{`{{brandName}}`}</span>
                  <span className="bg-white/80 dark:bg-black/40 px-2 py-0.5 rounded border border-teal-500/20">{`{{serviceName}}`}</span>
                  <span className="bg-white/80 dark:bg-black/40 px-2 py-0.5 rounded border border-teal-500/20">{`{{email}}`}</span>
                  <span className="bg-white/80 dark:bg-black/40 px-2 py-0.5 rounded border border-teal-500/20">{`{{phone}}`}</span>
                  <span className="bg-white/80 dark:bg-black/40 px-2 py-0.5 rounded border border-teal-500/20">{`{{fields}}`}</span>
                  <span className="bg-white/80 dark:bg-black/40 px-2 py-0.5 rounded border border-teal-500/20">{`{{message}}`}</span>
                </div>
              </div>

              {/* Template Edit Form */}
              <form onSubmit={handleSaveTemplate} className="space-y-4">
                {/* Active Toggle */}
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-teal-500/15">
                  <div>
                    <span className="text-xs font-bold text-slate-800 dark:text-white block">
                      Enable Automated Customer Confirmation Email
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      When active, customer receives this branded HTML template immediately upon form submission.
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={templateForm.isActive}
                      onChange={(e) => setTemplateForm({ ...templateForm, isActive: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                  </label>
                </div>

                {/* Subject */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Email Subject Line:
                  </label>
                  <input
                    type="text"
                    required
                    value={templateForm.subject}
                    onChange={(e) => setTemplateForm({ ...templateForm, subject: e.target.value })}
                    placeholder="e.g. Confirmation: Your Consultation Request – {{brandName}}"
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-black/5 dark:bg-[#031117] border border-teal-500/20 text-slate-900 dark:text-white focus:outline-none focus:border-teal-400"
                  />
                </div>

                {/* Greeting */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Opening Greeting:
                  </label>
                  <input
                    type="text"
                    value={templateForm.greeting}
                    onChange={(e) => setTemplateForm({ ...templateForm, greeting: e.target.value })}
                    placeholder="e.g. Dear {{customerName}},"
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-black/5 dark:bg-[#031117] border border-teal-500/20 text-slate-900 dark:text-white focus:outline-none focus:border-teal-400"
                  />
                </div>

                {/* Message Body */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Message Body (Supports Markdown **bold** and {'{{variables}}'}):
                  </label>
                  <textarea
                    rows={7}
                    required
                    value={templateForm.message}
                    onChange={(e) => setTemplateForm({ ...templateForm, message: e.target.value })}
                    placeholder="Enter email body copy..."
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs font-mono bg-black/5 dark:bg-[#031117] border border-teal-500/20 text-slate-900 dark:text-white focus:outline-none focus:border-teal-400"
                  />
                </div>

                {/* Footer */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Closing Sign-off / Footer:
                  </label>
                  <textarea
                    rows={2}
                    value={templateForm.footer}
                    onChange={(e) => setTemplateForm({ ...templateForm, footer: e.target.value })}
                    placeholder="e.g. Best regards,&#10;{{brandName}} Team"
                    className="w-full px-3.5 py-2 rounded-xl text-xs bg-black/5 dark:bg-[#031117] border border-teal-500/20 text-slate-900 dark:text-white focus:outline-none focus:border-teal-400"
                  />
                </div>

                {/* Save Button */}
                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={savingTemplate}
                    className="px-6 py-2.5 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white shadow-lg shadow-teal-600/30 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Save size={14} />
                    <span>{savingTemplate ? 'Saving Changes...' : 'Save Email Template'}</span>
                  </button>
                </div>
              </form>
            </ThreeDCard>
          </div>
        )}

      </div>
    </AdminLayout>
  );
}
export default GlobalSettingsPage;
