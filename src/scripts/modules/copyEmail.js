/**
 * Copy Email to Clipboard - Premium UX
 * Permet de copier l'email au clic avec feedback visuel
 */

export class CopyEmail {
  constructor() {
    this.buttons = [];
    this.init();
  }

  init() {
    const buttons = document.querySelectorAll('[data-copy-email]');
    if (!buttons.length) return;

    buttons.forEach((button) => {
      const email = button.getAttribute('data-email') || '';
      if (!email) {
        console.warn('CopyEmail: aucun email renseigné dans data-email', button);
        return;
      }

      const buttonData = {
        element: button,
        email: email,
        resetTimer: null,
      };

      this.buttons.push(buttonData);
      this.setupEventListeners(buttonData);
      this.showFeedback(buttonData, 'default');
    });
  }

  setupEventListeners(buttonData) {
    // Clic principal: copier l'email
    const onClick = (e) => {
      e.preventDefault();
      this.copyToClipboard(buttonData);
    };

    buttonData.element.addEventListener('click', onClick);
  }

  async copyToClipboard(buttonData) {
    try {
      // Modern Clipboard API
      await navigator.clipboard.writeText(buttonData.email);
      this.showFeedback(buttonData, 'success');
    } catch (err) {
      const fallbackSuccess = this.fallbackCopyToClipboard(buttonData);
      if (!fallbackSuccess) {
        console.error('CopyEmail: impossible de copier', err);
        this.showFeedback(buttonData, 'error');
      }
    }
  }

  fallbackCopyToClipboard(buttonData) {
    const textarea = document.createElement('textarea');
    textarea.value = buttonData.email;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    textarea.style.pointerEvents = 'none';

    document.body.appendChild(textarea);
    textarea.select();

    try {
      const successful = document.execCommand('copy');
      this.showFeedback(buttonData, successful ? 'success' : 'error');
      return successful;
    } catch (err) {
      console.error('Fallback copy failed:', err);
      this.showFeedback(buttonData, 'error');
      return false;
    } finally {
      document.body.removeChild(textarea);
    }
  }

  showFeedback(buttonData, state) {
    if (!buttonData || !buttonData.element) return;

    const button = buttonData.element;

    // Récupérer les éléments de feedback
    const defaultText = button.querySelector('.copy-email__text');
    const successText = button.querySelector('.copy-email__success');
    const errorText = button.querySelector('.copy-email__error');
    const icon = button.querySelector('.copy-email__icon');

    clearTimeout(buttonData.resetTimer);

    if (defaultText) {
      defaultText.classList.toggle('is-hidden', state !== 'default');
      defaultText.setAttribute('aria-hidden', state === 'default' ? 'false' : 'true');
    }
    if (successText) {
      successText.classList.toggle('is-visible', state === 'success');
      successText.setAttribute('aria-hidden', state === 'success' ? 'false' : 'true');
    }
    if (errorText) {
      errorText.classList.toggle('is-visible', state === 'error');
      errorText.setAttribute('aria-hidden', state === 'error' ? 'false' : 'true');
    }
    if (icon) icon.classList.toggle('is-hidden', state !== 'default');

    button.classList.toggle('copied', state === 'success');
    button.classList.toggle('copy-error', state === 'error');

    if (state !== 'default') {
      buttonData.resetTimer = setTimeout(() => {
        if (defaultText) {
          defaultText.classList.remove('is-hidden');
          defaultText.setAttribute('aria-hidden', 'false');
        }
        if (successText) {
          successText.classList.remove('is-visible');
          successText.setAttribute('aria-hidden', 'true');
        }
        if (errorText) {
          errorText.classList.remove('is-visible');
          errorText.setAttribute('aria-hidden', 'true');
        }
        if (icon) icon.classList.remove('is-hidden');
        button.classList.remove('copied', 'copy-error');
      }, 2200);
    }
  }

  destroy() {
    // Clear all timers and remove event listeners if needed
    this.buttons.forEach((buttonData) => {
      clearTimeout(buttonData.resetTimer);
    });
  }
}
