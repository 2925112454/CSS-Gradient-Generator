document.addEventListener('DOMContentLoaded', function () {
  /* Toast Component */
  /**
   * Shake warning animation for DOM elements
   * @param {HTMLElement} el - DOM element to apply shake animation
   * @param {number} [duration=600] - Shake duration in milliseconds
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
   * Message toast
   * @param {string} text - Toast content
   * @param {string} [type='info'] - Message type: info / warning / error / success
   * @param {HTMLElement|null} [targetDom=null] - DOM element to shake along with the toast (optional)
   * @param {number} [delay=2500] - Auto-close delay in milliseconds; 0 = no auto-close (optional)
   * Usage: showMessage('Toast text', 'info', document.querySelector('.search-input'), 2500);
   */
  function showMessage(text, type = 'info', targetDom = null , delay = 2500) {
    const messageWrap = document.querySelector('.message');
    const messageContent = document.querySelector('.message_content');
    const messageText = document.querySelector('.message_text');
    const closeBtn = document.querySelector('.message_close');
    if (!messageWrap || !messageContent || !messageText || !closeBtn) return;
    // Icon mapping for each message type
    const iconMap = {
      info: '<i class="ri-error-warning-fill"></i>',
      warning: '<i class="ri-alert-fill"></i>',
      error: '<i class="ri-error-warning-fill"></i>',
      success: '<i class="ri-check-line"></i>'
    };
    // Clear all status class names
    messageWrap.classList.remove('message_info','message_warning','message_error','message_success','message-leave');
    messageWrap.classList.add(`message_${type}`);
    // 1. Remove old icon first to prevent duplicate icons
    const oldIcon = messageContent.querySelector('.message_icon');
    if(oldIcon) oldIcon.remove();
    // 2. Create icon container and insert before text
    const iconEl = document.createElement('div');
    iconEl.className = 'message_icon';
    iconEl.innerHTML = iconMap[type];
    messageContent.insertBefore(iconEl, messageText);
    // 3. Set toast text
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
  // Expose methods globally
  window.showMessage = showMessage;
  window.shakeDom = shakeDom;
});