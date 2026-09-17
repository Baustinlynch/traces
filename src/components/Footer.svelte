<script>
  export let logoImage;
  export let links = [];
  export let variant = '';
</script>

<footer class="footer" class:footer--docs={variant === 'docs'}>
  <div class="footer-inner">
    <img src={logoImage} alt="Traces" class="footer-logo" />
    <p>
      Traces is a Hack Club Clubs YSWS.
    </p>
    <p>
        Made by teens, for teens.
    </p>
    <div class="footer-links">
      {#each links as link}
        <a href={link.href} target="_blank" rel="noopener">{link.label}</a>
      {/each}
    </div>
  </div>
</footer>
