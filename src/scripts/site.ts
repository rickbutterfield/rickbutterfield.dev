document.body.classList.remove('no-js');

// On page load or when changing themes, best to add inline in `head` to avoid FOUC
function checkTheme(document: Document) {
  
  const lightModeIcon = document.getElementById('icon-light');
  const darkModeIcon = document.getElementById('icon-dark');
  
  if (!lightModeIcon || !darkModeIcon) {
    console.warn('Theme icons not found');
    return;
  }
  
  // Hide both icons first
  lightModeIcon.classList.add('hidden');
  darkModeIcon.classList.add('hidden');
  
  const localStorageTheme: string = localStorage.getItem('theme');
  const isLocalStorageDarkTheme: boolean = localStorageTheme === 'dark';

  if (isLocalStorageDarkTheme) {
    document.documentElement.dataset.userTheme = 'dark';
    darkModeIcon.classList.remove('hidden');
  } else {
    document.documentElement.dataset.userTheme = 'light';
    lightModeIcon.classList.remove('hidden');
  }
}

function configureToggle() {
  const themeToggle = document.getElementById('theme-toggle');

  if (!themeToggle) {
    console.warn('Theme toggle button not found');
    return;
  }

  // Toggle between light and dark mode
  themeToggle.addEventListener('click', () => {
    const currentTheme = localStorage.getItem('theme');
    const isDark = currentTheme === 'dark';
    
    // Toggle to opposite theme
    localStorage.theme = isDark ? 'light' : 'dark';
    checkTheme(document);
  });
}

document.addEventListener('astro:before-swap', (ev: any) => {
  checkTheme(ev.newDocument);
});

document.addEventListener('astro:page-load', () => {
  checkTheme(document);
  configureToggle();
});