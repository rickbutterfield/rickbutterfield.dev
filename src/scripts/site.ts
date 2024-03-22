document.body.classList.remove('no-js');

// On page load or when changing themes, best to add inline in `head` to avoid FOUC
function checkTheme(document: Document) {
  
  const lightModeIcon = document.getElementById('icon-light');
  lightModeIcon.classList.add('hidden');
  
  const darkModeIcon = document.getElementById('icon-dark');
  darkModeIcon.classList.add('hidden');
  
  const systemModeIcon = document.getElementById('icon-system');
  systemModeIcon.classList.add('hidden');
  
  const localStorageTheme: string = localStorage.getItem('theme');
  const isLocalStorageDarkTheme: boolean = localStorageTheme === 'dark';
  const isLocalStorageLightTheme: boolean = localStorageTheme === 'light';
  const isMatchMediaDarkTheme: boolean = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const currentModeText = document.getElementById('currentModeText');

  if (isLocalStorageDarkTheme || (localStorageTheme == null && isMatchMediaDarkTheme)) {
    document.documentElement.classList.add('dark');
    currentModeText.textContent = 'Dark';
    darkModeIcon.classList.remove('hidden');
  } else if (isLocalStorageLightTheme) {
    document.documentElement.classList.remove('dark');
    currentModeText.textContent = 'Light';
    lightModeIcon.classList.remove('hidden');
  } else {
    currentModeText.textContent = 'System';
    document.documentElement.classList.remove('dark');
    systemModeIcon.classList.remove('hidden');
  }
}

function toggleDropdown(dropdownToggle: HTMLElement, dropdownMenu: HTMLElement) {
  const expanded = dropdownToggle.getAttribute('aria-expanded') === 'true' || false;
  dropdownToggle.setAttribute('aria-expanded', !expanded);
  dropdownMenu.classList.toggle('hidden');
}

function configureToggle() {
  const currentModeText = document.getElementById('currentModeText');
  const dropdownToggle = document.getElementById('dropdown-toggle');
  const dropdownMenu = document.getElementById('dropdown-menu');
  const lightModeOption = document.getElementById('lightModeOption');
  const darkModeOption = document.getElementById('darkModeOption');
  const systemModeOption = document.getElementById('systemModeOption');

  // Open/close dropdown menu
  dropdownToggle.addEventListener('click', e => toggleDropdown(dropdownToggle, dropdownMenu));

  // Set selected mode
  lightModeOption.addEventListener('click', () => {
    currentModeText.textContent = 'Light';
    dropdownMenu.classList.toggle('hidden');
    localStorage.theme = 'light';
    checkTheme(document);
  });

  darkModeOption.addEventListener('click', () => {
    currentModeText.textContent = 'Dark';
    dropdownMenu.classList.toggle('hidden');
    localStorage.theme = 'dark';
    checkTheme(document);
  });

  systemModeOption.addEventListener('click', () => {
    currentModeText.textContent = 'System';
    dropdownMenu.classList.toggle('hidden');
    localStorage.removeItem('theme');
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

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
  checkTheme(document);
});