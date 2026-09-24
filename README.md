# Traces

A YSWS landing and static documentation site built with Svelte 5 and Vite. It renders a folder of markdown files into a navigable, wiki-style documentation site with hash-based routing and a set of custom markdown extensions.

## Local Development

```sh
npm install
npm run dev       # start the dev server
npm run build     # build the static site into dist/
npm run preview   # serve the production build locally
```

`npm run build` is the only verification step — there are no tests, linter, or typecheck configured.

## Features

- **Zero-code docs** — drop a `.md` file in `Docs/` and it is picked up at build time via `import.meta.glob`. Routes, titles, order, and visibility are all derived from the file's path and name.
- **Obsidian style** — built on `marked` + `dompurify` + Prism.js:
  - Wikilinks: `[[Page Title|Display Alias]]` resolve against doc titles.
  - Callouts: `> [!note]`, `> [!warning]`, `> [!tip]`, etc. with optional custom titles.
  - Task lists: `- [ ]` / `- [x]`.
  - Image sizing: `![alt](url=200x100)` — images are lazy-loaded.
- **Hash-based routing** — `#/` landing page, `#/docs/...` docs, plus route aliases.
- **Sane link handling** — external links open in a new tab, internal hash links stay in the app.
- **Syntax highlighting** for code blocks via Prism.js.

## Code Structure

```
traces/
├── Docs/                         # markdown content (auto-loaded at build time)
│   ├── First Traces/             # a program; top-level folder = URL segment
│   └── Testing/                  # markdown renderer exercise docs
├── src/
│   ├── main.js                   # mounts App.svelte, imports global styles
│   ├── App.svelte                # hash router and top-level layout switch
│   ├── app.css                   # all global styles
│   ├── lib/
│   │   ├── site-data.js          # docs loader, routes, and site assets
│   │   └── markdown.js           # renderMarkdown + custom extensions
│   └── components/               # landing page + docs page components
├── Contributing.md               # full markdown syntax and route conventions
├── index.html                    # Vite entry point
└── vite.config.js
```

## Docs

All content lives in `Docs/`. Adding a doc is zero-code: just create a `.md` file and rebuild. The file path drives everything:

- **Route**: the top-level folder under `Docs/` becomes the URL's `program` segment; subfolders containing `Leader` (case-insensitive) add a `Leader/` URL segment; other subfolders are dropped from the URL but shown as a group label.
- **Order & title**: a leading number + separator sets prev/next order and the displayed title (e.g. `1 - Test Basics.md` → "Test Basics"). Unnumbered docs sort first.
- **Hidden docs**: prefix the filename with `_` to hide it from the sidebar and prev/next nav while keeping it directly routable.

See `Contributing.md` for the complete syntax reference (wikilinks, callouts, task lists, image sizing, code highlighting) and the in-site `Docs/Testing/0 - Doc Site Conventions.md` for a hands-on guide.

## Architecture Notes

- **Docs loading**: `src/lib/site-data.js` globs every `.md` under `Docs/`, derives each doc's metadata (slug, program, group, title, order, hidden, route) from its path, and exposes it to the renderer.
- **Routing**: `App.svelte` listens for `hashchange` and resolves `#/docs/...` routes by exact route match, then slug, with a fallback to the first visible doc. The sidebar and prev/next pagination are scoped to the docs in the active doc's top-level program folder.
- **Markdown rendering**: `src/lib/markdown.js` (`renderMarkdown(markdown, docs)`) parses content with `marked`, applies the custom extensions via the tokenizer, sanitizes output with DOMPurify, and highlights code with Prism.
- **Theming**: styled via a single global stylesheet (`src/app.css`) with a light default palette and a brand color scheme.

## Known Caveats

- `npm run build` is the only automated check; no CI, tests, or linter.
- Doc images are full `cdn.hackclub.com` URLs referenced directly in markdown; only site chrome assets (logo, background, section breakers, sticker) stay local in `static/images/` (served from `/images/...` and defined in `src/lib/site-data.js`).

## Contributing

See `Contributing.md` for file structure, naming conventions, and the custom markdown syntax. Content is authored in Obsidian, which is the origin of the wikilink and callout extensions.