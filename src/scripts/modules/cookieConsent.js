/**
 * Cookie Consent Module - RGPD/CNIL Compliant
 * Gestion simple du consentement aux cookies
 */

export class CookieConsent {
  constructor() {
    this.banner = document.getElementById('cookie-banner');
    this.acceptBtn = document.getElementById('cookie-accept');
    this.rejectBtn = document.getElementById('cookie-reject');
    this.cookieName = 'efsvp_cookie_consent';
    this.cookieExpiry = 365; // 1 an
    this.lastFocusedElement = null;

    this.handleKeydown = this.handleKeydown.bind(this);

    this.init();
  }

  init() {
    if (!this.banner) return;

    // Check if consent already given
    const consent = this.getCookie(this.cookieName);

    if (!consent) {
      // Show banner after 1 second
      setTimeout(() => {
        this.showBanner();
      }, 1000);
    }

    // Event listeners
    if (this.acceptBtn) {
      this.acceptBtn.addEventListener('click', () => this.acceptCookies());
    }

    if (this.rejectBtn) {
      this.rejectBtn.addEventListener('click', () => this.rejectCookies());
    }

    // ESC key to close
    document.addEventListener('keydown', this.handleKeydown);
  }

  showBanner() {
    this.lastFocusedElement = document.activeElement;
    this.banner.setAttribute('aria-hidden', 'false');
    // Focus management for accessibility
    (this.acceptBtn || this.rejectBtn)?.focus();
  }

  hideBanner() {
    this.banner.setAttribute('aria-hidden', 'true');
    this.restoreFocus();
  }

  closeWithoutConsent() {
    this.hideBanner();
  }

  acceptCookies() {
    this.setCookie(this.cookieName, 'accepted', this.cookieExpiry);
    this.hideBanner();

    // Dispatch custom event for analytics or other modules
    const event = new window.CustomEvent('cookieConsentGiven', {
      detail: { consent: 'accepted' },
    });
    window.dispatchEvent(event);
  }

  rejectCookies() {
    this.setCookie(this.cookieName, 'rejected', this.cookieExpiry);
    this.hideBanner();

    // Dispatch custom event
    const event = new window.CustomEvent('cookieConsentGiven', {
      detail: { consent: 'rejected' },
    });
    window.dispatchEvent(event);
  }

  setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value};${expires};path=/;SameSite=Strict`;
  }

  getCookie(name) {
    const nameEQ = `${name}=`;
    const cookies = document.cookie.split(';');

    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i];
      while (cookie.charAt(0) === ' ') {
        cookie = cookie.substring(1, cookie.length);
      }
      if (cookie.indexOf(nameEQ) === 0) {
        return cookie.substring(nameEQ.length, cookie.length);
      }
    }
    return null;
  }

  /**
   * Check if analytics cookies are allowed
   * @returns {boolean}
   */
  static isAnalyticsAllowed() {
    const consent = new CookieConsent();
    const cookieValue = consent.getCookie('efsvp_cookie_consent');
    return cookieValue === 'accepted';
  }

  handleKeydown(e) {
    if (e.key !== 'Escape') return;
    if (!this.banner || this.banner.getAttribute('aria-hidden') === 'true') return;

    e.preventDefault();
    this.closeWithoutConsent();
  }

  restoreFocus() {
    const previous = this.lastFocusedElement;
    if (previous && typeof previous.focus === 'function') {
      previous.focus();
    } else {
      const mainContent = document.querySelector('main');
      if (mainContent) {
        if (!mainContent.hasAttribute('tabindex')) {
          mainContent.setAttribute('tabindex', '-1');
        }
        if (mainContent.tabIndex === -1) {
          mainContent.focus();
        }
      }
    }
    this.lastFocusedElement = null;
  }
}

export default CookieConsent;
