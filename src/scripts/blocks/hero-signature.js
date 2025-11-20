/**
 * =========================================================================
 * Hero Signature Animation - AWWWARDS 2025 PREMIUM GRADE 🏆
 * =========================================================================
 *
 * OBJECTIF : Animation minimaliste et élégante niveau Awwwards/Dribbble
 * Signature manuscrite → Baseline fade in → CTA fade in
 *
 * CARACT\u00c9RISTIQUES PREMIUM :
 * - Animation signature fluide et naturelle
 * - Fade in up subtils et élégants (pas agressifs)
 * - Timings et easings perfectionnés
 * - Accessibilité stricte (prefers-reduced-motion)
 * - Performance optimisée (will-change cleanup)
 *
 * INSPIRATION : Apple.com, Linear, Stripe, Awwwards SOTD
 */

import { gsap } from 'gsap';
import { devLog } from '../utils/logger.js';

/**
 * Initialise l'animation complète du hero
 */
export function initHeroSignature() {
  // ===================================
  // \u00c9TAPE 1 : R\u00c9CUP\u00c9RATION DES \u00c9L\u00c9MENTS
  // ===================================
  const svg = document.querySelector('[data-hero-signature]');
  if (!svg) {
    console.warn('❌ Hero signature SVG not found');
    return;
  }

  const paths = svg.querySelectorAll('.hero-signature-path');
  if (!paths.length) {
    console.warn('❌ Hero signature paths not found');
    return;
  }

  const baseline = document.querySelector('[data-hero-baseline]');
  const cta = document.querySelector('[data-hero-cta]');

  if (!cta) {
    console.warn('❌ Hero CTA not found');
    return;
  }

  // Initialiser l'effet cursor spotlight sur le CTA
  initCursorSpotlight(cta);

  // ===================================
  // \u00c9TAPE 2 : CLASSE D'INITIALISATION
  // ===================================
  // Masquer immédiatement pendant le setup pour éviter le flash
  svg.classList.add('is-initializing');

  // ===================================
  // \u00c9TAPE 3 : V\u00c9RIFIER PREFERS-REDUCED-MOTION
  // ===================================
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Mode sans animation : état final immédiat
  if (prefersReducedMotion) {
    applyFinalState({ paths, baseline, cta, svg });
    return;
  }

  // ===================================
  // \u00c9TAPE 4 : INITIALISATION DES \u00c9TATS
  // ===================================
  // Initialiser tous les paths avec strokeDasharray
  const pathMeta = [];
  paths.forEach((path) => {
    const length = path.getTotalLength();
    path.style.strokeDasharray = `${length}`;
    path.style.strokeDashoffset = `${length}`;
    path.style.fill = 'none';
    pathMeta.push({ path, length });
  });

  devLog('✅ Hero signature initialized', {
    pathCount: pathMeta.length,
    hasBaseline: !!baseline,
    hasCTA: !!cta,
  });

  // ===================================
  // \u00c9TAPE 5 : CR\u00c9ER LA TIMELINE PREMIUM
  // ===================================
  requestAnimationFrame(() => {
    svg.classList.remove('is-initializing');
    createPremiumTimeline({
      pathMeta,
      cta,
      baseline,
      svg,
    });
  });
}

/**
 * Crée la timeline GSAP premium avec animations narratives
 */
function createPremiumTimeline({ pathMeta, cta, baseline, svg }) {
  const masterTL = gsap.timeline({
    defaults: { ease: 'none' },
    delay: 0.4, // Petit délai élégant au chargement
  });

  if (svg) {
    masterTL.fromTo(
      svg,
      { autoAlpha: 0 },
      {
        autoAlpha: 1,
        duration: 1.1,
        ease: 'power2.out',
      },
      0
    );
  }

  // ===================================
  // S\u00c9QUENCE 1 : SIGNATURE S'\u00c9CRIT
  // ===================================
  let signatureDuration = 0;

  pathMeta.forEach(({ path, length }, index) => {
    // Durée adaptée à la longueur du trait
    const duration = gsap.utils.clamp(0.6, 2.0, length / 200);
    const startTime = index * 0.08; // Chevauchement pour fluidité

    masterTL.to(
      path,
      {
        strokeDashoffset: 0,
        duration: duration,
        ease: 'power1.inOut', // Easing naturel pour l'écriture
      },
      startTime
    );

    signatureDuration = Math.max(signatureDuration, startTime + duration);
  });

  devLog('⏱️ Signature duration:', signatureDuration);

  // ===================================
  // S\u00c9QUENCE 2 : BASELINE + CTA FADE IN VIA FROM/TO
  // ===================================
  const heroTextElements = [baseline, cta].filter(Boolean);

  if (heroTextElements.length) {
    masterTL.to(
      heroTextElements,
      {
        autoAlpha: 1, // ✅ autoAlpha handles both opacity AND visibility
        y: 0,
        duration: 1.2,
        ease: 'power3.out',
        stagger: 0.2,
        clearProps: 'willChange', // ✅ Clean up will-change after animation
      },
      signatureDuration + 0.2
    );
  }

  // ===================================
  // S\u00c9QUENCE 4 : CLEANUP PERFORMANCE
  // ===================================
  masterTL.call(() => {
    // Retirer will-change pour optimiser les performances
    pathMeta.forEach(({ path }) => {
      path.style.willChange = 'auto';
    });

    if (baseline) baseline.style.willChange = 'auto';
    if (cta) cta.style.willChange = 'auto';

    devLog('✅ Hero animation complete - Performance cleanup done');
  });

  return masterTL;
}

/**
 * Applique l'état final sans animation (prefers-reduced-motion)
 */
function applyFinalState({ paths, baseline, cta, svg }) {
  // Signature visible immédiatement
  paths.forEach((path) => {
    path.style.strokeDasharray = 'none';
    path.style.strokeDashoffset = '0';
    path.style.fill = 'none';
  });

  // Baseline visible
  if (baseline) {
    gsap.set(baseline, { opacity: 1, y: 0 });
  }

  // CTA visible
  if (cta) {
    gsap.set(cta, { opacity: 1, y: 0 });
  }

  // Retirer la classe d'initialisation
  svg.classList.remove('is-initializing');

  devLog('✅ Hero signature - Final state applied (reduced motion)');
}

/**
 * Initialise l'effet cursor spotlight premium sur un bouton
 * @param {HTMLElement} button - Le bouton sur lequel appliquer l'effet
 */
function initCursorSpotlight(button) {
  if (!button) return;

  // Vérifier si l'utilisateur préfère réduire les animations
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  // Throttle pour optimiser les performances
  let ticking = false;

  button.addEventListener('mousemove', (e) => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Mettre à jour les custom properties CSS
        button.style.setProperty('--mouse-x', `${x}px`);
        button.style.setProperty('--mouse-y', `${y}px`);

        ticking = false;
      });

      ticking = true;
    }
  });

  // Réinitialiser au centre quand la souris quitte le bouton
  button.addEventListener('mouseleave', () => {
    button.style.setProperty('--mouse-x', '50%');
    button.style.setProperty('--mouse-y', '50%');
  });

  devLog('✅ Cursor spotlight initialized on button');
}
