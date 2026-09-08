<script>
  import LandingPage from './components/LandingPage.svelte';
  import DocsPage from './components/DocsPage.svelte';
  import { assets, docs, footerLinks, heroActions, timelineItems } from './lib/site-data.js';

  function getRoute() {
    const hash = window.location.hash || '#/';
    const trimmed = hash.startsWith('#') ? hash.slice(1) : hash;
    const parts = trimmed.split('/').filter(Boolean);

    if (parts[0] === 'docs') {
      return {
        page: 'docs',
        slug: parts[1] ?? docs[0]?.slug ?? null
      };
    }

    return {
      page: 'home',
      slug: null
    };
  }

  let route = getRoute();

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
    href="https://fonts.googleapis.com/css2?family=Jersey+20&family=Fredoka:wght@400;500;600;700&display=swap"
    rel="stylesheet"
  />
</svelte:head>

{#if route.page === 'docs'}
  <DocsPage docs={docs} activeSlug={route.slug} logoImage={assets.logoImage} footerLinks={footerLinks} />
{:else}
  <LandingPage assets={assets} heroActions={heroActions} timelineItems={timelineItems} footerLinks={footerLinks} />
{/if}
