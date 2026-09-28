import workshopConfig from './workshops.json';

const backgroundImage = '/images/background.png';
const logoImage = '/images/logo.png';
const sectionBreakerImage = '/images/section-breaker.png';
const sectionBreakerLineImage = '/images/section-breaker-line.png';
const stickerImage = '/images/sticker-primary.png';
const docModules = import.meta.glob('/Docs/**/*.md', {
  query: '?raw',
  import: 'default',
  eager: true
});

function slugify(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function docTitleAndOrder(base) {
  const match = base.match(/^(\d+)\s*[-_.]?\s*(.+)$/);
  if (match) {
    return { order: Number(match[1]), title: match[2].trim() };
  }
  return { order: null, title: base.trim() };
}

export const assets = {
  bgImage: backgroundImage,
  logoImage,
  sectionBreakerImage,
  sectionBreakerLineImage,
  stickerImage
};

export const heroActions = [
  {
    href: '/workshops',
    label: 'Browse the workshops!',
    variant: 'btn-gold'
  },
  {
    href: 'https://traces.fillout.com/traces-ship',
    label: 'Submit your project!',
    variant: 'btn-green'
  },
  {
    href: 'https://traces.fillout.com/traces-workshop',
    label: 'Start your workshop!',
    variant: 'btn-cream'
  },
  {
    href: 'https://hackclub.com/clubs',
    label: 'Bring it to your club',
    variant: 'btn-outline'
  }
];

export const timelineItems = [
  {
    title: 'follow the guide',
    body: 'Open the Traces guide and work through the steps in Wokwi. Learn schematics, code, and debugging, all in the browser.'
  },
  {
    title: 'make it your own',
    body: 'Take the base circuit and add your own components a LED, a sensor, a display, a motor. Experiment freely, nothing burns out.'
  },
  {
    title: 'ship your project',
    body: 'Submit your finished circuit like any other YSWS. Show us what you built and what parts it needs.'
  },
  {
    title: 'get your hardware grant',
    body: 'Approved? We send you a grant to buy the real components so you can build it for real.'
  }
];

export const footerLinks = [
  { href: 'https://hackclub.com', label: 'Hack Club' },
  { href: 'https://wokwi.com', label: 'Wokwi' },
  { href: 'https://hackclub.com/clubs', label: 'Clubs' },
  { href: 'https://hackclub.slack.com', label: 'Slack' }
];

const MAX_ORDER = -1;

// Per-program card metadata for the /workshops page lives in an `_info.md`
// file at the top of the program's Docs/ folder. These files are metadata, not
// pages, so they are skipped by the doc loader below. Whether a card shows up
// at all, and which guide it opens, is set in `workshops.json` instead.
const INFO_FILENAME = '_info.md';
const INFO_BOOL_KEYS = new Set(['featured']);

/** Splits a path into its `Docs/`-relative segments plus the program folder. */
function docPathParts(fullPath) {
  const segments = fullPath.split('/').filter(Boolean);
  const rel = segments.slice(segments.indexOf('Docs') + 1);
  const fileName = rel.pop();
  return { rel, fileName, program: rel.shift() };
}

/**
 * Reads `key: value` lines out of an `_info.md` file. Comments (`#`), list
 * markers and blank lines are ignored, quotes around values are stripped.
 */
function parseProgramInfo(markdown) {
  const info = {};
  for (const rawLine of markdown.split('\n')) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#') || /^[-*>|]/.test(line)) continue;
    const match = line.match(/^([a-z][a-z0-9_-]*)\s*:\s*(.+)$/i);
    if (!match) continue;
    const key = match[1].toLowerCase();
    const value = match[2].trim().replace(/^["']|["']$/g, '');
    info[key] = INFO_BOOL_KEYS.has(key) ? value.toLowerCase() === 'true' : value;
  }
  return info;
}

const programInfo = new Map();
for (const [fullPath, content] of Object.entries(docModules)) {
  const { fileName, program } = docPathParts(fullPath);
  if (program && fileName.toLowerCase() === INFO_FILENAME) {
    programInfo.set(program, parseProgramInfo(content));
  }
}

// Keys starting with `$` or `_` in workshops.json are documentation, not
// programs (`$example` holds the annotated list of options).
const configuredPrograms = Object.keys(workshopConfig).filter(
  (key) => !key.startsWith('$') && !key.startsWith('_')
);

const configFor = (program) => workshopConfig[program] ?? {};

// `enabled: false` only hides the card on /workshops — the guides stay routable
// and can still be linked to by hand.
const cardlessPrograms = new Set(
  configuredPrograms.filter((program) => configFor(program).enabled === false)
);

// `published: false` unpublishes the whole folder: no card, and none of its
// docs are published either, so they never appear in the nav or prev/next and
// are not prerendered, meaning their URLs 404.
const unpublishedPrograms = new Set(
  configuredPrograms.filter((program) => configFor(program).published === false)
);

export const docs = Object.entries(docModules)
  .map(([fullPath, content]) => {
    const { rel, fileName, program } = docPathParts(fullPath);
    const base = fileName.replace(/\.md$/, '');
    if (base.toLowerCase() === INFO_FILENAME.replace(/\.md$/, '')) return null;
    const hidden = base.startsWith('_');
    const clean = hidden ? base.slice(1) : base;
    const { order, title } = docTitleAndOrder(clean);
    const leader = rel.some((dir) => /leader/i.test(dir));
    const subRoute = leader ? 'Leader/' : '';
    const group = rel.length ? rel[rel.length - 1] : program;
    const route = `docs/${program}/${subRoute}${title}`;
    return {
      slug: `${slugify(program)}-${slugify(title)}`,
      program,
      group,
      title,
      order: order ?? MAX_ORDER,
      hidden,
      route,
      // Root-relative, percent-encoded URL for SvelteKit's file-based router.
      href: `/${route.split('/').map(encodeURIComponent).join('/')}`,
      content
    };
  })
  .filter(Boolean)
  .filter((doc) => !unpublishedPrograms.has(doc.program))
  .sort((a, b) => a.order - b.order);

/**
 * The /workshops showcase: one card per Docs/ program folder. Copy comes from
 * the program's `_info.md`; `workshops.json` decides whether the card is shown
 * at all and which guide it opens. The card flagged `featured: true` (or the
 * first one, if none is flagged) is rendered larger.
 */
function resolveWorkshopHref(program, programDocs, config) {
  const firstDoc = programDocs[0];
  const fallback = firstDoc ? firstDoc.href : `/docs/${encodeURIComponent(program)}`;
  if (config.href) return config.href;
  if (config.startAt) {
    // `startAt` is a doc title within the program; unknown titles fall back.
    const target = programDocs.find(
      (doc) => doc.title.toLowerCase() === String(config.startAt).trim().toLowerCase()
    );
    if (target) return target.href;
  }
  return fallback;
}

const orderedWorkshops = [...new Set([
  ...docs.map((doc) => doc.program),
  ...programInfo.keys(),
  ...configuredPrograms
])]
  .filter((program) => !unpublishedPrograms.has(program) && !cardlessPrograms.has(program))
  .map((program) => {
    const info = programInfo.get(program) ?? {};
    const config = configFor(program);
    const programDocs = docs.filter((d) => d.program === program && !d.hidden);
    const order = Number.parseInt(info.order, 10);
    return {
      program,
      name: info.name || program,
      tagline: info.tagline || '',
      description: info.description || '',
      image: info.image || null,
      docCount: programDocs.length,
      order: Number.isNaN(order) ? MAX_ORDER : order,
      featured: info.featured === true,
      href: resolveWorkshopHref(program, programDocs, config)
    };
  })
  .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));

const featuredIndex = Math.max(0, orderedWorkshops.findIndex((w) => w.featured));

export const workshops = orderedWorkshops.map((workshop, i) => ({
  ...workshop,
  featured: i === featuredIndex
}));
