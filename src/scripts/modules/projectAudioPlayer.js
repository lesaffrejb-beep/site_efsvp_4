/**
 * ============================================
 * PROJECT AUDIO PLAYER
 * Extension du AudioPlayerManager pour les projets
 * Intégration avec metadata.json audio config
 * ============================================
 */

import WaveSurfer from 'wavesurfer.js';
import { gsap } from 'gsap';

/**
 * Crée un audio player pour un projet dans une modal/détail
 * @param {HTMLElement} container - Container où injecter le player
 * @param {Object} project - Objet projet avec config audio
 * @returns {Object|null} Instance WaveSurfer ou null
 */
export function createProjectAudioPlayer(container, project) {
  if (!project?.audio?.enabled || !project?.audio?.files?.mp3) {
    return null;
  }

  // Render le HTML du player
  renderAudioPlayerHTML(container, project);

  // Initialise WaveSurfer
  const waveformContainer = container.querySelector(`#waveform-${project.id}`);
  if (!waveformContainer) {
    console.error('[ProjectAudioPlayer] Waveform container not found');
    return null;
  }

  try {
    const wavesurfer = initWaveSurfer(waveformContainer, project);
    attachPlayerControls(container, wavesurfer, project);
    return wavesurfer;
  } catch (error) {
    console.error('[ProjectAudioPlayer] Initialization error:', error);
    showAudioError(container);
    return null;
  }
}

/**
 * Génère le HTML du player
 */
function renderAudioPlayerHTML(container, project) {
  const audio = project.audio;
  const duration = audio.duration || 0;

  container.innerHTML = `
    <section class="project-audio" aria-label="Lecteur audio du projet">
      <div class="audio-player" data-project-id="${project.id}">
        <button
          class="audio-player__play-btn"
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

        <div class="audio-player__info">
          <span class="audio-player__title">${escapeHtml(audio.title)}</span>
          ${audio.artist ? `<span class="audio-player__artist">${escapeHtml(audio.artist)}</span>` : ''}
        </div>

        <div class="audio-player__waveform" id="waveform-${project.id}"></div>

        <div class="audio-player__time">
          <span class="audio-player__current" aria-live="polite">0:00</span>
          <span class="audio-player__duration">${formatDuration(duration)}</span>
        </div>

        <button
          class="audio-player__volume-btn"
          aria-label="Contrôle du volume"
          type="button"
          data-volume-btn
        >
          <svg class="volume-icon" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" fill="currentColor"/>
          </svg>
          <svg class="volume-muted-icon" width="24" height="24" viewBox="0 0 24 24" style="display:none;" aria-hidden="true">
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM16.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" fill="currentColor" opacity="0.3"/>
            <line x1="2" y1="2" x2="22" y2="22" stroke="currentColor" stroke-width="2"/>
          </svg>
        </button>

        ${audio.description ? `<p class="audio-player__description">${escapeHtml(audio.description)}</p>` : ''}
      </div>
    </section>
  `;
}

/**
 * Initialise WaveSurfer
 */
function initWaveSurfer(container, project) {
  const audio = project.audio;
  const audioPath = audio.files.mp3;

  // Résout la couleur CSS custom property
  const waveformColor = audio.waveformColor || 'var(--color-primary-500)';
  const computedColor = resolveColorVariable(waveformColor);

  const wavesurfer = WaveSurfer.create({
    container: container,
    waveColor: hexToRgba(computedColor, 0.3),
    progressColor: computedColor,
    cursorColor: computedColor,
    barWidth: 2,
    barRadius: 3,
    barGap: 2,
    height: 60,
    normalize: true,
    responsive: true,
    backend: 'WebAudio',
    mediaControls: false,
    hideScrollbar: true,
    url: audioPath,
  });

  // Loading state
  showLoadingState(container);

  wavesurfer.on('loading', (percent) => {
    updateLoadingProgress(container, percent);
  });

  wavesurfer.on('ready', () => {
    hideLoadingState(container);
    updateDurationDisplay(container, wavesurfer.getDuration());

    // Animate waveform in
    gsap.from(container.querySelector('wave'), {
      scaleY: 0,
      duration: 0.6,
      ease: 'power2.out',
    });
  });

  wavesurfer.on('error', (error) => {
    console.error('[ProjectAudioPlayer] WaveSurfer error:', error);
    hideLoadingState(container);
    showAudioError(container.closest('.audio-player'));
  });

  return wavesurfer;
}

/**
 * Attache les contrôles du player
 */
function attachPlayerControls(container, wavesurfer, _project) {
  const playBtn = container.querySelector('[data-play-btn]');
  const volumeBtn = container.querySelector('[data-volume-btn]');
  const currentTimeEl = container.querySelector('.audio-player__current');

  let isMuted = false;

  // Play/Pause
  if (playBtn) {
    playBtn.addEventListener('click', () => {
      wavesurfer.playPause();

      // Animate button
      gsap.fromTo(playBtn, { scale: 0.95 }, { scale: 1, duration: 0.3, ease: 'back.out(2)' });
    });
  }

  // Volume toggle
  if (volumeBtn) {
    volumeBtn.addEventListener('click', () => {
      isMuted = !isMuted;
      wavesurfer.setVolume(isMuted ? 0 : 1);
      updateVolumeIcon(volumeBtn, isMuted);
    });
  }

  // WaveSurfer events
  wavesurfer.on('play', () => {
    updatePlayButton(playBtn, true);
  });

  wavesurfer.on('pause', () => {
    updatePlayButton(playBtn, false);
  });

  wavesurfer.on('audioprocess', () => {
    if (currentTimeEl) {
      currentTimeEl.textContent = formatDuration(wavesurfer.getCurrentTime());
    }
  });

  wavesurfer.on('seeking', (currentTime) => {
    if (currentTimeEl) {
      currentTimeEl.textContent = formatDuration(currentTime);
    }
  });

  wavesurfer.on('finish', () => {
    updatePlayButton(playBtn, false);
    wavesurfer.seekTo(0);
  });

  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.key === ' ' && e.target === playBtn) {
      e.preventDefault();
      wavesurfer.playPause();
    }
  });
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
 * Met à jour l'affichage de la durée
 */
function updateDurationDisplay(container, duration) {
  const durationEl = container.closest('.audio-player')?.querySelector('.audio-player__duration');
  if (durationEl) {
    durationEl.textContent = formatDuration(duration);
  }
}

/**
 * Loading state
 */
function showLoadingState(container) {
  const existing = container.querySelector('.waveform-loading');
  if (existing) return;

  const loading = document.createElement('div');
  loading.className = 'waveform-loading';
  loading.innerHTML = `
    <div class="waveform-loading__bar"></div>
    <div class="waveform-loading__text">Chargement<span class="waveform-loading__dots">...</span></div>
  `;

  container.appendChild(loading);

  // Animate dots
  const dots = loading.querySelector('.waveform-loading__dots');
  if (dots) {
    gsap.to(dots, {
      opacity: 0.3,
      duration: 0.6,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut',
    });
  }
}

function updateLoadingProgress(container, percent) {
  const bar = container.querySelector('.waveform-loading__bar');
  if (bar) {
    bar.style.width = `${percent}%`;
  }
}

function hideLoadingState(container) {
  const loading = container.querySelector('.waveform-loading');
  if (loading) {
    gsap.to(loading, {
      opacity: 0,
      duration: 0.3,
      onComplete: () => loading.remove(),
    });
  }
}

/**
 * Affiche une erreur audio
 */
function showAudioError(container) {
  if (!container) return;

  container.innerHTML = `
    <div class="audio-player__error">
      <svg class="audio-player__error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
      <span class="audio-player__error-text">Impossible de charger l'audio</span>
    </div>
  `;
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

function resolveColorVariable(colorVar) {
  if (!colorVar.startsWith('var(')) return colorVar;

  const varName = colorVar.replace('var(', '').replace(')', '').trim();
  const computed = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();

  return computed || '#B8441E'; // Fallback
}

function hexToRgba(hex, alpha = 1) {
  // Remove # if present
  hex = hex.replace('#', '');

  // Parse hex
  const result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return `rgba(184, 68, 30, ${alpha})`; // Fallback

  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

/**
 * Vérifie si un projet a de l'audio disponible
 */
export function hasProjectAudio(project) {
  return Boolean(project?.audio?.enabled && project?.audio?.files?.mp3);
}

/**
 * Détruit un player WaveSurfer
 */
export function destroyProjectAudioPlayer(wavesurfer) {
  if (wavesurfer) {
    try {
      wavesurfer.destroy();
    } catch (error) {
      console.error('[ProjectAudioPlayer] Destroy error:', error);
    }
  }
}
