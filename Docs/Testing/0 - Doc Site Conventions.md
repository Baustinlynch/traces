# Doc Site Conventions

This page is the owner's manual for this docs site. It explains how docs are organized, how URLs and ordering are derived, and the markdown extras the site understands. The whole system is zero-code: everything about a doc comes from where you put the file and what you name it.

> [!note] You're reading a real example
> This page itself demonstrates the conventions. It's just a file at `Docs/Testing/0 - Doc Site Conventions.md`, and every rule it describes is in effect right now.

## Adding a doc

Drop a `.md` file anywhere inside `Docs/` and it's loaded automatically at build time. No imports, no config, no code to touch.

```
Docs/
├── First Traces/
│   ├── Leader Docs/            → Leader segment in the URL
│   └── Participant docs/       → group label only, dropped from the URL
└── Testing/
    ├── 1 - Test Basics.md
    └── Leader Docs/
```

## Where the URL comes from

The URL is derived from the file's location and name:

- The **top-level folder** under `Docs/` is the program segment of the URL.
- A subfolder containing `Leader` becomes a `Leader` segment.
- Other subfolders are dropped from the URL but still shown as the page's group label.

| File | URL |
| --- | --- |
| `Docs/First Traces/Participant docs/PCB Guide.md` | `#/docs/First Traces/PCB Guide` |
| `Docs/Testing/1 - Test Basics.md` | `#/docs/Testing/Test Basics` |
| `Docs/Testing/Leader Docs/8 - Leader Overview.md` | `#/docs/Testing/Leader/Leader Overview` |

> [!tip] Group labels
> The group shown above a page's title is always the name of the folder the file lives in — "Testing", "Leader Docs", "Participant docs", and so on.

## Titles and ordering

- A **leading number** positions the doc in the sidebar and the Previous/Next order. It's stripped from the title and the URL.
- **Unnumbered** docs sort before numbered ones.

So a file named `2 - Test Lists and Tasks.md` sorts after `1 - Test Basics.md` but displays simply as "Test Lists and Tasks".

## Hidden docs

Prefix the filename with `_` to hide a doc. The underscore is stripped from the title and URL, the doc stays direct-linkable, but it's left out of the sidebar and Previous/Next.

```
Docs/Testing/_Test Hidden Doc.md
```

## Navigation is folder-scoped

The sidebar and Previous/Next only show docs from the **same top-level folder** as the page you're viewing. From the PCB Guide you only ever see `First Traces` docs — the `Testing` docs appear only once you're actually inside the Testing folder.

## Markdown extras

Beyond plain markdown, the site understands wikilinks, callouts, and task lists.

- [[Test Basics]] — normal wikilink
- [[Test Tables|Table testing page]] — wikilink with an alias
- [[PCB Guide]] — link into another program folder
- [[Organiser main doc]] — a hidden doc, still reachable by link
- [[Does Not Exist]] — unknown targets fall back to the docs home

Wikilinks resolve against the derived titles, so renaming a file keeps `[[New Title]]` working — but any `[[Old Title]]` references break.

### Callouts

A blockquote whose first line carries a type becomes a callout:

```
> [!note] This is a note
> Body text goes on the following `>` lines.
```

> [!warning] Mini callout
> Any `[a-zA-Z-]` type works: `note`, `tip`, `warning`, `danger`, `success`, `question`, and whatever else you invent. That's `[!warning]` right there.

### Task lists

Start a line with `[ ]` or `[x]`:

```
- [x] write the docs
- [ ] explain markdown extras
```

- [x] Pick a folder and a filename
- [ ] Number it, hide it, or wikilink it

### Code blocks

Fenced code blocks are highlighted with Prism:

```js
const greeting = 'hello from the docs';
console.log(greeting);
```

That's the whole system. Reorder with a number, hide with an underscore, group by folder, link with `[[Title]]` — all by editing files in `Docs/`.