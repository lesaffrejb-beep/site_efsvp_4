// src/scripts/blocks/hero-signature.js
import { gsap } from 'gsap';

/**
 * Animation de la signature manuscrite du hero
 * - Utilise stroke-dasharray/dashoffset pour dessiner le path
 * - Ajoute un effet goutte d'encre à la fin
 * - Fait apparaître le sous-titre
 * - Respecte prefers-reduced-motion
 */
export function initHeroSignature() {
  const svg = document.querySelector('[data-hero-signature]');
  if (!svg) return;

  const path = svg.querySelector('.hero-signature-path');
  const inkDrop = document.querySelector('.hero-ink-drop');
  const subtitle = document.querySelector('[data-hero-baseline]');

  if (!path) return;

  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  if (prefersReducedMotion) {
    // Pas d'animation : tout visible directement
    path.style.strokeDasharray = 'none';
    path.style.strokeDashoffset = '0';
    if (subtitle) {
      subtitle.style.opacity = '1';
      subtitle.style.transform = 'none';
    }
    return;
  }

  // Calculer la longueur totale du path
  const length = path.getTotalLength();

  // État initial : rien n'est dessiné
  path.style.strokeDasharray = length;
  path.style.strokeDashoffset = length;
  path.style.opacity = '1';

  // Animation du tracé (écriture de la signature)
  gsap.fromTo(
    path,
    { strokeDashoffset: length },
    {
      strokeDashoffset: 0,
      duration: 3.2,
      ease: 'power2.out',
      delay: 0.3,
    }
  );

  // Effet goutte d'encre (apparaît à la fin du tracé)
  if (inkDrop) {
    gsap.fromTo(
      inkDrop,
      { opacity: 0, scale: 0.2, y: -8 },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        delay: 3.0,
        duration: 0.4,
        ease: 'back.out(2)',
      }
    );
  }

  // Apparition du sous-titre
  if (subtitle) {
    gsap.fromTo(
      subtitle,
      { opacity: 0, y: 8 },
      {
        opacity: 1,
        y: 0,
        delay: 3.1,
        duration: 0.6,
        ease: 'power2.out',
      }
    );
  }
}
