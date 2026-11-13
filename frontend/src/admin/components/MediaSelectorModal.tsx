import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  Search,
  Upload,
  Folder,
  X,
  Check,
  Image as ImageIcon,
  Film,
  FileText,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import { mediaApi, MediaAsset, MediaFolder } from '../../api/media';

interface MediaSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (asset: MediaAsset) => void;
  title?: string;
  allowedTypes?: 'all' | 'image' | 'video' | 'document';
  currentValue?: string;
}

export function MediaSelectorModal({
  isOpen,
  onClose,
  onSelect,
  title = 'Select Media Asset',
  allowedTypes = 'all',
  currentValue,
}: MediaSelectorModalProps) {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [folders, setFolders] = useState<MediaFolder[]>([]);
  const [selectedFolderId, setSelectedFolderId] = useState<string>('all');
  const [selectedAsset, setSelectedAsset] = useState<MediaAsset | null>(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadFolders();
      loadAssets();
    }
  }, [isOpen, selectedFolderId, search, allowedTypes]);

  const loadFolders = async () => {
    try {
      const data = await mediaApi.getFolders();
      setFolders(data || []);
    } catch (e) {}
  };

  const loadAssets = async () => {
    setLoading(true);
    try {
      const params: any = {
        folderId: selectedFolderId !== 'all' ? selectedFolderId : undefined,
        type: allowedTypes !== 'all' ? allowedTypes : undefined,
        search: search.trim() || undefined,
        limit: 50,
      };
      const res: any = await mediaApi.getAll(params);
      const list = res.assets || [];
      setAssets(list);

      // Pre-select current value if matches
      if (currentValue) {
        const match = list.find((a: MediaAsset) => a.storageLocation === currentValue || a.url === currentValue);
        if (match) setSelectedAsset(match);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const fileList = Array.from(files);
      const res: any = await mediaApi.uploadFiles(
        fileList,
        selectedFolderId !== 'all' ? selectedFolderId : undefined
      );
      if (res.assets && res.assets.length > 0) {
        setSelectedAsset(res.assets[0]);
      }
      await loadAssets();
    } catch (err: any) {
      alert('Upload failed: ' + (err.message || 'Error'));
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-[#071A22] border border-teal-500/25 rounded-3xl w-full max-w-5xl h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-teal-500/15 bg-[#0B2530]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-teal-500/15 text-teal-400">
              <ImageIcon size={20} />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white">{title}</h2>
              <p className="text-xs text-slate-400">
                Choose an existing asset from the library or upload a new file
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <label className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold transition-all cursor-pointer shadow-sm">
              <Upload size={14} />
              <span>{uploading ? 'Uploading...' : 'Upload File'}</span>
              <input
                type="file"
                multiple
                className="hidden"
                disabled={uploading}
                onChange={(e) => handleFileUpload(e.target.files)}
              />
            </label>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="px-6 py-3 border-b border-teal-500/10 bg-[#0B2530]/60 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
            <input
              type="text"
              placeholder="Search filename or alt text..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-[#071A22] border border-teal-500/20 text-white placeholder-slate-500 focus:outline-none focus:border-teal-400 text-xs"
            />
          </div>

          {/* Folder Select */}
          <div className="flex items-center gap-2">
            <Folder size={14} className="text-teal-400" />
            <select
              value={selectedFolderId}
              onChange={(e) => setSelectedFolderId(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-[#071A22] border border-teal-500/20 text-xs text-slate-200 focus:outline-none focus:border-teal-400 cursor-pointer"
            >
              <option value="all">All Folders</option>
              {folders.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name} ({f.assetCount || 0})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Middle Body: Grid + Preview */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-12">
          {/* Asset Grid */}
          <div className="md:col-span-8 p-4 overflow-y-auto max-h-[calc(85vh-140px)] custom-scrollbar">
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="h-32 rounded-xl bg-white/5 border border-white/5 animate-pulse" />
                ))}
              </div>
            ) : assets.length === 0 ? (
              <div className="py-24 text-center text-slate-500 text-xs">
                No matching media assets found in this folder.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {assets.map((asset) => {
                  const isSelected = selectedAsset?.id === asset.id;
                  const isCurrent = currentValue && (asset.storageLocation === currentValue || asset.url === currentValue);
                  const isImage = asset.mimeType?.startsWith('image/');
                  const isVideo = asset.mimeType?.startsWith('video/');

                  return (
                    <div
                      key={asset.id}
                      onClick={() => setSelectedAsset(asset)}
                      className={`group relative rounded-2xl border p-2 cursor-pointer transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'border-teal-400 bg-teal-500/15 shadow-lg ring-2 ring-teal-400'
                          : isCurrent
                          ? 'border-cyan-500/50 bg-cyan-500/10'
                          : 'border-teal-500/10 bg-[#0B2530]/60 hover:border-teal-500/30'
                      }`}
                    >
                      <div className="w-full h-24 rounded-xl overflow-hidden bg-black/40 flex items-center justify-center relative">
                        {isImage ? (
                          <img
                            src={asset.thumbnailUrl || asset.storageLocation}
                            alt={asset.altText || asset.originalName}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                            onError={(e) => {
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
                          <Film size={28} className="text-purple-400" />
                        ) : (
                          <FileText size={28} className="text-amber-400" />
                        )}

                        {isSelected && (
                          <div className="absolute top-1.5 right-1.5 p-1 rounded-full bg-teal-400 text-slate-950 shadow-md">
                            <Check size={12} strokeWidth={3} />
                          </div>
                        )}

                        {isCurrent && !isSelected && (
                          <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded text-[9px] font-bold bg-cyan-500/80 text-white">
                            Active
                          </div>
                        )}
                      </div>

                      <div className="pt-2 px-1">
                        <p className="text-[11px] font-bold text-white truncate" title={asset.originalName}>
                          {asset.originalName}
                        </p>
                        <span className="text-[10px] text-slate-400 block font-mono">
                          {Math.round((asset.size || 0) / 1024)} KB
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Selected Preview Info Panel */}
          <div className="md:col-span-4 border-l border-teal-500/15 p-4 bg-[#0B2530]/40 flex flex-col justify-between overflow-y-auto max-h-[calc(85vh-140px)]">
            {selectedAsset ? (
              <div className="space-y-4 text-xs">
                <div className="w-full h-44 rounded-2xl bg-black/60 overflow-hidden border border-teal-500/20 flex items-center justify-center relative">
                  {selectedAsset.mimeType?.startsWith('image/') ? (
                    <img
                      src={selectedAsset.storageLocation || selectedAsset.url}
                      alt={selectedAsset.altText || ''}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <FileText size={48} className="text-teal-400" />
                  )}
                </div>

                <div className="space-y-2">
                  <h3 className="font-bold text-white text-sm break-all">{selectedAsset.originalName}</h3>
                  <div className="p-3 rounded-xl bg-[#071A22] border border-teal-500/10 space-y-1 text-slate-300 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Dimensions:</span>
                      <span>{selectedAsset.width ? `${selectedAsset.width} × ${selectedAsset.height}px` : 'Dynamic'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">File Size:</span>
                      <span>{Math.round((selectedAsset.size || 0) / 1024)} KB</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">MIME Type:</span>
                      <span className="font-mono text-[10px]">{selectedAsset.mimeType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Folder:</span>
                      <span>{selectedAsset.folder || 'Unsorted'}</span>
                    </div>
                  </div>

                  {selectedAsset.altText && (
                    <div className="p-2.5 rounded-xl bg-teal-500/5 border border-teal-500/10">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                        ALT Text
                      </span>
                      <p className="text-slate-200 text-xs">{selectedAsset.altText}</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="py-24 text-center text-slate-500 text-xs">
                Select an asset from the library to inspect its details and apply.
              </div>
            )}

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-teal-500/15 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-[#071A22] border border-teal-500/20 text-slate-300 hover:text-white text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!selectedAsset}
                onClick={() => {
                  if (selectedAsset) {
                    onSelect(selectedAsset);
                    onClose();
                  }
                }}
                className="px-5 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs disabled:opacity-40 transition-colors cursor-pointer shadow-md flex items-center gap-1.5"
              >
                <Check size={14} />
                <span>Confirm Selection</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default MediaSelectorModal;
