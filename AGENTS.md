# AGENTS.md

## Commands

```sh
npm run dev          # dev server
npm run build        # production build (prerenders every route, runs adapter)
npm run preview      # serve production build locally
npm run migrate:images   # rewrite CDN image URLs in Docs/ to local /images paths
```

No tests, no linter, no typecheck configured.

## Architecture

SvelteKit 5 (SvelteKit 2) static site generated with `prerender = true` and deployed via `@sveltejs/adapter-vercel` (pinned to `nodejs22.x` so local builds work on any Node).

- **Routing**: SvelteKit file-based routing in `src/routes/`. `+layout.js` sets `export const prerender = true` globally. All pages are SSG — a `/docs` or `/first-traces` request redirects to the real doc route via prerendered `<meta refresh>` redirects.
- **Entry**: `src/app.html` (pre-paint theme script + fonts), `+layout.svelte` (global styles, theme sync, hand-drawn SVG filter), `src/app.css` (all global styles).
- **Layout**: `src/routes/+layout.svelte` imports `src/lib/theme.svelte.js` to re-apply per-page theme defaults on navigation. `+error.svelte` renders 404s.
- **Content**: markdown files in `Docs/` are auto-loaded at build time via `import.meta.glob` in `src/lib/site-data.js`. Everything (title, order, folder, route, hidden flag, `href`) is derived from the file's path and name — no per-doc code.
- **Docs route**: `src/routes/docs/[...slug]/+page.server.js` renders each doc at build time (via `entries()`, including hidden docs) and serves the fully-rendered HTML.
- **Assets**: images live in `static/images/` and are served from `/images/...`. No CDN. `assets/` is empty.

## Gotchas

- **No tests or CI.** `npm run build` is the only verification step.
- **Always build to verify.** `npm run build` runs SSR + prerender + adapter. Prerender-time errors (like the old `marked` OOM) only surface here, not in dev.
- **`marked` is configured per render, not globally.** `renderMarkdown()` in `src/lib/markdown.js` constructs a fresh `new Marked()` instance per call and registers `gfmHeadingId`, `markedHighlight`, and the custom extensions on it. Do NOT reconfigure the global `marked`/call `marked.use()` per render — marked accumulates extensions/renderers on every `.use()`, which compounds to OOM.
- **Theme defaults are route-dependent.** Home defaults dark, docs defaults light — but only when no `localStorage` preference exists. Route changes re-apply the per-page default if the user hasn't explicitly toggled. A pre-paint inline script in `app.html` applies the theme before hydration to avoid flash.
- **Nav is folder-scoped.** The sidebar and Previous/Next buttons only show docs from the top-level folder (`program`) of the doc you're viewing. Docs in other folders aren't reachable from the nav.
- **Markdown has custom extensions.** Wikilinks (`[[Page|Alias]]`), callouts (`> [!type]`), task lists (`[ ]`/`[x]`), and image sizing (`![alt](url =200x100)`). Entry point is `renderMarkdown(markdown, docs)` in `src/lib/markdown.js`.
- **No TypeScript.** All source is plain JS/Svelte.
- **Agents.md auto-update.** Agents are to automatically update this file after significant changes are made to the codebase (e.g., new features, architectural changes, or major bug fixes).

## Adding docs

Docs are zero-code: just drop a `.md` file in `Docs/` and it's picked up at build time. What you name it and where you put it drives everything:

- **Route**: `docs/{top-level folder}/[Leader/]{filename}` — the top-level folder under `Docs/` is the URL's program segment; any subfolder containing `Leader` becomes a `Leader` URL segment; other subfolders are dropped from the URL but still shown as the doc's `group` label.
- **Order & title**: a leading number sets the prev/next order, e.g. `1 - Test Basics.md` shows as "Test Basics" and sorts first. Unnumbered docs sort before numbered ones.
- **Hidden**: prefix the filename with `_` (e.g. `_Internal Notes.md`) — it gets stripped from the title/URL, the doc stays routable, but it's hidden from the sidebar and prev/next.
- **Wikilinks**: `[[Title]]` resolves against the derived title, so renames to the file automatically update wiki links (but any `[[Old Title]]` references break).

## Adding images

- Drop the file in `static/images/` and reference it in markdown as `/images/name.png`.
- `npm run migrate:images` (`scripts/migrate-images.mjs`) rewrites legacy CDN image URLs in `Docs/` to the local `/images/` path form.

No changes needed in `src/lib/site-data.js` (other than asset constants) or any component to add docs.