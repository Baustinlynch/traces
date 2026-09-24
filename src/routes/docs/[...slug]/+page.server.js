import { error, redirect } from '@sveltejs/kit';
import { assets, docs, footerLinks } from '$lib/site-data.js';
import { renderMarkdown } from '$lib/markdown.js';

/**
 * Tell the prerenderer about every doc route (including hidden docs, which
 * are routable but not linked from the nav, so the crawler can't find them).
 */
export function entries() {
  return docs.map((doc) => ({ slug: doc.route.replace(/^docs\//, '') }));
}

export async function load({ params }) {
  // Bare /docs falls back to the first visible doc, matching the old router.
  if (!params.slug) {
    const firstVisible = docs.find((d) => !d.hidden) ?? docs[0];
    if (!firstVisible) error(404, 'No docs available');
    redirect(308, firstVisible.href);
  }

  const routePath = `docs/${params.slug}`;
  let doc = docs.find((d) => d.route === routePath);

  if (!doc) {
    // Legacy URLs addressed docs by slug (e.g. /docs/first-traces-pcb-guide).
    const bySlug = docs.find((d) => d.slug === params.slug);
    if (bySlug) redirect(308, bySlug.href);
    error(404, 'Doc not found');
  }

  const visibleDocs = docs
    .filter((d) => !d.hidden && d.program === doc.program)
    .map(({ slug, title, group, href }) => ({ slug, title, group, href }));

  const currentIndex = visibleDocs.findIndex((d) => d.slug === doc.slug);

  return {
    doc: {
      slug: doc.slug,
      title: doc.title,
      group: doc.group,
      program: doc.program
    },
    // Rendered at build time so the prerendered HTML contains the full content.
    // The page header already renders the doc title, so drop the markdown h1.
    html: await renderMarkdown(doc.content, docs, { removeTitle: true }),
    visibleDocs,
    prevDoc: currentIndex > 0 ? visibleDocs[currentIndex - 1] : null,
    nextDoc: currentIndex >= 0 && currentIndex < visibleDocs.length - 1 ? visibleDocs[currentIndex + 1] : null,
    logoImage: assets.logoImage,
    footerLinks
  };
}
