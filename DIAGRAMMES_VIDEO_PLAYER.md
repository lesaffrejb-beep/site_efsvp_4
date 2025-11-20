# Diagrammes Visuels - Système de Player Vidéo

## 1. ARCHITECTURE GÉNÉRALE

```
┌────────────────────────────────────────────────────────────────┐
│                          APPLICATION                           │
│                      EFSVP - Projets                           │
└────────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────┴──────────┐
                    │                    │
        ┌───────────▼────────┐  ┌────────▼──────────┐
        │  projects-app.ts   │  │  ProjectGrid.ts   │
        │  (initialise app)  │  │  (affiche cards)  │
        └────────────────────┘  └────────┬──────────┘
                                         │
                                ┌────────▼──────────┐
                                │  ProjectCard      │
                                │  (click trigger)  │
                                └────────┬──────────┘
                                         │
                    ┌────────────────────▼──────────────────┐
                    │       ProjectModal.ts                 │
                    │  - Affiche modal avec détails         │
                    │  - Gère vidéo/audio                  │
                    │  - Gère scroll/focus                 │
                    └────────────┬───────────────────────────┘
                                 │
                    ┌────────────▼───────────┐
                    │  hasProjectVideo()?    │
                    └─────┬──────────┬───────┘
                          │ OUI      │ NON
              ┌───────────▼──┐  ┌───▼──────────┐
              │   VIDÉO      │  │   FALLBACK   │
              │   (continue) │  │   (image)    │
              └───────┬──────┘  └──────────────┘
                      │
        ┌─────────────▼──────────────────┐
        │ createProjectVideoPlayer()     │
        │ projectVideoPlayer.js          │
        │                                │
        │  1. renderVideoPlayerHTML()   │
        │  2. initVideoPlayer()          │
        │  3. attachVideoControls()      │
        │  4. setupVideoEvents()         │
        └─────────────┬──────────────────┘
                      │
            ┌─────────▼────────────┐
            │ HTML5 <video> élém. │
            │ - Charge video.mp4  │
            │ - Events (play, ...) │
            └─────────────────────┘
```

---

## 2. FLUX DE RÉSOLUTION DES CHEMINS VIDÉO

```
┌──────────────────────────────────────────────────────────┐
│           content/projects.json                          │
│  {                                                       │
│    "id": "dis-moi-des-mots-damour",                     │
│    "slug": "dis-moi-des-mots-damour",                   │
│    "video": {                                            │
│      "enabled": true,                                    │
│      "files": { "mp4": "/assets/videos/..." }           │
│    }                                                     │
│  }                                                       │
└──────────────────┬───────────────────────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────────────────────┐
│    projects.loader.ts                                    │
│    normalizeProjectMedia()                              │
│                                                          │
│    const videoPath = resolveProjectVideo(               │
│      slug,                                               │
│      project.media?.video ??                            │
│      project.video?.files?.mp4 ?? null                  │
│    );                                                    │
└──────────────┬──────────────────────────────────┬────────┘
               │                                  │
      ┌────────▼──────────┐         ┌────────────▼────┐
      │ CHEMIN FOURNI?    │         │ CHEMIN STANDARD │
      │ (media.video)     │         │ /assets/videos/ │
      │ ou video.files    │         │ projects/${slug}│
      └────────┬──────────┘         │ /video.mp4      │
               │                    └────────┬────────┘
               └──────────┬──────────────────┘
                          │
                          ▼
         ┌────────────────────────────────┐
         │ /assets/videos/projects/       │
         │ dis-moi-des-mots-damour/      │
         │ video.mp4                      │
         └────────────────────────────────┘
                  │
        ┌─────────▼──────────┐
        │ Fichier existe?    │
        └──────┬───────┬─────┘
               │ OUI   │ NON
        ┌──────▼──┐  ┌─▼──────────┐
        │ CHARGÉ  │  │ ERREUR     │
        │ vidéo   │  │ Fallback   │
        │ OK      │  │ à image    │
        └─────────┘  └────────────┘
```

---

## 3. CYCLE DE VIE DU PLAYER VIDEO

```
                    ┌─────────────────────┐
                    │ CRÉATION DU PLAYER  │
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │ renderVideoPlayer   │
                    │ HTML()              │
                    │                     │
                    │ ├─ <video>          │
                    │ ├─ overlay+play     │
                    │ ├─ loading/spinner  │
                    │ └─ controls         │
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │ initVideoPlayer()   │
                    │                     │
                    │ playerInstance {    │
                    │  video,             │
                    │  container,         │
                    │  isPlaying,         │
                    │  isMuted,           │
                    │  currentVolume      │
                    │ }                   │
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │ attachVideoControls │
                    │                     │
                    │ ├─ play/pause       │
                    │ ├─ timeline seek    │
                    │ ├─ volume           │
                    │ ├─ fullscreen       │
                    │ └─ keyboard hotkeys │
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │ setupVideoEvents()  │
                    │                     │
                    │ ├─ loadedmetadata   │
                    │ ├─ loadeddata       │
                    │ ├─ timeupdate       │
                    │ ├─ progress         │
                    │ ├─ play/pause       │
                    │ ├─ ended            │
                    │ ├─ waiting          │
                    │ ├─ canplay          │
                    │ └─ error            │
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │ VIDEO READY        │
                    │ & PLAYING          │
                    │                    │
                    │ ├─ Dispatchs       │
                    │ │ 'project-video   │
                    │ │  -ready'         │
                    │ ├─ Hides spinner   │
                    │ └─ Ready pour user │
                    └──────────┬──────────┘
                               │
                         ┌─────┴─────┐
                         │ USER ACTIONS
                         │ ├─ Play/Pause
                         │ ├─ Seek
                         │ ├─ Volume
                         │ ├─ Fullscreen
                         │ └─ Keyboard
                         │
                    ┌────▼──────────────┐
                    │ Modal Close OR    │
                    │ Change Project    │
                    └────┬──────────────┘
                         │
                    ┌────▼─────────────┐
                    │ Destroy Player   │
                    │                  │
                    │ ├─ pause()       │
                    │ ├─ src = ''      │
                    │ ├─ load()        │
                    │ └─ cleanup       │
                    └──────────────────┘
```

---

## 4. EVENT HANDLERS - TIMELINE TEMPORELLE

```
TEMPS ─────────────────────────────────────────────────────────────▶

USER  │
CLIQUE│                                             FERME MODAL
PLAY  │                                             │
      │                                             │
      ▼                                             ▼
┌──────────────────────────────────────────────────────────┐
│                    HTML5 VIDEO LIFECYCLE                │
└──────────────────────────────────────────────────────────┘
      │
      ├─ 'waiting' ────────────────────────────┐
      │  (attente données)                     │
      │                                       ▼
      │                              showLoading()
      │                              (show spinner)
      │
      ├─ 'loadedmetadata' ─────────────────────┐
      │  (durée disponible)                   │
      │                                      ▼
      │                           Affiche durée totale
      │
      ├─ 'loadeddata' ─────────────────────────┐
      │  (données chargées)                  │
      │                                     ▼
      │                        hideLoading()
      │                        dispatchEvent(
      │                         'project-video-ready'
      │                        )
      │
      ├─ 'canplay' ───────────────────────────┐
      │  (peut lire)                        │
      │                                    ▼
      │                        hideLoading()
      │
      ├─ 'play' ──────────────────────────────┐
      │  (lecture démarre)                 │
      │                                   ▼
      │                        isPlaying = true
      │                        showIcon('pause')
      │                        hideOverlay()
      │
      ├─ 'timeupdate' (fréquent) ────────────┐
      │  (temps change)                   │
      │  ├─ updateCurrentTime()           │
      │  ├─ updateProgressBar()           │
      │  └─ repeat x60/sec               │
      │
      ├─ 'progress' (fréquent) ───────────────┐
      │  (buffering)                      │
      │                                  ▼
      │                        updateBufferedBar()
      │
      ├─ 'pause' ─────────────────────────────┐
      │  (mise en pause)                  │
      │                                  ▼
      │                        isPlaying = false
      │                        showIcon('play')
      │
      ├─ 'ended' ─────────────────────────────┐
      │  (vidéo terminée)                 │
      │                                  ▼
      │                        isPlaying = false
      │                        showOverlay()
      │
      └─ 'error' ─────────────────────────────┐
         (erreur chargement)              │
                                         ▼
                            hideLoading()
                            dispatchEvent(
                             'project-video-error'
                            )
                            showVideoError()
                            fallbackToImage()
```

---

## 5. FLUX CONTRÔLES UTILISATEUR

```
                    ┌─────────────────────┐
                    │  USER INTERACTIONS  │
                    └────────────┬────────┘
                                 │
        ┌────────────┬───────────┼───────────┬──────────┐
        │            │           │           │          │
        ▼            ▼           ▼           ▼          ▼
    ┌─PLAY──┐  ┌─TIMELINE─┐ ┌─VOLUME──┐ ┌─FULLSCREEN─┐ ┌─KEYBOARD─┐
    │PAUSE  │  │SEEK      │ │MUTE     │ │            │ │ HOTKEYS  │
    │       │  │DRAG      │ │         │ │            │ │          │
    │ Click │  │ Click    │ │ Click   │ │ Click      │ │ spacebar │
    │ Overlay│ │ Timeline │ │Volume   │ │Fullscreen  │ │ k        │
    │ Or     │  │ Or drag  │ │button   │ │button      │ │ f        │
    │ Play   │  │Timeline  │ │         │ │            │ │ m        │
    │ Button │  │          │ │         │ │            │ │ ← → Seek │
    └────┬──┘  └────┬─────┘ └────┬────┘ └──────┬─────┘ └────┬────┘
         │          │            │             │            │
         ▼          ▼            ▼             ▼            ▼
    togglePlay toggleSeek   toggleMute   toggleFull    handleKey
    Pause()     currentTime  muted=!     request      Switch
    play()      = percent *  muted       Fullscreen   Case
    gsap anim   duration     update                   Play/Vol/
                             icon                    Fullscr
```

---

## 6. GESTION DU LOADING/SPINNER

```
            ┌─────────────────────────┐
            │   SPINNER STATE         │
            └────────────┬────────────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
        ▼                ▼                ▼
    ┌─CACHÉ─┐      ┌─VISIBLE─┐      ┌─VISIBLE─┐
    │display:none  │display:flex   │display:flex
    │opacity: 0    │opacity: 1     │opacity: 1
    │border-top:   │border-top:    │border-top:
    │transparent   │white          │white
    │border-radius │border-radius: │border-radius:
    │:50%          │50%            │50%
    │              │               │
    │DEFAULT STATE │LOADING STATE  │LOADING ACTIVE
    │INITIAL       │(when waiting) │(animating)
    └──────┬───────┘└────┬─────────┘└────────┬───┘
           │             │                   │
           │             │                   │
    ┌─────┴──────┐       │         ┌─────────┴────┐
    │             │      │         │              │
    │triggered by │      │    ┌────▼──────┐       │
    │             │      │    │ @keyframes│       │
    │ - onload    │      │    │   spin    │       │
    │ - first     │      │    │           │       │
    │   render    │      │    │ rotate(   │       │
    │             │      │    │  360deg)  │       │
    │             │      │    │ 0.8s lin. │       │
    │             │      │    │ infinite  │       │
    │             │      │    └───────────┘       │
    │             │      │                        │
    └──────┬──────┘      │                        │
           │             │                        │
           │      ┌──────┴────────────┐           │
           │      │                   │           │
           └──────┴───────────────────┴───────────┘
                   │                   │
            ┌──────▼───────┐     ┌─────▼──────┐
            │ Hidden when: │     │Show when:  │
            │              │     │            │
            │ - loadeddata │     │ - waiting  │
            │ - canplay    │     │   (buffer) │
            │ - error      │     │ - seeking  │
            │              │     │            │
            └──────────────┘     └────────────┘
```

---

## 7. ARCHITECTURE DES FICHIERS VIDÉO

```
┌────────────────────────────────────────────────────────────┐
│         /public/assets/videos/projects/                    │
│                                                            │
│  ├─ dis-moi-des-mots-d-amour/                            │
│  │  ├─ video.mp4 ✓ (existe)                              │
│  │  └─ video.webm (optionnel)                            │
│  │                                                        │
│  ├─ atelier-lacour/                                      │
│  │  ├─ .gitkeep (vide)                                   │
│  │  ├─ video.mp4 (à ajouter)                             │
│  │  └─ video.webm (optionnel)                            │
│  │                                                        │
│  ├─ a2mo/                                                │
│  │  ├─ .gitkeep (vide)                                   │
│  │  ├─ video.mp4 (à ajouter)                             │
│  │  └─ video.webm (optionnel)                            │
│  │                                                        │
│  ├─ la-force-de-la-douceur/                              │
│  │  ├─ .gitkeep (vide)                                   │
│  │  ├─ video.mp4 (à ajouter)                             │
│  │  └─ video.webm (optionnel)                            │
│  │                                                        │
│  └─ [autres projets avec vidéos futurs]/                 │
│     ├─ video.mp4                                          │
│     └─ video.webm                                         │
│                                                            │
│  CONVENTION:                                              │
│  /public/assets/videos/projects/${slug}/video.mp4         │
│                                                            │
│  FORMATS SUPPORTÉS:                                       │
│  - MP4 (obligatoire - h264 codec)                         │
│  - WebM (optionnel - vp9 codec, fallback)                 │
│                                                            │
│  TAILLE RECOMMANDÉE:                                      │
│  - Compresser pour web (5-50 MB selon durée)             │
│  - 1920x1080 ou 1280x720 résolution                      │
│  - Bitrate: 2-5 Mbps                                      │
└────────────────────────────────────────────────────────────┘
```

---

## 8. STRUCTURE HTML DU PLAYER GÉNÉRÉ

```javascript
// HTML généré par renderVideoPlayerHTML():

<section class="project-video" aria-label="Lecteur vidéo du projet">
  <div class="video-player" data-project-id="PROJECT_ID">
    <div class="video-player__container">
      
      <!-- Élément vidéo HTML5 -->
      <video id="video-PROJECT_ID" 
             class="video-player__video"
             poster="POSTER_URL"
             preload="metadata"
             playsinline>
        <source src="/assets/videos/projects/PROJECT_ID/video.mp4" 
                type="video/mp4">
        <source src="/assets/videos/projects/PROJECT_ID/video.webm" 
                type="video/webm">
        Votre navigateur ne supporte pas la lecture de vidéos.
      </video>

      <!-- Overlay play initial -->
      <div class="video-player__overlay" data-video-overlay>
        <button class="video-player__play-overlay"
                aria-label="Lecture de la vidéo"
                type="button"
                data-play-overlay>
          <svg width="80" height="80" viewBox="0 0 80 80">
            <!-- Play icon SVG -->
          </svg>
        </button>
      </div>

      <!-- Loading spinner -->
      <div class="video-player__loading" data-video-loading>
        <div class="video-player__spinner"></div>
      </div>

    </div>

    <!-- Contrôles personnalisés -->
    <div class="video-player__controls" data-video-controls>
      
      <!-- Bouton Play/Pause -->
      <button class="video-player__play-btn" 
              aria-label="Lecture/Pause"
              type="button"
              data-play-btn>
        <svg class="play-icon"><!-- Play icon --></svg>
        <svg class="pause-icon"><!-- Pause icon --></svg>
      </button>

      <!-- Timeline de progression -->
      <div class="video-player__timeline" data-timeline>
        <div class="video-player__progress" data-progress></div>
        <div class="video-player__buffered" data-buffered></div>
      </div>

      <!-- Affichage temps -->
      <div class="video-player__time">
        <span class="video-player__current" data-current-time>0:00</span>
        <span class="video-player__separator">/</span>
        <span class="video-player__duration" data-duration-time>DURATION</span>
      </div>

      <!-- Bouton Volume -->
      <button class="video-player__volume-btn"
              aria-label="Contrôle du volume"
              type="button"
              data-volume-btn>
        <svg class="volume-icon"><!-- Volume icon --></svg>
        <svg class="volume-muted-icon"><!-- Muted icon --></svg>
      </button>

      <!-- Bouton Fullscreen -->
      <button class="video-player__fullscreen-btn"
              aria-label="Plein écran"
              type="button"
              data-fullscreen-btn>
        <svg class="fullscreen-icon"><!-- Fullscreen icon --></svg>
        <svg class="fullscreen-exit-icon"><!-- Exit fullscreen icon --></svg>
      </button>

    </div>

  </div>
</section>
```

---

## 9. FLUX INTÉGRATION AVEC MODAL

```
┌───────────────────────────────────────────────────────────┐
│              ProjectModal.ts                              │
│                                                           │
│  open(project, triggerElement)                           │
│  {                                                        │
│    // Détruire ancien player                             │
│    this.destroyCurrentMediaPlayers()                     │
│                                                           │
│    // Setuper nouveau media                              │
│    this.setupProjectMedia({                              │
│      project,                                            │
│      videoContainer,                                     │
│      audioContainer,                                     │
│      visualContainer                                     │
│    })                                                     │
│  }                                                        │
└────────────────┬──────────────────────────────────────────┘
                 │
        ┌────────▼──────────┐
        │ setupProjectMedia │
        └────────┬──────────┘
                 │
          ┌──────▼──────────┐
          │ hasProjectVideo │
          │ (project) ?      │
          └─────┬──────┬────┘
                │      │
           YES ▼      ▼ NO
        ┌─────────┐  ┌─────────────┐
        │ VIDÉO  │  │ FALLBACK    │
        │ Setup   │  │ (image+     │
        │         │  │  audio)     │
        └────┬────┘  └─────────────┘
             │
    ┌────────▼────────────────┐
    │ Add Event Listeners:    │
    │                         │
    │ - 'project-video-ready' │
    │   → remove .is-loading  │
    │   → remove aria-busy    │
    │                         │
    │ - 'project-video-error' │
    │   → fallbackToVisual()  │
    └────────┬────────────────┘
             │
    ┌────────▼────────────────────┐
    │ createProjectVideoPlayer()   │
    │ projectVideoPlayer.js        │
    └────────┬────────────────────┘
             │
    ┌────────▼────────────────────┐
    │ playerInstance returned     │
    │ OR null if error            │
    │                             │
    │ If null → fallbackToVisual()│
    └──────────────────────────────┘
```

---

## 10. PRIORITÉS DE MÉDIAS DANS MODAL

```
┌────────────────────────────────────────────────────┐
│  Quand modal ouvre: setupProjectMedia()            │
│                                                    │
│  Priorité 1: VIDÉO (si enabled + file exist)      │
│  ├─ Affiche container vidéo                       │
│  ├─ Cache image cover                             │
│  ├─ Crée player vidéo                             │
│  └─ STOP (ne pas charger audio)                   │
│                                                    │
│  Priorité 2: AUDIO (si vidéo échoue ou absente)   │
│  ├─ Affiche container audio                       │
│  ├─ Peut afficher image cover                     │
│  └─ Crée player audio                             │
│                                                    │
│  Priorité 3: IMAGE (si vidéo ET audio absents)    │
│  ├─ Affiche cover image seule                     │
│  └─ Pas de lecteur                                │
│                                                    │
│  FALLBACK (si vidéo échoue à charger):            │
│  ├─ Détruit player vidéo                          │
│  ├─ Affiche image cover à la place                │
│  └─ Peut charger audio si existe                  │
│                                                    │
│  ÉVÉNEMENTS VIDÉO:                                │
│  ├─ 'project-video-ready' → Hide loading          │
│  └─ 'project-video-error' → Fallback à image      │
└────────────────────────────────────────────────────┘
```

---

