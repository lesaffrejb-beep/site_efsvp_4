// src/scripts/blocks/hero-signature.js
import { gsap } from 'gsap';

/**
 * Animation de la signature manuscrite du hero - Version 2.0
 *
 * OBJECTIF :
 * - La signature doit être INVISIBLE au chargement
 * - Animation progressive "handwriting" du stroke
 * - Goutte d'encre qui tombe de la signature vers le sous-titre
 * - Révélation du sous-titre synchronisée avec la goutte
 * - Respect de prefers-reduced-motion
 *
 * STRUCTURE :
 * - Tous les paths de la signature sont initialement invisibles (strokeDashoffset = length)
 * - Pas de fill, uniquement stroke animé
 * - La goutte apparaît à la fin de l'écriture et tombe vers le sous-titre
 * - Le sous-titre se révèle quand la goutte "touche" la ligne
 */
export function initHeroSignature() {
  // Sélecteurs
  const svg = document.querySelector('[data-hero-signature]');
  if (!svg) return;

  const paths = svg.querySelectorAll('.hero-signature-path');
  const inkDrop = document.querySelector('.hero-ink-drop');
  const subtitle = document.querySelector('[data-hero-baseline]');
  const ctaButtons = document.querySelectorAll('.hero-cta > *');

  if (!paths.length) return;

  // Vérifier prefers-reduced-motion
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  // Mode sans animation : tout visible immédiatement
  if (prefersReducedMotion) {
    paths.forEach((path) => {
      path.style.strokeDasharray = 'none';
      path.style.strokeDashoffset = '0';
    });
    if (subtitle) {
      gsap.set(subtitle, { opacity: 1, y: 0 });
    }
    if (ctaButtons.length) {
      gsap.set(ctaButtons, { opacity: 1, y: 0 });
    }
    if (inkDrop) {
      gsap.set(inkDrop, { opacity: 0 }); // Pas de goutte en mode réduit
    }
    return;
  }

  // ===================================
  // ÉTAPE 1 : ÉTAT INITIAL
  // ===================================

  // Masquer le sous-titre et les CTA au départ
  if (subtitle) {
    gsap.set(subtitle, {
      opacity: 0,
      clipPath: 'inset(0 0 100% 0)' // Masqué du bas
    });
  }
  if (ctaButtons.length) {
    gsap.set(ctaButtons, { opacity: 0, y: 20 });
  }

  // Masquer la goutte au départ
  if (inkDrop) {
    gsap.set(inkDrop, {
      opacity: 0,
      scale: 0.4,
      y: 0 // Position initiale juste après la signature
    });
  }

  // ===================================
  // ÉTAPE 2 : ANIMATION DES PATHS
  // ===================================

  // Timeline principale
  const tl = gsap.timeline({
    defaults: { ease: 'power2.out' },
    delay: 0.3 // Petit délai au chargement
  });

  // CRITIQUE : Initialiser TOUS les paths comme INVISIBLES AVANT l'animation
  paths.forEach((path) => {
    const length = path.getTotalLength();
    // Forcer les propriétés immédiatement sans transition
    path.style.transition = 'none';
    path.style.strokeDasharray = `${length}`;
    path.style.strokeDashoffset = `${length}`;
    // Forcer un reflow pour s'assurer que les changements sont appliqués
    path.getBoundingClientRect();
  });

  // Animer chaque path de la signature
  paths.forEach((path, index) => {
    const length = path.getTotalLength();

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
  // ÉTAPE 3 : ANIMATION DE LA GOUTTE
  // ===================================

  if (inkDrop && subtitle) {
    // Apparition de la goutte à la fin de l'écriture
    tl.to(
      inkDrop,
      {
        opacity: 1,
        y: 10,
        duration: 0.25,
        ease: 'power2.out'
      },
      'signatureComplete-=0.1'
    );

    // Chute de la goutte avec déformation
    tl.to(
      inkDrop,
      {
        y: 22,
        scaleY: 0.8,
        scaleX: 1.05,
        duration: 0.18,
        ease: 'power1.in'
      },
      '>-0.05'
    );

    // Dissolution de la goutte
    tl.to(
      inkDrop,
      {
        opacity: 0,
        duration: 0.2,
        ease: 'power1.out'
      },
      '-=0.05'
    );
  }

  // ===================================
  // ÉTAPE 4 : RÉVÉLATION DU SOUS-TITRE
  // ===================================

  if (subtitle) {
    // Le sous-titre se révèle quand la goutte "touche" la ligne
    tl.to(
      subtitle,
      {
        opacity: 1,
        clipPath: 'inset(0 0 0% 0)', // Révélation de haut en bas
        duration: 0.8,
        ease: 'power2.out'
      },
      inkDrop ? '>-0.6' : 'signatureComplete+=0.2' // Synchronisé avec l'impact de la goutte
    );
  }

  // ===================================
  // ÉTAPE 5 : APPARITION DES CTA
  // ===================================

  if (ctaButtons.length) {
    tl.to(
      ctaButtons,
      {
        opacity: 1,
        y: 0,
        stagger: 0.12,
        duration: 0.5,
        ease: 'power2.out'
      },
      '>-0.3' // Légèrement avant la fin de la révélation du sous-titre
    );
  }
}
