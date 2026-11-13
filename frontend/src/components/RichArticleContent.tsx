import type { CSSProperties, ReactNode } from 'react';
import type { JSONContent } from '@tiptap/core';
import { getEditorDocumentText, isSafeBlogLink, parseEditorContent, sanitizeLegacyHtml } from '../utils/blogContent';

function safeColor(value: unknown): string | undefined {
  if (typeof value !== 'string' || !/^(#[\da-f]{3,8}|rgba?\([\d\s.,%]+\)|hsla?\([\d\s.,%]+\))$/i.test(value)) return undefined;
  return value;
}

function safeFontSize(value: unknown): string | undefined {
  if (typeof value !== 'string' || !/^(?:\d+(?:\.\d+)?)(?:px|rem|em|%)$/.test(value)) return undefined;
  const amount = Number.parseFloat(value);
  return amount >= 10 && amount <= 72 ? value : undefined;
}

function renderNode(node: JSONContent, key: string): ReactNode {
  if (node.type === 'text') {
    let output: ReactNode = node.text || '';
    for (const mark of node.marks || []) {
      const attrs = mark.attrs || {};
      if (mark.type === 'bold') {
        output = <strong key={`${key}-bold`}>{output}</strong>;
      } else if (mark.type === 'italic') {
        output = <em key={`${key}-italic`}>{output}</em>;
      } else if (mark.type === 'underline') {
        output = <u key={`${key}-underline`}>{output}</u>;
      } else if (mark.type === 'strike') {
        output = <s key={`${key}-strike`}>{output}</s>;
      } else if (mark.type === 'highlight') {
        const backgroundColor = safeColor(attrs.color) || '#fff3a3';
        output = <mark key={`${key}-highlight`} style={{ backgroundColor }}>{output}</mark>;
      } else if (mark.type === 'textStyle') {
        const style: CSSProperties = {};
        const color = safeColor(attrs.color);
        const fontSize = safeFontSize(attrs.fontSize);
        if (color) style.color = color;
        if (fontSize) style.fontSize = fontSize;
        output = <span key={`${key}-style`} style={style}>{output}</span>;
      } else if (mark.type === 'link' && isSafeBlogLink(attrs.href)) {
        const target = attrs.target === '_blank' ? '_blank' : undefined;
        // Output genuine standard HTML <a> href tag
        output = (
          <a
            key={`${key}-link`}
            href={attrs.href}
            target={target}
            rel={target === '_blank' ? 'noopener noreferrer' : (typeof attrs.rel === 'string' ? attrs.rel : undefined)}
            className="blog-content-link"
          >
            {output}
          </a>
        );
      }
    }
    return output;
  }

  const children = (node.content || []).map((child, index) => renderNode(child, `${key}-${index}`));
  const attrs = node.attrs || {};
  const textAlign = ['left', 'center', 'right', 'justify'].includes(String(attrs.textAlign))
    ? attrs.textAlign as CSSProperties['textAlign']
    : undefined;
  const alignmentStyle: CSSProperties | undefined = textAlign ? { textAlign } : undefined;

  switch (node.type) {
    case 'doc': return <>{children}</>;
    case 'paragraph': return <p key={key} style={alignmentStyle}>{children}</p>;
    case 'heading': {
      const level = Math.min(4, Math.max(1, Number(attrs.level) || 2));
      const style = alignmentStyle;
      if (level === 1) return <h1 key={key} style={style}>{children}</h1>;
      if (level === 2) return <h2 key={key} style={style}>{children}</h2>;
      if (level === 3) return <h3 key={key} style={style}>{children}</h3>;
      return <h4 key={key} style={style}>{children}</h4>;
    }
    case 'bulletList': return <ul key={key}>{children}</ul>;
    case 'orderedList': return <ol key={key} start={Number(attrs.start) > 1 ? Number(attrs.start) : undefined}>{children}</ol>;
    case 'listItem': return <li key={key}>{children}</li>;
    case 'blockquote': return <blockquote key={key}>{children}</blockquote>;
    case 'horizontalRule': return <hr key={key} />;
    case 'hardBreak': return <br key={key} />;
    case 'image': {
      if (!isSafeBlogLink(attrs.src)) return null;
      return <img key={key} src={attrs.src} alt={typeof attrs.alt === 'string' ? attrs.alt : ''} loading="lazy" />;
    }
    default: return null;
  }
}

export function RichArticleContent({ content }: { content: string | null | undefined }) {
  if (!content?.trim()) return null;
  const parsed = parseEditorContent(content);

  if (typeof parsed === 'string') {
    return (
      <div
        className="blog-content"
        dangerouslySetInnerHTML={{ __html: sanitizeLegacyHtml(parsed) }}
      />
    );
  }

  if (parsed.type !== 'doc' || !Array.isArray(parsed.content)) {
    return <p className="blog-content">{getEditorDocumentText(parsed)}</p>;
  }

  return <div className="blog-content">{renderNode(parsed, 'article')}</div>;
}
