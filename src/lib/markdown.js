import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import prism from '@mapbox/rehype-prism';
import rehypeStringify from 'rehype-stringify';
import DOMPurify from 'isomorphic-dompurify';
import rehypeDocs, { handlers } from './markdown/rehype-docs.js';
import shToShellPlugin from './markdown/plugins/sh-to-shell.js';
import videoDetailsPlugin from './markdown/plugins/video-link-to-details.js';
import {
  remarkWikilink,
  remarkCallout,
  calloutHandler,
  rehypeTracesExtensions
} from './markdown/plugins/traces.js';

/**
 * Render a markdown doc to sanitized HTML, using the same unified/remark/rehype
 * stack as @hackclub/markdown (workshops.hackclub.com): remark-parse → remark-gfm
 * → remark-rehype (with the docs handlers) → rehype-raw → rehype-prism →
 * rehype-stringify, plus the docs rehype pass and the Traces custom extensions.
 *
 * Each call builds a fresh processor: plugins/runs never accumulate state across
 * renders, so repeated calls stay cheap and independent.
 */
export async function renderMarkdown(markdown, docs = [], options = {}) {
  const {
    filePath = '/README.md',
    imagePrefix = '/',
    removeTitle = false
  } = options;

  const processor = unified()
    .use(remarkParse)
    .use(shToShellPlugin)
    .use(remarkGfm)
    .use(remarkWikilink, docs)
    .use(remarkCallout)
    .use(remarkRehype, {
      handlers: { inlineCode: handlers.inlineCode, callout: calloutHandler },
      allowDangerousHtml: true
    })
    .use(rehypeRaw)
    .use(rehypeDocs, { filePath, imagePrefix, removeTitle })
    .use(prism)
    .use(rehypeTracesExtensions)
    .use(videoDetailsPlugin)
    .use(rehypeStringify);

  const file = await processor.process(markdown);

  // Replace non-breaking spaces (char code 160) with normal spaces to avoid style issues
  const html = String(file).replace(/\u00A0/g, ' ');

  return DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
    ADD_ATTR: [
      'target',
      'rel',
      'class',
      'checked',
      'disabled',
      'loading',
      'width',
      'height',
      'id',
      'open',
      'controls',
      'muted',
      'aria-hidden',
      'aria-label',
      'fill-rule'
    ],
    ADD_TAGS: ['input']
  });
}