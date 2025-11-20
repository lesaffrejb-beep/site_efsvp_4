/**
 * DRIBBBLE-GRADE ANIMATIONS
 * Scroll reveals, micro-interactions, et animations premium
 */

import { devLog } from './utils/logger.js';

// ========================================
// 1. SCROLL REVEAL ANIMATIONS
// ========================================

const initScrollReveal = () => {
  // Observer pour détecter les éléments visibles
  const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        // Une fois visible, on arrête d'observer (performance)
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observer tous les éléments avec data-scroll
  const elementsToReveal = document.querySelectorAll('[data-scroll]');
  elementsToReveal.forEach((el) => observer.observe(el));
};

// ========================================
// 2. NAVBAR SCROLL BEHAVIOR
// ========================================

const initNavbarScroll = () => {
  const nav = document.querySelector('.nav');
  if (!nav) return;

  const threshold = 50;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    // Ajouter une classe quand on scroll
    if (currentScroll > threshold) {
      nav.classList.add('nav--scrolled');
    } else {
      nav.classList.remove('nav--scrolled');
    }

    // Hide/show navbar on scroll (optionnel)
    // if (currentScroll > lastScroll && currentScroll > 200) {
    //   nav.style.transform = 'translateY(-100%)';
    // } else {
    //   nav.style.transform = 'translateY(0)';
    // }
  });
};

// ========================================
// 3. SMOOTH SCROLL POUR ANCRES
// ========================================

const initSmoothScroll = () => {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');

      // Ignorer les ancres vides ou # seulement
      if (!href || href === '#') return;

      const targetId = href.substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        e.preventDefault();

        const navHeight = document.querySelector('.nav')?.offsetHeight || 60;
        const targetPosition = targetElement.offsetTop - navHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });

        // Fermer le menu mobile si ouvert
        const navMenu = document.getElementById('nav-menu');
        const navToggle = document.getElementById('nav-toggle');
        const navOverlay = document.querySelector('[data-nav-overlay]');
        if (navMenu && navMenu.classList.contains('nav__menu--open')) {
          navMenu.classList.remove('nav__menu--open');
          navToggle?.setAttribute('aria-expanded', 'false');
          navOverlay?.classList.remove('nav__overlay--visible');

          // Fallback scroll restore if nav menu was locking the body
          const lockedOffset = parseInt(document.body.style.top || '0', 10);
          document.body.classList.remove('nav--open');
          document.body.style.position = '';
          document.body.style.top = '';
          document.body.style.width = '';

          if (!Number.isNaN(lockedOffset) && lockedOffset !== 0) {
            window.scrollTo(0, Math.abs(lockedOffset));
          }
        }
      }
    });
  });
};

// ========================================
// 4. PARALLAX SUBTIL POUR HERO
// ========================================

const initParallax = () => {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  const heroHeight = hero.offsetHeight || window.innerHeight;

  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const progress = Math.min(scrolled / heroHeight, 1);
    const translate = Math.max(-18, -progress * 24);

    // Déplacer légèrement le contenu vers le haut au scroll sans dépasser la section suivante
    if (scrolled < heroHeight) {
      hero.style.transform = `translateY(${translate}px)`;
      hero.style.opacity = 1 - progress * 0.5;
    } else {
      hero.style.transform = 'translateY(0)';
      hero.style.opacity = 0.5;
    }
  });
};

// ========================================
// 5. HOVER EFFECTS POUR CARDS
// ========================================

const initCardEffects = () => {
  const cards = document.querySelectorAll('.promise-card, .offer-card, .project-card, .testimonial-card');

  cards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
      this.style.transform = 'translateY(-4px)';
      this.style.boxShadow = 'var(--shadow-lg)';
    });

    card.addEventListener('mousemove', function() {
      this.style.transform = 'translateY(-4px)';
    });

    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
      this.style.boxShadow = '';
    });
  });
};

// ========================================
// 6. FAQ ACCORDION AMÉLIORATION
// ========================================

const initFAQ = () => {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-item__question');
    const answer = item.querySelector('.faq-item__answer');
    const icon = item.querySelector('.faq-item__icon');

    if (!question || !answer) return;

    // Initialiser avec max-height 0
    answer.style.maxHeight = '0';
    answer.style.overflow = 'hidden';
    answer.style.transition = 'max-height 0.3s ease, padding 0.3s ease';

    question.addEventListener('click', () => {
      const isOpen = question.getAttribute('aria-expanded') === 'true';

      // Fermer tous les autres items
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          const otherQuestion = otherItem.querySelector('.faq-item__question');
          const otherAnswer = otherItem.querySelector('.faq-item__answer');
          const otherIcon = otherItem.querySelector('.faq-item__icon');

          otherQuestion?.setAttribute('aria-expanded', 'false');
          if (otherAnswer) {
            otherAnswer.style.maxHeight = '0';
            otherAnswer.style.paddingTop = '0';
          }
          if (otherIcon) {
            otherIcon.style.transform = 'rotate(0deg)';
          }
        }
      });

      // Toggle l'item actuel
      if (isOpen) {
        question.setAttribute('aria-expanded', 'false');
        answer.style.maxHeight = '0';
        answer.style.paddingTop = '0';
        if (icon) icon.style.transform = 'rotate(0deg)';
      } else {
        question.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = answer.scrollHeight + 'px';
        answer.style.paddingTop = '16px';
        if (icon) icon.style.transform = 'rotate(180deg)';
      }
    });
  });
};

// ========================================
// 7. BUTTON RIPPLE EFFECT
// ========================================

const initButtonRipple = () => {
  const buttons = document.querySelectorAll('.cta, .btn');

  buttons.forEach(button => {
    button.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();

      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';
      ripple.classList.add('ripple');

      // Styles inline pour l'effet
      ripple.style.position = 'absolute';
      ripple.style.borderRadius = '50%';
      ripple.style.background = 'rgba(255, 255, 255, 0.6)';
      ripple.style.transform = 'scale(0)';
      ripple.style.animation = 'ripple 0.6s ease-out';
      ripple.style.pointerEvents = 'none';

      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });
};

// ========================================
// 8. LAZY LOADING IMAGES
// ========================================

const initLazyLoading = () => {
  const images = document.querySelectorAll('img[data-src]');

  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        imageObserver.unobserve(img);
      }
    });
  });

  images.forEach(img => imageObserver.observe(img));
};

// ========================================
// 9. PRÉLOADER ENHANCEMENT
// ========================================

const initPreloader = () => {
  // DÉSACTIVÉ - Géré par main.js pour éviter les conflits
  // Le preloader est maintenant géré uniquement par main.js:handlePreloader()
  return;

  /* ANCIEN CODE - DÉSACTIVÉ
  const preloader = document.getElementById('preloader');
  if (!preloader) return;

  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('hidden');

      // Activer les animations après le chargement
      document.body.style.overflow = 'visible';

      // Trigger scroll reveal immédiatement pour éléments visibles
      setTimeout(() => {
        window.dispatchEvent(new Event('scroll'));
      }, 100);
    }, 800); // Délai pour effet premium
  });
  */
};

// ========================================
// 10. CURSOR PERSONNALISÉ (Optionnel)
// ========================================

// const initCustomCursor = () => {
//   // Désactivé par défaut - Activer si souhaité
//   return;
// };

// ========================================
// 11. BACK TO TOP BUTTON
// ========================================

const initBackToTop = () => {
  const backToTopBtn = document.getElementById('back-to-top');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 500) {
      backToTopBtn.style.opacity = '1';
      backToTopBtn.style.pointerEvents = 'auto';
    } else {
      backToTopBtn.style.opacity = '0';
      backToTopBtn.style.pointerEvents = 'none';
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
};

// ========================================
// 12. PERFORMANCE MONITORING
// ========================================

const logPerformance = () => {
  if (window.performance && window.performance.timing) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        const connectTime = perfData.responseEnd - perfData.requestStart;
        const renderTime = perfData.domComplete - perfData.domLoading;

        devLog('🎨 Dribbble-Grade Performance Metrics:');
        devLog(`⏱️  Page Load Time: ${pageLoadTime}ms`);
        devLog(`🔌 Connect Time: ${connectTime}ms`);
        devLog(`🎭 Render Time: ${renderTime}ms`);

        // Objectif: < 2000ms pour Dribbble-grade
        if (pageLoadTime < 2000) {
          devLog('✅ Dribbble-grade performance achieved!');
        } else {
          console.warn('⚠️  Performance optimization needed');
        }
      }, 0);
    });
  }
};

// ========================================
// INITIALISATION AU CHARGEMENT
// ========================================

const initDribbbleGrade = () => {
  devLog('🎨 Initializing Dribbble-Grade animations...');

  const isMainAppActive = Boolean(window.__EFVSP_APP_ACTIVE);

  if (!isMainAppActive) {
    // Core animations (legacy)
    initScrollReveal();
    initNavbarScroll();
    initSmoothScroll();
    initFAQ();

    // Utilities
    initLazyLoading();
    initPreloader();
    initBackToTop();
  }

  // Enhancement animations
  initParallax();
  initCardEffects();
  initButtonRipple();

  // Performance
  logPerformance();

  devLog('✨ Dribbble-Grade ready!');
};

// Démarrer quand le DOM est prêt
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initDribbbleGrade);
} else {
  initDribbbleGrade();
}

// Export pour utilisation modulaire
export {
  initScrollReveal,
  initNavbarScroll,
  initSmoothScroll,
  initParallax,
  initCardEffects,
  initFAQ,
  initButtonRipple,
  initLazyLoading,
  initPreloader,
  initBackToTop
};
