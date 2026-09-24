<script>
  let { items = [] } = $props();
</script>

<section class="section section-dark" id="path">
  <div class="section-inner">
    <h2 class="h2 h2-light">the path from<br />schematic to solder.</h2>
    <p class="p-lead p-lead-light">
      There's one guide, but where you take it is up to you. Work through it solo or with your
      club, then add your own twist, extra LEDs, sensors, whatever you can dream up in Wokwi.
      Ship it, and we'll fund the parts to bring it off the screen.
    </p>

    <div class="timeline">
      <div class="timeline-track"></div>
      {#each items as item, index}
        <div class="timeline-item">
          <div class="timeline-dot"><span>{index + 1}</span></div>
          <h3>{item.title}</h3>
          <p>{item.body}</p>
        </div>
      {/each}
    </div>
  </div>
</section>
