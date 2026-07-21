document.addEventListener('DOMContentLoaded', function () {

  /* 提示组件 */
  /**
   * DOM元素抖动警告动画
   * @param {HTMLElement} el 需要抖动的DOM元素
   * @param {number} duration 抖动时长(毫秒)，默认600
   */
  function shakeDom(el, duration = 600) {
    if (!el || !(el instanceof HTMLElement)) return;
    // 移除残留动画类，重置状态
    el.classList.remove('shake-warning');
    void el.offsetWidth; // 强制回流，重启动画
    el.classList.add('shake-warning');
    // 动画结束自动移除类名
    setTimeout(() => {
      el.classList.remove('shake-warning');
    }, duration);
  }
  /**
   * 消息提示
   * @param {string} text 提示内容
   * @param {string} type 消息类型：info(普通) / warning(警告) / error(错误) / success(通过)
   * @param {HTMLElement|null} targetDom 提示时抖动的DOM元素(可选)
   * @param {number} delay 提示框自动关闭时间(毫秒)，0=不自动关闭，可选
   * 使用方式：showMessage('提示内容', 'info', document.querySelector('.search-input'), 2500);
   */
  function showMessage(text, type = 'info', targetDom = null , delay = 2500) {
    const messageWrap = document.querySelector('.message');
    const messageContent = document.querySelector('.message_content');
    const messageText = document.querySelector('.message_text');
    const closeBtn = document.querySelector('.message_close');

    if (!messageWrap || !messageContent || !messageText || !closeBtn) return;

    // 消息类型图标配置
    const iconMap = {
      info: '<i class="ri-error-warning-fill"></i>',
      warning: '<i class="ri-alert-fill"></i>',
      error: '<i class="ri-error-warning-fill"></i>',
      success: '<i class="ri-check-line"></i>'
    };

    // 清除状态类名
    messageWrap.classList.remove('message_info','message_warning','message_error','message_success','message-leave');
    messageWrap.classList.add(`message_${type}`);

    // 1. 先移除旧图标（防止多次生成多个图标）
    const oldIcon = messageContent.querySelector('.message_icon');
    if(oldIcon) oldIcon.remove();

    // 2. 创建图标容器，插入到文字前面
    const iconEl = document.createElement('div');
    iconEl.className = 'message_icon';
    iconEl.innerHTML = iconMap[type];
    messageContent.insertBefore(iconEl, messageText);

    // 3. 设置提示文字
    messageText.textContent = text;

    // 入场动画
    messageWrap.classList.add('message-enter');

    // 关闭函数
    function hideMessage() {
      messageWrap.classList.remove('message-enter');
      messageWrap.classList.add('message-leave');
    }

    // 绑定关闭按钮
    closeBtn.onclick = null;
    closeBtn.onclick = hideMessage;

    // 自动关闭计时器
    clearTimeout(window._messageTimer);
    if (delay > 0) {
      window._messageTimer = setTimeout(hideMessage, delay);
    }
    // 如果传入目标DOM，执行抖动动画
    if (targetDom) {
      shakeDom(targetDom);
    }
  }
  // 挂载全局方法
  window.showMessage = showMessage;
  window.shakeDom = shakeDom;
});
