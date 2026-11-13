import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  RefreshCw,
  X,
  Save,
  Search,
  BookOpen,
  Sparkles,
  ExternalLink,
  Calendar,
  User,
  Image as ImageIcon,
  Upload,
  Check,
  AlertCircle,
  Clock,
  Layers,
} from 'lucide-react';
import { AdminLayout } from '../components/AdminLayout';
import { blogApi } from '../../api/blog';
import { MediaSelectorModal } from '../components/MediaSelectorModal';
import { MediaAsset } from '../../api/media';
import { BlogRichTextEditor } from '../components/BlogRichTextEditor';
import { RichArticleContent } from '../../components/RichArticleContent';
import { estimateReadTime, estimateStoredContentReadTime } from '../../utils/blogContent';

const emptyBlogMetadata = {
  focusKeyword: '',
  canonicalUrl: '',
  ogImage: '',
  imageAlt: '',
  shortDescription: '',
  allowIndex: true,
};

export function BlogManagerPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [postsError, setPostsError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Media selector modal
  const [isMediaSelectorOpen, setIsMediaSelectorOpen] = useState(false);

  // File upload state inside form
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const slugManuallyEdited = useRef(false);

  const emptyForm = {
    slug: '',
    title: '',
    excerpt: '',
    content: '',
    authorName: 'David Vance, CPA',
    authorRole: 'Managing Director, Tax Advisory',
    authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80',
    image: null as string | null,
    readTime: '1 min read',
    isFeatured: false,
    isPublished: true,
    publishedAt: new Date().toISOString(),
    metaTitle: '',
    metaDescription: '',
    metaKeywords: emptyBlogMetadata,
    categoryId: '',
    categoryName: '',
  };
  const [form, setForm] = useState<typeof emptyForm>(emptyForm);

  const fetchPosts = async () => {
    setLoading(true);
    setPostsError(null);
    try {
      const data = await blogApi.getAll(false, page, 12, searchQuery, categoryFilter);
      setPosts(data.posts || []);
      setTotal(data.total || 0);
    } catch (error) {
      console.error('Unable to load blog posts.', error);
      setPostsError('Articles could not be loaded. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await blogApi.getCategories();
      setCategories(data || []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [page, searchQuery, categoryFilter]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const openCreate = () => {
    setEditingPost(null);
    slugManuallyEdited.current = false;
    setShowPreview(false);
    setForm({
      ...emptyForm,
      categoryId: categories.length > 0 ? categories[0].id : '',
      categoryName: categories.length > 0 ? categories[0].name : 'Tax Strategy',
    });
    setImageError(null);
    setShowForm(true);
  };

  const openEdit = (post: any) => {
    setEditingPost(post);
    slugManuallyEdited.current = true;
    setShowPreview(false);
    const metadata = post.metaKeywords && typeof post.metaKeywords === 'object' && !Array.isArray(post.metaKeywords)
      ? post.metaKeywords
      : {};
    setForm({
      ...emptyForm,
      slug: post.slug || '',
      title: post.title || '',
      excerpt: post.excerpt || '',
      content: post.content || '',
      authorName: post.authorName || '',
      authorRole: post.authorRole || '',
      authorAvatar: post.authorAvatar || emptyForm.authorAvatar,
      image: post.image || null,
      readTime: post.readTime || '1 min read',
      isFeatured: Boolean(post.featured ?? post.isFeatured),
      isPublished: Boolean(post.isPublished),
      categoryId: post.categoryId || (post.blogcategory?.id || ''),
      categoryName: post.categoryName || (post.blogcategory?.name || 'Tax Strategy'),
      publishedAt: post.publishedAt || new Date().toISOString(),
      metaTitle: post.metaTitle || '',
      metaDescription: post.metaDescription || '',
      metaKeywords: { ...emptyBlogMetadata, ...metadata },
    });
    setImageError(null);
    setShowForm(true);
  };

  // Image Upload directly from PC
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Accept any image format
    const validExts = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg', '.avif', '.bmp'];
    const fileExt = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!file.type.startsWith('image/') && !validExts.includes(fileExt)) {
      setImageError('Please select a valid image file (PNG, JPG, JPEG, WEBP, GIF, SVG, etc.).');
      return;
    }

    setImageError(null);
    setUploadingImage(true);

    try {
      const res: any = await blogApi.uploadImage(file);
      if (res && res.url) {
        setForm((prev) => ({ ...prev, image: res.url }));
      }
    } catch (err: any) {
      setImageError(err.message || 'Image upload failed. Please try again.');
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = () => {
    setForm((prev) => ({ ...prev, image: null }));
    setImageError(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const autoSlug = form.slug || form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      const payload = {
        title: form.title.trim(),
        excerpt: form.excerpt.trim(),
        content: form.content,
        authorName: form.authorName.trim(),
        authorRole: form.authorRole.trim(),
        image: form.image ? form.image.trim() : null,
        readTime: estimateStoredContentReadTime(form.content),
        categoryId: form.categoryId || null,
        categoryName: form.categoryName,
        isFeatured: form.isFeatured,
        isPublished: form.isPublished,
        publishedAt: form.publishedAt ? new Date(form.publishedAt).toISOString() : new Date().toISOString(),
        metaTitle: form.metaTitle.trim() || form.title.trim(),
        metaDescription: form.metaDescription.trim() || form.excerpt.trim(),
        metaKeywords: form.metaKeywords,
        slug: autoSlug || 'article',
      };

      if (!payload.title || !payload.slug) throw new Error('Headline and slug are required.');
      if (editingPost) {
        await blogApi.update(editingPost.id, payload);
      } else {
        await blogApi.create(payload);
      }
      setShowForm(false);
      setShowPreview(false);
      fetchPosts();
    } catch (err: any) {
      alert('Failed to save article: ' + (err.message || 'Error'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this publication?')) return;
    try {
      await blogApi.delete(id);
      fetchPosts();
    } catch (err: any) {
      alert('Failed to delete: ' + (err.message || 'Error'));
    }
  };

  const togglePublish = async (post: any) => {
    try {
      await blogApi.update(post.id, {
        isPublished: !post.isPublished,
        publishedAt: !post.isPublished ? new Date().toISOString() : null,
      });
      fetchPosts();
    } catch (err: any) {
      alert('Failed to toggle status: ' + (err.message || 'Error'));
    }
  };

  return (
    <AdminLayout>
      <div className="p-5 sm:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
                <BookOpen className="w-6 h-6 text-teal-400" />
                <span>Editorial Intelligence & Blog CMS</span>
              </h1>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-teal-500/15 text-teal-300 border border-teal-500/20">
                {total} Articles
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Curate, edit, and publish verified regulatory guidance with optional featured photography and responsive card layouts
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchPosts}
              className="p-2.5 rounded-xl text-slate-400 border border-teal-500/20 hover:bg-teal-500/10 transition-all cursor-pointer shadow-sm"
              title="Refresh Articles"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin text-teal-400' : ''} />
            </button>

            <button
              onClick={openCreate}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-teal-500 hover:bg-teal-400 shadow-lg shadow-teal-500/20 transition-all cursor-pointer"
            >
              <Plus size={14} />
              <span>Compose Article</span>
            </button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 rounded-2xl bg-white/70 dark:bg-[#071A22]/70 border border-teal-500/15 backdrop-blur-xl shadow-md flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search published articles by headline or keyword..."
              value={searchQuery}
              onChange={(e) => {
                setPage(1);
                setSearchQuery(e.target.value);
              }}
              className="w-full pl-10 pr-4 py-2 bg-black/5 dark:bg-white/5 border border-teal-500/15 rounded-xl text-xs text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:border-teal-400"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => {
              setPage(1);
              setCategoryFilter(e.target.value);
            }}
            className="px-4 py-2 rounded-xl bg-black/5 dark:bg-[#071A22] border border-teal-500/15 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-teal-400 cursor-pointer"
          >
            <option value="All">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Blog Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {postsError ? (
            <div role="alert" className="col-span-full py-16 text-center text-sm text-rose-600 dark:text-rose-300">
              {postsError}
              <button type="button" onClick={fetchPosts} className="ml-2 underline">Retry</button>
            </div>
          ) : loading && posts.length === 0 ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-64 rounded-3xl bg-white/40 dark:bg-white/5 border border-teal-500/10 animate-pulse"
              />
            ))
          ) : posts.length === 0 ? (
            <div className="col-span-full py-16 text-center text-slate-500 text-xs">
              No matching publications found.
            </div>
          ) : (
            posts.map((post) => {
              const hasImage = Boolean(post.image && post.image.trim() !== '');

              return (
                <div
                  key={post.id}
                  className="bg-white/80 dark:bg-[#071A22]/80 border border-teal-500/15 rounded-3xl overflow-hidden shadow-xl backdrop-blur-xl flex flex-col justify-between group hover:border-teal-400/40 transition-all duration-300"
                >
                  <div>
                    {/* Visual Distinction: Image Header if exists */}
                    {hasImage ? (
                      <div className="w-full h-44 overflow-hidden bg-black/40 relative">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                        <span className="absolute bottom-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/70 text-teal-300 backdrop-blur border border-teal-500/30">
                          {post.blogcategory?.name || post.categoryName || 'Tax Strategy'}
                        </span>
                        <span
                          className={`absolute bottom-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            post.isPublished
                              ? 'bg-emerald-500/80 text-white'
                              : 'bg-slate-700/80 text-slate-300'
                          }`}
                        >
                          {post.isPublished ? 'Published' : 'Draft'}
                        </span>
                      </div>
                    ) : (
                      <div className="p-6 pb-0">
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-teal-500/15 text-teal-700 dark:text-teal-300 border border-teal-500/25">
                            {post.blogcategory?.name || post.categoryName || 'Tax Strategy'}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              post.isPublished
                                ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                                : 'bg-slate-500/15 text-slate-500'
                            }`}
                          >
                            {post.isPublished ? 'Published' : 'Draft'}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="p-6">
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-2 mb-2 leading-snug group-hover:text-teal-400 transition-colors">
                        {post.title}
                      </h3>

                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 mb-4 leading-relaxed">
                        {post.excerpt}
                      </p>
                    </div>
                  </div>

                  <div className="px-6 pb-5">
                    <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-3 border-t border-teal-500/10 mb-4">
                      <span>{post.authorName || 'Preferred Tax Director'}</span>
                      <span className="flex items-center gap-1">
                        <Clock size={11} />
                        {post.readTime || '5 min read'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <button
                        onClick={() => togglePublish(post)}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-300 hover:bg-teal-500/10 transition-all cursor-pointer"
                      >
                        {post.isPublished ? <EyeOff size={13} /> : <Eye size={13} />}
                        <span>{post.isPublished ? 'Unpublish' : 'Publish'}</span>
                      </button>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => openEdit(post)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-teal-400 hover:bg-teal-500/10 transition-all cursor-pointer"
                          title="Edit Article & Image"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer"
                          title="Delete Article"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
        {total > 12 && (
          <nav aria-label="Blog pages" className="flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={page === 1 || loading}
              className="rounded-lg border border-teal-500/20 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 disabled:opacity-40"
            >
              Previous
            </button>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Page {page} of {Math.ceil(total / 12)}
            </span>
            <button
              type="button"
              onClick={() => setPage((current) => Math.min(Math.ceil(total / 12), current + 1))}
              disabled={page >= Math.ceil(total / 12) || loading}
              className="rounded-lg border border-teal-500/20 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 disabled:opacity-40"
            >
              Next
            </button>
          </nav>
        )}

        {/* Modal Editor Form with Advanced Image Management */}
        {showForm && createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
            <div className="w-full max-w-6xl max-h-[94vh] bg-white dark:bg-[#071A22] border border-teal-500/30 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
              <div className="flex items-center justify-between gap-4 p-4 sm:p-5 border-b border-teal-500/15 bg-white/90 dark:bg-[#071A22]/90">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <BookOpen size={16} className="text-teal-400" />
                    <span>{editingPost ? 'Edit Blog Article' : 'Draft New Publication'}</span>
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Compose, preview, and publish an original article.</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowPreview((current) => !current)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl border border-teal-500/25 text-teal-700 dark:text-teal-200 hover:bg-teal-500/10 font-semibold text-xs cursor-pointer"
                  >
                    <Eye size={14} /> {showPreview ? 'Return to editing' : 'Preview article'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    aria-label="Close article editor"
                    className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              <form onSubmit={handleSave} style={{ display: showPreview ? 'none' : undefined }} className="p-4 sm:p-6 overflow-y-auto space-y-5 custom-scrollbar text-xs">
                {/* 1. FEATURED IMAGE UPLOAD & PREVIEW SECTION */}
                <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-teal-500/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="font-bold text-slate-800 dark:text-white block">
                        Featured Header Image (Optional)
                      </label>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        When present, the card and detail view render with a prominent full-width cover. If omitted, the layout automatically shifts upward into a clean editorial typographic design.
                      </p>
                    </div>

                    {form.image && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
                        Cover Attached
                      </span>
                    )}
                  </div>

                  {/* Hidden file input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageFileChange}
                  />

                  {form.image ? (
                    /* Existing / Selected Image Preview */
                    <div className="space-y-2">
                      <div className="w-full h-44 rounded-xl overflow-hidden bg-black/50 border border-teal-500/30 relative group">
                        <img
                          src={form.image}
                          alt="Featured Preview"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="px-3 py-1.5 rounded-xl bg-teal-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
                          >
                            <Upload size={12} />
                            <span>Replace</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setIsMediaSelectorOpen(true)}
                            className="px-3 py-1.5 rounded-xl bg-[#071A22] border border-teal-500/40 text-teal-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
                          >
                            <Layers size={12} />
                            <span>From Vault</span>
                          </button>
                          <button
                            type="button"
                            onClick={handleRemoveImage}
                            className="px-3 py-1.5 rounded-xl bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
                          >
                            <Trash2 size={12} />
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span className="truncate max-w-sm font-mono text-[10px] text-teal-300">
                          {form.image}
                        </span>
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="text-rose-400 hover:underline font-semibold cursor-pointer"
                        >
                          Remove Image
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Empty Upload State */
                    <div className="border border-dashed border-teal-500/30 rounded-xl p-5 text-center space-y-3 bg-teal-500/5">
                      <div className="w-10 h-10 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center mx-auto">
                        <ImageIcon size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 dark:text-white text-xs">
                          {uploadingImage ? 'Uploading & Processing Image...' : 'No featured image selected'}
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          JPG, JPEG, PNG, or WEBP (Any image size supported)
                        </p>
                      </div>

                      <div className="flex items-center justify-center gap-2 pt-1">
                        <button
                          type="button"
                          disabled={uploadingImage}
                          onClick={() => fileInputRef.current?.click()}
                          className="px-3.5 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm disabled:opacity-50"
                        >
                          <Upload size={12} />
                          <span>{uploadingImage ? 'Uploading...' : 'Upload from PC'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setIsMediaSelectorOpen(true)}
                          className="px-3.5 py-1.5 rounded-xl bg-black/5 dark:bg-white/10 hover:bg-teal-500/15 border border-teal-500/25 text-teal-600 dark:text-teal-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                        >
                          <Layers size={12} />
                          <span>Choose from Media Vault</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {imageError && (
                    <div className="p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-[11px] flex items-center gap-2">
                      <AlertCircle size={14} className="shrink-0" />
                      <span>{imageError}</span>
                    </div>
                  )}
                </div>

                <section className="rounded-2xl border border-teal-500/15 bg-black/[0.025] dark:bg-white/[0.025] p-4 sm:p-5 space-y-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[.16em] text-teal-600 dark:text-teal-300">Section A · Blog information</p>
                    <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">Core details displayed on the public article page.</p>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Blog headline</label>
                    <input
                      type="text"
                      required
                      value={form.title}
                      onChange={(e) => setForm((current) => ({
                        ...current,
                        title: e.target.value,
                        slug: slugManuallyEdited.current
                          ? current.slug
                          : e.target.value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
                      }))}
                      className="w-full px-3.5 py-3 rounded-xl bg-white dark:bg-[#06171D] border border-teal-500/20 text-slate-900 dark:text-white focus:outline-none focus:border-teal-400 text-sm font-semibold"
                      placeholder="A clear, specific article headline"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Blog slug</label>
                      <div className="flex items-center rounded-xl border border-teal-500/20 bg-white dark:bg-[#06171D] focus-within:border-teal-400">
                        <span className="pl-3 text-[10px] text-slate-400 whitespace-nowrap">/blog/</span>
                        <input
                          type="text"
                          required
                          value={form.slug}
                          onChange={(e) => {
                            slugManuallyEdited.current = true;
                            setForm({ ...form, slug: e.target.value.toLowerCase().trim().replace(/[^a-z0-9-]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') });
                          }}
                          className="w-full min-w-0 px-2 py-2.5 bg-transparent text-slate-900 dark:text-white outline-none font-mono text-xs"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Category</label>
                      <select
                        value={form.categoryId || ''}
                        onChange={(e) => {
                          const selected = categories.find((category) => category.id === e.target.value);
                          setForm({ ...form, categoryId: e.target.value, categoryName: selected?.name || form.categoryName });
                        }}
                        className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-[#06171D] border border-teal-500/20 text-slate-900 dark:text-white focus:outline-none focus:border-teal-400"
                      >
                        {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Author name</label>
                      <input value={form.authorName} onChange={(e) => setForm({ ...form, authorName: e.target.value })} className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-[#06171D] border border-teal-500/20 text-slate-900 dark:text-white" />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Author role</label>
                      <input value={form.authorRole} onChange={(e) => setForm({ ...form, authorRole: e.target.value })} className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-[#06171D] border border-teal-500/20 text-slate-900 dark:text-white" />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Publication date</label>
                      <input
                        type="date"
                        value={form.publishedAt ? new Date(form.publishedAt).toISOString().slice(0, 10) : ''}
                        onChange={(e) => setForm({ ...form, publishedAt: e.target.value ? new Date(`${e.target.value}T12:00:00`).toISOString() : '' })}
                        className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-[#06171D] border border-teal-500/20 text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Estimated read time</label>
                      <input readOnly value={estimateStoredContentReadTime(form.content)} className="w-full px-3 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-teal-500/15 text-slate-500 dark:text-slate-300" />
                    </div>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Featured image alt text</label>
                    <input
                      value={form.metaKeywords.imageAlt}
                      onChange={(e) => setForm({ ...form, metaKeywords: { ...form.metaKeywords, imageAlt: e.target.value } })}
                      className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-[#06171D] border border-teal-500/20 text-slate-900 dark:text-white"
                      placeholder={form.title || 'Describe the featured image for accessibility'}
                    />
                  </div>
                </section>

                <section className="rounded-2xl border border-teal-500/15 bg-black/[0.025] dark:bg-white/[0.025] p-4 sm:p-5 space-y-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[.16em] text-teal-600 dark:text-teal-300">Section B · Blog summary</p>
                    <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">A concise editorial overview for article cards and search previews.</p>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Executive summary</label>
                    <textarea
                      rows={3}
                      required
                      value={form.excerpt}
                      onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                      className="w-full px-3.5 py-3 rounded-xl bg-white dark:bg-[#06171D] border border-teal-500/20 text-slate-900 dark:text-white focus:outline-none focus:border-teal-400 resize-y leading-relaxed"
                      placeholder="Summarize the article's key insight."
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Short description</label>
                    <textarea
                      rows={2}
                      value={form.metaKeywords.shortDescription}
                      onChange={(e) => setForm({ ...form, metaKeywords: { ...form.metaKeywords, shortDescription: e.target.value } })}
                      className="w-full px-3.5 py-3 rounded-xl bg-white dark:bg-[#06171D] border border-teal-500/20 text-slate-900 dark:text-white focus:outline-none focus:border-teal-400 resize-y leading-relaxed"
                      placeholder="Optional supporting description for the article page."
                    />
                  </div>
                </section>

                <section className="rounded-2xl border border-teal-500/15 bg-black/[0.025] dark:bg-white/[0.025] p-4 sm:p-5 space-y-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[.16em] text-teal-600 dark:text-teal-300">Section C · Full blog content</p>
                    <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">Select text to format it or create multiple independent inline links.</p>
                  </div>
                  <BlogRichTextEditor
                    value={form.content || ''}
                    onChange={(content, plainText) => setForm((current) => ({
                      ...current,
                      content,
                      readTime: estimateReadTime(plainText),
                    }))}
                  />
                </section>

                <section className="rounded-2xl border border-teal-500/15 bg-black/[0.025] dark:bg-white/[0.025] p-4 sm:p-5 space-y-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[.16em] text-teal-600 dark:text-teal-300">Section D · SEO settings</p>
                    <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">Search and social metadata are stored with the article without altering existing records.</p>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">SEO title</label>
                    <input value={form.metaTitle} onChange={(e) => setForm({ ...form, metaTitle: e.target.value })} className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-[#06171D] border border-teal-500/20 text-slate-900 dark:text-white" placeholder={form.title} />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Meta description</label>
                    <textarea rows={2} value={form.metaDescription} onChange={(e) => setForm({ ...form, metaDescription: e.target.value })} className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-[#06171D] border border-teal-500/20 text-slate-900 dark:text-white resize-y" placeholder={form.excerpt} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Focus keyword</label>
                      <input value={form.metaKeywords.focusKeyword} onChange={(e) => setForm({ ...form, metaKeywords: { ...form.metaKeywords, focusKeyword: e.target.value } })} className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-[#06171D] border border-teal-500/20 text-slate-900 dark:text-white" />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Canonical URL</label>
                      <input type="url" value={form.metaKeywords.canonicalUrl} onChange={(e) => setForm({ ...form, metaKeywords: { ...form.metaKeywords, canonicalUrl: e.target.value } })} className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-[#06171D] border border-teal-500/20 text-slate-900 dark:text-white" placeholder="https://…" />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Open Graph image URL</label>
                      <input type="url" value={form.metaKeywords.ogImage} onChange={(e) => setForm({ ...form, metaKeywords: { ...form.metaKeywords, ogImage: e.target.value } })} className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-[#06171D] border border-teal-500/20 text-slate-900 dark:text-white" placeholder="https://…" />
                    </div>
                  </div>
                  <label className="inline-flex items-center gap-2 text-slate-700 dark:text-slate-300 cursor-pointer">
                    <input type="checkbox" checked={form.metaKeywords.allowIndex} onChange={(e) => setForm({ ...form, metaKeywords: { ...form.metaKeywords, allowIndex: e.target.checked } })} className="accent-teal-500 w-4 h-4" />
                    Allow search engines to index this article
                  </label>
                </section>

                <section className="rounded-2xl border border-teal-500/15 bg-black/[0.025] dark:bg-white/[0.025] p-4 sm:p-5 space-y-3">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[.16em] text-teal-600 dark:text-teal-300">Section E · Publishing settings</p>
                    <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">Scheduled publishing is not configured in this CMS. Choose draft or publish now.</p>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={form.isPublished} onChange={(e) => setForm({ ...form, isPublished: e.target.checked })} className="accent-teal-500 w-4 h-4 rounded" />
                      <span className="font-semibold text-slate-700 dark:text-slate-300">{form.isPublished ? 'Published' : 'Draft'}</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} className="accent-teal-500 w-4 h-4 rounded" />
                      <span className="font-semibold text-slate-700 dark:text-slate-300">Featured article</span>
                    </label>
                  </div>
                </section>

                {/* Submit Actions */}
                <div className="pt-4 border-t border-teal-500/15 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/5 font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2 rounded-xl text-slate-950 font-bold bg-teal-500 hover:bg-teal-400 shadow-md transition-all cursor-pointer disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : 'Save Publication'}
                  </button>
                </div>
              </form>
              {showPreview && (
                <div className="overflow-y-auto bg-[#F7FAF8] dark:bg-[#06151A] px-4 py-8 sm:px-8 sm:py-12">
                  <article className="mx-auto max-w-4xl rounded-3xl bg-white dark:bg-[#0C2027] px-5 py-7 sm:px-12 sm:py-12 shadow-xl text-slate-800 dark:text-slate-100">
                    <div className="text-center">
                      <span className="inline-flex rounded-full bg-teal-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-teal-700 dark:text-teal-200">
                        {form.categoryName || 'Tax Strategy'}
                      </span>
                      <h1 className="mt-5 font-serif text-3xl sm:text-5xl font-semibold leading-tight">{form.title || 'Untitled article'}</h1>
                      <p className="mt-4 text-sm sm:text-base leading-relaxed text-slate-500 dark:text-slate-300">{form.excerpt || 'Your executive summary will appear here.'}</p>
                      <p className="mt-5 text-xs text-slate-500 dark:text-slate-400">
                        By {form.authorName} · {form.publishedAt ? new Date(form.publishedAt).toLocaleDateString() : 'Unpublished'} · {estimateStoredContentReadTime(form.content)}
                      </p>
                    </div>
                    {form.image && (
                      <img
                        src={form.image}
                        alt={form.metaKeywords.imageAlt || form.title}
                        className="mt-8 max-h-[28rem] w-full rounded-2xl object-cover"
                      />
                    )}
                    <div className="article-content blog-preview-content mt-10">
                      <RichArticleContent content={form.content} />
                    </div>
                  </article>
                </div>
              )}
            </div>
          </div>,
          document.body
        )}

        {/* Media Selector Modal for picking existing DAM images */}
        <MediaSelectorModal
          isOpen={isMediaSelectorOpen}
          onClose={() => setIsMediaSelectorOpen(false)}
          title="Select Featured Blog Image from Media Vault"
          allowedTypes="image"
          currentValue={form.image || undefined}
          onSelect={(asset: MediaAsset) => {
            setForm((prev) => ({
              ...prev,
              image: asset.storageLocation || asset.url,
            }));
            setImageError(null);
          }}
        />
      </div>
    </AdminLayout>
  );
}

export default BlogManagerPage;
