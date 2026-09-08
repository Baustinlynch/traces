<script>
  export let logoImage;
  export let links = [];
</script>

<footer class="footer">
  <div class="footer-inner">
    <img src={logoImage} alt="Traces" class="footer-logo" />
    <p>
      Traces is a Hack Club Clubs YSWS. Follow the guide, build it in Wokwi, and we'll fund the
      parts to make it real. Made by teens, for teens.
    </p>
    <div class="footer-links">
      {#each links as link}
        <a href={link.href} target="_blank" rel="noopener">{link.label}</a>
      {/each}
    </div>
  </div>
</footer>
