import { Marked } from 'marked';
import { gfmHeadingId } from 'marked-gfm-heading-id';
import { markedHighlight } from 'marked-highlight';
import DOMPurify from 'isomorphic-dompurify';
import Prism from 'prismjs';
import 'prismjs/components/prism-markup.js';
import 'prismjs/components/prism-css.js';
import 'prismjs/components/prism-javascript.js';
import 'prismjs/components/prism-typescript.js';
import 'prismjs/components/prism-json.js';
import 'prismjs/components/prism-bash.js';
import 'prismjs/components/prism-markdown.js';
import 'prismjs/components/prism-python.js';
import 'prismjs/components/prism-c.js';
import 'prismjs/components/prism-cpp.js';
import 'prismjs/components/prism-arduino.js';

function highlight(code, lang) {
  const language = (lang || 'text').toLowerCase();
  const grammar = Prism.languages[language] || Prism.languages.plain;
  return grammar ? Prism.highlight(code, grammar, language) : escapeHtml(code);
}

function normalizeUrl(url) {
  if (!url) return '#';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('mailto:') || url.startsWith('#/') || url.startsWith('#')) {
    return url;
  }
  if (url.startsWith('https:') && !url.startsWith('https://')) {
    return url.replace('https:', 'https://');
  }
  if (url.startsWith('http:') && !url.startsWith('http://')) {
    return url.replace('http:', 'http://');
  }
  return url;
}

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

/**
 * Custom renderer. Each method is invoked by a marked.Parser, which sets
 * `this.parser` and `this.options` on the renderer, so we can re-parse nested
 * tokens with the exact same configuration (including extensions).
 */
function createRenderer() {
  return {
    link({ href, title, tokens }) {
      const text = this.parser.parseInline(tokens);
      const safeHref = escapeHtml(normalizeUrl(href ?? '#'));
      const titleAttr = title ? ` title="${escapeHtml(title)}"` : '';
      const isInternal = safeHref.startsWith('/') || safeHref.startsWith('#');
      const rel = isInternal ? '' : ' rel="noopener"';
      const target = isInternal ? '' : ' target="_blank"';
      return `<a href="${safeHref}"${titleAttr}${target}${rel}>${text}</a>`;
    },
    image({ href, text, title }) {
      // Parse custom size syntax: ![alt](url =widthxheight)
      let safeHref = href ?? '';
      let width = null;
      let height = null;

      const sizeMatch = safeHref.match(/^(.+?)\s*=\s*(\d+)\s*x\s*(\d+)$/i);
      if (sizeMatch) {
        safeHref = sizeMatch[1];
        width = sizeMatch[2];
        height = sizeMatch[3];
      }

      const safeSrc = escapeHtml(normalizeUrl(safeHref));
      const alt = escapeHtml(text ?? '');
      const titleAttr = title ? ` title="${escapeHtml(title)}"` : '';
      const widthAttr = width ? ` width="${width}"` : '';
      const heightAttr = height ? ` height="${height}"` : '';
      return `<img src="${safeSrc}" alt="${alt}"${titleAttr}${widthAttr}${heightAttr} loading="lazy" />`;
    },
    code({ text, lang }) {
      const language = (lang || 'text').toLowerCase();
      const highlighted = highlight(text, language);
      return `<pre class="code-block language-${escapeHtml(language)}"><code class="language-${escapeHtml(language)}">${highlighted}</code></pre>`;
    },
    blockquote({ tokens }) {
      return `<blockquote>${this.parser.parse(tokens)}</blockquote>`;
    }
  };
}

function createWikilinkExtension(docs) {
  const docLookup = new Map(
    docs.map((doc) => [doc.title.toLowerCase(), doc])
  );

  return {
    name: 'wikilink',
    level: 'inline',
    start(src) {
      return src.indexOf('[[');
    },
    tokenizer(src) {
      const match = src.match(/^\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/);
      if (!match) return;

      const target = match[1].trim();
      const alias = (match[2] ?? target).trim();
      return {
        type: 'wikilink',
        raw: match[0],
        target,
        alias
      };
    },
    renderer(token) {
      const doc = docLookup.get(token.target.toLowerCase());
      const href = doc ? doc.href : '/docs';
      return `<a class="internal-link" href="${href}">${escapeHtml(token.alias)}</a>`;
    }
  };
}

function createCalloutExtension(parse) {
  return {
    name: 'callout',
    level: 'block',
    start(src) {
      return src.match(/^>\s*\[!/m)?.index;
    },
    tokenizer(src) {
      const match = src.match(/^(>\s*\[!([a-zA-Z-]+)\](?:\s*([+-]))?\s*(.*)(?:\n(?:>.*|>\s*)?)*)/);
      if (!match) return;

      const raw = match[1];
      const type = match[2].toLowerCase();
      const title = match[4]?.trim() || type;
      const lines = raw
        .split('\n')
        .map((line) => line.replace(/^>\s?/, ''))
        .slice(1)
        .join('\n')
        .trim();

      return {
        type: 'callout',
        raw,
        calloutType: type,
        title,
        text: lines
      };
    },
    renderer(token) {
      const body = token.text ? parse(token.text) : '';
      return `<div class="callout callout-${escapeHtml(token.calloutType)}"><div class="callout-title">${escapeHtml(token.title)}</div><div class="callout-body">${body}</div></div>`;
    }
  };
}

const taskListExtension = {
  name: 'tasklistitem',
  level: 'inline',
  start(src) {
    return src.match(/\[[ xX]\]/)?.index;
  },
  tokenizer(src) {
    const match = src.match(/^\[([ xX])\]\s+/);
    if (!match) return;
    return {
      type: 'tasklistitem',
      raw: match[0],
      checked: match[1].toLowerCase() === 'x'
    };
  },
  renderer(token) {
    return `<input class="task-list-item-checkbox" type="checkbox" disabled ${token.checked ? 'checked' : ''} /> `;
  }
};

/**
 * Render a markdown doc to sanitized HTML.
 *
 * Each call builds a fresh marked instance: marked accumulates extensions,
 * tokenizers and renderers in an instance's defaults every time `.use()` is
 * called, so reconfiguring a shared/global instance per render compounds
 * forever (the Nth render walks N copies of every extension → OOM). Creating
 * a new instance per call keeps every render independent and cheap.
 */
export function renderMarkdown(markdown, docs = []) {
  const md = new Marked({
    gfm: true,
    breaks: true,
    renderer: createRenderer()
  });

  md.use(gfmHeadingId());
  md.use(markedHighlight({
    emptyLangClass: 'language-text',
    highlight
  }));
  md.use({
    extensions: [
      createWikilinkExtension(docs),
      createCalloutExtension((src) => md.parse(src)),
      taskListExtension
    ]
  });

  const html = md.parse(markdown);

  return DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
    ADD_ATTR: ['target', 'rel', 'class', 'checked', 'disabled', 'loading', 'width', 'height'],
    ADD_TAGS: ['input']
  });
}