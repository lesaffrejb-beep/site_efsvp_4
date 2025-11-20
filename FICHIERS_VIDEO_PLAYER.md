# Fichiers clés du système de Player Vidéo - CHEMINS ABSOLUS

## Modules JavaScript/TypeScript

### 1. Player Vidéo Principal
**Fichier:** `/home/user/site_efsvp_4/src/scripts/modules/projectVideoPlayer.js`
**Contient:**
- `createProjectVideoPlayer(container, project)` - Crée instance du player
- `renderVideoPlayerHTML(container, project)` - Génère HTML
- `initVideoPlayer(container, videoElement, project)` - Initialise
- `attachVideoControls(container, playerInstance, project)` - Event listeners
- `setupVideoEvents(container, playerInstance)` - Vidéo events (play, loadeddata, timeupdate, etc.)
- `togglePlayPause(playerInstance, container)` - Play/Pause logic
- `toggleFullscreen(element, button)` - Fullscreen API
- `hasProjectVideo(project)` - Vérifie si projet a vidéo
- `destroyProjectVideoPlayer(playerInstance)` - Cleanup

### 2. Composant Modal
**Fichier:** `/home/user/site_efsvp_4/src/components/projects/ProjectModal.ts`
**Contient:**
- `ProjectModal` class - Container principal
- `open(project, triggerElement)` - Ouvre modal avec projet
- `setupProjectMedia({project, videoContainer, ...})` - Setup du player
- `destroyCurrentMediaPlayers()` - Cleanup vidéo/audio
- Gestion Lenis scroll lock
- Accessibilité (focus trap, ARIA)

### 3. Chargement des Projets
**Fichier:** `/home/user/site_efsvp_4/src/data/projects.loader.ts`
**Contient:**
- `resolveProjectVideo(slug, fallback?)` - Résout le chemin vidéo
- `normalizeProjectMedia(project)` - Normalise la config vidéo
- `sanitizeProjectsData()` - Validation des données
- `getAllProjects()` - Retourne tous les projets chargés
- `getProjectById(id)` - Récupère un projet par ID

### 4. Enrichissement Projets (Optionnel)
**Fichier:** `/home/user/site_efsvp_4/src/data/projectsEnricher.ts`
**Contient:**
- `enrichProject(project)` - Enrichit avec metadata.json optionnels
- `enrichAllProjects(projects)` - Enrichit tous les projets
- `addAssetPaths(project)` - Ajoute chemins assets
- `checkAudioExists(project)` - Vérifie audio existe
- `resolveImagePath(project, imageName)` - Résout path image
- `resolveAudioPath(project, audioName)` - Résout path audio

## Styles CSS

### 5. Styles Player Vidéo
**Fichier:** `/home/user/site_efsvp_4/src/styles/video-player.css`
**Contient:**
- `.video-player` - Container principal
- `.video-player__container` - Aspect ratio 16:9
- `.video-player__video` - HTML5 video element
- `.video-player__loading` - Spinner de chargement
- `.video-player__spinner` - Animation du spinner
- `.video-player__controls` - Barre de contrôles
- `.video-player__play-btn` - Bouton play/pause
- `.video-player__timeline` - Timeline de progression
- `.video-player__progress` - Barre de progression
- `.video-player__buffered` - Barre de buffering
- `.video-player__overlay` - Overlay avec play button initial
- `.video-player__error` - État erreur

**Styles clés:**
- Media queries (responsive mobile)
- Dark mode support
- Reduced motion support
- Focus visible (accessibility)
- Fullscreen styles

## Données et Configurations

### 6. Données des Projets
**Fichier:** `/home/user/site_efsvp_4/content/projects.json`
**Contient:**
- Array de tous les projets
- Structure: id, slug, title, category, sector, themes, etc.
- Optionnel: `video.enabled`, `video.files.mp4`, `video.webm`, `video.poster`
- Exemple: "dis-moi-des-mots-damour" (slug) → video config

### 7. Types TypeScript
**Fichier:** `/home/user/site_efsvp_4/src/types/project.ts`
**Contient:**
- `Project` interface
- `ProjectStatus` type ('delivered' | 'in-progress')
- `ProjectSector` type (artisanat, btp, patrimoine, etc.)
- Sous-interface `video` avec files: {mp4, webm?}
- Sous-interface `audio` avec files: {mp3, ogg?}

### 8. Template Metadata
**Fichier:** `/home/user/site_efsvp_4/public/assets/projects/_metadata-template.json`
**Contient:**
- Template JSON pour fichiers metadata optionnels
- Structure complète video/audio config
- Commentaires d'utilisation

## Fichiers Vidéo

### 9. Vidéos Projets
**Répertoire:** `/home/user/site_efsvp_4/public/assets/videos/projects/`

**Fichiers actuels:**
- `/home/user/site_efsvp_4/public/assets/videos/projects/dis-moi-des-mots-d-amour/video.mp4` (seul fichier vidéo actuel)
- Autres dossiers avec `.gitkeep`: atelier-lacour/, a2mo/, la-force-de-la-douceur/, etc.

**Convention de nommage:**
```
/public/assets/videos/projects/${slug}/video.mp4
/public/assets/videos/projects/${slug}/video.webm  (optionnel)
```

## Autres Composants Associés

### 10. Grille des Projets
**Fichier:** `/home/user/site_efsvp_4/src/components/projects/ProjectGrid.ts`
**Contient:**
- Affichage grille de ProjectCard
- Gère événement 'onSelect' → ouvre modal

### 11. Cartes des Projets
**Fichier:** `/home/user/site_efsvp_4/src/components/projects/ProjectCard.ts`
**Contient:**
- Rendu individuel d'une carte projet
- Trigger pour ouvrir modal

### 12. App Principal
**Fichier:** `/home/user/site_efsvp_4/src/scripts/projects-app.ts`
**Contient:**
- `initProjectsApp()` - Initialise toute l'app projets
- Instanciation ProjectModal
- Setup ProjectGrid
- Setup filtres par secteur

---

## RÉSUMÉ DES CHEMINS CLÉS

### Logique vidéo
```
/home/user/site_efsvp_4/src/scripts/modules/projectVideoPlayer.js (559 lignes)
/home/user/site_efsvp_4/src/components/projects/ProjectModal.ts    (410 lignes)
/home/user/site_efsvp_4/src/data/projects.loader.ts                (205 lignes)
```

### Styles
```
/home/user/site_efsvp_4/src/styles/video-player.css (517 lignes)
```

### Données
```
/home/user/site_efsvp_4/content/projects.json
/home/user/site_efsvp_4/src/types/project.ts
```

### Assets vidéo
```
/home/user/site_efsvp_4/public/assets/videos/projects/
```

---

## FLOW DE CHARGEMENT RAPIDE

```
1. User ouvre page projets
   ↓
2. projects.loader.ts → normalizeProjectMedia() construit paths vidéo
   └─ /assets/videos/projects/${slug}/video.mp4
   ↓
3. ProjectGrid affiche cards
   ↓
4. User clique card
   ↓
5. ProjectModal.open(project)
   ├─ hasProjectVideo(project) ?
   ├─ createProjectVideoPlayer(container, project)
   │  ├─ renderVideoPlayerHTML() → injecte <video>
   │  ├─ initVideoPlayer() → crée playerInstance
   │  ├─ attachVideoControls() → event listeners
   │  └─ setupVideoEvents() → HTML5 events (play, timeupdate, etc.)
   ↓
6. HTML5 <video> charge video.mp4
   ├─ waiting → show spinner
   ├─ loadeddata → hide spinner + emit 'project-video-ready'
   ├─ timeupdate → update progress
   ├─ play → update UI
   ├─ error → fallback à image
   ↓
7. User interagit (play, seek, volume, fullscreen, keyboard)
   ↓
8. Modal ferme ou user change projet
   ├─ destroyProjectVideoPlayer() → pause + cleanup
```

---

## IMPORTANT: ISSUES ACTUELLES

### Issue 1: Mismatch de slug
```
Projects.json slug: "dis-moi-des-mots-damour"
Fichier vidéo: "dis-moi-des-mots-d-amour"

Peut causer video 404 si noms diffèrent!
Vérifier: /assets/videos/projects/${slug}/ vs réel path
```

### Issue 2: Seule une vidéo existe
```
Actuellement: dis-moi-des-mots-d-amour/video.mp4
Autres dossiers: vides (juste .gitkeep)

Si tous les projets sont censés avoir vidéos,
les autres devront être ajoutées.
```

---

