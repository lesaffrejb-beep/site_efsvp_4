import { gsap } from 'gsap';

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

/**
 * Calcule la position de départ de la goutte depuis la signature
 */
function getInkStartPosition() {
  const signature = document.querySelector('[data-hero-signature]');
  const hero = document.querySelector('.hero--signature');

  if (!signature || !hero) {
    console.warn('Hero Ink: Signature ou hero introuvable');
    return { x: 0, y: 0 };
  }

  const sigRect = signature.getBoundingClientRect();
  const heroRect = hero.getBoundingClientRect();

  // Point de départ : centre horizontal de la signature, 10px sous le bas
  return {
    x: sigRect.left + (sigRect.width * 0.5) - heroRect.left,
    y: sigRect.bottom + 10 - heroRect.top
  };
}

/**
 * Calcule la distance de chute sécurisée jusqu'au CTA
 */
function calculateDropDistance(startY) {
  const cta = document.querySelector('[data-hero-cta]');
  const hero = document.querySelector('.hero--signature');

  if (!cta || !hero) {
    console.warn('Hero Ink: CTA ou hero introuvable, utilisation fallback');
    return 300;
  }

  const ctaRect = cta.getBoundingClientRect();
  const heroRect = hero.getBoundingClientRect();
  const targetY = ctaRect.top - heroRect.top - 30;
  const distance = targetY - startY;

  // Sécurités : éviter valeurs aberrantes
  if (distance < 100) {
    console.warn('Distance de chute trop courte, utilisation fallback');
    return 300;
  }

  if (distance > heroRect.height - 150) {
    console.warn('Distance de chute trop longue, risque de débordement');
    return heroRect.height - startY - 150;
  }

  return distance;
}

/**
 * Anime les paths de la signature
 * @returns {number} Durée totale de l'animation
 */
function animateSignature(svg, timeline) {
  const paths = svg.querySelectorAll('path');
  let maxDuration = 0;

  paths.forEach((path, i) => {
    const length = path.getTotalLength();
    path.style.strokeDasharray = length;
    path.style.strokeDashoffset = length;

    const duration = 1.6;
    const delay = i * 0.08;
    maxDuration = Math.max(maxDuration, duration + delay);

    timeline.to(path, {
      strokeDashoffset: 0,
      duration,
      ease: 'power1.inOut'
    }, delay);
  });

  return maxDuration;
}

/**
 * Applique l'état final (pour prefers-reduced-motion)
 */
function applyFinalState(signature, cta, inkFill, inkDrop, inkTrail, baseline) {
  if (signature) {
    signature.querySelectorAll('path').forEach(p => {
      p.style.strokeDashoffset = 0;
      p.style.strokeDasharray = 'none';
    });
  }

  if (inkDrop) {
    inkDrop.style.opacity = 0;
  }

  if (inkTrail) {
    inkTrail.style.opacity = 0;
  }

  if (cta) {
    cta.classList.add('is-filled');
    cta.style.filter = 'none';
  }

  if (inkFill) {
    inkFill.style.transform = 'scaleY(1)';
  }

  if (baseline) {
    baseline.style.opacity = 1;
  }
}

/**
 * Initialise l'animation hero avec effet d'encre
 */
export function initHeroInk() {
  const signature = document.querySelector('[data-hero-signature]');
  const inkSystem = document.querySelector('[data-ink-system]');
  const inkDrop = document.querySelector('[data-ink-drop]');
  const inkTrail = document.querySelector('[data-ink-trail]');
  const trailPath = inkTrail?.querySelector('.ink-trail__path');
  const cta = document.querySelector('[data-hero-cta]');
  const inkFill = document.querySelector('.hero-cta__ink-fill');
  const baseline = document.querySelector('.hero-subtitle, .hero-signature-caption');

  if (!signature || !inkDrop || !cta) {
    console.error('Hero Ink: Éléments manquants (signature, inkDrop ou cta)');
    return null;
  }

  const prefersReduced = window.matchMedia(REDUCED_MOTION_QUERY).matches;

  if (prefersReduced) {
    applyFinalState(signature, cta, inkFill, inkDrop, inkTrail, baseline);
    return null;
  }

  // === CONSOLE DEBUG ===
  console.group('🐛 Hero Ink Debug');

  // === CALCUL DES POSITIONS ===
  const startPos = getInkStartPosition();
  const dropDistance = calculateDropDistance(startPos.y);

  console.log('Start Position:', startPos);
  console.log('Drop Distance:', dropDistance);
  console.log('CTA Rect:', cta.getBoundingClientRect());
  console.log('Hero Rect:', document.querySelector('.hero--signature').getBoundingClientRect());
  console.groupEnd();

  // === TIMELINE PRINCIPALE ===
  const masterTL = gsap.timeline({
    defaults: { ease: 'none' }
  });

  // STEP 1 : Signature s'écrit
  const signatureDuration = animateSignature(signature, masterTL);

  // STEP 2 : Positionner la goutte au départ (invisible)
  masterTL.set(inkDrop, {
    x: startPos.x,
    y: startPos.y,
    xPercent: -50,
    yPercent: -50,
    opacity: 0,
    scale: 0
  }, 0);

  // Initialiser la trainée
  if (inkTrail) {
    masterTL.set(inkTrail, {
      height: 0,
      opacity: 1
    }, 0);
  }

  // Préparer le path de la trainée
  if (trailPath) {
    const pathLength = trailPath.getTotalLength();
    trailPath.style.strokeDasharray = pathLength;
    trailPath.style.strokeDashoffset = pathLength;
  }

  // STEP 3 : Goutte apparaît au milieu de l'écriture de la signature
  masterTL.to(inkDrop, {
    opacity: 1,
    scale: 1,
    duration: 0.4,
    ease: 'back.out(3)'
  }, signatureDuration * 0.6);

  // STEP 4 : Bavure - goutte grossit puis rétrécit
  masterTL.to(inkDrop, {
    scale: 1.5,
    duration: 0.25,
    ease: 'power2.out'
  });

  masterTL.to(inkDrop, {
    scale: 1,
    duration: 0.2,
    ease: 'power2.in'
  });

  // STEP 5 : Chute de la goutte avec trainée synchronisée
  const fallTL = gsap.timeline();

  // Goutte tombe
  fallTL.to(inkDrop, {
    y: `+=${dropDistance}`,
    scaleY: 1.5,
    scaleX: 0.85,
    rotation: 8,
    duration: 1.8,
    ease: 'power2.in'
  }, 0);

  // Trainée grandit en synchronisation
  if (inkTrail) {
    fallTL.to(inkTrail, {
      height: dropDistance,
      duration: 1.8,
      ease: 'power2.in'
    }, 0);
  }

  // Path trainée se dessine
  if (trailPath) {
    fallTL.to(trailPath, {
      strokeDashoffset: 0,
      duration: 1.8,
      ease: 'power2.in'
    }, 0);
  }

  masterTL.add(fallTL, '+=0.3');

  // STEP 6 : Impact - disparition goutte + trainée
  masterTL.to(inkDrop, {
    scale: 2,
    opacity: 0,
    duration: 0.3,
    ease: 'power2.out'
  });

  if (inkTrail) {
    masterTL.to(inkTrail, {
      opacity: 0,
      duration: 0.3
    }, '<');
  }

  // STEP 7 : Remplissage CTA avec effet goo
  masterTL.fromTo(inkFill,
    { scaleY: 0 },
    {
      scaleY: 1,
      duration: 1.2,
      ease: 'power3.out',
      onStart: () => {
        cta.classList.add('is-filling');
        cta.style.filter = 'url(#goo-ink)';
      },
      onComplete: () => {
        cta.classList.remove('is-filling');
        cta.classList.add('is-filled');
        cta.style.filter = 'none';
      }
    },
    '-=0.2'
  );

  // STEP 8 : Pop texte CTA
  const ctaLabel = cta.querySelector('.hero-cta__label');
  if (ctaLabel) {
    masterTL.fromTo(ctaLabel,
      { opacity: 0.6, scale: 0.96 },
      { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(1.5)' },
      '-=0.5'
    );
  }

  // Cleanup will-change après animation
  masterTL.call(() => {
    if (inkDrop) inkDrop.style.willChange = 'auto';
    if (inkTrail) inkTrail.style.willChange = 'auto';
    if (inkFill) inkFill.style.willChange = 'auto';
  });

  return {
    timeline: masterTL,
    destroy() {
      masterTL?.kill();
    }
  };
}
