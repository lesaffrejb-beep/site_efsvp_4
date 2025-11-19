import { SECTOR_LABELS, type Project } from '@/types/project';
import { createProjectAudioPlayer, hasProjectAudio, destroyProjectAudioPlayer } from '@/scripts/modules/projectAudioPlayer';
import { createProjectVideoPlayer, hasProjectVideo, destroyProjectVideoPlayer } from '@/scripts/modules/projectVideoPlayer';

export class ProjectModal {
  private modal: HTMLElement | null;
  private closeButton: HTMLElement | null;
  private overlay: HTMLElement | null;
  private currentAudioPlayer: any = null;
  private currentVideoPlayer: any = null;
  private focusableElements: HTMLElement[] = [];
  private keydownHandler: (event: KeyboardEvent) => void;
  private triggerElement: HTMLElement | null = null;
  private previousBodyOverflow = '';

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

    this.triggerElement = triggerElement || (document.activeElement as HTMLElement | null);
    this.previousBodyOverflow = document.body.style.overflow;

    const tagEl = document.getElementById('project-modal-tag');
    const titleEl = document.getElementById('project-modal-title');
    const metaEl = document.getElementById('project-modal-meta');
    const descriptionEl = document.getElementById('project-modal-description');
    const statsContainer = document.getElementById('project-modal-stats');
    const statsGrid = document.getElementById('project-modal-stats-content');
    const visualContainer = document.getElementById('project-modal-visual');
    const visualImage = visualContainer?.querySelector('img');

    if (tagEl) tagEl.textContent = project.category;
    if (titleEl) titleEl.textContent = project.title;
    if (metaEl) metaEl.textContent = [project.client, project.year, project.location].filter(Boolean).join(' · ');

    if (visualContainer && visualImage && project.coverSrc) {
      visualContainer.style.display = 'block';
      visualImage.src = project.coverSrc;
      visualImage.alt = `${project.title} – ${project.location}`;
    } else if (visualContainer) {
      visualContainer.style.display = 'none';
    }

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

    // ✅ GESTION MEDIA DYNAMIQUE - Approche basée sur le SLUG
    // Priorité : Vidéo > Audio
    const audioContainer = document.getElementById('project-modal-audio');
    const videoContainer = document.getElementById('project-modal-video');

    // ✅ NOUVELLE APPROCHE : Vidéo dynamique basée sur le slug
    // Construction du chemin : /assets/videos/projects/${slug}/video.mp4
    const slug = project.id;
    const videoPath = `/assets/videos/projects/${slug}/video.mp4`;

    if (videoContainer) {
      // Créer un élément vidéo simple avec gestion d'erreur
      const videoElement = document.createElement('video');
      videoElement.className = 'project-modal__video-player';
      videoElement.controls = true;
      videoElement.preload = 'metadata';
      videoElement.playsInline = true;
      videoElement.setAttribute('aria-label', `Vidéo du projet ${project.title}`);

      const sourceElement = document.createElement('source');
      sourceElement.src = videoPath;
      sourceElement.type = 'video/mp4';
      videoElement.appendChild(sourceElement);

      // ✅ GESTION D'ERREUR : Si la vidéo n'existe pas (404), masquer le container
      videoElement.onerror = () => {
        console.log(`ℹ️ Aucune vidéo trouvée pour ${slug}`);
        videoContainer.style.display = 'none';

        // Fallback vers audio si disponible
        if (hasProjectAudio(project) && audioContainer) {
          audioContainer.style.display = 'block';
          this.currentAudioPlayer = createProjectAudioPlayer(audioContainer, project);
        }
      };

      // ✅ SUCCESS : Si la vidéo charge, afficher le container et masquer audio
      videoElement.onloadedmetadata = () => {
        console.log(`✅ Vidéo chargée pour ${slug}`);
        videoContainer.style.display = 'block';
        if (audioContainer) audioContainer.style.display = 'none';
      };

      // Injecter le player
      videoContainer.innerHTML = '';
      videoContainer.appendChild(videoElement);
    }

    // Si pas de vidéo ET qu'on a un audio, afficher l'audio
    // (sera géré automatiquement par le onerror du vidéo)

    this.modal.classList.add('active');
    this.setModalAccessibility(true);
    this.refreshFocusableElements();

    const initialFocusTarget = this.focusableElements[0] || this.closeButton;
    if (initialFocusTarget) {
      initialFocusTarget.focus();
    }

    document.addEventListener('keydown', this.keydownHandler);
    document.body.style.overflow = 'hidden';
  }

  close() {
    if (!this.modal) return;

    // Détruire l'audio player s'il existe
    if (this.currentAudioPlayer) {
      destroyProjectAudioPlayer(this.currentAudioPlayer);
      this.currentAudioPlayer = null;
    }

    // Détruire le video player s'il existe
    if (this.currentVideoPlayer) {
      destroyProjectVideoPlayer(this.currentVideoPlayer);
      this.currentVideoPlayer = null;
    }

    this.modal.classList.remove('active');
    this.setModalAccessibility(false);
    document.removeEventListener('keydown', this.keydownHandler);
    document.body.style.overflow = this.previousBodyOverflow;

    if (this.triggerElement) {
      this.triggerElement.focus();
    }
    this.triggerElement = null;
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
