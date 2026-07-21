// Default theme: 'light' for light mode, 'dark' for dark mode
const defaultTheme = 'dark';

function applyTheme() {
  try {
    const theme = localStorage.getItem('theme') || defaultTheme;
    const htmlElement = document.documentElement;
    const themeBtn = document.querySelector('.darkbut');

    htmlElement.classList.toggle('dark', theme === 'dark');
    
    if (themeBtn) {
      if (theme === 'dark') {
        themeBtn.innerHTML = '<i class="ri-sun-line"></i><span class="msgtitle">Toggle Theme</span>';
      } else {
        themeBtn.innerHTML = '<i class="ri-moon-line"></i><span class="msgtitle">Toggle Theme</span>';
      }
    }
  } catch (err) {
    console.warn('Failed to read local storage, falling back to light mode', err);
    document.documentElement.classList.remove('dark');
  }
}

// Initialize after DOM content is fully loaded
document.addEventListener('DOMContentLoaded', function () {
  applyTheme();
  const themeBtn = document.querySelector('.darkbut');
  if (!themeBtn) return;

  themeBtn.addEventListener('click', function () {
    const htmlElement = document.documentElement;
    const isDark = htmlElement.classList.contains('dark');
    const newTheme = isDark ? 'light' : 'dark';

    // Persist theme preference to local storage
    localStorage.setItem('theme', newTheme);
    applyTheme();

    // Compatibility with message notification function
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