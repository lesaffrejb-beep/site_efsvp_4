import { gsap } from 'gsap';

/**
 * Animation du hero avec signature manuscrite
 * Timeline : signature → goutte → rigole → baseline
 */
export function initHeroSignature() {
  // Sélection des éléments
  const signaturePath = document.getElementById('signature-path');
  const inkDrop = document.getElementById('ink-drop');
  const inkFill = document.getElementById('ink-fill');
  const baseline = document.getElementById('baseline');
  const signatureSvg = document.getElementById('signature-svg');

  // Guard clause
  if (!signaturePath || !inkDrop || !inkFill || !baseline) {
    console.warn('Hero signature : éléments manquants');
    return;
  }

  // Timeline principale avec orchestration complète
  const masterTimeline = gsap.timeline({
    defaults: {
      ease: 'none'
    },
    onComplete: () => {
      console.log('✓ Animation hero terminée');
    }
  });

  // === 1. ÉCRITURE DE LA SIGNATURE ===
  // Animation du stroke-dashoffset sur 2.5 secondes
  masterTimeline.to(signaturePath, {
    strokeDashoffset: 0,
    duration: 2.5,
    ease: 'power1.inOut'
  });

  // === 2. CALCUL POSITION FINALE DU PATH ===
  // Récupération du point final pour positionner la goutte
  const pathLength = signaturePath.getTotalLength();
  const endPoint = signaturePath.getPointAtLength(pathLength);

  // Récupération des dimensions du SVG pour positionnement absolu
  const svgRect = signatureSvg.getBoundingClientRect();
  const svgViewBox = signatureSvg.viewBox.baseVal;

  // Conversion coordonnées SVG → coordonnées écran
  const scaleX = svgRect.width / svgViewBox.width;
  const scaleY = svgRect.height / svgViewBox.height;

  const dropX = endPoint.x * scaleX;
  const dropY = endPoint.y * scaleY + svgRect.top - signatureSvg.parentElement.getBoundingClientRect().top;

  // Positionnement initial de la goutte
  gsap.set(inkDrop, {
    left: `${dropX}px`,
    top: `${dropY}px`,
    xPercent: -50,
    yPercent: -50
  });

  // === 3. APPARITION + CHUTE DE LA GOUTTE ===
  masterTimeline
    // Apparition instantanée
    .to(inkDrop, {
      opacity: 1,
      duration: 0.08
    }, '>')
    // Chute avec gravité
    .to(inkDrop, {
      y: '+=35px',
      duration: 0.35,
      ease: 'power2.in'
    }, '>');

  // === 4. REMPLISSAGE DE LA RIGOLE ===
  masterTimeline.to(inkFill, {
    width: '100%',
    duration: 0.65,
    ease: 'power2.out'
  }, '>');

  // === 5. APPARITION DE LA BASELINE ===
  // Fade-in + slide up simultanés
  masterTimeline.to(baseline, {
    opacity: 1,
    y: 0,
    duration: 0.6,
    ease: 'power2.out'
  }, '>');

  // === 6. DISPARITION DE LA GOUTTE ===
  // Overlap avec la baseline pour fluidité
  masterTimeline.to(inkDrop, {
    opacity: 0,
    duration: 0.25,
    ease: 'power1.in'
  }, '-=0.4');

  console.log('✓ Hero signature initialisé');
}
