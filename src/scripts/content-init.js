/**
 * ============================================
 * CONTENT INITIALIZATION - Content Layer Injection
 * Injecte le contenu depuis src/content/* dans le DOM
 * ============================================
 */

import { homeContent } from '../content/home.js';
import { siteContent } from '../data/content.js';
import { highlightsContent } from '../content/highlights.js';
import { casesContent } from '../content/cases.js';
import { servicesContent } from '../content/services.js';
import { portfolioContent } from '../content/portfolio.js';
import { processContent } from '../content/process.js';
import { testimonialsContent } from '../content/testimonials.js';
import { statsContent } from '../content/stats.js';
import { faqContent } from '../content/faq.js';
import { contactContent } from '../content/contact.js';
import { footerContent } from '../content/footer.js';
import { cookieContent } from '../content/cookie.js';

/**
 * Injecte le contenu de la navigation
 */
export function initNavContent() {
  const { navigation } = homeContent;

  // Logo
  const logoEl = document.querySelector('.nav__logo');
  if (logoEl) {
    logoEl.textContent = navigation.logo;
  }

  // Links
  const navLinks = document.querySelectorAll('.nav__link');
  navLinks.forEach((link, index) => {
    if (navigation.links[index]) {
      link.textContent = navigation.links[index].label;
      link.href = navigation.links[index].href;
    }
  });

  // CTA
  const navCta = document.querySelector('.nav__cta');
  if (navCta) {
    navCta.textContent = navigation.cta.label;
    navCta.href = navigation.cta.href;
  }

  const navCtaMobile = document.querySelector('.nav__cta-mobile');
  if (navCtaMobile) {
    navCtaMobile.textContent = navigation.cta.label;
    navCtaMobile.href = navigation.cta.href;
  }
}

/**
 * Injecte le contenu du Hero
 */
export function initHeroContent() {
  const { hero } = siteContent;

  const eyebrow = document.querySelector('[data-hero-eyebrow]');
  if (eyebrow && hero?.eyebrow) {
    eyebrow.textContent = hero.eyebrow;
  }

  const signatureSrLabel = document.querySelector('[data-hero-signature-label]');
  if (signatureSrLabel && hero?.signature?.label) {
    signatureSrLabel.textContent = hero.signature.label;
  }

  const baselineLead = document.querySelector('[data-hero-baseline-lead]');
  if (baselineLead && hero?.baseline?.lead) {
    baselineLead.textContent = hero.baseline.lead;
  }

  const baselineItems = document.querySelector('[data-hero-baseline-items]');
  if (baselineItems && hero?.baseline?.moments?.length) {
    const itemsText = hero.baseline.moments.join(' • ');
    baselineItems.textContent = itemsText.endsWith('.') ? itemsText : `${itemsText}.`;
  }

  const primaryCta = document.querySelector('.signature-hero__cta--primary');
  if (primaryCta && hero?.ctaPrimary) {
    primaryCta.textContent = hero.ctaPrimary.label;
    primaryCta.href = hero.ctaPrimary.href;
  }

  const secondaryCta = document.querySelector('.signature-hero__cta--secondary');
  if (secondaryCta && hero?.ctaSecondary) {
    secondaryCta.textContent = hero.ctaSecondary.label;
    secondaryCta.href = hero.ctaSecondary.href;
  }

  const scrollLabel = document.querySelector('[data-hero-scroll-label]');
  if (scrollLabel && hero?.scroll?.label) {
    scrollLabel.textContent = hero.scroll.label;
  }

  const scrollTrigger = document.querySelector('[data-hero-scroll]');
  if (scrollTrigger && hero?.scroll?.target) {
    scrollTrigger.dataset.scrollTarget = hero.scroll.target;
  }
}

/**
 * Injecte le contenu de la section Highlights (Bento Audio)
 */
export function initHighlightsContent() {
  const { section, audioPlayers, infoCards, quote, cta } = highlightsContent;

  // Titre de section
  const sectionTitle = document.querySelector('.audio-section__title');
  const sectionSubtitle = document.querySelector('.audio-section__subtitle');
  if (sectionTitle) sectionTitle.textContent = section.title;
  if (sectionSubtitle) sectionSubtitle.textContent = section.subtitle;

  // Audio players - on injecte uniquement les textes, pas les players audio eux-mêmes
  // (les players sont gérés par le module audioPlayer.js)
  audioPlayers.forEach((player, index) => {
    const playerEl = document.querySelector(`[data-audio-id="${player.id}"]`);
    if (playerEl) {
      const badge = playerEl.querySelector('.audio-player__badge');
      const title = playerEl.querySelector('.audio-player__title');
      const client = playerEl.querySelector('.audio-player__client');
      const duration = playerEl.querySelector('.audio-player__duration');

      if (badge && player.badge) badge.textContent = player.badge;
      if (title) title.textContent = player.title;
      if (client) client.textContent = player.client;
      if (duration && player.duration) duration.textContent = player.duration;
    }
  });

  // Info Cards
  const infoCardElements = document.querySelectorAll('.info-card');
  infoCardElements.forEach((card, index) => {
    if (infoCards[index]) {
      const number = card.querySelector('.info-card__number');
      const title = card.querySelector('.info-card__title');
      const text = card.querySelector('.info-card__text');

      if (number) number.textContent = infoCards[index].number;
      if (title) title.textContent = infoCards[index].title;
      if (text) text.textContent = infoCards[index].text;
    }
  });

  // Quote Card
  const quoteText = document.querySelector('.quote-card__text');
  const quoteAuthor = document.querySelector('.quote-card__author');
  if (quoteText) quoteText.textContent = quote.text;
  if (quoteAuthor) quoteAuthor.textContent = quote.author;

  // CTA
  const ctaBtn = document.querySelector('.audio-section__cta');
  if (ctaBtn) {
    ctaBtn.textContent = cta.label;
    ctaBtn.href = cta.href;
  }
}

/**
 * Injecte le contenu des cas étendards
 */
export function initCasesContent() {
  const { section, cases, cta } = casesContent;

  // Titre de section
  const sectionTitle = document.querySelector('.cases__title');
  const sectionSubtitle = document.querySelector('.cases__subtitle');
  if (sectionTitle) sectionTitle.textContent = section.title;
  if (sectionSubtitle) sectionSubtitle.textContent = section.subtitle;

  // Cases
  cases.forEach((caseData) => {
    const caseCard = document.querySelector(`[data-case-id="${caseData.id}"]`);
    if (caseCard) {
      const badge = caseCard.querySelector('.case-card__badge');
      const title = caseCard.querySelector('.case-card__title');
      const client = caseCard.querySelector('.case-card__client');
      const tagFeatured = caseCard.querySelector('.case-card__tag-featured');
      const problem = caseCard.querySelector('.case-card__problem');
      const approach = caseCard.querySelector('.case-card__approach');
      const effect = caseCard.querySelector('.case-card__effect');

      if (badge) badge.textContent = caseData.badge;
      if (title) title.textContent = caseData.title;
      if (client) client.textContent = caseData.client;
      if (tagFeatured && caseData.tagFeatured) tagFeatured.textContent = caseData.tagFeatured;
      if (problem) problem.textContent = caseData.problem;
      if (approach) approach.textContent = caseData.approach;
      if (effect) effect.textContent = caseData.effect;
    }
  });

  // CTA
  const ctaBtn = document.querySelector('.cases__cta');
  if (ctaBtn) {
    ctaBtn.textContent = cta.label;
    ctaBtn.href = cta.href;
  }
}

/**
 * Injecte le contenu des services
 */
export function initServicesContent() {
  const { section, services } = servicesContent;

  // Titre de section
  const sectionTitle = document.querySelector('.services__title');
  const sectionSubtitle = document.querySelector('.services__subtitle');
  if (sectionTitle) sectionTitle.textContent = section.title;
  if (sectionSubtitle) sectionSubtitle.textContent = section.subtitle;

  // Services
  services.forEach((service) => {
    const serviceCard = document.querySelector(`[data-service-id="${service.id}"]`);
    if (serviceCard) {
      const title = serviceCard.querySelector('.service-card__title');
      const badge = serviceCard.querySelector('.service-card__badge');
      const badgeFeatured = serviceCard.querySelector('.service-card__badge-featured');
      const ctaLabel = serviceCard.querySelector('.service-card__cta');

      if (title) title.textContent = service.title;
      if (badge) badge.textContent = service.badge;
      if (badgeFeatured && service.badgeFeatured) badgeFeatured.textContent = service.badgeFeatured;
      if (ctaLabel) {
        ctaLabel.textContent = service.ctaLabel;
        ctaLabel.href = service.ctaHref;
      }

      // Features
      const featuresContainer = serviceCard.querySelector('.service-card__features');
      if (featuresContainer && service.features.length > 0) {
        featuresContainer.innerHTML = service.features.map((feature) => `<li>${feature}</li>`).join('');
      }
    }
  });
}

/**
 * Injecte le contenu du portfolio
 */
export function initPortfolioContent() {
  const { section, metrics, filters, projects } = portfolioContent;

  const title = document.querySelector('.projects__title');
  const description = document.querySelector('.projects__description');
  if (title) title.textContent = section.title;
  if (description) description.textContent = section.description;

  const metricElements = document.querySelectorAll('.projects__stat-card');
  metricElements.forEach((metricEl, index) => {
    if (!metrics[index]) return;
    const value = metricEl.querySelector('.projects__stat-value');
    const label = metricEl.querySelector('.projects__stat-label');
    if (value) value.textContent = metrics[index].value;
    if (label) label.textContent = metrics[index].label;
  });

  const filtersContainer = document.querySelector('.projects__filters');
  if (filtersContainer && filters?.length) {
    filtersContainer.innerHTML = filters
      .map(
        (group) => `
        <div class="projects-filter" data-filter-group="${group.id}">
          <div class="projects-filter__header">
            <span class="projects-filter__label">${group.label}</span>
          </div>
          <div class="projects-filter__options" role="listbox" aria-label="Filtrer par ${group.label.toLowerCase()}">
            ${group.options
              .map(
                (option) => `
                  <button class="projects-filter__option${option.active ? ' is-active' : ''}"
                          type="button"
                          data-filter-group="${group.id}"
                          data-filter-value="${option.value}"
                          role="option"
                          aria-pressed="${option.active ? 'true' : 'false'}">
                    ${option.label}
                  </button>
                `
              )
              .join('')}
          </div>
        </div>
      `
      )
      .join('');
  }

  const projectsGrid = document.querySelector('.projects__grid');
  if (projectsGrid && projects.length > 0) {
    const statusLabels = {
      delivered: 'Livré',
      in_production: 'En production',
    };

    const sortedProjects = [...projects].sort((a, b) => a.order - b.order);

    projectsGrid.innerHTML = sortedProjects
      .map((project) => {
        const period = project.period ? project.period : project.year;
        const statusLabel = statusLabels[project.status] || project.status;

        // Extract short title (part after "—" if exists, otherwise use full title)
        const displayTitle = project.title.includes('—')
          ? project.title.split('—')[1].trim()
          : project.title;

        // Build tags array from themes
        const tags = project.themes || [];
        const tagsHtml = tags.length > 0
          ? `<div class="project-card__tags">
              ${tags.slice(0, 3).map(tag => `<span class="project-card__tag">${tag}</span>`).join('')}
             </div>`
          : '';

        const clientInitials = project.client
          ? project.client
              .split(/\s+/)
              .filter(Boolean)
              .slice(0, 2)
              .map((part) => part[0]?.toUpperCase() || '')
              .join('')
          : '';

        return `
          <article class="project-card"
                   data-project-id="${project.slug}"
                   data-typology="${project.typology}"
                   data-sector="${project.sector}"
                   data-status="${project.status}">
            <div class="project-card__visual" aria-hidden="true">
              <div class="project-card__visual-frame">
                <span class="project-card__badge">${project.format}</span>
                <span class="project-card__monogram">${clientInitials}</span>
                <span class="project-card__location">${project.location}</span>
              </div>
            </div>
            <div class="project-card__body">
              <header class="project-card__header">
                <div class="project-card__meta">
                  <span class="project-card__client">${project.client}</span>
                  <span class="project-card__year">${period}</span>
                </div>
                <h3 class="project-card__title">${displayTitle}</h3>
              </header>
              <p class="project-card__description">${project.shortDescription}</p>
              ${tagsHtml}
            </div>
            <footer class="project-card__footer">
              <div class="project-card__footer-left">
                <span class="project-card__status project-card__status--${project.status}">${statusLabel}</span>
              </div>
              <button type="button" class="project-card__link" aria-label="Voir le projet ${project.title}">
                Voir le projet
              </button>
            </footer>
          </article>
        `;
      })
      .join('');
  }
}

/**
 * Injecte le contenu du process
 */
export function initProcessContent() {
  const { section, steps, cta } = processContent;

  const eyebrow = document.querySelector('.process__eyebrow');
  const title = document.querySelector('.process__title');
  const subtitle = document.querySelector('.process__subtitle');
  const note = document.querySelector('.process__note');
  if (eyebrow) eyebrow.textContent = section.eyebrow;
  if (title) title.textContent = section.title;
  if (subtitle) subtitle.textContent = section.subtitle;
  if (note) {
    if (section.note) {
      note.textContent = section.note;
      note.hidden = false;
    } else {
      note.remove();
    }
  }

  const stepElements = document.querySelectorAll('.process__step');
  steps.forEach((step, index) => {
    const stepEl = stepElements[index];
    if (!stepEl) return;

    const number = stepEl.querySelector('.process__step-number');
    const titleEl = stepEl.querySelector('.process__step-title');
    const duration = stepEl.querySelector('.process__step-duration');
    const description = stepEl.querySelector('.process__step-description');
    const badge = stepEl.querySelector('.process__step-badge');
    const detailsList = stepEl.querySelector('.process__step-details');

    if (number) number.textContent = step.number;
    if (titleEl) titleEl.textContent = step.title;
    if (duration) duration.textContent = step.duration;
    if (description) description.textContent = step.description;
    if (badge) {
      badge.textContent = step.badge || '';
      badge.style.display = step.badge ? 'inline-flex' : 'none';
    }
    if (detailsList) {
      detailsList.innerHTML = step.details.map((detail) => `<li>${detail}</li>`).join('');
    }
  });

  const ctaBtn = document.querySelector('.process__cta');
  if (ctaBtn) {
    ctaBtn.textContent = cta.label;
    ctaBtn.href = cta.href;
  }
}

/**
 * Injecte le contenu des témoignages
 */
export function initTestimonialsContent() {
  const { section, testimonials } = testimonialsContent;

  // Titre de section
  const sectionTitle = document.querySelector('.testimonials__title');
  if (sectionTitle) sectionTitle.textContent = section.title;

  // Testimonials - génération dynamique dans le swiper
  const testimonialsWrapper = document.querySelector('.testimonials__carousel .swiper-wrapper');
  if (testimonialsWrapper && testimonials.length > 0) {
    testimonialsWrapper.innerHTML = testimonials
      .map(
        (testimonial) => `
      <div class="swiper-slide">
        <article class="testimonial-card">
          <div class="testimonial-card__rating" aria-label="${testimonial.rating} étoiles">
            ${'★'.repeat(testimonial.rating)}
          </div>
          <blockquote class="testimonial-card__quote">"${testimonial.quote}"</blockquote>
          <footer class="testimonial-card__footer">
            <div class="testimonial-card__avatar">${testimonial.avatar}</div>
            <div class="testimonial-card__author">
              <cite class="testimonial-card__name">${testimonial.name}</cite>
              <p class="testimonial-card__role">${testimonial.role} · ${testimonial.organization}</p>
              <p class="testimonial-card__context">${testimonial.context}</p>
            </div>
          </footer>
        </article>
      </div>
    `
      )
      .join('');
  }
}

/**
 * Injecte le contenu des stats
 */
export function initStatsContent() {
  const { section, stats } = statsContent;

  // Titre de section
  const sectionTitle = document.querySelector('.stats__title');
  if (sectionTitle) sectionTitle.textContent = section.title;

  // Stats
  stats.forEach((stat, index) => {
    const statCard = document.querySelectorAll('.stat-card')[index];
    if (statCard) {
      const value = statCard.querySelector('.stat-card__value');
      const label = statCard.querySelector('.stat-card__label');

      if (value) {
        value.textContent = stat.value;
        if (stat.count !== null) {
          value.setAttribute('data-count', stat.count);
        }
      }
      if (label) label.textContent = stat.label;
    }
  });
}

/**
 * Injecte le contenu de la FAQ
 */
export function initFaqContent() {
  const { section, items } = faqContent;

  // Titre de section
  const sectionTitle = document.querySelector('.faq__title');
  const sectionSubtitle = document.querySelector('.faq__subtitle');
  if (sectionTitle) sectionTitle.textContent = section.title;
  if (sectionSubtitle && section.subtitle) sectionSubtitle.textContent = section.subtitle;

  // FAQ Items - génération dynamique
  const faqContainer = document.querySelector('.faq__list');
  if (faqContainer && items.length > 0) {
    faqContainer.innerHTML = items
      .map(
        (item, index) => `
      <article class="faq__item">
        <button class="faq__question"
                id="${item.id}-question"
                aria-expanded="false"
                aria-controls="${item.id}-answer">
          <span class="faq__question-label">${item.question}</span>
          <span class="faq__icon" aria-hidden="true"></span>
        </button>
        <div class="faq__answer" id="${item.id}-answer" role="region" aria-labelledby="${item.id}-question">
          <p>${item.answer}</p>
        </div>
      </article>
    `
      )
      .join('');
  }
}

/**
 * Injecte le contenu du contact
 */
export function initContactContent() {
  const { section, form, alternativeContact, successState } = contactContent;

  const sectionTitle = document.querySelector('.contact__title');
  const sectionSubtitle = document.querySelector('.contact__subtitle');
  const sectionResponse = document.querySelector('.contact__response');
  if (sectionTitle) sectionTitle.textContent = section.title;
  if (sectionSubtitle) sectionSubtitle.textContent = section.subtitle;
  if (sectionResponse && section.responseTime) sectionResponse.textContent = section.responseTime;

  form.fields.forEach((field) => {
    const input = document.getElementById(field.id);
    const label = document.querySelector(`label[for="${field.id}"]`);
    if (label && field.label) {
      label.textContent = field.label;
    }
    if (input && typeof field.defaultValue !== 'undefined') {
      input.value = field.defaultValue;
    }
    if (input && typeof field.placeholder === 'string') {
      input.placeholder = field.placeholder;
    }
    if (input && typeof field.min !== 'undefined') {
      input.setAttribute('min', field.min);
    }
    if (input && typeof field.max !== 'undefined') {
      input.setAttribute('max', field.max);
    }
    if (input && typeof field.step !== 'undefined') {
      input.setAttribute('step', field.step);
    }
    if (input && field.type === 'select' && field.options) {
      input.innerHTML = field.options
        .map((option) => `<option value="${option.value}">${option.label}</option>`)
        .join('');
    }
  });

  const submitBtn = document.querySelector('.contact-form__submit');
  if (submitBtn) {
    const textEl = submitBtn.querySelector('.btn__text');
    if (textEl) textEl.textContent = form.submitLabel;
  }

  const formNote = document.querySelector('.contact__form-note');
  if (formNote && form.note) formNote.textContent = form.note;

  const altLabel = document.querySelector('.contact__direct-label');
  const altLocation = document.querySelector('.contact__location');
  if (altLabel) altLabel.textContent = alternativeContact.title;
  if (altLocation) altLocation.textContent = alternativeContact.location;

  const emailButton = document.querySelector('[data-copy-email]');
  if (emailButton) {
    const email = alternativeContact.email;
    emailButton.setAttribute('data-email', email);
    const emailText = emailButton.querySelector('.copy-email__text');
    if (emailText) emailText.textContent = email;
  }

  const feedbackTitle = document.querySelector('.contact__feedback-title');
  const feedbackText = document.querySelector('.contact__feedback-text');
  if (feedbackTitle) feedbackTitle.textContent = successState.title;
  if (feedbackText) feedbackText.textContent = successState.message;
}

/**
 * Injecte le contenu du footer
 */
export function initFooterContent() {
  const { brand, newsletter, bottom } = footerContent;

  // Brand
  const logo = document.querySelector('.footer__logo');
  const tagline = document.querySelector('.footer__tagline');
  const baseline = document.querySelector('.footer__baseline');
  if (logo) logo.textContent = brand.logo;
  if (tagline) tagline.textContent = brand.tagline;
  if (baseline) baseline.textContent = brand.baseline;

  // Newsletter
  const newsletterTitle = document.querySelector('.footer__newsletter-title');
  const newsletterDesc = document.querySelector('.footer__newsletter-desc');
  const newsletterPlaceholder = document.querySelector('.footer__newsletter-input');
  if (newsletterTitle) newsletterTitle.textContent = newsletter.title;
  if (newsletterDesc) newsletterDesc.textContent = newsletter.description;
  if (newsletterPlaceholder) newsletterPlaceholder.placeholder = newsletter.placeholder;

  // Bottom
  const copyright = document.querySelector('.footer__copyright');
  const made = document.querySelector('.footer__made');
  if (copyright) copyright.textContent = bottom.copyright;
  if (made) {
    // Remplacer {heart} par le symbole ♥
    made.innerHTML = bottom.made.replace('{heart}', '<span aria-label="coeur">♥</span>');
  }
}

/**
 * Injecte le contenu du cookie banner
 */
export function initCookieContent() {
  const { title, description, buttons } = cookieContent;

  const cookieBanner = document.querySelector('.cookie-banner');
  if (cookieBanner) {
    const cookieTitle = cookieBanner.querySelector('.cookie-banner__title');
    const cookieDesc = cookieBanner.querySelector('.cookie-banner__description');
    const acceptBtn = cookieBanner.querySelector('#cookie-accept');
    const rejectBtn = cookieBanner.querySelector('#cookie-reject');

    if (cookieTitle) cookieTitle.textContent = title;
    if (cookieDesc) cookieDesc.textContent = description;
    if (acceptBtn) acceptBtn.textContent = buttons.accept;
    if (rejectBtn) rejectBtn.textContent = buttons.reject;
  }
}

/**
 * Initialise tout le contenu du site
 * À appeler AVANT l'initialisation des modules interactifs
 */
export function initAllContent() {
  try {
    initNavContent();
    initHeroContent();
    initHighlightsContent();
    initCasesContent();
    initServicesContent();
    initPortfolioContent();
    initProcessContent();
    initTestimonialsContent();
    initStatsContent();
    initFaqContent();
    initContactContent();
    initFooterContent();
    initCookieContent();

    console.log('✅ Content layer initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing content layer:', error);
  }
}
