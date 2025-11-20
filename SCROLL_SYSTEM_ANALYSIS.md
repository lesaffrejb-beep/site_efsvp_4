# ANALYSE COMPLÈTE - SYSTÈME DE SCROLL MODAL PROJET

## 1. HIÉRARCHIE DOM PRÉCISE

```
<div class="project-modal" id="project-modal">
  └─ <div class="modal-overlay"></div>
     (position: fixed, z-index: 0 - overlay cliquable)
  
  └─ <div class="modal-container">
     (position: relative, z-index: 1, SANS overflow, height: auto)
     
     ├─ <button class="modal-close" id="project-modal-close">
     │  (position: absolute, top/right, z-index: 10)
     │
     └─ <div class="modal-content">
        (overflow: visible, max-height: none, flex: column)
        
        ├─ <div class="modal-header">
        │  ├─ <div class="modal-tags">
        │  ├─ <h2 class="modal-title" id="project-modal-title">
        │  └─ <p class="modal-subtitle" id="project-modal-meta">
        │
        └─ <div class="modal-body">
           (display: flex, flex-direction: column, gap)
           
           ├─ <div class="modal-visual" id="project-modal-visual">
           │  └─ <img> (aspect-ratio: 16/9)
           │
           ├─ <div class="modal-description" id="project-modal-description">
           │  └─ <p>*... paragraphes dynamiques
           │
           ├─ <div class="modal-video" id="project-modal-video" style="display: none;">
           │  └─ [Contenu vidéo injecté dynamiquement]
           │
           ├─ <div class="modal-audio" id="project-modal-audio" style="display: none;">
           │  └─ [Lecteur audio injecté dynamiquement]
           │
           └─ <div class="modal-stats" id="project-modal-stats" style="display: none;">
              ├─ <h3>Informations</h3>
              └─ <dl class="stats-grid" id="project-modal-stats-content">
                 └─ [Paires <dt>/<dd> dynamiques]
```

## 2. CONTENEUR DE SCROLL - .project-modal

C'est l'élément CLEF du système de scroll :

```css
.project-modal {
  position: fixed;           /* ✅ Conteneur fixé en viewport */
  inset: 0;                  /* Occupe tout l'écran */
  z-index: var(--z-modal);   /* Au-dessus du contenu principal */
  display: none;             /* Masqué par défaut */
  align-items: flex-start;   /* Contenu aligné en haut */
  justify-content: center;   /* Centré horizontalement */
  padding: var(--space-8) var(--space-4);
  
  /* 🎯 SCROLL SETUP CRITIQUE */
  overflow-y: auto;          /* ✅ SCROLL VERTICAL autorisé ICI SEULEMENT */
  overflow-x: hidden;        /* Pas de défilement horizontal */
  -webkit-overflow-scrolling: touch;  /* Momentum scrolling iOS */
  overscroll-behavior: contain;       /* Empêche rubber-band scroll */
  
  opacity: 0;
  transition: opacity var(--transition-slow);
}

.project-modal.active {
  display: flex;
  opacity: 1;
}
```

### Points critiques :
1. **position: fixed** + **inset: 0** = occupe tout le viewport, ne se déplace PAS avec le scroll
2. **overflow-y: auto** = SEUL ce conteneur scroll, pas .modal-container
3. **overflow-x: hidden** = prévient le scroll horizontal
4. **overscroll-behavior: contain** = empêche le "pull-to-refresh" mobile

---

## 3. CONTENEUR DE CONTENU - .modal-container

```css
.modal-container {
  position: relative;        /* Relatif au parent */
  width: min(960px, 100%);   /* Max 960px, responsive */
  height: auto;              /* Hauteur dynamique selon contenu */
  min-height: 0;             /* ⚠️ Important : reset du min-height par défaut */
  max-height: none;          /* ✅ CRITIQUE : Pas de max-height */
  margin-inline: auto;       /* Centrage horizontal */
  margin-block: 0;
  background: var(--bg-primary);
  border-radius: var(--radius-2xl);
  box-shadow: var(--shadow-2xl);
  
  /* ⚠️ IMPORTANT : Pas de scroll ici */
  overflow: visible;         /* ✅ Pas d'overflow ici, scroll parent */
  
  display: flex;
  flex-direction: column;
  transform: scale(0.95);
  transition: transform var(--transition-slow);
  z-index: 1;               /* Au-dessus de l'overlay */
}

.project-modal.active .modal-container {
  transform: scale(1);      /* Animation d'ouverture */
}
```

### Points critiques :
1. **overflow: visible** = ne scroll PAS, c'est le parent qui scroll
2. **max-height: none** = permet au contenu de s'étendre sans limitation
3. **height: auto** = s'adapte au contenu (peut dépasser la hauteur viewport)

---

## 4. CONTENU INTERNE - .modal-content

```css
.modal-content {
  overflow: visible;         /* Pas de scroll ici non plus */
  max-height: none;          /* Pas de limitation */
  padding: var(--space-8);   /* Padding interne */
}

@media (min-width: 768px) {
  .modal-content {
    padding: var(--space-12);  /* Plus grand sur desktop */
  }
}
```

---

## 5. VUE MOBILE - Media Query (max-width: 767px)

```css
@media (max-width: 767px) {
  .project-modal {
    padding: var(--space-4);   /* Padding réduit mobile */
  }

  .modal-container {
    max-height: calc(100vh - 2 * var(--space-4));  /* 🔴 FRICTION MOBILE !*/
    height: auto;
    border-radius: var(--radius-xl);
  }

  .modal-close {
    top: var(--space-4);
    right: var(--space-4);
    width: 36px;
    height: 36px;
  }

  .modal-content {
    padding: var(--space-6);
  }

  .modal-title {
    font-size: var(--text-2xl);
  }
}
```

### ⚠️ FRICTION MOBILE DÉTECTÉE :
- `max-height: calc(100vh - 2 * var(--space-4))` sur `.modal-container` en mobile
- C'est une DOUBLE LIMITATION au scroll !
  - `.project-modal` a `overflow-y: auto`
  - `.modal-container` a `max-height` limité
  - = le contenu peut être tronqué sur mobile si > max-height

---

## 6. OVERLAY - Position Fixe

```css
.modal-overlay {
  position: fixed;           /* ✅ Reste à sa place pendant le scroll */
  inset: 0;                  /* Occupe tout le viewport */
  background: rgba(26, 35, 50, 0.85);
  backdrop-filter: blur(8px);
  cursor: pointer;
  z-index: 0;                /* Derrière le contenu */
}
```

### Bon design : overlay ne se déplace pas avec le scroll du contenu

---

## 7. ÉLÉMENTS VISUELS

```css
.modal-visual {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;      /* Ratio fixe */
  border-radius: var(--radius-xl);
  overflow: hidden;
  background: gradient(...);
  box-shadow: var(--shadow-lg);
}

.modal-visual img,
.modal-visual video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
```

### Points critiques :
1. **aspect-ratio: 16/9** = taille connue, pas de layout shift
2. **overflow: hidden** = contient l'image/vidéo
3. **object-fit: cover** = remplit le conteneur

---

## 8. LOGIQUE JAVASCRIPT - ProjectModal.ts

### A. OUVERTURE DE LA MODAL

```typescript
open(project: Project, triggerElement?: HTMLElement | null) {
  // 1. Sauvegarder l'overflow actuel du body
  this.previousBodyOverflow = document.body.style.overflow;

  // ... [Injection dynamique du contenu]

  // 2. Activer la modal
  this.modal.classList.add('active');

  // 3. LENIS STOP - Arrêter le smooth scroll global
  const lenis = (window as any).lenis;
  if (lenis && typeof lenis.stop === 'function') {
    this.lenisWasActive = true;
    lenis.stop();  // ✅ Permet à la modal de scroller indépendamment
  }

  // 4. FALLBACK : Bloquer le scroll du body en CSS
  document.body.style.overflow = 'hidden';

  // 5. EVENT LISTENERS : Bloquer le scroll de fond
  document.addEventListener('wheel', this.preventBackgroundScrollHandler, { 
    passive: false  // ✅ Important : passive: false pour preventDefault()
  });
  document.addEventListener('touchmove', this.preventBackgroundScrollHandler, { 
    passive: false
  });

  // 6. Accessibility & Focus
  document.addEventListener('keydown', this.keydownHandler);
  initialFocusTarget.focus();
}
```

### B. FERMETURE DE LA MODAL

```typescript
close() {
  // 1. Désactiver la modal
  this.modal.classList.remove('active');

  // 2. Retirer les handlers de prevention du scroll
  document.removeEventListener('wheel', this.preventBackgroundScrollHandler);
  document.removeEventListener('touchmove', this.preventBackgroundScrollHandler);

  // 3. Restaurer l'overflow du body
  document.body.style.overflow = this.previousBodyOverflow;

  // 4. Redémarrer Lenis
  if (this.lenisWasActive) {
    const lenis = (window as any).lenis;
    if (lenis && typeof lenis.start === 'function') {
      lenis.start();  // ✅ Redémarrage du smooth scroll
      this.lenisWasActive = false;
    }
  }

  // 5. Retourner le focus
  if (this.triggerElement) {
    this.triggerElement.focus();
  }

  // 6. Retirer les listeners
  document.removeEventListener('keydown', this.keydownHandler);
}
```

### C. HANDLER DE PREVENTION DU SCROLL DE FOND

```typescript
private handlePreventBackgroundScroll(event: Event) {
  // ✅ Vérifier si modal est ouverte
  if (!this.modal?.classList.contains('active')) return;

  // ✅ Obtenir la cible de l'event
  const target = event.target as HTMLElement;
  
  // ✅ Vérifier si l'event vient de l'INTÉRIEUR de la modal
  const isInsideModal = this.modal.contains(target);

  // Si INSIDE modal = laisser passer le scroll
  if (isInsideModal) {
    return;  // ✅ Permet le scroll interne de la modal
  }

  // Si OUTSIDE modal = bloquer le scroll
  event.preventDefault();  // Nécessite passive: false
}
```

---

## 9. GESTION LENIS - smoothScroll.js

```typescript
export class SmoothScroll {
  constructor() {
    this.lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });
    this.init();
  }

  stop() {
    this.lenis?.stop();  // ✅ Arrête la détection des events wheel/touch
  }

  start() {
    this.lenis?.start();  // ✅ Redémarre la détection
  }
}
```

### Points critiques de Lenis :
1. Lenis intercepte les events `wheel` et `touchmove` GLOBALEMENT
2. Quand modal est ouverte, Lenis doit être STOPPÉ
3. Sinon, Lenis consomme les events et la modal ne peut pas scroller
4. Quand modal ferme, Lenis est REDÉMARRÉ

---

## 10. VERROUILLAGE DU SCROLL BODY

**Via CSS :**
```css
body:has(.project-modal.active) {
  overflow: hidden;  /* Redondant mais assurant */
}
```

**Via JavaScript (dans ProjectModal.ts) :**
```typescript
document.body.style.overflow = 'hidden';  // Ouverture
document.body.style.overflow = this.previousBodyOverflow;  // Fermeture
```

---

## 11. FLUX DE SCROLL COMPLET

```
┌─────────────────────────────────────────────────────┐
│ UTILISATEUR SCROLL DANS LA MODAL                     │
└─────────────────────────────────────────────────────┘
                    ↓
         ┌──────────────────────┐
         │  wheel/touchmove     │
         │  event fires         │
         └──────────────────────┘
                    ↓
    ┌───────────────────────────────┐
    │ handlePreventBackgroundScroll  │
    │ Vérifie: event.target INSIDE? │
    └───────────────────────────────┘
                    ↓
         ┌──────────────┐
         │ INSIDE MODAL │
         │ (continue)   │
         └──────────────┘
                    ↓
    ┌──────────────────────────────────┐
    │ .project-modal {                 │
    │   overflow-y: auto               │
    │ }                                │
    │ → Scroller la modal !            │
    └──────────────────────────────────┘
```

---

## 12. POINTS DE FRICTION IDENTIFIÉS

### A. FRICTION #1 : MODAL-CONTAINER MAX-HEIGHT EN MOBILE

**Fichier :** src/styles/project-modal.css, ligne 296

```css
@media (max-width: 767px) {
  .modal-container {
    max-height: calc(100vh - 2 * var(--space-4));  /* 🔴 FRICTION */
  }
}
```

**Problème :**
- Limite la hauteur du conteneur à ~100vh - 8px
- Si le contenu dépasse, il est tronqué
- DOUBLE scroll si modal > viewport + parent scroll

**Solutions :**
1. Supprimer `max-height` en mobile (garder `height: auto`)
2. Ou utiliser `max-height: none` au lieu

---

### B. FRICTION #2 : PASSIVE EVENT LISTENERS

**Fichier :** src/components/projects/ProjectModal.ts, lignes 126-127

```typescript
document.addEventListener('wheel', this.preventBackgroundScrollHandler, { 
  passive: false  // ✅ Nécessaire pour preventDefault()
});
document.addEventListener('touchmove', this.preventBackgroundScrollHandler, { 
  passive: false  // ✅ Nécessaire pour preventDefault()
});
```

**Bon point :** Correctement implémenté avec `passive: false`

**Attention :** Sur Chrome DevTools, cela peut déclencher des warnings
```
[Violation] Listener added for a 'wheel' event. 
It will be treated as passive due to main thread jank.
```

---

### C. FRICTION #3 : LENIS GLOBAL INTERCEPTION

**Problème :**
- Lenis intercepte TOUS les wheel/touchmove events
- Si `.lenis` n'existe pas ou n'est pas arrêté, la modal ne scroller pas
- Dépendance invisible au module smoothScroll.js

**Mitigation actuelle :**
- Fallback CSS `overflow: hidden` sur body
- Fallback event listeners wheel/touchmove

---

### D. FRICTION #4 : FOCUS & KEYBOARD NAVIGATION

**Fichier :** src/components/projects/ProjectModal.ts, lignes 361-387

```typescript
private handleKeydown(event: KeyboardEvent) {
  if (!this.modal?.classList.contains('active')) return;

  if (event.key === 'Escape') {
    event.preventDefault();
    this.close();  // ✅ Fermer à l'Echap
    return;
  }

  if (event.key !== 'Tab') return;

  // ✅ TAB TRAP : Boucler le focus à l'intérieur de la modal
  this.refreshFocusableElements();
  if (!this.focusableElements.length) return;

  const first = this.focusableElements[0];
  const last = this.focusableElements[this.focusableElements.length - 1];

  if (event.shiftKey) {
    if (document.activeElement === first) {
      event.preventDefault();
      last.focus();  // ✅ Shift+Tab du premier → dernier
    }
  } else if (document.activeElement === last) {
    event.preventDefault();
    first.focus();  // ✅ Tab du dernier → premier
  }
}
```

**Bon point :** Tab trap correctement implémenté

**Potential friction :**
- Scroll au keyboard peut être surprenant
- Touch-action CSS non configurée (peut permettre pinch-zoom)

---

### E. FRICTION #5 : SCROLL LORS DE L'INJECTION DYNAMIQUE

**Fichier :** src/components/projects/ProjectModal.ts, ligne 95

```typescript
this.setupProjectMedia({ project, visualContainer, visualImage, videoContainer, audioContainer });
```

**Problème :**
- L'injection de vidéo/audio dynamique peut causer un reflow
- Si vidéo est grande, peut déclencher un scroll automatique

**Mitigation :**
- Réserver l'espace avec aspect-ratio
- IntersectionObserver pour lazy-load

---

### F. FRICTION #6 : OVERLAY CLIQUABLE

**Fichier :** src/styles/project-modal.css, lignes 33-41

```css
.modal-overlay {
  position: fixed;  /* ✅ Correct */
  inset: 0;
  background: rgba(26, 35, 50, 0.85);
  cursor: pointer;
  z-index: 0;
}
```

**Bon point :** Fixed positioning = ne se déplace pas
**Listeners :** src/components/projects/ProjectModal.ts, ligne 32

```typescript
this.overlay?.addEventListener('click', () => this.close());
```

**Attention :**
- L'overlay est positioned au-dessus du scroll (z-index: 0 vs 1 de modal-container)
- Peut être difficile de scroller près des bords

---

## 13. INTERACTIONS ENTRE OVERFLOW/HEIGHT/MAX-HEIGHT

```
┌─────────────────────────────────────────────────────┐
│ .project-modal                                      │
│ position: fixed | inset: 0 | overflow-y: auto      │
│ (SCROLL CONTAINER)                                  │
├─────────────────────────────────────────────────────┤
│ ┌───────────────────────────────────────────────────┐│
│ │ .modal-container                                  ││
│ │ position: relative | height: auto | overflow: vis││
│ │ max-height: none (desktop) | max-height: calc()  ││
│ │                              (mobile)             ││
│ │ (FLEX CONTAINER - NO SCROLL HERE)                ││
│ ├───────────────────────────────────────────────────┤│
│ │ ┌─────────────────────────────────────────────────┐││
│ │ │ .modal-content                                  │││
│ │ │ overflow: visible | max-height: none | flex col│││
│ │ │ (NO SCROLL HERE)                               │││
│ │ ├─────────────────────────────────────────────────┤││
│ │ │ [Contenu dynamique]                            │││
│ │ │ - modal-header                                 │││
│ │ │ - modal-body { flex-direction: column }        │││
│ │ │   - modal-visual { 16:9 aspect }              │││
│ │ │   - modal-description                          │││
│ │ │   - modal-video [optional]                    │││
│ │ │   - modal-audio [optional]                    │││
│ │ │   - modal-stats [optional]                    │││
│ │ └─────────────────────────────────────────────────┘││
│ └───────────────────────────────────────────────────┘│
│                                                       │
│ ↑↓ SCROLL VERTICAL ICI SEULEMENT                     │
└─────────────────────────────────────────────────────┘
```

### Règles critiques :

1. **SEUL .project-modal a overflow-y: auto**
   - .modal-container = overflow: visible
   - .modal-content = overflow: visible

2. **MOBILE : Attention à max-height sur .modal-container**
   - Peut créer double-scroll
   - Ou tronquer le contenu

3. **Pas de max-height sur .modal-content**
   - Permet la croissance libre du contenu

---

## 14. PROCESSUS COMPLET D'OUVERTURE

```
[Utilisateur clique sur projet]
    ↓
[ProjectModal.open() appelé]
    ↓
[1. Sauvegarder body overflow]
    ↓
[2. Injecter contenu projet dans modal]
    ↓
[3. Ajouter classe .active à .project-modal]
    ↓
[4. Lenis.stop() si Lenis actif]
    ↓
[5. body.style.overflow = 'hidden']
    ↓
[6. Ajouter event listeners : wheel, touchmove]
    ↓
[7. Ajouter event listener : keydown (Escape, Tab)]
    ↓
[8. Modal visible et scrollable]
    ↓
[Utilisateur scroll DANS modal]
    → .project-modal { overflow-y: auto } scroller
    → handlePreventBackgroundScroll() laisse passer
    ↓
[Utilisateur clique sur overlay ou Escape]
    ↓
[ProjectModal.close() appelé]
    ↓
[1. Retirer classe .active]
    ↓
[2. Retirer event listeners : wheel, touchmove]
    ↓
[3. Restaurer body.style.overflow]
    ↓
[4. Lenis.start() si était actif]
    ↓
[5. Retourner focus à trigger element]
    ↓
[6. Retirer event listener : keydown]
    ↓
[Modal fermée, page scrollable à nouveau]
```

---

## 15. CHECKLIST DE TESTS

### Desktop :
- [ ] Modal s'ouvre sans saccade
- [ ] Scroll lisse dans la modal (Lenis actif)
- [ ] Click overlay = ferme
- [ ] Escape = ferme
- [ ] Page ne scroll pas (overflow hidden)
- [ ] Tab/Shift+Tab boucle dans modal
- [ ] Focus reste dans modal

### Mobile (< 768px) :
- [ ] Modal s'ouvre en plein écran
- [ ] ATTENTION : max-height: calc(100vh - 8px) sur .modal-container
  - Contenu ne tronqué ?
  - Scroll fonctionne ?
- [ ] Touch swipe ne scroll pas le fond
- [ ] Bouton fermer accessible
- [ ] Pas de double scroll

### Touch / Gesture :
- [ ] Scroll momentum iOS fonctionne (-webkit-overflow-scrolling)
- [ ] Pas de rubber-band (overscroll-behavior: contain)
- [ ] Pull-to-refresh bloqué (overscroll-behavior)

---

## RÉSUMÉ DES POINTS CRITIQUES

| Point | Niveau | Localisation | Solution |
|-------|--------|--------------|----------|
| Modal ne scroll pas | Critique | ProjectModal.ts, Lenis.stop() | Arrêter Lenis, fallback wheel/touchmove |
| Double scroll mobile | Haute | project-modal.css:296 | Supprimer max-height en mobile |
| Fond scroll visible | Haute | ProjectModal.ts:394-407 | Event listener avec passive: false |
| Focus trap absent | Moyenne | ProjectModal.ts:361+ | Implémenté, bon |
| Lenis non disponible | Basse | ProjectModal.ts:112 | Fallback CSS overflow + handlers |
| Contenu tronqué mobile | Moyenne | project-modal.css:296 | max-height doit être ajustée |

