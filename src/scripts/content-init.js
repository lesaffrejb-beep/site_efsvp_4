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
  if (!hero) return;

  const heroSection = document.getElementById('hero');
  if (!heroSection) return;

  const title = heroSection.querySelector('[data-hero-title]');
  if (title && hero.title) {
    title.textContent = hero.title;
  }

  const baselineLead = heroSection.querySelector('[data-hero-baseline-lead]');
  if (baselineLead && hero.baseline) {
    baselineLead.textContent = hero.baseline;
  }

  const heroMoments = heroSection.querySelector('[data-hero-moments]');
  if (heroMoments && Array.isArray(hero.moments)) {
    const joined = hero.moments.join(' • ');
    heroMoments.textContent = joined.endsWith('.') ? joined : `${joined}.`;
  }

  const primaryCta = heroSection.querySelector('[data-hero-cta-primary]');
  if (primaryCta && hero.ctas?.primary) {
    primaryCta.textContent = hero.ctas.primary.label;
    primaryCta.href = hero.ctas.primary.href;
  }

  const secondaryCta = heroSection.querySelector('[data-hero-cta-secondary]');
  if (secondaryCta && hero.ctas?.secondary) {
    secondaryCta.textContent = hero.ctas.secondary.label;
    secondaryCta.href = hero.ctas.secondary.href;
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
 * DÉSACTIVÉ : Le système TypeScript (initProjectsApp) gère maintenant le rendu complet
 */
export function initPortfolioContent() {
  // Les titres et métriques sont déjà dans le HTML statique
  // Le rendu des projets et filtres est géré par initProjectsApp() (TypeScript)
  console.log('📦 Portfolio: Rendu délégué au système TypeScript (initProjectsApp)');
  return;
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

  // Titres de section (déjà dans le HTML mais on peut les injecter pour flexibilité)
  const sectionTitle = document.querySelector('.faq__title');
  const sectionSubtitle = document.querySelector('.faq__subtitle');
  if (sectionTitle) sectionTitle.textContent = section.title;
  if (sectionSubtitle && section.subtitle) sectionSubtitle.textContent = section.subtitle;

  // FAQ Items - génération dynamique du HTML
  const faqContainer = document.querySelector('.faq__list');
  if (faqContainer && items.length > 0) {
    faqContainer.innerHTML = items
      .map(
        (item, index) => `
      <article class="faq__item faq-item">
        <button class="faq__question faq-item__question"
                id="${item.id}-question"
                aria-expanded="false"
                aria-controls="${item.id}-answer"
                tabindex="0">
          <span class="faq__question-label">${item.question}</span>
          <svg class="faq__icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>
        <div class="faq__answer faq-item__answer" id="${item.id}-answer" role="region" aria-labelledby="${item.id}-question">
          <p>${item.answer}</p>
        </div>
      </article>
    `
      )
      .join('');

    console.log(`✅ FAQ: ${items.length} questions générées`);
  } else {
    console.warn('⚠️ FAQ: Aucune question ou container introuvable');
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
