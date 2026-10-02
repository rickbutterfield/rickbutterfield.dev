document.body.classList.remove('no-js');

// Two-state theme toggle: the site follows the OS theme, and the toggle switches
// to the opposite of it. Only that override is stored; toggling back clears it.
// See https://lea.verou.me/blog/2026/dark-mode-toggles-2/
// The initial theme is set by an inline script in BaseHead.astro to avoid a flash.
type Theme = 'light' | 'dark';

const systemDark = window.matchMedia('(prefers-color-scheme: dark)');

function getSystemTheme(): Theme {
  return systemDark.matches ? 'dark' : 'light';
}

function getOverride(): Theme | null {
  try {
    const stored = localStorage.getItem('theme');
    return stored === 'light' || stored === 'dark' ? stored : null;
  } catch {
    return null;
  }
}

function setOverride(theme: Theme | null) {
  try {
    if (theme) {
      localStorage.setItem('theme', theme);
    } else {
      localStorage.removeItem('theme');
    }
  } catch {
    // Storage unavailable (e.g. private mode): the toggle still works for this page
  }
}

function getTheme(): Theme {
  return getOverride() ?? getSystemTheme();
}

function applyTheme(document: Document, theme: Theme = getTheme()) {
  document.documentElement.dataset.userTheme = theme;

  const lightModeIcon = document.getElementById('icon-light');
  const darkModeIcon = document.getElementById('icon-dark');
  lightModeIcon?.classList.toggle('hidden', theme === 'dark');
  darkModeIcon?.classList.toggle('hidden', theme === 'light');

  document.getElementById('theme-toggle')?.setAttribute('aria-pressed', String(theme === 'dark'));
}

function configureToggle() {
  const themeToggle = document.getElementById('theme-toggle');

  if (!themeToggle) {
    console.warn('Theme toggle button not found');
    return;
  }

  themeToggle.addEventListener('click', () => {
    const next: Theme = getTheme() === 'dark' ? 'light' : 'dark';
    // Back to matching the OS means "follow the system" again, so drop the override
    setOverride(next === getSystemTheme() ? null : next);
    applyTheme(document, next);
  });
}

// Follow OS changes; an override that now matches the system is no longer needed
systemDark.addEventListener('change', () => {
  if (getOverride() === getSystemTheme()) {
    setOverride(null);
  }
  applyTheme(document);
});

document.addEventListener('astro:before-swap', (ev: any) => {
  applyTheme(ev.newDocument);
});

document.addEventListener('astro:page-load', () => {
  applyTheme(document);
  configureToggle();
});
