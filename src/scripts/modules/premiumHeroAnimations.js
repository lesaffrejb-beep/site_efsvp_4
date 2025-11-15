/**
 * Premium Hero Animations
 * Animations GSAP pour le hero premium (typewriter, logos, CTAs)
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export class PremiumHeroAnimations {
  constructor() {
    this.heroSection = document.querySelector('.premium-hero');
    if (!this.heroSection) {
      console.warn('PremiumHeroAnimations: Hero section not found');
      return;
    }

    this.elements = {
      logos: this.heroSection.querySelector('[data-logos]'),
      title: this.heroSection.querySelector('[data-title]'),
      titleWords: this.heroSection.querySelectorAll('.premium-hero__title-word'),
      subtitle: this.heroSection.querySelector('[data-subtitle]'),
      cta: this.heroSection.querySelector('[data-cta]'),
      scrollIndicator: this.heroSection.querySelector('[data-scroll-indicator]'),
    };

    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.init();
  }

  init() {
    if (this.prefersReducedMotion) {
      this.showElementsImmediately();
      return;
    }

    // Wait for 3D scene to initialize (small delay)
    setTimeout(() => {
      this.animateEntrance();
      this.setupScrollIndicatorClick();
    }, 300);
  }

  showElementsImmediately() {
    // Pour les utilisateurs qui préfèrent un mouvement réduit
    gsap.set(
      [
        this.elements.logos,
        this.elements.title,
        this.elements.subtitle,
        this.elements.cta,
      ],
      {
        opacity: 1,
        y: 0,
      }
    );

    if (this.elements.titleWords) {
      gsap.set(this.elements.titleWords, {
        opacity: 1,
        y: 0,
      });
    }

    this.heroSection.classList.add('premium-hero--loaded');
  }

  animateEntrance() {
    const timeline = gsap.timeline({
      defaults: {
        ease: 'power3.out',
      },
      onComplete: () => {
        this.heroSection.classList.add('premium-hero--loaded');
      },
    });

    // 1. Logos clients - Stagger fade in
    timeline.from(
      this.elements.logos,
      {
        opacity: 0,
        y: 20,
        duration: 0.8,
      },
      0.2
    );

    if (this.elements.logos) {
      const logos = this.elements.logos.querySelectorAll('.premium-hero__logo');
      timeline.from(
        logos,
        {
          opacity: 0,
          y: 10,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power2.out',
        },
        0.3
      );
    }

    // 2. Titre - Typewriter effect (mot par mot)
    if (this.elements.titleWords && this.elements.titleWords.length > 0) {
      timeline.set(this.elements.title, { opacity: 1 }, 0.5);

      timeline.from(
        this.elements.titleWords,
        {
          opacity: 0,
          y: '100%',
          duration: 0.8,
          stagger: 0.08,
          ease: 'power4.out',
        },
        0.6
      );
    }

    // 3. Sous-titre
    timeline.from(
      this.elements.subtitle,
      {
        opacity: 0,
        y: 20,
        duration: 0.8,
      },
      1.4
    );

    // 4. CTAs
    if (this.elements.cta) {
      const buttons = this.elements.cta.querySelectorAll('.premium-hero__cta');
      timeline.from(
        this.elements.cta,
        {
          opacity: 0,
          y: 20,
          duration: 0.8,
        },
        1.6
      );

      timeline.from(
        buttons,
        {
          scale: 0.9,
          duration: 0.5,
          stagger: 0.1,
          ease: 'back.out(1.7)',
        },
        1.8
      );
    }

    // 5. Scroll indicator
    if (this.elements.scrollIndicator) {
      timeline.from(
        this.elements.scrollIndicator,
        {
          opacity: 0,
          y: -10,
          duration: 0.8,
        },
        2.0
      );
    }
  }

  setupScrollIndicatorClick() {
    if (!this.elements.scrollIndicator) return;

    this.elements.scrollIndicator.addEventListener('click', () => {
      const nextSection = this.heroSection.nextElementSibling;
      if (nextSection) {
        nextSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  /**
   * Cleanup
   */
  dispose() {
    if (ScrollTrigger.getAll) {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.trigger === this.heroSection) {
          trigger.kill();
        }
      });
    }
  }
}

/**
 * Initialize Premium Hero Animations
 */
export function initPremiumHeroAnimations() {
  const animations = new PremiumHeroAnimations();

  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    if (animations) {
      animations.dispose();
    }
  });

  console.log('✅ PremiumHero animations initialized');

  return animations;
}
