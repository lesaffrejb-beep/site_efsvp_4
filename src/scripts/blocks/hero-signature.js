// src/scripts/blocks/hero-signature.js
import { gsap } from 'gsap';

/**
 * Animation de la signature manuscrite du hero - Version 4.0 (Goutte d'encre + CTA liquide)
 *
 * OBJECTIF :
 * - La signature doit être 100% INVISIBLE au chargement (aucun trait, aucun fragment)
 * - Animation progressive "handwriting" du stroke de gauche à droite
 * - Goutte d'encre qui tombe de la signature vers le CTA
 * - Remplissage liquide du CTA depuis le bas vers le haut
 * - Une seule couche de trait nette (pas de superposition/ghost)
 * - Respect de prefers-reduced-motion
 *
 * NOUVELLE STRUCTURE :
 * - Signature SVG animée
 * - Sous-titre visible dès le départ (pas d'animation)
 * - Goutte d'encre dans .hero-ink-drop-layer
 * - CTA unique avec effet de remplissage liquide
 */

// Mode debug : mettre à true pour logger l'état des paths
const DEBUG = false;

export function initHeroSignature() {
  // ===================================
  // ÉTAPE 1 : RÉCUPÉRATION DES ÉLÉMENTS
  // ===================================
  const svg = document.querySelector('[data-hero-signature]');
  if (!svg) return;

  const paths = svg.querySelectorAll('.hero-signature-path');
  if (!paths.length) return;

  const inkDrop = document.querySelector('[data-hero-ink-drop]');
  const cta = document.querySelector('[data-hero-cta]');
  const ctaInk = cta ? cta.querySelector('.hero-cta__ink-fill') : null;
  const subtitle = document.querySelector('[data-hero-baseline]');

  // ===================================
  // ÉTAPE 2 : CLASSE D'INITIALISATION
  // ===================================
  // Ajouter immédiatement la classe pour masquer les paths pendant le setup
  svg.classList.add('is-initializing');

  // ===================================
  // ÉTAPE 3 : VÉRIFIER PREFERS-REDUCED-MOTION
  // ===================================
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  // Mode sans animation : tout visible immédiatement
  if (prefersReducedMotion) {
    paths.forEach((path) => {
      path.style.strokeDasharray = 'none';
      path.style.strokeDashoffset = '0';
      path.style.fill = 'none';
    });

    if (subtitle) {
      gsap.set(subtitle, { opacity: 1 });
    }

    if (inkDrop) {
      gsap.set(inkDrop, { opacity: 0 });
    }

    if (cta && ctaInk) {
      gsap.set(ctaInk, { scaleY: 1 });
      cta.classList.add('is-filled');
      gsap.set(cta, { opacity: 1, y: 0 });
    }

    svg.classList.remove('is-initializing');
    return;
  }

  // ===================================
  // ÉTAPE 4 : INIT STRICTE DES PATHS
  // ===================================
  // Le sous-titre reste visible (pas d'animation)
  if (subtitle) {
    gsap.set(subtitle, { opacity: 1 });
  }

  // Masquer le CTA au départ
  if (cta) {
    gsap.set(cta, { opacity: 0, y: 20 });
  }

  // Masquer la goutte au départ
  if (inkDrop) {
    gsap.set(inkDrop, {
      opacity: 0,
      y: 0
    });
  }

  // Masquer le remplissage d'encre du CTA
  if (ctaInk) {
    gsap.set(ctaInk, { scaleY: 0 });
  }

  // Initialiser TOUS les paths de manière SYNCHRONE avec leur longueur réelle
  const pathMeta = [];

  paths.forEach((path) => {
    const length = path.getTotalLength();

    // État initial : complètement masqué
    path.style.strokeDasharray = `${length}`;
    path.style.strokeDashoffset = `${length}`;
    path.style.fill = 'none';

    pathMeta.push({ path, length });
  });

  // Debug : logger l'état initial
  if (DEBUG) {
    console.group('Hero signature debug - État initial');
    pathMeta.forEach(({ path, length }, i) => {
      const computed = getComputedStyle(path);
      console.log(`Path #${i}`, {
        length,
        dasharray: computed.strokeDasharray,
        dashoffset: computed.strokeDashoffset,
        fill: computed.fill
      });
    });
    console.groupEnd();
  }

  // ===================================
  // ÉTAPE 5 : RETIRER LA CLASSE ET LANCER L'ANIMATION
  // ===================================
  // Utiliser requestAnimationFrame pour garantir que le navigateur a appliqué les styles
  requestAnimationFrame(() => {
    svg.classList.remove('is-initializing');

    // ===================================
    // ÉTAPE 6 : CRÉER LA TIMELINE GSAP
    // ===================================
    const tl = gsap.timeline({
      defaults: { ease: 'power2.out' },
      delay: 0.3 // Petit délai au chargement
    });

    // Animer chaque path de la signature
    pathMeta.forEach(({ path, length }, index) => {
      // Durée adaptée à la longueur du trait (entre 0.4s et 2s)
      const duration = gsap.utils.clamp(0.4, 2, length / 250);

      // Animer le tracé avec un chevauchement pour fluidité
      tl.to(
        path,
        {
          strokeDashoffset: 0, // Devient visible progressivement
          duration: duration,
          ease: 'power1.inOut'
        },
        index === 0 ? 0 : '>-0.12' // Premier path commence à 0, autres se chevauchent légèrement
      );
    });

    // Label pour marquer la fin de l'écriture de la signature
    tl.addLabel('signatureComplete');

    // ===================================
    // ÉTAPE 7 : ANIMATION DE LA GOUTTE D'ENCRE
    // ===================================
    if (inkDrop && cta && ctaInk) {
      // Apparition de la goutte à la fin de l'écriture
      tl.to(
        inkDrop,
        {
          opacity: 1,
          y: '0%',
          duration: 0.2,
          ease: 'power2.out'
        },
        'signatureComplete+=0.2'
      );

      tl.add('inkDropStart');

      // Chute de la goutte vers le CTA
      tl.to(
        inkDrop,
        {
          opacity: 1,
          y: '120%',
          duration: 0.8,
          ease: 'cubic-bezier(0.5, 0.1, 0.3, 1)'
        },
        'inkDropStart'
      );

      // ===================================
      // ÉTAPE 8 : REMPLISSAGE DU CTA
      // ===================================
      // Le CTA apparaît légèrement avant que la goutte n'arrive
      tl.to(
        cta,
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: 'power2.out'
        },
        'inkDropStart+=0.1'
      );

      // Remplissage liquide du CTA quand la goutte arrive
      tl.to(
        ctaInk,
        {
          scaleY: 1,
          duration: 0.7,
          ease: 'power2.out',
          onComplete: () => {
            cta.classList.add('is-filled');
          }
        },
        'inkDropStart+=0.4'
      );

      // Fade out de la goutte au moment où elle "touche" le CTA
      tl.to(
        inkDrop,
        {
          opacity: 0,
          duration: 0.2,
          ease: 'power1.out'
        },
        'inkDropStart+=0.5'
      );
    }

    // ===================================
    // ÉTAPE 9 : CALLBACK FINAL
    // ===================================
    // Figer l'état final pour garantir qu'il n'y a pas de dérive
    tl.call(() => {
      pathMeta.forEach(({ path }) => {
        path.style.strokeDashoffset = '0';
      });

      // Debug : logger l'état final
      if (DEBUG) {
        console.group('Hero signature debug - État final');
        pathMeta.forEach(({ path, length }, i) => {
          const computed = getComputedStyle(path);
          console.log(`Path #${i}`, {
            length,
            dasharray: computed.strokeDasharray,
            dashoffset: computed.strokeDashoffset,
            fill: computed.fill
          });
        });
        console.groupEnd();
      }
    });
  });
}
