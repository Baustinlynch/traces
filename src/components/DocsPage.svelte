<script>
  import Footer from './Footer.svelte';
  import { renderMarkdown } from '../lib/markdown.js';

  export let docs = [];
  export let activeSlug = docs[0]?.slug;
  export let logoImage;
  export let footerLinks = [];

  $: visibleDocs = docs.filter(doc => !doc.hidden);
  $: activeDoc = docs.find((doc) => doc.slug === activeSlug) ?? docs[0];
  $: renderedContent = activeDoc ? renderMarkdown(activeDoc.content, docs) : '<p>No docs found.</p>';

  $: currentIndex = visibleDocs.findIndex(doc => doc.slug === activeSlug);
  $: prevDoc = currentIndex > 0 ? visibleDocs[currentIndex - 1] : null;
  $: nextDoc = currentIndex < visibleDocs.length - 1 ? visibleDocs[currentIndex + 1] : null;
</script>

<section class="docs-shell">
  <aside class="docs-sidebar">
    <div class="docs-sidebar-inner">
      <p class="docs-eyebrow">Docs</p>
      <h1 class="docs-title">Workshop notes</h1>
      <p class="docs-description">Rendered from the markdown files in <code>Docs/</code> with an Obsidian-inspired reading layout.</p>

      <nav class="docs-nav" aria-label="Docs navigation">
        {#each docs.filter(doc => !doc.hidden) as doc}
          <a href={`#/docs/${doc.slug}`} class:active={activeDoc && doc.slug === activeDoc.slug}>
            <span class="doc-group">{doc.group}</span>
            <strong>{doc.title}</strong>
          </a>
        {/each}
      </nav>
    </div>
  </aside>

  <main class="docs-main">
    {#if activeDoc}
      <div class="docs-breadcrumb">{activeDoc.path}</div>
      <article class="docs-article markdown-body">
        <header class="docs-article-header">
          <p class="docs-eyebrow">{activeDoc.group}</p>
          <h2>{activeDoc.title}</h2>
        </header>
        {@html renderedContent}

        {#if visibleDocs.length > 1}
          <nav class="docs-pagination">
            {#if prevDoc}
              <a href={`#/docs/${prevDoc.slug}`} class="pagination-btn">
                <span>←</span> {prevDoc.title}
              </a>
            {:else}
              <div class="pagination-btn disabled"></div>
            {/if}
            {#if nextDoc}
              <a href={`#/docs/${nextDoc.slug}`} class="pagination-btn">
                {nextDoc.title} <span>→</span>
              </a>
            {:else}
              <div class="pagination-btn disabled"></div>
            {/if}
          </nav>
        {/if}
      </article>
    {:else}
      <article class="docs-article markdown-body">
        <p>No docs available.</p>
      </article>
    {/if}
  </main>
</section>

<Footer logoImage={logoImage} links={footerLinks} />
