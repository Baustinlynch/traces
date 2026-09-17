import { marked } from 'marked';
import { gfmHeadingId } from 'marked-gfm-heading-id';
import { markedHighlight } from 'marked-highlight';
import DOMPurify from 'dompurify';
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

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
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
      const href = doc ? `#/${doc.route}` : '#/docs';
      return `<a class="internal-link" href="${href}">${escapeHtml(token.alias)}</a>`;
    }
  };
}

const calloutExtension = {
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
    const body = token.text ? marked.parse(token.text) : '';
    return `<div class="callout callout-${escapeHtml(token.calloutType)}"><div class="callout-title">${escapeHtml(token.title)}</div><div class="callout-body">${body}</div></div>`;
  }
};

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

function createRenderer() {
  const renderer = new marked.Renderer();

  renderer.link = ({ href, title, tokens }) => {
    const text = parser.parseInline(tokens);
    const safeHref = escapeHtml(normalizeUrl(href ?? '#'));
    const titleAttr = title ? ` title="${escapeHtml(title)}"` : '';
    const isInternal = safeHref.startsWith('#/');
    const rel = isInternal ? '' : ' rel="noopener"';
    const target = isInternal ? '' : ' target="_blank"';
    return `<a href="${safeHref}"${titleAttr}${target}${rel}>${text}</a>`;
  };

  renderer.image = ({ href, text, title }) => {
    const safeHref = escapeHtml(normalizeUrl(href ?? ''));
    const alt = escapeHtml(text ?? '');
    const titleAttr = title ? ` title="${escapeHtml(title)}"` : '';
    return `<img src="${safeHref}" alt="${alt}"${titleAttr} loading="lazy" />`;
  };

  renderer.code = ({ text, lang }) => {
    const language = (lang || 'text').toLowerCase();
    const grammar = Prism.languages[language] || Prism.languages.plain || null;
    const highlighted = grammar ? Prism.highlight(text, grammar, language) : escapeHtml(text);
    return `<pre class="code-block language-${escapeHtml(language)}"><code class="language-${escapeHtml(language)}">${highlighted}</code></pre>`;
  };

  renderer.blockquote = ({ tokens }) => {
    return `<blockquote>${parser.parse(tokens)}</blockquote>`;
  };

  return renderer;
}

let parser;

export function renderMarkdown(markdown, docs = []) {
  parser = new marked.Parser();

  marked.setOptions({
    gfm: true,
    breaks: true,
    renderer: createRenderer()
  });

  marked.use(gfmHeadingId());
  marked.use(markedHighlight({
    emptyLangClass: 'language-text',
    highlight(code, lang) {
      const language = (lang || 'text').toLowerCase();
      const grammar = Prism.languages[language] || Prism.languages.plain;
      return grammar ? Prism.highlight(code, grammar, language) : escapeHtml(code);
    }
  }));
  marked.use({ extensions: [createWikilinkExtension(docs), calloutExtension, taskListExtension] });

  const html = marked.parse(markdown);

  return DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
    ADD_ATTR: ['target', 'rel', 'class', 'checked', 'disabled', 'loading'],
    ADD_TAGS: ['input']
  });
}
