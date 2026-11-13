import type { BlogPost } from '../data/blog';
import { isSafeBlogImage } from './blogContent';

const API_AUTHOR_AVATAR = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80';

export function blogPostFromApi(value: unknown): BlogPost | null {
  if (!value || typeof value !== 'object') return null;
  const record = value as Record<string, unknown>;
  if (typeof record.slug !== 'string' || typeof record.title !== 'string') return null;
  const category = record.blogcategory && typeof record.blogcategory === 'object'
    ? (record.blogcategory as Record<string, unknown>).name
    : record.categoryName;
  const date = typeof record.publishedAt === 'string' ? new Date(record.publishedAt) : null;
  const metaKeywords = record.metaKeywords && typeof record.metaKeywords === 'object' && !Array.isArray(record.metaKeywords)
    ? record.metaKeywords as BlogPost['metaKeywords']
    : undefined;

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
    readTime: typeof record.readTime === 'string' ? record.readTime : '1 min read',
    author: {
      name: typeof record.authorName === 'string' ? record.authorName : 'Preferred Tax Consultancy',
      role: typeof record.authorRole === 'string' ? record.authorRole : 'Tax Advisory & Compliance',
      avatar: typeof record.authorAvatar === 'string' ? record.authorAvatar : API_AUTHOR_AVATAR,
    },
    image: isSafeBlogImage(record.image) ? record.image.trim() : undefined,
    featured: Boolean(record.featured),
    metaKeywords,
  };
}
