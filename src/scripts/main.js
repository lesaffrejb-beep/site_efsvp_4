/**
 * ============================================
 * EfSVP - AWWWARDS-GRADE MAIN APP PREMIUM
 * Architecture modulaire ES6 avec error handling
 * Performance optimisée Lighthouse > 95
 * ============================================
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SmoothScroll } from './modules/smoothScroll.js';
import { CursorManager } from './modules/cursor.js';
import { MagneticButtons } from './modules/magnetic.js';
import { ErrorHandler } from './modules/errorHandler.js';
import { LazyLoadManager } from './modules/lazyLoad.js';
import { FormValidator } from './modules/formValidator.js';
import { AnimationsManager } from './modules/animations.js';
import { ProgressBar } from './modules/progressBar.js';
import { ProgressiveNav } from './modules/progressiveNav.js';
import { ProcessReveal } from './modules/processReveal.js';
import { CookieConsent } from './modules/cookieConsent.js';
import { CopyEmail } from './modules/copyEmail.js';
import { ProjectModal } from './modules/projectModal.js';
import { FAQ } from './modules/faq.js';
import { initHeroBlock } from './blocks/hero.js';
import { initAudioBlock } from './blocks/audio.js';
import { initPortfolioBlock } from './blocks/portfolio.js';
import { initTestimonialsBlock } from './blocks/testimonials.js';
import { initAllContent } from './content-init.js';
import { initPremiumHero } from './modules/premiumHero.js';
import { initPremiumHeroAnimations } from './modules/premiumHeroAnimations.js';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

/* ==== ANTI-VEIL FAILSAFE (final) ==== */
const antiVeilFailsafe = () => {
  ['html', 'body', 'main', '#app', '#main'].forEach((sel) => {
    const el = document.querySelector(sel);
    if (el) {
      el.style.opacity = '1';
      el.style.filter = 'none';
      el.style.mixBlendMode = 'normal';
      el.style.backdropFilter = 'none';
    }
  });
  document.body?.classList?.remove('dim', 'overlay', 'veil', 'backdrop', 'blurred');
  document.querySelectorAll('[data-scroll]').forEach((el) => {
    const opacity = parseFloat(window.getComputedStyle(el).opacity);
    if (!Number.isNaN(opacity) && opacity < 1) {
      el.style.opacity = '1';
      el.style.transform = 'none';
    }
  });
};
// appliquer tout de suite + en fin de chargement
antiVeilFailsafe();
window.addEventListener('load', antiVeilFailsafe);
// ré-appliquer périodiquement si GSAP tourne (sécurité)
if (window.gsap && window.gsap.ticker) {
  window.gsap.ticker.add(() => {
    if (window.gsap.ticker.frame % 60 === 0) antiVeilFailsafe(); // ~1 fois/s
  });
}

// ============================================
// APP CLASS - Orchestration Premium
// ============================================
class App {
  constructor() {
    this.modules = {};
    this.isMobile = window.innerWidth < 1024;
    this.isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;

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
      this.initCore();

      // 5. Section modules
      this.initSections();

      // 6. Animations premium
      this.initAnimations();

      // 7. Start
      this.start();

      console.log('✅ EfSVP Premium Site - Loaded successfully');
    } catch (error) {
      console.error('❌ Critical initialization error:', error);
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

    // Wait for page load
    await new Promise((resolve) => {
      if (document.readyState === 'complete') {
        resolve();
      } else {
        window.addEventListener('load', resolve);
      }
    });

    // Min display time
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Hide preloader
    if (preloader) {
      preloader.classList.add('hidden');
      setTimeout(() => preloader.remove(), 500);
    }

    document.body.classList.add('loaded');
  }

  initCore() {
    // Cookie Consent (RGPD/CNIL) - Initialize early
    this.modules.cookieConsent = new CookieConsent();

    // Smooth Scroll (Lenis)
    this.modules.smoothScroll = new SmoothScroll();
    window.lenis = this.modules.smoothScroll.lenis; // Global access

    // Reading Progress Bar Premium (REMPLACÉ par ProgressiveNav)
    // this.modules.progressBar = new ProgressBar();

    // Progressive Navigation avec barre de scroll
    this.modules.progressiveNav = new ProgressiveNav();

    // Custom Cursor (desktop only)
    if (!this.isMobile) {
      this.modules.cursor = new CursorManager();
    }

    // Magnetic Buttons
    if (!this.isMobile) {
      this.modules.magnetic = new MagneticButtons();
    }

    // Navigation mobile
    this.initNavigation();

    // Scroll Reveal global
    this.initScrollReveal();
  }

  initSections() {
    // Initialize Premium Hero 3D + Animations
    const premiumHeroInstance = initPremiumHero();
    const premiumHeroAnimationsInstance = initPremiumHeroAnimations();

    if (premiumHeroInstance) {
      this.modules.premiumHero = premiumHeroInstance;
    }
    if (premiumHeroAnimationsInstance) {
      this.modules.premiumHeroAnimations = premiumHeroAnimationsInstance;
    }

    const heroContext = initHeroBlock({ modules: this.modules });
    this.modules = heroContext.modules;

    const audioContext = initAudioBlock(heroContext);
    this.modules = audioContext.modules;

    // Process Reveal Animation
    this.modules.processReveal = new ProcessReveal();

    // Portfolio filters
    initPortfolioBlock();

    // Project Modal
    this.modules.projectModal = new ProjectModal();

    // Testimonials carousel
    const testimonialsInstance = initTestimonialsBlock();
    if (testimonialsInstance) {
      this.modules.testimonials = testimonialsInstance;
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
    this.modules.hero?.start();

    // Performance monitoring
    this.logPerformanceMetrics();
  }

  /**
   * Handle critical initialization errors
   */
  handleCriticalError(error) {
    console.error('Critical app error:', error);

    // Show user-friendly error message
    const errorOverlay = document.createElement('div');
    errorOverlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(15, 21, 29, 0.95);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 99999;
      color: #EAECEF;
    `;

    errorOverlay.innerHTML = `
      <div style="text-align: center; padding: 48px; max-width: 500px;">
        <svg style="width: 80px; height: 80px; color: #B8441E; margin-bottom: 24px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <h2 style="font-size: 32px; margin-bottom: 16px;">Une erreur est survenue</h2>
        <p style="color: #9AA3AE; margin-bottom: 32px;">Nous nous excusons pour la gêne occasionnée.</p>
        <button
          onclick="location.reload()"
          style="
            padding: 16px 48px;
            background: #B8441E;
            color: white;
            border: none;
            border-radius: 100px;
            font-size: 18px;
            font-weight: 600;
            cursor: pointer;
          "
        >
          Recharger la page
        </button>
      </div>
    `;

    document.body.appendChild(errorOverlay);
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
      // Initialiser l'état fermé du menu mobile
      navMenu.setAttribute('aria-hidden', 'true');

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
        navMenu.classList.remove('active');
        navMenu.setAttribute('aria-hidden', 'true');
        navOverlay?.classList.remove('is-active');
        navOverlay?.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('menu-open');
        document.body.style.overflow = '';
      };

      const openMenu = () => {
        navToggle.setAttribute('aria-expanded', 'true');
        navToggle.setAttribute('aria-label', 'Fermer le menu');
        navMenu.classList.add('active');
        navMenu.setAttribute('aria-hidden', 'false');
        navOverlay?.classList.add('is-active');
        navOverlay?.setAttribute('aria-hidden', 'false');
        document.body.classList.add('menu-open');
        document.body.style.overflow = 'hidden';

        updateFocusableElements();
        setTimeout(() => firstFocusable?.focus(), 100);
      };

      navToggle.addEventListener('click', () => {
        const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';

        if (isExpanded) {
          closeMenu();
          navToggle.focus();
        } else {
          openMenu();
        }
      });

      navOverlay?.addEventListener('click', closeMenu);

      document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && navMenu.classList.contains('active')) {
          event.preventDefault();
          closeMenu();
          navToggle.focus();
        }
      });

      // Focus trap: empêcher Tab de sortir du menu mobile
      navMenu.addEventListener('keydown', (e) => {
        if (e.key !== 'Tab' || !navMenu.classList.contains('active')) return;

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

  // ========== CONTACT FORM PREMIUM ==========
  initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    // Initialize premium form validator
    this.modules.formValidator = new FormValidator(form);

    // Quick quote form (mini-formulaire)
    this.initQuickQuoteForm();
  }

  // ========== QUICK QUOTE FORM ==========
  initQuickQuoteForm() {
    const quickForm = document.getElementById('quick-quote-form');
    if (!quickForm) return;

    quickForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const formData = new FormData(quickForm);
      const data = {
        nom: formData.get('nom'),
        organisation: formData.get('organisation'),
        email: formData.get('email'),
        formule: formData.get('formule'),
        source: 'quick-quote-form',
      };

      // In a real implementation, send to backend
      console.log('Quick quote form submitted:', data);

      // Reset form
      quickForm.reset();
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

// ========== INIT APP ==========
document.addEventListener('DOMContentLoaded', () => {
  new App();
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
