# AGENTS.md

## Commands

```sh
npm run dev       # dev server
npm run build     # production build
npm run preview   # serve production build locally
```

No tests, no linter, no typecheck configured.

## Architecture

Svelte 5 + Vite static site with a custom markdown docs system.

- **Entry**: `src/main.js` mounts `App.svelte` into `#app`, imports `src/app.css` (all global styles).
- **Routing**: hash-based in `App.svelte` — `#/` (home), `#/docs/...` (docs), `#/first-traces` (alias for the PCB Guide). Bare `#/docs` with no path falls back to the first visible doc.
- **Content**: markdown files in `Docs/` are auto-loaded at build time via `import.meta.glob` in `src/lib/site-data.js`. Everything (title, order, folder, route, hidden flag) is derived from the file's path and name — no per-doc code.
- **Assets**: all images are remote Hack Club CDN URLs defined in `site-data.js`. The `assets/` directory is empty.

## Gotchas

- **No tests or CI.** `npm run build` is the only verification step.
- **Theme defaults are route-dependent.** Home defaults dark, docs defaults light — but only when no `localStorage` preference exists. Route changes re-apply the per-page default if the user hasn't explicitly toggled.
- **Nav is folder-scoped.** The sidebar and Previous/Next buttons only show docs from the top-level folder (`program`) of the doc you're viewing. Docs in other folders aren't reachable from the nav.
- **Markdown has custom extensions.** Wikilinks (`[[Page|Alias]]`), callouts (`> [!type]`), and task lists (`[ ]`/`[x]`). The renderer is in `src/lib/markdown.js`; entry point is `renderMarkdown(markdown, docs)`.
- **No TypeScript.** All source is plain JS/Svelte.
- **`assets/` is a red herring.** Don't look there for images — they're CDN URLs in `site-data.js`.

## Adding docs

Docs are zero-code: just drop a `.md` file in `Docs/` and it's picked up at build time. What you name it and where you put it drives everything:

- **Route**: `docs/{top-level folder}/[Leader/]{filename}` — the top-level folder under `Docs/` is the URL's program segment; any subfolder containing `Leader` becomes a `Leader` URL segment; other subfolders are dropped from the URL but still shown as the doc's `group` label.
- **Order & title**: a leading number sets the prev/next order, e.g. `1 - Test Basics.md` shows as "Test Basics" and sorts first. Unnumbered docs sort before numbered ones.
- **Hidden**: prefix the filename with `_` (e.g. `_Internal Notes.md`) — it gets stripped from the title/URL, the doc stays routable, but it's hidden from the sidebar and prev/next.
- **Wikilinks**: `[[Title]]` resolves against the derived title, so renames to the file automatically update wiki links (but any `[[Old Title]]` references break).

No changes needed in `src/lib/site-data.js` or anywhere else.
