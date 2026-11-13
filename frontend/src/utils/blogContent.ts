import DOMPurify from 'dompurify';
import type { JSONContent } from '@tiptap/core';

const editorNodeTypes = new Set([
  'doc', 'paragraph', 'heading', 'text', 'bulletList', 'orderedList', 'listItem',
  'blockquote', 'horizontalRule', 'image', 'hardBreak',
]);
const editorMarkTypes = new Set(['bold', 'italic', 'underline', 'strike', 'link', 'textStyle', 'highlight']);
const legacyHtmlTags = [
  'a', 'blockquote', 'br', 'em', 'h1', 'h2', 'h3', 'h4', 'hr', 'img', 'li',
  'ol', 'p', 's', 'span', 'strong', 'u', 'ul',
];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isEditorDocument(value: unknown): value is JSONContent {
  if (!isRecord(value) || value.type !== 'doc' || !Array.isArray(value.content)) return false;
  return value.content.every(isEditorNode);
}

function isEditorNode(value: unknown): value is JSONContent {
  if (!isRecord(value) || typeof value.type !== 'string' || !editorNodeTypes.has(value.type)) return false;
  if (value.type === 'text' && typeof value.text !== 'string') return false;
  if (value.content !== undefined && (!Array.isArray(value.content) || !value.content.every(isEditorNode))) return false;
  if (value.marks !== undefined) {
    if (!Array.isArray(value.marks)) return false;
    for (const mark of value.marks) {
      if (!isRecord(mark) || typeof mark.type !== 'string' || !editorMarkTypes.has(mark.type)) return false;
      if (mark.type === 'link' && isRecord(mark.attrs) && !isSafeBlogLink(mark.attrs.href)) return false;
    }
  }
  return true;
}

export function isSafeBlogLink(value: unknown): value is string {
  if (typeof value !== 'string' || !value.trim() || /[\u0000-\u001f]/.test(value)) return false;
  const href = value.trim();
  if (href.startsWith('/') && !href.startsWith('//')) return true;
  if (href.startsWith('#')) return true;
  try {
    const origin = typeof window === 'undefined' ? 'https://preferred-tax-consultancy.invalid' : window.location.origin;
    const url = new URL(href, origin);
    return ['http:', 'https:', 'mailto:', 'tel:'].includes(url.protocol);
  } catch {
    return false;
  }
}

export function isSafeBlogImage(value: unknown): value is string {
  // Allow absolute URLs (http/https) and relative URLs that start with a single slash.
  // The original implementation rejected relative URLs that did not start with "//".
  // For our blog images stored under /uploads/blog/... we need to accept those paths.
  if (!isSafeBlogLink(value)) return false;
  if (typeof value === 'string') {
    const trimmed = value.trim();
    // Accept any path that begins with '/' but not with '//' (which would be protocol‑relative URLs).
    if (trimmed.startsWith('/') && !trimmed.startsWith('//')) return true;
  }
  try {
    const origin = typeof window === 'undefined' ? 'https://preferred-tax-consultancy.invalid' : window.location.origin;
    return ['http:', 'https:'].includes(new URL(value as string, origin).protocol);
  } catch {
    return false;
  }
}


export function sanitizeLegacyHtml(value: string): string {
  return DOMPurify.sanitize(value, {
    ALLOWED_TAGS: legacyHtmlTags,
    ALLOWED_ATTR: ['alt', 'href', 'src', 'target', 'rel', 'style', 'start', 'class'],
    ADD_ATTR: ['target', 'rel'],
  });
}

/**
 * Strips accidental internal metadata or developer prompt pastes from text.
 */
export function cleanExcerptText(text: string | null | undefined): string {
  if (!text) return '';
  let cleaned = text.trim();
  // Filter out developer instructions or project prompts if accidentally pasted
  if (/PROJECT:\s*PREFERRED\s*TAX\s*CONSULTANCY/i.test(cleaned) || /Act as a senior/i.test(cleaned)) {
    cleaned = cleaned
      .replace(/PROJECT:\s*PREFERRED\s*TAX\s*CONSULTANCY[\s\S]*?(?:website\.|management\.|stack:[\s\S]*?\.)/i, '')
      .replace(/Act as a senior[\s\S]*?(?:website\.|management\.)/i, '')
      .trim();
  }
  return cleaned;
}

export function parseEditorContent(value: string | null | undefined): JSONContent | string {
  if (!value?.trim()) return { type: 'doc', content: [{ type: 'paragraph' }] };

  try {
    const parsed: unknown = JSON.parse(value);
    if (isEditorDocument(parsed)) return parsed;
  } catch {
    // Older articles store plain text or HTML.
  }

  if (/<[a-z][\s\S]*>/i.test(value)) return sanitizeLegacyHtml(value);

  return {
    type: 'doc',
    content: value.split(/\n{2,}/).map((text) => ({
      type: 'paragraph',
      content: text.split('\n').flatMap((line, index) => [
        ...(index ? [{ type: 'hardBreak' }] : []),
        ...(line ? [{ type: 'text', text: line }] : []),
      ]),
    })),
  };
}

export function getEditorDocumentText(value: unknown): string {
  if (!isRecord(value)) return '';
  if (value.type === 'text' && typeof value.text === 'string') return value.text;
  if (value.type === 'hardBreak') return '\n';
  if (!Array.isArray(value.content)) return '';
  const text = value.content.map(getEditorDocumentText).filter(Boolean);
  const blockTypes = ['doc', 'paragraph', 'heading', 'bulletList', 'orderedList', 'listItem', 'blockquote'];
  const separator = typeof value.type === 'string' && blockTypes.includes(value.type) ? ' ' : '';
  return text.join(separator).replace(/\s+/g, ' ').trim();
}

export function wordCount(value: string): number {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

export function estimateReadTime(value: string): string {
  return `${Math.max(1, Math.ceil(wordCount(value) / 220))} min read`;
}

export function estimateStoredContentReadTime(value: string | null | undefined): string {
  const parsed = parseEditorContent(value);
  const text = typeof parsed === 'string'
    ? DOMPurify.sanitize(parsed, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] })
    : getEditorDocumentText(parsed);
  return estimateReadTime(text);
}
