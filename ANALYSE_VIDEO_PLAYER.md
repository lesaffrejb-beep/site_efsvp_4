# Analyse Complète: Système de Player Vidéo pour les Projets

## 1. ARCHITECTURE GLOBALE

### Structure des fichiers principales
```
src/
├── scripts/modules/
│   └── projectVideoPlayer.js         ← Player vidéo principal
├── components/projects/
│   └── ProjectModal.ts                ← Container modal qui affiche vidéo
├── data/
│   ├── projects.loader.ts             ← Résolution des chemins vidéo
│   └── projectsEnricher.ts            ← Enrichissement optionnel avec metadata
└── styles/
    └── video-player.css               ← Styles du player

public/
└── assets/
    ├── videos/projects/
    │   ├── dis-moi-des-mots-d-amour/
    │   │   └── video.mp4              ← Fichier vidéo réel
    │   └── [slug]/
    │       └── video.mp4
    └── images/projects/               ← Covers/posters

content/
└── projects.json                      ← Définition des projets + métadonnées vidéo

public/assets/projects/
└── _metadata-template.json            ← Template de configuration vidéo
```

---

## 2. FLUX COMPLET DE CHARGEMENT VIDÉO

### Phase 1: Chargement des données de projet

```
projects.json (content/)
    ↓
projects.loader.ts (normalizeProjectMedia)
    ├─ Recherche: /assets/videos/projects/${slug}/video.mp4
    ├─ Fallback: project.media.video ou project.video.files.mp4
    └─ Crée objet video normalisé:
        {
          enabled: true,
          title: string,
          files: {
            mp4: "/assets/videos/projects/slug/video.mp4",
            webm?: string
          },
          poster?: string,
          autoplay?: boolean,
          duration?: number
        }
    ↓
enrichProject() [projectsEnricher.ts - optionnel]
    └─ Tente charger: /assets/projects/${project.id}/metadata.json
       (Permet override config vidéo par projet)
    ↓
getAllProjects() → Array<Project>
```

### Phase 2: Ouverture de la modal et détection vidéo

```
User clique sur ProjectCard
    ↓
ProjectModal.open(project, triggerElement)
    ↓
setupProjectMedia({project, videoContainer, ...})
    ├─ Vérification: hasProjectVideo(project)
    │   └─ Vérifie: project.video.enabled && project.video.files.mp4
    │
    ├─ Si vidéo trouvée:
    │   ├─ Cachez visual (cover image)
    │   ├─ Afficher videoContainer
    │   ├─ Ajouter classes: is-loading, aria-busy
    │   ├─ Registrer event listeners:
    │   │   ├─ 'project-video-ready' (quand vidéo chargée)
    │   │   └─ 'project-video-error' (erreur)
    │   │
    │   └─ Appeler: createProjectVideoPlayer(container, project)
    │
    └─ Si pas vidéo: afficher fallback (cover image + audio si dispo)
```

### Phase 3: Initialisation du Player

```
createProjectVideoPlayer(container, project)
    ↓
1. renderVideoPlayerHTML(container, project)
   ├─ Génère HTML:
   │  └─ <video id="video-${projectId}">
   │     ├─ <source src="${videoPath}" type="video/mp4">
   │     └─ <source src="${webmPath}" type="video/webm">  [optionnel]
   │
   ├─ Crée overlay avec bouton play
   ├─ Crée div loading avec spinner
   └─ Crée contrôles (play, timeline, volume, fullscreen)
    ↓
2. initVideoPlayer(container, videoElement, project)
   ├─ Crée playerInstance:
   │  {
   │    video: HTMLVideoElement,
   │    container: HTMLElement,
   │    isPlaying: boolean,
   │    isMuted: boolean,
   │    currentVolume: number
   │  }
   │
   ├─ attachVideoControls()
   │  └─ Bind event listeners aux contrôles
   │
   ├─ setupVideoEvents()
   │  └─ Setup tous les event handlers
   │
   └─ Si autoplay: videoElement.play() après 500ms
    ↓
Retourne playerInstance (ou null si erreur)
```

---

## 3. RÉSOLUTION DES CHEMINS VIDÉO

### Lieu: `src/data/projects.loader.ts`

#### Fonction: `resolveProjectVideo(slug, fallback?)`

```javascript
function resolveProjectVideo(slug: string, fallback?: string | null): string | null {
  // Chemin standard déterministe
  const standardPath = `/assets/videos/projects/${slug}/video.mp4`;

  // Préférer fallback explicite s'il existe
  if (fallback) {
    return fallback;  // Peut venir de project.media.video ou project.video.files.mp4
  }

  // Sinon retourner URL standard
  return standardPath;  // Le player gérera erreur si fichier n'existe pas
}
```

#### Utilisé dans: `normalizeProjectMedia(project)`

```javascript
const videoPath = resolveProjectVideo(
  slug,
  project.media?.video ?? project.video?.files?.mp4 ?? null
);

// Créer l'objet vidéo normalisé
if (!project.video && media.video) {
  normalized.video = {
    enabled: true,
    title: project.title,
    files: { mp4: media.video },
    description: project.details?.format,
  };
}
```

### Priorités de résolution:

```
1️⃣  project.video.files.mp4 (si défini explicitement)
2️⃣  project.media.video (si défini)
3️⃣  /assets/videos/projects/${slug}/video.mp4 (chemin standard)
```

---

## 4. STRUCTURE DES DONNÉES DE PROJET

### Dans `content/projects.json`:

```json
{
  "id": "dis-moi-des-mots-damour",
  "slug": "dis-moi-des-mots-damour",
  "title": "Dis-moi des mots d'amour",
  
  // ... autres champs ...
  
  "media": {
    "coverImage": "/assets/images/projects/dis-moi-des-mots-damour/cover.webp",
    "gallery": [],
    "video": null,  // Optionnel: URL vidéo override
    "audio": null   // Optionnel: URL audio override
  },
  
  // Optionnel: Configuration vidéo explicite
  "video": {
    "enabled": true,
    "title": "Dis-moi des mots d'amour",
    "duration": 240,
    "files": {
      "mp4": "/assets/videos/projects/dis-moi-des-mots-damour/video.mp4",
      "webm": "/assets/videos/projects/dis-moi-des-mots-damour/video.webm"
    },
    "poster": "/assets/images/projects/dis-moi-des-mots-damour/cover.webp",
    "autoplay": false,
    "description": "Spectacle de danse sur les ALD"
  }
}
```

### Type TypeScript: `src/types/project.ts`

```typescript
interface Project {
  // ... champs basiques ...
  
  video?: {
    enabled: boolean;
    title: string;
    duration?: number;
    files: {
      mp4: string;
      webm?: string;
    };
    poster?: string;
    autoplay?: boolean;
    description?: string;
  };
  
  audio?: {
    enabled: boolean;
    title: string;
    artist?: string;
    duration?: number;
    files: {
      mp3: string;
      ogg?: string;
    };
    waveformColor?: string;
    description?: string;
  };
}
```

---

## 5. LOGIQUE D'INITIALISATION ET DE LECTURE

### 5.1 Attache des contrôles: `attachVideoControls()`

```javascript
// Play/Pause
playBtn.click → togglePlayPause(playerInstance)
playOverlay.click → togglePlayPause(playerInstance)
video.click → togglePlayPause(playerInstance)

// Volume
volumeBtn.click → playerInstance.isMuted = !playerInstance.isMuted

// Timeline seek
timeline.click → video.currentTime = (clickPercent × video.duration)
timeline.drag → continue updating video.currentTime

// Fullscreen
fullscreenBtn.click → playerEl.requestFullscreen()

// Keyboard shortcuts
spacebar/k → Play/Pause
f → Fullscreen
m → Mute
← → Rewind 5s
→ → Forward 5s
```

### 5.2 Toggle Play/Pause

```javascript
function togglePlayPause(playerInstance, container) {
  const { video } = playerInstance;

  if (video.paused) {
    video.play();  // HTML5 video API
    // Animation GSAP sur bouton play
    gsap.fromTo(playBtn, { scale: 0.95 }, { scale: 1, duration: 0.3 });
  } else {
    video.pause();
  }
}
```

---

## 6. EVENT HANDLERS VIDÉO

### Setup: `setupVideoEvents(container, playerInstance)`

```javascript
// ├─ loadedmetadata
// │  └─ Déclenché: metadata chargées (durée dispo)
// │     Action: Afficher durée totale
// │
// ├─ loadeddata
// │  └─ Déclenché: données vidéo chargées (peut lire)
// │     Action: Cacher spinner → dispatchEvent('project-video-ready')
// │
// ├─ canplay
// │  └─ Déclenché: vidéo peut commencer lecture
// │     Action: dispatchEvent('project-video-ready')
// │
// ├─ timeupdate
// │  └─ Déclenché: currentTime change (fréquent)
// │     Actions:
// │       - Mettre à jour affichage temps courant
// │       - Mettre à jour barre de progression
// │
// ├─ progress
// │  └─ Déclenché: données buffering reçues
// │     Action: Mettre à jour barre buffering
// │
// ├─ play
// │  └─ Déclenché: vidéo commence à jouer
// │     Actions:
// │       - Set isPlaying = true
// │       - Montrer icône pause sur bouton
// │       - Cacher overlay
// │
// ├─ pause
// │  └─ Déclenché: vidéo en pause
// │     Actions:
// │       - Set isPlaying = false
// │       - Montrer icône play sur bouton
// │
// ├─ ended
// │  └─ Déclenché: vidéo terminée
// │     Actions:
// │       - Set isPlaying = false
// │       - Montrer overlay play à nouveau
// │
// ├─ waiting
// │  └─ Déclenché: vidéo en attente de données
// │     Action: Afficher spinner (addClass 'is-visible')
// │
// └─ error
//    └─ Déclenché: erreur chargement/lecture
//       Actions:
//         - Cacher spinner
//         - dispatchEvent('project-video-error')
//         - Montrer message erreur
//         - Fallback à cover image
```

---

## 7. GESTION DU LOADING/SPINNER

### HTML du spinner (dans `renderVideoPlayerHTML`)

```html
<div class="video-player__loading" data-video-loading>
  <div class="video-player__spinner"></div>
</div>
```

### CSS du spinner (`video-player.css` lignes 97-126)

```css
.video-player__loading {
  position: absolute;
  inset: 0;
  display: none;  /* Caché par défaut */
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
  z-index: 10;
}

/* Afficher avec classe 'is-visible' */
.video-player__loading.is-visible,
.modal-video.is-loading .video-player__loading {
  display: flex;
}

/* Spinner animé */
.video-player__spinner {
  width: 48px;
  height: 48px;
  border: 4px solid rgba(255, 255, 255, 0.2);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
```

### JavaScript: Show/Hide

```javascript
const showLoading = () => {
  loadingEl?.classList.add('is-visible');
  container.classList.add('is-loading');
};

const hideLoading = () => {
  loadingEl?.classList.remove('is-visible');
  container.classList.remove('is-loading');
};

// Déclenché par:
video.addEventListener('waiting', () => showLoading());
video.addEventListener('loadeddata', () => hideLoading());
video.addEventListener('canplay', () => hideLoading());
video.addEventListener('error', () => hideLoading());
```

---

## 8. INTÉGRATION DANS ProjectModal

### Fichier: `src/components/projects/ProjectModal.ts`

```typescript
open(project: Project, triggerElement?: HTMLElement | null) {
  // ... setup du contenu modal ...

  // Détruire les anciens players
  this.destroyCurrentMediaPlayers();

  // Setup nouveau media (vidéo prioritaire sur audio)
  this.setupProjectMedia({
    project,
    visualContainer,
    videoContainer,
    audioContainer
  });

  // ... setup modal ...
}

setupProjectMedia({project, videoContainer, audioContainer, ...}) {
  // 1. Vérifier si vidéo disponible
  if (videoContainer && hasProjectVideo(project)) {
    // 2. Registrer event listeners
    videoContainer.addEventListener('project-video-ready', () => {
      videoContainer.classList.remove('is-loading');
      videoContainer.removeAttribute('aria-busy');
    });

    // 3. Créer le player
    this.currentVideoPlayer = createProjectVideoPlayer(videoContainer, project);

    if (!this.currentVideoPlayer) {
      // Fallback à image si création échoue
      fallbackToVisual();
    }
    return;  // Ne pas charger audio si vidéo OK
  }

  // 4. Sinon afficher audio si dispo
  if (audioContainer && hasProjectAudio(project)) {
    this.currentAudioPlayer = createProjectAudioPlayer(audioContainer, project);
  }
}

close() {
  // Destroyer tous les players avant de fermer
  this.destroyCurrentMediaPlayers();
  // ... fermeture modal ...
}

destroyCurrentMediaPlayers() {
  if (this.currentVideoPlayer) {
    destroyProjectVideoPlayer(this.currentVideoPlayer);
    this.currentVideoPlayer = null;
  }
  if (this.currentAudioPlayer) {
    destroyProjectAudioPlayer(this.currentAudioPlayer);
    this.currentAudioPlayer = null;
  }
}
```

---

## 9. DESTRUCTION DU PLAYER

### Fonction: `destroyProjectVideoPlayer(playerInstance)`

```javascript
export function destroyProjectVideoPlayer(playerInstance) {
  if (playerInstance && playerInstance.video) {
    try {
      playerInstance.video.pause();
      playerInstance.video.src = '';  // Détacher source
      playerInstance.video.load();     // Recharger (arrête lecture)
    } catch (error) {
      console.error('[ProjectVideoPlayer] Destroy error:', error);
    }
  }
}
```

**Quand appelé:**
- Fermeture modal
- Changement de projet
- Passageto audio mode
- Erreur vidéo (fallback)

---

## 10. DIAGRAMME COMPLET DU FLUX

```
┌─────────────────────────────────────────────────────────────────┐
│                    FLUX VIDÉO COMPLET                           │
└─────────────────────────────────────────────────────────────────┘

1. DONNÉES
   ┌──────────────────────┐
   │  content/projects.json
   │  + config vidéo      │
   └──────────┬───────────┘
              │
              ▼
   ┌──────────────────────────────────┐
   │ projects.loader.ts                │
   │ normalizeProjectMedia()            │
   │ Construit: /assets/videos/...     │
   │ Crée video {} normalisé           │
   └──────────┬───────────────────────┘
              │
              ▼
   ┌──────────────────────────────────┐
   │ Project[] avec video config       │
   │ {                                 │
   │   video: {                        │
   │     enabled: true,                │
   │     files: { mp4: "...", ... }   │
   │     poster: "...",                │
   │     autoplay: false               │
   │   }                               │
   │ }                                 │
   └──────────┬───────────────────────┘

2. OUVERTURE MODALE
   ┌──────────────────────────────────┐
   │ User clique ProjectCard           │
   │ → ProjectModal.open(project)      │
   └──────────┬───────────────────────┘
              │
              ▼
   ┌──────────────────────────────────┐
   │ hasProjectVideo(project) ?        │
   └─────┬───────────────────┬────────┘
         │ OUI               │ NON
         ▼                   ▼
      VIDÉO               FALLBACK
      (suite)             (image + audio)

3. CRÉATION PLAYER
   ┌──────────────────────────────────┐
   │ createProjectVideoPlayer()        │
   │                                   │
   │ 1. renderVideoPlayerHTML()        │
   │    └─ Génère <video> + contrôles  │
   │                                   │
   │ 2. initVideoPlayer()              │
   │    ├─ Crée playerInstance         │
   │    ├─ attachVideoControls()       │
   │    └─ setupVideoEvents()          │
   │                                   │
   │ 3. return playerInstance ou null  │
   └──────────┬───────────────────────┘
              │
              ▼
   ┌──────────────────────────────────┐
   │ HTML5 <video> injecté             │
   │ Commence chargement video.mp4     │
   └──────────┬───────────────────────┘

4. LIFECYCLE VIDÉO
   ┌──────────────────────────────────┐
   │ waiting     → showLoading()       │
   │ loadeddata  → hideLoading() +     │
   │              dispatchEvent()      │
   │ timeupdate  → update progress     │
   │ play        → update UI           │
   │ pause       → update UI           │
   │ ended       → show overlay        │
   │ error       → hideLoading() +     │
   │              fallback             │
   └──────────┬───────────────────────┘
              │
              ▼
   ┌──────────────────────────────────┐
   │ USER INTERACTS                    │
   │ - Click play/pause                │
   │ - Seek timeline                   │
   │ - Volume/Fullscreen               │
   │ - Keyboard shortcuts              │
   └──────────┬───────────────────────┘
              │
              ▼
   ┌──────────────────────────────────┐
   │ Fermeture modal ou changement     │
   │ → destroyProjectVideoPlayer()     │
   │   - pause()                       │
   │   - src = ''                      │
   │   - load()                        │
   └──────────────────────────────────┘
```

---

## 11. EXEMPLE CONCRET: dis-moi-des-mots-damour

### Fichier vidéo réel
```
/home/user/site_efsvp_4/public/assets/videos/projects/dis-moi-des-mots-d-amour/video.mp4
```

### Slug du projet
```
"dis-moi-des-mots-damour"  (dans projects.json)
```

### Résolution du chemin
```
1. resolveProjectVideo("dis-moi-des-mots-damour")
   └─ Construit: /assets/videos/projects/dis-moi-des-mots-damour/video.mp4

2. Si fichier non trouvé:
   └─ Le player affichera erreur
   └─ Modal fallback à cover image

Note: Il y a une petite discrepance de nommage (d-amour vs damour)
      qui pourrait causer ce problème!
```

---

## 12. ERREURS COURANTES ET SOLUTIONS

### Problème 1: Vidéo ne charge pas
```
Causes possibles:
1. ❌ Chemin mal résolu (slug vs réel path)
2. ❌ Fichier n'existe pas au path attendu
3. ❌ video.enabled = false
4. ❌ CORS issues

Solutions:
1. ✅ Vérifier slug du projet en projects.json
2. ✅ Placer fichier à: /assets/videos/projects/${slug}/video.mp4
3. ✅ Vérifier project.video.enabled = true
4. ✅ CORS headers sur serveur
```

### Problème 2: Spinner reste visible
```
Causes:
1. ❌ Event 'loadeddata' ou 'canplay' ne déclenché pas

Solutions:
1. ✅ Vérifier navigateur supporte ce format vidéo
2. ✅ Vérifier fichier vidéo valide
3. ✅ Timeout: hideLoading() après X secondes
```

### Problème 3: Contrôles non fonctionnels
```
Causes:
1. ❌ CSS `.video-player__video::-webkit-media-controls { display: none; }`
   (Controls natifs cachés, utilise custom controls)

Solutions:
1. ✅ Vérifier attachVideoControls() s'est exécuté
2. ✅ Vérifier event listeners attachés
```

---

## 13. TECHNOLOGIES UTILISÉES

- **HTML5 Video API**: lecture vidéo native
- **JavaScript ES6+**: logique du player
- **GSAP**: animations (boutons, overlay)
- **CSS3**: styles + animations spinner
- **TypeScript**: types des projets
- **Astro/Vite**: bundling des assets

---

## 14. CHECKPOINTS DE FONCTIONNEMENT

```javascript
// 1. Vérifier projet a vidéo
hasProjectVideo(project)
  → project.video?.enabled && project.video?.files?.mp4

// 2. Vérifier chemin vidéo construit
project.video.files.mp4
  → Should be: "/assets/videos/projects/${slug}/video.mp4"

// 3. Vérifier création player
createProjectVideoPlayer(container, project)
  → Should return playerInstance || null

// 4. Vérifier HTML5 video élément
document.querySelector(`#video-${projectId}`)
  → Should have valid <source> elements

// 5. Vérifier contrôles attachés
document.querySelector('[data-play-btn]')
  → Should have click listener

// 6. Vérifier events vidéo
video.addEventListener('timeupdate', ...)
  → Should update progress bar

// 7. Vérifier cleanup
destroyProjectVideoPlayer(playerInstance)
  → Should pause + clear src
```

---

## RÉSUMÉ

Le système de player vidéo EfSVP est une implémentation complète de lecture vidéo HTML5 avec:

1. **Résolution dynamique des chemins** via projects.loader
2. **Interface rich** avec contrôles personnalisés
3. **Gestion d'erreurs** graceful (fallback à image)
4. **Lifecycle robuste** (creation/destruction)
5. **Accessibilité** (keyboard nav, ARIA)
6. **Performance** (lazy loading, responsive)
7. **Animation** smooth via GSAP
8. **Support formats multiples** (mp4 + webm)

