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
    href: 'https://canva.link/traces',
    label: 'Start the guide!',
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

export const docs = Object.entries(docModules)
  .map(([fullPath, content]) => {
    const segments = fullPath.split('/').filter(Boolean);
    const docsIndex = segments.indexOf('Docs');
    const rel = segments.slice(docsIndex + 1);
    const fileName = rel.pop();
    const program = rel.shift();
    const base = fileName.replace(/\.md$/, '');
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
  .sort((a, b) => a.order - b.order);
