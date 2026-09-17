<script>
  import Footer from './Footer.svelte';
  import { renderMarkdown } from '../lib/markdown.js';

  export let docs = [];
  export let activeSlug = docs[0]?.slug;
  export let logoImage;
  export let footerLinks = [];

  $: activeDoc = docs.find((doc) => doc.slug === activeSlug) ?? docs[0];
  $: activeProgram = activeDoc ? activeDoc.program : null;
  $: visibleDocs = docs.filter(doc => !doc.hidden && doc.program === activeProgram);
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
      <p class="docs-description">Rendered from the markdown files in <code>Docs/</code> with the default Obsidian look.</p>

      <nav class="docs-nav" aria-label="Docs navigation">
        {#each visibleDocs as doc}
          <a href={`#/${doc.route}`} class:active={activeDoc && doc.slug === activeDoc.slug}>
            <span class="doc-group">{doc.group}</span>
            <strong>{doc.title}</strong>
          </a>
        {/each}
      </nav>
    </div>
  </aside>

  <main class="docs-main">
    {#if activeDoc}
      <article class="docs-article markdown-body">
        <header class="docs-article-header">
          <p class="docs-eyebrow">{activeDoc.group}</p>
          <h2>{activeDoc.title}</h2>
        </header>
        {@html renderedContent}

        <nav class="docs-pagination">
            {#if prevDoc}
              <a href={`#/${prevDoc.route}`} class="pagination-btn pagination-prev">
                <span class="pagination-label">← Previous</span>
                <span class="pagination-title">{prevDoc.title}</span>
              </a>
            {:else}
              <span class="pagination-btn pagination-prev pagination-empty" aria-hidden="true"></span>
            {/if}
            {#if nextDoc}
              <a href={`#/${nextDoc.route}`} class="pagination-btn pagination-next">
                <span class="pagination-label">Next →</span>
                <span class="pagination-title">{nextDoc.title}</span>
              </a>
            {:else}
              <span class="pagination-btn pagination-next pagination-empty" aria-hidden="true"></span>
            {/if}
          </nav>
      </article>
    {:else}
      <article class="docs-article markdown-body">
        <p>No docs available.</p>
      </article>
    {/if}
  </main>
</section>

<Footer logoImage={logoImage} links={footerLinks} variant="docs" />
