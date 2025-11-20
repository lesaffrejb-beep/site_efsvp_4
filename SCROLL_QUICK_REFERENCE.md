# RÉFÉRENCE RAPIDE - SYSTÈME DE SCROLL MODAL

## FICHIERS CRITIQUES

### 1. HTML Structure
**Fichier :** `/index.html` (ligne ~250-300)
**Contient :** Structure DOM complète de la modal
```html
<div class="project-modal" id="project-modal">
  <div class="modal-overlay"></div>
  <div class="modal-container">
    <button class="modal-close" id="project-modal-close">...</button>
    <div class="modal-content">
      <div class="modal-header">...</div>
      <div class="modal-body">
        <div class="modal-visual" id="project-modal-visual"></div>
        <div class="modal-description" id="project-modal-description"></div>
        <div class="modal-video" id="project-modal-video"></div>
        <div class="modal-audio" id="project-modal-audio"></div>
        <div class="modal-stats" id="project-modal-stats"></div>
      </div>
    </div>
  </div>
</div>
```

---

### 2. CSS Styles
**Fichier :** `/src/styles/project-modal.css`

**Éléments clés :**
- Ligne 8-30: `.project-modal` - CONTENEUR DE SCROLL PRINCIPAL
  - `position: fixed`
  - `overflow-y: auto` ← SEUL élément qui scroll
  - `overflow-x: hidden`
  - `overscroll-behavior: contain`
  
- Ligne 33-41: `.modal-overlay` - Position fixe pour rester en place
  
- Ligne 44-65: `.modal-container` - CONTENU FLEXIBLE
  - `overflow: visible` ← PAS de scroll ici
  - `height: auto`
  - `max-height: none` (desktop)
  - `max-height: calc(100vh - 2 * var(--space-4))` (mobile) ← FRICTION
  
- Ligne 104-114: `.modal-content` - Contenu interne
  - `overflow: visible`
  - `max-height: none`

- Ligne 290-320: **MEDIA QUERY MOBILE** - Source de la friction
  - `max-height: calc(100vh - 8px)` sur `.modal-container`

- Ligne 335-337: **LOCK BODY SCROLL** (CSS fallback)
  - `body:has(.project-modal.active) { overflow: hidden; }`

---

### 3. TypeScript Logic
**Fichier :** `/src/components/projects/ProjectModal.ts`

**Parties critiques :**

#### OUVERTURE (ligne 35-132)
```typescript
open(project: Project, triggerElement?: HTMLElement | null)
  ├─ Sauvegarde overflow du body (ligne 39)
  ├─ Injection contenu dynamique (ligne 41-95)
  ├─ Activation modal: classList.add('active') (ligne 97)
  ├─ STOP Lenis (ligne 111-118) ⚠️ CRITIQUE
  ├─ CSS overflow: hidden body (ligne 122)
  ├─ Event listeners wheel/touchmove (ligne 126-127) + { passive: false }
  ├─ Event listener keydown (ligne 106)
  └─ Focus management (ligne 101-104)
```

#### FERMETURE (ligne 134-167)
```typescript
close()
  ├─ Supprime classe 'active' (ligne 139)
  ├─ Retire event listeners (ligne 141-145)
  ├─ Restaure overflow du body (ligne 148)
  ├─ RESTART Lenis si était actif (ligne 154-155) ⚠️ CRITIQUE
  ├─ Retourne le focus (ligne 163-165)
  └─ Cleanup (ligne 166)
```

#### HANDLER SCROLL PREVENTION (ligne 394-408)
```typescript
private handlePreventBackgroundScroll(event: Event)
  ├─ Check si modal active (ligne 395)
  ├─ Check si event.target INSIDE modal (ligne 398-399)
  ├─ Si INSIDE: laisse passer (ligne 402-403)
  └─ Si OUTSIDE: preventDefault() (ligne 407)
```

**État Lenis :**
- Ligne 16: `private lenisWasActive = false;` - Track Lenis state
- Ligne 113: `this.lenisWasActive = true;` - Mark as was active
- Ligne 154: `if (this.lenisWasActive)` - Check before restart

---

### 4. Lenis Configuration
**Fichier :** `/src/scripts/modules/smoothScroll.js`

**Config :**
```javascript
new Lenis({
  duration: 1.2,           // Smooth duration
  easing: (t) => ...,      // Custom easing
  direction: 'vertical',
  gestureDirection: 'vertical',
  smooth: true,
  mouseMultiplier: 1,
  smoothTouch: false,      // ⚠️ No smooth on touch
  touchMultiplier: 2,      // Touch scrolls faster
  infinite: false,
})
```

**Contrôle :**
- `lenis.stop()` - Arrête la détection d'events
- `lenis.start()` - Redémarre la détection
- Ligne 219 (main.js): `window.lenis = this.modules.smoothScroll.lenis;` - Global access

---

### 5. Main App Setup
**Fichier :** `/src/scripts/main.js`

**Initialisation Lenis :**
- Ligne 214-221: Init SmoothScroll module
- Ligne 219: Export à `window.lenis`
- Ligne 215-216: Condition: pas de reduced-motion, pas de touch device

**Accessibility globale :**
- Ligne 917-933: Escape key handling (fallback global)

---

## DIAGRAMME DE CONTRÔLE LENIS

```
1. PAGE CHARGÉE
   Lenis.start() = ACTIF
   Page scroll smoothly

2. MODAL OUVRE
   Lenis.stop() = PAUSED (ligne 114 ProjectModal.ts)
   Modal scroll with native browser overflow-y: auto
   Page scroll frozen

3. MODAL FERME
   if (lenisWasActive) Lenis.start() = RESTARTED (ligne 155)
   Page scroll smoothly again
```

---

## POINTS DE FRICTION MAJEURS

### Friction #1: Mobile max-height
**Localisation :** project-modal.css:296
**Problème :** `max-height: calc(100vh - 2 * var(--space-4))`
**Impact :** Double scroll, contenu tronqué mobile
**Fix :** Supprimer ou mettre `max-height: none`

### Friction #2: Lenis dependency
**Localisation :** ProjectModal.ts:111-118
**Problème :** Modal dépend de Lenis.stop()
**Fallback :** CSS overflow + event handlers (lines 122-127)
**Impact :** Si Lenis absent, scroll peut bloquer

### Friction #3: Event target checking
**Localisation :** ProjectModal.ts:398-399
**Problème :** Vérifie event.target INSIDE modal
**Edge case :** Elements dynamiquement injectés
**Solution :** Déjà bien implémentée

### Friction #4: Z-index layering
**Localisation :** project-modal.css: 8, 33, 44, 60, 81
**Problème :** Overlay z:0 vs Container z:1
**Impact :** Pas de friction réelle, par design

### Friction #5: Passive listeners
**Localisation :** ProjectModal.ts:126-127
**Config :** `{ passive: false }` ← Correct pour preventDefault()
**Warning :** Chrome DevTools peut afficher des violations

---

## CHECKLIST INSPECTION

### Avant modification :
- [ ] Tester scroll desktop (lisse)
- [ ] Tester scroll mobile (pas de double scroll)
- [ ] Tester overflow body gelé
- [ ] Tester Lenis restart après fermeture
- [ ] Tester keyboard Escape + Tab
- [ ] Tester overlay click fermeture

### Après modification :
- [ ] Tester scroll modal (should still work)
- [ ] Tester background scroll bloqué
- [ ] Tester dynamic content injection
- [ ] Tester video/audio loading
- [ ] Tester focus restoration
- [ ] Tester Lenis smooth scroll restored

---

## COMMANDES DE DEBUG

### Browser Console - Vérifier l'état

```javascript
// Vérifier Lenis existence
window.lenis
> Lenis { ... }  // Actif

// Vérifier état modal
document.getElementById('project-modal')
  .classList.contains('active')
> true / false

// Vérifier body overflow
document.body.style.overflow
> "hidden" / "" / "auto"

// Émuler click sur projet
const modal = document.getElementById('project-modal');
modal.classList.add('active');  // Override pour test

// Vérifier handlers attachés
getEventListeners(document).wheel
getEventListeners(document).touchmove
getEventListeners(document).keydown
```

### Visual Debug Markers

Ajouter temporairement en CSS pour visualiser :
```css
.project-modal { outline: 3px solid red; }
.modal-container { outline: 3px solid blue; }
.modal-content { outline: 3px solid green; }
.modal-overlay { outline: 3px solid yellow; }
```

---

## FICHIERS DE RÉFÉRENCE CRÉÉS

1. **SCROLL_SYSTEM_ANALYSIS.md** - Analyse complète (14 sections)
2. **SCROLL_VISUAL_GUIDE.md** - Diagrammes ASCII et flux (9 sections)
3. **SCROLL_QUICK_REFERENCE.md** - Ce fichier (référence rapide)

---

## FLUX DE DEBUG RAPIDE

### Scroll ne fonctionne pas dans modal ?
1. Vérifier `.project-modal.active` classe appliquée
2. Vérifier CSS `overflow-y: auto` sur `.project-modal`
3. Vérifier Lenis.stop() appelé
4. Vérifier event listeners attachés
5. Vérifier body overflow: hidden

### Fond scroll pas bloqué ?
1. Vérifier event listeners wheel + touchmove
2. Vérifier handlePreventBackgroundScroll() appelé
3. Vérifier event.target checking logic
4. Vérifier `passive: false` sur listeners
5. Vérifier CSS body:has(.project-modal.active) { overflow: hidden }

### Lenis ne redémarre pas après modal fermeture ?
1. Vérifier lenisWasActive flag
2. Vérifier close() appellé
3. Vérifier `if (this.lenisWasActive)` condition
4. Vérifier lenis.start() callable
5. Vérifier window.lenis exists

### Focus/Tab ne boucle pas ?
1. Vérifier refreshFocusableElements() appelé
2. Vérifier focusableElements[] non vide
3. Vérifier first/last elements en DOM
4. Vérifier event.preventDefault() appelé
5. Vérifier focus() method appelée

---

## RÉSUMÉ POUR PR/COMMITS

**Si vous modifiez le scroll :**

Mentionner :
- Tests sur desktop + mobile
- Vérifier Lenis stop/start
- Vérifier event handlers attachement/détachement
- Vérifier body overflow restore
- Tester focus management
- Vérifier overscroll-behavior mobile

