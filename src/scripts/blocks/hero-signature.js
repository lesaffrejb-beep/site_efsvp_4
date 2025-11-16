// src/scripts/blocks/hero-signature.js
import { gsap } from 'gsap';

/**
 * Animation de la signature manuscrite du hero
 * - Utilise stroke-dasharray/dashoffset pour dessiner le(s) path(s)
 * - Ajoute un effet goutte d'encre à la fin
 * - Fait apparaître le sous-titre et les CTA
 * - Respecte prefers-reduced-motion
 */
export function initHeroSignature() {
  const svg = document.querySelector('[data-hero-signature]');
  if (!svg) return;

  const paths = svg.querySelectorAll('.hero-signature-path');
  const inkDrop = document.querySelector('.hero-ink-drop');
  const subtitle = document.querySelector('[data-hero-baseline]');
  const ctaButtons = document.querySelectorAll('.hero-cta > *');

  if (!paths.length) return;

  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  if (subtitle) {
    gsap.set(subtitle, { opacity: 0, y: 12 });
  }
  if (ctaButtons.length) {
    gsap.set(ctaButtons, { opacity: 0, y: 12 });
  }
  if (inkDrop) {
    gsap.set(inkDrop, { transformOrigin: '50% 50%', opacity: 0 });
  }

  if (prefersReducedMotion) {
    // Pas d'animation : tout visible directement
    paths.forEach((path) => {
      path.style.strokeDasharray = 'none';
      path.style.strokeDashoffset = '0';
    });
    if (subtitle) {
      subtitle.style.opacity = '1';
      subtitle.style.transform = 'none';
    }
    if (ctaButtons.length) {
      ctaButtons.forEach((btn) => {
        btn.style.opacity = '1';
        btn.style.transform = 'none';
      });
    }
    return;
  }

  // Timeline principale pour orchestrer l'animation
  const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

  // Animation de chaque path (signature manuscrite)
  paths.forEach((path, index) => {
    const length = path.getTotalLength();
    // Durée adaptée à la longueur du path, avec des limites raisonnables
    const duration = gsap.utils.clamp(0.3, 1.8, length / 200);

    // État initial : rien n'est dessiné
    gsap.set(path, {
      strokeDasharray: length,
      strokeDashoffset: length,
      opacity: 1,
    });

    // Animer le tracé avec un timing plus naturel
    // Les paths se succèdent avec un léger chevauchement pour un effet d'écriture fluide
    tl.to(
      path,
      {
        strokeDashoffset: 0,
        duration,
        ease: 'power1.inOut',
      },
      index === 0 ? 0.2 : '>-0.15' // Chevauchement léger pour effet manuscrit naturel
    );
  });

  tl.addLabel('signatureComplete');

  // Effet goutte d'encre (apparaît à la fin du tracé)
  if (inkDrop) {
    tl.fromTo(
      inkDrop,
      { opacity: 0, scale: 0.4, y: -16 },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.4,
        ease: 'back.out(2.2)',
      },
      'signatureComplete-=0.05'
    ).to(
      inkDrop,
      {
        y: 18,
        scaleY: 0.85,
        opacity: 1,
        duration: 0.45,
        ease: 'power1.in',
      },
      '>-0.1'
    );
  }

  // Apparition du sous-titre
  if (subtitle) {
    tl.fromTo(
      subtitle,
      { opacity: 0, y: 10 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
      },
      '>-0.15'
    );
  }

  // Apparition des boutons CTA avec stagger
  if (ctaButtons.length) {
    tl.fromTo(
      ctaButtons,
      { opacity: 0, y: 10 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.1,
        duration: 0.45,
      },
      '<+0.1'
    );
  }
}
