import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import {
  ArrowLeft, ArrowRight, ArrowUp, BookOpen, CalendarDays, Check, Clock3,
  Copy, Facebook, Linkedin, UserRound,
} from 'lucide-react';
import { blogApi } from '../api/blog';
import type { BlogPost } from '../data/blog';
import { RichArticleContent } from '../components/RichArticleContent';
import { cleanExcerptText, isSafeBlogImage, isSafeBlogLink } from '../utils/blogContent';
import './BlogArticlePage.css';

type ArticleMetadata = {
  focusKeyword?: string;
  canonicalUrl?: string;
  ogImage?: string;
  imageAlt?: string;
  shortDescription?: string;
  allowIndex?: boolean;
};

type ArticlePost = BlogPost & {
  seoTitle?: string;
  seoDescription?: string;
  canonicalUrl?: string;
  ogImage?: string;
  imageAlt?: string;
  allowIndex?: boolean;
  publishedTimestamp?: number;
  publishedISO?: string;
};

const API_AUTHOR_AVATAR = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80';

function toArticlePost(value: unknown): ArticlePost | null {
  if (!value || typeof value !== 'object') return null;
  const record = value as Record<string, unknown>;
  if (typeof record.slug !== 'string' || typeof record.title !== 'string') return null;

  const metadata = record.metaKeywords && typeof record.metaKeywords === 'object' && !Array.isArray(record.metaKeywords)
    ? record.metaKeywords as ArticleMetadata
    : {};
  const date = typeof record.publishedAt === 'string' ? new Date(record.publishedAt) : null;
  const category = record.blogcategory && typeof record.blogcategory === 'object'
    ? (record.blogcategory as Record<string, unknown>).name
    : record.categoryName;
  const authorName = typeof record.authorName === 'string' ? record.authorName : 'Preferred Tax Consultancy';

  return {
    id: typeof record.id === 'string' ? record.id : record.slug,
    slug: record.slug,
    title: record.title,
    excerpt: typeof record.excerpt === 'string' ? record.excerpt : '',
    content: typeof record.content === 'string' ? record.content : undefined,
    category: typeof category === 'string' ? category as BlogPost['category'] : 'Tax Strategy',
    publishedAt: date && !Number.isNaN(date.valueOf())
      ? date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      : 'Recent',
    publishedTimestamp: date?.valueOf(),
    publishedISO: date && !Number.isNaN(date.valueOf()) ? date.toISOString() : undefined,
    readTime: typeof record.readTime === 'string' ? record.readTime : '1 min read',
    author: {
      name: authorName,
      role: typeof record.authorRole === 'string' ? record.authorRole : 'Tax Advisory & Compliance',
      avatar: typeof record.authorAvatar === 'string' ? record.authorAvatar : API_AUTHOR_AVATAR,
    },
    image: isSafeBlogImage(record.image) ? record.image.trim() : undefined,
    sourceName: undefined,
    featured: Boolean(record.featured),
    metaKeywords: metadata,
    seoTitle: typeof record.metaTitle === 'string' ? record.metaTitle : undefined,
    seoDescription: typeof record.metaDescription === 'string' ? record.metaDescription : undefined,
    canonicalUrl: metadata.canonicalUrl,
    ogImage: metadata.ogImage,
    imageAlt: metadata.imageAlt,
    allowIndex: metadata.allowIndex !== false,
  };
}

function updateMeta(attribute: 'name' | 'property', key: string, value: string) {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.content = value;
}

function toDateTime(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.valueOf()) ? value : date.toISOString();
}

export function BlogArticlePage() {
  const { slug = '' } = useParams();
  const reduceMotion = useReducedMotion();
  const [post, setPost] = useState<ArticlePost | null>(null);
  const [posts, setPosts] = useState<ArticlePost[]>([]);
  const [loadError, setLoadError] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showTopButton, setShowTopButton] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let active = true;
    setLoadError(false);
    setPost(null);
    setCopied(false);
    Promise.all([
      blogApi.getBySlug(slug),
      blogApi.getAll(true, 1, 100).catch((error: unknown) => {
        console.error('Unable to load related blog articles.', error);
        return null;
      }),
    ])
      .then(([response, listing]: [unknown, any]) => {
        if (!active) return;
        const article = toArticlePost(response);
        const allPosts = Array.isArray(listing?.posts)
          ? listing.posts.map(toArticlePost).filter((item: ArticlePost | null): item is ArticlePost => Boolean(item))
          : [];
        if (!article) {
          setLoadError(true);
          return;
        }
        setPost(article);
        setPosts(allPosts);
      })
      .catch((error: unknown) => {
        if (!active) return;
        console.error('Unable to load the published blog article.', error);
        setLoadError(true);
      });

    return () => { active = false; };
  }, [slug]);

  useEffect(() => {
    if (!post) return;
    const description = post.seoDescription || post.excerpt || post.title;
    const canonical = post.canonicalUrl && isSafeBlogLink(post.canonicalUrl)
      ? new URL(post.canonicalUrl, window.location.origin).href
      : `${window.location.origin}/blog/${post.slug}`;
    const cover = post.ogImage || post.image;
    const imageUrl = cover && isSafeBlogImage(cover) ? new URL(cover, window.location.origin).href : '';

    document.title = `${post.seoTitle || post.title} | Preferred Tax Consultancy`;
    updateMeta('name', 'description', description);
    updateMeta('name', 'robots', post.allowIndex === false ? 'noindex, nofollow' : 'index, follow');
    updateMeta('property', 'og:type', 'article');
    updateMeta('property', 'og:title', post.seoTitle || post.title);
    updateMeta('property', 'og:description', description);
    updateMeta('property', 'og:url', canonical);
    if (imageUrl) updateMeta('property', 'og:image', imageUrl);
    updateMeta('name', 'twitter:card', 'summary_large_image');
    updateMeta('name', 'twitter:title', post.seoTitle || post.title);
    updateMeta('name', 'twitter:description', description);
    if (imageUrl) updateMeta('name', 'twitter:image', imageUrl);

    let canonicalLink = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.rel = 'canonical';
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = canonical;

    let structuredData = document.getElementById('dynamic-jsonld-schema') as HTMLScriptElement | null;
    if (!structuredData) {
      structuredData = document.createElement('script');
      structuredData.id = 'dynamic-jsonld-schema';
      structuredData.type = 'application/ld+json';
      document.head.appendChild(structuredData);
    }
    structuredData.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: post.title,
      description,
      image: imageUrl || undefined,
      datePublished: post.publishedAt,
      author: { '@type': 'Person', name: post.author.name },
      publisher: { '@type': 'Organization', name: 'Preferred Tax Consultancy' },
      mainEntityOfPage: canonical,
    });

    return () => {
      document.getElementById('dynamic-jsonld-schema')?.remove();
    };
  }, [post]);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const scrollable = document.documentElement.scrollHeight - window.innerHeight;
        setProgress(scrollable > 0 ? Math.min(100, Math.max(0, (window.scrollY / scrollable) * 100)) : 0);
        setShowTopButton(window.scrollY > 560);
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const articleNavigation = useMemo(() => {
    if (!post) return { related: [], previous: null, next: null };
    const ordered = [...posts].sort((a, b) => (b.publishedTimestamp || 0) - (a.publishedTimestamp || 0));
    const index = ordered.findIndex((item) => item.slug === post.slug);
    const others = ordered.filter((item) => item.slug !== post.slug);
    const related = [
      ...others.filter((item) => item.category === post.category),
      ...others.filter((item) => item.category !== post.category),
    ].slice(0, 3);
    return {
      related,
      previous: index > 0 ? ordered[index - 1] : null,
      next: index >= 0 ? ordered[index + 1] || null : null,
    };
  }, [post, posts]);

  const copyArticleLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch (error) {
      console.error('Unable to copy the article link.', error);
    }
  };

  const shareUrl = encodeURIComponent(typeof window === 'undefined' ? '' : window.location.href);

  if (!post) {
    return (
      <main className="article-not-found">
        <BookOpen size={28} />
        <h1>{loadError ? 'Article not found' : 'Loading article…'}</h1>
        <p>{loadError ? 'This published article may have moved or is no longer available.' : 'Preparing the editorial page.'}</p>
        <Link to="/blog"><ArrowLeft size={16} /> Explore the blog</Link>
      </main>
    );
  }

  const canonicalDate = post.publishedISO || toDateTime(post.publishedAt);
  const rawLead = cleanExcerptText(post.excerpt);
  // Keep Executive Summary strictly as summary: only display when it differs from the main article body
  const rawBodyText = (post.content || '').trim();
  const lead = rawLead && rawLead !== rawBodyText ? rawLead : '';

  return (
    <div className="article-page">
      <div className="article-reading-progress" aria-hidden="true"><span style={{ transform: `scaleX(${progress / 100})` }} /></div>
      <div className="article-layout">
        <main className="article-main">
          <Link className="article-back-link" to="/blog"><ArrowLeft size={16} /> Back to blogs</Link>
          <motion.header
            className="article-header"
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.55, ease: 'easeOut' }}
          >
            <div className="article-eyebrow"><span className="article-category">{post.category}</span></div>
            <h1>{post.title}</h1>
            {post.metaKeywords?.shortDescription && <p className="article-dek">{post.metaKeywords.shortDescription}</p>}
            <div className="article-byline">
              <img src={post.author.avatar} alt="" />
              <span className="article-byline__author"><strong>{post.author.name}</strong><small>{post.author.role}</small></span>
              <time className="article-byline__meta" dateTime={canonicalDate}><CalendarDays size={15} />{post.publishedAt}</time>
              <span className="article-byline__meta"><Clock3 size={15} />{post.readTime}</span>
            </div>
          </motion.header>

          {post.image && isSafeBlogImage(post.image) && (
            <motion.figure
              className="article-cover"
              initial={reduceMotion ? false : { opacity: 0, scale: 0.985, y: 18 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.7, delay: reduceMotion ? 0 : 0.12 }}
            >
              <img src={post.image} alt={post.imageAlt || post.title} fetchPriority="high" />
            </motion.figure>
          )}

          <div className="article-content">
            {lead && <section className="article-takeaways article-executive-summary"><span className="article-section-kicker">Executive summary</span><p>{lead}</p></section>}
            <section className="article-section article-rich-body" aria-label="Full article">
              <RichArticleContent content={post.content || post.excerpt} />
            </section>
            <div className="article-share" aria-label="Share this article">
              <span>Share this article</span>
              <a href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`} target="_blank" rel="noopener noreferrer" aria-label="Share on Facebook"><Facebook size={16} /></a>
              <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`} target="_blank" rel="noopener noreferrer" aria-label="Share on LinkedIn"><Linkedin size={16} /></a>
              <button type="button" onClick={copyArticleLink} aria-label="Copy article link">{copied ? <Check size={16} /> : <Copy size={16} />}{copied && <span>Copied</span>}</button>
            </div>
            <div className="article-author-card">
              <img src={post.author.avatar} alt="" />
              <div><span>About the contributor</span><strong>{post.author.name}</strong><p>{post.author.role}</p></div>
              <UserRound size={20} aria-hidden="true" />
            </div>
            {(articleNavigation.previous || articleNavigation.next) && (
              <nav className="article-previous-next" aria-label="Previous and next articles">
                {articleNavigation.previous ? (
                  <Link to={`/blog/${articleNavigation.previous.slug}`}><span><ArrowLeft size={14} /> Previous article</span><strong>{articleNavigation.previous.title}</strong></Link>
                ) : <span />}
                {articleNavigation.next ? (
                  <Link to={`/blog/${articleNavigation.next.slug}`}><span>Next article <ArrowRight size={14} /></span><strong>{articleNavigation.next.title}</strong></Link>
                ) : <span />}
              </nav>
            )}
          </div>
        </main>
      </div>

      <section className="article-related">
        <div className="article-related__heading">
          <div><span className="article-section-kicker">Continue reading</span><h2>Related perspectives</h2></div>
          <Link to="/blog">Explore all articles <ArrowRight size={16} /></Link>
        </div>
        {articleNavigation.related.length > 0 ? (
          <div className="article-related__grid">
            {articleNavigation.related.map((item) => (
              <Link to={`/blog/${item.slug}`} className="article-related-card" key={item.id}>
                <div className="article-related-card__image">
                  {item.image && <img src={item.image} alt="" loading="lazy" />}
                  <span>{item.category}</span>
                </div>
                <div className="article-related-card__body">
                  <span><CalendarDays size={13} />{item.publishedAt}<i /> <Clock3 size={13} />{item.readTime}</span>
                  <h3>{item.title}</h3>
                  <p>{item.excerpt}</p>
                  <strong>Read article <ArrowRight size={15} /></strong>
                </div>
              </Link>
            ))}
          </div>
        ) : <p className="article-related-empty">More articles will appear here as they are published.</p>}
      </section>
      {showTopButton && (
        <button className="article-back-to-top" type="button" onClick={() => window.scrollTo({ top: 0, behavior: reduceMotion ? 'instant' : 'smooth' })} aria-label="Back to top">
          <ArrowUp size={18} />
        </button>
      )}
    </div>
  );
}

export default BlogArticlePage;
