import React, { useState, useEffect } from 'react';
import { ArrowRight, ArrowUpRight, BookOpen, Clock, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { blogApi } from '../api/blog';
import { BLOG_POSTS, BlogPost } from '../data/blog';
import { EditableElement } from './EditableElement';

export interface EditorialInsightsContent {
  title?: string | null;
  subheading?: string | null;
  description?: string | null;
  content?: string | null;
}

interface EditorialInsightsChapterProps {
  cmsContent?: EditorialInsightsContent | null;
}

export function EditorialInsightsChapter({ cmsContent }: EditorialInsightsChapterProps = {}) {
  const [posts, setPosts] = useState<BlogPost[]>(BLOG_POSTS.slice(0, 4));

  useEffect(() => {
    let active = true;
    blogApi.getAll(true, 1, 4)
      .then((res: any) => {
        if (!active) return;
        const fetched = res?.posts || res?.data || res;
        if (Array.isArray(fetched) && fetched.length > 0) {
          const mapped: BlogPost[] = fetched.map((p: any) => {
            const date = p.publishedAt ? new Date(p.publishedAt) : null;
            const formattedDate = date && !isNaN(date.valueOf())
              ? date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
              : (p.date || 'Recent');

            const readTimeStr = typeof p.readTime === 'string' && p.readTime.trim()
              ? p.readTime
              : (p.readTimeMinutes ? `${p.readTimeMinutes} min read` : '5 min read');

            const postImg = p.image || p.coverImage || p.featuredImage || '/assets/blog-default.jpg';

            return {
              id: p.id || p.slug,
              slug: p.slug,
              title: p.title,
              excerpt: p.excerpt || p.summary || '',
              category: (p.blogcategory?.name || p.categoryName || p.category || 'Tax Strategy') as BlogPost['category'],
              author: {
                name: p.authorName || (typeof p.author === 'string' ? p.author : p.author?.name) || 'Preferred Tax Consultancy',
                role: p.authorRole || p.author?.role || 'Tax Advisory & Compliance',
                avatar: p.authorAvatar || p.author?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80',
              },
              publishedAt: formattedDate,
              readTime: readTimeStr,
              featured: Boolean(p.featured ?? p.isFeatured),
              image: postImg,
              content: p.content || '',
              sourceName: p.sourceName || 'Preferred Tax Analysis',
            };
          });
          setPosts(mapped);
        }
      })
      .catch((err) => console.warn('Could not fetch dynamic blog posts for Home Chapter:', err));

    return () => {
      active = false;
    };
  }, []);

  const displayTitle = cmsContent?.title || 'Insights & intelligence.';
  const displaySubheading = cmsContent?.subheading || 'CHAPTER 06 — STRATEGIC DISPATCH';
  const displayDescription = cmsContent?.description || 'Authoritative perspectives on changing federal tax statutes, BOI reporting compliance, and public accounting workforce dynamics.';

  return (
    <section id="blog" className="relative py-24 px-4 sm:px-6 lg:px-8 bg-[#F4F7F6] dark:bg-[#041219] transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Chapter Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 pb-6 border-b border-[#DCE5E2] dark:border-[rgba(121,241,232,0.15)]">
          <div>
            <EditableElement
              sectionKey="editorial_insights"
              elementKey="subheading"
              elementType="subheading"
              label="Insights Subheading"
              value={displaySubheading}
            >
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#2AA499] dark:text-[#49E3D6] mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#49E3D6]" />
                <span>{displaySubheading}</span>
              </div>
            </EditableElement>

            <EditableElement
              sectionKey="editorial_insights"
              elementKey="title"
              elementType="heading"
              label="Insights Headline"
              value={displayTitle}
            >
              <h2 className="font-serif-editorial text-3xl sm:text-5xl font-normal text-[#12242B] dark:text-[#F4FBFC] tracking-tight">
                {displayTitle}
              </h2>
            </EditableElement>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <EditableElement
              sectionKey="editorial_insights"
              elementKey="description"
              elementType="paragraph"
              label="Insights Description"
              value={displayDescription}
            >
              <p className="text-xs sm:text-sm text-[#476067] dark:text-[#A8C0C6] max-w-md">
                {displayDescription}
              </p>
            </EditableElement>

            <Link
              to="/blog"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold bg-white dark:bg-[#071C25] border border-[#2AA499]/40 dark:border-[#49E3D6]/30 text-[#12242B] dark:text-[#F4FBFC] hover:bg-black/5 dark:hover:bg-white/10 transition-all shadow-sm shrink-0 self-start sm:self-auto group"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#2AA499] dark:text-[#49E3D6]" />
              <span>Explore All Publications</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Editorial Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {posts.map((post) => (
            <article
              key={post.id}
              className="rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#071C25] border border-[#DCE5E2] dark:border-[rgba(121,241,232,0.15)] shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Visual Header */}
                <div className="relative aspect-[16/9] rounded-2xl overflow-hidden mb-6 bg-slate-900">
                  <img
                    src={post.image || '/assets/blog-default.jpg'}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-95"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/70 text-white backdrop-blur-md">
                      {post.category}
                    </span>
                  </div>
                  <div className="absolute bottom-3 right-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-white/90 text-slate-900 backdrop-blur-md flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#2AA499]" />
                      <span>{post.readTime}</span>
                    </span>
                  </div>
                </div>

                {/* Source & Date */}
                <div className="flex items-center justify-between text-xs text-[#64748B] dark:text-[#8AA3A8] mb-2">
                  <span className="font-semibold text-[#2AA499] dark:text-[#49E3D6]">
                    {post.sourceName || 'Preferred Tax Analysis'}
                  </span>
                  <span>{post.publishedAt}</span>
                </div>

                {/* Title */}
                <h3 className="font-serif-editorial text-xl sm:text-2xl font-bold text-[#12242B] dark:text-[#F4FBFC] group-hover:text-[#2AA499] dark:group-hover:text-[#49E3D6] transition-colors mb-3 leading-snug">
                  {post.title}
                </h3>

                {/* Excerpt */}
                <p className="text-xs sm:text-sm text-[#476067] dark:text-[#A8C0C6] leading-relaxed mb-6 line-clamp-3">
                  {post.excerpt}
                </p>
              </div>

              {/* Internal article route; publisher citation appears on the detail page. */}
              <div className="pt-4 border-t border-[#E2EBE8] dark:border-[rgba(121,241,232,0.1)] flex items-center justify-between">
                <Link
                  to={`/blog/${post.slug}`}
                  className="inline-flex items-center gap-2 text-xs font-bold text-[#12242B] dark:text-[#F4FBFC] group-hover:text-[#2AA499] dark:group-hover:text-[#49E3D6] transition-colors"
                >
                  <span>Read Article</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#2AA499] dark:text-[#49E3D6]" />
                </Link>

                <span className="text-[10px] text-[#64748B] dark:text-[#8AA3A8]">
                  {post.sourceName ? `Source: ${post.sourceName}` : 'Preferred Tax Analysis'}
                </span>
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
}
