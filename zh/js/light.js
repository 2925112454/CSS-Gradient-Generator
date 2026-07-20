const isdark = 'dark';//默认主题,light为浅色，dark为深色
function applyTheme() {
  try {
    const theme = localStorage.getItem('theme') || isdark;
    const html_dom = document.documentElement;
    const themeBtn = document.querySelector('.darkbut');

    html_dom.classList.toggle('dark', theme === 'dark');
    if (themeBtn) {
      if (theme === 'dark') {
        themeBtn.innerHTML = '<i class="ri-sun-line"></i><span class="msgtitle">切换主题</span>';
      } else {
        themeBtn.innerHTML = '<i class="ri-moon-line"></i><span class="msgtitle">切换主题</span>';
      }
    }
  } catch (err) {
    console.warn('本地存储读取失败，使用浅色模式', err);
    document.documentElement.classList.remove('dark');
  }
}

// DOM加载完成初始化
document.addEventListener('DOMContentLoaded', function () {
  applyTheme();
  const themeBtn = document.querySelector('.darkbut');
  if (!themeBtn) return;

  themeBtn.addEventListener('click', function () {
    const html_dom = document.documentElement;
    const isDark = html_dom.classList.contains('dark');
    const newTheme = isDark ? 'light' : 'dark';

    // 持久化存储
    localStorage.setItem('theme', newTheme);
    applyTheme();

    // 提示消息兼容
    if (typeof showMessage === 'function') {
      showMessage(newTheme === 'dark' ? '已切换到深色模式！' : '已切换到浅色模式！', 'success');
    }
  });
});

// 兼容浏览器bfcache（后退/前进页面缓存）
window.addEventListener('pageshow', function (e) {
  if (e.persisted) {
    applyTheme();
  }
});