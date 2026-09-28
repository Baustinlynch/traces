# Traces

A YSWS landing site, workshop showcase, and static documentation site for the Traces hardware series. Built with SvelteKit 2 (Svelte 5) and Vite, fully prerendered at build time and deployed to Vercel.

## Local Development

```sh
npm install
npm run dev            # start the dev server
npm run build          # prerender every route and run the Vercel adapter
npm run preview        # serve the production build locally
npm run migrate:images # pull any cdn.hackclub.com doc images into static/images/ (restore tool)
```

`npm run build` is the only verification step — there are no tests, linter, or typecheck configured. The build output lands in `.vercel/output/`.

## Pages

| Route | What it is |
| --- | --- |
| `/` | Landing page: hero, about, timeline, CTA, footer |
| `/workshops` | Card grid of every Traces workshop, First Traces featured |
| `/docs/...` | The guides themselves |
| `/docs`, `/first-traces` | Redirects to the first visible doc / the PCB Guide |

The docs are prerendered per file, and every doc route is declared up front via `entries()` in `src/routes/docs/[...slug]/+page.server.js` so hidden docs stay reachable.

## Features

- **Zero-code docs** — drop a `.md` file in `Docs/` and it is picked up at build time via `import.meta.glob`. Routes, titles, order, and visibility are all derived from the file's path and name.
- **Zero-code workshops** — drop a folder in `Docs/` and a card appears on `/workshops`. Copy comes from an `_info.md` in that folder; visibility and the card's target come from `src/lib/workshops.json`.
- **Obsidian style** — built on `unified` + `remark`/`rehype` (same stack as workshops.hackclub.com):
  - Wikilinks: `[[Page Title|Display Alias]]` resolve against doc titles.
  - Callouts: `> [!note]`, `> [!warning]`, `> [!tip]`, etc. with optional custom titles.
  - Task lists: `- [ ]` / `- [x]`.
  - Image sizing: `![alt](url=200x100)` — images are lazy-loaded.
- **Sane link handling** — external links open in a new tab, internal links stay in the app.
- **Syntax highlighting** for code blocks via `@mapbox/rehype-prism`.
- **Light/dark theming** with per-route defaults and a pre-paint script to avoid a flash.

## Code Structure

```
traces/
├── Docs/                              # markdown content (auto-loaded at build time)
│   ├── First Traces/                  # a program; top-level folder = URL segment
│   │   ├── _info.md                   # workshop card copy (not a page)
│   │   ├── Leader Docs/
│   │   └── Participant docs/
│   └── Testing/                       # markdown renderer exercise docs
├── src/
│   ├── app.html                       # pre-paint theme script + fonts
│   ├── app.css                        # all global styles
│   ├── lib/
│   │   ├── site-data.js               # docs loader, workshop cards, routes, copy, assets
│   │   ├── workshops.json             # which workshop cards show and where they point
│   │   ├── build.js                   # build/commit id
│   │   ├── theme.svelte.js            # theme state + per-route defaults
│   │   ├── components/                # landing, workshops, docs, footer components
│   │   └── markdown/                  # unified/remark/rehype markdown pipeline
│   │       ├── markdown.js            # renderMarkdown entry point
│   │       ├── rehype-docs.js         # heading anchors, link classes, image prefixing
│   │       └── plugins/
│   │           ├── sh-to-shell.js
│   │           ├── traces.js          # wikilinks, callouts, task lists, image sizing
│   │           └── video-link-to-details.js
│   └── routes/
│       ├── +page.svelte               # landing page
│       ├── workshops/                 # workshop showcase
│       ├── docs/[...slug]/            # the guides
│       └── first-traces/              # legacy redirect to the PCB Guide
├── static/images/                     # site chrome assets (logo, background, sticker, …)
├── Contributing.md                    # full markdown syntax and route conventions
└── vite.config.js
```

## Docs

All content lives in `Docs/`. Adding a doc is zero-code: just create a `.md` file and rebuild. The file path drives everything:

- **Route**: the top-level folder under `Docs/` becomes the URL's `program` segment (case and spaces preserved, e.g. `/docs/First%20Traces/Introduction`); subfolders containing `Leader` (case-insensitive) add a `Leader/` URL segment; other subfolders are dropped from the URL but shown as a group label.
- **Order & title**: a leading number + separator sets prev/next order and the displayed title (e.g. `1 - Test Basics.md` → "Test Basics"). Unnumbered docs sort first.
- **Hidden docs**: prefix the filename with `_` to hide it from the sidebar and prev/next nav while keeping it directly routable.

See `Contributing.md` for the complete syntax reference (wikilinks, callouts, task lists, image sizing, code highlighting) and the in-site `Docs/Testing/0 - Doc Site Conventions.md` for a hands-on guide.

## Workshops

A workshop is one top-level folder in `Docs/` (one program = one folder) plus two config files. `Docs/Testing/_info.md` and `src/lib/workshops.json` are the reference examples.

- `Docs/{Program}/_info.md` — `key: value` lines for the card: `name`, `tagline`, `description`, `image`, `order`, `featured`. The doc loader skips this file, so it never becomes a page.
- `src/lib/workshops.json` — keyed by program folder name, and the file's `$example` key documents every option inline:
  - `enabled` — cards are shown unless set to `false`, which hides just the card. The guides stay published and can still be opened by URL.
  - `published` — set to `false` to unpublish the whole folder: no card, and its docs leave the nav, prev/next and the prerenderer, so their URLs 404.
  - `startAt` — title of the doc inside the program that the card opens.
  - `href` — full URL override, wins over `startAt`.

Cards link to the program's first visible doc by default. The `featured` card renders larger, spanning two grid columns with a "Start here" badge and its description; if no program sets `featured: true`, the first card is featured.

## Architecture Notes

- **Docs loading**: `src/lib/site-data.js` globs every `.md` under `Docs/`, derives each doc's metadata (slug, program, group, title, order, hidden, route) from its path, and exposes it to the renderer. `_info.md` files are filtered out before the doc list is built.
- **Routing**: SvelteKit file-based routes, all prerendered. `/docs` and `/first-traces` are prerendered as `<meta refresh>` redirects to a real doc. The sidebar and prev/next pagination are scoped to the docs in the active doc's top-level program folder.
- **Markdown rendering**: `src/lib/markdown/markdown.js` (`renderMarkdown(markdown, docs)`) uses a `unified` pipeline — `remark-parse` → `remark-gfm` → `remark-rehype` (with docs handlers) → `rehype-raw` → `@mapbox/rehype-prism` → `rehype-stringify` — the same stack as workshops.hackclub.com (`@hackclub/markdown`). Custom extensions live under `src/lib/markdown/`: `rehype-docs.js` (heading anchor links, internal/external link classes, image prefixing, optional h1 removal), `plugins/sh-to-shell.js`, `plugins/video-link-to-details.js`, and `plugins/traces.js` (wikilinks, callouts, task lists, image sizing). Output is sanitized with `isomorphic-dompurify`.
- **Theming**: a single global stylesheet (`src/app.css`) with brand tokens (`--green`, `--gold`, `--cream`, `--ink`) plus an obsidian palette for docs-like surfaces. `src/lib/theme.svelte.js` holds the per-route defaults (home dark, `/workshops` and `/docs` light) and an inline script in `app.html` applies the theme before hydration; a user toggle in `localStorage` overrides both.

## Known Caveats

- `npm run build` is the only automated check; no CI, tests, or linter.
- Doc images are full `cdn.hackclub.com` URLs referenced directly in markdown; only site chrome assets (logo, background, section breakers, sticker) stay local in `static/images/` (served from `/images/...` and defined in `src/lib/site-data.js`).
- Markdown processor is rebuilt fresh per render — do not reuse a processor or call `.use()` on one you didn't build in `renderMarkdown()`; state accumulates across renders.
- Adding a folder to `Docs/` publishes a card on `/workshops` straight away; disable it in `src/lib/workshops.json` if it isn't a real workshop (as `Testing` is).

## Contributing

See `Contributing.md` for file structure, naming conventions, and the custom markdown syntax. Content is authored in Obsidian, which is the origin of the wikilink and callout extensions. `AGENTS.md` holds the architecture notes and gotchas for coding agents.
