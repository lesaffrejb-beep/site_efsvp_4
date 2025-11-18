// LEGACY – non utilisé dans la version actuelle du site. À supprimer après vérification.
/**
 * Reading Progress Bar Premium
 * Barre de progression de lecture au scroll avec gradient premium
 */

export class ProgressBar {
  constructor() {
    this.progressBar = null;
    this.init();
  }

  init() {
    this.createProgressBar();
    this.setupScrollListener();
  }

  createProgressBar() {
    // Créer l'élément progress bar
    this.progressBar = document.createElement('div');
    this.progressBar.className = 'reading-progress';
    this.progressBar.innerHTML = `
      <div class="reading-progress__bar"></div>
    `;

    // Ajouter au DOM
    document.body.appendChild(this.progressBar);

    // Ajouter les styles inline pour garantir le bon fonctionnement
    const styles = `
      .reading-progress {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 4px;
        z-index: 10000;
        background: linear-gradient(90deg, rgba(245, 230, 211, 0.95) 0%, rgba(245, 230, 211, 0.85) 100%);
        border-bottom: 1px solid rgba(184, 68, 30, 0.12);
        pointer-events: none;
        /* Backdrop-filter removed - was causing global veil effect */
      }

      .reading-progress__bar {
        height: 100%;
        width: 0%;
        background: linear-gradient(90deg, rgba(184, 68, 30, 0.95) 0%, rgba(232, 146, 79, 0.85) 45%, rgba(243, 180, 122, 0.8) 100%);
        box-shadow: 0 6px 18px rgba(184, 68, 30, 0.25);
        border-radius: 0 999px 999px 0;
        transition: width 0.1s cubic-bezier(0.4, 0, 0.2, 1);
      }

      /* Smooth appearance on load */
      .reading-progress {
        opacity: 0;
        animation: fadeIn 0.3s ease-out 0.5s forwards;
      }

      @keyframes fadeIn {
        to {
          opacity: 1;
        }
      }
    `;

    // Vérifier si les styles n'existent pas déjà
    if (!document.getElementById('progress-bar-styles')) {
      const styleSheet = document.createElement('style');
      styleSheet.id = 'progress-bar-styles';
      styleSheet.textContent = styles;
      document.head.appendChild(styleSheet);
    }
  }

  setupScrollListener() {
    const bar = this.progressBar.querySelector('.reading-progress__bar');
    let ticking = false;

    const updateProgress = () => {
      // Calculer la progression du scroll
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

      // Calculer le pourcentage (en excluant le viewport actuel)
      const scrollableHeight = documentHeight - windowHeight;
      const scrollPercentage = (scrollTop / scrollableHeight) * 100;

      // Appliquer la largeur
      bar.style.width = `${Math.min(scrollPercentage, 100)}%`;

      ticking = false;
    };

    // Utiliser requestAnimationFrame pour optimiser les performances
    const requestTick = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateProgress);
        ticking = true;
      }
    };

    // Écouter le scroll
    window.addEventListener('scroll', requestTick, { passive: true });

    // Mise à jour initiale
    updateProgress();
  }

  destroy() {
    if (this.progressBar) {
      this.progressBar.remove();
    }
  }
}
