<script>
  import '../app.css';
  import { page } from '$app/state';
  import { syncThemeWithRoute } from '$lib/theme.svelte.js';

  let { children } = $props();

  // Re-apply the per-page theme default on navigation (home → dark,
  // docs → light) unless the user has explicitly toggled a theme.
  $effect(() => {
    syncThemeWithRoute(page.url.pathname);
  });
</script>

<!-- Hidden SVG filter for hand-drawn button edges -->
<svg style="position:absolute;width:0;height:0;overflow:hidden;pointer-events:none" aria-hidden="true">
  <defs>
    <filter id="hand-drawn" x="-8%" y="-15%" width="125%" height="145%">
      <feTurbulence type="fractalNoise" baseFrequency="0.025 0.03" numOctaves="2" seed="12" result="noise"/>
      <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G"/>
    </filter>
  </defs>
</svg>

{@render children()}
