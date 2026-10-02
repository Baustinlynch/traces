# Guide Contributors

## Overview

This document describes the conventions for contributing to the Traces guide. It covers the custom markdown syntax supported by the renderer, how the file structure maps to URLs, and how a workshop card on `/workshops` is configured.

The markdown renderer (`src/lib/markdown/markdown.js`) uses the same rendering pipeline as [workshops.hackclub.com](https://workshops.hackclub.com) (a `unified`/`remark`/`rehype` pipeline : `remark-parse` → `remark-gfm` → `remark-rehype` → `rehype-raw` → `@mapbox/rehype-prism` → `rehype-stringify`), with custom extensions in `src/lib/markdown/plugins/traces.js`. Output is sanitized with `isomorphic-dompurify`.

## File Structure & URLs

Docs live in the `Docs/` directory. The file path determines the URL route, title, order, and visibility — no code changes are needed.

### Route Mapping

- **Top-level folder** under `Docs/` becomes the URL's program segment. Names and spaces are kept as-is and percent-encoded in the URL.
  - Example: `Docs/First Traces/1 - Session 1.md` → route `docs/First Traces/Session 1`, URL `/docs/First%20Traces/Session%201`
- **Subfolders** containing `Leader` (case-insensitive) add a `Leader/` URL segment.
  - Example: `Docs/First Traces/Leader Docs/1 - Setup.md` → route `docs/First Traces/Leader/Setup`
- **Other subfolders** are dropped from the URL but still appear as the doc's `group` label in the sidebar.
  - Example: `Docs/First Traces/Participant docs/1 - Session 1.md` → route `docs/First Traces/Session 1`, group `Participant docs`

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

### Adding a New Workshop

A workshop is a whole program: one top-level folder in `Docs/`, plus the two files that build its card on `/workshops`.

1. Create the folder, e.g. `Docs/Second Traces/`, and put its guides inside it.
2. Add `Docs/Second Traces/_info.md` for the card copy — `key: value` lines, one per line. This file is skipped by the doc loader and never becomes a page.

   ```markdown
   name: Second Traces
   tagline: One line on what the club builds.
   description: Longer copy, only shown on the featured card.
   image: https://cdn.hackclub.com/path/to/cover.png
   order: 1
   featured: false
   ```

   All keys are optional except nothing — `name` falls back to the folder name and a missing `image` falls back to the Traces logo on a green panel. `featured: true` renders the card as the large one (if no workshop sets it, the first card is featured).

3. Add a key to `src/lib/workshops.json` if you need to change visibility or the card's target:

   ```json
   {
     "Second Traces": {
       "enabled": true,
       "published": true,
       "startAt": "Introduction"
     }
   }
   ```

   - `enabled` — cards are shown by default; set it to `false` to keep a program off `/workshops`. Its guides are still published, so you can link to them directly. This is how the `Testing` folder stays off the showcase.
   - `published` — set to `false` to unpublish the whole folder: no card, and its docs disappear from the nav and prev/next and are not generated, so their URLs 404. Use it for guides that aren't ready.
   - `startAt` — the title of the doc inside the program the card opens. Leave it out and the card opens the program's first guide.
   - `href` — a full URL, if the card should point somewhere else entirely. Takes priority over `startAt`.

`Docs/Testing/_info.md` and `src/lib/workshops.json` are the reference examples; the file's `$example` key lists every option with its default.

## Markdown Syntax

The renderer (`src/lib/markdown/markdown.js`) supports standard markdown plus these custom extensions.

### Images

Guide images **should be stored on a CDN**, e.g. (`cdn.hackclub.com`) — never commit local copies or reference `/images/...` for doc content. Upload the file to the CDN, then reference the full URL:

```markdown
![Alt text](https://cdn.hackclub.com/path/to/image.png)
```

Local `static/images/` is reserved for site chrome assets (logo, background, section breakers, sticker); doc content should always point to the CDN.

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
- Internal links (starting with `/`) stay in the app.
- Standard markdown link syntax: `[text](url)` or `[text](url "title")`.
