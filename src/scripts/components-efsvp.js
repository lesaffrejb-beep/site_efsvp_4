/**
 * EfSVP — Composants Interactions
 * Animations, formulaire, tracking
 */

import { devLog } from './utils/logger.js';

// ===== FADE-IN PROGRESSIF AU SCROLL =====
function initScrollReveal() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px',
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Appliquer à toutes les sections
  document.querySelectorAll('section').forEach((section) => {
    section.classList.add('fade-in');
    observer.observe(section);
  });

  // Appliquer aux cards individuelles avec délai progressif
  document.querySelectorAll('.promise-card, .offer-card, .process-step').forEach((card, index) => {
    card.style.transitionDelay = `${index * 0.1}s`;
  });
}

// ===== VALIDATION FORMULAIRE CONTACT =====
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  // Validation temps réel
  const inputs = form.querySelectorAll('.form-input');
  inputs.forEach((input) => {
    input.addEventListener('blur', () => {
      const parent = input.closest('.form-group');

      if (input.validity.valid) {
        parent.classList.remove('error');
      } else {
        parent.classList.add('error');
      }
    });

    // Retirer l'erreur quand l'utilisateur tape
    input.addEventListener('input', () => {
      const parent = input.closest('.form-group');
      if (input.value.length > 0) {
        parent.classList.remove('error');
      }
    });
  });

  // Soumission formulaire
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);

    // État submitting
    form.classList.add('submitting');

    try {
      // Remplacer par votre endpoint
      const response = await fetch('/api/contact', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        form.classList.remove('submitting');
        form.classList.add('success');
        form.reset();

        // Afficher message de succès
        showSuccessMessage('Merci ! Nous vous répondrons sous 72h.');
      } else {
        throw new Error("Erreur lors de l'envoi");
      }
    } catch {
      form.classList.remove('submitting');
      showErrorMessage(
        'Une erreur est survenue. Veuillez réessayer ou nous contacter directement.'
      );
    }
  });
}

// ===== MESSAGES DE FEEDBACK =====
function showSuccessMessage(message) {
  const alertDiv = document.createElement('div');
  alertDiv.className = 'alert alert--success';
  alertDiv.textContent = message;
  alertDiv.style.cssText = `
    position: fixed;
    top: 24px;
    right: 24px;
    background: #4caf50;
    color: white;
    padding: 16px 24px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 10000;
    animation: slideIn 0.3s ease;
  `;

  document.body.appendChild(alertDiv);

  setTimeout(() => {
    alertDiv.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => alertDiv.remove(), 300);
  }, 5000);
}

function showErrorMessage(message) {
  const alertDiv = document.createElement('div');
  alertDiv.className = 'alert alert--error';
  alertDiv.textContent = message;
  alertDiv.style.cssText = `
    position: fixed;
    top: 24px;
    right: 24px;
    background: #f44336;
    color: white;
    padding: 16px 24px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 10000;
    animation: slideIn 0.3s ease;
  `;

  document.body.appendChild(alertDiv);

  setTimeout(() => {
    alertDiv.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => alertDiv.remove(), 300);
  }, 5000);
}

// ===== SMOOTH SCROLL POUR LES ANCRES =====
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;

      e.preventDefault();
      const target = document.querySelector(href);
      if (!target) return;

      const headerOffset = 80;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    });
  });
}

// ===== TRACKING ÉVÉNEMENTS (GA4 optionnel) =====
function trackEvent(eventName, eventParams = {}) {
  if (typeof gtag === 'function') {
    gtag('event', eventName, eventParams);
  }
}

function initTracking() {
  // CTA clics
  document.querySelectorAll('.cta--primary, .cta--secondary').forEach((cta) => {
    cta.addEventListener('click', () => {
      const section = cta.closest('section');
      trackEvent('cta_click', {
        cta_position: section ? section.className : 'unknown',
        cta_text: cta.textContent.trim(),
      });
    });
  });

  // Soumission formulaire
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', () => {
      trackEvent('form_submit', {
        form_name: 'contact',
      });
    });
  }

  // Scroll depth
  const scrollDepths = [25, 50, 75, 100];
  const trackedDepths = [];

  window.addEventListener('scroll', () => {
    const scrollPercent =
      (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;

    scrollDepths.forEach((depth) => {
      if (scrollPercent >= depth && !trackedDepths.includes(depth)) {
        trackedDepths.push(depth);
        trackEvent('scroll_depth', {
          percent: depth,
        });
      }
    });
  });
}

// ===== ANIMATIONS KEYFRAMES =====
function addAnimationStyles() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    @keyframes slideOut {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(100%);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
}

// ===== INITIALISATION =====
function initComponentsEfsvp() {
  if (window.__EFVSP_APP_ACTIVE) {
    return;
  }

  addAnimationStyles();
  initScrollReveal();
  initContactForm();
  initSmoothScroll();
  initTracking();

  devLog('✅ EfSVP Components initialized');
}

// Auto-init au chargement du DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initComponentsEfsvp);
} else {
  initComponentsEfsvp();
}

// Export pour utilisation modulaire
export { initComponentsEfsvp, trackEvent };
