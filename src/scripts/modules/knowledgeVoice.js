// LEGACY – non utilisé dans la version actuelle du site. À supprimer après vérification.
export class KnowledgeVoicePlayer {
  constructor(options = {}) {
    this.buttonSelector = options.buttonSelector || '[data-voice-trigger]';
    this.audioSelector = options.audioSelector || '#knowledge-voice';
  }

  init() {
    this.button = document.querySelector(this.buttonSelector);
    this.audio = document.querySelector(this.audioSelector);

    if (!this.button || !this.audio) {
      return;
    }

    this.label = this.button.querySelector('.knowledge__voice-label');
    this.audioSrc = this.audio.getAttribute('data-audio-src') || this.audio.getAttribute('src');

    if (this.audioSrc) {
      this.audio.setAttribute('src', this.audioSrc);
    } else {
      this.disable('Extrait indisponible');
      return;
    }
    this.button.addEventListener('click', () => this.toggle());

    this.audio.addEventListener('ended', () => this.reset(true));
    this.audio.addEventListener('pause', () => {
      if (!this.audio.ended) {
        this.reset();
      }
    });
    this.audio.addEventListener('error', () => {
      this.disable('Extrait indisponible');
    });
  }

  async toggle() {
    if (this.audio.paused) {
      await this.play();
    } else {
      this.audio.pause();
      this.reset();
    }
  }

  async play() {
    try {
      if (this.audio.currentTime > 0) {
        this.audio.currentTime = 0;
      }
      await this.audio.play();
      this.button.setAttribute('aria-expanded', 'true');
      if (this.label) {
        this.label.textContent = 'Mettre en pause';
      }
    } catch (error) {
      console.warn('Lecture de l’extrait impossible:', error);
      this.reset(true);
      this.disable('Lecture impossible');
    }
  }

  reset(resetTime = false) {
    this.button.setAttribute('aria-expanded', 'false');
    if (resetTime) {
      this.audio.currentTime = 0;
    }
    if (this.label) {
      this.label.textContent = 'Écouter l’extrait';
    }
  }

  disable(text) {
    this.button.setAttribute('disabled', 'true');
    this.button.classList.add('is-disabled');
    this.button.setAttribute('aria-disabled', 'true');
    this.button.setAttribute('aria-expanded', 'false');
    if (this.label && text) {
      this.label.textContent = text;
    }
  }
}
