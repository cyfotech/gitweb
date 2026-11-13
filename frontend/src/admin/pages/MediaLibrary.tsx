import React, { useState, useEffect, useRef } from 'react';
import {
  Upload,
  Trash2,
  Copy,
  Search,
  Grid,
  List,
  FolderPlus,
  RefreshCw,
  X,
  Check,
  Image as ImageIcon,
  Film,
  FileText,
  Sparkles,
  Filter,
  Eye,
  Download,
  Sliders,
  Folder,
  Layers,
  Archive,
  ArrowUpDown,
  AlertTriangle,
  RotateCw,
  Maximize2,
  ExternalLink,
  ChevronRight,
  Plus,
  CheckCircle2,
  Info,
  Edit3,
} from 'lucide-react';
import { AdminLayout } from '../components/AdminLayout';
import {
  mediaApi,
  MediaAsset,
  MediaFolder,
  MediaStatistics,
} from '../../api/media';

export function MediaLibraryPage() {
  // Main states
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [folders, setFolders] = useState<MediaFolder[]>([]);
  const [stats, setStats] = useState<MediaStatistics | null>(null);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedAsset, setSelectedAsset] = useState<MediaAsset | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Filters
  const [selectedFolderId, setSelectedFolderId] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [unusedOnly, setUnusedOnly] = useState<boolean>(false);
  const [sortOption, setSortOption] = useState<string>('newest');

  // Bulk Selection
  const [selectedAssetIds, setSelectedAssetIds] = useState<string[]>([]);
  const [bulkAction, setBulkAction] = useState<string>('');
  const [targetMoveFolderId, setTargetMoveFolderId] = useState<string>('');

  // Upload Queue State
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Modals & Panels
  const [showFolderModal, setShowFolderModal] = useState<boolean>(false);
  const [newFolderName, setNewFolderName] = useState<string>('');
  const [showReplaceModal, setShowReplaceModal] = useState<boolean>(false);
  const [replaceFile, setReplaceFile] = useState<File | null>(null);
  const [isReplacing, setIsReplacing] = useState<boolean>(false);
  const [showImageEditor, setShowImageEditor] = useState<boolean>(false);
  const [imageRotation, setImageRotation] = useState<number>(0);
  const [imageFormat, setImageFormat] = useState<string>('webp');
  const [saveAsNewImage, setSaveAsNewImage] = useState<boolean>(false);
  const [isSavingImage, setIsSavingImage] = useState<boolean>(false);

  // Edit Metadata State
  const [editTitle, setEditTitle] = useState<string>('');
  const [editAltText, setEditAltText] = useState<string>('');
  const [editCaption, setEditCaption] = useState<string>('');
  const [editDescription, setEditDescription] = useState<string>('');
  const [editSeoTitle, setEditSeoTitle] = useState<string>('');
  const [editFolderId, setEditFolderId] = useState<string>('');
  const [isSavingDetails, setIsSavingDetails] = useState<boolean>(false);

  // Load initial stats & folders
  useEffect(() => {
    loadStatistics();
    loadFolders();
  }, []);

  // Fetch assets on filter or pagination changes
  useEffect(() => {
    fetchAssets();
  }, [page, selectedFolderId, typeFilter, unusedOnly, sortOption]);

  const loadStatistics = async () => {
    try {
      const data = await mediaApi.getStatistics();
      setStats(data);
    } catch (e) {
      console.error('Failed to load media statistics', e);
    }
  };

  const loadFolders = async () => {
    try {
      const data = await mediaApi.getFolders();
      setFolders(data || []);
    } catch (e) {
      console.error('Failed to load folders', e);
    }
  };

  const fetchAssets = async () => {
    setLoading(true);
    try {
      const params: any = {
        page,
        limit: 32,
        sort: sortOption,
      };

      if (selectedFolderId !== 'all') params.folderId = selectedFolderId;
      if (typeFilter !== 'all') params.type = typeFilter;
      if (unusedOnly) params.unusedOnly = true;
      if (searchQuery.trim()) params.search = searchQuery.trim();

      const res: any = await mediaApi.getAll(params);
      const list = res.assets || [];
      setAssets(list);
      setTotalCount(res.total || 0);
      setTotalPages(res.totalPages || 1);

      // Keep selected asset in sync
      if (selectedAsset) {
        const refreshed = list.find((a: MediaAsset) => a.id === selectedAsset.id);
        if (refreshed) setSelectedAsset(refreshed);
      }
    } catch (e) {
      console.error('Failed to fetch assets', e);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchAssets();
  };

  // Upload handler for single or multiple files
  const handleUploadFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsUploading(true);
    setUploadProgress(10);
    try {
      const fileList = Array.from(files);
      const res: any = await mediaApi.uploadFiles(
        fileList,
        selectedFolderId !== 'all' ? selectedFolderId : undefined
      );
      setUploadProgress(100);
      await fetchAssets();
      await loadStatistics();
      await loadFolders();
      if (res.assets && res.assets.length > 0) {
        setSelectedAsset(res.assets[0]);
      }
    } catch (err: any) {
      alert('Upload failed: ' + (err.message || 'Error'));
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // Drag and Drop
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUploadFiles(e.dataTransfer.files);
    }
  };

  // When clicking an asset card
  const handleSelectAsset = (asset: MediaAsset) => {
    setSelectedAsset(asset);
    setEditTitle(asset.originalName || '');
    setEditAltText(asset.altText || '');
    setEditCaption(asset.caption || '');
    setEditDescription(asset.description || '');
    setEditSeoTitle(asset.seoTitle || '');
    setEditFolderId(asset.folderId || '');
  };

  // Save Asset Details
  const handleSaveDetails = async () => {
    if (!selectedAsset) return;
    setIsSavingDetails(true);
    try {
      const updated = await mediaApi.update(selectedAsset.id, {
        originalName: editTitle,
        altText: editAltText,
        caption: editCaption,
        description: editDescription,
        seoTitle: editSeoTitle,
        folderId: editFolderId || null,
      });
      setSelectedAsset(updated);
      await fetchAssets();
      await loadFolders();
      alert('Asset details and SEO metadata updated successfully!');
    } catch (err: any) {
      alert('Failed to update asset: ' + (err.message || 'Error'));
    } finally {
      setIsSavingDetails(false);
    }
  };

  // Create Folder
  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    try {
      await mediaApi.createFolder(newFolderName.trim());
      setNewFolderName('');
      setShowFolderModal(false);
      await loadFolders();
      await loadStatistics();
    } catch (err: any) {
      alert('Failed to create folder: ' + (err.message || 'Error'));
    }
  };

  // Replace File Safely
  const handleReplaceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAsset || !replaceFile) return;
    setIsReplacing(true);
    try {
      const res: any = await mediaApi.replaceFile(selectedAsset.id, replaceFile);
      alert('File replaced successfully! Previous version archived in version history.');
      setShowReplaceModal(false);
      setReplaceFile(null);
      if (res.asset) setSelectedAsset(res.asset);
      await fetchAssets();
      await loadStatistics();
    } catch (err: any) {
      alert('Replacement failed: ' + (err.message || 'Error'));
    } finally {
      setIsReplacing(false);
    }
  };

  // Transform Image (Rotate & WebP optimization)
  const handleTransformImage = async () => {
    if (!selectedAsset) return;
    setIsSavingImage(true);
    try {
      const res: any = await mediaApi.editImage(selectedAsset.id, {
        rotate: imageRotation,
        format: imageFormat,
        saveAsNew: saveAsNewImage,
      });
      alert(saveAsNewImage ? 'Saved as new optimized media asset!' : 'Image optimized and updated!');
      setShowImageEditor(false);
      setImageRotation(0);
      if (res.asset) setSelectedAsset(res.asset);
      await fetchAssets();
      await loadStatistics();
    } catch (err: any) {
      alert('Image transformation failed: ' + (err.message || 'Error'));
    } finally {
      setIsSavingImage(false);
    }
  };

  // Delete Single Asset
  const handleDeleteAsset = async (asset: MediaAsset) => {
    if (asset.usageCount && asset.usageCount > 0) {
      if (
        !confirm(
          `WARNING: This file is currently used in ${asset.usageCount} website location(s). Deleting it may break images on your live site.\n\nDo you still wish to permanently delete it?`
        )
      ) {
        return;
      }
    } else {
      if (!confirm(`Are you sure you want to permanently delete "${asset.originalName}"?`)) {
        return;
      }
    }

    try {
      await mediaApi.delete(asset.id, true);
      if (selectedAsset?.id === asset.id) setSelectedAsset(null);
      await fetchAssets();
      await loadStatistics();
    } catch (err: any) {
      alert('Delete failed: ' + (err.message || 'Error'));
    }
  };

  // Bulk Action Execution
  const handleExecuteBulkAction = async () => {
    if (selectedAssetIds.length === 0) return;
    if (!bulkAction) return;

    if (bulkAction === 'delete') {
      if (
        !confirm(
          `Are you sure you want to permanently delete all ${selectedAssetIds.length} selected assets?`
        )
      ) {
        return;
      }
    }

    try {
      await mediaApi.bulkAction({
        action: bulkAction as any,
        assetIds: selectedAssetIds,
        targetFolderId: targetMoveFolderId || undefined,
      });
      setSelectedAssetIds([]);
      setBulkAction('');
      setTargetMoveFolderId('');
      await fetchAssets();
      await loadStatistics();
      await loadFolders();
      alert('Bulk action executed successfully!');
    } catch (err: any) {
      alert('Bulk action failed: ' + (err.message || 'Error'));
    }
  };

  const copyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <AdminLayout>
      <div
        className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6"
        onDragEnter={handleDrag}
      >
        {/* Drag and Drop Full Screen Overlay */}
        {dragActive && (
          <div
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className="fixed inset-0 z-50 bg-[#071A22]/90 backdrop-blur-md border-4 border-dashed border-teal-400 flex flex-col items-center justify-center pointer-events-auto"
          >
            <div className="p-6 rounded-3xl bg-[#0B2530] border border-teal-500/30 text-center space-y-3">
              <Upload className="w-16 h-16 text-teal-400 mx-auto animate-bounce" />
              <h2 className="text-xl font-black text-white">Drop Files Here to Upload</h2>
              <p className="text-xs text-slate-300">
                Supports Images, Videos, PDFs, Word, Excel, and SVG assets
              </p>
            </div>
          </div>
        )}

        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-teal-500/10 border border-teal-500/25 text-teal-600 dark:text-teal-400">
                <ImageIcon className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
                  Digital Asset Management (DAM)
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-teal-500/15 text-teal-700 dark:text-teal-300 border border-teal-500/30">
                    {totalCount} Assets
                  </span>
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Enterprise media vault, folder organization, image optimization &amp; centralized website asset sync
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <input
              type="file"
              ref={fileInputRef}
              multiple
              className="hidden"
              onChange={(e) => handleUploadFiles(e.target.files)}
            />

            <button
              onClick={() => setShowFolderModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-[#0B2530] border border-slate-300 dark:border-teal-500/20 text-slate-700 dark:text-slate-300 hover:text-teal-600 dark:hover:text-white hover:border-teal-500/40 text-xs font-semibold transition-all cursor-pointer shadow-sm"
            >
              <FolderPlus size={14} className="text-teal-600 dark:text-teal-400" />
              <span>Create Folder</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold transition-all cursor-pointer shadow-md disabled:opacity-50"
            >
              <Upload size={14} />
              <span>{isUploading ? 'Uploading...' : 'Upload Media'}</span>
            </button>

            <button
              onClick={() => {
                fetchAssets();
                loadStatistics();
              }}
              className="p-2 rounded-xl bg-white dark:bg-[#0B2530] border border-slate-300 dark:border-teal-500/20 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-teal-500/40 transition-colors cursor-pointer shadow-sm"
              title="Refresh"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin text-teal-600 dark:text-teal-400' : ''} />
            </button>
          </div>
        </div>

        {/* Upload Progress Banner */}
        {isUploading && (
          <div className="p-3 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-between text-xs text-teal-700 dark:text-teal-300">
            <div className="flex items-center gap-2">
              <RefreshCw size={14} className="animate-spin text-teal-600 dark:text-teal-400" />
              <span>Processing and optimizing uploaded files...</span>
            </div>
            <span className="font-mono font-bold">{uploadProgress}%</span>
          </div>
        )}

        {/* Statistics Metric Cards Bar */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { label: 'Total Files', value: stats.totalAssets, sub: formatBytes(stats.totalStorageBytes), color: 'text-slate-900 dark:text-white' },
              { label: 'Images', value: stats.imageCount, sub: formatBytes(stats.storageBreakdown.images), color: 'text-cyan-600 dark:text-cyan-400' },
              { label: 'Videos', value: stats.videoCount, sub: formatBytes(stats.storageBreakdown.videos), color: 'text-purple-600 dark:text-purple-400' },
              { label: 'Documents', value: stats.documentCount, sub: formatBytes(stats.storageBreakdown.documents), color: 'text-amber-600 dark:text-amber-400' },
              { label: 'Unused Assets', value: stats.unusedCount, sub: 'Safe to cleanup', color: 'text-rose-600 dark:text-rose-400' },
              { label: 'Total Folders', value: stats.totalFolders, sub: 'Organized taxonomy', color: 'text-teal-600 dark:text-teal-400' },
            ].map((stat, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-white/90 dark:bg-[#0B2530]/70 border border-slate-200 dark:border-teal-500/15 flex flex-col justify-between shadow-sm"
              >
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                  {stat.label}
                </span>
                <span className={`text-2xl font-black ${stat.color} block my-0.5`}>
                  {stat.value}
                </span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium truncate">
                  {stat.sub}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Main Toolbar & Filter Bar */}
        <div className="bg-white/90 dark:bg-[#0B2530]/80 border border-slate-200 dark:border-teal-500/15 rounded-2xl p-3.5 space-y-3 shadow-md dark:shadow-none">
          <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-2.5 items-center">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by filename, ALT text, description, or title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-[#071A22] border border-slate-300 dark:border-teal-500/20 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-colors"
              />
            </div>

            {/* Folder Dropdown */}
            <select
              value={selectedFolderId}
              onChange={(e) => {
                setSelectedFolderId(e.target.value);
                setPage(1);
              }}
              className="w-full md:w-auto px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#071A22] border border-slate-300 dark:border-teal-500/20 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-teal-500 cursor-pointer"
            >
              <option value="all">All Folders ({folders.length})</option>
              {folders.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name} ({f.assetCount || 0})
                </option>
              ))}
            </select>

            {/* Media Type Dropdown */}
            <select
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value);
                setPage(1);
              }}
              className="w-full md:w-auto px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#071A22] border border-slate-300 dark:border-teal-500/20 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-teal-500 cursor-pointer"
            >
              <option value="all">All File Types</option>
              <option value="image">Images (PNG, JPG, WEBP, SVG)</option>
              <option value="video">Videos (MP4, WEBM)</option>
              <option value="document">Documents (PDF, Office)</option>
            </select>

            {/* Sort Dropdown */}
            <select
              value={sortOption}
              onChange={(e) => {
                setSortOption(e.target.value);
                setPage(1);
              }}
              className="w-full md:w-auto px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#071A22] border border-slate-300 dark:border-teal-500/20 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-teal-500 cursor-pointer"
            >
              <option value="newest">Newest Uploaded</option>
              <option value="oldest">Oldest Uploaded</option>
              <option value="name_asc">Name (A-Z)</option>
              <option value="name_desc">Name (Z-A)</option>
              <option value="size_desc">Largest Size</option>
              <option value="size_asc">Smallest Size</option>
            </select>

            {/* Unused filter toggle */}
            <button
              type="button"
              onClick={() => setUnusedOnly(!unusedOnly)}
              className={`w-full md:w-auto px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer border ${unusedOnly
                  ? 'bg-rose-500/20 border-rose-500 text-rose-600 dark:text-rose-300'
                  : 'bg-slate-50 dark:bg-[#071A22] border-slate-300 dark:border-teal-500/20 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
            >
              Unused Only
            </button>

            {/* Grid / List Toggle */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-[#071A22] p-1 rounded-xl border border-slate-300 dark:border-teal-500/20">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${viewMode === 'grid' ? 'bg-teal-500 text-slate-950 font-bold' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
                  }`}
                title="Grid View"
              >
                <Grid size={14} />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${viewMode === 'list' ? 'bg-teal-500 text-slate-950 font-bold' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
                  }`}
                title="List View"
              >
                <List size={14} />
              </button>
            </div>
          </form>

          {/* Bulk Selection Operations Row */}
          {selectedAssetIds.length > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200 dark:border-teal-500/15 text-xs">
              <span className="font-bold text-teal-600 dark:text-teal-300">
                {selectedAssetIds.length} asset(s) selected
              </span>

              <div className="flex items-center gap-2 flex-wrap">
                <select
                  value={bulkAction}
                  onChange={(e) => setBulkAction(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-[#071A22] border border-slate-300 dark:border-teal-500/20 text-slate-800 dark:text-white focus:outline-none"
                >
                  <option value="">Choose Bulk Action...</option>
                  <option value="move">Move to Folder</option>
                  <option value="archive">Archive Assets</option>
                  <option value="delete">Delete Permanently</option>
                </select>

                {bulkAction === 'move' && (
                  <select
                    value={targetMoveFolderId}
                    onChange={(e) => setTargetMoveFolderId(e.target.value)}
                    className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-[#071A22] border border-slate-300 dark:border-teal-500/20 text-slate-800 dark:text-white focus:outline-none"
                  >
                    <option value="">Select Target Folder...</option>
                    {folders.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name}
                      </option>
                    ))}
                  </select>
                )}

                <button
                  type="button"
                  disabled={!bulkAction || (bulkAction === 'move' && !targetMoveFolderId)}
                  onClick={handleExecuteBulkAction}
                  className="px-3.5 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold disabled:opacity-40 cursor-pointer"
                >
                  Apply Action
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedAssetIds([])}
                  className="px-2.5 py-1.5 rounded-xl border border-slate-300 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                >
                  Deselect All
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Master Layout: Left Media Grid/List + Right Details Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Display Area (8 cols on large screens, or 12 if no selection) */}
          <div className={`${selectedAsset ? 'lg:col-span-8' : 'lg:col-span-12'} space-y-4`}>
            {loading && assets.length === 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-44 rounded-2xl bg-black/5 dark:bg-white/5 border border-slate-200 dark:border-teal-500/10 animate-pulse"
                  />
                ))}
              </div>
            ) : assets.length === 0 ? (
              <div className="p-16 rounded-3xl bg-white/90 dark:bg-[#0B2530]/60 border border-slate-200 dark:border-teal-500/15 text-center text-slate-500 dark:text-slate-400 text-xs space-y-3">
                <ImageIcon className="w-12 h-12 text-slate-400 dark:text-slate-600 mx-auto" />
                <p className="font-semibold text-slate-700 dark:text-slate-300">No media assets found</p>
                <p className="text-slate-400 dark:text-slate-500 max-w-sm mx-auto">
                  Drag and drop files here or click "Upload Media" to add your high-resolution images, brand vectors, videos, and PDFs.
                </p>
              </div>
            ) : viewMode === 'grid' ? (
              /* GRID VIEW */
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
                {assets.map((asset) => {
                  const isSelected = selectedAsset?.id === asset.id;
                  const isChecked = selectedAssetIds.includes(asset.id);
                  const isImage = asset.mimeType?.startsWith('image/');
                  const isVideo = asset.mimeType?.startsWith('video/');

                  return (
                    <div
                      key={asset.id}
                      onClick={() => handleSelectAsset(asset)}
                      className={`group relative rounded-2xl border p-2.5 cursor-pointer transition-all flex flex-col justify-between ${isSelected
                          ? 'border-teal-500 bg-teal-500/15 shadow-xl ring-2 ring-teal-500'
                          : 'border-slate-200 dark:border-teal-500/10 bg-white dark:bg-[#0B2530]/70 hover:border-teal-500/30'
                        }`}
                    >
                      {/* Selection Checkbox */}
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedAssetIds((prev) =>
                            prev.includes(asset.id)
                              ? prev.filter((id) => id !== asset.id)
                              : [...prev, asset.id]
                          );
                        }}
                        className={`absolute top-3.5 left-3.5 z-10 w-4 h-4 rounded border transition-colors flex items-center justify-center cursor-pointer ${isChecked
                            ? 'bg-teal-500 border-teal-500 text-slate-950'
                            : 'bg-black/40 border-white/30 text-transparent opacity-0 group-hover:opacity-100'
                          }`}
                      >
                        <Check size={11} strokeWidth={3} />
                      </div>

                      {/* Usage Count Badge */}
                      {asset.usageCount && asset.usageCount > 0 ? (
                        <span className="absolute top-3.5 right-3.5 z-10 text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-teal-500 text-slate-950 backdrop-blur">
                          {asset.usageCount} in use
                        </span>
                      ) : null}

                      {/* Preview Container */}
                      <div className="w-full h-32 rounded-xl overflow-hidden bg-slate-100 dark:bg-black/40 border border-slate-200 dark:border-transparent flex items-center justify-center relative">
                        {isImage ? (
                          <img
                            src={asset.thumbnailUrl || asset.storageLocation}
                            alt={asset.altText || asset.originalName}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                            onError={(e) => {
                              // If thumbnail or port fails, fall back to direct storageLocation or /uploads
                              const target = e.currentTarget;
                              if (asset.storageLocation && target.src !== asset.storageLocation) {
                                target.src = asset.storageLocation;
                              } else {
                                const filename = asset.filename || asset.originalName;
                                target.src = `/uploads/media/${filename}`;
                              }
                            }}
                          />
                        ) : isVideo ? (
                          <Film size={32} className="text-purple-500 dark:text-purple-400" />
                        ) : (
                          <FileText size={32} className="text-amber-500 dark:text-amber-400" />
                        )}

                        <span className="absolute bottom-1.5 left-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded bg-black/70 text-white">
                          {asset.mimeType?.split('/')[1]?.toUpperCase() || 'FILE'}
                        </span>
                      </div>

                      {/* Card Content */}
                      <div className="pt-2 px-1">
                        <p
                          className="text-xs font-bold text-slate-900 dark:text-white truncate"
                          title={asset.originalName}
                        >
                          {asset.originalName}
                        </p>
                        <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                          <span>{asset.folder || 'Unsorted'}</span>
                          <span>{formatBytes(asset.size)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* LIST VIEW */
              <div className="bg-white dark:bg-[#0B2530]/70 border border-slate-200 dark:border-teal-500/15 rounded-3xl overflow-hidden shadow-xl">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-[#071A22] border-b border-teal-500/15 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    <tr>
                      <th className="p-3 w-10"></th>
                      <th className="p-3">File Name</th>
                      <th className="p-3">Folder</th>
                      <th className="p-3">Type</th>
                      <th className="p-3">Size</th>
                      <th className="p-3">Usage</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-teal-500/10">
                    {assets.map((asset) => {
                      const isSelected = selectedAsset?.id === asset.id;
                      const isChecked = selectedAssetIds.includes(asset.id);
                      return (
                        <tr
                          key={asset.id}
                          onClick={() => handleSelectAsset(asset)}
                          className={`hover:bg-teal-500/5 cursor-pointer transition-colors ${isSelected ? 'bg-teal-500/10' : ''
                            }`}
                        >
                          <td className="p-3" onClick={(e) => e.stopPropagation()}>
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() =>
                                setSelectedAssetIds((prev) =>
                                  prev.includes(asset.id)
                                    ? prev.filter((id) => id !== asset.id)
                                    : [...prev, asset.id]
                                )
                              }
                              className="rounded border-teal-500/30 text-teal-500"
                            />
                          </td>
                          <td className="p-3 font-semibold text-white flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg overflow-hidden bg-black/40 flex items-center justify-center shrink-0">
                              {asset.mimeType?.startsWith('image/') ? (
                                <img
                                  src={asset.thumbnailUrl || asset.storageLocation}
                                  alt=""
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <FileText size={16} className="text-teal-400" />
                              )}
                            </div>
                            <span className="truncate max-w-xs">{asset.originalName}</span>
                          </td>
                          <td className="p-3">{asset.folder || 'Unsorted'}</td>
                          <td className="p-3 uppercase text-[10px] text-teal-400 font-mono">
                            {asset.mimeType?.split('/')[1] || 'FILE'}
                          </td>
                          <td className="p-3 font-mono">{formatBytes(asset.size)}</td>
                          <td className="p-3">
                            {asset.usageCount && asset.usageCount > 0 ? (
                              <span className="px-2 py-0.5 rounded-full bg-teal-500/15 text-teal-300 font-bold text-[10px]">
                                {asset.usageCount} location(s)
                              </span>
                            ) : (
                              <span className="text-slate-500 text-[10px]">Unused</span>
                            )}
                          </td>
                          <td className="p-3 text-right" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => copyUrl(asset.storageLocation || asset.url, asset.id)}
                              className="p-1 text-slate-400 hover:text-white cursor-pointer mr-2"
                              title="Copy Public URL"
                            >
                              {copiedId === asset.id ? (
                                <Check size={14} className="text-emerald-400" />
                              ) : (
                                <Copy size={14} />
                              )}
                            </button>
                            <button
                              onClick={() => handleDeleteAsset(asset)}
                              className="p-1 text-slate-400 hover:text-rose-400 cursor-pointer"
                              title="Delete Asset"
                            >
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between p-3 rounded-2xl bg-[#0B2530]/70 border border-teal-500/15 text-xs text-slate-300">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="px-3 py-1.5 rounded-lg bg-[#071A22] border border-teal-500/20 disabled:opacity-40 cursor-pointer"
                >
                  Previous
                </button>
                <span className="font-mono text-slate-400">
                  Page {page} of {totalPages} ({totalCount} items)
                </span>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="px-3 py-1.5 rounded-lg bg-[#071A22] border border-teal-500/20 disabled:opacity-40 cursor-pointer"
                >
                  Next
                </button>
              </div>
            )}
          </div>

          {/* Right Column: Asset Details, SEO Metadata, Image Tools & Usages */}
          {selectedAsset && (
            <div className="lg:col-span-4 bg-[#0B2530]/80 border border-teal-500/20 rounded-3xl p-5 space-y-5 backdrop-blur-xl shadow-xl">
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-teal-500/15">
                <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                  <Sliders size={16} className="text-teal-400" />
                  <span>Asset Inspector</span>
                </h3>
                <button
                  onClick={() => setSelectedAsset(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Large Media Preview */}
              <div className="w-full h-48 rounded-2xl bg-black/60 overflow-hidden border border-teal-500/20 flex items-center justify-center relative group">
                {selectedAsset.mimeType?.startsWith('image/') ? (
                  <img
                    src={selectedAsset.storageLocation || selectedAsset.url}
                    alt={selectedAsset.altText || ''}
                    className="w-full h-full object-contain"
                  />
                ) : selectedAsset.mimeType?.startsWith('video/') ? (
                  <video
                    src={selectedAsset.storageLocation || selectedAsset.url}
                    controls
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <FileText size={48} className="text-teal-400" />
                )}

                <div className="absolute bottom-2 right-2 flex items-center gap-1.5 opacity-90">
                  <button
                    onClick={() => copyUrl(selectedAsset.storageLocation || selectedAsset.url, 'previewUrl')}
                    className="px-2.5 py-1 rounded-lg bg-[#071A22]/90 border border-teal-500/30 text-teal-300 font-mono text-[10px] flex items-center gap-1 cursor-pointer hover:bg-teal-500 hover:text-slate-950 transition-colors"
                  >
                    {copiedId === 'previewUrl' ? <Check size={11} /> : <Copy size={11} />}
                    <span>Copy URL</span>
                  </button>
                </div>
              </div>

              {/* Action Buttons: Replace & Image Editor */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setShowReplaceModal(true)}
                  className="px-3 py-2 rounded-xl bg-[#071A22] border border-teal-500/20 text-slate-200 hover:text-white hover:border-teal-500/40 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RefreshCw size={12} className="text-cyan-400" />
                  <span>Replace File</span>
                </button>

                {selectedAsset.mimeType?.startsWith('image/') &&
                  selectedAsset.mimeType !== 'image/svg+xml' && (
                    <button
                      onClick={() => setShowImageEditor(true)}
                      className="px-3 py-2 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-300 hover:bg-teal-500/20 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <RotateCw size={12} />
                      <span>Optimize / Edit</span>
                    </button>
                  )}
              </div>

              {/* Metadata & SEO Form */}
              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Display Title
                  </label>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl bg-[#071A22] border border-teal-500/20 text-white focus:outline-none focus:border-teal-400 text-xs"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Alternative Text (ALT)
                  </label>
                  <input
                    type="text"
                    value={editAltText}
                    onChange={(e) => setEditAltText(e.target.value)}
                    placeholder="Describe image for accessibility & SEO..."
                    className="w-full px-3 py-1.5 rounded-xl bg-[#071A22] border border-teal-500/20 text-white focus:outline-none focus:border-teal-400 text-xs"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Folder Taxonomy
                  </label>
                  <select
                    value={editFolderId}
                    onChange={(e) => setEditFolderId(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl bg-[#071A22] border border-teal-500/20 text-white focus:outline-none focus:border-teal-400 text-xs cursor-pointer"
                  >
                    <option value="">Unsorted</option>
                    {folders.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Caption / Description
                  </label>
                  <textarea
                    rows={2}
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl bg-[#071A22] border border-teal-500/20 text-white focus:outline-none focus:border-teal-400 text-xs resize-none"
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    disabled={isSavingDetails}
                    onClick={handleSaveDetails}
                    className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs disabled:opacity-40 cursor-pointer shadow-md"
                  >
                    {isSavingDetails ? 'Saving...' : 'Save Asset Metadata'}
                  </button>
                </div>
              </div>

              {/* Media Usage Dependencies */}
              <div className="pt-3 border-t border-teal-500/15 space-y-2 text-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Active Website Usages ({selectedAsset.mediausage?.length || 0})
                </span>

                {selectedAsset.mediausage && selectedAsset.mediausage.length > 0 ? (
                  <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1 custom-scrollbar">
                    {selectedAsset.mediausage.map((u) => (
                      <div
                        key={u.id}
                        className="p-2 rounded-xl bg-[#071A22] border border-teal-500/10 text-[11px] flex items-center justify-between"
                      >
                        <span className="text-teal-300 font-medium">
                          {u.location || 'Website Section'}
                        </span>
                        <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded bg-white/5 text-slate-400">
                          {u.contentType}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-teal-500/5 border border-teal-500/10 text-[11px] text-slate-400">
                    Not currently referenced by any live section.
                  </div>
                )}
              </div>

              {/* Danger Zone: Delete */}
              <div className="pt-3 border-t border-teal-500/15">
                <button
                  type="button"
                  onClick={() => handleDeleteAsset(selectedAsset)}
                  className="w-full py-2 rounded-xl border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Trash2 size={13} />
                  <span>Delete Media Asset</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* MODAL: Create Folder */}
        {showFolderModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
            <div className="bg-[#0B2530] border border-teal-500/30 rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-teal-500/15 pb-3">
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  <FolderPlus size={16} className="text-teal-400" />
                  <span>Create Media Folder</span>
                </h3>
                <button
                  onClick={() => setShowFolderModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleCreateFolder} className="space-y-4 text-xs">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Folder Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Testimonials, Whitepapers, Logos..."
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#071A22] border border-teal-500/20 text-white focus:outline-none focus:border-teal-400"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowFolderModal(false)}
                    className="px-4 py-2 rounded-xl bg-[#071A22] border border-teal-500/20 text-slate-300 hover:text-white font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!newFolderName.trim()}
                    className="px-5 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold disabled:opacity-40 cursor-pointer shadow-md"
                  >
                    Create Folder
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: Safe File Replacement */}
        {showReplaceModal && selectedAsset && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
            <div className="bg-[#0B2530] border border-teal-500/30 rounded-3xl p-6 w-full max-w-lg shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-teal-500/15 pb-3">
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  <RefreshCw size={16} className="text-teal-400" />
                  <span>Replace Asset: {selectedAsset.originalName}</span>
                </h3>
                <button
                  onClick={() => setShowReplaceModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleReplaceSubmit} className="space-y-4 text-xs">
                <div className="p-3.5 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-300 space-y-1">
                  <p className="font-bold flex items-center gap-1.5">
                    <Info size={14} />
                    <span>Safe Replacement Guarantee</span>
                  </p>
                  <p className="text-[11px] text-slate-300">
                    The current file will be backed up into the version archive. All{' '}
                    <strong>{selectedAsset.usageCount || 0} active website section(s)</strong> will automatically display the replacement file without breaking page layouts.
                  </p>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Select Replacement File
                  </label>
                  <input
                    type="file"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setReplaceFile(e.target.files[0]);
                      }
                    }}
                    className="w-full text-slate-300 text-xs file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-teal-500 file:text-slate-950 hover:file:bg-teal-400 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowReplaceModal(false)}
                    className="px-4 py-2 rounded-xl bg-[#071A22] border border-teal-500/20 text-slate-300 hover:text-white font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!replaceFile || isReplacing}
                    className="px-5 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold disabled:opacity-40 cursor-pointer shadow-md flex items-center gap-1.5"
                  >
                    {isReplacing ? 'Replacing...' : 'Confirm Safe Replacement'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: In-browser Image Optimizer & Transformer */}
        {showImageEditor && selectedAsset && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
            <div className="bg-[#0B2530] border border-teal-500/30 rounded-3xl p-6 w-full max-w-lg shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-teal-500/15 pb-3">
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  <RotateCw size={16} className="text-teal-400" />
                  <span>Image Optimizer & Transformer</span>
                </h3>
                <button
                  onClick={() => setShowImageEditor(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-4 text-xs">
                {/* Live Rotation Controls */}
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Rotate Image
                  </label>
                  <div className="flex items-center gap-2">
                    {[0, 90, 180, 270].map((deg) => (
                      <button
                        key={deg}
                        type="button"
                        onClick={() => setImageRotation(deg)}
                        className={`flex-1 py-1.5 rounded-xl border text-xs font-semibold cursor-pointer ${imageRotation === deg
                            ? 'bg-teal-500 text-slate-950 border-teal-500 font-bold'
                            : 'bg-[#071A22] border-teal-500/20 text-slate-300'
                          }`}
                      >
                        {deg}°
                      </button>
                    ))}
                  </div>
                </div>

                {/* Conversion Format */}
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Optimization Format
                  </label>
                  <select
                    value={imageFormat}
                    onChange={(e) => setImageFormat(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#071A22] border border-teal-500/20 text-white focus:outline-none cursor-pointer"
                  >
                    <option value="webp">Convert to WebP (Recommended - 60% smaller size)</option>
                    <option value="jpeg">Convert to JPEG</option>
                    <option value="png">Convert to PNG</option>
                    <option value="preserve">Preserve Original Format</option>
                  </select>
                </div>

                {/* Save choice */}
                <div className="p-3 rounded-2xl bg-[#071A22] border border-teal-500/15 space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-200">
                    <input
                      type="checkbox"
                      checked={saveAsNewImage}
                      onChange={(e) => setSaveAsNewImage(e.target.checked)}
                      className="rounded border-teal-500 text-teal-500"
                    />
                    <span>Save as new separate asset (preserve original)</span>
                  </label>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-teal-500/15">
                  <button
                    type="button"
                    onClick={() => setShowImageEditor(false)}
                    className="px-4 py-2 rounded-xl bg-[#071A22] border border-teal-500/20 text-slate-300 hover:text-white font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={isSavingImage}
                    onClick={handleTransformImage}
                    className="px-5 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold disabled:opacity-40 cursor-pointer shadow-md"
                  >
                    {isSavingImage ? 'Processing...' : 'Apply & Save'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default MediaLibraryPage;
