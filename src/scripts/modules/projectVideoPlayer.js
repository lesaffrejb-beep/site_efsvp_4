/**
 * ============================================
 * PROJECT VIDEO PLAYER
 * Video player premium pour les projets
 * Intégration avec metadata.json video config
 * ============================================
 */

import { gsap } from 'gsap';

/**
 * Crée un video player pour un projet dans une modal/détail
 * @param {HTMLElement} container - Container où injecter le player
 * @param {Object} project - Objet projet avec config video
 * @returns {Object|null} Instance du player ou null
 */
export function createProjectVideoPlayer(container, project) {
  if (!project?.video?.enabled || !project?.video?.files?.mp4) {
    if (import.meta.env.DEV) {
      console.warn('[ProjectVideoPlayer] Video not available:', {
        enabled: project?.video?.enabled,
        hasMp4: !!project?.video?.files?.mp4,
        projectSlug: project?.slug
      });
    }
    return null;
  }

  if (import.meta.env.DEV) {
    console.warn('[ProjectVideoPlayer] Initializing for:', {
      slug: project.slug,
      videoPath: project.video.files.mp4
    });
  }

  // Render le HTML du player
  renderVideoPlayerHTML(container, project);

  // Initialise le player
  const videoElement = container.querySelector(`#video-${project.id}`);
  if (!videoElement) {
    console.error('[ProjectVideoPlayer] Video element not found after render');
    return null;
  }

  try {
    const playerInstance = initVideoPlayer(container, videoElement, project);
    return playerInstance;
  } catch (error) {
    console.error('[ProjectVideoPlayer] Initialization error:', error);
    showVideoError(container, project);
    return null;
  }
}

/**
 * Génère le HTML du player
 */
function renderVideoPlayerHTML(container, project) {
  const video = project.video;
  const duration = video.duration || 0;
  const poster = video.poster || '';
  const videoPath = video.files.mp4;
  const webmPath = video.files.webm;

  container.innerHTML = `
    <section class="project-video" aria-label="Lecteur vidéo du projet">
      <div class="video-player" data-project-id="${project.id}">
        <div class="video-player__container">
          <video
            id="video-${project.id}"
            class="video-player__video"
            ${poster ? `poster="${poster}"` : ''}
            preload="metadata"
            playsinline
          >
            <source src="${videoPath}" type="video/mp4">
            ${webmPath ? `<source src="${webmPath}" type="video/webm">` : ''}
            Votre navigateur ne supporte pas la lecture de vidéos.
          </video>

          <div class="video-player__overlay" data-video-overlay>
            <button
              class="video-player__play-overlay"
              aria-label="Lecture de la vidéo"
              type="button"
              data-play-overlay
            >
              <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                <circle cx="40" cy="40" r="38" stroke="currentColor" stroke-width="2" opacity="0.3"/>
                <path d="M32 25L55 40L32 55V25Z" fill="currentColor"/>
              </svg>
            </button>
          </div>

          <div class="video-player__loading" data-video-loading>
            <div class="video-player__spinner"></div>
          </div>
        </div>

        <div class="video-player__controls" data-video-controls>
          <button
            class="video-player__play-btn"
            aria-label="Lecture/Pause"
            type="button"
            data-play-btn
          >
            <svg class="play-icon" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M8 5v14l11-7z" fill="currentColor"/>
            </svg>
            <svg class="pause-icon" width="24" height="24" viewBox="0 0 24 24" style="display:none;" aria-hidden="true">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" fill="currentColor"/>
            </svg>
          </button>

          <div class="video-player__timeline" data-timeline>
            <div class="video-player__progress" data-progress></div>
            <div class="video-player__buffered" data-buffered></div>
          </div>

          <div class="video-player__time">
            <span class="video-player__current" aria-live="polite" data-current-time>0:00</span>
            <span class="video-player__separator">/</span>
            <span class="video-player__duration" data-duration-time>${formatDuration(duration)}</span>
          </div>

          <button
            class="video-player__volume-btn"
            aria-label="Contrôle du volume"
            type="button"
            data-volume-btn
          >
            <svg class="volume-icon" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" fill="currentColor"/>
            </svg>
            <svg class="volume-muted-icon" width="24" height="24" viewBox="0 0 24 24" style="display:none;" aria-hidden="true">
              <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" fill="currentColor"/>
            </svg>
          </button>

          <button
            class="video-player__fullscreen-btn"
            aria-label="Plein écran"
            type="button"
            data-fullscreen-btn
          >
            <svg class="fullscreen-icon" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" fill="currentColor"/>
            </svg>
            <svg class="fullscreen-exit-icon" width="24" height="24" viewBox="0 0 24 24" style="display:none;" aria-hidden="true">
              <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" fill="currentColor"/>
            </svg>
          </button>
        </div>

      </div>
    </section>
  `;
}

/**
 * Initialise le video player
 */
function initVideoPlayer(container, videoElement, project) {
  const video = project.video;
  const playerEl = container.querySelector('.video-player');

  const playerInstance = {
    video: videoElement,
    container: playerEl,
    isPlaying: false,
    isMuted: false,
    currentVolume: 1,
  };

  // Attache les contrôles
  attachVideoControls(container, playerInstance, project);

  // Gestion des events vidéo
  setupVideoEvents(container, playerInstance, project);

  // Autoplay si demandé
  if (video.autoplay) {
    setTimeout(() => {
      videoElement.play().catch(() => {
        // Autoplay silently prevented by browser
      });
    }, 500);
  }

  return playerInstance;
}

/**
 * Attache les contrôles du player
 */
function attachVideoControls(container, playerInstance, _project) {
  const { video } = playerInstance;
  const playBtn = container.querySelector('[data-play-btn]');
  const playOverlay = container.querySelector('[data-play-overlay]');
  const volumeBtn = container.querySelector('[data-volume-btn]');
  const fullscreenBtn = container.querySelector('[data-fullscreen-btn]');
  const timeline = container.querySelector('[data-timeline]');
  // const currentTimeEl = container.querySelector('[data-current-time]');
  // const durationTimeEl = container.querySelector('[data-duration-time]');
  const overlay = container.querySelector('[data-video-overlay]');

  // Play/Pause button
  if (playBtn) {
    playBtn.addEventListener('click', () => {
      togglePlayPause(playerInstance, container);
    });
  }

  // Play overlay
  if (playOverlay) {
    playOverlay.addEventListener('click', () => {
      togglePlayPause(playerInstance, container);
      hideOverlay(overlay);
    });
  }

  // Click sur la vidéo
  video.addEventListener('click', () => {
    togglePlayPause(playerInstance, container);
  });

  // Volume toggle
  if (volumeBtn) {
    volumeBtn.addEventListener('click', () => {
      playerInstance.isMuted = !playerInstance.isMuted;
      video.muted = playerInstance.isMuted;
      updateVolumeIcon(volumeBtn, playerInstance.isMuted);
    });
  }

  // Fullscreen
  if (fullscreenBtn) {
    fullscreenBtn.addEventListener('click', () => {
      toggleFullscreen(playerInstance.container, fullscreenBtn);
    });

    // Detect fullscreen change
    document.addEventListener('fullscreenchange', () => {
      updateFullscreenIcon(fullscreenBtn, !!document.fullscreenElement);
    });
  }

  // Timeline seek
  if (timeline) {
    timeline.addEventListener('click', (e) => {
      const rect = timeline.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      video.currentTime = percent * video.duration;
    });

    // Timeline dragging
    let isDragging = false;

    timeline.addEventListener('mousedown', () => {
      isDragging = true;
    });

    document.addEventListener('mouseup', () => {
      isDragging = false;
    });

    document.addEventListener('mousemove', (e) => {
      if (isDragging) {
        const rect = timeline.getBoundingClientRect();
        const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        video.currentTime = percent * video.duration;
      }
    });
  }

  // Keyboard shortcuts
  video.addEventListener('keydown', (e) => {
    switch (e.key) {
      case ' ':
      case 'k':
        e.preventDefault();
        togglePlayPause(playerInstance, container);
        break;
      case 'f':
        e.preventDefault();
        toggleFullscreen(playerInstance.container, fullscreenBtn);
        break;
      case 'm':
        e.preventDefault();
        playerInstance.isMuted = !playerInstance.isMuted;
        video.muted = playerInstance.isMuted;
        updateVolumeIcon(volumeBtn, playerInstance.isMuted);
        break;
      case 'ArrowLeft':
        e.preventDefault();
        video.currentTime = Math.max(0, video.currentTime - 5);
        break;
      case 'ArrowRight':
        e.preventDefault();
        video.currentTime = Math.min(video.duration, video.currentTime + 5);
        break;
    }
  });
}

/**
 * Setup video events
 */
function setupVideoEvents(container, playerInstance, project) {
  const { video } = playerInstance;
  const playBtn = container.querySelector('[data-play-btn]');
  const currentTimeEl = container.querySelector('[data-current-time]');
  const durationTimeEl = container.querySelector('[data-duration-time]');
  const progressBar = container.querySelector('[data-progress]');
  const bufferedBar = container.querySelector('[data-buffered]');
  const loadingEl = container.querySelector('[data-video-loading]');
  const overlay = container.querySelector('[data-video-overlay]');
  let hasDispatchedReady = false;

  const showLoading = () => {
    loadingEl?.classList.add('is-visible');
    container.classList.add('is-loading');
  };

  const hideLoading = () => {
    loadingEl?.classList.remove('is-visible');
    container.classList.remove('is-loading');
  };

  const dispatchReady = () => {
    if (hasDispatchedReady) return;
    hasDispatchedReady = true;
    hideLoading();
    container.dispatchEvent(new CustomEvent('project-video-ready', { bubbles: true }));
  };

  video.addEventListener('loadedmetadata', () => {
    if (durationTimeEl) {
      durationTimeEl.textContent = formatDuration(video.duration);
    }
  });

  video.addEventListener('loadeddata', dispatchReady);

  video.addEventListener('timeupdate', () => {
    if (currentTimeEl) {
      currentTimeEl.textContent = formatDuration(video.currentTime);
    }

    if (progressBar) {
      const percent = (video.currentTime / video.duration) * 100;
      progressBar.style.width = `${percent}%`;
    }
  });

  video.addEventListener('progress', () => {
    if (bufferedBar && video.buffered.length > 0) {
      const bufferedEnd = video.buffered.end(video.buffered.length - 1);
      const percent = (bufferedEnd / video.duration) * 100;
      bufferedBar.style.width = `${percent}%`;
    }
  });

  video.addEventListener('play', () => {
    playerInstance.isPlaying = true;
    updatePlayButton(playBtn, true);
    hideOverlay(overlay);
  });

  video.addEventListener('pause', () => {
    playerInstance.isPlaying = false;
    updatePlayButton(playBtn, false);
  });

  video.addEventListener('ended', () => {
    playerInstance.isPlaying = false;
    updatePlayButton(playBtn, false);
    showOverlay(overlay);
  });

  video.addEventListener('waiting', () => {
    showLoading();
  });

  video.addEventListener('canplay', () => {
    dispatchReady();
  });

  video.addEventListener('error', (e) => {
    const errorDetails = {
      code: video.error?.code,
      message: video.error?.message,
      src: video.currentSrc || video.src,
      networkState: video.networkState,
      readyState: video.readyState
    };

    console.error('[ProjectVideoPlayer] Video loading error:', errorDetails);

    if (import.meta.env.DEV) {
      const errorMessages = {
        1: 'MEDIA_ERR_ABORTED - Chargement abandonné par l\'utilisateur',
        2: 'MEDIA_ERR_NETWORK - Erreur réseau lors du chargement',
        3: 'MEDIA_ERR_DECODE - Erreur de décodage de la vidéo',
        4: 'MEDIA_ERR_SRC_NOT_SUPPORTED - Format non supporté ou fichier introuvable'
      };
      console.error('Détails:', errorMessages[video.error?.code] || 'Erreur inconnue');
    }

    hideLoading();
    container.dispatchEvent(new CustomEvent('project-video-error', { detail: { error: e, ...errorDetails }, bubbles: true }));
    showVideoError(container, project);
  });
}

/**
 * Toggle play/pause
 */
function togglePlayPause(playerInstance, container) {
  const { video } = playerInstance;

  if (video.paused) {
    video.play();
    // Animate play button
    const playBtn = container.querySelector('[data-play-btn]');
    if (playBtn) {
      gsap.fromTo(playBtn, { scale: 0.95 }, { scale: 1, duration: 0.3, ease: 'back.out(2)' });
    }
  } else {
    video.pause();
  }
}

/**
 * Toggle fullscreen
 */
function toggleFullscreen(element, _button) {
  if (!document.fullscreenElement) {
    element.requestFullscreen().catch((err) => {
      console.error('[ProjectVideoPlayer] Fullscreen error:', err);
    });
  } else {
    document.exitFullscreen();
  }
}

/**
 * Met à jour le bouton play/pause
 */
function updatePlayButton(btn, isPlaying) {
  if (!btn) return;

  const playIcon = btn.querySelector('.play-icon');
  const pauseIcon = btn.querySelector('.pause-icon');

  if (isPlaying) {
    playIcon.style.display = 'none';
    pauseIcon.style.display = 'block';
    btn.classList.add('playing');
    btn.setAttribute('aria-label', 'Pause');
  } else {
    playIcon.style.display = 'block';
    pauseIcon.style.display = 'none';
    btn.classList.remove('playing');
    btn.setAttribute('aria-label', 'Lecture');
  }
}

/**
 * Met à jour l'icône volume
 */
function updateVolumeIcon(btn, isMuted) {
  if (!btn) return;

  const volumeIcon = btn.querySelector('.volume-icon');
  const mutedIcon = btn.querySelector('.volume-muted-icon');

  if (isMuted) {
    volumeIcon.style.display = 'none';
    mutedIcon.style.display = 'block';
    btn.setAttribute('aria-label', 'Réactiver le son');
  } else {
    volumeIcon.style.display = 'block';
    mutedIcon.style.display = 'none';
    btn.setAttribute('aria-label', 'Couper le son');
  }
}

/**
 * Met à jour l'icône fullscreen
 */
function updateFullscreenIcon(btn, isFullscreen) {
  if (!btn) return;

  const fullscreenIcon = btn.querySelector('.fullscreen-icon');
  const exitIcon = btn.querySelector('.fullscreen-exit-icon');

  if (isFullscreen) {
    fullscreenIcon.style.display = 'none';
    exitIcon.style.display = 'block';
    btn.setAttribute('aria-label', 'Quitter le plein écran');
  } else {
    fullscreenIcon.style.display = 'block';
    exitIcon.style.display = 'none';
    btn.setAttribute('aria-label', 'Plein écran');
  }
}

/**
 * Hide overlay
 */
function hideOverlay(overlay) {
  if (!overlay) return;
  gsap.to(overlay, {
    opacity: 0,
    duration: 0.3,
    onComplete: () => {
      overlay.style.display = 'none';
    },
  });
}

/**
 * Show overlay
 */
function showOverlay(overlay) {
  if (!overlay) return;
  overlay.style.display = 'flex';
  gsap.to(overlay, {
    opacity: 1,
    duration: 0.3,
  });
}

/**
 * Affiche une erreur vidéo
 */
function showVideoError(container, project) {
  const target =
    container?.classList?.contains('video-player')
      ? container
      : container?.querySelector?.('.video-player');

  if (!target) return;

  const debugInfo = import.meta.env.DEV && project
    ? `<small style="color: #999; font-size: 0.875rem; margin-top: 0.5rem;">DEV: Projet "${project.slug}" - Vidéo: ${project.video?.files?.mp4 || 'non définie'}</small>`
    : '';

  target.innerHTML = `
    <div class="video-player__error" style="
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 3rem 2rem;
      text-align: center;
      background: rgba(0,0,0,0.05);
      border-radius: 1rem;
      min-height: 200px;
    ">
      <svg class="video-player__error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 48px; height: 48px; color: #999; margin-bottom: 1rem;">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
      <span class="video-player__error-text" style="color: #666; font-size: 1rem;">Impossible de charger la vidéo</span>
      ${debugInfo}
    </div>
  `;

  if (import.meta.env.DEV) {
    console.warn('[ProjectVideoPlayer] Affichage de l\'erreur vidéo pour:', project?.slug);
  }
}

/**
 * UTILITAIRES
 */

function formatDuration(seconds) {
  if (!seconds || isNaN(seconds) || !isFinite(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Vérifie si un projet a une vidéo disponible
 */
export function hasProjectVideo(project) {
  return Boolean(project?.video?.enabled && project?.video?.files?.mp4);
}

/**
 * Détruit un player vidéo
 */
export function destroyProjectVideoPlayer(playerInstance) {
  if (playerInstance && playerInstance.video) {
    try {
      playerInstance.video.pause();
      playerInstance.video.src = '';
      playerInstance.video.load();
    } catch (error) {
      console.error('[ProjectVideoPlayer] Destroy error:', error);
    }
  }
}
