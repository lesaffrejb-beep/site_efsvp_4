import { SECTOR_LABELS, type Project } from '@/types/project';
import { createProjectAudioPlayer, hasProjectAudio, destroyProjectAudioPlayer } from '@/scripts/modules/projectAudioPlayer';
import { createProjectVideoPlayer, hasProjectVideo, destroyProjectVideoPlayer } from '@/scripts/modules/projectVideoPlayer';

export class ProjectModal {
  private modal: HTMLElement | null;
  private closeButton: HTMLElement | null;
  private overlay: HTMLElement | null;
  private currentAudioPlayer: any = null;
  private currentVideoPlayer: any = null;

  constructor() {
    this.modal = document.getElementById('project-modal');
    this.closeButton = document.getElementById('project-modal-close');
    this.overlay = this.modal?.querySelector('.modal-overlay') as HTMLElement | null;
    this.attachEvents();
  }

  private attachEvents() {
    this.closeButton?.addEventListener('click', () => this.close());
    this.overlay?.addEventListener('click', () => this.close());
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && this.modal?.classList.contains('active')) {
        this.close();
      }
    });
  }

  open(project: Project) {
    if (!this.modal) return;

    const tagEl = document.getElementById('project-modal-tag');
    const titleEl = document.getElementById('project-modal-title');
    const metaEl = document.getElementById('project-modal-meta');
    const descriptionEl = document.getElementById('project-modal-description');
    const statsContainer = document.getElementById('project-modal-stats');
    const statsGrid = document.getElementById('project-modal-stats-content');

    if (tagEl) tagEl.textContent = project.category;
    if (titleEl) titleEl.textContent = project.title;
    if (metaEl) metaEl.textContent = [project.client, project.year, project.location].filter(Boolean).join(' · ');

    if (descriptionEl) {
      descriptionEl.innerHTML = project.longDescription
        .map((paragraph) => `<p>${paragraph}</p>`)
        .join('');
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

      statsGrid.innerHTML = stats
        .map(
          (entry) => `
          <div class="stat-item">
            <dt>${entry.label}</dt>
            <dd>${entry.value}</dd>
          </div>
        `
        )
        .join('');

      statsContainer.style.display = stats.length ? 'block' : 'none';
    }

    // Gestion des media players (PRIORITÉ: vidéo > audio)
    const audioContainer = document.getElementById('project-modal-audio');
    const videoContainer = document.getElementById('project-modal-video');

    // Logique conditionnelle : vidéo OU audio (pas les deux)
    if (hasProjectVideo(project)) {
      // VIDÉO : prioritaire
      if (videoContainer) {
        videoContainer.style.display = 'block';
        this.currentVideoPlayer = createProjectVideoPlayer(videoContainer, project);
      }
      if (audioContainer) {
        audioContainer.style.display = 'none';
      }
    } else if (hasProjectAudio(project)) {
      // AUDIO : si pas de vidéo
      if (audioContainer) {
        audioContainer.style.display = 'block';
        this.currentAudioPlayer = createProjectAudioPlayer(audioContainer, project);
      }
      if (videoContainer) {
        videoContainer.style.display = 'none';
      }
    } else {
      // AUCUN MEDIA
      if (audioContainer) audioContainer.style.display = 'none';
      if (videoContainer) videoContainer.style.display = 'none';
    }

    this.modal.classList.add('active');
    this.modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    setTimeout(() => this.closeButton?.focus(), 100);
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
    this.modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
}
