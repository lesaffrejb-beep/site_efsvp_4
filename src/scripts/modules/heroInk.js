import { gsap } from 'gsap';

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';
const POINTER_FINE_QUERY = '(pointer: fine)';
const DESKTOP_BREAKPOINT = 992;

function applyFinalState({ path, inkFill, inkDrop, baseline, ctas }) {
  if (path) {
    path.style.strokeDasharray = 'none';
    path.style.strokeDashoffset = '0';
  }

  if (inkFill) {
    inkFill.style.transform = 'scaleX(1)';
  }

  if (inkDrop) {
    inkDrop.style.opacity = '0';
    inkDrop.style.transform = 'translate3d(0, 0, 0)';
  }

  if (baseline) {
    baseline.style.opacity = '1';
    baseline.style.transform = 'translateY(0)';
  }

  ctas.forEach((cta) => {
    cta.style.opacity = '1';
    cta.style.transform = 'translateY(0)';
  });
}

function createTimeline({ path, inkDrop, inkFill, baseline, ctas }) {
  if (!path) return null;

  const pathLength = path.getTotalLength();
  gsap.set(path, { strokeDasharray: pathLength, strokeDashoffset: pathLength });
  gsap.set(inkFill, { scaleX: 0, transformOrigin: 'left center' });
  gsap.set(baseline, { autoAlpha: 0, y: 12 });
  gsap.set(ctas, { autoAlpha: 0, y: 12 });
  gsap.set(inkDrop, { yPercent: -120, autoAlpha: 0, transformOrigin: 'center' });

  const timeline = gsap.timeline({ defaults: { ease: 'power2.out' } });

  timeline
    .to(path, { strokeDashoffset: 0, duration: 2 })
    .to(
      inkDrop,
      {
        autoAlpha: 1,
        yPercent: 20,
        duration: 0.3,
      },
      '-=0.6'
    )
    .to(
      inkDrop,
      {
        yPercent: 170,
        duration: 0.35,
      },
      '-=0.15'
    )
    .to(
      inkDrop,
      {
        autoAlpha: 0,
        duration: 0.2,
      },
      '-=0.15'
    )
    .to(
      inkFill,
      {
        scaleX: 1,
        duration: 0.6,
      },
      '-=0.2'
    )
    .to(
      baseline,
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.5,
      },
      '-=0.05'
    )
    .to(
      ctas,
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.4,
        stagger: 0.12,
      },
      '-=0.2'
    );

  return timeline;
}

function createInkHover({ inkChannel, inkFill, prefersReducedMotion }) {
  if (!inkChannel || !inkFill) return () => {};

  let hoverEnabled = false;
  const pointerQuery = window.matchMedia(POINTER_FINE_QUERY);

  const handlePointerMove = (event) => {
    const rect = inkChannel.getBoundingClientRect();
    const relativeX = (event.clientX - rect.left) / rect.width;
    const intensity = Math.max(0, Math.min(1, Math.abs(relativeX - 0.5) * 2));
    const scaleY = 1 + intensity * 0.15;

    gsap.to(inkFill, {
      scaleY,
      duration: 0.4,
      ease: 'sine.out',
    });
  };

  const handlePointerLeave = () => {
    gsap.to(inkFill, { scaleY: 1, duration: 0.4, ease: 'sine.out' });
  };

  const enableHover = () => {
    if (hoverEnabled) return;
    inkChannel.addEventListener('pointermove', handlePointerMove);
    inkChannel.addEventListener('pointerleave', handlePointerLeave);
    hoverEnabled = true;
  };

  const disableHover = () => {
    if (!hoverEnabled) return;
    inkChannel.removeEventListener('pointermove', handlePointerMove);
    inkChannel.removeEventListener('pointerleave', handlePointerLeave);
    hoverEnabled = false;
    handlePointerLeave();
  };

  const updateState = () => {
    if (
      prefersReducedMotion.matches ||
      window.innerWidth < DESKTOP_BREAKPOINT ||
      (pointerQuery && !pointerQuery.matches)
    ) {
      disableHover();
    } else {
      enableHover();
    }
  };

  updateState();

  const resizeHandler = () => updateState();
  window.addEventListener('resize', resizeHandler, { passive: true });

  const pointerHandler = () => updateState();
  if (pointerQuery) {
    if (typeof pointerQuery.addEventListener === 'function') {
      pointerQuery.addEventListener('change', pointerHandler);
    } else if (typeof pointerQuery.addListener === 'function') {
      pointerQuery.addListener(pointerHandler);
    }
  }

  return () => {
    disableHover();
    window.removeEventListener('resize', resizeHandler);
    if (pointerQuery) {
      if (typeof pointerQuery.removeEventListener === 'function') {
        pointerQuery.removeEventListener('change', pointerHandler);
      } else if (typeof pointerQuery.removeListener === 'function') {
        pointerQuery.removeListener(pointerHandler);
      }
    }
  };
}

export function initHeroInk() {
  const hero = document.getElementById('hero');
  if (!hero) return null;

  const signaturePath = hero.querySelector('#hero-signature-path');
  const inkDrop = hero.querySelector('.hero__ink-drop');
  const inkFill = hero.querySelector('.hero__ink-fill');
  const inkChannel = hero.querySelector('.hero__ink-channel');
  const baseline = hero.querySelector('.hero__baseline');
  const ctaButtons = hero.querySelectorAll('.hero__cta .cta');

  if (!signaturePath || !inkDrop || !inkFill || !baseline || !ctaButtons.length) {
    return null;
  }

  const prefersReducedMotion = window.matchMedia(REDUCED_MOTION_QUERY);
  let timeline = null;

  const setupAnimation = () => {
    timeline?.kill();
    if (prefersReducedMotion.matches) {
      applyFinalState({ path: signaturePath, inkFill, inkDrop, baseline, ctas: ctaButtons });
      return;
    }

    timeline = createTimeline({ path: signaturePath, inkDrop, inkFill, baseline, ctas: ctaButtons });
  };

  setupAnimation();

  const motionHandler = (event) => {
    if (event.matches) {
      applyFinalState({ path: signaturePath, inkFill, inkDrop, baseline, ctas: ctaButtons });
      timeline?.kill();
      timeline = null;
    } else {
      setupAnimation();
    }
  };

  if (typeof prefersReducedMotion.addEventListener === 'function') {
    prefersReducedMotion.addEventListener('change', motionHandler);
  } else if (typeof prefersReducedMotion.addListener === 'function') {
    prefersReducedMotion.addListener(motionHandler);
  }

  const cleanupHover = createInkHover({ inkChannel, inkFill, prefersReducedMotion });

  return {
    start() {},
    destroy() {
      cleanupHover();
      if (typeof prefersReducedMotion.removeEventListener === 'function') {
        prefersReducedMotion.removeEventListener('change', motionHandler);
      } else if (typeof prefersReducedMotion.removeListener === 'function') {
        prefersReducedMotion.removeListener(motionHandler);
      }
      timeline?.kill();
    },
  };
}
