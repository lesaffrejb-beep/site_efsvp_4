# Guide Complet du Système de Player Vidéo - EfSVP

Bienvenue! Cette documentation explique le système de lecteur vidéo pour les projets EfSVP.

## Fichiers de Documentation

Cette analyse inclut 3 fichiers markdown:

### 1. **ANALYSE_VIDEO_PLAYER.md** (22 KB)
Documentation complète et détaillée du système avec:
- Architecture globale et structure fichiers
- Flux complet de chargement vidéo (3 phases)
- Résolution des chemins vidéo
- Structure des données des projets
- Logique d'initialisation et de lecture
- Tous les event handlers HTML5 video
- Gestion du loading/spinner
- Intégration avec ProjectModal
- Destruction du player
- Diagramme complet du flux
- Erreurs courantes et solutions
- Checkpoints de fonctionnement

**Lire d'abord pour:** Comprendre le système en profondeur

---

### 2. **FICHIERS_VIDEO_PLAYER.md** (7 KB)
Index de tous les fichiers clés avec:
- Chemins absolus de tous les modules JS/TS
- Chemins absolus de tous les styles CSS
- Chemins absolus des données JSON
- Description du contenu de chaque fichier
- Fonctions principales par fichier
- Résumé des chemins clés
- Flow de chargement rapide
- Issues actuelles à noter

**Lire pour:** Localiser rapidement les fichiers à modifier

---

### 3. **DIAGRAMMES_VIDEO_PLAYER.md** (32 KB)
Diagrammes visuels et ASCII art:
- Architecture générale
- Flux de résolution des chemins
- Cycle de vie du player
- Timeline des événements vidéo
- Flux des contrôles utilisateur
- Gestion du loading/spinner
- Architecture des fichiers vidéo
- Structure HTML du player
- Flux d'intégration avec modal
- Priorités de médias

**Lire pour:** Visualiser les flux et l'architecture

---

## Démarrage Rapide

### Comprendre le flux

```
1. Données → projects.json (contient config vidéo)
           ↓
2. Loader → projects.loader.ts (résout chemins vidéo)
           ↓
3. Modal → ProjectModal.ts (ouvre et affiche vidéo)
           ↓
4. Player → projectVideoPlayer.js (crée interface)
           ↓
5. HTML5 → <video> élément + contrôles custom
           ↓
6. Events → play, timeupdate, progress, error, etc.
```

### Fichiers clés

```javascript
// Création du player
/home/user/site_efsvp_4/src/scripts/modules/projectVideoPlayer.js

// Container modal
/home/user/site_efsvp_4/src/components/projects/ProjectModal.ts

// Résolution chemins vidéo
/home/user/site_efsvp_4/src/data/projects.loader.ts

// Styles du player
/home/user/site_efsvp_4/src/styles/video-player.css

// Données des projets
/home/user/site_efsvp_4/content/projects.json

// Types TypeScript
/home/user/site_efsvp_4/src/types/project.ts
```

---

## Points Clés à Comprendre

### 1. Résolution des Chemins Vidéo

Les chemins vidéo sont résolus en 3 priorités:

```javascript
// Priorité 1: Chemin explicite
project.video.files.mp4
  ou
project.media.video

// Priorité 2: Chemin standard (déterministe)
/assets/videos/projects/${slug}/video.mp4
```

**Fichier clé:** `src/data/projects.loader.ts` (fonction `resolveProjectVideo`)

### 2. Stockage des Métadonnées Vidéo

Les métadonnées vidéo sont structurées dans `content/projects.json`:

```json
"video": {
  "enabled": true,
  "title": "Titre vidéo",
  "duration": 240,
  "files": {
    "mp4": "/assets/videos/projects/slug/video.mp4",
    "webm": "/assets/videos/projects/slug/video.webm"  // optionnel
  },
  "poster": "/assets/images/projects/slug/cover.webp",
  "autoplay": false,
  "description": "Description optionnelle"
}
```

### 3. Transformation des Chemins en URLs

```javascript
// Dans normalizeProjectMedia():
const videoPath = resolveProjectVideo(
  slug,
  project.media?.video ?? project.video?.files?.mp4 ?? null
);

// Résultat: /assets/videos/projects/dis-moi-des-mots-damour/video.mp4
```

### 4. Logique d'Initialisation

Le player s'initialise en 4 étapes:

```javascript
1. renderVideoPlayerHTML()    → Génère HTML du player
2. initVideoPlayer()           → Crée playerInstance
3. attachVideoControls()       → Attache event listeners
4. setupVideoEvents()          → Setup HTML5 video events
```

### 5. Event Handlers

Les événements HTML5 video sont traités pour:

```javascript
loadedmetadata  → Afficher durée totale
loadeddata      → Cacher spinner + dispatch 'ready'
timeupdate      → Mettre à jour barre progression
progress        → Mettre à jour barre buffering
play            → Mettre à jour UI (icône pause)
pause           → Mettre à jour UI (icône play)
ended           → Afficher overlay replay
waiting         → Afficher spinner
canplay         → Cacher spinner
error           → Fallback à image cover
```

### 6. Gestion du Loading/Spinner

Le spinner s'affiche lors de:
- `waiting` event (buffering en cours)
- `seeking` (utilisateur cherche dans timeline)

Et se cache lors de:
- `loadeddata` event (données chargées)
- `canplay` event (peut commencer lecture)
- `error` event (erreur, fallback)

---

## Structure des Fichiers Vidéo

```
/public/assets/videos/projects/
├── dis-moi-des-mots-d-amour/
│   ├── video.mp4  ✓ (existe)
│   └── video.webm (optionnel)
│
├── atelier-lacour/
│   ├── .gitkeep (vide - vidéo à ajouter)
│   └── video.mp4
│
└── [autres projets]/
    ├── video.mp4
    └── video.webm

CONVENTION: /public/assets/videos/projects/${slug}/video.mp4
```

---

## Workflow Complet d'une Vidéo

```
ÉTAPE 1: Données chargées
  → content/projects.json contient config vidéo

ÉTAPE 2: Résolution des chemins
  → projects.loader.ts normalizeProjectMedia()
  → Construit /assets/videos/projects/slug/video.mp4

ÉTAPE 3: User clique sur ProjectCard
  → ProjectModal.open(project)

ÉTAPE 4: Détection vidéo
  → hasProjectVideo(project) → true
  → setupProjectMedia() avec videoContainer

ÉTAPE 5: Création du player
  → createProjectVideoPlayer(container, project)
  → renderVideoPlayerHTML() → injecte <video>
  → initVideoPlayer() → crée playerInstance
  → attachVideoControls() → event listeners
  → setupVideoEvents() → HTML5 events

ÉTAPE 6: Chargement vidéo
  → HTML5 <video> commence charger video.mp4
  → waiting → show spinner
  → loadeddata → hide spinner + dispatch 'ready'

ÉTAPE 7: Interaction utilisateur
  → Play/Pause, Seek, Volume, Fullscreen, Keyboard

ÉTAPE 8: Fermeture modal
  → destroyProjectVideoPlayer()
  → pause() + src = '' + load()
  → Cleanup complet
```

---

## Erreurs Courantes

### Vidéo ne charge pas

**Cause probable:** Chemin mal résolu

```
✅ Solution:
1. Vérifier slug du projet dans projects.json
2. Vérifier fichier vidéo existe à:
   /public/assets/videos/projects/${slug}/video.mp4
3. Vérifier project.video.enabled = true
4. Vérifier format vidéo supporté (H.264 MP4)
```

### Spinner reste visible

**Cause probable:** Event `loadeddata` ou `canplay` ne se déclenche pas

```
✅ Solutions:
1. Vérifier navigateur supporte format vidéo
2. Vérifier fichier vidéo valide (ouvrir directement)
3. Vérifier console pour erreurs vidéo
4. Vérifier codec vidéo (H.264 pour MP4)
```

### Contrôles non fonctionnels

**Cause probable:** Event listeners non attachés

```
✅ Solutions:
1. Vérifier attachVideoControls() s'est exécuté
2. Vérifier pas d'erreurs JS dans console
3. Vérifier playerInstance existe
4. Vérifier DOM elements trouvés ([data-play-btn], etc.)
```

---

## Exemple: Ajouter une Vidéo à un Projet

### Étape 1: Ajouter la vidéo physiquement

```bash
mkdir -p /public/assets/videos/projects/mon-projet
cp video.mp4 /public/assets/videos/projects/mon-projet/
# Optionnel:
cp video.webm /public/assets/videos/projects/mon-projet/
```

### Étape 2: Ajouter la configuration dans projects.json

```json
{
  "id": "mon-projet",
  "slug": "mon-projet",
  "title": "Mon Projet",
  // ... autres champs ...
  "video": {
    "enabled": true,
    "title": "Mon Projet Video",
    "duration": 120,
    "files": {
      "mp4": "/assets/videos/projects/mon-projet/video.mp4",
      "webm": "/assets/videos/projects/mon-projet/video.webm"
    },
    "poster": "/assets/images/projects/mon-projet/cover.webp",
    "autoplay": false,
    "description": "Description optionnelle"
  }
}
```

### Étape 3: C'est fait!

La vidéo sera:
1. Chargée via projects.loader.ts
2. Affichée dans la modal quand on clique le projet
3. Contrôles personnalisés s'appliqueront automatiquement

---

## Technologies Utilisées

- **HTML5 Video API** - Lecture vidéo native
- **JavaScript ES6+** - Logique du player
- **GSAP** - Animations smooth
- **CSS3** - Styles + animations spinner
- **TypeScript** - Types des projets
- **Vite/Astro** - Bundling

---

## Debugging

### Vérifier chargement vidéo

```javascript
// Dans la console navigateur:
const project = window.__PROJECT_DATA;
console.log('Video enabled:', project.video?.enabled);
console.log('Video MP4:', project.video?.files?.mp4);

// Tester chargement fichier:
fetch(project.video?.files?.mp4)
  .then(r => console.log('Status:', r.status))
  .catch(e => console.error('Error:', e));
```

### Vérifier HTML5 video events

```javascript
// Dans projectVideoPlayer.js, ajouter:
video.addEventListener('loadeddata', () => {
  console.log('[DEBUG] loadeddata event fired');
});

video.addEventListener('error', (e) => {
  console.error('[DEBUG] video error:', e.target.error);
});
```

### Vérifier playerInstance

```javascript
// Dans console, après ouverture modal:
console.log('PlayerInstance:', window.__PLAYER_INSTANCE);
console.log('IsPlaying:', window.__PLAYER_INSTANCE?.isPlaying);
```

---

## Améliorations Futures Possibles

1. **Lazy loading** des fichiers vidéo
2. **Compression automatique** des vidéos (hébergement)
3. **Subtitles/CC** support
4. **Adaptive bitrate** streaming
5. **Playlist** support
6. **Social sharing** de vidéos
7. **Analytics** tracking
8. **Preview/thumbnail** seeker
9. **Playback speed** control
10. **Loop/repeat** modes

---

## Fichiers Modifiés dans Cette Analyse

Aucun fichier du projet n'a été modifié. Cette documentation est **uniquement consultative**.

Fichiers de documentation créés:
- `/home/user/site_efsvp_4/ANALYSE_VIDEO_PLAYER.md`
- `/home/user/site_efsvp_4/FICHIERS_VIDEO_PLAYER.md`
- `/home/user/site_efsvp_4/DIAGRAMMES_VIDEO_PLAYER.md`
- `/home/user/site_efsvp_4/README_VIDEO_PLAYER.md` (ce fichier)

---

## Questions Fréquentes

**Q: Où ajouter une vidéo pour un projet?**
A: Dans `/public/assets/videos/projects/${slug}/video.mp4`

**Q: Comment configurer les métadonnées vidéo?**
A: Dans `content/projects.json` sous la clé `video` du projet

**Q: Quels formats vidéo sont supportés?**
A: MP4 (H.264) obligatoire, WebM optionnel

**Q: Comment augmenter la taille de présentation du player?**
A: Le player s'adapte au container (aspect ratio 16:9)

**Q: Peut-on avoir audio ET vidéo simultanément?**
A: Non, la vidéo a priorité. Si vidéo échoue, audio s'affiche

**Q: Comment modifier les contrôles?**
A: Dans `projectVideoPlayer.js`, fonction `attachVideoControls()`

---

## Support

Pour toute question sur ce système de vidéo:

1. Lire **ANALYSE_VIDEO_PLAYER.md** pour comprendre le flux
2. Consulter **FICHIERS_VIDEO_PLAYER.md** pour localiser le code
3. Regarder **DIAGRAMMES_VIDEO_PLAYER.md** pour visualiser
4. Utiliser le débogage JavaScript (voir section Debugging)

---

**Dernière mise à jour:** 20 Novembre 2025
**Documentation version:** 1.0
**Status:** Complète et testée
