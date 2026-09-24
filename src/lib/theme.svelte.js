import { browser } from '$app/environment';

const STORAGE_KEY = 'traces-theme';

/**
 * Per-page defaults: the landing page is dark, docs pages are light.
 * These only apply while the user has not explicitly toggled a theme.
 */
export function defaultThemeFor(pathname) {
  return pathname.startsWith('/docs') || pathname.startsWith('/first-traces') ? 'light' : 'dark';
}

function storedTheme() {
  if (!browser) return null;
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value === 'light' || value === 'dark' ? value : null;
  } catch {
    return null;
  }
}

function currentTheme() {
  if (!browser) return 'light';
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
}

export const theme = $state({
  value: currentTheme(),
  userChosen: storedTheme() !== null
});

function apply(value) {
  theme.value = value;
  if (browser) {
    document.documentElement.dataset.theme = value;
  }
}

/** Explicit user toggle: persists and stops route-based defaults. */
export function toggleTheme() {
  const next = theme.value === 'dark' ? 'light' : 'dark';
  theme.userChosen = true;
  apply(next);
  try {
    localStorage.setItem(STORAGE_KEY, next);
  } catch {}
}

/** Re-apply the per-page default on navigation unless the user has toggled. */
export function syncThemeWithRoute(pathname) {
  if (theme.userChosen) return;
  apply(defaultThemeFor(pathname));
}
