<script>
  import { buildLabel, buildId } from '$lib/build.js';

  let { logoImage, links = [], variant = '' } = $props();

  // Extract commit hash from buildLabel (format: "built from commit <hash>")
  const commitHash = buildLabel.replace('built from commit ', '');
  const isDevBuild = buildLabel === 'dev build';
  const commitUrl = isDevBuild ? null : `https://github.com/Baustinlynch/traces/commit/${commitHash}`;
</script>

<style>
  /* Hide the build label by default and make it fade in on hover */
  .footer-build {
    display: none;
    opacity: 0;
    transition: opacity 0.2s ease-in-out;
    visibility: hidden;
  }

  /* Show the build label when hovering anywhere on the footer */
  .footer:hover .footer-build {
    display: inline;
    opacity: 1;
    visibility: visible;
  }

  /* Style the commit link */
  .footer-build a {
    color: inherit;
    text-decoration: none;
    border-bottom: 1px dotted currentColor;
  }

  .footer-build a:hover {
    border-bottom-style: solid;
  }
</style>

<footer class="footer" class:footer--docs={variant === 'docs'}>  
  <div class="footer-inner">
    <img src={logoImage} alt="Traces" class="footer-logo" />
    <p>
      Traces is a Hack Club Clubs YSWS.
    </p>
    <p>
        Made by teens, for teens.
    </p>
    <p class="footer-credit">The Hack Foundation</p>
    <div class="footer-links">
      {#each links as link}
        <a href={link.href} target="_blank" rel="noopener">{link.label}</a>
      {/each}
    </div>
    <p class="footer-build" title={buildLabel}>
      {#if isDevBuild}
        {buildLabel}
      {:else}
        built from commit <a href={commitUrl} target="_blank" rel="noopener">{commitHash}</a>
      {/if}
    </p>
  </div>
</footer>