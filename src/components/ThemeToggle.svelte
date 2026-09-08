<script>
  let { theme = 'dark', onToggle = () => {} } = $props();

  const themeLabels = {
    dark: '☾ Dark Mode',
    light: '☀ Light Mode'
  };
</script>

<button
  class="theme-toggle"
  onclick={onToggle}
  aria-label="Toggle theme"
>
  {themeLabels[theme]}
</button>

<style>
  .theme-toggle {
    background: transparent;
    border: 1px solid var(--obsidian-border);
    color: var(--obsidian-text);
    padding: 6px 12px;
    border-radius: 8px;
    cursor: pointer;
    font-family: var(--font-round);
    font-size: 0.85rem;
    transition: all 0.2s ease;
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  .theme-toggle:hover {
    background: var(--obsidian-panel-soft);
    border-color: var(--obsidian-muted);
  }
</style>
