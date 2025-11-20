/**
 * Animations Premium Module
 * Effets de blur, parallax, scroll reveals, typewriter
 * 60fps garanti avec GSAP
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export class AnimationsManager {
  constructor() {
    this.init();
  }

  init() {
    // Batch similar animations for performance
    this.setupScrollReveals();
    this.setupBlurEffects();
    this.setupParallaxElements();
    this.setupHoverEffects();
    this.setupTypewriterEffect();
  }

  /**
   * Scroll Reveal Animations
   * Batch elements by type for better performance
   */
  setupScrollReveals() {
    // Fade up animation
    const fadeUpElements = gsap.utils.toArray('[data-scroll]');

    if (fadeUpElements.length > 0) {
      const reveal = (element) => {
        element.classList.add('visible');
        element.style.opacity = '1';
        element.style.transform = 'none';
      };

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              reveal(entry.target);
              observer.unobserve(entry.target);
            }
          });
        },
        { rootMargin: '0px 0px -15% 0px' }
      );

      fadeUpElements.forEach((element) => {
        const rect = element.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.85) {
          reveal(element);
        } else {
          element.style.opacity = '0';
          element.style.transform = 'translateY(30px)';
          observer.observe(element);
        }
      });
    }

    // Fade in from left
    const fadeLeftElements = gsap.utils.toArray('[data-reveal="left"]');

    if (fadeLeftElements.length > 0) {
      ScrollTrigger.batch(fadeLeftElements, {
        onEnter: (elements) => {
          gsap.from(elements, {
            opacity: 0,
            x: -80,
            stagger: 0.1,
            duration: 1,
            ease: 'power3.out',
          });
        },
        start: 'top 85%',
        once: true,
      });
    }

    // Fade in from right
    const fadeRightElements = gsap.utils.toArray('[data-reveal="right"]');

    if (fadeRightElements.length > 0) {
      ScrollTrigger.batch(fadeRightElements, {
        onEnter: (elements) => {
          gsap.from(elements, {
            opacity: 0,
            x: 80,
            stagger: 0.1,
            duration: 1,
            ease: 'power3.out',
          });
        },
        start: 'top 85%',
        once: true,
      });
    }

    // Scale in
    const scaleElements = gsap.utils.toArray('[data-reveal="scale"]');

    if (scaleElements.length > 0) {
      ScrollTrigger.batch(scaleElements, {
        onEnter: (elements) => {
          gsap.from(elements, {
            opacity: 0,
            scale: 0.8,
            stagger: 0.1,
            duration: 0.8,
            ease: 'back.out(1.4)',
          });
        },
        start: 'top 85%',
        once: true,
      });
    }
  }

  /**
   * Blur Effects
   * Progressive blur removal on scroll
   */
  setupBlurEffects() {
    const blurElements = gsap.utils.toArray('[data-blur]');

    blurElements.forEach((element) => {
      const blurAmount = element.dataset.blur || 20;

      // Initial state
      gsap.set(element, {
        filter: `blur(${blurAmount}px)`,
        scale: 1.05, // Prevent edge bleeding
      });

      // Animate on scroll
      gsap.to(element, {
        filter: 'blur(0px)',
        scale: 1,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: element,
          start: 'top 80%',
          end: 'top 30%',
          scrub: 1,
        },
      });
    });

    // Blur on hover (reverse effect)
    const blurHoverElements = gsap.utils.toArray('[data-blur-hover]');

    blurHoverElements.forEach((element) => {
      element.addEventListener('mouseenter', () => {
        gsap.to(element, {
          filter: 'blur(4px)',
          scale: 1.02,
          duration: 0.3,
          ease: 'power2.out',
        });
      });

      element.addEventListener('mouseleave', () => {
        gsap.to(element, {
          filter: 'blur(0px)',
          scale: 1,
          duration: 0.3,
          ease: 'power2.out',
        });
      });
    });
  }

  /**
   * Parallax Effects
   * Smooth parallax scrolling for images and sections
   */
  setupParallaxElements() {
    const parallaxElements = gsap.utils.toArray('[data-parallax]');

    parallaxElements.forEach((element) => {
      const speed = parseFloat(element.dataset.parallaxSpeed) || 0.5;
      const direction = element.dataset.parallaxDirection || 'vertical';

      if (direction === 'vertical') {
        gsap.to(element, {
          yPercent: speed * 50,
          ease: 'none',
          scrollTrigger: {
            trigger: element,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        });
      } else {
        gsap.to(element, {
          xPercent: speed * 30,
          ease: 'none',
          scrollTrigger: {
            trigger: element,
            start: 'left right',
            end: 'right left',
            scrub: true,
            horizontal: true,
          },
        });
      }
    });
  }

  /**
   * Hover Effects Premium
   * Magnetic buttons, glow effects, etc.
   */
  setupHoverEffects() {
    // Glow effect on cards
    const glowElements = gsap.utils.toArray('[data-glow]');

    glowElements.forEach((element) => {
      element.addEventListener('mouseenter', (_e) => {
        gsap.to(element, {
          boxShadow: '0 20px 40px rgba(232, 146, 79, 0.3)',
          duration: 0.3,
          ease: 'power2.out',
        });
      });

      element.addEventListener('mouseleave', () => {
        gsap.to(element, {
          boxShadow: '0 12px 32px rgba(0, 0, 0, 0.42)',
          duration: 0.3,
          ease: 'power2.out',
        });
      });
    });

    // Lift effect
    const liftElements = gsap.utils.toArray('[data-lift]');

    liftElements.forEach((element) => {
      element.addEventListener('mouseenter', () => {
        gsap.to(element, {
          y: -8,
          scale: 1.02,
          duration: 0.3,
          ease: 'power2.out',
        });
      });

      element.addEventListener('mouseleave', () => {
        gsap.to(element, {
          y: 0,
          scale: 1,
          duration: 0.3,
          ease: 'power2.out',
        });
      });
    });

    // Soft hover lift (remplace l'effet 3D)
    const tiltElements = gsap.utils.toArray('[data-tilt]');

    tiltElements.forEach((element) => {
      element.addEventListener('mouseenter', () => {
        gsap.to(element, {
          y: -6,
          duration: 0.35,
          ease: 'power2.out',
          boxShadow: '0 24px 44px rgba(26, 35, 50, 0.18)',
        });
      });

      element.addEventListener('mouseleave', () => {
        gsap.to(element, {
          y: 0,
          duration: 0.35,
          ease: 'power2.out',
          boxShadow: 'var(--shadow-lg)',
        });
      });
    });
  }

  /**
   * Typewriter Effect
   * Progressive text reveal character by character
   */
  setupTypewriterEffect() {
    const typewriterElements = gsap.utils.toArray('[data-typewriter]');

    typewriterElements.forEach((element) => {
      const text = element.textContent;
      const speed = parseFloat(element.dataset.typewriterSpeed) || 0.05;
      const delay = parseFloat(element.dataset.typewriterDelay) || 0;

      // Clear text
      element.textContent = '';
      element.style.opacity = '1';

      // Split into characters
      const chars = text.split('');

      // Create timeline
      const tl = gsap.timeline({
        delay,
        scrollTrigger: {
          trigger: element,
          start: 'top 85%',
          once: true,
        },
      });

      // Add cursor
      const cursor = document.createElement('span');
      cursor.className = 'typewriter-cursor';
      cursor.textContent = '|';
      cursor.style.cssText = `
        display: inline-block;
        color: var(--accent);
        animation: blink 1s step-end infinite;
      `;

      // Animate each character
      chars.forEach((char, index) => {
        tl.call(
          () => {
            element.textContent += char;
          },
          [],
          index * speed
        );
      });

      // Add blinking cursor at end
      tl.call(() => {
        element.appendChild(cursor);
      });

      // Add blink animation if not exists
      this.addTypewriterStyles();
    });
  }

  addTypewriterStyles() {
    if (document.getElementById('typewriter-styles')) return;

    const style = document.createElement('style');
    style.id = 'typewriter-styles';
    style.textContent = `
      @keyframes blink {
        0%, 50% {
          opacity: 1;
        }
        51%, 100% {
          opacity: 0;
        }
      }

      .typewriter-cursor {
        animation: blink 1s step-end infinite;
      }
    `;

    document.head.appendChild(style);
  }

  /**
   * Number Counter Animation
   * Animate numbers from 0 to target value
   */
  static animateCounter(element, target, duration = 2) {
    const obj = { value: 0 };

    gsap.to(obj, {
      value: target,
      duration,
      ease: 'power1.out',
      snap: { value: 1 },
      onUpdate: () => {
        element.textContent = Math.round(obj.value);
      },
      scrollTrigger: {
        trigger: element,
        start: 'top 85%',
        once: true,
      },
    });
  }

  /**
   * Stagger Animation Utility
   * Animate list items with stagger
   */
  static staggerIn(elements, options = {}) {
    const defaults = {
      opacity: 0,
      y: 30,
      stagger: 0.1,
      duration: 0.6,
      ease: 'power2.out',
    };

    gsap.from(elements, { ...defaults, ...options });
  }

  /**
   * Text Split Animation
   * Split text into words/chars for animation
   */
  static splitTextAnimation(element, type = 'words') {
    const text = element.textContent;
    element.innerHTML = '';

    if (type === 'words') {
      const words = text.split(' ');

      words.forEach((word, index) => {
        const span = document.createElement('span');
        span.textContent = word;
        span.style.display = 'inline-block';
        span.style.opacity = '0';

        element.appendChild(span);

        if (index < words.length - 1) {
          element.appendChild(document.createTextNode(' '));
        }

        gsap.to(span, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          delay: index * 0.05,
          ease: 'power2.out',
        });
      });
    } else if (type === 'chars') {
      const chars = text.split('');

      chars.forEach((char, index) => {
        const span = document.createElement('span');
        span.textContent = char;
        span.style.display = 'inline-block';
        span.style.opacity = '0';

        element.appendChild(span);

        gsap.to(span, {
          opacity: 1,
          y: 0,
          duration: 0.4,
          delay: index * 0.02,
          ease: 'power2.out',
        });
      });
    }
  }

  /**
   * Cleanup
   */
  destroy() {
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
  }
}

// Export utilities
export const { animateCounter, staggerIn, splitTextAnimation } = AnimationsManager;
