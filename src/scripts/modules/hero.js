// LEGACY – non utilisé dans la version actuelle du site. À supprimer après vérification.
/**
 * Signature Hero Manager
 * Gère l'animation de la signature manuscrite et les reveals associés.
 */

import { gsap } from 'gsap';

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

export class HeroManager {
  constructor() {
    this.hero = document.querySelector('.signature-hero');
    if (!this.hero) return;

    this.signaturePath = this.hero.querySelector('[data-signature-path]');
    this.inkDrop = this.hero.querySelector('[data-ink-drop]');
    this.inkFill = this.hero.querySelector('[data-ink-fill]');
    this.inkChannel = this.hero.querySelector('.hero__ink-channel');
    this.baselineLines = this.hero.querySelectorAll('[data-hero-baseline-line]');
    this.ctaGroup = this.hero.querySelector('.signature-hero__cta-group');
    this.scrollTrigger = this.hero.querySelector('[data-hero-scroll]');

    this.prefersReducedMotion = window.matchMedia(REDUCED_MOTION_QUERY);
    this.pointerMedia = window.matchMedia('(pointer: fine)');
    this.animation = null;
    this.inkInteractionEnabled = false;

    this.handlePointerMove = this.handlePointerMove.bind(this);
    this.handlePointerLeave = this.handlePointerLeave.bind(this);
    this.updateInkInteraction = this.updateInkInteraction.bind(this);
    this.handleResize = this.handleResize.bind(this);

    this.init();
  }

  init() {
    this.hero.classList.add('signature-hero--animated');
    this.setupReducedMotionListener();

    if (this.prefersReducedMotion.matches) {
      this.applyReducedMotionState();
    } else {
      this.setupAnimation();
    }

    this.setupScrollIndicator();
  }

  setupReducedMotionListener() {
    const handlePreferenceChange = (event) => {
      if (event.matches) {
        this.applyReducedMotionState();
      } else {
        this.setupAnimation();
      }

      this.updateInkInteraction();
    };

    if (typeof this.prefersReducedMotion.addEventListener === 'function') {
      this.prefersReducedMotion.addEventListener('change', handlePreferenceChange);
    } else if (typeof this.prefersReducedMotion.addListener === 'function') {
      // Safari fallback
      this.prefersReducedMotion.addListener(handlePreferenceChange);
    }

    if (this.pointerMedia) {
      if (typeof this.pointerMedia.addEventListener === 'function') {
        this.pointerMedia.addEventListener('change', this.updateInkInteraction);
      } else if (typeof this.pointerMedia.addListener === 'function') {
        this.pointerMedia.addListener(this.updateInkInteraction);
      }
    }

    window.addEventListener('resize', this.handleResize, { passive: true });
  }

  applyReducedMotionState() {
    if (this.animation) {
      this.animation.kill();
      this.animation = null;
    }

    if (this.signaturePath) {
      const length = this.signaturePath.getTotalLength();
      this.signaturePath.style.strokeDasharray = `${length}`;
      this.signaturePath.style.strokeDashoffset = '0';
    }

    if (this.inkFill) {
      gsap.set(this.inkFill, { scaleX: 1, transformOrigin: 'left center' });
    }

    if (this.inkDrop) {
      gsap.set(this.inkDrop, { autoAlpha: 0, yPercent: 0 });
    }

    if (this.baselineLines.length) {
      gsap.set(this.baselineLines, { autoAlpha: 1, y: 0 });
    }

    if (this.ctaGroup) {
      gsap.set(this.ctaGroup, { autoAlpha: 1, y: 0 });
    }

    this.teardownInkInteraction();
  }

  setupAnimation() {
    if (!this.signaturePath) return;

    if (this.animation) {
      this.animation.kill();
    }

    this.teardownInkInteraction();

    const length = this.signaturePath.getTotalLength();

    gsap.set(this.signaturePath, {
      strokeDasharray: length,
      strokeDashoffset: length,
    });

    if (this.inkDrop) {
      gsap.set(this.inkDrop, { autoAlpha: 0, yPercent: -140 });
    }

    if (this.inkFill) {
      gsap.set(this.inkFill, { scaleX: 0, transformOrigin: 'left center' });
    }

    if (this.baselineLines.length) {
      gsap.set(this.baselineLines, { autoAlpha: 0, y: 12 });
    }

    if (this.ctaGroup) {
      gsap.set(this.ctaGroup, { autoAlpha: 0, y: 16 });
    }

    const timeline = gsap.timeline({ defaults: { ease: 'power2.out' } });

    timeline.to(this.signaturePath, {
      strokeDashoffset: 0,
      duration: 1.6,
    });

    if (this.inkDrop) {
      timeline.to(
        this.inkDrop,
        {
          autoAlpha: 1,
          yPercent: 0,
          duration: 0.4,
          ease: 'power2.in',
        },
        '-=0.05'
      );
    }

    if (this.inkFill) {
      timeline.to(
        this.inkFill,
        {
          scaleX: 1,
          duration: 0.45,
          ease: 'power1.out',
        },
        this.inkDrop ? '-=0.15' : '-=0.2'
      );
    }

    if (this.inkDrop) {
      timeline.to(
        this.inkDrop,
        {
          autoAlpha: 0,
          duration: 0.3,
          ease: 'power1.out',
        },
        '-=0.1'
      );
    }

    if (this.baselineLines.length) {
      timeline.to(
        this.baselineLines,
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
        },
        '-=0.05'
      );
    }

    if (this.ctaGroup) {
      timeline.to(
        this.ctaGroup,
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.45,
          ease: 'power2.out',
        },
        '-=0.2'
      );
    }

    timeline.call(() => {
      this.setupInkInteraction();
    });

    this.animation = timeline;
  }

  setupScrollIndicator() {
    if (!this.scrollTrigger) return;

    this.scrollTrigger.addEventListener('click', (event) => {
      event.preventDefault();
      const targetSelector = this.scrollTrigger.dataset.scrollTarget;
      if (!targetSelector) return;

      const target = document.querySelector(targetSelector);
      if (!target) return;

      const top = target.getBoundingClientRect().top + window.pageYOffset - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  }

  start() {
    // L'animation principale est déclenchée dans setupAnimation()
  }

  shouldEnableInkInteraction() {
    if (!this.inkFill || !this.inkChannel) return false;
    if (this.prefersReducedMotion?.matches) return false;
    if (window.innerWidth < 1024) return false;
    if (this.pointerMedia && !this.pointerMedia.matches) return false;
    return true;
  }

  setupInkInteraction() {
    if (!this.shouldEnableInkInteraction()) {
      this.teardownInkInteraction();
      return;
    }

    if (this.inkInteractionEnabled) return;

    this.inkChannel.addEventListener('pointermove', this.handlePointerMove);
    this.inkChannel.addEventListener('pointerleave', this.handlePointerLeave);
    this.inkInteractionEnabled = true;
  }

  teardownInkInteraction() {
    if (!this.inkInteractionEnabled) return;

    this.inkChannel.removeEventListener('pointermove', this.handlePointerMove);
    this.inkChannel.removeEventListener('pointerleave', this.handlePointerLeave);
    this.inkInteractionEnabled = false;

    if (this.inkFill) {
      gsap.to(this.inkFill, {
        duration: 0.6,
        ease: 'power2.out',
        '--ink-ripple-x': '50%',
        '--ink-ripple-y': '50%',
      });
    }
  }

  updateInkInteraction() {
    if (this.shouldEnableInkInteraction()) {
      this.setupInkInteraction();
    } else {
      this.teardownInkInteraction();
    }
  }

  handlePointerMove(event) {
    if (!this.inkInteractionEnabled || !this.inkChannel || !this.inkFill) return;

    const rect = this.inkChannel.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    const clampedX = Math.max(0, Math.min(100, x));
    const clampedY = Math.max(0, Math.min(100, y));

    gsap.to(this.inkFill, {
      duration: 0.6,
      ease: 'power2.out',
      '--ink-ripple-x': `${clampedX}%`,
      '--ink-ripple-y': `${clampedY}%`,
    });
  }

  handlePointerLeave() {
    if (!this.inkInteractionEnabled || !this.inkFill) return;

    gsap.to(this.inkFill, {
      duration: 0.8,
      ease: 'power2.out',
      '--ink-ripple-x': '50%',
      '--ink-ripple-y': '50%',
    });
  }

  handleResize() {
    this.updateInkInteraction();
  }
}
