/**
 * Audio Player Manager PREMIUM avec WaveSurfer.js
 * Waveform visualizer avec états, animations, et fallbacks
 */

import WaveSurfer from 'wavesurfer.js';
import { gsap } from 'gsap';

export class AudioPlayerManager {
  constructor() {
    this.players = [];
    this.currentPlayer = null;

    this.init();
  }

  init() {
    // Find all waveform containers from actual HTML
    const waveformContainers = document.querySelectorAll('[id^="waveform-"]');

    waveformContainers.forEach((container) => {
      this.createPlayer(container);
    });
  }

  createPlayer(container) {
    const waveformId = container.id;
    const playBtn = document.querySelector(`[data-audio="${waveformId.split('-')[1]}"]`);

    if (!playBtn) {
      if (import.meta?.env?.DEV) {
        console.warn(`No play button found for ${waveformId}`);
      }
      return;
    }

    const audioUrl = this.getAudioUrl(container, playBtn);

    if (!audioUrl) {
      this.showFallback(container, playBtn);
      return;
    }

    // Loading state
    this.showLoadingState(container);

    try {
      // Create WaveSurfer instance
      const wavesurfer = WaveSurfer.create({
        container: container,
        waveColor: 'rgba(184, 68, 30, 0.3)',
        progressColor: '#B8441E',
        cursorColor: '#E8924F',
        barWidth: 2,
        barRadius: 3,
        cursorWidth: 1,
        height: container.classList.contains('audio-player__waveform-mini') ? 40 : 60,
        barGap: 2,
        responsive: true,
        normalize: true,
        backend: 'WebAudio',
        mediaControls: false,
        hideScrollbar: true,
      });

      // Load audio with error handling
      wavesurfer.load(audioUrl);

      // Loading events
      wavesurfer.on('loading', (percent) => {
        this.updateLoadingState(container, percent);
      });

      // Ready event
      wavesurfer.on('ready', () => {
        this.hideLoadingState(container);

        // Update duration display
        const durationEl = this.findRelatedElement(playBtn, '.audio-player__duration');
        if (durationEl) {
          durationEl.textContent = this.formatTime(wavesurfer.getDuration());
        }

        // Animate waveform in
        gsap.from(container.querySelector('wave'), {
          scaleY: 0,
          duration: 0.6,
          ease: 'power2.out',
        });
      });

      // Play/Pause button
      playBtn.addEventListener('click', () => {
        // Pause all other players
        this.players.forEach(({ wavesurfer: ws, playBtn: btn }) => {
          if (ws !== wavesurfer && ws.isPlaying()) {
            ws.pause();
            this.updatePlayButton(btn, false);
          }
        });

        // Toggle current player
        wavesurfer.playPause();
        const isPlaying = wavesurfer.isPlaying();
        this.updatePlayButton(playBtn, isPlaying);

        // Animate button
        gsap.fromTo(playBtn, { scale: 0.9 }, { scale: 1, duration: 0.3, ease: 'back.out(2)' });
      });

      // Time update
      wavesurfer.on('audioprocess', () => {
        const currentTimeEl = this.findRelatedElement(playBtn, '.audio-player__current');
        if (currentTimeEl) {
          currentTimeEl.textContent = this.formatTime(wavesurfer.getCurrentTime());
        }
      });

      // Seek on click
      wavesurfer.on('seeking', (currentTime) => {
        const currentTimeEl = this.findRelatedElement(playBtn, '.audio-player__current');
        if (currentTimeEl) {
          currentTimeEl.textContent = this.formatTime(currentTime);
        }
      });

      // Finish event
      wavesurfer.on('finish', () => {
        this.updatePlayButton(playBtn, false);
        wavesurfer.seekTo(0);
      });

      // Error handling
      wavesurfer.on('error', (error) => {
        if (import.meta?.env?.DEV) {
          console.error(`WaveSurfer error for ${waveformId}:`, error);
        }
        this.showFallback(container, playBtn);
      });

      // Store player
      this.players.push({
        id: waveformId,
        wavesurfer,
        playBtn,
        container,
      });
    } catch (error) {
      if (import.meta?.env?.DEV) {
        console.error(`Failed to create audio player for ${waveformId}:`, error);
      }
      this.showFallback(container, playBtn);
    }
  }

  getAudioUrl(container, playBtn) {
    const containerSrc = container?.dataset?.src?.trim();
    const buttonSrc = playBtn?.dataset?.audioSrc?.trim();
    return containerSrc || buttonSrc || '';
  }

  findRelatedElement(playBtn, selector) {
    // Find element in same audio player container
    let parent = playBtn.closest('.audio-player');
    if (!parent) {
      parent = playBtn.closest('.bento-item');
    }
    return parent?.querySelector(selector);
  }

  showLoadingState(container) {
    container.innerHTML = `
      <div class="waveform-loading">
        <div class="waveform-loading__bar"></div>
        <div class="waveform-loading__text">Chargement<span class="waveform-loading__dots">...</span></div>
      </div>
    `;

    // Add loading styles
    this.addLoadingStyles();

    // Animate dots
    const dots = container.querySelector('.waveform-loading__dots');
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

  updateLoadingState(container, percent) {
    const bar = container.querySelector('.waveform-loading__bar');
    if (bar) {
      bar.style.width = `${percent}%`;
    }
  }

  hideLoadingState(container) {
    const loading = container.querySelector('.waveform-loading');
    if (loading) {
      gsap.to(loading, {
        opacity: 0,
        duration: 0.3,
        onComplete: () => loading.remove(),
      });
    }
  }

  showFallback(container, playBtn) {
    if (!container) return;

    container.innerHTML = `
      <div class="waveform-fallback">
        <svg class="waveform-fallback__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M9 18V5l12-2v13"></path>
          <circle cx="6" cy="18" r="3"></circle>
          <circle cx="18" cy="16" r="3"></circle>
        </svg>
        <span class="waveform-fallback__text">Audio bientôt disponible</span>
      </div>
    `;

    // Disable play button
    if (playBtn) {
      playBtn.disabled = true;
      playBtn.setAttribute('aria-disabled', 'true');
      playBtn.classList.add('is-disabled');
      playBtn.style.opacity = '0.5';
      playBtn.style.cursor = 'not-allowed';
      playBtn.setAttribute('title', 'Audio bientôt disponible');
    }
  }

  updatePlayButton(btn, isPlaying) {
    const playIcon = btn.querySelector('.play-icon');
    const pauseIcon = btn.querySelector('.pause-icon');

    if (playIcon && pauseIcon) {
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
  }

  formatTime(seconds) {
    if (isNaN(seconds) || !isFinite(seconds)) return '0:00';

    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }

  addLoadingStyles() {
    if (document.getElementById('waveform-loading-styles')) return;

    const style = document.createElement('style');
    style.id = 'waveform-loading-styles';
    style.textContent = `
      .waveform-loading {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        background: var(--border);
        border-radius: 8px;
        padding: 16px;
        position: relative;
        overflow: hidden;
      }

      .waveform-loading__bar {
        position: absolute;
        bottom: 0;
        left: 0;
        height: 3px;
        background: var(--accent);
        width: 0%;
        transition: width 0.3s ease;
      }

      .waveform-loading__text {
        font-size: 14px;
        color: var(--muted);
        font-weight: 500;
      }

      .waveform-loading__dots {
        display: inline-block;
        margin-left: 2px;
      }

      .waveform-fallback {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 12px;
        height: 100%;
        background: var(--border);
        border-radius: 8px;
        padding: 16px;
        color: var(--muted);
      }

      .waveform-fallback__icon {
        width: 24px;
        height: 24px;
        color: var(--accent);
        flex-shrink: 0;
      }

      .waveform-fallback__text {
        font-size: 14px;
      }

      @media (max-width: 475px) {
        .waveform-fallback {
          flex-direction: column;
          gap: 8px;
          text-align: center;
        }

        .waveform-fallback__text {
          font-size: 12px;
        }
      }
    `;

    document.head.appendChild(style);
  }

  // Public methods
  pauseAll() {
    this.players.forEach(({ wavesurfer, playBtn }) => {
      if (wavesurfer.isPlaying()) {
        wavesurfer.pause();
        this.updatePlayButton(playBtn, false);
      }
    });
  }

  destroy() {
    this.players.forEach(({ wavesurfer }) => {
      wavesurfer.destroy();
    });
    this.players = [];
  }
}
