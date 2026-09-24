<script>
  import { page } from '$app/state';
</script>

<svelte:head>
  <title>{page.status} · Traces</title>
</svelte:head>

<section class="docs-shell">
  <main class="docs-main">
    <article class="docs-article markdown-body">
      <h2>{page.status}</h2>
      <p>{page.error?.message ?? 'Something went wrong.'}</p>
      <p><a href="/">Back home</a> · <a href="/docs">Open the docs</a></p>
    </article>
  </main>
</section>
