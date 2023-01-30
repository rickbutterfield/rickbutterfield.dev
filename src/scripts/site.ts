import Cookies from 'js-cookie';

// if ('serviceWorker' in navigator) {
//   console.log('CLIENT: service worker registration in progress.');
//   navigator.serviceWorker.register('/sw.js').then(function () {
//     console.log('CLIENT: service worker registration complete.');
//   }, function () {
//     console.error('CLIENT: service worker registration failure.');
//   });
// } else {
//   console.warn('CLIENT: service worker is not supported.');
// }

document.body.classList.remove('no-js');

let isDarkMode = false;
const darkModeCookie = Cookies.get('rb-dark-mode');

function setDarkModeCookie() {
  Cookies.set('rb-dark-mode', isDarkMode.toString());
}

if (typeof darkModeCookie != "undefined") {
  isDarkMode = JSON.parse(darkModeCookie);
}

else {
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    isDarkMode = true;
    setDarkModeCookie();
  }
}

window.matchMedia('(prefers-color-scheme: dark)').addListener(e => {
  if (e.matches) {
    isDarkMode = true;
  } else {
    isDarkMode = false;
  }
  setModeOptions();
  setDarkModeCookie();
});

function setModeOptions() {
  document.body.dataset.darkMode = isDarkMode.toString();

  let prismScripts = document.querySelectorAll('link[rel="stylesheet"][data-dark-mode]');
  prismScripts.forEach(script => {
    let darkModeValue = JSON.parse(script.getAttribute('data-dark-mode')?.toString()!);
    if (darkModeValue === isDarkMode) {
      if (isDarkMode) {
        script.setAttribute('media', 'screen');
      }
      else {
        script.setAttribute('media', 'screen');
      }
    }
    else {
      script.setAttribute('media', 'none');
    }
  });
}
setModeOptions();

function toggleMode(e: Event) {
  e.preventDefault();
  let darkModeCheck = document.body.dataset.darkMode?.toString()!;
  isDarkMode = !JSON.parse(darkModeCheck);
  setModeOptions();
  setDarkModeCookie();
};

const modeToggle = document.querySelector('.js-mode-toggle');
if (modeToggle) {
  modeToggle.addEventListener('click', toggleMode);
}

export {}