import { gsap } from 'gsap';

const PORTFOLIO_CARD_SELECTORS = ['.project-card', '.portfolio-card', '.efsvp-portfolio-card'];
const LEGACY_FILTER_SELECTOR = '.portfolio__filter';
const MODERN_FILTER_SELECTORS = ['.projects-filter__option', '.filter'];

const findElements = (selector, root = document) => {
  if (Array.isArray(selector)) {
    return selector.flatMap((sel) => Array.from(root.querySelectorAll(sel)));
  }

  return Array.from(root.querySelectorAll(selector));
};

const toggleCardVisibility = (card, visible) => {
  const animationConfig = {
    opacity: visible ? 1 : 0,
    scale: visible ? 1 : 0.95,
    duration: 0.3,
    ease: visible ? 'power2.out' : 'power2.in',
  };

  gsap.to(card, {
    ...animationConfig,
    onStart: visible
      ? () => {
          card.style.display = 'block';
          card.hidden = false;
        }
      : undefined,
    onComplete: !visible
      ? () => {
          card.style.display = 'none';
          card.hidden = true;
        }
      : undefined,
  });
};

const getAttributeValue = (element, attributes) => {
  for (const attr of attributes) {
    if (!attr) continue;
    const value = element.getAttribute(attr);
    if (value) return value;
  }

  return null;
};

const applyFilterState = (cards, state) => {
  cards.forEach((card) => {
    const cardClient = getAttributeValue(card, ['data-client']);
    const cardTypeLegacy = getAttributeValue(card, ['data-type']);
    const cardCategoryLegacy = getAttributeValue(card, ['data-category']);
    const cardTypology = getAttributeValue(card, ['data-typology', 'data-type']);
    const cardSector = getAttributeValue(card, ['data-sector', 'data-category', 'data-client']);
    const cardStatus = getAttributeValue(card, ['data-status']) || 'delivered';

    const matchesClient = !state.client || state.client === 'all' || state.client === cardClient;
    const matchesType = !state.type || state.type === 'all' || state.type === cardTypeLegacy;
    const matchesCategory = !state.category || state.category === 'all' || state.category === cardCategoryLegacy;
    const matchesTypology = !state.typology || state.typology === 'all' || state.typology === cardTypology;
    const matchesSector = !state.sector || state.sector === 'all' || state.sector === cardSector;
    const matchesStatus = !state.status || state.status === 'all' || state.status === cardStatus;

    const shouldDisplay =
      matchesClient && matchesType && matchesCategory && matchesTypology && matchesSector && matchesStatus;

    toggleCardVisibility(card, shouldDisplay);
  });
};

const initLegacyFilters = (root, cards) => {
  const legacyFilters = findElements(LEGACY_FILTER_SELECTOR, root);

  if (!legacyFilters.length) {
    return;
  }

  legacyFilters.forEach((filter) => {
    filter.addEventListener('click', () => {
      const category = filter.getAttribute('data-filter');

      legacyFilters.forEach((btn) => btn.classList.remove('portfolio__filter--active'));
      filter.classList.add('portfolio__filter--active');

      cards.forEach((card) => {
        const matches = category === 'all' || card.getAttribute('data-category') === category;
        toggleCardVisibility(card, matches);
      });
    });
  });
};

const initModernFilters = (root, cards) => {
  const filterButtons = findElements(MODERN_FILTER_SELECTORS, root).filter((button) =>
    button.hasAttribute('data-filter-group')
  );

  if (!filterButtons.length) {
    return;
  }

  const state = {
    client: 'all',
    type: 'all',
    category: 'all',
    typology: 'all',
    sector: 'all',
    status: 'all',
  };

  const buttonsByGroup = filterButtons.reduce((acc, button) => {
    const group = button.getAttribute('data-filter-group');
    if (!acc[group]) {
      acc[group] = [];
    }

    acc[group].push(button);
    return acc;
  }, {});

  const handleClick = (button) => {
    const group = button.getAttribute('data-filter-group');
    const value = button.getAttribute('data-filter-value');

    if (!group) {
      return;
    }

    (buttonsByGroup[group] || []).forEach((btn) => {
      btn.classList.remove('is-active');
      btn.setAttribute('aria-pressed', 'false');
    });

    button.classList.add('is-active');
    button.setAttribute('aria-pressed', 'true');

    state[group] = value ?? 'all';
    applyFilterState(cards, state);
  };

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => handleClick(button));
  });

  applyFilterState(cards, state);
};

/**
 * Initialize portfolio filtering system compatible with legacy and block markup.
 * @param {Document|HTMLElement} [root=document]
 */
export const initPortfolioBlock = (root = document) => {
  const cards = PORTFOLIO_CARD_SELECTORS.flatMap((selector) => findElements(selector, root));

  if (!cards.length) {
    return;
  }

  initLegacyFilters(root, cards);
  initModernFilters(root, cards);
};

export default initPortfolioBlock;
