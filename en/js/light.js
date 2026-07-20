const isdark = 'dark'; // default theme, light for light mode, dark for dark mode

function applyTheme() {
  try {
    const theme = localStorage.getItem('theme') || isdark;
    const htmlDom = document.documentElement;
    const themeBtn = document.querySelector('.darkbut');

    htmlDom.classList.toggle('dark', theme === 'dark');
    if (themeBtn) {
      if (theme === 'dark') {
        themeBtn.innerHTML = '<i class="ri-sun-line"></i><span class="msgtitle">Switch Theme</span>';
      } else {
        themeBtn.innerHTML = '<i class="ri-moon-line"></i><span class="msgtitle">Switch Theme</span>';
      }
    }
  } catch (err) {
    console.warn('Failed to read local storage, using light mode', err);
    document.documentElement.classList.remove('dark');
  }
}

document.addEventListener('DOMContentLoaded', function () {
  applyTheme();
  const themeBtn = document.querySelector('.darkbut');
  if (!themeBtn) return;

  themeBtn.addEventListener('click', function () {
    const htmlDom = document.documentElement;
    const isDark = htmlDom.classList.contains('dark');
    const newTheme = isDark ? 'light' : 'dark';

    localStorage.setItem('theme', newTheme);
    applyTheme();

    if (typeof showMessage === 'function') {
      showMessage(newTheme === 'dark' ? 'Switched to dark mode!' : 'Switched to light mode!', 'success');
    }
  });
});

window.addEventListener('pageshow', function (e) {
  if (e.persisted) {
    applyTheme();
  }
});