/**
 * Global Error Handler & Fallback System
 * Gère toutes les erreurs JS et affiche des fallbacks user-friendly
 */

export class ErrorHandler {
  constructor() {
    this.errors = [];
    this.maxErrors = 10;

    this.init();
  }

  init() {
    // Global error handler
    window.addEventListener('error', (event) => {
      this.handleError({
        type: 'error',
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error,
      });
    });

    // Unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.handleError({
        type: 'promise',
        message: event.reason?.message || 'Unhandled promise rejection',
        error: event.reason,
      });
    });

    // Resource loading errors
    window.addEventListener(
      'error',
      (event) => {
        if (event.target !== window) {
          this.handleResourceError(event);
        }
      },
      true
    );
  }

  handleError(errorInfo) {
    console.error('🔥 Global Error:', errorInfo);

    // Store error
    this.errors.push({
      ...errorInfo,
      timestamp: new Date().toISOString(),
    });

    // Keep only recent errors
    if (this.errors.length > this.maxErrors) {
      this.errors.shift();
    }

    // Determine error severity
    const severity = this.getErrorSeverity(errorInfo);

    // Only show toast for critical errors
    if (severity === 'critical') {
      this.showErrorNotification(errorInfo);
    }

    // Log to analytics (if available)
    this.logToAnalytics(errorInfo);
  }

  getErrorSeverity(errorInfo) {
    const message = errorInfo.message || '';

    // Ignore common non-critical errors
    const nonCriticalPatterns = [
      /ResizeObserver/i,
      /Script error/i,
      /Non-Error promise rejection/i,
      /Loading chunk/i,
      /hydration/i,
      /webkit-masked-url/i,
    ];

    if (nonCriticalPatterns.some(pattern => pattern.test(message))) {
      return 'info';
    }

    // Critical errors that should show notifications
    const criticalPatterns = [
      /is not defined/i,
      /Cannot read propert/i,
      /undefined is not a function/i,
      /Failed to fetch/i,
    ];

    if (criticalPatterns.some(pattern => pattern.test(message))) {
      return 'critical';
    }

    // Default: warning level (logged but not shown)
    return 'warning';
  }

  handleResourceError(event) {
    const target = event.target;
    const tagName = target.tagName?.toLowerCase();

    console.warn(`⚠️ Resource failed to load: ${tagName}`, target.src || target.href);

    // Handle different resource types
    switch (tagName) {
      case 'img':
        this.handleImageError(target);
        break;
      case 'video':
        this.handleVideoError(target);
        break;
      case 'audio':
        this.handleAudioError(target);
        break;
      case 'script':
        this.handleScriptError(target);
        break;
      case 'link':
        this.handleStyleError(target);
        break;
    }
  }

  handleImageError(img) {
    // Placeholder SVG avec bon ratio d'aspect
    img.src =
      'data:image/svg+xml,' +
      encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">
        <rect width="400" height="300" fill="#223044"/>
        <text x="50%" y="50%" fill="#9AA3AE" text-anchor="middle" dy=".3em" font-family="sans-serif" font-size="16">
          Image non disponible
        </text>
      </svg>
    `);
    img.classList.add('image-fallback');
  }

  handleVideoError(video) {
    // Replace with poster or static gradient
    const parent = video.parentElement;
    if (parent) {
      const fallback = document.createElement('div');
      fallback.className = 'video-fallback';
      fallback.style.cssText = `
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #0F151D 0%, #141C26 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        color: #9AA3AE;
        font-size: 14px;
      `;
      fallback.innerHTML = `
        <div style="text-align: center;">
          <svg style="width: 48px; height: 48px; margin-bottom: 12px; opacity: 0.5;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="23 7 16 12 23 17 23 7"></polygon>
            <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
          </svg>
          <p>Vidéo non disponible</p>
        </div>
      `;
      parent.replaceChild(fallback, video);
    }
  }

  handleAudioError(audio) {
    console.warn('Audio failed to load:', audio.src);
    // Audio errors are handled in AudioPlayerManager
  }

  handleScriptError(script) {
    console.error('❌ Critical: Script failed to load:', script.src);
    // Show notification for critical scripts
    if (script.hasAttribute('data-critical')) {
      this.showCriticalError();
    }
  }

  handleStyleError(link) {
    console.warn('Stylesheet failed to load:', link.href);
  }

  showErrorNotification(errorInfo) {
    // Don't show for resource errors (handled separately)
    if (errorInfo.type !== 'error' && errorInfo.type !== 'promise') {
      return;
    }

    // Create toast notification
    const toast = document.createElement('div');
    toast.className = 'error-toast';
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.innerHTML = `
      <div class="error-toast__icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
      </div>
      <div class="error-toast__content">
        <p class="error-toast__title">Une erreur s'est produite</p>
        <p class="error-toast__message">L'application continue de fonctionner normalement.</p>
      </div>
      <button class="error-toast__close" aria-label="Fermer">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    `;

    // Add styles inline
    this.addToastStyles(toast);

    document.body.appendChild(toast);

    // Animate in
    requestAnimationFrame(() => {
      toast.classList.add('error-toast--visible');
    });

    // Close button
    const closeBtn = toast.querySelector('.error-toast__close');
    closeBtn.addEventListener('click', () => {
      this.hideToast(toast);
    });

    // Auto-hide after 5s
    setTimeout(() => {
      this.hideToast(toast);
    }, 5000);
  }

  hideToast(toast) {
    toast.classList.remove('error-toast--visible');
    setTimeout(() => {
      toast.remove();
    }, 300);
  }

  addToastStyles(_toast) {
    if (!document.getElementById('error-toast-styles')) {
      const style = document.createElement('style');
      style.id = 'error-toast-styles';
      style.textContent = `
        .error-toast {
          position: fixed;
          top: calc(var(--header-h, 76px) + 16px);
          right: var(--space-6, 1.5rem);
          z-index: 10000;
          background: var(--bg-dark, #0f141a);
          border: 1.5px solid var(--primary, #b95a40);
          border-radius: var(--radius-md, 12px);
          padding: var(--space-4, 1rem);
          display: flex;
          align-items: flex-start;
          gap: var(--space-3, 0.75rem);
          max-width: 420px;
          box-shadow: var(--shadow-dark-card, 0 16px 40px rgba(0, 0, 0, 0.25));
          backdrop-filter: blur(8px);
          transform: translateX(120%);
          transition: transform 0.3s var(--ease-smooth, cubic-bezier(0.4, 0, 0.2, 1));
        }

        .error-toast--visible {
          transform: translateX(0);
        }

        .error-toast__icon {
          width: 20px;
          height: 20px;
          color: var(--primary, #b95a40);
          flex-shrink: 0;
          margin-top: 2px;
        }

        .error-toast__icon svg {
          width: 100%;
          height: 100%;
        }

        .error-toast__content {
          flex: 1;
        }

        .error-toast__title {
          font-family: var(--font-sans, 'Inter', sans-serif);
          font-weight: 600;
          font-size: var(--text-sm, 0.875rem);
          color: var(--text-on-dark, #f7f5f2);
          margin-bottom: var(--space-1, 0.25rem);
          line-height: 1.4;
        }

        .error-toast__message {
          font-family: var(--font-sans, 'Inter', sans-serif);
          font-size: var(--text-xs, 0.75rem);
          color: rgba(247, 245, 242, 0.7);
          margin: 0;
          line-height: 1.5;
        }

        .error-toast__close {
          width: 18px;
          height: 18px;
          color: rgba(247, 245, 242, 0.6);
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          flex-shrink: 0;
          transition: color var(--duration-base, 0.25s);
          margin-top: 2px;
        }

        .error-toast__close:hover {
          color: var(--text-on-dark, #f7f5f2);
        }

        .error-toast__close:focus-visible {
          outline: 2px solid var(--primary, #b95a40);
          outline-offset: 2px;
          border-radius: var(--radius-xs, 4px);
        }

        .error-toast__close svg {
          width: 100%;
          height: 100%;
        }

        @media (max-width: 640px) {
          .error-toast {
            top: calc(var(--header-h, 76px) + 12px);
            right: var(--space-4, 1rem);
            left: var(--space-4, 1rem);
            max-width: none;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }

  showCriticalError() {
    // Show full-page error overlay for critical errors
    const overlay = document.createElement('div');
    overlay.className = 'critical-error-overlay';
    overlay.innerHTML = `
      <div class="critical-error__content">
        <svg style="width: 80px; height: 80px; color: #B8441E; margin-bottom: 24px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <h2>Erreur de chargement</h2>
        <p>Certaines ressources nécessaires n'ont pas pu être chargées.</p>
        <button class="btn btn--primary" onclick="location.reload()">
          Recharger la page
        </button>
      </div>
    `;

    // Styles inline (backdrop-filter supprimé pour éviter tout voile global)
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(15, 21, 29, 0.95);
      z-index: 99999;
      display: flex;
      align-items: center;
      justify-content: center;
    `;

    const content = overlay.querySelector('.critical-error__content');
    content.style.cssText = `
      text-align: center;
      color: #EAECEF;
      padding: 48px;
      max-width: 500px;
    `;

    document.body.appendChild(overlay);
  }

  logToAnalytics(errorInfo) {
    // Send to analytics service (Google Analytics, Sentry, etc.)
    if (window.gtag) {
      window.gtag('event', 'exception', {
        description: errorInfo.message,
        fatal: false,
      });
    }

    // Or send to custom endpoint
    if (navigator.sendBeacon) {
      // navigator.sendBeacon('/api/errors', JSON.stringify({
      //   type: 'error',
      //   ...errorInfo,
      //   userAgent: navigator.userAgent,
      //   url: window.location.href,
      // }));
    }
  }

  getErrors() {
    return this.errors;
  }

  clearErrors() {
    this.errors = [];
  }
}
