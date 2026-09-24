<script>
  import Footer from '$lib/components/Footer.svelte';
  import { theme, toggleTheme } from '$lib/theme.svelte.js';

  let { data } = $props();

  let doc = $derived(data.doc);
  let visibleDocs = $derived(data.visibleDocs);
  let prevDoc = $derived(data.prevDoc);
  let nextDoc = $derived(data.nextDoc);
</script>

<svelte:head>
  <title>{doc.title} · Traces Docs</title>
  <meta name="description" content={`${doc.title} — ${doc.group} · Traces documentation`} />
</svelte:head>

<section class="docs-shell">
  <aside class="docs-sidebar">
    <div class="docs-sidebar-inner">
      <p class="docs-eyebrow">Docs</p>
      <h1 class="docs-title">Workshop notes</h1>
      <p class="docs-description">Rendered from the markdown files in <code>Docs/</code> with the default Obsidian look.</p>
      <button type="button" class="theme-toggle" onclick={toggleTheme}>
        {theme.value === 'dark' ? '☀ Light mode' : '☾ Dark mode'}
      </button>

      <nav class="docs-nav" aria-label="Docs navigation">
        {#each visibleDocs as navDoc (navDoc.slug)}
          <a href={navDoc.href} class:active={navDoc.slug === doc.slug}>
            <span class="doc-group">{navDoc.group}</span>
            <strong>{navDoc.title}</strong>
          </a>
        {/each}
      </nav>
    </div>
  </aside>

  <main class="docs-main">
    <article class="docs-article markdown-body">
      <header class="docs-article-header">
        <p class="docs-eyebrow">{doc.group}</p>
        <h2>{doc.title}</h2>
      </header>
      {@html data.html}

      <nav class="docs-pagination">
        {#if prevDoc}
          <a href={prevDoc.href} class="pagination-btn pagination-prev">
            <span class="pagination-label">← Previous</span>
            <span class="pagination-title">{prevDoc.title}</span>
          </a>
        {:else}
          <span class="pagination-btn pagination-prev pagination-empty" aria-hidden="true"></span>
        {/if}
        {#if nextDoc}
          <a href={nextDoc.href} class="pagination-btn pagination-next">
            <span class="pagination-label">Next →</span>
            <span class="pagination-title">{nextDoc.title}</span>
          </a>
        {:else}
          <span class="pagination-btn pagination-next pagination-empty" aria-hidden="true"></span>
        {/if}
      </nav>
    </article>
  </main>
</section>

<Footer logoImage={data.logoImage} links={data.footerLinks} variant="docs" />
