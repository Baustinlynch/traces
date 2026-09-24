<script>
  let { backgroundImage, actions = [] } = $props();
</script>

<section class="hero" id="top">
  <div class="hero-bg" aria-hidden="true" style={`background-image: url(${backgroundImage});`}></div>
  <div class="hero-vignette" aria-hidden="true"></div>

  <div class="hero-content">
    <h1 class="hero-title">
      <span class="title-line">THE FIRST HARDWARE SERIES</span>
      <span class="title-line title-accent">*for clubs </span>
    </h1>
    <p class="hero-sub">
      Traces is a <strong>you ship, we ship</strong> hardware series for clubs: Pick from the selection
      of projects, follow the in-depth guides,
      design and simulate real circuits in Wokwi, add your own components, and we'll
      <strong>grant you the parts</strong> to build it for real. No breadboard required to get
      started, just a browser and an idea.
    </p>
    <div class="hero-actions">
      {#each actions as action}
        <a href={action.href} target="_blank" rel="noopener" class={`btn ${action.variant}`}>{action.label}</a>
      {/each}
    </div>
  </div>
</section>
