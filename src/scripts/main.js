/**
 * ============================================
 * EfSVP - AWWWARDS-GRADE MAIN APP PREMIUM
 * Architecture modulaire ES6 avec error handling
 * Performance optimisée Lighthouse > 95
 * Plan (avril 2025)
 * - Ajouter glow CTA hero + micro-interactions accessibles
 * - Harmoniser boutons / contenus injectés avant animations
 * ============================================
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ErrorHandler } from './modules/errorHandler.js';
import { LazyLoadManager } from './modules/lazyLoad.js';
import { FormValidator } from './modules/formValidator.js';
import { AnimationsManager } from './modules/animations.js';
import { ProgressiveNav } from './modules/progressiveNav.js';
import { ProcessReveal } from './modules/processReveal.js';
import { CookieConsent } from './modules/cookieConsent.js';
import { CopyEmail } from './modules/copyEmail.js';
import { FAQ } from './modules/faq.js';
import { initAllContent } from './content-init.js';
import { initPortfolioBlock } from './blocks/portfolio.js';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Expose main orchestrator flag for legacy bundles
window.__EFVSP_APP_ACTIVE = true;

// ============================================
// APP CLASS - Orchestration Premium
// ============================================
class App {
  constructor() {
    this.modules = {};
    this.isMobile = window.innerWidth < 1024;
    this.isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.hasCoarsePointer = window.matchMedia('(pointer: coarse)').matches || navigator.maxTouchPoints > 0;

    this.init();
  }

  async init() {
    // 0. Error Handler (TOUJOURS en premier)
    this.initErrorHandler();

    try {
      // 1. Preloader
      await this.handlePreloader();

      // 2. Content Layer - Injection du contenu (AVANT tout le reste)
      initAllContent();

      // 3. Lazy Loading
      this.initLazyLoading();

      // 4. Core modules
      await this.initCore();

      // 5. Section modules
      await this.initSections();

      // 6. Animations premium
      this.initAnimations();

      // 7. Start
      this.start();

      console.log('✅ EfSVP Premium Site - Loaded successfully');
    } catch (error) {
      console.error('🚨 CRITICAL BOOT ERROR:', error);
      console.error('🚨 Error stack:', error?.stack);
      console.error('🚨 Error type:', error?.constructor?.name);
      this.handleCriticalError(error);
    }
  }

  /**
   * Error Handler - Global error management
   */
  initErrorHandler() {
    this.modules.errorHandler = new ErrorHandler();
    window.__errorHandler = this.modules.errorHandler; // Global access
  }

  /**
   * Lazy Loading - Images, videos, blur effects
   */
  initLazyLoading() {
    this.modules.lazyLoad = new LazyLoadManager();
  }

  /**
   * Animations Premium - Scroll reveals, blur, parallax
   */
  initAnimations() {
    this.modules.animations = new AnimationsManager();
  }

  async handlePreloader() {
    const preloader = document.getElementById('preloader');

    // 🛡️ FAIL-SAFE BOOTLOADER
    // Force l'affichage du site quoi qu'il arrive
    const startApp = () => {
      console.log('🚀 Site ready');
      document.documentElement.classList.remove('is-loading');
      document.body.classList.add('loaded');
      document.body.style.overflow = '';

      // Masquer le preloader avec animation
      if (preloader) {
        preloader.classList.add('hidden');
        preloader.addEventListener('transitionend', () => {
          preloader.remove();
        }, { once: true });
        setTimeout(() => preloader.remove(), 900);
      }
    };

    // Pattern de Boot Robuste (Awwwards Standard)
    document.documentElement.classList.add('is-loading');

    // Essayer de charger proprement
    Promise.all([
      document.fonts.ready.catch(() => {
        console.warn('⚠️ Fonts not ready, continuing anyway');
        return Promise.resolve();
      }),
      new Promise(resolve => {
        if (document.readyState === 'interactive' || document.readyState === 'complete') {
          resolve();
        } else {
          window.addEventListener('DOMContentLoaded', resolve, { once: true });
        }
      })
    ]).then(() => {
      startApp(); // Chargement propre
    }).catch(err => {
      console.warn('⚠️ Assets loading warning', err);
      startApp(); // Chargement forcé (fallback)
    });

    // 🚨 Sécurité ultime : si dans 10s rien ne s'est passé, on ouvre les vannes
    // (Augmenté de 2s à 10s pour éviter les faux positifs sur connexions lentes)
    setTimeout(() => {
      if (!document.body.classList.contains('loaded')) {
        console.warn('🚨 Emergency Start triggered after 10s timeout');
        startApp();
      }
    }, 10000);
  }

  async initCore() {
    // Cookie Consent (RGPD/CNIL) - Initialize early
    this.modules.cookieConsent = new CookieConsent();

    // Smooth Scroll (Lenis)
    if (!this.prefersReducedMotion && !this.hasCoarsePointer) {
      const { SmoothScroll } = await import('./modules/smoothScroll.js');
      this.modules.smoothScroll = new SmoothScroll();
      if (this.modules.smoothScroll.lenis) {
        window.lenis = this.modules.smoothScroll.lenis; // Global access
      }
    }

    // Reading Progress Bar Premium (REMPLACÉ par ProgressiveNav)
    // this.modules.progressBar = new ProgressBar();

    // Progressive Navigation avec barre de scroll
    this.modules.progressiveNav = new ProgressiveNav();

    // Custom Cursor (desktop only)
    if (!this.isMobile && !this.hasCoarsePointer && !this.prefersReducedMotion) {
      const { CursorManager } = await import('./modules/cursor.js');
      this.modules.cursor = new CursorManager();
    }

    // Magnetic Buttons
    if (!this.isMobile && !this.hasCoarsePointer && !this.prefersReducedMotion) {
      const { MagneticButtons } = await import('./modules/magnetic.js');
      this.modules.magnetic = new MagneticButtons();
    }

    // Navigation mobile
    this.initNavigation();

    // Scroll Reveal global
    this.initScrollReveal();
  }

  async initSections() {
    // Hero signature animation (lazy)
    if (document.querySelector('[data-hero-signature]')) {
      const { initHeroSignature } = await import('./blocks/hero-signature.js');
      initHeroSignature();
    }

    // Effet glow sur le CTA hero (après injection du contenu)
    this.initHeroGlow();

    if (document.querySelector('.audio-player, .efsvp-audio')) {
      const { initAudioBlock } = await import('./blocks/audio.js');
      const audioContext = initAudioBlock({ modules: this.modules });
      this.modules = audioContext.modules;
    }

    // Process Reveal Animation
    this.modules.processReveal = new ProcessReveal();

    // Portfolio filters
    initPortfolioBlock();

    // Projects app
    const hasProjectsApp = document.querySelector('.projects__grid');
    if (hasProjectsApp) {
      const { initProjectsApp } = await import('./projects-app.ts');
      initProjectsApp();
    }

    // Testimonials carousel
    if (document.querySelector('.testimonials__carousel')) {
      const { initTestimonialsBlock } = await import('./blocks/testimonials.js');
      const testimonialsInstance = initTestimonialsBlock();
      if (testimonialsInstance) {
        this.modules.testimonials = testimonialsInstance;
      }
    }

    // FAQ Accordion
    this.initFAQ();

    // Contact Form
    this.initContactForm();

    // Copy Email functionality
    this.modules.copyEmail = new CopyEmail();

    // Stats Counter
    this.initStatsCounter();

    // Back to top
    this.initBackToTop();

    // Floating CTA
    this.initFloatingCTA();

    // Bento Grid audio buttons
    this.initBentoAudioButtons();

  }

  start() {
    // this.modules.heroInk?.start?.();

    // S'assurer qu'on arrive en haut de page si pas de hash dans l'URL
    if (!window.location.hash) {
      window.scrollTo(0, 0);
      if (this.modules.smoothScroll?.lenis) {
        this.modules.smoothScroll.lenis.scrollTo(0, { immediate: true });
      }
    }

    // Performance monitoring
    this.logPerformanceMetrics();
  }

  /**
   * Handle critical initialization errors
   * ☢️ NEUTRALIZED - Force site display even on errors
   */
  handleCriticalError(error) {
    console.warn('⚠️ Une erreur a été supprimée pour forcer l\'affichage:', error);

    // Force site display - NUCLEAR MODE
    document.body.classList.add('loaded');
    document.body.classList.remove('is-loading');
    document.documentElement.classList.remove('is-loading');
    document.body.style.overflow = '';

    // Remove preloader if it exists
    const loader = document.querySelector('.preloader');
    if (loader) {
      loader.style.display = 'none';
      loader.remove();
    }

    // Remove ALL possible error overlays (nuclear cleanup)
    const selectors = [
      '[class*="error-"]',
      '[id*="error-"]',
      '[class*="overlay"]',
      '[class*="critical-"]',
      'div[style*="z-index: 99999"]',
      'div[style*="position: fixed"][style*="width: 100%"]'
    ];

    selectors.forEach(selector => {
      try {
        document.querySelectorAll(selector).forEach(el => {
          // Ne pas supprimer les overlays légitimes (nav, modal)
          if (!el.id?.includes('nav') && !el.classList.contains('modal-overlay')) {
            el.remove();
          }
        });
      } catch (e) {
        console.warn('Cleanup selector failed:', selector, e);
      }
    });
  }

  /**
   * Log performance metrics
   */
  logPerformanceMetrics() {
    if (!window.performance) return;

    // Wait for page to fully load
    window.addEventListener('load', () => {
      setTimeout(() => {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        const connectTime = perfData.responseEnd - perfData.requestStart;
        const renderTime = perfData.domComplete - perfData.domLoading;

        console.group('📊 Performance Metrics');
        console.log(`⏱️  Page Load Time: ${pageLoadTime}ms`);
        console.log(`🔌 Connection Time: ${connectTime}ms`);
        console.log(`🎨 Render Time: ${renderTime}ms`);
        console.groupEnd();

        // Log to analytics (if available)
        if (window.gtag) {
          window.gtag('event', 'timing_complete', {
            name: 'load',
            value: pageLoadTime,
            event_category: 'Performance',
          });
        }
      }, 0);
    });
  }

  // ========== NAVIGATION ==========
  initNavigation() {
    const nav = document.getElementById('nav');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navOverlay = document.getElementById('nav-overlay');

    // Show on scroll
    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;

      if (currentScroll > 100) {
        nav?.classList.add('visible');
      } else {
        nav?.classList.remove('visible');
      }
    });

    // Update active nav link based on scroll position
    this.updateActiveNavLink();
    window.addEventListener('scroll', () => this.updateActiveNavLink());

    // Mobile menu avec focus trap
    if (navToggle && navMenu) {
      const desktopMedia = window.matchMedia('(min-width: 1024px)');
      const isDesktopView = () => desktopMedia.matches;

      const syncMenuAccessibility = (isOpen) => {
        const ariaHidden = isDesktopView() ? 'false' : isOpen ? 'false' : 'true';
        navMenu.setAttribute('aria-hidden', ariaHidden);

        if (!isDesktopView()) {
          if (isOpen) {
            navMenu.removeAttribute('inert');
          } else {
            navMenu.setAttribute('inert', '');
          }
        } else {
          navMenu.removeAttribute('inert');
        }

        navOverlay?.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
      };

      // Initialiser l'état du menu en fonction du viewport
      syncMenuAccessibility(false);

      let focusableElements = [];
      let firstFocusable = null;
      let lastFocusable = null;

      const updateFocusableElements = () => {
        focusableElements = Array.from(navMenu.querySelectorAll('a[href], button:not([disabled])'));
        firstFocusable = focusableElements[0];
        lastFocusable = focusableElements[focusableElements.length - 1];
      };

      const closeMenu = () => {
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', 'Ouvrir le menu');
        navMenu.classList.remove('active', 'is-active');
        syncMenuAccessibility(false);
        navOverlay?.classList.remove('is-active');
        document.body.classList.remove('menu-open');
        document.body.style.overflow = '';
      };

      const openMenu = () => {
        navToggle.setAttribute('aria-expanded', 'true');
        navToggle.setAttribute('aria-label', 'Fermer le menu');
        navMenu.classList.add('is-active');
        syncMenuAccessibility(true);
        navOverlay?.classList.add('is-active');
        document.body.classList.add('menu-open');
        document.body.style.overflow = 'hidden';

        updateFocusableElements();
        setTimeout(() => firstFocusable?.focus(), 100);
      };

      navToggle.addEventListener('click', () => {
        const isOpen = navMenu.classList.contains('is-active');

        if (isOpen) {
          closeMenu();
          navToggle.focus();
        } else {
          openMenu();
        }
      });

      navOverlay?.addEventListener('click', closeMenu);

      // Close menu on resize to desktop
      desktopMedia.addEventListener('change', (event) => {
        syncMenuAccessibility(navMenu.classList.contains('is-active'));

        if (event.matches) {
          closeMenu();
          navMenu.classList.remove('is-active');
        }
      });

      document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && navMenu.classList.contains('is-active')) {
          event.preventDefault();
          closeMenu();
          navToggle.focus();
        }
      });

      // Focus trap: empêcher Tab de sortir du menu mobile
      navMenu.addEventListener('keydown', (e) => {
        if (e.key !== 'Tab' || !navMenu.classList.contains('is-active')) return;

        if (e.shiftKey) {
          // Shift + Tab
          if (document.activeElement === firstFocusable) {
            e.preventDefault();
            lastFocusable?.focus();
          }
        } else {
          // Tab
          if (document.activeElement === lastFocusable) {
            e.preventDefault();
            firstFocusable?.focus();
          }
        }
      });

      navMenu.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
          closeMenu();
        });
      });
    }
  }

  // Update aria-current on navigation links
  updateActiveNavLink() {
    const navLinks = document.querySelectorAll('.nav__link');
    const sections = document.querySelectorAll('section[id]');

    let currentSection = '';

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      const scrollPos = window.pageYOffset + 100; // Offset pour le header

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.removeAttribute('aria-current');
      const href = link.getAttribute('href');
      if (href && href.includes(`#${currentSection}`)) {
        link.setAttribute('aria-current', 'page');
      }
    });
  }

  // ========== SCROLL REVEAL (géré par AnimationsManager) ==========
  initScrollReveal() {
    // Animations scroll gérées par le nouveau AnimationsManager
    // Conservé ici pour compatibilité avec anciens attributs
    const legacyElements = gsap.utils.toArray('[data-scroll]:not([data-reveal])');

    if (legacyElements.length > 0) {
      gsap.utils.toArray(legacyElements).forEach((element) => {
        gsap.fromTo(
          element,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: element,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      });
    }
  }

  // ========== FAQ ==========
  initFAQ() {
    // Use new FAQ module
    this.modules.faq = new FAQ();
  }

  initHeroGlow() {
    const heroButton = document.querySelector('[data-glow]');
    if (!heroButton) return;

    const updateGlow = (event) => {
      const rect = heroButton.getBoundingClientRect();
      const pointX = (event.clientX ?? event.touches?.[0]?.clientX ?? 0) - rect.left;
      const pointY = (event.clientY ?? event.touches?.[0]?.clientY ?? 0) - rect.top;
      heroButton.style.setProperty('--x', `${pointX}px`);
      heroButton.style.setProperty('--y', `${pointY}px`);
    };

    heroButton.addEventListener('pointermove', updateGlow);
    heroButton.addEventListener('mouseleave', () => {
      heroButton.style.setProperty('--x', '50%');
      heroButton.style.setProperty('--y', '50%');
    });
  }

  // ========== CONTACT FORM PREMIUM ==========
  initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    // Initialize premium form validator
    this.modules.formValidator = new FormValidator(form);

    // Quick quote form (mini-formulaire)
    this.initQuickQuoteForm();

    // Budget slider synchronization
    this.initBudgetSlider();
  }

  // ========== BUDGET SLIDER ==========
  initBudgetSlider() {
    const slider = document.getElementById('budget');
    const output = document.querySelector('.form__range-value');

    if (!slider || !output) return;

    const updateSlider = () => {
      const value = parseInt(slider.value, 10);
      const min = slider.min ? parseInt(slider.min, 10) : 0;
      const max = slider.max ? parseInt(slider.max, 10) : 100;
      const percentage = ((value - min) / (max - min)) * 100;

      // Update text
      output.textContent = `~${new Intl.NumberFormat('fr-FR').format(value)}€`;

      // Update visual progress (CSS variable for gradient)
      slider.style.setProperty('--value', `${percentage}%`);
    };

    slider.addEventListener('input', updateSlider);
    // Initial call
    updateSlider();
  }

  // ========== QUICK QUOTE FORM ==========
  initQuickQuoteForm() {
    const quickForm = document.getElementById('quick-quote-form');
    if (!quickForm) return;

    const submitButton = quickForm.querySelector('button[type="submit"]');
    const defaultLabel = submitButton?.textContent || 'Envoyer';
    let statusMessage = quickForm.querySelector('[data-quick-quote-status]');

    if (!statusMessage) {
      statusMessage = document.createElement('p');
      statusMessage.dataset.quickQuoteStatus = 'true';
      statusMessage.className = 'quick-quote__status';
      statusMessage.setAttribute('role', 'status');
      statusMessage.setAttribute('aria-live', 'polite');
      statusMessage.textContent = '';
      submitButton?.insertAdjacentElement('afterend', statusMessage);
    }

    const setStatus = (message, type = 'info') => {
      if (!statusMessage) return;
      statusMessage.textContent = message;
      statusMessage.dataset.state = type;
    };

    quickForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const formData = new FormData(quickForm);
      const data = {
        nom: formData.get('nom'),
        organisation: formData.get('organisation'),
        email: formData.get('email'),
        formule: formData.get('formule'),
        budget: formData.get('budget'),
        message: formData.get('message'),
        source: 'quick-quote-form',
      };

      try {
        submitButton?.setAttribute('disabled', 'true');
        if (submitButton) submitButton.textContent = 'Envoi en cours…';

        const response = await fetch('/api/quick-quote', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error(`Quick quote error: ${response.status}`);
        }

        const result = await response.json();
        if (!result?.ok) {
          throw new Error('Quick quote error: invalid response');
        }

        setStatus('Message envoyé ! On vous répond sous 72h.', 'success');
        quickForm.reset();
      } catch (error) {
        console.error('❌ Quick quote form error', error);
        setStatus('Un problème est survenu, réessayez plus tard.', 'error');
      } finally {
        if (submitButton) {
          submitButton.textContent = defaultLabel;
          submitButton.removeAttribute('disabled');
        }
      }
    });
  }

  // ========== STATS COUNTER ==========
  initStatsCounter() {
    const statCards = document.querySelectorAll('[data-count]');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Si préférence réduite, ne pas animer
    if (prefersReducedMotion) {
      return;
    }

    statCards.forEach((stat) => {
      const target = parseInt(stat.getAttribute('data-count'));
      const originalText = stat.textContent; // Garder le texte original (ex: "60+")
      let hasAnimated = false;

      // Observer pour détecter l'entrée dans le viewport
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !hasAnimated) {
              hasAnimated = true;

              // Animation du compteur
              const animationData = { value: 0 };
              gsap.to(animationData, {
                value: target,
                duration: 0.8,
                ease: 'power3.out',
                onUpdate: function () {
                  const current = Math.round(animationData.value);
                  stat.textContent = current + (originalText.includes('+') ? '+' : '');
                },
                onComplete: function () {
                  stat.textContent = originalText; // Restaurer le texte original
                },
              });

              observer.unobserve(stat);
            }
          });
        },
        {
          threshold: 0.5,
        }
      );

      observer.observe(stat);
    });
  }

  // ========== BACK TO TOP ==========
  initBackToTop() {
    const backToTop = document.getElementById('back-to-top');

    if (backToTop) {
      window.addEventListener('scroll', () => {
        if (window.pageYOffset > 500) {
          backToTop.classList.add('visible');
        } else {
          backToTop.classList.remove('visible');
        }
      });

      backToTop.addEventListener('click', () => {
        this.modules.smoothScroll.scrollTo(0, { duration: 2 });
      });
    }
  }

  // ========== FLOATING CTA ==========
  initFloatingCTA() {
    const floatingCta = document.getElementById('floating-cta');

    if (floatingCta) {
      // Show after scrolling past hero
      window.addEventListener('scroll', () => {
        const heroHeight = document.querySelector('.hero')?.offsetHeight || 600;

        if (window.pageYOffset > heroHeight * 0.7) {
          floatingCta.classList.add('visible');
        } else {
          floatingCta.classList.remove('visible');
        }
      });

      // Smooth scroll to contact
      floatingCta.addEventListener('click', (e) => {
        e.preventDefault();
        const contactSection = document.getElementById('contact');

        if (contactSection && this.modules.smoothScroll) {
          this.modules.smoothScroll.scrollTo(contactSection, {
            offset: -80,
            duration: 1.2,
          });
        }
      });
    }
  }

  // ========== BENTO GRID AUDIO BUTTONS (ROBUST) ==========
  initBentoAudioButtons() {
    const audioButtons = document.querySelectorAll('.case-card__audio-btn[data-scroll-to]');

    audioButtons.forEach((button) => {
      // Initialize aria-pressed
      button.setAttribute('aria-pressed', 'false');

      button.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = button.getAttribute('data-scroll-to');

        // Ignore empty targetId
        if (!targetId || targetId.trim() === '') {
          console.warn('Bento audio button has empty data-scroll-to');
          return;
        }

        const targetSection = document.getElementById(targetId);

        if (targetSection) {
          // Pause all other audio players first
          if (this.modules.audioPlayers?.pauseAll) {
            this.modules.audioPlayers.pauseAll();
          }

          // Update aria-pressed state
          audioButtons.forEach((btn) => btn.setAttribute('aria-pressed', 'false'));
          button.setAttribute('aria-pressed', 'true');

          // Scroll to section
          if (this.modules.smoothScroll) {
            this.modules.smoothScroll.scrollTo(targetSection, {
              offset: -100,
              duration: 1.5,
            });
          } else {
            // Fallback if smooth scroll not available
            targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }

          // Focus on the player after scroll (accessibility)
          setTimeout(() => {
            const player = targetSection.querySelector('[role="region"], audio, [data-audio-player]');
            if (player) {
              player.focus();
            }
          }, 1600); // After scroll duration
        } else {
          console.warn(`Bento audio button target not found: ${targetId}`);
        }
      });
    });
  }

}

const scheduleDribbbleAnimations = () => {
  const loadAnimations = () => import('./dribbble-animations.js').catch((error) => {
    console.warn('Dribbble animations deferred load failed', error);
  });

  if ('requestIdleCallback' in window) {
    requestIdleCallback(loadAnimations, { timeout: 1500 });
  } else {
    setTimeout(loadAnimations, 1200);
  }
};

// ========== INIT APP ==========
document.addEventListener('DOMContentLoaded', () => {
  new App();
  scheduleDribbbleAnimations();
});

// ========== ACCESSIBILITY ==========
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const modal = document.querySelector('.modal.active');
    if (modal) {
      modal.classList.remove('active');
    }

    const menu = document.querySelector('.nav__menu.active');
    if (menu) {
      document.getElementById('nav-toggle')?.setAttribute('aria-expanded', 'false');
      menu.classList.remove('active');
      document.body.style.overflow = '';
    }
  }
});

console.log('🔥 EfSVP Premium Site - Loaded');
