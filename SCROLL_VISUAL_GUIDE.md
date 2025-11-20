# GUIDE VISUEL SYSTÈME DE SCROLL MODAL

## DIAGRAMME D'ARCHITECTURE COMPLÈTE

```
┌─────────────────────────────────────────────────────────────────┐
│                         VIEWPORT (100vh)                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  .project-modal {                                                 │
│    position: fixed (100vw × 100vh)                              │
│    overflow-y: auto  ← SEUL élément qui scroll                  │
│    z-index: 1000                                                 │
│    display: flex                                                  │
│    align-items: flex-start                                       │
│    justify-content: center                                       │
│                                                                   │
│    ┌───────────────────────────────────────────────────────┐   │
│    │ .modal-overlay {                                      │   │
│    │   position: fixed (z: 0)                              │   │
│    │   Cliquer pour fermer                                 │   │
│    │   Fond semi-transparent blur                          │   │
│    │ }                                                     │   │
│    └───────────────────────────────────────────────────────┘   │
│                                                                   │
│    ┌───────────────────────────────────────────────────────┐   │
│    │ .modal-container (z: 1)                               │   │
│    │ - width: min(960px, 100%)                             │   │
│    │ - height: auto (peut > viewport)                      │   │
│    │ - overflow: visible (NO scroll)                       │   │
│    │ - position: relative                                  │   │
│    │                                                        │   │
│    │ ┌─────────────────────────────────────────────────┐  │   │
│    │ │ .modal-close (position: absolute, top/right) │  │   │
│    │ │ [X]                                             │  │   │
│    │ └─────────────────────────────────────────────────┘  │   │
│    │                                                        │   │
│    │ ┌─────────────────────────────────────────────────┐  │   │
│    │ │ .modal-content (flex column)                   │  │   │
│    │ │ overflow: visible                               │  │   │
│    │ │ max-height: none                                │  │   │
│    │ │                                                  │  │   │
│    │ │ .modal-header                                   │  │   │
│    │ │ ├─ .modal-tags                                  │  │   │
│    │ │ │  └─ [Hymne officiel]                          │  │   │
│    │ │ ├─ .modal-title                                 │  │   │
│    │ │ │  └─ "Titre du projet..."                      │  │   │
│    │ │ └─ .modal-subtitle                              │  │   │
│    │ │    └─ "Client · Année · Lieu"                   │  │   │
│    │ │                                                  │  │   │
│    │ │ .modal-body (flex column)                        │  │   │
│    │ │ │                                                │  │   │
│    │ │ ├─ .modal-visual                                │  │   │
│    │ │ │  └─ <img> aspect 16:9 (no scroll!)           │  │   │
│    │ │ │                                                │  │   │
│    │ │ ├─ .modal-description                           │  │   │
│    │ │ │  └─ <p>* pararaphes dynamiques                │  │   │
│    │ │ │     peuvent être très longs                   │  │   │
│    │ │ │                                                │  │   │
│    │ │ ├─ .modal-video (display: none ou block)        │  │   │
│    │ │ │  └─ [Lecteur vidéo injecté]                   │  │   │
│    │ │ │                                                │  │   │
│    │ │ ├─ .modal-audio (display: none ou block)        │  │   │
│    │ │ │  └─ [Lecteur audio injecté]                   │  │   │
│    │ │ │                                                │  │   │
│    │ │ └─ .modal-stats (display: none ou block)        │  │   │
│    │ │    └─ [Grille d'infos dynamique]                │  │   │
│    │ │                                                  │  │   │
│    │ └─────────────────────────────────────────────────┘  │   │
│    │                                                        │   │
│    └───────────────────────────────────────────────────────┘   │
│                                                                   │
│  ↑↓ SCROLL VERTICAL ICI UNIQUEMENT                              │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## COMPARAISON : DESKTOP VS MOBILE

### DESKTOP (> 768px)

```
┌──────────────────────────────┐
│ .project-modal               │
│ overflow-y: auto             │
│ padding: 32px (--space-8)    │
│                              │
│ ┌────────────────────────────┐
│ │ .modal-container           │
│ │ width: min(960px, 100%)    │
│ │ height: auto (peut > 100vh)│
│ │ max-height: none ✅        │
│ │ overflow: visible          │
│ │                            │
│ │ [Modal Content]            │
│ │ Peut être très long        │
│ │ Utilisateur scroll dans    │
│ │ le modal                   │
│ │                            │
│ │ [... très long contenu ...]│
│ └────────────────────────────┘
│                              │
│ ↑↓ SCROLL ICI                │
└──────────────────────────────┘
```

### MOBILE (< 768px) - FRICTION !

```
┌──────────────────────────┐
│ .project-modal           │
│ overflow-y: auto         │
│ padding: 16px            │
│ height: 100vh            │
│                          │
│ ┌────────────────────────┐
│ │ .modal-container       │
│ │ max-height:            │
│ │  calc(100vh -          │
│ │  2 * 16px)  🔴 LIMIT  │
│ │ height: auto           │
│ │ overflow: visible      │
│ │                        │
│ │ [Modal Content]        │
│ │ [Max ~100vh - 32px]    │
│ │                        │
│ │ ⚠️ Contenu > limite?   │
│ │ Double scroll!         │
│ └────────────────────────┘
│                          │
│ ↑↓ SCROLL ICI            │
└──────────────────────────┘
```

---

## CYCLE DE VIE COMPLET

### ÉTAT 1 : FERMÉ (par défaut)

```
┌─────────────────────────────────────────────┐
│ Page principale scrollable                  │
│                                              │
│ .project-modal {                             │
│   display: none  ← INVISIBLE                │
│   opacity: 0                                 │
│ }                                            │
│                                              │
│ body {                                       │
│   overflow: auto  ← PAGE SCROLLABLE         │
│ }                                            │
│                                              │
│ [Contenu page visible]                      │
│ [Utilisateur peut scroller]                 │
│ [Utilisateur peut cliquer partout]          │
└─────────────────────────────────────────────┘
```

### ÉTAT 2 : OUVERTURE (transition)

```
[Utilisateur clique : "Voir projet"]
           ↓
[ProjectModal.open(project)]
           ↓
1. this.previousBodyOverflow = document.body.style.overflow
   (Sauvegarder l'état)
           ↓
2. Injecter contenu projet dynamique
   (tagEl, titleEl, description, visual, etc.)
           ↓
3. this.modal.classList.add('active')
   .project-modal {
     display: flex
     opacity: 1  ← FADE IN
   }
           ↓
4. Lenis.stop()  ← Arrêter smooth scroll global
   (Important pour permettre modal scroll)
           ↓
5. document.body.style.overflow = 'hidden'
   (Bloquer page background)
           ↓
6. addEventListener('wheel', ...)
   addEventListener('touchmove', ...)
   (Handlers de prévention)
           ↓
7. addEventListener('keydown', ...)
   (Escape key, Tab trap)
           ↓
[MODAL OUVERTE ET PRÊTE]
```

### ÉTAT 3 : OUVERT & SCROLLABLE

```
┌─────────────────────────────────────────────┐
│ .project-modal {                             │
│   position: fixed, inset: 0                 │
│   display: flex                              │
│   opacity: 1                                 │
│   overflow-y: auto  ← SCROLLING ICI!        │
│                                              │
│   [Overlay fixed z:0]                        │
│   [Modal container relative z:1]             │
│   [Contenu interne]                          │
│ }                                            │
│                                              │
│ [UTILISATEUR SCROLL]                         │
│      ↓                                        │
│ wheel/touchmove event fire                   │
│      ↓                                        │
│ handlePreventBackgroundScroll()              │
│ → Si event INSIDE modal → laisse passer     │
│ → Si event OUTSIDE modal → preventDefault()  │
│      ↓                                        │
│ .project-modal scroller (overflow-y: auto) │
│                                              │
│ body {                                       │
│   overflow: hidden  ← PAGE NE SCROLL PAS    │
│ }                                            │
└─────────────────────────────────────────────┘
```

### ÉTAT 4 : FERMETURE (transition)

```
[Utilisateur clique X ou overlay ou Escape]
           ↓
[ProjectModal.close()]
           ↓
1. this.modal.classList.remove('active')
   .project-modal {
     opacity: 0  ← FADE OUT
     display: none (après transition)
   }
           ↓
2. removeEventListener('wheel', ...)
   removeEventListener('touchmove', ...)
   removeEventListener('keydown', ...)
   (Nettoyer les handlers)
           ↓
3. document.body.style.overflow = this.previousBodyOverflow
   (Restaurer l'état original)
           ↓
4. if (this.lenisWasActive) {
     Lenis.start()  ← Redémarrer smooth scroll
   }
           ↓
5. this.triggerElement.focus()
   (Retourner le focus)
           ↓
[MODAL FERMÉE & PAGE NORMALE]
```

---

## FLUX D'EVENTS SCROLL DÉTAILLÉ

```
UTILISATEUR SCROLL AVEC SOURIS (wheel)
           ↓
┌──────────────────────────────────────────┐
│ Browser fires 'wheel' event on document  │
│ event.target = <element sous la souris>  │
└──────────────────────────────────────────┘
           ↓
┌──────────────────────────────────────────┐
│ handlePreventBackgroundScroll(event)     │
│ {                                        │
│   if (!modal.classList.contains(        │
│       'active'))                        │
│     return;  ← Modal fermée = do nothing│
│                                          │
│   const target = event.target;           │
│   const isInsideModal = modal.contains(  │
│       target);                           │
│                                          │
│   if (isInsideModal) {                   │
│     return;  ← ALLOW scroll inside      │
│   }                                      │
│                                          │
│   event.preventDefault();  ← BLOCK       │
│ }                                        │
└──────────────────────────────────────────┘
           ↓
       DEUX CAS :
           ├─ INSIDE MODAL (e.g. .modal-content)
           │  └─ Continue → .project-modal scroller
           │
           └─ OUTSIDE MODAL (e.g. overlay, outside)
              └─ Blocked → preventDefault()

┌──────────────────────────────────────────┐
│ .project-modal {                         │
│   overflow-y: auto  ← Handle scroll    │
│ }                                        │
│                                          │
│ Lenis n'interfère PAS car .stop()      │
│ a été appelé à l'ouverture              │
└──────────────────────────────────────────┘
```

---

## LENIS INTERACTION GRAPH

```
SANS MODAL (Normal page scroll)
  Lenis.start() = ACTIVE
         ↓
  wheel/touchmove events → Lenis intercepts
         ↓
  Lenis does smooth scroll magic
         ↓
  Page scrolls smoothly


MODAL OUVERTE
  Lenis.stop() = PAUSED
         ↓
  wheel/touchmove events → Lenis IGNORES
         ↓
  handlePreventBackgroundScroll() checks
         ↓
  if (inside modal) {
    .project-modal { overflow-y: auto }
      → Scroll modal directly (browser native)
  } else {
    preventDefault() → No scroll
  }
         ↓
  Modal scrolls with native scroll (not smooth)
  Background page frozen


MODAL FERME
  Lenis.start() = REACTIVATED
         ↓
  wheel/touchmove events → Lenis intercepts
         ↓
  Lenis smooth scroll = RESTORED
         ↓
  Page scrolls smoothly again
```

---

## Z-INDEX LAYER STACK

```
┌─────────────────────────────────┐
│ z: 10000+                       │ ← .modal-close (button)
├─────────────────────────────────┤
│ z: 1 (z-index: 1)               │ ← .modal-container (content)
├─────────────────────────────────┤
│ z: 0 (z-index: 0)               │ ← .modal-overlay (backdrop)
├─────────────────────────────────┤
│ z: default (< 0)                │ ← .project-modal (container)
├─────────────────────────────────┤
│ z: < 0                          │ ← Background page content
└─────────────────────────────────┘

Note: .project-modal a z-index: var(--z-modal)
      Mais overlay + container ont z-index interne
```

---

## MATRIX DÉCISIONS SCROLL

```
CONDITION                           COMPORTEMENT
═════════════════════════════════════════════════════════════════
Modal open + wheel/touchmove        event → handlePreventBackground
                                    Scroll() → check target location
────────────────────────────────────────────────────────────────
Event target INSIDE modal           Allow event → .project-modal
                                    { overflow-y: auto }
────────────────────────────────────────────────────────────────
Event target OUTSIDE modal          preventDefault()
                                    Page doesn't scroll
────────────────────────────────────────────────────────────────
Modal closed + wheel/touchmove      Event not intercepted by
                                    handlePreventBackgroundScroll()
                                    → Lenis.start() normal behavior
────────────────────────────────────────────────────────────────
Lenis disabled                      Fallback to browser native scroll
(reduced-motion or touch device)    + CSS overflow: hidden
────────────────────────────────────────────────────────────────
Keyboard scroll (arrow keys)        Handled separately
                                    May bypass handlers
────────────────────────────────────────────────────────────────
Pinch zoom mobile                   overscroll-behavior: contain
                                    Prevents pull-to-refresh
```

---

## ÉLÉMENTS À OBSERVER PENDANT LE TEST

```
VISUEL :
☐ Overlay disparaît progressivement (opacity transition)
☐ Modal-container scale de 0.95 à 1.0
☐ Pas de flicker ou saut
☐ Contenu padding respecté

SCROLL BEHAVIOR :
☐ Premier scroll passe dans modal
☐ Pas de "jerky" scroll (smooth avec Lenis)
☐ Pas de double-scroll momentum
☐ Bottom of content accessible
☐ Top de contenu accessible

MOBILE SPÉCIFIQUE :
☐ Modal plein écran (> max-height removed?)
☐ Bouton close 36×36 accessible
☐ Pas de horizontal scroll
☐ Pull-to-refresh ne déclenche pas (overscroll)

KEYBOARD/ACCESSIBILITY :
☐ Tab boucle dans modal
☐ Escape ferme modal
☐ Focus initial sur premier élément focusable
☐ Focus visible outline visible

LENIS STATE :
☐ Page scroll lisse avant ouverture
☐ Page scroll gelée pendant modal ouverte
☐ Page scroll lisse après fermeture
☐ Pas de lag ou stutter au passage modal
```

