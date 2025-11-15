/**
 * Hero Manager
 * Vidéo background + animations premium
 */

import { gsap } from 'gsap';

export class HeroManager {
  constructor() {
    this.hero = document.querySelector('.hero');
    if (!this.hero) return;

    this.video = this.hero.querySelector('.hero__video-placeholder video');
    this.content = this.hero.querySelector('.hero__content');
    this.ctaGroup = this.hero.querySelector('.hero__cta-group');
    this.tagline = this.hero.querySelectorAll('.hero__tagline .typewriter-line');
    this.scrollIndicator = this.hero.querySelector('.hero__scroll');

    this.init();
  }

  init() {
    if (this.video) {
      this.setupVideo();
    }
    this.setupAnimations();
    this.setupVisibilityObserver();
    if (this.scrollIndicator) {
      this.setupScrollIndicator();
    }
  }

  setupVideo() {
    // Autoplay avec fallback
    const playPromise = this.video.play();

    if (playPromise !== undefined) {
      playPromise.catch((error) => {
        console.log('Autoplay prevented:', error);
        // Fallback: play on user interaction
        document.addEventListener(
          'click',
          () => {
            this.video.play();
          },
          { once: true }
        );
      });
    }
  }

  setupVisibilityObserver() {
    if (!this.hero || !this.ctaGroup) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.hero.classList.remove('hero--cta-hidden');
          } else if (entry.boundingClientRect.top < 0) {
            this.hero.classList.add('hero--cta-hidden');
          }
        });
      },
      {
        threshold: 0.2,
      }
    );

    observer.observe(this.hero);
  }

  setupAnimations() {
    // Animations d'entrée sobres
    const tl = gsap.timeline({
      delay: 0.5,
    });

    // Fade in content
    tl.from(this.content, {
      opacity: 0,
      y: 50,
      duration: 1,
      ease: 'power3.out',
    });

    // Tagline lignes une par une (sobre, pas typewriter complexe)
    if (this.tagline.length > 0) {
      tl.from(
        this.tagline,
        {
          opacity: 0,
          y: 20,
          duration: 0.6,
          stagger: 0.2,
          ease: 'power2.out',
        },
        '-=0.5'
      );
    }

    // Parallax vidéo sur scroll (sobre)
    if (this.video) {
      gsap.to(this.video.parentElement, {
        yPercent: 20,
        ease: 'none',
        scrollTrigger: {
          trigger: this.hero,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    }
  }

  setupScrollIndicator() {
    // Hide on scroll
    gsap.to(this.scrollIndicator, {
      opacity: 0,
      scrollTrigger: {
        trigger: this.hero,
        start: 'top top',
        end: '+=300',
        scrub: true,
      },
    });

    // Click scroll to #creations section
    this.scrollIndicator.addEventListener('click', () => {
      const creationsSection = document.querySelector('#creations');
      if (creationsSection) {
        window.lenis?.scrollTo(creationsSection, {
          offset: -100,
          duration: 1.5,
        });
      }
    });
  }

  start() {
    // Entry animations déjà lancées dans init
  }
}
