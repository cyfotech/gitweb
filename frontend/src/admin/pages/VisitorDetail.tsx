import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, User, Mail, Calendar, Clock, Monitor, 
  FileText, ShieldCheck, Trash2, Activity, CheckCircle2,
  ExternalLink, Layers
} from 'lucide-react';
import { AdminLayout } from '../components/AdminLayout';
import { ThreeDCard, MagneticButton } from '../components/ThreeDComponents';
import { visitorApi } from '../../api/visitors';

export function VisitorDetailPage() {
  const { visitorId } = useParams<{ visitorId: string }>();
  const [visitor, setVisitor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  const fetchDetail = async () => {
    if (!visitorId) return;
    try {
      setLoading(true);
      const res: any = await visitorApi.getVisitorDetail(visitorId);
      if (res?.visitor) {
        setVisitor(res.visitor);
      }
    } catch (e) {
      console.error('Failed to load visitor details:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [visitorId]);

  const handleDelete = async () => {
    if (!visitorId) return;
    if (!window.confirm('Are you sure you want to delete this visitor and all associated logs? This complies with GDPR/DPDP data erasure.')) {
      return;
    }
    try {
      setDeleteLoading(true);
      await visitorApi.deleteVisitor(visitorId);
      setDeleteSuccess(true);
    } catch (e) {
      alert('Failed to delete visitor record.');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="p-5 sm:p-8 max-w-6xl mx-auto space-y-6 animate-fade-in">
        {/* Back Link */}
        <div className="flex items-center justify-between">
          <Link
            to="/admin/logs"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-teal-400 transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Back to System Logs</span>
          </Link>

          {visitor && !deleteSuccess && (
            <button
              onClick={handleDelete}
              disabled={deleteLoading}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white transition-all flex items-center gap-1.5"
            >
              <Trash2 size={13} />
              <span>{deleteLoading ? 'Erasing...' : 'Erase Personal Data (GDPR)'}</span>
            </button>
          )}
        </div>

        {deleteSuccess ? (
          <div className="p-10 text-center bg-white/70 dark:bg-[#071A22]/70 border border-rose-500/20 rounded-3xl backdrop-blur-xl">
            <CheckCircle2 className="w-12 h-12 text-rose-400 mx-auto mb-3" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Visitor Data Erased</h2>
            <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
              All logs, device mappings, and form submissions for this visitor have been permanently removed.
            </p>
            <Link
              to="/admin/logs"
              className="mt-4 inline-block px-4 py-2 rounded-xl text-xs font-semibold bg-teal-500 text-white"
            >
              Return to Logs
            </Link>
          </div>
        ) : loading ? (
          <div className="space-y-4 animate-pulse">
            <div className="h-40 bg-teal-500/10 rounded-3xl" />
            <div className="h-80 bg-teal-500/10 rounded-3xl" />
          </div>
        ) : !visitor ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            Visitor not found or has been removed.
          </div>
        ) : (
          <>
            {/* Visitor Identity Header Card */}
            <div className="bg-white/70 dark:bg-[#071A22]/70 border border-teal-500/15 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center font-black text-2xl text-slate-950 shadow-lg shadow-teal-500/20">
                    {visitor.displayName ? visitor.displayName.charAt(0).toUpperCase() : '?'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                        {visitor.displayName || 'Anonymous Visitor'}
                      </h1>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                        {visitor.identificationStatus}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 font-mono mt-1">
                      UUID: {visitor.visitorUuid}
                    </p>
                  </div>
                </div>

                <div className="text-left sm:text-right text-xs space-y-1">
                  <span className="text-slate-500 block">Total Recorded Visits</span>
                  <span className="text-2xl font-black text-teal-400">{visitor.totalVisits} visits</span>
                </div>
              </div>

              {/* Quick Details Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-teal-500/10 text-xs">
                <div>
                  <span className="text-slate-500 block text-[11px]">Email Address</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {visitor.email || 'Not voluntarily provided'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">First Visit</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono text-[11px]">
                    {new Date(visitor.firstVisit).toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Last Active</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono text-[11px]">
                    {new Date(visitor.lastVisit).toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Associated Devices</span>
                  <span className="font-semibold text-teal-400 font-mono">
                    {visitor.devices?.length || 1} registered
                  </span>
                </div>
              </div>
            </div>

            {/* Devices & Form Submissions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Associated Devices */}
              <div className="bg-white/70 dark:bg-[#071A22]/70 border border-teal-500/15 rounded-3xl p-6 backdrop-blur-xl shadow-xl space-y-4">
                <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Monitor className="w-4 h-4 text-teal-500" />
                  <span>Recognized Devices & Platforms</span>
                </h2>
                <div className="space-y-3">
                  {visitor.devices?.length === 0 ? (
                    <p className="text-xs text-slate-500">No device records available.</p>
                  ) : (
                    visitor.devices?.map((dev: any) => (
                      <div key={dev.id} className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-teal-500/15 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900 dark:text-white">
                            {dev.browser} on {dev.operatingSystem}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20">
                            {dev.deviceType || 'Desktop'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mt-2 text-[10px] text-slate-500 font-mono">
                          <span>First seen: {new Date(dev.createdAt).toLocaleDateString()}</span>
                          <span>Last seen: {new Date(dev.lastSeenAt).toLocaleString()}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Form Submissions */}
              <div className="bg-white/70 dark:bg-[#071A22]/70 border border-teal-500/15 rounded-3xl p-6 backdrop-blur-xl shadow-xl space-y-4">
                <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-amber-500" />
                  <span>Associated Form Submissions ({visitor.formSubmissions?.length || 0})</span>
                </h2>
                <div className="space-y-3">
                  {visitor.formSubmissions?.length === 0 ? (
                    <p className="text-xs text-slate-500">No form submissions recorded yet.</p>
                  ) : (
                    visitor.formSubmissions?.map((form: any) => (
                      <div key={form.id} className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-teal-500/15 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900 dark:text-white">
                            {form.formType}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            {form.submissionStatus}
                          </span>
                        </div>
                        <p className="text-slate-400 mt-1 text-[11px]">
                          Submitted identity: <strong className="text-teal-400">{form.submittedName || 'N/A'}</strong> ({form.submittedEmail || 'No email'})
                        </p>
                        <span className="text-[10px] text-slate-500 font-mono block mt-1">
                          {new Date(form.createdAt).toLocaleString()}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Chronological Activity Timeline */}
            <div className="bg-white/70 dark:bg-[#071A22]/70 border border-teal-500/15 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-xl space-y-5">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-500" />
                <span>Chronological User Activity Timeline</span>
              </h2>

              <div className="relative border-l-2 border-teal-500/20 pl-6 ml-3 space-y-6 text-xs">
                {visitor.activityTimeline?.length === 0 ? (
                  <p className="text-slate-500">No recorded activities.</p>
                ) : (
                  visitor.activityTimeline?.map((item: any) => (
                    <div key={item.id} className="relative group">
                      {/* Timeline dot */}
                      <div className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-teal-500 border-2 border-[#071A22] group-hover:scale-125 transition-transform" />

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <span className="font-bold text-slate-900 dark:text-white">
                          {item.description}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {new Date(item.createdAt).toLocaleString()}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] px-2 py-0.5 rounded bg-teal-500/10 text-teal-400 border border-teal-500/20 font-mono">
                          {item.activityType}
                        </span>
                        <span className="text-slate-500 text-[11px]">
                          Target: {item.page} ({item.pageUrl})
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
export default VisitorDetailPage;

