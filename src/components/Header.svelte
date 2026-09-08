<script>
  export let isDocs = false;
</script>

<header class="site-header">
  <div class="site-header-inner">
    <a class="site-brand" href="#/">Traces</a>
    <nav class="site-nav" aria-label="Primary">
      <a href={isDocs ? '#/' : '#what'}>About</a>
      <a href={isDocs ? '#/' : '#path'}>Path</a>
      <a href="#/docs">Docs</a>
      <a href={isDocs ? '#/' : '#apply'}>Apply</a>
    </nav>
  </div>
</header>
