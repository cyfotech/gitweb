import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Calendar, Clock, Search } from 'lucide-react';
import type { BlogPost } from '../data/blog';
import { blogApi } from '../api/blog';
import { blogPostFromApi } from '../utils/blogPosts';

export function BlogSection() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let active = true;
    blogApi.getAll(true, 1, 6)
      .then((response: any) => {
        if (!active) return;
        const articles = Array.isArray(response?.posts)
          ? response.posts.map(blogPostFromApi).filter((post: BlogPost | null): post is BlogPost => Boolean(post))
          : [];
        setPosts(articles);
      })
      .catch((error: unknown) => {
        if (!active) return;
        console.error('Unable to load the latest blog articles.', error);
        setLoadError(true);
      });
    return () => { active = false; };
  }, []);

  const categories = useMemo(() => ['All', ...new Set(posts.map((post) => post.category))], [posts]);
  const filteredPosts = posts.filter((post) => {
    const matchesCategory = selectedCategory === 'All' || selectedCategory === post.category;
    const query = searchQuery.trim().toLowerCase();
    return matchesCategory && (!query || `${post.title} ${post.excerpt}`.toLowerCase().includes(query));
  });

  return (
    <section id="blog" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 relative bg-[#F7F9F8] dark:bg-[#031117] transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-[#E4F0EE] dark:bg-[rgba(44,207,197,0.12)] text-[#315F69] dark:text-[#79F1E8] border border-[#DCE5E2] dark:border-[rgba(121,241,232,0.25)] mb-3">
              <BookOpen className="w-3.5 h-3.5 text-[#2CCFC5]" />Verified Industry Intelligence
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#17252B] dark:text-[#F3FBFC]">Tax Insights & Original Publications</h2>
            <p className="mt-3 text-base text-[#526168] dark:text-[#A8C0C6]">Practical tax and accounting perspectives from our advisory team.</p>
          </div>
          <label className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#526168] dark:text-[#A8C0C6]" />
            <span className="sr-only">Search articles</span>
            <input
              type="search"
              placeholder="Search tax articles…"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl text-sm bg-white dark:bg-[#0B2530] border border-[#DCE5E2] dark:border-[rgba(121,241,232,0.18)] text-[#17252B] dark:text-[#F3FBFC] focus:outline-none focus:ring-2 focus:ring-[#2CCFC5]"
            />
          </label>
        </div>

        {categories.length > 1 && (
          <div className="flex flex-wrap gap-2 mb-7">
            {categories.map((category) => (
              <button
                type="button"
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors ${selectedCategory === category
                  ? 'bg-[#315F69] text-white dark:bg-[#2CCFC5] dark:text-[#031117]'
                  : 'bg-black/5 dark:bg-white/5 border border-[#DCE5E2] dark:border-[rgba(121,241,232,0.14)] text-[#526168] dark:text-[#A8C0C6]'}`}
              >
                {category}
              </button>
            ))}
          </div>
        )}

        {loadError ? (
          <p role="alert" className="py-12 text-center text-sm text-[#526168] dark:text-[#A8C0C6]">The latest articles are temporarily unavailable.</p>
        ) : filteredPosts.length === 0 ? (
          <p className="py-12 text-center text-sm text-[#526168] dark:text-[#A8C0C6]">No published articles are available.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {filteredPosts.map((post) => (
              <Link
                key={post.id}
                to={`/blog/${post.slug}`}
                className="group glass-panel rounded-3xl overflow-hidden border border-[#DCE5E2] dark:border-[rgba(121,241,232,0.18)] shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col bg-white dark:bg-[#071A22]/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-500"
              >
                {post.image && (
                  <div className="relative h-48 overflow-hidden bg-slate-900">
                    <img src={post.image} alt={post.metaKeywords?.imageAlt || post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-black/70 text-[#79F1E8] border border-white/15">{post.category}</span>
                  </div>
                )}
                <div className="flex flex-1 flex-col p-6">
                  {!post.image && <span className="self-start px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-[#E4F0EE] dark:bg-[rgba(44,207,197,0.12)] text-[#315F69] dark:text-[#79F1E8]">{post.category}</span>}
                  <h3 className="mt-3 text-xl font-bold text-[#17252B] dark:text-[#F3FBFC] group-hover:text-[#315F69] dark:group-hover:text-[#79F1E8] transition-colors leading-snug">{post.title}</h3>
                  <p className="mt-3 flex-1 text-sm text-[#526168] dark:text-[#A8C0C6] leading-relaxed line-clamp-4">{post.excerpt}</p>
                  <div className="mt-5 pt-4 border-t border-black/5 dark:border-white/5 flex items-center justify-between gap-2 text-[11px] text-[#526168] dark:text-[#A8C0C6]">
                    <span className="truncate font-semibold text-[#17252B] dark:text-[#F3FBFC]">{post.author.name}</span>
                    <span className="flex shrink-0 items-center gap-2"><Calendar className="w-3.5 h-3.5 text-[#2CCFC5]" />{post.publishedAt}<Clock className="w-3.5 h-3.5 text-[#2CCFC5]" />{post.readTime}</span>
                  </div>
                  <span className="mt-4 inline-flex items-center gap-1 font-bold text-xs text-[#315F69] dark:text-[#79F1E8]">Read article <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" /></span>
                </div>
              </Link>
            ))}
          </div>
        )}
        <div className="mt-10 flex justify-center">
          <Link to="/blog" className="inline-flex items-center gap-2 rounded-full bg-[#17383F] dark:bg-[#49E3D6] px-5 py-3 text-xs font-bold text-white dark:text-[#03181E] transition-transform hover:-translate-y-0.5">
            Explore all insights <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default BlogSection;
