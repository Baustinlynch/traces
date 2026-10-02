# Technical Documentation

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

## Architecture Notes

- **Docs loading**: `src/lib/site-data.js` globs every `.md` under `Docs/`, derives each doc's metadata (slug, program, group, title, order, hidden, route) from its path, and exposes it to the renderer. `_info.md` files are filtered out before the doc list is built.
- **Routing**: SvelteKit file-based routes, all prerendered. `/docs` and `/first-traces` are prerendered as `<meta refresh>` redirects to a real doc. The sidebar and prev/next pagination are scoped to the docs in the active doc's top-level program folder.
- **Markdown rendering**: `src/lib/markdown/markdown.js` (`renderMarkdown(markdown, docs)`) uses a `unified` pipeline — `remark-parse` → `remark-gfm` → `remark-rehype` (with docs handlers) → `rehype-raw` → `@mapbox/rehype-prism` → `rehype-stringify` — the same stack as workshops.hackclub.com (`@hackclub/markdown`). Custom extensions live under `src/lib/markdown/`: `rehype-docs.js` (heading anchor links, internal/external link classes, image prefixing, optional h1 removal), `plugins/sh-to-shell.js`, `plugins/video-link-to-details.js`, and `plugins/traces.js` (wikilinks, callouts, task lists, image sizing). Output is sanitized with `isomorphic-dompurify`.
- **Theming**: a single global stylesheet (`src/app.css`) with brand tokens (`--green`, `--gold`, `--cream`, `--ink`) plus an obsidian palette for docs-like surfaces. `src/lib/theme.svelte.js` holds the per-route defaults (home dark, `/workshops` and `/docs` light) and an inline script in `app.html` applies the theme before hydration; a user toggle in `localStorage` overrides both.

## Known Caveats

- Doc images are full `cdn.hackclub.com` URLs referenced directly in markdown; only site chrome assets (logo, background, section breakers, sticker) stay local in `static/images/` (served from `/images/...` and defined in `src/lib/site-data.js`).
- Markdown processor is rebuilt fresh per render — do not reuse a processor or call `.use()` on one you didn't build in `renderMarkdown()`; state accumulates across renders.
- Adding a folder to `Docs/` publishes a card on `/workshops` straight away; disable it in `src/lib/workshops.json` if it isn't a real workshop (as `Testing` is).

## Local Development

```sh
npm install
npm run dev            # start the dev server
npm run build          # prerender every route and run the Vercel adapter
npm run preview        # serve the production build locally
npm run migrate:images # pull any cdn.hackclub.com doc images into static/images/ (restore tool)
```

`npm run build` is the only verification step — there are no tests, linter, or typecheck configured. The build output lands in `.vercel/output/`.

## Build ID

`vite.config.js` resolves the build id (`VERCEL_GIT_COMMIT_SHA` → `BUILD_ID` → `git rev-parse --short HEAD` → `dev`) and injects it as the `__BUILD_ID__` global via `define`. Read it only through `src/lib/build.js` (`buildId` / `buildLabel`) — never run `child_process` in a component, it would break the client bundle.

## Footer Build Info

The Footer renders `buildLabel` in `src/lib/components/Footer.svelte`. The build label is hidden by default and shown when hovering anywhere on the footer. For production builds, the commit hash is a clickable link to the GitHub commit (`https://github.com/Baustinlynch/traces/commit/<hash>`). For dev builds, plain text "dev build" is shown. The footer also carries the static "The Hack Foundation" credit line, styled by `.footer-credit`.