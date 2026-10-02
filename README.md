# Traces

The landing site and static guide documentation for the Traces clubs hardware series. Built with SvelteKit 2 (Svelte 5) and Vite, fully prerendered at build time and deployed on Vercel.

## Pages

| Route | What it is |
| --- | --- |
| `/` | Landing page: hero, about, timeline, CTA, footer |
| `/workshops` | Card grid of every Traces workshop, First Traces featured |
| `/docs/...` | The guides themselves |
| `/docs`, `/first-traces` | Redirects to the first visible doc / the PCB Guide |

The docs are prerendered per file, and every doc route is declared up front via `entries()` in `src/routes/docs/[...slug]/+page.server.js` so hidden docs stay reachable.

## Quick Start

```sh
npm install
npm run dev            # start the dev server
npm run build          # prerender every route and run the Vercel adapter
npm run preview        # serve the production build locally
npm run migrate:images # pull any cdn.hackclub.com doc images into static/images/ (restore tool)
```

`npm run build` is the only verification step — there are no tests, linter, or typecheck configured.

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

## Documentation

- **[Technical Documentation](TECHNICAL.md)** — architecture, code structure, build process, and caveats
- **[Contributing.md](Contributing.md)** — file structure, naming conventions, and custom markdown syntax
- **In-site guide** — `Docs/Testing/0 - Doc Site Conventions.md` for a hands-on guide

## Contributing

See `Contributing.md` for file structure, naming conventions, and the custom markdown syntax. Content is authored in Obsidian, which is the origin of the wikilink and callout extensions. `AGENTS.md` holds the architecture notes and gotchas for coding agents.
