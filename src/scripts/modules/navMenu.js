/**
 * NAV REFACTOR NOTES:
 * - HTML structure: nav[data-role="main-nav"] with desktop links list cloned into the mobile panel (#nav-menu).
 * - Previous state: burger interaction relied on CSS/GSAP classes without robust scroll lock or focus handling.
 * - Key fixes: explicit open/close helpers, body.nav--open scroll lock with restored scroll position, overlay & ESC
 *   closing, link-based closing, focus return on close, and resize guard above 1024px.
 */

const BREAKPOINT_DESKTOP = 1024;

const SELECTORS = {
  nav: '[data-role="main-nav"]',
  toggle: '.nav__toggle',
  menu: '#nav-menu',
  overlay: '[data-nav-overlay]',
  desktopLinks: '[data-nav-links]',
  mobileLinks: '[data-nav-links-mobile]',
  link: '.nav__link',
  close: '.nav__menu-close',
};

export function initNavMenu() {
  const nav = document.querySelector(SELECTORS.nav);
  if (!nav) return;

  const navToggle = nav.querySelector(SELECTORS.toggle);
  const navMenu = nav.querySelector(SELECTORS.menu);
  const navOverlay = nav.querySelector(SELECTORS.overlay);
  const desktopLinks = nav.querySelector(SELECTORS.desktopLinks);
  const mobileLinks = nav.querySelector(SELECTORS.mobileLinks);
  const closeButton = nav.querySelector(SELECTORS.close);

  if (!navToggle || !navMenu || !navOverlay || !desktopLinks || !mobileLinks) return;

  let isOpen = false;
  let previousFocus = null;
  let savedScrollY = 0;

  syncMobileLinks(desktopLinks, mobileLinks);

  function getMobileLinks() {
    return navMenu.querySelectorAll(SELECTORS.link);
  }

  function lockBodyScroll() {
    savedScrollY = window.scrollY;
    document.body.classList.add('nav--open');
    document.body.style.top = `-${savedScrollY}px`;
    document.body.style.width = '100%';
    document.body.style.position = 'fixed';
  }

  function unlockBodyScroll() {
    document.body.classList.remove('nav--open');
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    window.scrollTo(0, savedScrollY);
  }

  function openNav() {
    if (isOpen) return;
    isOpen = true;
    previousFocus = document.activeElement;

    lockBodyScroll();
    navMenu.classList.add('nav__menu--open');
    navOverlay.classList.add('nav__overlay--visible');

    navToggle.setAttribute('aria-expanded', 'true');
    navToggle.setAttribute('aria-label', 'Fermer le menu');
    navMenu.setAttribute('aria-hidden', 'false');
    navOverlay.setAttribute('aria-hidden', 'false');

    const firstLink = getMobileLinks()[0];
    (firstLink || closeButton || navMenu).focus({ preventScroll: true });
  }

  function closeNav() {
    if (!isOpen) return;
    isOpen = false;

    unlockBodyScroll();
    navMenu.classList.remove('nav__menu--open');
    navOverlay.classList.remove('nav__overlay--visible');

    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Ouvrir le menu');
    navMenu.setAttribute('aria-hidden', 'true');
    navOverlay.setAttribute('aria-hidden', 'true');

    if (previousFocus instanceof HTMLElement) {
      previousFocus.focus({ preventScroll: true });
    } else {
      navToggle.focus({ preventScroll: true });
    }
  }

  function toggleNav() {
    if (isOpen) {
      closeNav();
    } else {
      openNav();
    }
  }

  function handleKeydown(event) {
    if (!isOpen) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      closeNav();
      return;
    }

    if (event.key !== 'Tab') return;

    const focusableItems = Array.from(
      navMenu.querySelectorAll('a[href], button, [tabindex]:not([tabindex="-1"])')
    ).filter((el) => !el.hasAttribute('disabled'));
    if (!focusableItems.length) return;

    const firstItem = focusableItems[0];
    const lastItem = focusableItems[focusableItems.length - 1];

    if (event.shiftKey && document.activeElement === firstItem) {
      event.preventDefault();
      lastItem.focus();
    } else if (!event.shiftKey && document.activeElement === lastItem) {
      event.preventDefault();
      firstItem.focus();
    }
  }

  function handleResize() {
    if (window.innerWidth >= BREAKPOINT_DESKTOP) {
      closeNav();
    }
  }

  navToggle.addEventListener('click', toggleNav);
  navOverlay.addEventListener('click', closeNav);
  closeButton?.addEventListener('click', closeNav);
  document.addEventListener('keydown', handleKeydown);

  navMenu.addEventListener('click', (event) => {
    const link = event.target.closest(SELECTORS.link);
    if (link) {
      closeNav();
      return;
    }

    if (event.target === navMenu) {
      closeNav();
    }
  });

  window.addEventListener('resize', handleResize, { passive: true });
}

function syncMobileLinks(sourceList, targetList) {
  targetList.innerHTML = '';
  const items = sourceList.querySelectorAll('li');

  items.forEach((item) => {
    const clone = item.cloneNode(true);
    targetList.appendChild(clone);
  });
}
