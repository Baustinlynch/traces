# llms.md

This file provides guidance to LLM coding agents when working with code in this repository.

## Development Commands
- Build: `npm run build`
- Dev Server: `npm run dev`
- Preview Production Build: `npm run preview`

## Architecture
The project is a static site built with **Svelte 5** and **Vite**, featuring a custom markdown-based documentation system.

### High-Level Structure
- `src/`: Application source code.
  - `App.svelte`: Main entry point implementing hash-based routing, theme management, and top-level layout.
  - `components/`: UI components, divided into page-level components (`LandingPage`, `DocsPage`) and shared sections (`Header`, `Hero`, `Footer`, `ThemeToggle`, `CtaSection`, `AboutSection`, `TimelineSection`, `SectionBreaker`).
  - `lib/`: Core utilities.
    - `site-data.js`: Centralized configuration and content store. Exports `assets`, `heroActions`, `timelineItems`, `footerLinks`, and `docs` (document metadata + raw content).
    - `markdown.js`: Markdown rendering engine.
- `Docs/`: Raw markdown files used for documentation. Content is imported as raw strings into `site-data.js`.
- `assets/`: Static images and media.

### Routing
`App.svelte` handles hash-based routing:
- `#/` — home/landing page
- `#/docs/[slug]` — documentation page for the given slug
- `#/first-traces` — legacy alias that resolves to the `first-traces-pcb-guide` doc slug

### Theme Management
Themes are managed in `App.svelte` and applied by toggling the `light-theme` class on `<html>`:
- **Default**: dark for the home page, light for docs pages.
- **Persistence**: user preference is saved to `localStorage` and restored on load.
- **Toggle**: exposed via `toggleTheme()` passed as `onToggle` to `Header`, which renders `ThemeToggle` only on docs pages.

### Components
- **`Header.svelte`**: Fixed top header (z-index 100). Shows the logo as a home link. On docs pages, renders a frosted-glass panel style and includes `ThemeToggle`. Uses Svelte 5 `$props()` rune.
- **`ThemeToggle.svelte`**: Button that emits the `onToggle` callback to switch between dark and light mode. Uses Svelte 5 `$props()` rune.
- Other components (`Hero`, `LandingPage`, etc.) use the older Svelte `export let` prop style.

### Markdown System
The site uses a custom markdown pipeline in `src/lib/markdown.js` with the following features:
- **Parser**: `marked` with GFM heading IDs.
- **Syntax Highlighting**: `prismjs` for various languages.
- **Sanitization**: `dompurify` ensures rendered HTML is safe.
- **Custom Extensions**:
  - **Wikilinks**: `[[Page Title|Alias]]` for internal documentation linking.
  - **Callouts**: `> [!type] Title` for styled alert boxes.
  - **Task Lists**: `[ ]` and `[x]` for interactive-style checkboxes.

### Content Workflow
To add new documentation:
1. Create a `.md` file in the `Docs/` directory.
2. Import the file as raw text in `src/lib/site-data.js` using the `?raw` suffix.
3. Add a new entry to the `docs` array in `src/lib/site-data.js` with a unique `slug`, `title`, `group`, `path`, and `content`. Optionally set `hidden: true` to exclude the entry from the sidebar while keeping it routable.
