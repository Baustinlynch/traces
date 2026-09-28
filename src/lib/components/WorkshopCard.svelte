<script>
  let { workshop, logoImage = '' } = $props();

  let featured = $derived(workshop.featured);
</script>

<a class="workshop-card" class:workshop-card--featured={featured} href={workshop.href}>
  <div class="workshop-card-body">
    {#if featured}
      <span class="workshop-badge">Start here</span>
    {/if}
    <h3 class="workshop-card-title">{workshop.name}</h3>
    {#if workshop.tagline}
      <p class="workshop-card-tagline">{workshop.tagline}</p>
    {/if}
    {#if featured && workshop.description}
      <p class="workshop-card-description">{workshop.description}</p>
    {/if}
    <span class="workshop-card-meta">
      {workshop.docCount}
      {workshop.docCount === 1 ? 'page' : 'pages'} · open the guide →
    </span>
  </div>
  <div class="workshop-card-art">
    {#if workshop.image}
      <img src={workshop.image} alt="" loading="lazy" />
    {:else}
      <img src={logoImage} alt="" class="workshop-card-logo" loading="lazy" />
    {/if}
  </div>
</a>
