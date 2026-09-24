# Guide Contributors

## Overview

This document describes the conventions for contributing to the Traces guide. It covers the custom markdown syntax supported by the renderer and how the file structure maps to URLs.

The markdown renderer (`src/lib/markdown/markdown.js`) uses a `unified`/`remark`/`rehype` pipeline (same as workshops.hackclub.com): `remark-parse` → `remark-gfm` → `remark-rehype` → `rehype-raw` → `@mapbox/rehype-prism` → `rehype-stringify`, with custom extensions in `src/lib/markdown/plugins/traces.js`. Output is sanitized with `isomorphic-dompurify`.

## File Structure & URLs

Docs live in the `Docs/` directory. The file path determines the URL route, title, order, and visibility — no code changes are needed.

### Route Mapping

- **Top-level folder** under `Docs/` becomes the URL's program segment.
  - Example: `Docs/First Traces/Session 1.md` → route `docs/first-traces/session-1`
- **Subfolders** containing `Leader` (case-insensitive) add a `Leader/` URL segment.
  - Example: `Docs/First Traces/Leader Notes.md` → route `docs/first-traces/leader/leader-notes`
- **Other subfolders** are dropped from the URL but still appear as the doc's `group` label in the sidebar.
  - Example: `Docs/First Traces/Participant docs/Session 1.md` → route `docs/first-traces/session-1`, group `Participant docs`

### Naming Conventions

- **Order & title**: A leading number followed by a separator sets the prev/next order.
  - `1 - Test Basics.md` → title "Test Basics", sorts first
  - `2 - Wiring Up.md` → title "Wiring Up", sorts second
  - Unnumbered docs sort before numbered ones.
- **Hidden docs**: Prefix the filename with `_` to hide it from the sidebar and prev/next navigation. The doc stays routable but is not visible in nav.
  - `_Internal Notes.md` → title "Internal Notes", hidden from nav

### Adding a New Doc

1. Create a `.md` file in the appropriate folder under `Docs/`.
2. Name it with a leading number for ordering (e.g., `3 - My New Section.md`).
3. The doc is automatically picked up at build time via `import.meta.glob` in `src/lib/site-data.js`.

## Markdown Syntax

The renderer (`src/lib/markdown/markdown.js`) supports standard markdown plus these custom extensions.

### Images

Guide images are **screenshots stored on the Hack Club CDN** (`cdn.hackclub.com`) — never commit local copies or reference `/images/...` for doc content. Upload the file to the CDN, then reference the full URL:

```markdown
![Alt text](https://cdn.hackclub.com/path/to/image.png)
```

Local `static/images/` is reserved for site chrome assets (logo, background, section breakers, sticker); doc content always points at the CDN.

**Custom image sizing** is supported using `=WIDTHxHEIGHT` appended directly to the URL with **no spaces**:

```markdown
![Alt text](https://cdn.hackclub.com/path/to/image.png=200x100)
```

You can also combine sizing with a title:

```markdown
![Alt text](https://cdn.hackclub.com/path/to/image.png=400x200 "Caption text")
```

Images are lazy-loaded by default (`loading="lazy"`).

### Wikilinks

Link to other docs by their title:

```markdown
[[Session 1 — Microcontrollers & Your First Circuit]]
```

You can provide an alias (display text):

```markdown
[[Session 1 — Microcontrollers & Your First Circuit|Session 1]]
```

Wikilinks resolve against doc titles, so renaming a file automatically updates wiki links that reference the new title. However, any `[[Old Title]]` references will break.

### Callouts

Use callouts to highlight notes, warnings, or tips:

```markdown
> [!note]
> This is a note callout.

> [!warning]
> This is a warning callout.

> [!tip]
> This is a tip callout.
```

The type appears as the default title. You can override it:

```markdown
> [!note] Custom Title
> This callout shows "Custom Title" instead of "note".
```

### Task Lists

Create checkboxes in lists:

```markdown
- [ ] Incomplete task
- [x] Completed task
```

### Code Blocks

Code blocks are syntax-highlighted via `@mapbox/rehype-prism`. Specify the language:

```markdown
```javascript
console.log("Hello, world!");
```
```

Supported languages include: markup, CSS, JavaScript, TypeScript, JSON, Bash, Markdown, Python, C, C++, and Arduino.

## Links

- External links open in a new tab with `rel="noopener"`.
- Internal links (starting with `#/`) stay in the app.
- Standard markdown link syntax: `[text](url)` or `[text](url "title")`.
