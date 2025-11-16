// src/scripts/blocks/hero-signature.js
import { gsap } from 'gsap';

/**
 * Anime le titre du hero "En français s'il vous plaît"
 * - Split en caractères
 * - Écriture lettre par lettre (stagger)
 * - Respecte prefers-reduced-motion
 */
export function initHeroSignature() {
  const title = document.getElementById('hero-title');
  const baseline = document.querySelector('[data-hero-baseline]');

  if (!title) return;

  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  const originalText = title.textContent;
  const characters = originalText.split('');

  // Nettoyage du contenu initial
  title.textContent = '';

  // Reconstruit le texte avec des <span> par caractère
  characters.forEach((char) => {
    const span = document.createElement('span');
    span.textContent = char;
    title.appendChild(span);
  });

  const letters = title.querySelectorAll('span');

  if (prefersReducedMotion) {
    // Pas d'animation : texte directement visible
    letters.forEach((span) => {
      span.style.opacity = '1';
      span.style.transform = 'none';
    });
    if (baseline) {
      baseline.style.opacity = '1';
      baseline.style.transform = 'none';
    }
    return;
  }

  // État initial pour l'animation
  gsap.set(letters, {
    opacity: 0,
    y: '0.4em',
  });

  if (baseline) {
    gsap.set(baseline, {
      opacity: 0,
      y: 8,
    });
  }

  // Timeline d'animation
  const tl = gsap.timeline({
    defaults: {
      ease: 'power2.out',
    },
  });

  // 1. Animation des lettres (stagger)
  tl.to(letters, {
    opacity: 1,
    y: '0em',
    duration: 0.4,
    ease: 'power2.out',
    stagger: 0.04, // vitesse d'écriture
    delay: 0.2,
  });

  // 2. Baseline qui fade-in après les lettres
  if (baseline) {
    tl.to(
      baseline,
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
      },
      '-=0.3'
    );
  }
}
