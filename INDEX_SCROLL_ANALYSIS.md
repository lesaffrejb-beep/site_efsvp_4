# TABLE DES MATIÈRES - ANALYSE SYSTÈME DE SCROLL MODAL

## Documents de Référence (ordonnés par priorité de lecture)

### 1. SCROLL_README.md ⭐ START HERE
**Durée :** 5-10 min | **Taille :** 387 lignes
**Contenu :** Vue d'ensemble, navigation, points clés

**Commencez par :** 
- Section "Vue d'ensemble rapide"
- Section "Fichiers d'analyse disponibles"
- Section "Les 6 Points de Friction Majeurs"

---

### 2. SCROLL_QUICK_REFERENCE.md ⚡ RAPIDE
**Durée :** 5 min | **Taille :** 304 lignes
**Contenu :** Fichiers critiques, ligne par ligne

**Consultez pour :**
- Trouver un fichier source (avec numéro de ligne)
- Déboguer rapidement
- Vérifier une friction spécifique
- Accéder au debug console commands

**Sections clés :**
- "Fichiers critiques" (1-5)
- "Points de friction majeurs" (6 frictions)
- "Flux de debug rapide"
- "Commandes de debug"

---

### 3. SCROLL_SYSTEM_ANALYSIS.md 📚 APPROFONDI
**Durée :** 15-20 min | **Taille :** 689 lignes
**Contenu :** Analyse technique complète

**Consultez pour :**
- Comprendre l'architecture en détail
- Étudier le flux complet
- Analyser les interactions
- Préparer des modifications

**14 Sections :**
1. Hiérarchie DOM précise
2. Conteneur de scroll (.project-modal)
3. Conteneur de contenu (.modal-container)
4. Contenu interne (.modal-content)
5. Vue mobile (media query)
6. Overlay - Position fixe
7. Éléments visuels
8. Logique JavaScript (ProjectModal.ts)
9. Gestion Lenis (smoothScroll.js)
10. Verrouillage du scroll body
11. Flux de scroll complet
12. Points de friction identifiés (6 détaillés)
13. Interactions overflow/height/max-height
14. Processus complet d'ouverture
15. Checklist de tests
16. Résumé des points critiques

---

### 4. SCROLL_VISUAL_GUIDE.md 🎨 DIAGRAMMES
**Durée :** 10-15 min | **Taille :** 437 lignes
**Contenu :** Diagrammes ASCII, flux visuels

**Consultez pour :**
- Visualiser l'architecture
- Comprendre le cycle de vie
- Voir les interactions Lenis
- Observer les flux d'events

**9 Sections visuelles :**
1. Diagramme d'architecture complète
2. Comparaison Desktop vs Mobile
3. Cycle de vie complet (4 états)
4. Flux d'events scroll détaillé
5. Graphique interaction Lenis
6. Z-index layer stack
7. Matrix de décisions
8. Éléments à tester

---

## Localisation des Problèmes

### Problème: Scroll ne fonctionne pas dans modal
```
Consulter:
├─ SCROLL_QUICK_REFERENCE.md → "Flux de debug rapide" → "Scroll ne fonctionne..."
├─ SCROLL_SYSTEM_ANALYSIS.md → Section 8 (JavaScript logic)
└─ SCROLL_VISUAL_GUIDE.md → "Flux d'events scroll détaillé"
```

### Problème: Fond scroll pas bloqué
```
Consulter:
├─ SCROLL_QUICK_REFERENCE.md → "Friction #3: Event target checking"
├─ SCROLL_SYSTEM_ANALYSIS.md → Section 12.C (Handler prevention)
└─ SCROLL_VISUAL_GUIDE.md → "Flux d'events scroll détaillé"
```

### Problème: Lenis ne redémarre pas
```
Consulter:
├─ SCROLL_QUICK_REFERENCE.md → "Lenis dependency"
├─ SCROLL_SYSTEM_ANALYSIS.md → Section 9 (Lenis configuration)
└─ SCROLL_VISUAL_GUIDE.md → "Graphique interaction Lenis"
```

### Problème: Double scroll ou contenu tronqué en mobile
```
Consulter:
├─ SCROLL_QUICK_REFERENCE.md → "Friction #1: Mobile max-height"
├─ SCROLL_SYSTEM_ANALYSIS.md → Section 5 (Vue mobile)
└─ SCROLL_VISUAL_GUIDE.md → "Comparaison Desktop vs Mobile"
```

### Problème: Focus ne boucle pas au Tab
```
Consulter:
├─ SCROLL_QUICK_REFERENCE.md → "Friction #6: Focus navigation"
├─ SCROLL_SYSTEM_ANALYSIS.md → Section 8.D (Focus trap)
└─ SCROLL_QUICK_REFERENCE.md → "Focus/Tab ne boucle pas ?"
```

---

## Navigation par Fichier Source

### src/components/projects/ProjectModal.ts
```
SCROLL_QUICK_REFERENCE.md → Section "3. TypeScript Logic"
SCROLL_SYSTEM_ANALYSIS.md → Section "8. Logique JavaScript"
```

**Parties critiques :**
- Ligne 35-132: open() method
- Ligne 111-118: Lenis.stop() ⚠️ CRITIQUE
- Ligne 126-127: Event listeners setup
- Ligne 134-167: close() method
- Ligne 154-155: Lenis.start() ⚠️ CRITIQUE
- Ligne 394-407: handlePreventBackgroundScroll() ⚠️ FRICTION

### src/styles/project-modal.css
```
SCROLL_QUICK_REFERENCE.md → Section "2. CSS Styles"
SCROLL_SYSTEM_ANALYSIS.md → Section "2-5. CSS Architecture"
SCROLL_VISUAL_GUIDE.md → "Diagramme d'architecture"
```

**Parties critiques :**
- Ligne 8-30: .project-modal ✅ overflow-y: auto
- Ligne 44-65: .modal-container ⚠️ NO overflow
- Ligne 296: Mobile max-height ❌ FRICTION #1

### src/scripts/modules/smoothScroll.js
```
SCROLL_QUICK_REFERENCE.md → Section "4. Lenis Configuration"
SCROLL_SYSTEM_ANALYSIS.md → Section "9. Gestion Lenis"
SCROLL_VISUAL_GUIDE.md → "Graphique interaction Lenis"
```

**Parties critiques :**
- Ligne 104-106: stop() method
- Ligne 108-110: start() method
- Ligne 14-27: Lenis configuration

### src/scripts/main.js
```
SCROLL_QUICK_REFERENCE.md → Section "5. Main App Setup"
SCROLL_SYSTEM_ANALYSIS.md → Section "3. Configuration Lenis"
```

**Parties critiques :**
- Ligne 214-221: SmoothScroll initialization
- Ligne 219: window.lenis export

---

## Matrix de Décision Rapide

| Situation | Consulter | Lire |
|-----------|-----------|------|
| Scroll ne marche pas | QUICK_REF | "Flux debug rapide" + Ligne 8-30 CSS |
| Lenis bloque | QUICK_REF | "Lenis dependency" + Ligne 111-118 TS |
| Mobile cassé | QUICK_REF | "Mobile max-height" + Ligne 296 CSS |
| Event listener? | ANALYSIS | Section 8 + 12.C |
| Focus trap? | ANALYSIS | Section 8.D |
| Comprendre flux | VISUAL | "Cycle de vie" + "Flux events" |
| Déboguer maintenant | QUICK_REF | "Commandes de debug" |
| Tester modification | README | "Checklist après modification" |

---

## Recherche par Mot-clé

### "overflow"
- SCROLL_SYSTEM_ANALYSIS.md: Section 13 (interactions)
- SCROLL_QUICK_REFERENCE.md: Section 2 (CSS Styles)
- SCROLL_VISUAL_GUIDE.md: Architecture diagram

### "Lenis"
- SCROLL_QUICK_REFERENCE.md: Section 4 + "Friction #2"
- SCROLL_SYSTEM_ANALYSIS.md: Section 9
- SCROLL_VISUAL_GUIDE.md: "Graphique interaction Lenis"

### "event listener"
- SCROLL_QUICK_REFERENCE.md: Section 3
- SCROLL_SYSTEM_ANALYSIS.md: Section 11 + 12.C

### "max-height"
- SCROLL_QUICK_REFERENCE.md: "Friction #1"
- SCROLL_SYSTEM_ANALYSIS.md: Section 5 + 13

### "focus trap" ou "Tab"
- SCROLL_QUICK_REFERENCE.md: Section 3 + "Focus/Tab..."
- SCROLL_SYSTEM_ANALYSIS.md: Section 8.D

### "preventDefault"
- SCROLL_QUICK_REFERENCE.md: Section 3 + "Friction #2"
- SCROLL_SYSTEM_ANALYSIS.md: Section 8.C

### "Z-index"
- SCROLL_QUICK_REFERENCE.md: "Friction #4"
- SCROLL_VISUAL_GUIDE.md: "Z-index layer stack"

---

## Timeline Recommandée de Lecture

### Si vous avez 5 minutes :
1. SCROLL_README.md → Vue d'ensemble + 6 frictions
2. SCROLL_QUICK_REFERENCE.md → Fichiers critiques

### Si vous avez 15 minutes :
1. SCROLL_README.md (tout)
2. SCROLL_QUICK_REFERENCE.md (tout)
3. SCROLL_VISUAL_GUIDE.md → Architecture + Cycle de vie

### Si vous avez 30 minutes :
1. SCROLL_README.md (tout)
2. SCROLL_QUICK_REFERENCE.md (tout)
3. SCROLL_SYSTEM_ANALYSIS.md → Sections 1-5, 8-9, 12
4. SCROLL_VISUAL_GUIDE.md → Toutes sections

### Si vous modifiez le code :
1. SCROLL_README.md → Checklist avant/après
2. SCROLL_QUICK_REFERENCE.md → Section pertinente + debug
3. SCROLL_SYSTEM_ANALYSIS.md → Section complète du module
4. SCROLL_VISUAL_GUIDE.md → Flux concerné

---

## Commandes Rapides

### Vérifier état modal
```javascript
const m = document.getElementById('project-modal');
{ active: m.classList.contains('active'),
  overflow: getComputedStyle(m).overflowY,
  display: getComputedStyle(m).display }
```

### Vérifier Lenis
```javascript
window.lenis && { 
  active: window.lenis.isRunning,
  scroll: window.lenis.scroll,
  velocity: window.lenis.velocity
}
```

### Vérifier handlers
```javascript
{ 
  wheel: getEventListeners(document).wheel?.length,
  touchmove: getEventListeners(document).touchmove?.length,
  keydown: getEventListeners(document).keydown?.length
}
```

---

## Fichiers d'Analyse Créés

### Structure des répertoires :
```
/home/user/site_efsvp_4/
├─ INDEX_SCROLL_ANALYSIS.md          ← Vous êtes ici
├─ SCROLL_README.md                  ← Commencez ici
├─ SCROLL_QUICK_REFERENCE.md         ← Référence rapide
├─ SCROLL_SYSTEM_ANALYSIS.md         ← Analyse détaillée
├─ SCROLL_VISUAL_GUIDE.md            ← Diagrammes visuels
│
├─ index.html                        (source)
├─ src/components/projects/ProjectModal.ts    (source)
├─ src/styles/project-modal.css               (source)
├─ src/scripts/modules/smoothScroll.js        (source)
└─ src/scripts/main.js                       (source)
```

---

## Notes Finales

- Tous les documents contiennent des renvois croisés (👈 voir plus haut)
- Les numéros de ligne correspondent aux fichiers sources
- Les friction sont classées par sévérité (❌ haute, ⚠️ critique, ✅ bon)
- Les diagrammes ASCII permettent de visualiser sans coder
- Les commandes de debug fonctionnent dans Chrome DevTools

**Bonne lecture !**

---

**Créé :** 2025-11-20
**Documents :** 4 fichiers | ~1800 lignes | 63KB
**Sources analysées :** 5 fichiers | ~260 KB
**Points identifiés :** 6 frictions + 40+ sections documentées

