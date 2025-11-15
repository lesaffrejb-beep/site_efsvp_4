/**
 * Ancien hero : section `.signature-hero` avec HeroManager GSAP,
 * baselines scindées en deux lignes et CTA groupés `.signature-hero__cta-group`.
 * La goutte était placée dans le `<h1>` et l'indicateur scroll utilisait `[data-hero-scroll]`.
 */

import { gsap } from 'gsap';

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';
const POINTER_FINE_QUERY = '(pointer: fine)';

class HeroInk {
  constructor(root) {
    this.root = root;
    this.signaturePath = root.querySelector('[data-hero-signature-path]');
    this.inkChannel = root.querySelector('.hero__ink-channel');
    this.inkFill = root.querySelector('[data-hero-ink-fill]');
    this.inkDrop = root.querySelector('[data-hero-ink-drop]');
    this.baseline = root.querySelector('[data-hero-baseline]');
    this.ctaButtons = root.querySelectorAll('.hero__cta-button');
    this.scrollIndicator = root.querySelector('[data-hero-scroll]');

    this.prefersReducedMotion = window.matchMedia(REDUCED_MOTION_QUERY);
    this.pointerFine = window.matchMedia(POINTER_FINE_QUERY);

    this.timeline = null;
    this.inkInteractionEnabled = false;

    this.updateInkInteraction = this.updateInkInteraction.bind(this);
    this.handlePreferenceChange = this.handlePreferenceChange.bind(this);
    this.handlePointerEnter = this.handlePointerEnter.bind(this);
    this.handlePointerMove = this.handlePointerMove.bind(this);
    this.handlePointerLeave = this.handlePointerLeave.bind(this);
    this.handleResize = this.handleResize.bind(this);

    this.init();
  }

  init() {
    this.setupMediaListeners();
    this.setupScrollIndicator();

    if (this.prefersReducedMotion.matches) {
      this.applyReducedMotionState();
    } else {
      this.setupAnimation();
    }

    this.updateInkInteraction();
  }

  setupMediaListeners() {
    if (typeof this.prefersReducedMotion.addEventListener === 'function') {
      this.prefersReducedMotion.addEventListener('change', this.handlePreferenceChange);
    } else if (typeof this.prefersReducedMotion.addListener === 'function') {
      this.prefersReducedMotion.addListener(this.handlePreferenceChange);
    }

    if (this.pointerFine) {
      if (typeof this.pointerFine.addEventListener === 'function') {
        this.pointerFine.addEventListener('change', this.updateInkInteraction);
      } else if (typeof this.pointerFine.addListener === 'function') {
        this.pointerFine.addListener(this.updateInkInteraction);
      }
    }

    window.addEventListener('resize', this.handleResize, { passive: true });
  }

  handlePreferenceChange(event) {
    if (event.matches) {
      this.applyReducedMotionState();
    } else {
      this.setupAnimation();
    }

    this.updateInkInteraction();
  }

  applyReducedMotionState() {
    if (this.timeline) {
      this.timeline.kill();
      this.timeline = null;
    }

    if (this.signaturePath) {
      const length = this.signaturePath.getTotalLength();
      this.signaturePath.style.strokeDasharray = `${length}`;
      this.signaturePath.style.strokeDashoffset = '0';
    }

    if (this.inkFill) {
      gsap.set(this.inkFill, {
        scaleX: 0.8,
        transformOrigin: 'left center',
      });
    }

    if (this.inkDrop) {
      gsap.set(this.inkDrop, { autoAlpha: 0, yPercent: 120 });
    }

    if (this.baseline) {
      gsap.set(this.baseline, { autoAlpha: 1, y: 0 });
    }

    if (this.ctaButtons.length) {
      gsap.set(this.ctaButtons, { autoAlpha: 1, y: 0 });
    }

    if (this.scrollIndicator) {
      gsap.set(this.scrollIndicator, { autoAlpha: 1, y: 0 });
    }

    this.teardownInkInteraction();
  }

  setupAnimation() {
    if (!this.signaturePath) return;

    if (this.timeline) {
      this.timeline.kill();
    }

    this.teardownInkInteraction();

    const length = this.signaturePath.getTotalLength();

    gsap.set(this.signaturePath, {
      strokeDasharray: length,
      strokeDashoffset: length,
    });

    if (this.inkFill) {
      gsap.set(this.inkFill, {
        scaleX: 0,
        transformOrigin: 'left center',
      });
    }

    if (this.inkDrop) {
      gsap.set(this.inkDrop, {
        autoAlpha: 0,
        yPercent: -140,
      });
    }

    if (this.baseline) {
      gsap.set(this.baseline, { autoAlpha: 0, y: 12 });
    }

    if (this.ctaButtons.length) {
      gsap.set(this.ctaButtons, { autoAlpha: 0, y: 16 });
    }

    if (this.scrollIndicator) {
      gsap.set(this.scrollIndicator, { autoAlpha: 0, y: 12 });
    }

    const timeline = gsap.timeline({ defaults: { ease: 'power2.out' } });

    timeline.to(this.signaturePath, {
      strokeDashoffset: 0,
      duration: 1.8,
    });

    if (this.inkDrop) {
      timeline.to(
        this.inkDrop,
        {
          autoAlpha: 1,
          yPercent: 20,
          duration: 0.35,
          ease: 'power2.in',
        },
        '-=0.2'
      );

      timeline.to(
        this.inkDrop,
        {
          yPercent: 120,
          duration: 0.25,
          ease: 'power2.in',
        },
        '>-0.05'
      );
    }

    if (this.inkFill) {
      timeline.to(
        this.inkFill,
        {
          scaleX: 0.8,
          duration: 0.55,
          ease: 'power1.out',
        },
        this.inkDrop ? '-=0.1' : '-=0.2'
      );
    }

    if (this.inkDrop) {
      timeline.to(
        this.inkDrop,
        {
          autoAlpha: 0,
          duration: 0.2,
          ease: 'power1.out',
        },
        '-=0.1'
      );
    }

    if (this.baseline) {
      timeline.to(
        this.baseline,
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.45,
        },
        '-=0.05'
      );
    }

    if (this.ctaButtons.length) {
      timeline.to(
        this.ctaButtons,
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.45,
          stagger: 0.1,
        },
        '-=0.25'
      );
    }

    if (this.scrollIndicator) {
      timeline.to(
        this.scrollIndicator,
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.4,
        },
        '-=0.2'
      );
    }

    timeline.call(() => {
      this.updateInkInteraction();
    });

    this.timeline = timeline;
  }

  start() {
    if (this.prefersReducedMotion.matches) {
      return;
    }

    if (!this.timeline) {
      this.setupAnimation();
    }
  }

  setupScrollIndicator() {
    if (!this.scrollIndicator) return;

    this.scrollIndicator.addEventListener('click', (event) => {
      event.preventDefault();
      const targetSelector = this.scrollIndicator.dataset.scrollTarget;
      if (!targetSelector) return;

      const target = document.querySelector(targetSelector);
      if (!target) return;

      if (window.lenis) {
        window.lenis.scrollTo(target, { offset: -80, duration: 1.1 });
      } else {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  shouldEnableInkInteraction() {
    if (!this.inkFill || !this.inkChannel) return false;
    if (this.prefersReducedMotion?.matches) return false;
    if (window.innerWidth < 1024) return false;
    if (this.pointerFine && !this.pointerFine.matches) return false;
    return true;
  }

  updateInkInteraction() {
    if (this.shouldEnableInkInteraction()) {
      this.setupInkInteraction();
    } else {
      this.teardownInkInteraction();
    }
  }

  setupInkInteraction() {
    if (this.inkInteractionEnabled || !this.inkChannel) return;

    this.inkChannel.addEventListener('pointerenter', this.handlePointerEnter);
    this.inkChannel.addEventListener('pointermove', this.handlePointerMove);
    this.inkChannel.addEventListener('pointerleave', this.handlePointerLeave);
    this.inkInteractionEnabled = true;
  }

  teardownInkInteraction() {
    if (!this.inkInteractionEnabled || !this.inkChannel) return;

    this.inkChannel.removeEventListener('pointerenter', this.handlePointerEnter);
    this.inkChannel.removeEventListener('pointermove', this.handlePointerMove);
    this.inkChannel.removeEventListener('pointerleave', this.handlePointerLeave);
    this.inkInteractionEnabled = false;

    if (this.inkFill) {
      gsap.to(this.inkFill, {
        duration: 0.6,
        ease: 'power2.out',
        '--ink-ripple-x': '50%',
        '--ink-ripple-y': '50%',
        scaleY: 1,
      });
    }
  }

  handlePointerEnter(event) {
    this.handlePointerMove(event);
  }

  handlePointerMove(event) {
    if (!this.inkInteractionEnabled || !this.inkChannel || !this.inkFill) return;

    const rect = this.inkChannel.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const clampedX = Math.max(0, Math.min(100, x));

    gsap.to(this.inkFill, {
      duration: 0.4,
      ease: 'power2.out',
      '--ink-ripple-x': `${clampedX}%`,
      '--ink-ripple-y': '45%',
      scaleY: 1.05,
    });
  }

  handlePointerLeave() {
    if (!this.inkFill) return;

    gsap.to(this.inkFill, {
      duration: 0.6,
      ease: 'power2.out',
      '--ink-ripple-x': '50%',
      '--ink-ripple-y': '50%',
      scaleY: 1,
    });
  }

  handleResize() {
    this.updateInkInteraction();
  }
}

export function initHeroInkBlock(context = {}) {
  const { modules = {} } = context;
  const heroElement = document.querySelector('[data-block="hero-ink"]');

  if (!heroElement) {
    return { ...context, modules };
  }

  if (!modules.heroInk) {
    modules.heroInk = new HeroInk(heroElement);
  }

  return { ...context, modules };
}

export default initHeroInkBlock;
