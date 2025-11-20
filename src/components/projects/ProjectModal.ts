import { SECTOR_LABELS, type Project } from '@/types/project';
import { createProjectAudioPlayer, hasProjectAudio, destroyProjectAudioPlayer } from '@/scripts/modules/projectAudioPlayer';
import { createProjectVideoPlayer, hasProjectVideo, destroyProjectVideoPlayer } from '@/scripts/modules/projectVideoPlayer';

export class ProjectModal {
  private modal: HTMLElement | null;
  private closeButton: HTMLElement | null;
  private overlay: HTMLElement | null;
  private currentAudioPlayer: any = null;
  private currentVideoPlayer: any = null;
  private videoEventCleanups: Array<() => void> = [];
  private focusableElements: HTMLElement[] = [];
  private keydownHandler: (event: KeyboardEvent) => void;
  private triggerElement: HTMLElement | null = null;
  private previousBodyOverflow = '';
  private lenisWasActive = false; // ✅ Track if Lenis was active before opening modal
  private preventBackgroundScrollHandler: (event: Event) => void;

  constructor() {
    this.preventBackgroundScrollHandler = (event: Event) => this.handlePreventBackgroundScroll(event);
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

    this.triggerElement = triggerElement || (document.activeElement as HTMLElement | null);
    this.previousBodyOverflow = document.body.style.overflow;

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
    this.setModalAccessibility(true);
    this.refreshFocusableElements();

    const initialFocusTarget = this.focusableElements[0] || this.closeButton;
    if (initialFocusTarget) {
      initialFocusTarget.focus();
    }

    document.addEventListener('keydown', this.keydownHandler);

    // ✅ CRITICAL FIX: Stop Lenis smooth scroll to allow modal scroll
    // Lenis intercepts wheel/touch events globally, blocking modal scroll
    // We must stop() it when modal opens and start() when it closes
    const lenis = (window as any).lenis;
    if (lenis && typeof lenis.stop === 'function') {
      this.lenisWasActive = true;
      lenis.stop();
      if (import.meta.env.DEV) {
        console.log('🔒 ProjectModal: Lenis stopped to allow modal scroll');
      }
    }

    // ✅ FALLBACK: Si Lenis n'est pas défini, appliquer overflow hidden + prevent scroll handlers
    // Ajouter un handler robuste pour bloquer le scroll du fond sur desktop
    document.body.style.overflow = 'hidden';

    // Attacher les handlers pour empêcher le scroll de fond (wheel + touchmove)
    // passive: false permet d'appeler preventDefault()
    document.addEventListener('wheel', this.preventBackgroundScrollHandler, { passive: false });
    document.addEventListener('touchmove', this.preventBackgroundScrollHandler, { passive: false });

    if (import.meta.env.DEV && !lenis) {
      console.log('🔒 ProjectModal: Fallback scroll prevention active (Lenis not found)');
    }
  }

  close() {
    if (!this.modal) return;

    this.destroyCurrentMediaPlayers();

    this.modal.classList.remove('active');
    this.setModalAccessibility(false);
    document.removeEventListener('keydown', this.keydownHandler);

    // ✅ Retirer les handlers de prévention du scroll de fond
    document.removeEventListener('wheel', this.preventBackgroundScrollHandler);
    document.removeEventListener('touchmove', this.preventBackgroundScrollHandler);

    // ✅ Restaurer l'overflow du body
    document.body.style.overflow = this.previousBodyOverflow;

    // ✅ CRITICAL FIX: Restart Lenis smooth scroll after modal closes
    // Only restart if it was active before opening the modal
    if (this.lenisWasActive) {
      const lenis = (window as any).lenis;
      if (lenis && typeof lenis.start === 'function') {
        lenis.start();
        if (import.meta.env.DEV) {
          console.log('🔓 ProjectModal: Lenis restarted after modal close');
        }
      }
      this.lenisWasActive = false;
    }

    if (this.triggerElement) {
      this.triggerElement.focus();
    }
    this.triggerElement = null;
  }

  private destroyCurrentMediaPlayers() {
    this.cleanupVideoEventListeners();

    if (this.currentAudioPlayer) {
      destroyProjectAudioPlayer(this.currentAudioPlayer);
      this.currentAudioPlayer = null;
    }

    if (this.currentVideoPlayer) {
      destroyProjectVideoPlayer(this.currentVideoPlayer);
      this.currentVideoPlayer = null;
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

    if (videoContainer && hasProjectVideo(project)) {
      visualContainer?.setAttribute('aria-hidden', 'true');
      if (visualContainer) {
        visualContainer.style.display = 'none';
      }

      let videoSettled = false;
      const settleVideoState = () => {
        if (videoSettled) return;
        videoSettled = true;
        videoContainer.classList.remove('is-loading');
        videoContainer.removeAttribute('aria-busy');
        this.cleanupVideoEventListeners();
      };

      const fallbackToVisual = (event?: Event) => {
        console.error(`[ProjectModal] Video fallback triggered for ${project.slug}`, event);
        settleVideoState();
        if (this.currentVideoPlayer) {
          destroyProjectVideoPlayer(this.currentVideoPlayer);
          this.currentVideoPlayer = null;
        }
        videoContainer.style.display = 'none';
        videoContainer.innerHTML = '';
        this.renderVisualFallback(visualContainer, project);
      };

      const handleVideoReady = () => {
        settleVideoState();
      };

      const handleVideoError = (event: Event) => {
        fallbackToVisual(event);
      };

      videoContainer.style.display = 'block';
      videoContainer.classList.add('is-loading');
      videoContainer.setAttribute('aria-busy', 'true');

      this.registerVideoContainerEvent(videoContainer, 'project-video-ready', handleVideoReady);
      this.registerVideoContainerEvent(videoContainer, 'project-video-error', handleVideoError);

      this.currentVideoPlayer = createProjectVideoPlayer(videoContainer, project);

      if (!this.currentVideoPlayer) {
        fallbackToVisual();
      } else {
        return; // Priorité à la vidéo, ne pas initialiser l'audio
      }
    }

    if (audioContainer && hasProjectAudio(project)) {
      audioContainer.style.display = 'block';
      this.currentAudioPlayer = createProjectAudioPlayer(audioContainer, project);
    }
  }

  private registerVideoContainerEvent(container: HTMLElement, eventName: string, handler: EventListener) {
    container.addEventListener(eventName, handler);
    this.videoEventCleanups.push(() => container.removeEventListener(eventName, handler));
  }

  private cleanupVideoEventListeners() {
    this.videoEventCleanups.forEach((cleanup) => cleanup());
    this.videoEventCleanups = [];
  }

  private renderVisualFallback(visualContainer: HTMLElement | null, project: Project) {
    if (!visualContainer || !project.coverSrc) {
      if (visualContainer) {
        visualContainer.style.display = 'none';
        visualContainer.setAttribute('aria-hidden', 'true');
      }
      return;
    }

    let visualImage = visualContainer.querySelector('img');
    if (!visualImage) {
      visualImage = document.createElement('img');
      visualImage.loading = 'lazy';
      visualContainer.innerHTML = '';
      visualContainer.appendChild(visualImage);
    }

    const altParts = [project.title, project.location].filter(Boolean).join(' – ');
    visualImage.src = project.coverSrc;
    visualImage.alt = altParts || project.title;
    visualContainer.style.display = 'block';
    visualContainer.removeAttribute('aria-hidden');
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

  /**
   * ✅ Handler pour empêcher le scroll de fond pendant que la modal est ouverte
   * Laisse passer le scroll si l'event vient de l'intérieur de la modal
   * Sinon, bloque le scroll pour éviter que le fond ne défile
   */
  private handlePreventBackgroundScroll(event: Event) {
    if (!this.modal?.classList.contains('active')) return;

    // Vérifier si l'event provient de l'intérieur de la modal
    const target = event.target as HTMLElement;
    const isInsideModal = this.modal.contains(target);

    // Si l'event vient de l'intérieur de la modal, laisser passer le scroll
    if (isInsideModal) {
      return;
    }

    // Sinon, bloquer le scroll de fond
    event.preventDefault();
  }
}
