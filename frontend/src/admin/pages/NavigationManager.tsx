import React, { useState, useEffect, useCallback } from 'react';
import {
  Plus, Edit, Trash2, Eye, EyeOff, RefreshCw, GripVertical, X, Save,
  Navigation, ChevronUp, ChevronDown, ExternalLink, Link, AlertTriangle,
  LayoutList, CheckCircle2,
} from 'lucide-react';
import { AdminLayout } from '../components/AdminLayout';
import { ThreeDCard, MagneticButton } from '../components/ThreeDComponents';
import { apiClient } from '../../api/client';

// ─── Types ────────────────────────────────────────────────────────────────────

interface NavItem {
  id: string;
  name: string;
  slug: string;
  url: string;
  order: number;
  isVisible: boolean;
  target: '_self' | '_blank';
  parentId?: string | null;
  websitePageId?: string | null;
}

type FilterTab = 'all' | 'visible' | 'hidden';

interface FormState {
  name: string;
  url: string;
  order: number;
  isVisible: boolean;
  target: '_self' | '_blank';
}

const EMPTY_FORM: FormState = {
  name: '',
  url: '',
  order: 1,
  isVisible: true,
  target: '_self',
};

// ─── Delete Confirm Dialog ────────────────────────────────────────────────────

interface ConfirmDialogProps {
  itemName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

function ConfirmDialog({ itemName, onConfirm, onCancel }: ConfirmDialogProps) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <ThreeDCard
        intensity={5}
        glow={false}
        className="w-full max-w-sm bg-white dark:bg-[#071A22] border border-rose-500/30 shadow-2xl p-6 space-y-4"
      >
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-rose-500/10 shrink-0">
            <AlertTriangle className="w-5 h-5 text-rose-500" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">Delete Nav Item</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Permanently delete <span className="font-semibold text-rose-400">"{itemName}"</span>? This action cannot be undone.
            </p>
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/5 transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-rose-500 to-red-500 hover:from-rose-400 hover:to-red-400 shadow-md transition-all cursor-pointer"
          >
            Delete
          </button>
        </div>
      </ThreeDCard>
    </div>
  );
}

// ─── Nav Item Modal Form ──────────────────────────────────────────────────────

interface NavItemModalProps {
  editing: NavItem | null;
  form: FormState;
  saving: boolean;
  onFormChange: (f: FormState) => void;
  onSave: (e: React.FormEvent) => void;
  onClose: () => void;
}

function NavItemModal({ editing, form, saving, onFormChange, onSave, onClose }: NavItemModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md max-h-[90vh] bg-white dark:bg-[#071A22] border border-teal-500/30 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-teal-500/15 bg-white/80 dark:bg-[#071A22]/80 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-teal-500/10">
              <Link className="w-4 h-4 text-teal-500" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              {editing ? 'Edit Navigation Item' : 'Add New Nav Item'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-all cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={onSave} className="p-6 overflow-y-auto space-y-4 custom-scrollbar text-xs flex-1">
          {/* Name */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Display Name <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. About Us"
              value={form.name}
              onChange={e => onFormChange({ ...form, name: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-teal-500/20 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-teal-400 transition-colors"
            />
          </div>

          {/* URL */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              URL <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. /about or https://example.com"
              value={form.url}
              onChange={e => onFormChange({ ...form, url: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-teal-500/20 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-teal-400 transition-colors"
            />
          </div>

          {/* Target & Order row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Open In
              </label>
              <select
                value={form.target}
                onChange={e => onFormChange({ ...form, target: e.target.value as '_self' | '_blank' })}
                className="w-full px-3 py-2.5 rounded-xl bg-black/5 dark:bg-[#071A22] border border-teal-500/20 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-teal-400 transition-colors"
              >
                <option value="_self">Same Tab (_self)</option>
                <option value="_blank">New Tab (_blank)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Order #
              </label>
              <input
                type="number"
                min={0}
                value={form.order}
                onChange={e => onFormChange({ ...form, order: parseInt(e.target.value, 10) || 0 })}
                className="w-full px-3 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-teal-500/20 text-slate-900 dark:text-white focus:outline-none focus:border-teal-400 transition-colors"
              />
            </div>
          </div>

          {/* Is Visible */}
          <div className="flex items-center gap-3 pt-1">
            <label className="flex items-center gap-2.5 cursor-pointer group">
              <div
                onClick={() => onFormChange({ ...form, isVisible: !form.isVisible })}
                className={`relative w-9 h-5 rounded-full transition-colors cursor-pointer ${
                  form.isVisible ? 'bg-teal-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                  form.isVisible ? 'translate-x-4' : 'translate-x-0'
                }`} />
              </div>
              <span className="font-semibold text-slate-700 dark:text-slate-300 group-hover:text-teal-500 transition-colors">
                Visible in Navigation
              </span>
            </label>
          </div>

          {/* Footer Buttons */}
          <div className="pt-4 border-t border-teal-500/15 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/5 font-semibold cursor-pointer transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-white font-bold bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              <Save size={13} />
              {saving ? 'Saving…' : editing ? 'Update Item' : 'Add Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export function NavigationManagerPage() {
  const [items, setItems] = useState<NavItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [filterTab, setFilterTab] = useState<FilterTab>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<NavItem | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [deleteTarget, setDeleteTarget] = useState<NavItem | null>(null);
  const [dragIdx, setDragIdx] = useState<number | null>(null);

  // ── Fetch ──────────────────────────────────────────────────────────────────

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiClient.get('/navigation');
      const arr: NavItem[] = Array.isArray(data) ? data : [];
      setItems(arr.slice().sort((a, b) => a.order - b.order));
    } catch {
      // Silently handle; items stays []
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  // ── Filtered view ──────────────────────────────────────────────────────────

  const filteredItems = items.filter(item => {
    if (filterTab === 'visible') return item.isVisible;
    if (filterTab === 'hidden') return !item.isVisible;
    return true;
  });

  // ── Open modal ─────────────────────────────────────────────────────────────

  const openCreate = () => {
    setEditingItem(null);
    setForm({ ...EMPTY_FORM, order: items.length + 1 });
    setShowModal(true);
  };

  const openEdit = (item: NavItem) => {
    setEditingItem(item);
    setForm({
      name: item.name,
      url: item.url,
      order: item.order,
      isVisible: item.isVisible,
      target: item.target,
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null);
    setForm(EMPTY_FORM);
  };

  // ── Save (create / update) ─────────────────────────────────────────────────

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        url: form.url.trim(),
        order: form.order,
        isVisible: form.isVisible,
        target: form.target,
      };
      if (editingItem) {
        await apiClient.put(`/navigation/${editingItem.id}`, payload);
      } else {
        await apiClient.post('/navigation', payload);
      }
      closeModal();
      fetchItems();
    } catch (err: any) {
      alert('Failed to save: ' + (err?.message || 'Unknown error'));
    } finally {
      setSaving(false);
    }
  };

  // ── Toggle visibility ──────────────────────────────────────────────────────

  const toggleVisibility = async (item: NavItem) => {
    try {
      await apiClient.put(`/navigation/${item.id}`, {
        name: item.name,
        url: item.url,
        order: item.order,
        isVisible: !item.isVisible,
        target: item.target,
      });
      setItems(prev =>
        prev.map(i => (i.id === item.id ? { ...i, isVisible: !i.isVisible } : i))
      );
    } catch (err: any) {
      alert('Failed to update visibility: ' + (err?.message || 'Error'));
    }
  };

  // ── Move Up / Down ─────────────────────────────────────────────────────────

  const moveItem = async (idx: number, direction: 'up' | 'down') => {
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= items.length) return;

    const updated = items.slice();
    const aOrder = updated[idx].order;
    const bOrder = updated[swapIdx].order;

    updated[idx] = { ...updated[idx], order: bOrder };
    updated[swapIdx] = { ...updated[swapIdx], order: aOrder };
    updated.sort((a, b) => a.order - b.order);
    setItems(updated);

    try {
      await apiClient.put('/navigation/reorder/bulk', {
        order: [
          { id: updated[idx].id, order: updated[idx].order },
          { id: updated[swapIdx].id, order: updated[swapIdx].order },
        ],
      });
    } catch {
      fetchItems(); // rollback on failure
    }
  };

  // ── Delete ─────────────────────────────────────────────────────────────────

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await apiClient.delete(`/navigation/${deleteTarget.id}`);
      setDeleteTarget(null);
      fetchItems();
    } catch (err: any) {
      alert('Failed to delete: ' + (err?.message || 'Error'));
    }
  };

  // ── Drag-and-drop reorder ──────────────────────────────────────────────────

  const handleDrop = async (dropIdx: number) => {
    if (dragIdx === null || dragIdx === dropIdx) {
      setDragIdx(null);
      return;
    }
    const updated = items.slice();
    const [moved] = updated.splice(dragIdx, 1);
    updated.splice(dropIdx, 0, moved);
    const reordered = updated.map((item, i) => ({ ...item, order: i + 1 }));
    setItems(reordered);
    setDragIdx(null);
    try {
      await apiClient.put('/navigation/reorder/bulk', {
        order: reordered.map(item => ({ id: item.id, order: item.order })),
      });
    } catch {
      fetchItems(); // rollback on failure
    }
  };

  // ── Filter tab counts ──────────────────────────────────────────────────────

  const visibleCount = items.filter(i => i.isVisible).length;
  const hiddenCount = items.filter(i => !i.isVisible).length;

  const TABS: { id: FilterTab; label: string; count: number }[] = [
    { id: 'all', label: 'All Items', count: items.length },
    { id: 'visible', label: 'Visible Only', count: visibleCount },
    { id: 'hidden', label: 'Hidden', count: hiddenCount },
  ];

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <AdminLayout>
      <div className="p-5 sm:p-8 max-w-5xl mx-auto space-y-6 animate-fade-in">

        {/* ── Page Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
              <Navigation className="w-6 h-6 text-teal-500" />
              Navigation Manager
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-300 border border-teal-500/20">
                {items.length} Items
              </span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Manage site navigation links — order, visibility, and link targets
            </p>
          </div>

          <div className="flex items-center gap-3">
            <MagneticButton
              onClick={fetchItems}
              className="p-2.5 rounded-xl text-slate-500 dark:text-slate-400 border border-teal-500/20 hover:bg-teal-500/10 transition-all cursor-pointer shadow-sm"
              title="Refresh"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            </MagneticButton>

            <MagneticButton
              onClick={openCreate}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 shadow-lg shadow-teal-500/20 transition-all cursor-pointer"
            >
              <Plus size={14} />
              <span>Add Nav Item</span>
            </MagneticButton>
          </div>
        </div>

        {/* ── Filter Tabs ── */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-white/60 dark:bg-[#071A22]/60 border border-teal-500/15 backdrop-blur-xl shadow-sm w-fit">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterTab(tab.id)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                filterTab === tab.id
                  ? 'bg-teal-500 text-white shadow-md shadow-teal-500/30'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-teal-500/10'
              }`}
            >
              {tab.label}
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                filterTab === tab.id
                  ? 'bg-white/20 text-white'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* ── Items List ── */}
        <div className="space-y-2.5">
          {loading && items.length === 0 ? (
            // Skeleton loaders
            Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-[68px] rounded-2xl bg-white/40 dark:bg-white/5 border border-teal-500/10 animate-pulse"
              />
            ))
          ) : filteredItems.length === 0 ? (
            // Empty state
            <ThreeDCard
              intensity={5}
              glow={false}
              className="bg-white/70 dark:bg-[#071A22]/70 border border-teal-500/15 shadow-md"
            >
              <div className="py-16 flex flex-col items-center gap-4 text-center px-6">
                <div className="w-14 h-14 rounded-2xl bg-teal-500/10 flex items-center justify-center">
                  <LayoutList className="w-7 h-7 text-teal-500/60" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                    {filterTab === 'all' ? 'No navigation items yet' : `No ${filterTab} items`}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    {filterTab === 'all'
                      ? 'Click "Add Nav Item" to create your first navigation link.'
                      : 'Change filter tab to see other items.'}
                  </p>
                </div>
                {filterTab === 'all' && (
                  <button
                    onClick={openCreate}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 shadow-md transition-all cursor-pointer"
                  >
                    <Plus size={13} />
                    Add First Item
                  </button>
                )}
              </div>
            </ThreeDCard>
          ) : (
            filteredItems.map((item, idx) => {
              const globalIdx = items.indexOf(item);
              return (
                <ThreeDCard
                  key={item.id}
                  intensity={6}
                  draggable
                  onDragStart={() => setDragIdx(globalIdx)}
                  onDragOver={e => e.preventDefault()}
                  onDrop={() => handleDrop(globalIdx)}
                  className={`bg-white/80 dark:bg-[#071A22]/80 border backdrop-blur-xl shadow-lg group transition-all cursor-default ${
                    dragIdx === globalIdx
                      ? 'border-teal-400/60 scale-[0.99] opacity-70'
                      : 'border-teal-500/15 hover:border-teal-400/40'
                  }`}
                >
                  <div className="flex items-center gap-3 px-4 py-3.5">
                    {/* Drag handle */}
                    <GripVertical
                      size={16}
                      className="text-slate-300 dark:text-slate-600 group-hover:text-teal-400 cursor-grab shrink-0 transition-colors"
                    />

                    {/* Order badge */}
                    <span className="hidden sm:flex w-7 h-7 items-center justify-center rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-300 text-[10px] font-extrabold shrink-0">
                      {item.order}
                    </span>

                    {/* Main info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm text-slate-900 dark:text-white truncate">
                          {item.name}
                        </span>

                        {/* Visibility badge */}
                        {item.isVisible ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                            <CheckCircle2 size={9} />
                            Visible
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-500/10 text-slate-500 dark:text-slate-400 border border-slate-500/20">
                            <EyeOff size={9} />
                            Hidden
                          </span>
                        )}

                        {/* Target badge */}
                        {item.target === '_blank' && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                            <ExternalLink size={9} />
                            New Tab
                          </span>
                        )}
                      </div>

                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                        {item.url}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 shrink-0">
                      {/* Move up */}
                      <button
                        onClick={() => moveItem(globalIdx, 'up')}
                        disabled={globalIdx === 0}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-teal-500 hover:bg-teal-500/10 transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Move Up"
                      >
                        <ChevronUp size={14} />
                      </button>

                      {/* Move down */}
                      <button
                        onClick={() => moveItem(globalIdx, 'down')}
                        disabled={globalIdx === items.length - 1}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-teal-500 hover:bg-teal-500/10 transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Move Down"
                      >
                        <ChevronDown size={14} />
                      </button>

                      <div className="w-px h-5 bg-teal-500/15 mx-0.5" />

                      {/* Toggle visibility */}
                      <button
                        onClick={() => toggleVisibility(item)}
                        className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                          item.isVisible
                            ? 'text-emerald-500 hover:text-slate-500 hover:bg-slate-500/10'
                            : 'text-slate-400 hover:text-emerald-500 hover:bg-emerald-500/10'
                        }`}
                        title={item.isVisible ? 'Hide Item' : 'Show Item'}
                      >
                        {item.isVisible ? <Eye size={14} /> : <EyeOff size={14} />}
                      </button>

                      {/* Edit */}
                      <button
                        onClick={() => openEdit(item)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-500 hover:bg-cyan-500/10 transition-all cursor-pointer"
                        title="Edit Item"
                      >
                        <Edit size={14} />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => setDeleteTarget(item)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-all cursor-pointer"
                        title="Delete Item"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </ThreeDCard>
              );
            })
          )}
        </div>

        {/* ── Footer hint ── */}
        {items.length > 0 && (
          <p className="text-center text-[10px] text-slate-400 dark:text-slate-600 pb-2">
            Drag rows to reorder · Use ↑ ↓ buttons for precise control · Changes are saved instantly
          </p>
        )}
      </div>

      {/* ── Modals ── */}
      {showModal && (
        <NavItemModal
          editing={editingItem}
          form={form}
          saving={saving}
          onFormChange={setForm}
          onSave={handleSave}
          onClose={closeModal}
        />
      )}

      {deleteTarget && (
        <ConfirmDialog
          itemName={deleteTarget.name}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </AdminLayout>
  );
}
