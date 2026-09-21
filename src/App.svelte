<script>
  import LandingPage from './components/LandingPage.svelte';
  import DocsPage from './components/DocsPage.svelte';
  import { assets, docs, footerLinks, heroActions, timelineItems } from './lib/site-data.js';

  function decode(part) {
    try {
      return decodeURIComponent(part);
    } catch {
      return part;
    }
  }

  function getRoute() {
    const hash = window.location.hash || '#/';
    const trimmed = hash.startsWith('#') ? hash.slice(1) : hash;
    const parts = trimmed.split('/').filter(Boolean).map(decode);

    if (parts[0] === 'first-traces') {
      return {
        page: 'docs',
        slug: 'first-traces-pcb-guide'
      };
    }

    if (parts[0] === 'docs') {
      const routePath = parts.join('/');
      const byRoute = docs.find((doc) => doc.route === routePath);
      if (byRoute) {
        return {
          page: 'docs',
          slug: byRoute.slug
        };
      }

      const bySlug = parts[1] ? docs.find((doc) => doc.slug === parts[1]) : null;
      if (bySlug) {
        return {
          page: 'docs',
          slug: bySlug.slug
        };
      }

      const firstVisible = docs.find((doc) => !doc.hidden);
      return {
        page: 'docs',
        slug: firstVisible?.slug ?? docs[0]?.slug ?? null
      };
    }

    return {
      page: 'home',
      slug: null
    };
  }

  let route = $state(getRoute());

  function updateRoute() {
    route = getRoute();
  }

  if (typeof window !== 'undefined') {
    window.addEventListener('hashchange', updateRoute);
  }
</script>

<svelte:head>
  <title>{route.page === 'docs' ? 'Traces Docs' : 'Traces'}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
  <link
    href="https://fonts.googleapis.com/css2?family=Jersey+20&family=Fredoka:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap"
    rel="stylesheet"
  />
</svelte:head>

<!-- Hidden SVG filter for hand-drawn button edges -->
<svg style="position:absolute;width:0;height:0;overflow:hidden;pointer-events:none" aria-hidden="true">
  <defs>
    <filter id="hand-drawn" x="-8%" y="-15%" width="125%" height="145%">
      <feTurbulence type="fractalNoise" baseFrequency="0.025 0.03" numOctaves="2" seed="12" result="noise"/>
      <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G"/>
    </filter>
  </defs>
</svg>

{#if route.page === 'docs'}
  <DocsPage
    docs={docs}
    activeSlug={route.slug}
    logoImage={assets.logoImage}
    footerLinks={footerLinks}
  />
{:else}
  <LandingPage
    assets={assets}
    heroActions={heroActions}
    timelineItems={timelineItems}
    footerLinks={footerLinks}
  />
{/if}