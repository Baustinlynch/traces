# AGENTS.md

## Commands

```sh
npm run dev          # dev server
npm run build        # production build (prerenders every route, runs adapter)
npm run preview      # serve production build locally
npm run migrate:images   # pull any cdn.hackclub.com docs images in Docs/ into static/images/ (restore tool)
```

No tests, no linter, no typecheck configured.

## Architecture

SvelteKit 2 (Svelte 5) static site generated with `prerender = true` and deployed via `@sveltejs/adapter-vercel` (pinned to `nodejs22.x` so local builds work on any Node).

- **Routing**: SvelteKit file-based routing in `src/routes/`. `+layout.js` sets `export const prerender = true` globally. All pages are SSG — a `/docs` or `/first-traces` request redirects to the real doc route via prerendered `<meta refresh>` redirects.
- **Entry**: `src/app.html` (pre-paint theme script + fonts), `+layout.svelte` (global styles, theme sync, hand-drawn SVG filter), `src/app.css` (all global styles).
- **Layout**: `src/routes/+layout.svelte` imports `src/lib/theme.svelte.js` to re-apply per-page theme defaults on navigation. `+error.svelte` renders 404s.
- **Content**: markdown files in `Docs/` are auto-loaded at build time via `import.meta.glob` in `src/lib/site-data.js`. Everything (title, order, folder, route, hidden flag, `href`) is derived from the file's path and name — no per-doc code.
- **Docs route**: `src/routes/docs/[...slug]/+page.server.js` renders each doc at build time (via `entries()`, including hidden docs) and serves the fully-rendered HTML.
- **Assets**: site asset images (logo, background, section breakers, sticker) live in `static/images/` and are served from `/images/...` — referenced in `src/lib/site-data.js`. They stay local. `assets/` is empty.
- **Docs images**: markdown images in `Docs/` point at the Hack Club CDN (`https://cdn.hackclub.com/...`) by full URL — no local copies. `scripts/migrate-images.mjs` (`npm run migrate:images`) can pull any CDN docs images into `static/images/` if needed.

## Gotchas

- **No tests or CI.** `npm run build` is the only verification step.
- **Always build to verify.** `npm run build` runs SSR + prerender + adapter. Prerender-time errors (like the old `marked` OOM) only surface here, not in dev.
- **Markdown stack is built per render.** `renderMarkdown()` in `src/lib/markdown/markdown.js` assembles a fresh `unified()` pipeline per call — `remark-parse` → `remark-gfm` → `remark-rehype` (with docs handlers) → `rehype-raw` → `@mapbox/rehype-prism` → `rehype-stringify` — the same stack as workshops.hackclub.com (`@hackclub/markdown`). Shared pieces live under `src/lib/markdown/`: `rehype-docs.js` (heading anchor links, internal/external link classes, image prefixing, optional h1 removal), `plugins/sh-to-shell.js`, `plugins/video-link-to-details.js`, and `plugins/traces.js` (the Traces-only extensions). Do NOT reuse a processor or call `.use()` on one you didn't build in this function — state accumulates across renders.
- **Theme defaults are route-dependent.** Home defaults dark, docs defaults light — but only when no `localStorage` preference exists. Route changes re-apply the per-page default if the user hasn't explicitly toggled. A pre-paint inline script in `app.html` applies the theme before hydration to avoid flash.
- **Nav is folder-scoped.** The sidebar and Previous/Next buttons only show docs from the top-level folder (`program`) of the doc you're viewing. Docs in other folders aren't reachable from the nav.
- **Markdown has custom extensions.** Wikilinks (`[[Page|Alias]]`), callouts (`> [!type]`), task lists (`[ ]`/`[x]`), and image sizing (`![alt](url=200x100)` — no spaces after the URL or the tokenizer breaks). Entry point is `renderMarkdown(markdown, docs)` in `src/lib/markdown/markdown.js`.
- **No TypeScript.** All source is plain JS/Svelte.
- **Agents.md auto-update.** Agents are to automatically update this file after significant changes are made to the codebase (e.g., new features, architectural changes, or major bug fixes).

## Adding docs

Docs are zero-code: just drop a `.md` file in `Docs/` and it's picked up at build time. What you name it and where you put it drives everything:

- **Route**: `docs/{top-level folder}/[Leader/]{filename}` — the top-level folder under `Docs/` is the URL's program segment; any subfolder containing `Leader` becomes a `Leader` URL segment; other subfolders are dropped from the URL but still shown as the doc's `group` label.
- **Order & title**: a leading number sets the prev/next order, e.g. `1 - Test Basics.md` shows as "Test Basics" and sorts first. Unnumbered docs sort before numbered ones.
- **Hidden**: prefix the filename with `_` (e.g. `_Internal Notes.md`) — it gets stripped from the title/URL, the doc stays routable, but it's hidden from the sidebar and prev/next.
- **Wikilinks**: `[[Title]]` resolves against the derived title, so renames to the file automatically update wiki links (but any `[[Old Title]]` references break).

## Adding images

- **Docs images**: upload the file to the Hack Club CDN (`cdn.hackclub.com`) and reference the full URL in markdown: `![alt](https://cdn.hackclub.com/.../name.png)`. Keep filesize in mind — the CDN serves these directly to readers.
- **Site assets** (logo, background, section breakers, sticker): drop the file in `static/images/` and reference it as `/images/name.png`. These stay local because the site chrome needs them immediately.

No changes needed in `src/lib/site-data.js` (other than asset constants) or any component to add docs.