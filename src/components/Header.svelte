<script>
  import ThemeToggle from './ThemeToggle.svelte';
  import logoImage from '../../assets/logo.png';

  let { page = 'home', theme = 'dark', onToggle = () => {} } = $props();
</script>

<header class="site-header">
  <div class:docs-header={page === 'docs'} class="header-inner">
    <a href="#/" class="header-logo-link">
      <img src={logoImage} alt="Traces Logo" class="header-logo" />
    </a>
    {#if page === 'docs'}
      <ThemeToggle {theme} {onToggle} />
    {/if}
  </div>
</header>

<style>
  .site-header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
    padding: 16px 24px;
    pointer-events: none;
  }

  .header-inner {
    max-width: var(--maxw);
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    pointer-events: auto;
  }

  .docs-header {
    padding: 10px 14px;
    border-radius: 16px;
    border: 1px solid var(--obsidian-border);
    background: color-mix(in srgb, var(--obsidian-panel) 88%, transparent);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
    backdrop-filter: blur(10px);
  }

  .header-logo-link {
    display: flex;
    align-items: center;
    transition: opacity 0.2s ease;
    flex-shrink: 0;
  }

  .header-logo-link:hover {
    opacity: 0.8;
  }

  .header-logo {
    height: 32px;
    width: auto;
  }

  @media (max-width: 880px) {
    .site-header {
      padding: 14px 16px;
    }

    .header-inner {
      gap: 12px;
      flex-wrap: wrap;
    }

    .docs-header {
      padding: 10px 12px;
      border-radius: 14px;
    }
  }
</style>
