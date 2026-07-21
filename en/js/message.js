document.addEventListener('DOMContentLoaded', function () {
  /* Toast Component */
  /**
   * DOM element shake warning animation
   * @param {HTMLElement} el DOM element to shake
   * @param {number} duration Shake duration in ms, default 600
   */
  function shakeDom(el, duration = 600) {
    if (!el || !(el instanceof HTMLElement)) return;
    // Remove leftover animation class and reset state
    el.classList.remove('shake-warning');
    void el.offsetWidth; // Force reflow to restart animation
    el.classList.add('shake-warning');
    // Auto-remove class when animation ends
    setTimeout(() => {
      el.classList.remove('shake-warning');
    }, duration);
  }
  /**
   * Toast message
   * @param {string} text Message content
   * @param {string} type Message type: info / warning / error / success
   * @param {HTMLElement|null} targetDom DOM element to shake (optional)
   * @param {number} delay Auto-close delay in ms, 0 = no auto-close (optional)
   * Usage: showMessage('Message text', 'info', document.querySelector('.search-input'), 2500);
   */
  function showMessage(text, type = 'info', targetDom = null , delay = 2500) {
    const messageWrap = document.querySelector('.message');
    const messageContent = document.querySelector('.message_content');
    const messageText = document.querySelector('.message_text');
    const closeBtn = document.querySelector('.message_close');
    if (!messageWrap || !messageContent || !messageText || !closeBtn) return;
    // Message type icon config
    const iconMap = {
      info: '<i class="ri-error-warning-fill"></i>',
      warning: '<i class="ri-alert-fill"></i>',
      error: '<i class="ri-error-warning-fill"></i>',
      success: '<i class="ri-check-line"></i>'
    };
    // Clear status classes
    messageWrap.classList.remove('message_info','message_warning','message_error','message_success','message-leave');
    messageWrap.classList.add(`message_${type}`);
    // 1. Remove old icon first (prevents duplicate icons)
    const oldIcon = messageContent.querySelector('.message_icon');
    if(oldIcon) oldIcon.remove();
    // 2. Create icon container, insert before text
    const iconEl = document.createElement('div');
    iconEl.className = 'message_icon';
    iconEl.innerHTML = iconMap[type];
    messageContent.insertBefore(iconEl, messageText);
    // 3. Set message text
    messageText.textContent = text;
    // Enter animation
    messageWrap.classList.add('message-enter');
    // Close function
    function hideMessage() {
      messageWrap.classList.remove('message-enter');
      messageWrap.classList.add('message-leave');
    }
    // Bind close button
    closeBtn.onclick = null;
    closeBtn.onclick = hideMessage;
    // Auto-close timer
    clearTimeout(window._messageTimer);
    if (delay > 0) {
      window._messageTimer = setTimeout(hideMessage, delay);
    }
    // Run shake animation if target DOM is provided
    if (targetDom) {
      shakeDom(targetDom);
    }
  }
  // Mount global methods
  window.showMessage = showMessage;
  window.shakeDom = shakeDom;
});