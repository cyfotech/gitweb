import assert from 'node:assert/strict';
import test from 'node:test';
import type { JSONContent } from '@tiptap/core';
import {
  estimateReadTime,
  getEditorDocumentText,
  isSafeBlogLink,
  parseEditorContent,
} from './blogContent';

test('stored rich article JSON round-trips headings, formatting, and independent links', () => {
  const document: JSONContent = {
    type: 'doc',
    content: [
      { type: 'heading', attrs: { level: 2, textAlign: 'center' }, content: [{ type: 'text', text: 'Article heading' }] },
      {
        type: 'paragraph',
        content: [
          { type: 'text', text: 'IRS research', marks: [{ type: 'bold' }, { type: 'link', attrs: { href: 'https://irs.gov/research', target: '_blank' } }] },
          { type: 'text', text: ' and tax planning', marks: [{ type: 'link', attrs: { href: 'https://example.com/planning' } }] },
        ],
      },
    ],
  };

  const loaded = parseEditorContent(JSON.stringify(document));
  assert.deepEqual(loaded, document);
  assert.equal(getEditorDocumentText(loaded), 'Article heading IRS research and tax planning');
  assert.equal(estimateReadTime(getEditorDocumentText(loaded)), '1 min read');
});

test('supports selecting individual words and adding multiple independent hyperlinks in one paragraph', () => {
  const paragraphDoc: JSONContent = {
    type: 'doc',
    content: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'Digital marketing',
            marks: [{ type: 'link', attrs: { href: 'https://example.com/marketing', target: '_blank', rel: 'noopener noreferrer' } }],
          },
          {
            type: 'text',
            text: ' helps businesses improve their ',
          },
          {
            type: 'text',
            text: 'online presence',
            marks: [{ type: 'link', attrs: { href: 'https://example.com/presence', target: '_blank', rel: 'noopener noreferrer' } }],
          },
          {
            type: 'text',
            text: ' and reach more ',
          },
          {
            type: 'text',
            text: 'customers',
            marks: [{ type: 'link', attrs: { href: '/services/consulting' } }],
          },
          {
            type: 'text',
            text: '.',
          },
        ],
      },
    ],
  };

  const rawJson = JSON.stringify(paragraphDoc);
  const parsed = parseEditorContent(rawJson) as JSONContent;
  assert.equal(parsed.type, 'doc');
  const p = parsed.content?.[0];
  assert.equal(p?.type, 'paragraph');
  assert.equal(p?.content?.length, 6);

  // Check word 1
  assert.equal(p?.content?.[0].text, 'Digital marketing');
  assert.equal(p?.content?.[0].marks?.[0].attrs?.href, 'https://example.com/marketing');
  assert.equal(p?.content?.[0].marks?.[0].attrs?.target, '_blank');

  // Check unlinked middle text
  assert.equal(p?.content?.[1].text, ' helps businesses improve their ');
  assert.equal(p?.content?.[1].marks, undefined);

  // Check word 2
  assert.equal(p?.content?.[2].text, 'online presence');
  assert.equal(p?.content?.[2].marks?.[0].attrs?.href, 'https://example.com/presence');

  // Check word 3 internal link
  assert.equal(p?.content?.[4].text, 'customers');
  assert.equal(p?.content?.[4].marks?.[0].attrs?.href, '/services/consulting');
});

test('inline links reject executable protocols and dangerous schemes while allowing valid destinations', () => {
  assert.equal(isSafeBlogLink('https://example.com/resource'), true);
  assert.equal(isSafeBlogLink('http://example.com/insecure'), true);
  assert.equal(isSafeBlogLink('/services/tax-advisory'), true);
  assert.equal(isSafeBlogLink('mailto:support@preferredtax.com'), true);
  assert.equal(isSafeBlogLink('tel:+1234567890'), true);

  // Dangerous / XSS schemes
  assert.equal(isSafeBlogLink('javascript:alert(1)'), false);
  assert.equal(isSafeBlogLink('JAVASCRIPT:alert(1)'), false);
  assert.equal(isSafeBlogLink('data:text/html,<script>alert(1)</script>'), false);
  assert.equal(isSafeBlogLink('vbscript:msgbox(1)'), false);
  assert.equal(isSafeBlogLink('file:///etc/passwd'), false);
  assert.equal(isSafeBlogLink('   '), false);
  assert.equal(isSafeBlogLink(null), false);
  assert.equal(isSafeBlogLink(undefined), false);
});
