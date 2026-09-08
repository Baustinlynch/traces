<script>
  import LandingPage from './components/LandingPage.svelte';
  import DocsPage from './components/DocsPage.svelte';
  import Header from './components/Header.svelte';
  import { assets, docs, footerLinks, heroActions, timelineItems } from './lib/site-data.js';

  function getRoute() {
    const hash = window.location.hash || '#/';
    const trimmed = hash.startsWith('#') ? hash.slice(1) : hash;
    const parts = trimmed.split('/').filter(Boolean);

    if (parts[0] === 'first-traces') {
      return {
        page: 'docs',
        slug: 'first-traces-pcb-guide'
      };
    }

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

  let route = $state(getRoute());

  // Theme Management
  let theme = $state('dark');

  function initTheme() {
    const saved = localStorage.getItem('theme');
    if (saved) {
      theme = saved;
    } else {
      // Default light for docs, dark for home
      theme = route.page === 'docs' ? 'light' : 'dark';
    }
    applyTheme();
  }

  function toggleTheme() {
    theme = theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', theme);
    applyTheme();
  }

  function applyTheme() {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('light-theme', theme === 'light');
    }
  }

  function updateRoute() {
    route = getRoute();
    // If no explicit user preference, adjust default based on route
    if (!localStorage.getItem('theme')) {
      theme = route.page === 'docs' ? 'light' : 'dark';
      applyTheme();
    }
  }

  if (typeof window !== 'undefined') {
    window.addEventListener('hashchange', updateRoute);
    initTheme();
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

<Header page={route.page} {theme} onToggle={toggleTheme} />

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
