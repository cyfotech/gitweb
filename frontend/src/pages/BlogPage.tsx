import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Calendar, Clock, Search } from 'lucide-react';
import type { BlogPost } from '../data/blog';
import { blogApi } from '../api/blog';
import { blogPostFromApi } from '../utils/blogPosts';
import { EditableElement } from '../components/EditableElement';
import { usePageContent } from '../hooks/usePageContent';
import { EditableSectionContainer } from '../components/EditableSectionContainer';

export function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const { getSection, isSectionEnabled } = usePageContent('blog');
  const heroSection = getSection('hero');
  const postsSection = getSection('posts_grid');
  const eyebrowText = heroSection?.parsedContent?.eyebrow || 'Verified Industry Intelligence';
  const headlineText = heroSection?.title || 'Tax Insights & Verified Publications';
  const descriptionText = heroSection?.description || 'Practical tax and accounting perspectives from the Preferred Tax Consultancy team.';
  const searchPlaceholder = postsSection?.parsedContent?.searchPlaceholder || 'Search articles…';
  const readArticleLabel = postsSection?.parsedContent?.readArticleLabel || 'Read article';

  useEffect(() => {
    let active = true;
    blogApi.getAll(true, 1, 100)
      .then((response: any) => {
        if (!active) return;
        const articles = Array.isArray(response?.posts)
          ? response.posts.map(blogPostFromApi).filter((post: BlogPost | null): post is BlogPost => Boolean(post))
          : [];
        setPosts(articles);
        setLoadError(false);
      })
      .catch((error: unknown) => {
        if (!active) return;
        console.error('Unable to load published blog articles.', error);
        setLoadError(true);
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const categories = useMemo(() => ['All', ...new Set(posts.map((post) => post.category))], [posts]);
  const filteredPosts = posts.filter((post) => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    const query = searchQuery.trim().toLowerCase();
    return matchesCategory && (!query || `${post.title} ${post.excerpt}`.toLowerCase().includes(query));
  });

  return (
    <div className="pt-24 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <EditableSectionContainer sectionKey="hero" sectionTitle="Blog Introduction" isEnabled={isSectionEnabled('hero')} sectionData={heroSection}>
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="max-w-3xl">
          <EditableElement sectionKey="hero" elementKey="badge" elementType="badge" label="Blog Eyebrow" value={eyebrowText}>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-[#E4F0EE] dark:bg-[rgba(44,207,197,0.12)] text-[#315F69] dark:text-[#79F1E8] border border-[#DCE5E2] dark:border-[rgba(121,241,232,0.25)] mb-3">
              <BookOpen className="w-3.5 h-3.5 text-[#2CCFC5]" />{eyebrowText}
            </div>
          </EditableElement>
          <EditableElement sectionKey="hero" elementKey="title" elementType="heading" label="Blog Headline" value={headlineText}>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[#17252B] dark:text-[#F3FBFC] font-serif-editorial">{headlineText}</h1>
          </EditableElement>
          <EditableElement sectionKey="hero" elementKey="description" elementType="paragraph" label="Blog Description" value={descriptionText}>
            <p className="mt-3 text-base text-[#526168] dark:text-[#A8C0C6]">{descriptionText}</p>
          </EditableElement>
        </div>
        <label className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#526168] dark:text-[#A8C0C6]" />
          <span className="sr-only">Search articles</span>
          <input
            type="search"
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-full text-sm bg-white dark:bg-[#071C24] border border-[#DCE5E2] dark:border-[rgba(121,241,232,0.18)] focus:outline-none focus:border-[#315F69] dark:focus:border-[#2CCFC5] text-[#17252B] dark:text-[#F3FBFC] shadow-sm"
          />
        </label>
      </header>

      </EditableSectionContainer>
      <EditableSectionContainer sectionKey="posts_grid" sectionTitle="Articles and Search" isEnabled={isSectionEnabled('posts_grid')} sectionData={postsSection}>
      {categories.length > 1 && (
        <div className="flex flex-wrap items-center gap-2 mb-9 pb-4 border-b border-black/5 dark:border-white/5">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-colors ${selectedCategory === category
                ? 'bg-[#17383F] dark:bg-[#49E3D6] text-white dark:text-[#03181E]'
                : 'bg-black/5 dark:bg-white/5 text-[#526168] dark:text-[#A8C0C6] hover:bg-black/10 dark:hover:bg-white/10'}`}
            >
              {category}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {Array.from({ length: 6 }).map((_, index) => <div key={index} className="h-80 rounded-3xl bg-black/5 dark:bg-white/5 animate-pulse" />)}
        </div>
      ) : loadError ? (
        <div role="alert" className="py-20 text-center text-[#526168] dark:text-[#A8C0C6]">Articles could not be loaded right now. Please try again shortly.</div>
      ) : filteredPosts.length === 0 ? (
        <div className="py-20 text-center text-[#526168] dark:text-[#A8C0C6]">{posts.length ? 'No articles match this search.' : 'No articles have been published yet.'}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {filteredPosts.map((post) => (
            <Link
              key={post.id}
              to={`/blog/${post.slug}`}
              className="group glass-panel rounded-3xl overflow-hidden border border-[#DCE5E2] dark:border-[rgba(121,241,232,0.18)] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col bg-white dark:bg-[#071A22]/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-500"
            >
              {post.image && (
                <div className="relative h-52 overflow-hidden bg-slate-900">
                  <img src={post.image} alt={post.metaKeywords?.imageAlt || post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-black/70 text-[#79F1E8] border border-white/15">{post.category}</span>
                </div>
              )}
              <div className="flex flex-1 flex-col p-6">
                {!post.image && <span className="self-start px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-[#E4F0EE] dark:bg-[rgba(44,207,197,0.12)] text-[#315F69] dark:text-[#79F1E8]">{post.category}</span>}
                <h2 className="mt-3 text-xl font-bold leading-snug text-[#17252B] dark:text-[#F3FBFC] group-hover:text-[#315F69] dark:group-hover:text-[#49E3D6]">{post.title}</h2>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-[#526168] dark:text-[#A8C0C6] line-clamp-4">{post.excerpt}</p>
                <div className="mt-5 pt-4 border-t border-black/5 dark:border-white/5 flex items-center justify-between gap-3 text-[11px] text-[#526168] dark:text-[#A8C0C6]">
                  <span className="truncate font-semibold text-[#17252B] dark:text-[#F3FBFC]">{post.author.name}</span>
                  <span className="flex shrink-0 items-center gap-3">
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-[#2CCFC5]" />{post.publishedAt}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-[#2CCFC5]" />{post.readTime}</span>
                  </span>
                </div>
                <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-[#315F69] dark:text-[#49E3D6]">{readArticleLabel} <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" /></span>
              </div>
            </Link>
          ))}
        </div>
      )}
      </EditableSectionContainer>
    </div>
  );
}

export default BlogPage;
