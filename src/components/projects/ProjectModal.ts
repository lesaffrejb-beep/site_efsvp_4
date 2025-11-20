import { SECTOR_LABELS, type Project } from '@/types/project';
import { createProjectAudioPlayer, hasProjectAudio, destroyProjectAudioPlayer } from '@/scripts/modules/projectAudioPlayer';

/**
 * Project modal lifecycle overview
 * - Content lives in content/projects.json and is normalized in src/data/projects.loader.ts
 *   (cover/thumbnail resolution, slug → assets folder mapping, and strict asset existence checks
 *   for media like /assets/videos/projects/<folder>/video.mp4).
 * - The modal renders these normalized Project objects: details + cover image by default,
 *   optional HTML5 video/audio players only when the loader confirmed a real asset.
 * - Opening locks the background scroll via a simple body class, focuses the modal, and scrolls
 *   only inside .project-modal. Closing removes the lock class and restores focus to the trigger.
 */

export class ProjectModal {
  private modal: HTMLElement | null;
  private closeButton: HTMLElement | null;
  private overlay: HTMLElement | null;
  private currentAudioPlayer: any = null;
  private focusableElements: HTMLElement[] = [];
  private keydownHandler: (event: KeyboardEvent) => void;
  private triggerElement: HTMLElement | null = null;

  constructor() {
    this.modal = document.getElementById('project-modal');
    this.closeButton = document.getElementById('project-modal-close');
    this.overlay = this.modal?.querySelector('.modal-overlay') as HTMLElement | null;
    this.keydownHandler = (event: KeyboardEvent) => this.handleKeydown(event);
    this.applyModalAccessibilityAttributes();
    this.setModalAccessibility(false);
    this.attachEvents();
  }

  private attachEvents() {
    this.closeButton?.addEventListener('click', () => this.close());
    this.overlay?.addEventListener('click', () => this.close());
  }

  open(project: Project, triggerElement?: HTMLElement | null) {
    if (!this.modal) return;

    // 🔍 DIAGNOSTIC LOG - Données du projet au moment de l'ouverture de la modal
    if (import.meta.env.DEV) {
      console.log('[MODAL DEBUG]', {
        slug: project.slug,
        media: project.media,
        video: project.video,
        audio: project.audio,
        hasVideo: project.media?.video,
        hasAudio: project.media?.audio,
      });
    }

    this.triggerElement = triggerElement ?? null;

    document.body.classList.add('project-modal-open');

    const tagEl = document.getElementById('project-modal-tag');
    const titleEl = document.getElementById('project-modal-title');
    const metaEl = document.getElementById('project-modal-meta');
    const descriptionEl = document.getElementById('project-modal-description');
    const statsContainer = document.getElementById('project-modal-stats');
    const statsGrid = document.getElementById('project-modal-stats-content');
    const visualContainer = document.getElementById('project-modal-visual');
    const videoContainer = document.getElementById('project-modal-video');
    const audioContainer = document.getElementById('project-modal-audio');
    const visualImage = visualContainer?.querySelector('img');

    if (tagEl) tagEl.textContent = project.category;
    if (titleEl) titleEl.textContent = project.title;
    if (metaEl) metaEl.textContent = [project.client, project.year, project.location].filter(Boolean).join(' · ');

    if (descriptionEl) {
      descriptionEl.innerHTML = '';
      project.longDescription.forEach((paragraph) => {
        const p = document.createElement('p');
        p.textContent = paragraph;
        descriptionEl.appendChild(p);
      });
    }

    if (statsContainer && statsGrid) {
      const stats = [
        { label: 'Secteur', value: SECTOR_LABELS[project.sector] },
        { label: 'Format', value: project.details.format },
        { label: 'Durée', value: project.details.duration },
        { label: 'Public', value: project.details.audience },
        { label: 'Livrables', value: project.details.deliverables.join(' • ') },
        { label: 'Thèmes', value: project.themes.join(' • ') },
        { label: 'Équipe', value: project.team.join(' • ') },
      ].filter((entry) => Boolean(entry.value));

      statsGrid.innerHTML = '';
      stats.forEach((entry) => {
        const item = document.createElement('div');
        item.className = 'stat-item';

        const term = document.createElement('dt');
        term.textContent = entry.label;

        const definition = document.createElement('dd');
        definition.textContent = entry.value;

        item.append(term, definition);
        statsGrid.appendChild(item);
      });

      statsContainer.style.display = stats.length ? 'block' : 'none';
    }

    this.destroyCurrentMediaPlayers();
    this.setupProjectMedia({ project, visualContainer, visualImage, videoContainer, audioContainer });

    this.modal.classList.add('active');
    (this.modal as HTMLElement).scrollTop = 0;
    this.setModalAccessibility(true);
    this.refreshFocusableElements();

    const initialFocusTarget = this.focusableElements[0] || this.closeButton;
    if (initialFocusTarget) {
      initialFocusTarget.focus();
    }

    document.addEventListener('keydown', this.keydownHandler);
  }

  close() {
    if (!this.modal) return;

    this.modal.classList.remove('active');
    document.body.classList.remove('project-modal-open');

    this.destroyCurrentMediaPlayers();
    this.setModalAccessibility(false);
    document.removeEventListener('keydown', this.keydownHandler);

    if (this.triggerElement && typeof this.triggerElement.focus === 'function') {
      this.triggerElement.focus();
    }
    this.triggerElement = null;
  }

  private destroyCurrentMediaPlayers() {
    if (this.currentAudioPlayer) {
      destroyProjectAudioPlayer(this.currentAudioPlayer);
      this.currentAudioPlayer = null;
    }

    const videoContainer = document.getElementById('project-modal-video');
    if (videoContainer) {
      videoContainer.innerHTML = '';
      videoContainer.style.display = 'none';
      videoContainer.setAttribute('aria-hidden', 'true');
    }
  }

  private setupProjectMedia({
    project,
    visualContainer,
    visualImage,
    videoContainer,
    audioContainer,
  }: {
    project: Project;
    visualContainer: HTMLElement | null;
    visualImage: HTMLImageElement | null | undefined;
    videoContainer: HTMLElement | null;
    audioContainer: HTMLElement | null;
  }) {
    // ✅ SIMPLIFIED: Détection unifiée de la source vidéo
    const videoSrc = project.media?.video || project.video?.files?.mp4 || null;

    let visualEl = visualImage ?? null;

    if (visualContainer && project.coverSrc) {
      if (!visualEl) {
        visualEl = document.createElement('img');
        visualEl.loading = 'lazy';
        visualContainer.innerHTML = '';
        visualContainer.appendChild(visualEl);
      }

      const altParts = [project.title, project.location].filter(Boolean).join(' – ');
      visualEl.src = project.coverSrc;
      visualEl.alt = altParts || project.title;
      visualContainer.style.display = 'block';
      visualContainer.removeAttribute('aria-hidden');
    } else if (visualContainer) {
      visualContainer.style.display = 'none';
      visualContainer.setAttribute('aria-hidden', 'true');
    }

    if (videoContainer) {
      videoContainer.style.display = 'none';
      videoContainer.classList.remove('is-loading');
      videoContainer.removeAttribute('aria-busy');
      videoContainer.innerHTML = '';
    }
    if (audioContainer) {
      audioContainer.style.display = 'none';
      audioContainer.innerHTML = '';
    }

    // ✅ Logique vidéo simplifiée : player natif HTML5 uniquement si une vidéo existe réellement
    if (videoContainer && videoSrc) {
      if (visualContainer) {
        visualContainer.style.display = 'none';
        visualContainer.setAttribute('aria-hidden', 'true');
      }

      videoContainer.style.display = 'block';
      videoContainer.removeAttribute('aria-hidden');
      videoContainer.innerHTML = `
    <div class="project-video-fallback">
      <video
        controls
        playsinline
        preload="metadata"
        style="
          width: 100%;
          height: auto;
          border-radius: var(--radius-xl);
          background: #000;
          display: block;
        "
      >
        <source src="${videoSrc}" type="video/mp4" />
        Votre navigateur ne supporte pas la vidéo.
      </video>
    </div>
  `;

      const videoEl = videoContainer.querySelector('video');
      if (videoEl) {
        const handleVideoError = () => {
          videoContainer.style.display = 'none';
          videoContainer.setAttribute('aria-hidden', 'true');
          if (visualContainer) {
            visualContainer.style.display = 'block';
            visualContainer.removeAttribute('aria-hidden');
          }
        };

        videoEl.addEventListener('error', handleVideoError, { once: true });
      }

      return;
    }

    if (audioContainer && hasProjectAudio(project)) {
      audioContainer.style.display = 'block';
      this.currentAudioPlayer = createProjectAudioPlayer(audioContainer, project);
    }
  }

  private setModalAccessibility(isOpen: boolean) {
    if (!this.modal) return;

    this.modal.setAttribute('aria-hidden', isOpen ? 'false' : 'true');

    if (isOpen) {
      this.modal.removeAttribute('inert');
    } else {
      this.modal.setAttribute('inert', '');
    }
  }

  private applyModalAccessibilityAttributes() {
    if (!this.modal) return;

    const labelledBy = this.modal.querySelector<HTMLElement>('#project-modal-title');
    this.modal.setAttribute('role', 'dialog');
    this.modal.setAttribute('aria-modal', 'true');
    if (labelledBy?.id) {
      this.modal.setAttribute('aria-labelledby', labelledBy.id);
    }
  }

  private refreshFocusableElements() {
    if (!this.modal) {
      this.focusableElements = [];
      return;
    }

    const selectors = [
      'button:not([disabled])',
      'a[href]',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ];

    this.focusableElements = Array.from(
      this.modal.querySelectorAll<HTMLElement>(selectors.join(','))
    ).filter((el) => el.offsetParent !== null);
  }

  private handleKeydown(event: KeyboardEvent) {
    if (!this.modal?.classList.contains('active')) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      this.close();
      return;
    }

    if (event.key !== 'Tab') return;

    this.refreshFocusableElements();
    if (!this.focusableElements.length) return;

    const first = this.focusableElements[0];
    const last = this.focusableElements[this.focusableElements.length - 1];

    if (event.shiftKey) {
      if (document.activeElement === first) {
        event.preventDefault();
        last.focus();
      }
    } else if (document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
}
