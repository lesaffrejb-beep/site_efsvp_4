# Component Guide - Site EfSVP V3

Guide des composants JavaScript et leur utilisation.

---

## 📦 Table des Matières

1. [Progressive Navigation](#progressive-navigation)
2. [Project Modal](#project-modal)
3. [Mobile Menu](#mobile-menu)
4. [FAQ Accordion](#faq-accordion)
5. [Form Validator](#form-validator)
6. [Animations Manager](#animations-manager)
7. [Content Management](#content-management)

---

## 1. Progressive Navigation

### Description
Navigation qui se cache au scroll vers le bas et réapparaît au scroll vers le haut. Inclut une barre de progression de lecture.

### Fichier
`/src/scripts/modules/progressiveNav.js`

### Fonctionnalités
- ✅ Se cache automatiquement au scroll vers le bas (> 150px)
- ✅ Réapparaît au scroll vers le haut
- ✅ Barre de progression horizontale (0-100%)
- ✅ Transitions fluides avec GSAP
- ✅ Optimisé performance (requestAnimationFrame)

### Usage

```javascript
import { ProgressiveNav } from './modules/progressiveNav.js';

// Initialisation automatique dans main.js
this.modules.progressiveNav = new ProgressiveNav();
```

### Options
- `scrollThreshold` : Seuil de scroll avant activation (défaut: 150px)

### HTML Requis
```html
<nav id="nav" class="nav">
  <!-- Contenu navigation -->
</nav>
```

### CSS Associé
`/src/styles/progressive-nav.css`

---

## 2. Project Modal

### Description
Système de modales pour afficher les détails des projets portfolio.

### Fichier
`/src/scripts/modules/projectModal.js`

### Données
`/src/data/projects.js` - Contient tous les projets avec structure complète

### Structure de Données

```javascript
{
  id: 'nom-du-projet',
  title: 'Titre du Projet',
  subtitle: 'Sous-titre',
  year: 2024,
  type: 'Type de projet',
  client: 'Nom du client',
  tags: ['Tag1', 'Tag2', 'Tag3'],
  description: `Description complète...`,
  stats: {
    duration: 'Durée',
    format: 'Format',
    // ... autres stats
  }
}
```

### Usage

```javascript
import { ProjectModal } from './modules/projectModal.js';

const modal = new ProjectModal();

// Ouvrir une modale
modal.open('nom-du-projet');

// Fermer
modal.close();
```

### HTML Requis

```html
<!-- Bouton déclencheur -->
<button data-project-id="sival-2025">Voir le projet</button>

<!-- Structure modale -->
<div class="project-modal" role="dialog" aria-modal="true">
  <div class="modal-overlay"></div>
  <div class="modal-container">
    <button class="modal-close" aria-label="Fermer">×</button>
    <div class="modal-content">
      <header class="modal-header">
        <h2 class="modal-title"></h2>
        <p class="modal-subtitle"></p>
        <div class="modal-meta"></div>
        <div class="modal-tags"></div>
      </header>
      <div class="modal-body">
        <div class="modal-description"></div>
        <div class="modal-stats">
          <h3>Informations clés</h3>
          <dl class="stats-grid"></dl>
        </div>
      </div>
    </div>
  </div>
</div>
```

### Accessibilité
- ✅ Focus trap dans la modale
- ✅ Fermeture avec `Escape`
- ✅ ARIA labels
- ✅ Lock du scroll body

### CSS Associé
`/src/styles/project-modal.css`

---

## 3. Mobile Menu

### Description
Menu hamburger responsive pour mobile avec overlay et animations.

### Fichier
`/src/scripts/main.js` (méthode `initNavigation`)

### Fonctionnalités
- ✅ Transformation hamburger → X
- ✅ Overlay avec backdrop-filter
- ✅ Focus trap
- ✅ Fermeture avec Escape
- ✅ Lock du scroll
- ✅ Animations GSAP

### HTML Requis

```html
<!-- Toggle Button -->
<button
  class="nav__toggle"
  id="nav-toggle"
  aria-label="Ouvrir le menu"
  aria-controls="nav-menu"
  aria-expanded="false"
>
  <span></span>
  <span></span>
  <span></span>
</button>

<!-- Menu -->
<div class="nav__menu" id="nav-menu">
  <ul class="nav__list">
    <li><a href="#projects">Projets</a></li>
    <!-- ... autres liens -->
  </ul>
</div>

<!-- Overlay -->
<div class="nav__overlay" id="nav-overlay"></div>
```

### États CSS

```css
/* Fermé */
.nav__menu {
  transform: translateX(100%);
}

/* Ouvert */
.nav__menu.is-active {
  transform: translateX(0);
}

.nav__overlay.is-active {
  opacity: 1;
  visibility: visible;
}
```

### Event Listeners

```javascript
// Ouverture/Fermeture
navToggle.addEventListener('click', toggleMenu);

// Fermeture overlay
navOverlay.addEventListener('click', closeMenu);

// Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeMenu();
});
```

---

## 4. FAQ Accordion

### Description
Accordéon FAQ accessible avec animations.

### Fichier
`/src/scripts/modules/faq.js`

### Usage

```javascript
import { FAQ } from './modules/faq.js';

const faq = new FAQ();
```

### HTML Requis

```html
<div class="faq-item">
  <button
    class="faq-item__question"
    aria-expanded="false"
    aria-controls="faq-answer-1"
  >
    <span>Question ?</span>
    <svg class="faq-item__icon"><!-- Icône chevron --></svg>
  </button>
  <div class="faq-item__answer" id="faq-answer-1">
    <p>Réponse...</p>
  </div>
</div>
```

### Comportement
- Un seul item ouvert à la fois
- Animation smooth avec GSAP
- Rotation de l'icône chevron
- ARIA states mis à jour

---

## 5. Form Validator

### Description
Validation avancée de formulaire avec feedback instantané.

### Fichier
`/src/scripts/modules/formValidator.js`

### Usage

```javascript
import { FormValidator } from './modules/formValidator.js';

const form = document.getElementById('contact-form');
const validator = new FormValidator(form);
```

### Validation

- ✅ Email format
- ✅ Champs requis
- ✅ Longueur min/max
- ✅ Pattern custom
- ✅ Feedback visuel
- ✅ Messages d'erreur accessibles

### HTML Requis

```html
<form id="contact-form">
  <div class="form-group">
    <label for="email">Email</label>
    <input
      type="email"
      id="email"
      name="email"
      required
      aria-required="true"
      aria-describedby="email-error"
    />
    <span class="form-error" id="email-error"></span>
  </div>
  <button type="submit">Envoyer</button>
</form>
```

---

## 6. Animations Manager

### Description
Gestion centralisée des animations scroll avec GSAP et ScrollTrigger.

### Fichier
`/src/scripts/modules/animations.js`

### Usage

```javascript
import { AnimationsManager } from './modules/animations.js';

const animations = new AnimationsManager();
```

### Animations Disponibles

#### Fade In
```html
<div data-reveal="fade">Contenu</div>
```

#### Slide Up
```html
<div data-reveal="slide-up">Contenu</div>
```

#### Stagger (liste)
```html
<ul data-reveal="stagger">
  <li>Item 1</li>
  <li>Item 2</li>
  <li>Item 3</li>
</ul>
```

#### Parallax
```html
<div data-parallax data-speed="0.5">Élément</div>
```

### Configuration

```javascript
// Custom animation
gsap.fromTo(element,
  { opacity: 0, y: 30 },
  {
    opacity: 1,
    y: 0,
    duration: 0.6,
    scrollTrigger: {
      trigger: element,
      start: 'top 85%',
      toggleActions: 'play none none none'
    }
  }
);
```

---

## 7. Content Management

### Description
Système centralisé pour gérer tous les textes du site.

### Fichier
`/src/data/content.js`

### Structure

```javascript
export const siteContent = {
  hero: {
    headline: "Votre titre",
    description: "Votre description",
    cta: "Votre CTA"
  },
  // ... autres sections
};
```

### Usage

```javascript
import { siteContent, getContent, interpolate } from './data/content.js';

// Accès direct
const title = siteContent.hero.headline;

// Avec helper
const title = getContent('hero.headline');

// Avec interpolation
const message = interpolate(
  siteContent.contact.successModal.message,
  { name: 'Jean' }
);
// Résultat: "Merci Jean ! On vous répond sous 72h."
```

### Édition des Contenus

Pour modifier les textes du site, éditez `/src/data/content.js` :

```javascript
export const siteContent = {
  hero: {
    headline: "Nouveau titre ici",
    description: "Nouvelle description ici"
  }
};
```

Pas besoin de toucher au HTML ou aux autres fichiers JS !

---

## 🎨 Bonnes Pratiques

### 1. Accessibilité

```javascript
// Toujours inclure ARIA
button.setAttribute('aria-expanded', 'true');
button.setAttribute('aria-label', 'Description claire');

// Focus management
modal.querySelector('.close-btn').focus();

// Lock scroll
document.body.style.overflow = 'hidden';
```

### 2. Performance

```javascript
// Use requestAnimationFrame for scroll
let ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      handleScroll();
      ticking = false;
    });
    ticking = true;
  }
});

// Passive listeners
window.addEventListener('scroll', handler, { passive: true });
```

### 3. Error Handling

```javascript
try {
  // Code potentiellement faillible
  const data = await fetchData();
} catch (error) {
  console.error('Error:', error);
  // Fallback gracieux
}
```

### 4. Cleanup

```javascript
class MyComponent {
  destroy() {
    // Retirer event listeners
    this.button.removeEventListener('click', this.handleClick);

    // Cleanup DOM
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
  }
}
```

---

## 🔧 Debugging

### Console Logs Utiles

```javascript
// Progressive Nav
console.log('✅ Progressive Navigation initialized');

// Project Modal
console.log('Opening project:', projectId);

// Animations
console.log('Scroll animation triggered:', element);
```

### Chrome DevTools

1. **Elements** : Vérifier les classes actives
2. **Console** : Logs et erreurs
3. **Network** : Vérifier chargement des modules
4. **Performance** : Analyser les animations
5. **Lighthouse** : Audit complet

---

## 📚 Ressources

### Documentation GSAP
- [GSAP Docs](https://greensock.com/docs/)
- [ScrollTrigger](https://greensock.com/docs/v3/Plugins/ScrollTrigger)

### Accessibilité
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM](https://webaim.org/)

### Performance
- [web.dev](https://web.dev/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)

---

**Version** : 3.0
**Dernière mise à jour** : 15 novembre 2025
**Mainteneur** : EfSVP Team
