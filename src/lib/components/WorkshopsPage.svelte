<script>
  import WorkshopCard from './WorkshopCard.svelte';
  import Footer from './Footer.svelte';

  let { workshops = [], logoImage = '', backgroundImage = '', footerLinks = [] } = $props();

  let featured = $derived(workshops.find((workshop) => workshop.featured) ?? workshops[0] ?? null);
</script>

<section class="workshops-head">
  <div class="workshops-head-bg" aria-hidden="true" style={`background-image: url(${backgroundImage});`}></div>
  <div class="workshops-head-inner">
    <div class="workshops-head-top">
      <a class="workshops-home" href="/">← Traces</a>
    </div>
    <h1 class="workshops-title">Pick your trace</h1>
    <p class="workshops-sub">
      Every Traces series ships as a workshop: a <strong>you ship, we ship</strong> build where you
      design and simulate real circuits, then get a grant for the parts. Start with First Traces,
      or pick whichever series your club wants to run.
    </p>
    {#if featured}
      <a class="btn btn-gold btn-large" href={featured.href}>Start {featured.name} →</a>
    {/if}
  </div>
</section>

<main class="workshops-body">
  <div class="workshops-grid">
    {#each workshops as workshop (workshop.program)}
      <WorkshopCard {workshop} {logoImage} />
    {/each}
  </div>

  {#if workshops.length === 0}
    <p class="workshops-empty">No workshops published yet — check back soon.</p>
  {/if}
</main>

<Footer {logoImage} links={footerLinks} variant="docs" />
