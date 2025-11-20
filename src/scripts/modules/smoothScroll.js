/**
 * Native scroll helper (no Lenis).
 * Provides a simple scrollTo utility and optional anchor-link smoothing
 * while keeping default browser scrolling intact.
 */
export class SmoothScroll {
  constructor() {
    this.setupAnchorLinks();
  }

  setupAnchorLinks() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (e) => {
        const targetId = anchor.getAttribute('href');
        if (!targetId || targetId === '#') return;

        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          this.scrollTo(target, { offset: -100 });
        }
      });
    });
  }

  scrollTo(target, options = {}) {
    const offset = options.offset ?? 0;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const behavior = options.behavior ?? (prefersReducedMotion ? 'auto' : 'smooth');

    if (typeof target === 'number') {
      window.scrollTo({ top: target, behavior });
      return;
    }

    const element = typeof target === 'string' ? document.querySelector(target) : target;
    if (element instanceof HTMLElement) {
      const top = element.getBoundingClientRect().top + window.pageYOffset + offset;
      window.scrollTo({ top, behavior });
    }
  }

  stop() {}

  start() {}
}
