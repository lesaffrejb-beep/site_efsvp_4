/**
 * ============================================
 * PROGRESSIVE NAVIGATION
 * Navigation progressive avec barre de scroll
 * ============================================
 */

import { gsap } from 'gsap';

export class ProgressiveNav {
  constructor() {
    this.nav = document.getElementById('nav');
    this.progressBar = null;
    this.lastScroll = 0;
    this.scrollThreshold = 150;
    this.ticking = false;

    if (!this.nav) {
      console.warn('Progressive Nav: Navigation element not found');
      return;
    }

    this.init();
  }

  init() {
    this.createProgressBar();
    this.attachScrollListener();
    console.log('✅ Progressive Navigation initialized');
  }

  createProgressBar() {
    // Create progress bar element
    this.progressBar = document.createElement('div');
    this.progressBar.className = 'scroll-progress-bar';
    this.progressBar.setAttribute('role', 'progressbar');
    this.progressBar.setAttribute('aria-label', 'Progression de lecture');
    this.progressBar.setAttribute('aria-valuenow', '0');
    this.progressBar.setAttribute('aria-valuemin', '0');
    this.progressBar.setAttribute('aria-valuemax', '100');

    // Set initial styles
    Object.assign(this.progressBar.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '0%',
      height: '4px',
      background: 'linear-gradient(90deg, var(--primary) 0%, var(--secondary) 50%, var(--accent-gold) 100%)',
      zIndex: '9999',
      transition: 'opacity 0.3s ease',
      opacity: '0',
      transformOrigin: 'left',
      boxShadow: '0 0 12px rgba(184, 68, 30, 0.4)',
      pointerEvents: 'none'
    });

    document.body.appendChild(this.progressBar);
  }

  attachScrollListener() {
    window.addEventListener('scroll', () => {
      if (!this.ticking) {
        window.requestAnimationFrame(() => {
          this.handleScroll();
          this.ticking = false;
        });
        this.ticking = true;
      }
    }, { passive: true });
  }

  handleScroll() {
    const currentScroll = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercentage = Math.min((currentScroll / docHeight) * 100, 100);

    // Update progress bar
    this.progressBar.style.width = `${scrollPercentage}%`;
    this.progressBar.setAttribute('aria-valuenow', Math.round(scrollPercentage));

    // Navigation show/hide logic
    if (currentScroll > this.scrollThreshold) {
      const isScrollingDown = currentScroll > this.lastScroll;

      if (isScrollingDown && !this.nav.classList.contains('nav-hidden')) {
        this.hideNav();
      } else if (!isScrollingDown && this.nav.classList.contains('nav-hidden')) {
        this.showNav();
      }
    } else {
      // At top of page: always show nav, hide progress
      this.showNav();
      this.progressBar.style.opacity = '0';
    }

    this.lastScroll = Math.max(0, currentScroll);
  }

  hideNav() {
    gsap.to(this.nav, {
      y: '-100%',
      duration: 0.4,
      ease: 'power2.inOut',
      onStart: () => {
        this.nav.classList.add('nav-hidden');
      }
    });

    // Show progress bar
    this.progressBar.style.opacity = '1';
  }

  showNav() {
    gsap.to(this.nav, {
      y: '0%',
      duration: 0.4,
      ease: 'power2.out',
      onComplete: () => {
        this.nav.classList.remove('nav-hidden');
      }
    });

    // Hide progress bar if at top
    if (window.pageYOffset <= this.scrollThreshold) {
      this.progressBar.style.opacity = '0';
    }
  }

  destroy() {
    if (this.progressBar && this.progressBar.parentNode) {
      this.progressBar.parentNode.removeChild(this.progressBar);
    }
  }
}
