/**
 * Smooth Scroll avec Lenis
 * Integration GSAP ScrollTrigger
 */

import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export class SmoothScroll {
  constructor() {
    this.enabled = this.shouldEnableSmoothScroll();
    this.lenis = this.enabled
      ? new Lenis({
          duration: 1.2,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          direction: 'vertical',
          gestureDirection: 'vertical',
          smooth: true,
          mouseMultiplier: 1,
          smoothTouch: false,
          touchMultiplier: 2,
          infinite: false,
        })
      : null;

    if (this.enabled && this.lenis) {
      this.init();
    }
  }

  init() {
    ScrollTrigger.scrollerProxy(document.body, {
      scrollTop: (value) => {
        if (value !== undefined) {
          this.lenis?.scrollTo(value, { immediate: true });
        }
        return this.lenis?.scroll || window.scrollY;
      },
      getBoundingRect: () => ({
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      }),
    });

    this.lenis?.on('scroll', ScrollTrigger.update);

    const raf = (time) => {
      this.lenis?.raf(time);
      ScrollTrigger.update();
      requestAnimationFrame(raf);
    };

    requestAnimationFrame(raf);

    // Anchor links smooth
    this.setupAnchorLinks();
  }

  shouldEnableSmoothScroll() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hasCoarsePointer = window.matchMedia('(pointer: coarse)').matches || navigator.maxTouchPoints > 0;
    return !prefersReducedMotion && !hasCoarsePointer;
  }

  setupAnchorLinks() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = anchor.getAttribute('href');
        if (targetId === '#') return;

        const target = document.querySelector(targetId);
        if (target) {
          this.scrollTo(target, {
            offset: -100,
            duration: 1.5,
          });
        }
      });
    });
  }

  scrollTo(target, options = {}) {
    if (this.lenis) {
      this.lenis.scrollTo(target, options);
      return;
    }

    const element = typeof target === 'string' ? document.querySelector(target) : target;
    if (element instanceof HTMLElement) {
      const top = element.getBoundingClientRect().top + window.pageYOffset + (options.offset || 0);
      window.scrollTo({
        top,
        behavior: 'smooth',
      });
    }
  }

  stop() {
    this.lenis?.stop();
  }

  start() {
    this.lenis?.start();
  }
}
