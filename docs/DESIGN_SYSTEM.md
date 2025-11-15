# Design System - Site EfSVP V3

## 🎨 Philosophie

> "Perfection is achieved, not when there is nothing more to add, but when there is nothing left to take away." — Antoine de Saint-Exupéry

Le design system d'EfSVP repose sur trois piliers :
1. **Accessibilité par design** : WCAG 2.1 AA minimum
2. **Excellence visible** : Chaque détail compte
3. **Performance sans compromis** : Rapide ET beau

---

## 🌈 Palette de Couleurs

### Couleurs Primaires

```css
--primary: #B8441E           /* Terre cuite - Couleur signature */
--primary-light: #D4694A     /* Variation claire */
--primary-dark: #8E3417      /* Variation sombre */
--primary-hover: #D16D52     /* État hover */
```

**Usage** :
- CTA principaux
- Liens importants
- Accents visuels
- Focus states

**Contraste** :
- Sur `--neutral-50` : **5.8:1** (PASS AA)
- Sur `--neutral-100` : **5.2:1** (PASS AA)

### Couleurs Secondaires

```css
--secondary: #E8924F         /* Ambre forge */
--secondary-light: #F4B87E   /* Variation claire */
--accent-camel: #C39D6B      /* Camel - Secondaire chaleureux */
--accent-beige: #E6D9C3      /* Beige - Secondaire doux */
```

**Usage** :
- Éléments décoratifs
- Dégradés
- Badges secondaires
- CTA secondaires (avec texte foncé)

**Contraste** :
- `--secondary` sur clair : **2.8:1** (FAIL) ❌
- Utiliser avec texte foncé : **4.6:1** (PASS) ✅

### Couleurs Neutres

```css
--neutral-900: #1A2332       /* Encre nuit - Texte principal */
--neutral-800: #2D3748       /* Charcoal */
--neutral-700: #4A5568       /* Texte secondaire */
--neutral-100: #F5E6D3       /* Parchemin - Fonds clairs */
--neutral-50: #FAF4ED        /* Fond ultra-light */
```

**Usage** :
- `--neutral-900` : Tous les textes principaux sur fond clair
- `--neutral-100` : Fonds de cards, sections claires
- `--neutral-50` : Fond principal du site

**Contraste** :
- `--neutral-900` sur `--neutral-50` : **14.2:1** (AAA) ✅
- `--neutral-900` sur `--neutral-100` : **12.5:1** (AAA) ✅

### Couleurs Accents

```css
--accent-gold: #D4AF37       /* Or - Highlights */
--accent-burgundy: #7D2E2E   /* Bordeaux - Accents sombres */
```

**Usage** :
- Détails premium
- Dégradés de la barre de progression
- Éléments décoratifs

### Couleurs Sémantiques

```css
--text: var(--neutral-900)
--text-secondary: #4A5568
--text-inverse: #FEFEFE
--text-on-dark: #F5E6D3

--bg: var(--neutral-50)
--surface: var(--neutral-100)
--bg-dark: #0F141A
--dark-section-bg: #0E151B
```

---

## 🔤 Typographie

### Familles de Polices

```css
--font-display: 'Playfair Display', serif  /* Titres élégants */
--font-body: 'Inter', sans-serif            /* Corps de texte */
--font-accent: 'Cormorant', serif           /* Accents italiques */
```

### Échelle Typographique

| Token | Taille Min | Taille Max | Usage |
|-------|-----------|-----------|-------|
| `--text-xs` | 0.75rem | 0.875rem | Annotations |
| `--text-sm` | 0.875rem | 0.938rem | Labels |
| `--text-base` | 1.063rem | 1.188rem | Body text |
| `--text-lg` | 1.125rem | 1.375rem | Lead paragraphs |
| `--text-xl` | 1.25rem | 1.75rem | Subtitles |
| `--text-2xl` | 1.5rem | 2.25rem | H3 |
| `--text-3xl` | 2.25rem | 3.5rem | H2 |
| `--text-4xl` | 3rem | 4.5rem | H1 |
| `--text-5xl` | 3.5rem | 5.5rem | Hero |
| `--text-6xl` | 3.75rem | 7rem | Display XL |

### Hauteurs de Ligne

```css
--leading-tight: 1.1         /* Titres serrés */
--leading-snug: 1.3          /* Titres normaux */
--leading-normal: 1.5        /* Body standard */
--leading-relaxed: 1.7       /* Body aéré */
```

### Exemples d'Usage

```css
/* Hero Headline */
.hero__headline {
  font-family: var(--font-display);
  font-size: var(--text-5xl);
  line-height: var(--leading-tight);
  font-weight: 700;
  color: var(--text-inverse);
}

/* Body Text */
body {
  font-family: var(--font-body);
  font-size: var(--text-base);
  line-height: var(--leading-relaxed);
  color: var(--text);
}

/* Section Title */
.section-title {
  font-family: var(--font-display);
  font-size: var(--text-3xl);
  line-height: var(--leading-snug);
  font-weight: 700;
}
```

---

## 📐 Spacing & Layout

### Système d'Espacement

```css
--space-1: 0.25rem    /* 4px */
--space-2: 0.5rem     /* 8px */
--space-3: 0.75rem    /* 12px */
--space-4: 1rem       /* 16px */
--space-5: 1.25rem    /* 20px */
--space-6: 1.5rem     /* 24px */
--space-8: 2rem       /* 32px */
--space-10: 2.5rem    /* 40px */
--space-12: 3rem      /* 48px */
--space-16: 4rem      /* 64px */
--space-20: 5rem      /* 80px */
--space-24: 6rem      /* 96px */
--space-32: 8rem      /* 128px */
```

### Containers

```css
--container-max: 1280px
--container-padding: var(--space-6)
--text-max-width: 68ch
```

### Breakpoints

```scss
// Mobile First
$mobile: 375px
$tablet: 768px
$desktop: 1024px
$wide: 1440px
$ultra: 1920px

@media (max-width: 767px) { /* Mobile */ }
@media (min-width: 768px) and (max-width: 1023px) { /* Tablet */ }
@media (min-width: 1024px) { /* Desktop */ }
```

---

## 🔘 Border Radius

### Système de Coins Arrondis

```css
--radius-xs: 4px       /* Inputs, petits éléments */
--radius-sm: 8px       /* Badges, tags */
--radius-md: 12px      /* Cards, buttons */
--radius-lg: 20px      /* Cards principales */
--radius-xl: 24px      /* Sections */
--radius-2xl: 32px     /* Modales */
--radius-full: 9999px  /* Boutons ronds, avatars */
```

---

## 🎭 Shadows & Effects

### Ombres

```css
--shadow-xs: 0 1px 2px 0 rgba(0, 0, 0, 0.05)
--shadow-sm: 0 2px 4px 0 rgba(0, 0, 0, 0.06)
--shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.08)
--shadow-md: 0 8px 16px 0 rgba(0, 0, 0, 0.1)
--shadow-lg: 0 12px 24px 0 rgba(0, 0, 0, 0.12)
--shadow-xl: 0 20px 40px 0 rgba(0, 0, 0, 0.14)
--shadow-2xl: 0 30px 60px 0 rgba(0, 0, 0, 0.16)

--shadow-lift: 0 16px 32px 0 rgba(0, 0, 0, 0.12)       /* Cards hover */
--shadow-hero-cta: 0 24px 48px rgba(0, 0, 0, 0.4)      /* CTA Hero */
--shadow-dark-card: 0 16px 40px rgba(0, 0, 0, 0.25)    /* Sur fond sombre */
```

### Glows (Lueurs)

```css
--glow-accent: 0 0 20px rgba(232, 146, 79, 0.3)
--glow-primary: 0 0 24px rgba(184, 68, 30, 0.25)
```

---

## ⚡ Transitions & Animations

### Easings

```css
--ease-smooth: cubic-bezier(0.4, 0, 0.2, 1)
--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1)
--ease-in-out-expo: cubic-bezier(0.87, 0, 0.13, 1)
```

### Durées

```css
--duration-fast: 0.15s
--duration-base: 0.25s
--duration-slow: 0.4s
```

### Exemples

```css
/* Transition standard */
.button {
  transition: all var(--duration-base) var(--ease-smooth);
}

/* Hover avec lift */
.card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lift);
  transition: all var(--duration-slow) var(--ease-out-expo);
}
```

---

## 🎯 Composants Standards

### Boutons

#### Primary CTA
```css
.cta--primary {
  background: var(--primary);
  color: var(--neutral-50);
  padding: 16px 32px;
  border-radius: var(--radius-full);
  font-weight: 700;
  box-shadow: var(--shadow-hero-cta);
  transition: all var(--duration-base) var(--ease-smooth);
}

.cta--primary:hover {
  background: var(--primary-dark);
  transform: translateY(-2px);
  box-shadow: var(--shadow-xl);
}

/* Contraste: 5.8:1 - PASS AA */
```

#### Secondary CTA
```css
.cta--secondary {
  background: var(--secondary);
  color: var(--neutral-900);
  border: 2px solid var(--primary);
  /* Contraste: 4.6:1 - PASS AA */
}
```

### Cards

```css
.card {
  background: var(--surface);
  border-radius: var(--radius-lg);
  padding: var(--space-8);
  box-shadow: var(--shadow-md);
  transition: all var(--duration-slow) var(--ease-out-expo);
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lift);
}
```

### Inputs

```css
.form-input {
  padding: 14px 18px;
  border: 2px solid var(--border);
  border-radius: var(--radius-md);
  font-family: var(--font-body);
  font-size: var(--text-base);
  color: var(--text);
  background: var(--surface);
  transition: all var(--duration-base) var(--ease-smooth);
}

.form-input:focus {
  border-color: var(--primary);
  outline: 3px solid rgba(184, 68, 30, 0.3);
  outline-offset: 0;
}
```

---

## ♿ Accessibilité

### Focus States

```css
*:focus-visible {
  outline: 3px solid var(--primary);
  outline-offset: 3px;
  border-radius: 4px;
}

/* Sur fond sombre */
.dark *:focus-visible {
  outline-color: var(--accent-gold);
}
```

### Text Shadows pour Lisibilité

```css
/* Texte sur images */
.text-on-image {
  text-shadow:
    0 2px 8px rgba(26, 35, 50, 0.8),
    0 1px 3px rgba(0, 0, 0, 0.5);
}
```

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 📱 Responsive Design

### Principes

1. **Mobile First** : Concevoir pour mobile d'abord
2. **Fluid Typography** : Utiliser `clamp()` pour adaptation fluide
3. **Container Queries** : Utiliser quand disponible
4. **Touch Targets** : Minimum 44x44px sur mobile

### Exemple Responsive

```css
.hero__headline {
  /* 3rem sur mobile, 5.5rem sur desktop */
  font-size: clamp(3rem, 2.75rem + 2.75vw, 5.5rem);
}

.cta {
  /* Padding adaptatif */
  padding: clamp(14px, 2vw, 18px) clamp(24px, 4vw, 48px);

  /* Touch target minimum */
  min-height: 44px;
}
```

---

## 🎨 Règles d'Usage

### ✅ Toujours Faire

1. Utiliser `--neutral-900` pour texte sur fond clair
2. Utiliser `--neutral-50` ou `--neutral-100` pour texte sur fond sombre
3. Ajouter `text-shadow` sur texte au-dessus d'images
4. Vérifier le contraste avec Chrome DevTools
5. Tester avec `prefers-reduced-motion`

### ❌ Ne Jamais Faire

1. Utiliser `--secondary` (#E8924F) comme couleur de texte sur fond clair
2. Baisser l'opacité du texte sans vérifier le ratio effectif
3. Texte sur image sans shadow ou overlay
4. Liens sans indicateur visuel
5. Focus states invisibles

---

## 🔧 Outils

### Vérification de Contraste
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- Chrome DevTools > Elements > Contrast Ratio

### Design Tokens
- Tous les tokens sont définis dans `/src/styles/design-tokens.css`
- Utiliser les variables CSS pour garantir cohérence

### Performance
- Lighthouse (Accessibility > 95)
- axe DevTools

---

**Version** : 3.0
**Dernière mise à jour** : 15 novembre 2025
**Mainteneur** : EfSVP Team
