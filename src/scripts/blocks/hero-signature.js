// src/scripts/blocks/hero-signature.js
import { gsap } from 'gsap';

/**
 * =========================================================================
 * Hero Signature Animation - AWWWARDS 2025 PREMIUM GRADE 🏆
 * =========================================================================
 *
 * OBJECTIF : Animation narrative premium niveau Awwwards
 * Signature manuscrite → Goutte bavante → Trainée fluide → Remplissage CTA liquide
 *
 * CARACTÉRISTIQUES PREMIUM :
 * - Goutte apparaît PENDANT l'écriture (60% timeline), pas à la fin
 * - Squash & stretch physique naturel sur la goutte
 * - Trainée SVG qui se dessine simultanément avec la chute
 * - Effet gooey/liquide prononcé pendant le remplissage
 * - Timings et easings perfectionnés
 * - Cohérence physique (gravité, inertie, viscosité)
 * - Accessibilité stricte (prefers-reduced-motion)
 *
 * INSPIRATION : Apple.com, Awwwards SOTD, Studios premium européens
 */

// Mode debug : mettre à true pour logger les étapes
const DEBUG = false;

/**
 * Initialise l'animation complète du hero
 */
export function initHeroSignature() {
  // ===================================
  // ÉTAPE 1 : RÉCUPÉRATION DES ÉLÉMENTS
  // ===================================
  const svg = document.querySelector('[data-hero-signature]');
  if (!svg) {
    if (DEBUG) console.warn('❌ Hero signature SVG not found');
    return;
  }

  const paths = svg.querySelectorAll('.hero-signature-path');
  if (!paths.length) {
    if (DEBUG) console.warn('❌ Hero signature paths not found');
    return;
  }

  const inkDrop = document.querySelector('[data-ink-drop]');
  const inkTrail = document.querySelector('[data-ink-trail]');
  const trailPath = inkTrail?.querySelector('.ink-trail__path');
  const cta = document.querySelector('[data-hero-cta]');
  const ctaInkFill = cta?.querySelector('.hero-cta__ink-fill');
  const ctaLabel = cta?.querySelector('.hero-cta__label');
  const baseline = document.querySelector('[data-hero-baseline]');

  if (!cta || !ctaInkFill) {
    if (DEBUG) console.warn('❌ Hero CTA elements not found');
    return;
  }

  // ===================================
  // ÉTAPE 2 : CLASSE D'INITIALISATION
  // ===================================
  // Masquer immédiatement pendant le setup pour éviter le flash
  svg.classList.add('is-initializing');

  // ===================================
  // ÉTAPE 3 : VÉRIFIER PREFERS-REDUCED-MOTION
  // ===================================
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Mode sans animation : état final immédiat
  if (prefersReducedMotion) {
    applyFinalState({ paths, baseline, inkDrop, trailPath, cta, ctaInkFill, svg });
    return;
  }

  // ===================================
  // ÉTAPE 4 : CALCUL DES POSITIONS DYNAMIQUES
  // ===================================
  // Position de départ de la goutte : milieu de la signature (approximativement lettre "s")
  const signatureRect = svg.getBoundingClientRect();
  const ctaRect = cta.getBoundingClientRect();

  // Point de départ : 55% de la largeur signature (milieu-droit, approximativement au "s")
  const startX = signatureRect.left + signatureRect.width * 0.55;
  const startY = signatureRect.top + signatureRect.height * 0.4; // 40% de hauteur

  // Distance à parcourir
  const dropDistance = ctaRect.top - startY - 40; // -40px pour s'arrêter juste au-dessus du CTA

  if (DEBUG) {
    console.log('📐 Positions calculées:', {
      startX,
      startY,
      dropDistance,
      signatureRect,
      ctaRect,
    });
  }

  // ===================================
  // ÉTAPE 5 : INITIALISATION DES ÉTATS
  // ===================================
  // Baseline visible dès le départ
  if (baseline) {
    gsap.set(baseline, { opacity: 1 });
  }

  // Masquer le CTA au départ
  if (cta) {
    gsap.set(cta, { opacity: 0, y: 20 });
  }

  // Masquer la goutte au départ
  if (inkDrop) {
    gsap.set(inkDrop, {
      opacity: 0,
      scale: 0,
      x: startX,
      y: startY,
    });
  }

  // Masquer le remplissage d'encre du CTA
  gsap.set(ctaInkFill, { scaleY: 0 });

  // Initialiser la trainée SVG (masquée avec strokeDashoffset)
  if (trailPath) {
    const trailLength = trailPath.getTotalLength();
    trailPath.style.strokeDasharray = trailLength;
    trailPath.style.strokeDashoffset = trailLength;
    gsap.set(trailPath, { opacity: 1 });
  }

  // Initialiser tous les paths avec strokeDasharray
  const pathMeta = [];
  paths.forEach((path) => {
    const length = path.getTotalLength();
    path.style.strokeDasharray = `${length}`;
    path.style.strokeDashoffset = `${length}`;
    path.style.fill = 'none';
    pathMeta.push({ path, length });
  });

  if (DEBUG) {
    console.log('✅ Hero signature initialized', {
      pathCount: pathMeta.length,
      hasInkDrop: !!inkDrop,
      hasTrail: !!trailPath,
      hasCTA: !!cta,
    });
  }

  // ===================================
  // ÉTAPE 6 : CRÉER LA TIMELINE PREMIUM
  // ===================================
  requestAnimationFrame(() => {
    svg.classList.remove('is-initializing');
    createPremiumTimeline({
      pathMeta,
      inkDrop,
      trailPath,
      cta,
      ctaInkFill,
      ctaLabel,
      baseline,
      startX,
      startY,
      dropDistance,
    });
  });
}

/**
 * Crée la timeline GSAP premium avec animations narratives
 */
function createPremiumTimeline({
  pathMeta,
  inkDrop,
  trailPath,
  cta,
  ctaInkFill,
  ctaLabel,
  baseline,
  startX,
  startY,
  dropDistance,
}) {
  const masterTL = gsap.timeline({
    defaults: { ease: 'none' },
    delay: 0.4, // Petit délai élégant au chargement
  });

  // ===================================
  // SÉQUENCE 1 : SIGNATURE S'ÉCRIT
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

  if (DEBUG) {
    console.log('⏱️ Signature duration:', signatureDuration);
  }

  // ===================================
  // SÉQUENCE 2 : GOUTTE APPARAÎT (60% de l'écriture - CRITIQUE !)
  // ===================================
  if (inkDrop && trailPath) {
    // La goutte apparaît à 60% de l'animation signature (pas à la fin !)
    const dropStartTime = signatureDuration * 0.6;

    masterTL.fromTo(
      inkDrop,
      {
        opacity: 0,
        scale: 0,
      },
      {
        opacity: 1,
        scale: 1,
        duration: 0.4,
        ease: 'back.out(3)', // Pop élastique
      },
      dropStartTime
    );

    // Bavure initiale : la goutte grossit comme si l'encre s'accumule
    masterTL.to(
      inkDrop,
      {
        scale: 1.4,
        duration: 0.3,
        ease: 'power1.inOut',
        yoyo: true,
        repeat: 1, // Grossit puis revient
      },
      `+=${0.1}`
    );

    // ===================================
    // SÉQUENCE 3 : CHUTE + TRAINÉE (simultanément)
    // ===================================
    const fallTL = gsap.timeline();

    // Goutte tombe avec squash & stretch
    fallTL.to(
      inkDrop,
      {
        y: `+=${dropDistance}`,
        scaleY: 1.6, // Étirement pendant la chute
        scaleX: 0.8, // Compression horizontale
        rotation: 8, // Rotation subtile
        duration: 1.8,
        ease: 'power2.in', // Accélération naturelle (gravité)
      },
      0
    );

    // Trainée se dessine en même temps
    if (trailPath) {
      fallTL.to(
        trailPath,
        {
          strokeDashoffset: 0,
          duration: 1.8,
          ease: 'power2.in', // Même ease que la goutte pour cohérence
        },
        0
      );
    }

    masterTL.add(fallTL, '+=0.2');

    // Le CTA apparaît pendant que la goutte tombe
    masterTL.to(
      cta,
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
      },
      '<+0.4'
    );

    // ===================================
    // SÉQUENCE 4 : IMPACT + REMPLISSAGE LIQUIDE
    // ===================================
    // Squash à l'impact (physique)
    masterTL.to(
      inkDrop,
      {
        scaleY: 0.6, // Écrasement vertical
        scaleX: 1.4, // Expansion horizontale
        rotation: 0,
        duration: 0.15,
        ease: 'power3.out',
      },
      '+=0.1'
    );

    // Activer le filtre goo pour effet liquide
    masterTL.call(
      () => {
        cta.classList.add('is-filling');
        cta.style.filter = 'url(#goo-ink)';
      },
      null,
      '<'
    );

    // Fade out de la goutte (elle "fusionne" avec le CTA)
    masterTL.to(
      inkDrop,
      {
        opacity: 0,
        scale: 2,
        duration: 0.3,
        ease: 'power2.out',
      },
      '<+0.08'
    );

    // Trainée s'estompe
    if (trailPath) {
      masterTL.to(
        trailPath,
        {
          opacity: 0,
          duration: 0.4,
          ease: 'power1.out',
        },
        '<'
      );
    }

    // Remplissage liquide du CTA de bas en haut
    masterTL.fromTo(
      ctaInkFill,
      {
        scaleY: 0,
        transformOrigin: 'bottom center',
      },
      {
        scaleY: 1,
        duration: 1.4,
        ease: 'power3.out', // Easing organique
      },
      '<+0.1'
    );

    // ===================================
    // SÉQUENCE 5 : FINALISATION PREMIUM
    // ===================================
    // Retirer le filtre goo et ajouter is-filled
    masterTL.call(
      () => {
        cta.classList.remove('is-filling');
        cta.classList.add('is-filled');
        cta.style.filter = 'none'; // Retirer le filtre goo
      },
      null,
      '<+0.8'
    );

    // Micro-animation du label CTA (pop subtil)
    if (ctaLabel) {
      masterTL.fromTo(
        ctaLabel,
        {
          scale: 0.98,
          opacity: 0.8,
        },
        {
          scale: 1,
          opacity: 1,
          duration: 0.4,
          ease: 'back.out(1.5)',
        },
        '<-0.2'
      );
    }

    // ===================================
    // SÉQUENCE 6 : CLEANUP PERFORMANCE
    // ===================================
    masterTL.call(() => {
      // Retirer will-change pour optimiser les performances
      pathMeta.forEach(({ path }) => {
        path.style.willChange = 'auto';
      });

      if (inkDrop) inkDrop.style.willChange = 'auto';
      if (ctaInkFill) ctaInkFill.style.willChange = 'auto';
      if (trailPath) trailPath.style.willChange = 'auto';

      if (DEBUG) {
        console.log('✅ Hero animation complete - Performance cleanup done');
      }
    });
  }

  return masterTL;
}

/**
 * Applique l'état final sans animation (prefers-reduced-motion)
 */
function applyFinalState({ paths, baseline, inkDrop, trailPath, cta, ctaInkFill, svg }) {
  // Signature visible immédiatement
  paths.forEach((path) => {
    path.style.strokeDasharray = 'none';
    path.style.strokeDashoffset = '0';
    path.style.fill = 'none';
  });

  // Baseline visible
  if (baseline) {
    gsap.set(baseline, { opacity: 1 });
  }

  // Goutte cachée (pas d'animation)
  if (inkDrop) {
    gsap.set(inkDrop, { opacity: 0 });
  }

  // Trainée cachée
  if (trailPath) {
    gsap.set(trailPath, { opacity: 0 });
  }

  // CTA rempli immédiatement
  if (cta && ctaInkFill) {
    gsap.set(ctaInkFill, { scaleY: 1 });
    cta.classList.add('is-filled');
    gsap.set(cta, { opacity: 1, y: 0 });
  }

  // Retirer la classe d'initialisation
  svg.classList.remove('is-initializing');

  if (DEBUG) {
    console.log('✅ Hero signature - Final state applied (reduced motion)');
  }
}
