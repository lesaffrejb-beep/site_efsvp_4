/**
 * Copy Email to Clipboard - Premium UX
 * Permet de copier l'email au clic avec feedback visuel
 */

export class CopyEmail {
  constructor() {
    this.email = '';
    this.button = null;
    this.resetTimer = null;
    this.onClick = null;
    this.init();
  }

  init() {
    this.button = document.querySelector('[data-copy-email]');
    if (!this.button) return;

    this.email = this.button.getAttribute('data-email') || '';
    if (!this.email) {
      console.warn('CopyEmail: aucun email renseigné dans data-email');
      return;
    }

    this.setupEventListeners();

    this.showFeedback('default');
  }

  setupEventListeners() {
    // Clic principal: copier l'email
    this.onClick = (e) => {
      e.preventDefault();
      this.copyToClipboard();
    };

    this.button.addEventListener('click', this.onClick);
  }

  async copyToClipboard() {
    try {
      // Modern Clipboard API
      await navigator.clipboard.writeText(this.email);
      this.showFeedback('success');
    } catch (err) {
      const fallbackSuccess = this.fallbackCopyToClipboard();
      if (!fallbackSuccess) {
        console.error('CopyEmail: impossible de copier', err);
        this.showFeedback('error');
      }
    }
  }

  fallbackCopyToClipboard() {
    const textarea = document.createElement('textarea');
    textarea.value = this.email;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    textarea.style.pointerEvents = 'none';

    document.body.appendChild(textarea);
    textarea.select();

    try {
      const successful = document.execCommand('copy');
      this.showFeedback(successful ? 'success' : 'error');
      return successful;
    } catch (err) {
      console.error('Fallback copy failed:', err);
      this.showFeedback('error');
      return false;
    } finally {
      document.body.removeChild(textarea);
    }
  }

  showFeedback(state) {
    if (!this.button) return;

    // Récupérer les éléments de feedback
    const defaultText = this.button.querySelector('.copy-email__text');
    const successText = this.button.querySelector('.copy-email__success');
    const errorText = this.button.querySelector('.copy-email__error');
    const icon = this.button.querySelector('.copy-email__icon');

    clearTimeout(this.resetTimer);

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

    this.button.classList.toggle('copied', state === 'success');
    this.button.classList.toggle('copy-error', state === 'error');

    if (state !== 'default') {
      this.resetTimer = setTimeout(() => {
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
        this.button.classList.remove('copied', 'copy-error');
      }, 2200);
    }
  }

  destroy() {
    if (this.button) {
      this.button.removeEventListener('click', this.onClick);
    }
  }
}
