# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands
- Build: `npm run build`
- Dev Server: `npm run dev`
- Preview Production Build: `npm run preview`

## Architecture
The project is a static site built with **Svelte 5** and **Vite**, featuring a custom markdown-based documentation system.

### High-Level Structure
- `src/`: Application source code.
  - `App.svelte`: Main entry point implementing hash-based routing (`#/` for home, `#/docs/[slug]` for documentation).
  - `components/`: UI components, divided into page-level components (`LandingPage`, `DocsPage`) and shared sections (`Hero`, `Footer`, `CtaSection`, etc.).
  - `lib/`: Core utilities.
    - `site-data.js`: Centralized configuration and content store. Exports assets, navigation links, and document metadata.
    - `markdown.js`: Markdown rendering engine.
- `Docs/`: Raw markdown files used for documentation. Content is imported as raw strings into `site-data.js`.
- `assets/`: Static images and media.

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
3. Add a new entry to the `docs` array in `src/lib/site-data.js` with a unique `slug`, `title`, and `group`.
