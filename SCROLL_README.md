# ANALYSE COMPLÈTE DU SYSTÈME DE SCROLL MODAL PROJET

## Vue d'ensemble rapide

Vous trouverez ici une analyse complète de l'architecture de scroll de la modal projet. Le système fonctionne selon une architecture à 3 niveaux :

```
┌─────────────────────────────────────┐
│ .project-modal { overflow-y: auto } │ ← SEUL qui scroll
├─────────────────────────────────────┤
│ .modal-container { overflow: visible}│ ← NO scroll
├─────────────────────────────────────┤
│ .modal-content { overflow: visible } │ ← NO scroll
└─────────────────────────────────────┘
```

---

## Fichiers d'analyse disponibles

### 1. SCROLL_QUICK_REFERENCE.md (À LIRE D'ABORD)
**Taille :** ~5 minutes de lecture
**Contient :** 
- Fichiers critiques avec numéros de lignes
- Points de friction majeurs
- Commandes de debug console
- Flux de debug rapide

**Idéal pour :** Chercher rapidement une ligne de code ou déboguer

---

### 2. SCROLL_SYSTEM_ANALYSIS.md (ANALYSE DÉTAILLÉE)
**Taille :** ~15 minutes de lecture
**Contient :**
1. Hiérarchie DOM précise
2. Structure CSS de chaque niveau
3. Configuration Lenis
4. Logique JavaScript complète
5. Gestion du body overflow
6. Flux d'events scroll
7. Points de friction identifiés (6 frictions)
8. Interactions overflow/height/max-height
9. Processus complet d'ouverture
10. Checklist de tests
11. Résumé des points critiques

**Idéal pour :** Comprendre le système en profondeur

---

### 3. SCROLL_VISUAL_GUIDE.md (DIAGRAMMES ASCII)
**Taille :** ~10 minutes de lecture
**Contient :**
- Architecture ASCII
- Comparaison Desktop vs Mobile
- Cycle de vie complet (états)
- Flux d'events détaillé
- Graphique interaction Lenis
- Stack Z-index
- Matrice de décisions
- Éléments à tester

**Idéal pour :** Visualiser le flux et la logique

---

## Les 6 Points de Friction Majeurs

### 1. Mobile Max-Height (FRICTION HAUTE)
```css
/* ❌ PROBLÈME */
@media (max-width: 767px) {
  .modal-container {
    max-height: calc(100vh - 2 * var(--space-4));  /* Limite le contenu */
  }
}

/* ✅ SOLUTION */
/* Supprimer ou mettre max-height: none; */
```

**Localisation :** `src/styles/project-modal.css:296`
**Impact :** Double scroll, contenu tronqué
**Sévérité :** Haute

---

### 2. Lenis Dépendance (FRICTION CRITIQUE)
```typescript
/* ❌ PROBLÈME */
const lenis = (window as any).lenis;
if (lenis && typeof lenis.stop === 'function') {
  this.lenisWasActive = true;
  lenis.stop();  // Dépendance à Lenis
}

/* ✅ FALLBACK */
document.body.style.overflow = 'hidden';
document.addEventListener('wheel', ...);
document.addEventListener('touchmove', ...);
```

**Localisation :** `src/components/projects/ProjectModal.ts:111-127`
**Impact :** Si Lenis absent, scroll peut bloquer
**Sévérité :** Critique (mais avec fallback)

---

### 3. Event Target Checking
```typescript
/* ✅ BON DESIGN */
const isInsideModal = this.modal.contains(target);
if (isInsideModal) {
  return;  // Laisse passer
}
event.preventDefault();  // Bloque
```

**Localisation :** `src/components/projects/ProjectModal.ts:394-407`
**Impact :** Scroll bloqué sur overlay par accident
**Sévérité :** Basse (bien implémenté)

---

### 4. Z-Index Layering
```css
.project-modal { z-index: var(--z-modal); }
.modal-overlay { z-index: 0; }
.modal-container { z-index: 1; }
.modal-close { z-index: 10; }
```

**Localisation :** `src/styles/project-modal.css`
**Impact :** Aucun (par design)
**Sévérité :** Basse

---

### 5. Passive Event Listeners
```typescript
/* ✅ CORRECT */
document.addEventListener('wheel', handler, { passive: false });
document.addEventListener('touchmove', handler, { passive: false });
```

**Localisation :** `src/components/projects/ProjectModal.ts:126-127`
**Impact :** Chrome DevTools warnings (non-bloquant)
**Sévérité :** Basse

---

### 6. Focus & Keyboard Navigation
```typescript
/* ✅ BON */
private handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    this.close();
  }
  // Tab trap bien implémenté (lignes 361-387)
}
```

**Localisation :** `src/components/projects/ProjectModal.ts:361-387`
**Impact :** Bonne accessibilité
**Sévérité :** Basse (bien implémenté)

---

## Flux de Debug Rapide

### Problème : Scroll ne fonctionne pas dans modal

```
✅ Étape 1: Vérifier classe active
   document.getElementById('project-modal').classList.contains('active')
   → doit être TRUE

✅ Étape 2: Vérifier CSS overflow
   Inspecter .project-modal
   → doit avoir overflow-y: auto

✅ Étape 3: Vérifier Lenis arrêté
   console.log(window.lenis)
   → lenis.isRunning doit être false

✅ Étape 4: Vérifier event listeners
   getEventListeners(document).wheel
   → doit voir handlePreventBackgroundScroll

✅ Étape 5: Vérifier body overflow
   document.body.style.overflow
   → doit être 'hidden'
```

### Problème : Fond scroll pas bloqué

```
✅ Étape 1: Scroll depuis HORS de modal
   → handlePreventBackgroundScroll() doit bloquer

✅ Étape 2: Vérifier event target
   Add console.log dans handlePreventBackgroundScroll:
   console.log('target:', event.target, 'isInside:', this.modal.contains(event.target))

✅ Étape 3: Vérifier passive: false
   Sans passive: false, preventDefault() ne marche pas

✅ Étape 4: Test overlay spécifiquement
   Click sur .modal-overlay
   → scroll ne doit pas bouger le fond
```

### Problème : Lenis ne redémarre pas

```
✅ Étape 1: Vérifier lenisWasActive
   Ajouter console.log avant/après lenis.stop()

✅ Étape 2: Vérifier close() appelé
   Ajouter console.log au début de close()

✅ Étape 3: Vérifier lenis accessible
   window.lenis doit exister après module load

✅ Étape 4: Tester page scroll après fermeture
   Scroll doit être lisse (Lenis actif)
```

---

## Checklist Avant Modification

- [ ] Lire SCROLL_QUICK_REFERENCE.md (5 min)
- [ ] Lire section pertinente dans SCROLL_SYSTEM_ANALYSIS.md
- [ ] Consulter SCROLL_VISUAL_GUIDE.md si besoin de flux visuel
- [ ] Identifier fichier cible et ligne à modifier
- [ ] Noter les dépendances (Lenis, handlers, etc.)
- [ ] Préparer tests correspondants

---

## Checklist Après Modification

- [ ] Tests desktop (scroll lisse, Lenis actif)
- [ ] Tests mobile (pas double-scroll, max-height respecté)
- [ ] Tests overlay (fermeture au click)
- [ ] Tests keyboard (Escape, Tab, focus)
- [ ] Tests Lenis restart (après fermeture)
- [ ] Tests focus restore (retour au trigger element)
- [ ] Tests dynamic content (injection vidéo/audio)
- [ ] Tests accessibility (WCAG 2.1)

---

## Fichiers Sources Inspectés

```
index.html
├─ Structure DOM complète
└─ Styles CSS inline (preloader)

src/components/projects/ProjectModal.ts
├─ Logique d'ouverture/fermeture
├─ Gestion Lenis
├─ Handlers scroll prevention
├─ Focus management
└─ Accessibility attributes

src/styles/project-modal.css
├─ .project-modal { overflow-y: auto }
├─ .modal-container { max-height }
├─ .modal-overlay { position: fixed }
├─ Desktop styles
└─ Mobile media query (friction!)

src/scripts/modules/smoothScroll.js
├─ Configuration Lenis
├─ Méthodes stop/start
└─ ScrollTrigger integration

src/scripts/main.js
├─ Initialisation app
├─ Export window.lenis
└─ Accessibility globale

src/scripts/components-efsvp.js
├─ Scroll reveal legacy
├─ Smooth scroll fallback
└─ Tracking
```

---

## Commandes Utiles

### Afficher dans Chrome DevTools

```javascript
// Inspecter modal state
const modal = document.getElementById('project-modal');
{
  isActive: modal.classList.contains('active'),
  overflow: getComputedStyle(modal).overflow,
  overflowY: getComputedStyle(modal).overflowY,
  zIndex: getComputedStyle(modal).zIndex,
  position: getComputedStyle(modal).position
}

// Vérifier Lenis
window.lenis && {
  isRunning: window.lenis.isRunning,
  scroll: window.lenis.scroll,
  velocity: window.lenis.velocity
}

// Voir handlers attachés
{
  wheel: getEventListeners(document).wheel,
  touchmove: getEventListeners(document).touchmove,
  keydown: getEventListeners(document).keydown
}
```

### Ajouter des logs de debug

```typescript
// Dans ProjectModal.ts
console.log('🔒 Modal open - Lenis stopping...');
console.log('✅ Modal closed - Lenis restarting...');
console.log('📍 Prevent scroll check:', {
  modalActive: this.modal?.classList.contains('active'),
  targetInside: isInsideModal,
  action: isInsideModal ? 'ALLOW' : 'BLOCK'
});
```

---

## Ressources Externes

- **Lenis Documentation:** https://lenis.darkroom.engineering/
- **MDN: Overflow:** https://developer.mozilla.org/en-US/docs/Web/CSS/overflow
- **MDN: EventListener Options:** https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
- **WCAG 2.1 Accessibility:** https://www.w3.org/WAI/WCAG21/quickref/

---

## Notes de Conception

Le système de scroll modal fonctionne selon ces principes :

1. **Seul le parent scroll** : `.project-modal` a `overflow-y: auto`
2. **Contenu flexible** : `.modal-container` et `.modal-content` ont `overflow: visible`
3. **Lenis management** : Arrêt lors ouverture, redémarrage lors fermeture
4. **Event interception** : Bloquer wheel/touchmove en dehors modal
5. **Focus trap** : Keyboard Tab reste dans modal
6. **Accessibility** : ARIA attributes, focus management, keyboard support

Ces principes maintiennent la cohérence du système et évitent les bugs de scroll.

---

## FAQ Rapide

**Q: Pourquoi Lenis doit-il être arrêté ?**
A: Lenis intercepte les events wheel/touchmove globalement. S'il n'est pas arrêté, la modal ne peut pas scroller car Lenis consomme les events.

**Q: Pourquoi max-height en mobile ?**
A: Limiter la hauteur pour laisser de l'espace pour le bouton close. Mais ça cause une double-limitation du scroll.

**Q: Pourquoi passive: false sur les listeners ?**
A: Pour pouvoir appeler preventDefault() sur les events wheel/touchmove. Sinon, le browser ignore le preventDefault().

**Q: Pourquoi overlay est fixed ?**
A: Pour rester visuellement en place pendant le scroll du contenu modal. Si overlay scrolle, l'expérience est cassée.

**Q: Comment focus trap fonctionne ?**
A: Détecte Tab/Shift+Tab, vérifie si focus est sur premier/dernier élément focusable, boucle au contraire au lieu de sortir.

---

**Dernière mise à jour :** 2025-11-20
**Fichiers analysés :** 5
**Points de friction identifiés :** 6
**Sections documentées :** 40+

