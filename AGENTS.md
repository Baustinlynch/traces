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

- **Routing**: SvelteKit file-based routing in `src/routes/`. `+layout.js` sets `export const prerender = true` globally. All pages are SSG — a `/docs` or `/first-traces` request redirects to the real doc route via prerendered `<meta refresh>` redirects. `/` is the landing page, `/workshops` the workshop showcase, `/docs/...` the guides.
- **Entry**: `src/app.html` (pre-paint theme script + fonts), `+layout.svelte` (global styles, theme sync, hand-drawn SVG filter), `src/app.css` (all global styles).
- **Layout**: `src/routes/+layout.svelte` imports `src/lib/theme.svelte.js` to re-apply per-page theme defaults on navigation. `+error.svelte` renders 404s.
- **Content**: markdown files in `Docs/` are auto-loaded at build time via `import.meta.glob` in `src/lib/site-data.js`. Everything (title, order, folder, route, hidden flag, `href`) is derived from the file's path and name — no per-doc code.
- **Docs route**: `src/routes/docs/[...slug]/+page.server.js` renders each doc at build time (via `entries()`, including hidden docs) and serves the fully-rendered HTML.
- **Workshops page**: `src/routes/workshops/` renders `WorkshopsPage.svelte` → one `WorkshopCard.svelte` per `Docs/` program, in a card grid modelled on workshops.hackclub.com. The card list is the `workshops` export in `site-data.js`, derived from each program's `_info.md` for copy and `src/lib/workshops.json` for visibility/target (see Adding a workshop). The `featured` card spans 2 columns, gets a "Start here" badge and an extra description, and the header CTA links to it. No theme toggle on this page.
- **Assets**: site asset images (logo, background, section breakers, sticker) live in `static/images/` and are served from `/images/...` — referenced in `src/lib/site-data.js`. They stay local. `assets/` is empty.
- **Docs images**: markdown images in `Docs/` point at the Hack Club CDN (`https://cdn.hackclub.com/...`) by full URL — no local copies. `scripts/migrate-images.mjs` (`npm run migrate:images`) can pull any CDN docs images into `static/images/` if needed.

## Gotchas

- **No tests or CI.** `npm run build` is the only verification step.
- **Always build to verify.** `npm run build` runs SSR + prerender + adapter. Prerender-time errors (like the old `marked` OOM) only surface here, not in dev.
- **Markdown stack is built per render.** `renderMarkdown()` in `src/lib/markdown/markdown.js` assembles a fresh `unified()` pipeline per call — `remark-parse` → `remark-gfm` → `remark-rehype` (with docs handlers) → `rehype-raw` → `@mapbox/rehype-prism` → `rehype-stringify` — the same stack as workshops.hackclub.com (`@hackclub/markdown`). Shared pieces live under `src/lib/markdown/`: `rehype-docs.js` (heading anchor links, internal/external link classes, image prefixing, optional h1 removal), `plugins/sh-to-shell.js`, `plugins/video-link-to-details.js`, and `plugins/traces.js` (the Traces-only extensions). Do NOT reuse a processor or call `.use()` on one you didn't build in this function — state accumulates across renders.
- **Theme defaults are route-dependent.** Home defaults dark; `/workshops` and the docs default light — but only when no `localStorage` preference exists. Route changes re-apply the per-page default if the user hasn't explicitly toggled. A pre-paint inline script in `app.html` applies the theme before hydration to avoid flash. The prefix list lives twice — `LIGHT_PREFIXES` in `theme.svelte.js` and inline in `app.html` — keep them in sync.
- **Nav is folder-scoped.** The sidebar and Previous/Next buttons only show docs from the top-level folder (`program`) of the doc you're viewing. Docs in other folders aren't reachable from the nav.
- **Workshop cards are shown unless disabled.** `workshops` is derived from every `Docs/` program folder, so dropping in a new folder publishes a card on `/workshops` immediately (title falls back to the folder name if there's no `_info.md`). To keep a program off the page, set `"enabled": false` in `src/lib/workshops.json` — the JSON is opt-out, not opt-in, so inverting that filter would break the "just add a folder" workflow.
- **`workshops.json` has two independent switches.** `enabled: false` hides only the card — the guides stay prerendered and reachable by URL. `published: false` is the nuclear option: the program is dropped from the exported `docs` array, so it's gone from the nav, prev/next, wikilink resolution, the `/docs` fallback, and the prerenderer's `entries()`, and its URLs 404. `enabled: false` and `published: false` both hide the card. Keys starting with `$` or `_` are skipped as documentation, so `$example` can live in the file.
- **Bare `/docs` is prerendered explicitly.** `docs/[...slug]/+page.server.js` `entries()` returns `{ slug: '' }` for it. It used to be picked up only by accident, via links to `/docs` inside `Docs/Testing/` — once those pages are unpublishable the redirect would have silently disappeared.
- **Markdown has custom extensions.** Wikilinks (`[[Page|Alias]]`), callouts (`> [!type]`), task lists (`[ ]`/`[x]`), and image sizing (`![alt](url=200x100)` — no spaces after the URL or the tokenizer breaks). Entry point is `renderMarkdown(markdown, docs)` in `src/lib/markdown/markdown.js`.
- **No TypeScript.** All source is plain JS/Svelte.
- **Build id.** `vite.config.js` resolves the build id (`VERCEL_GIT_COMMIT_SHA` → `BUILD_ID` → `git rev-parse --short HEAD` → `dev`) and injects it as the `__BUILD_ID__` global via `define`. Read it only through `src/lib/build.js` (`buildId` / `buildLabel`) — never run `child_process` in a component, it would break the client bundle.
- **Footer build info.** The Footer renders `buildLabel` in `src/lib/components/Footer.svelte`. The build label is hidden by default and shown when hovering anywhere on the footer. For production builds, the commit hash is a clickable link to the GitHub commit (`https://github.com/Baustinlynch/traces/commit/<hash>`). For dev builds, plain text "dev build" is shown. The footer also carries the static "The Hack Foundation" credit line, styled by `.footer-credit`.
- **Landing page copy is curated.** The hero buttons (`heroActions`), timeline steps (`timelineItems`) and footer links (`footerLinks`) are hand-written arrays in `src/lib/site-data.js`. Internal hero links render without `target="_blank"` — `Hero.svelte` decides via `href.startsWith('/')`.
- **Agents.md auto-update.** Agents are to automatically update this file after significant changes are made to the codebase (e.g., new features, architectural changes, or major bug fixes).

## Adding docs

Docs are zero-code: just drop a `.md` file in `Docs/` and it's picked up at build time. What you name it and where you put it drives everything:

- **Route**: `docs/{top-level folder}/[Leader/]{filename}` — the top-level folder under `Docs/` is the URL's program segment; any subfolder containing `Leader` becomes a `Leader` URL segment; other subfolders are dropped from the URL but still shown as the doc's `group` label.
- **Order & title**: a leading number sets the prev/next order, e.g. `1 - Test Basics.md` shows as "Test Basics" and sorts first. Unnumbered docs sort before numbered ones.
- **Hidden**: prefix the filename with `_` (e.g. `_Internal Notes.md`) — it gets stripped from the title/URL, the doc stays routable, but it's hidden from the sidebar and prev/next.
- **Wikilinks**: `[[Title]]` resolves against the derived title, so renames to the file automatically update wiki links (but any `[[Old Title]]` references break).

## Adding a workshop

A workshop is a top-level folder in `Docs/` (one program = one folder) plus two config files: `_info.md` for the card copy, and a key in `src/lib/workshops.json` for whether the card shows and where it goes. `Docs/Testing/_info.md` and `src/lib/workshops.json` are the reference examples.

`_info.md` (at the top of the program folder) is `key: value` lines — the doc loader skips it, so it never becomes a page:

| Key | Effect |
| --- | --- |
| `name` | card title (defaults to the folder name) |
| `tagline` | one-liner shown on every card |
| `description` | longer copy, shown only on the featured card |
| `image` | absolute image URL, cover-cropped to 2:1 at the card's bottom; falls back to the Traces logo on a green gradient if empty |
| `order` | sort position (defaults to alphabetical by name) |
| `featured` | `true` renders that card as the large one; if no program is flagged, the first card is featured |

`src/lib/workshops.json` is keyed by program folder name and owns visibility and navigation:

| Key | Effect |
| --- | --- |
| `enabled` | `false` removes the card from `/workshops` (its docs stay routable); cards default to enabled, and a program listed here with no `_info.md` still gets a card titled with the folder name |
| `published` | `false` unpublishes the program entirely — no card, and its docs are dropped from `docs`, so they leave the nav, prev/next and the prerenderer and 404 |
| `startAt` | title of the doc within the program the card opens, e.g. `"PCB Guide"`; unknown titles fall back to the program's first visible doc |
| `href` | full URL override, wins over `startAt`; use for off-site targets |

Cards otherwise link to the program's first visible doc, the same fallback as bare `/docs`. No component edits needed — a folder in `Docs/` plus a JSON key is enough. A `$example` key at the top of the file documents every option inline; `$`- and `_`-prefixed keys are ignored as programs.

## Adding images

- **Docs images**: upload the file to the Hack Club CDN (`cdn.hackclub.com`) and reference the full URL in markdown: `![alt](https://cdn.hackclub.com/.../name.png)`. Keep filesize in mind — the CDN serves these directly to readers.
- **Site assets** (logo, background, section breakers, sticker): drop the file in `static/images/` and reference it as `/images/name.png`. These stay local because the site chrome needs them immediately.

No changes needed in `src/lib/site-data.js` (other than asset constants) or any component to add docs.