import { useEffect, useMemo, useRef, useState } from 'react';
import type { MouseEvent, SyntheticEvent } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import { Color, FontSize, TextStyle } from '@tiptap/extension-text-style';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import Placeholder from '@tiptap/extension-placeholder';
import Image from '@tiptap/extension-image';
import {
  AlignCenter, AlignJustify, AlignLeft, AlignRight, Bold, ExternalLink,
  Highlighter, ImagePlus, Italic, Link2, List, ListOrdered, Minus,
  Redo2, Strikethrough, Underline as UnderlineIcon, Unlink, Undo2, X,
} from 'lucide-react';
import { estimateReadTime, getEditorDocumentText, isSafeBlogLink, parseEditorContent } from '../../utils/blogContent';
import './BlogRichTextEditor.css';

type Props = {
  value: string;
  onChange: (value: string, plainText: string) => void;
};

function isExternalUrl(href: string): boolean {
  try {
    return new URL(href, window.location.origin).origin !== window.location.origin;
  } catch {
    return false;
  }
}

function ToolbarButton({
  label,
  active,
  disabled,
  onClick,
  children,
}: {
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: import('react').ReactNode;
}) {
  const preserveSelection = (event: MouseEvent<HTMLButtonElement>) => event.preventDefault();
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={active}
      disabled={disabled}
      onMouseDown={preserveSelection}
      onClick={onClick}
      className={`blog-editor-tool ${active ? 'is-active' : ''}`}
    >
      {children}
    </button>
  );
}

export function BlogRichTextEditor({ value, onChange }: Props) {
  const selectionRef = useRef<{ from: number; to: number } | null>(null);
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [linkHref, setLinkHref] = useState('');
  const [linkNewTab, setLinkNewTab] = useState(true);
  const [linkError, setLinkError] = useState('');
  const [selectedWordSnippet, setSelectedWordSnippet] = useState('');
  const [imageError, setImageError] = useState('');
  const urlInputRef = useRef<HTMLInputElement>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const extensions = useMemo(() => [
    StarterKit.configure({ link: false, underline: false, heading: { levels: [1, 2, 3, 4] } }),
    Link.configure({
      // Keep links editable inside the admin editor. Published links remain normal anchors.
      openOnClick: false,
      autolink: false,
      linkOnPaste: false,
      protocols: ['http', 'https', 'mailto', 'tel'],
      HTMLAttributes: {
        class: 'blog-inline-link',
        rel: 'noopener noreferrer',
      },
    }),
    Underline,
    TextStyle,
    Color,
    FontSize,
    TextAlign.configure({ types: ['heading', 'paragraph'] }),
    Highlight.configure({ multicolor: true }),
    Placeholder.configure({ placeholder: 'Start writing your article. Select any word, phrase, or sentence to attach hyperlinks…' }),
    Image.configure({ inline: false, allowBase64: false }),
  ], []);

  const editor = useEditor({
    extensions,
    content: parseEditorContent(value),
    immediatelyRender: false,
    editorProps: { attributes: { class: 'blog-editor-content', 'aria-label': 'Blog article content' } },
    onUpdate: ({ editor: currentEditor }) => {
      const document = currentEditor.getJSON();
      onChangeRef.current(JSON.stringify(document), currentEditor.getText({ blockSeparator: '\n\n' }));
    },
  });

  useEffect(() => {
    if (!editor) return;
    const parsed = parseEditorContent(value);
    if (JSON.stringify(editor.getJSON()) !== JSON.stringify(parsed)) {
      editor.commands.setContent(parsed, { emitUpdate: false });
    }
  }, [editor, value]);

  const openLinkDialog = () => {
    if (!editor) return;
    const activeLink = editor.getAttributes('link');
    const href = typeof activeLink.href === 'string' ? activeLink.href : '';
    const { from, to } = editor.state.selection;

    // If cursor is inside a link with empty selection, expand to full link mark
    if (from === to && href) {
      editor.chain().focus().extendMarkRange('link').run();
    }

    const updatedSelection = editor.state.selection;
    selectionRef.current = { from: updatedSelection.from, to: updatedSelection.to };

    // Extract selected text preview snippet
    const rawSelectedText = editor.state.doc.textBetween(updatedSelection.from, updatedSelection.to, ' ');
    setSelectedWordSnippet(rawSelectedText.trim());

    setLinkHref(href);
    setLinkNewTab(
      activeLink.target === '_blank' || (!activeLink.target && href ? isExternalUrl(href) : true),
    );
    setLinkError(
      updatedSelection.from === updatedSelection.to && !href
        ? 'Select any word, phrase, or sentence first to attach a hyperlink.'
        : '',
    );
    setLinkDialogOpen(true);

    setTimeout(() => {
      urlInputRef.current?.focus();
      urlInputRef.current?.select();
    }, 40);
  };

  const saveLink = (event: SyntheticEvent) => {
    event.preventDefault();
    // Stop the submit from bubbling to the parent article <form> in BlogManager.
    // Otherwise Apply/Enter would trigger the outer form's handleSave and close
    // the entire editor section. We only want to close this URL popup.
    event.stopPropagation();
    if (!editor) return;

    // The editor loses DOM focus when the URL dialog opens. Use the exact
    // ProseMirror selection captured before opening that dialog.
    const targetSelection = selectionRef.current;
    if (!targetSelection || targetSelection.from === targetSelection.to) {
      setLinkError('Select the specific word, phrase, or sentence you want to hyperlink.');
      return;
    }

    let cleanHref = linkHref.trim();
    if (!cleanHref) {
      setLinkError('Please enter a destination URL.');
      return;
    }

    // Allow common domains entered without a protocol, e.g. www.youtube.com.
    if (/^(www\.)/i.test(cleanHref)) {
      cleanHref = `https://${cleanHref}`;
    }

    if (!isSafeBlogLink(cleanHref)) {
      setLinkError('Invalid URL. Use https://, http://, an internal /path, mailto:, or tel:.');
      return;
    }

    const target = linkNewTab ? '_blank' : null;
    const rel = linkNewTab ? 'noopener noreferrer' : null;

    const applied = editor
      .chain()
      .focus()
      .setTextSelection(targetSelection)
      .setLink({
        href: cleanHref,
        target,
        rel,
        class: 'blog-inline-link',
      })
      .run();

    if (!applied) {
      setLinkError('The link could not be applied. Please select the text again and retry.');
      return;
    }

    setLinkDialogOpen(false);
    setLinkError('');
    selectionRef.current = null;
  };

  const removeLink = () => {
    if (!editor) return;
    const targetSelection = selectionRef.current || { from: editor.state.selection.from, to: editor.state.selection.to };
    editor
      .chain()
      .focus()
      .setTextSelection(targetSelection)
      .extendMarkRange('link')
      .unsetLink()
      .run();
    setLinkDialogOpen(false);
    setLinkError('');
    selectionRef.current = null;
  };

  const insertImage = () => {
    if (!editor) return;
    const src = window.prompt('Enter the public image URL (https://...)');
    if (!src) return;
    if (!isSafeBlogLink(src) || !/^https?:\/\//i.test(src)) {
      setImageError('Please enter a valid secure image URL starting with https://');
      return;
    }
    setImageError('');
    editor.chain().focus().setImage({ src: src.trim(), alt: 'Article image' }).run();
  };

  if (!editor) return <div className="blog-editor-loading">Preparing rich text editor…</div>;

  const text = getEditorDocumentText(editor.getJSON());
  const active = (name: string, attributes?: Record<string, unknown>) => editor.isActive(name, attributes);
  const command = (run: () => boolean) => { run(); };
  const currentLinkAttrs = editor.getAttributes('link');
  const hasActiveLink = Boolean(currentLinkAttrs?.href);

  // Helper for bubble menu buttons to preserve text selection during click
  const preventBlur = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
  };

  return (
    <div className="blog-rich-editor">
      {/* 1. Main Static Toolbar */}
      <div className="blog-editor-toolbar" role="toolbar" aria-label="Article formatting">
        <div className="blog-editor-tool-group">
          <ToolbarButton label="Undo (Ctrl+Z)" disabled={!editor.can().undo()} onClick={() => command(() => editor.chain().focus().undo().run())}><Undo2 /></ToolbarButton>
          <ToolbarButton label="Redo (Ctrl+Y)" disabled={!editor.can().redo()} onClick={() => command(() => editor.chain().focus().redo().run())}><Redo2 /></ToolbarButton>
        </div>
        <span className="blog-editor-divider" />
        <select
          aria-label="Text style"
          className="blog-editor-select"
          value={editor.isActive('heading') ? String(editor.getAttributes('heading').level) : 'paragraph'}
          onChange={(event) => {
            const level = Number(event.target.value);
            if (level) editor.chain().focus().toggleHeading({ level: level as 1 | 2 | 3 | 4 }).run();
            else editor.chain().focus().setParagraph().run();
          }}
        >
          <option value="paragraph">Paragraph</option>
          <option value="1">Heading 1</option>
          <option value="2">Heading 2</option>
          <option value="3">Heading 3</option>
          <option value="4">Heading 4</option>
        </select>
        <div className="blog-editor-tool-group">
          <ToolbarButton label="Bold" active={active('bold')} onClick={() => command(() => editor.chain().focus().toggleBold().run())}><Bold /></ToolbarButton>
          <ToolbarButton label="Italic" active={active('italic')} onClick={() => command(() => editor.chain().focus().toggleItalic().run())}><Italic /></ToolbarButton>
          <ToolbarButton label="Underline" active={active('underline')} onClick={() => command(() => editor.chain().focus().toggleUnderline().run())}><UnderlineIcon /></ToolbarButton>
          <ToolbarButton label="Strikethrough" active={active('strike')} onClick={() => command(() => editor.chain().focus().toggleStrike().run())}><Strikethrough /></ToolbarButton>
          <ToolbarButton label="Highlight" active={active('highlight')} onClick={() => command(() => editor.chain().focus().toggleHighlight({ color: '#fff3a3' }).run())}><Highlighter /></ToolbarButton>
        </div>
        <div className="blog-editor-color">
          <label title="Text color">A<input type="color" aria-label="Text color" onChange={(event) => editor.chain().focus().setColor(event.target.value).run()} /></label>
          <label title="Highlight color"><span>▰</span><input type="color" aria-label="Highlight color" onChange={(event) => editor.chain().focus().toggleHighlight({ color: event.target.value }).run()} /></label>
        </div>
        <select
          aria-label="Font size"
          className="blog-editor-select blog-editor-size"
          defaultValue=""
          onChange={(event) => {
            if (event.target.value) editor.chain().focus().setMark('textStyle', { fontSize: event.target.value }).run();
            event.currentTarget.value = '';
          }}
        >
          <option value="" disabled>Size</option>
          <option value="12px">12 px</option>
          <option value="14px">14 px</option>
          <option value="16px">16 px</option>
          <option value="18px">18 px</option>
          <option value="20px">20 px</option>
          <option value="24px">24 px</option>
          <option value="32px">32 px</option>
        </select>
        <span className="blog-editor-divider" />
        <div className="blog-editor-tool-group">
          <ToolbarButton label="Align left" active={active('paragraph', { textAlign: 'left' }) || active('heading', { textAlign: 'left' })} onClick={() => command(() => editor.chain().focus().setTextAlign('left').run())}><AlignLeft /></ToolbarButton>
          <ToolbarButton label="Align center" active={active('paragraph', { textAlign: 'center' }) || active('heading', { textAlign: 'center' })} onClick={() => command(() => editor.chain().focus().setTextAlign('center').run())}><AlignCenter /></ToolbarButton>
          <ToolbarButton label="Align right" active={active('paragraph', { textAlign: 'right' }) || active('heading', { textAlign: 'right' })} onClick={() => command(() => editor.chain().focus().setTextAlign('right').run())}><AlignRight /></ToolbarButton>
          <ToolbarButton label="Justify" active={active('paragraph', { textAlign: 'justify' }) || active('heading', { textAlign: 'justify' })} onClick={() => command(() => editor.chain().focus().setTextAlign('justify').run())}><AlignJustify /></ToolbarButton>
          <ToolbarButton label="Bulleted list" active={active('bulletList')} onClick={() => command(() => editor.chain().focus().toggleBulletList().run())}><List /></ToolbarButton>
          <ToolbarButton label="Numbered list" active={active('orderedList')} onClick={() => command(() => editor.chain().focus().toggleOrderedList().run())}><ListOrdered /></ToolbarButton>
          <ToolbarButton label="Blockquote" active={active('blockquote')} onClick={() => command(() => editor.chain().focus().toggleBlockquote().run())}><span className="blog-editor-quote-icon">“</span></ToolbarButton>
          <ToolbarButton label="Horizontal separator" onClick={() => command(() => editor.chain().focus().setHorizontalRule().run())}><Minus /></ToolbarButton>
          <ToolbarButton label="Insert image URL" onClick={insertImage}><ImagePlus /></ToolbarButton>
        </div>
        <span className="blog-editor-divider" />
        <div className="blog-editor-tool-group">
          <ToolbarButton
            label={hasActiveLink ? 'Edit selected hyperlink' : 'Attach hyperlink to selection'}
            active={hasActiveLink}
            onClick={openLinkDialog}
          >
            <Link2 />
          </ToolbarButton>
          {hasActiveLink && (
            <ToolbarButton label="Remove hyperlink" onClick={removeLink}>
              <Unlink />
            </ToolbarButton>
          )}
        </div>
      </div>

      {/* 2. Floating Contextual Toolbar / Bubble Menu near selected words */}
      <BubbleMenu
        editor={editor}
        className="blog-bubble-menu"
        shouldShow={({ editor: currentEditor, from, to }) => {
          // Show when text is selected (word, phrase, or sentence) OR cursor is directly on a link mark
          if (!currentEditor.isEditable) return false;
          if (from !== to) return true;
          return currentEditor.isActive('link');
        }}
      >
        <div className="blog-bubble-menu__inner">
          <button
            type="button"
            className={`blog-bubble-btn ${editor.isActive('bold') ? 'is-active' : ''}`}
            onMouseDown={preventBlur}
            onClick={() => editor.chain().focus().toggleBold().run()}
            title="Bold"
          >
            <Bold size={14} />
          </button>
          <button
            type="button"
            className={`blog-bubble-btn ${editor.isActive('italic') ? 'is-active' : ''}`}
            onMouseDown={preventBlur}
            onClick={() => editor.chain().focus().toggleItalic().run()}
            title="Italic"
          >
            <Italic size={14} />
          </button>
          <button
            type="button"
            className={`blog-bubble-btn ${editor.isActive('underline') ? 'is-active' : ''}`}
            onMouseDown={preventBlur}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            title="Underline"
          >
            <UnderlineIcon size={14} />
          </button>
          <button
            type="button"
            className={`blog-bubble-btn ${editor.isActive('strike') ? 'is-active' : ''}`}
            onMouseDown={preventBlur}
            onClick={() => editor.chain().focus().toggleStrike().run()}
            title="Strikethrough"
          >
            <Strikethrough size={14} />
          </button>
          <button
            type="button"
            className={`blog-bubble-btn ${editor.isActive('highlight') ? 'is-active' : ''}`}
            onMouseDown={preventBlur}
            onClick={() => editor.chain().focus().toggleHighlight({ color: '#fff3a3' }).run()}
            title="Highlight"
          >
            <Highlighter size={14} />
          </button>

          <span className="blog-bubble-divider" />

          {/* Link button with Chain Icon */}
          <button
            type="button"
            className={`blog-bubble-btn blog-bubble-link-btn ${hasActiveLink ? 'is-active' : ''}`}
            onMouseDown={preventBlur}
            onClick={openLinkDialog}
            title={hasActiveLink ? 'Edit link URL' : 'Attach hyperlink (Chain)'}
          >
            <Link2 size={15} />
            <span className="blog-bubble-btn-text">{hasActiveLink ? 'Edit Link' : 'Link'}</span>
          </button>

          {hasActiveLink && (
            <>
              {currentLinkAttrs?.href && (
                <a
                  href={currentLinkAttrs.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="blog-bubble-open-btn"
                  title={`Open ${currentLinkAttrs.href}`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink size={13} />
                </a>
              )}
              <button
                type="button"
                className="blog-bubble-btn blog-bubble-unlink-btn"
                onMouseDown={preventBlur}
                onClick={removeLink}
                title="Remove hyperlink"
              >
                <Unlink size={14} />
              </button>
            </>
          )}
        </div>
      </BubbleMenu>

      {/* 3. Editor Stage */}
      <div className="blog-editor-stage">
        <EditorContent editor={editor} />
      </div>

      {/* 4. Footer info */}
      <div className="blog-editor-footer">
        <div className="blog-editor-footer__stats">
          <span>{text.trim() ? text.trim().split(/\s+/).length : 0} words</span>
          <span>·</span>
          <span>{estimateReadTime(text)}</span>
          <span className="blog-editor-footer__tip">Tip: highlight any word or phrase to bring up the floating Link toolbar</span>
        </div>
        {imageError && <span className="blog-editor-error">{imageError}</span>}
      </div>

      {/* 5. URL Modal / Popup */}
      {linkDialogOpen && (
        <div
          className="blog-link-dialog-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setLinkDialogOpen(false);
          }}
        >
          <div
            className="blog-link-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="blog-link-title"
          >
            <div className="blog-link-dialog__heading">
              <div>
                <span className="blog-link-dialog__tag">WORD-LEVEL HYPERLINK</span>
                <h3 id="blog-link-title">{hasActiveLink ? 'Edit Hyperlink' : 'Attach Hyperlink'}</h3>
              </div>
              <button
                type="button"
                aria-label="Close link dialog"
                className="blog-link-dialog__close"
                onClick={() => setLinkDialogOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            {selectedWordSnippet && (
              <div className="blog-link-dialog__preview">
                <span className="blog-link-dialog__preview-label">Selected text:</span>
                <span className="blog-link-dialog__preview-text">“{selectedWordSnippet}”</span>
              </div>
            )}

            <div className="blog-link-dialog__field">
              <label htmlFor="blog-link-url">Enter URL</label>
              <div className="blog-link-dialog__input-wrapper">
                <Link2 size={16} className="blog-link-dialog__input-icon" />
                <input
                  id="blog-link-url"
                  ref={urlInputRef}
                  type="text"
                  inputMode="url"
                  autoComplete="off"
                  placeholder="https://www.youtube.com/ or https://example.com"
                  value={linkHref}
                  onChange={(event) => {
                    setLinkHref(event.target.value);
                    if (linkError) setLinkError('');
                  }}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault();
                      saveLink(event);
                    }
                  }}
                />
              </div>
              <small className="blog-link-dialog__help">
                Supported: HTTPS, HTTP, internal /routes, mailto:, and tel:. Javascript: and dangerous schemes are blocked.
              </small>
            </div>

            <label className="blog-link-dialog__toggle">
              <input
                type="checkbox"
                checked={linkNewTab}
                onChange={(event) => setLinkNewTab(event.target.checked)}
              />
              <span>
                <strong>Open in new tab</strong>
                <small>Appends target="_blank" and secure rel="noopener noreferrer" for external sites.</small>
              </span>
            </label>

            {linkError && (
              <p role="alert" className="blog-editor-error blog-dialog-error">
                {linkError}
              </p>
            )}

            <div className="blog-link-dialog__actions">
              {hasActiveLink && (
                <button
                  type="button"
                  className="blog-link-dialog__btn-danger"
                  onClick={removeLink}
                >
                  Remove Link
                </button>
              )}
              <div className="blog-link-dialog__actions-right">
                <button
                  type="button"
                  className="blog-link-dialog__btn-cancel"
                  onClick={() => setLinkDialogOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="blog-link-dialog__btn-apply"
                  onClick={(event) => saveLink(event)}
                >
                  {hasActiveLink ? 'Update' : 'Apply'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BlogRichTextEditor;
