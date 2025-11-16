// src/scripts/blocks/hero-signature.js
import { gsap } from 'gsap';

/**
 * Animation de signature manuscrite pour le hero EfSVP.
 *
 * - Le path SVG se "dessine" avec stroke-dashoffset
 * - Une goutte d'encre tombe à la fin
 * - La rigole se remplit à partir de la gauche
 * - La baseline fade-in en douceur
 *
 * Aucune dépendance à ScrollTrigger : animation au chargement uniquement.
 */
export function initHeroSignature() {
  const signaturePath = document.getElementById('hero-signature-path');
  const inkDrop = document.getElementById('hero-ink-drop');
  const inkLine = document.getElementById('hero-ink-line');
  const baseline = document.querySelector('[data-hero-baseline]');

  // Si le hero n'est pas présent sur la page, on ne fait rien
  if (!signaturePath || !inkDrop || !inkLine || !baseline) {
    return;
  }

  // Respecte les préférences utilisateur pour l'animation
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  if (prefersReducedMotion) {
    // État statique lisible
    signaturePath.style.strokeDasharray = 'none';
    signaturePath.style.strokeDashoffset = '0';
    inkDrop.style.opacity = '0';
    inkLine.style.transform = 'scaleX(1)';
    baseline.style.opacity = '1';
    return;
  }

  const length = signaturePath.getTotalLength();

  // État initial
  gsap.set(signaturePath, {
    strokeDasharray: length,
    strokeDashoffset: length,
  });

  gsap.set(inkDrop, {
    opacity: 0,
    scale: 0.6,
    transformOrigin: 'center center',
  });

  gsap.set(inkLine, {
    scaleX: 0,
    transformOrigin: 'left center',
    opacity: 0.9,
  });

  gsap.set(baseline, {
    opacity: 0,
    y: 8,
  });

  const tl = gsap.timeline({
    defaults: {
      ease: 'power2.out',
    },
  });

  // 1) Signature qui s'écrit
  tl.to(signaturePath, {
    strokeDashoffset: 0,
    duration: 2.2,
  })

    // 2) Goutte d'encre qui apparaît et tombe légèrement
    .to(
      inkDrop,
      {
        opacity: 1,
        duration: 0.15,
      },
      '-=0.2'
    )
    .to(inkDrop, {
      y: 14,
      scale: 1.05,
      duration: 0.35,
      ease: 'power3.in',
    })

    // 3) Goutte qui "s'écrase" et disparaît
    .to(inkDrop, {
      scaleX: 1.4,
      scaleY: 0.4,
      opacity: 0,
      duration: 0.25,
      ease: 'power2.inOut',
    })

    // 4) Rigole qui se remplit
    .to(
      inkLine,
      {
        scaleX: 1,
        duration: 0.9,
        ease: 'power2.out',
      },
      '-=0.15'
    )

    // 5) Baseline qui fade-in
    .to(
      baseline,
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
      },
      '-=0.2'
    );
}
