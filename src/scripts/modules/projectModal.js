// LEGACY – non utilisé dans la version actuelle du site. À supprimer après vérification.
/**
 * ============================================
 * PROJECT MODAL - Affichage des détails projets
 * Gère l'ouverture, fermeture et contenu dynamique
 * Utilise les données de src/data/projects.js
 * ============================================
 */

import { projectsBySlug } from '../../content/projects/index.js';

async function checkAssetExists(path) {
  try {
    const response = await fetch(path, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    console.warn('ProjectModal: unable to verify asset', path, error);
    return false;
  }
}

function getProjectCoverImage(project) {
  if (!project?.cover) return null;
  if (typeof project.cover === 'string') return project.cover;
  if (typeof project.cover === 'object') {
    return project.cover.image || project.cover.src || null;
  }
  return null;
}

const SECTOR_LABELS = {
  artisanat: 'Artisanat',
  btp: 'BTP',
  environnement: 'Environnement',
  patrimoine: 'Patrimoine',
  agriculture: 'Agriculture',
  mobilite: 'Mobilité',
  'economie-sociale': 'Économie sociale',
  'spectacle-vivant': 'Spectacle vivant',
  territoire: 'Territoire',
  'vie-associative': 'Vie associative',
};

export class ProjectModal {
  constructor() {
    this.modal = null;
    this.closeBtn = null;
    this.overlay = null;
    this.projectCards = [];
    this.currentProject = null;
    this.projectsData = projectsBySlug;
    this.mediaRequestId = 0;

    this.init();
  }

  init() {
    this.modal = document.getElementById('project-modal');
    this.closeBtn = document.getElementById('project-modal-close');
    this.overlay = this.modal?.querySelector('.modal-overlay');
    this.projectCards = document.querySelectorAll('.project-card, [data-project-id]');

    if (!this.modal) {
      console.warn('ProjectModal: modal element not found');
      return;
    }

    this.setupEventListeners();
  }

  setupEventListeners() {
    // Click sur les cartes projet ou tout élément porteur de data-project-id
    this.projectCards.forEach((card) => {
      const link = card.querySelector?.('.project-card__link');
      const target = link || card;

      if (link) {
        link.style.cursor = 'pointer';
        link.setAttribute('role', 'button');
        link.setAttribute('tabindex', '0');
      }

      target.addEventListener('click', (e) => {
        if (link) {
          e.preventDefault();
        }
        const projectId = this.getProjectIdFromCard(card);
        if (projectId) {
          this.openModal(projectId);
        }
      });

      // Support clavier
      if (!['BUTTON', 'A'].includes(target.tagName)) {
        target.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            const projectId = this.getProjectIdFromCard(card);
            if (projectId) {
              this.openModal(projectId);
            }
          }
        });
      }
    });

    // Fermeture
    this.closeBtn?.addEventListener('click', () => this.closeModal());
    this.overlay?.addEventListener('click', () => this.closeModal());

    // Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modal?.classList.contains('active')) {
        this.closeModal();
      }
    });
  }

  getProjectIdFromCard(card) {
    // Méthode 1: Attribut data-project-id (recommandé)
    const dataId = card.getAttribute('data-project-id');
    if (dataId) return dataId;

    // Méthode 2: Extraire depuis le titre
    const title = card.querySelector('.project-card__title')?.textContent?.trim();

    // Mapper les titres aux IDs des données
    const titleToId = {
      'SIVAL 2025': 'sival-2025',
      'Atelier Lacour': 'atelier-lacour',
      'La force de la douceur': 'departement-49',
      'État de nature': 'etat-de-nature',
      'Réseau Cocagne': 'reseau-cocagne',
      'CAPEB Maine-et-Loire': 'capeb',
      'Clisson': 'clisson',
      'Brissac': 'brissac',
      'Doué-en-Anjou': 'doue-en-anjou',
      'Agglobus': 'agglobus',
      'Théâtre Jeune Plume': 'theatre-jeune-plume'
    };

    return titleToId[title] || null;
  }

  openModal(projectId) {
    const project = this.projectsData[projectId];
    if (!project) {
      console.warn(`ProjectModal: project "${projectId}" not found`);
      return;
    }

    this.currentProject = projectId;
    this.mediaRequestId += 1;
    const mediaRequestId = this.mediaRequestId;

    // Remplir le contenu
    const tagEl = document.getElementById('project-modal-tag');
    const titleEl = document.getElementById('project-modal-title');
    const metaEl = document.getElementById('project-modal-meta');
    const descEl = document.getElementById('project-modal-description');
    const statsEl = document.getElementById('project-modal-stats');
    const statsContentEl = document.getElementById('project-modal-stats-content');
    const visualEl = document.getElementById('project-modal-visual');
    const videoEl = document.getElementById('project-modal-video');
    const audioEl = document.getElementById('project-modal-audio');

    if (tagEl) tagEl.textContent = project.format || 'Projet';
    if (titleEl) titleEl.textContent = project.title;

    // Meta: Client · Année
    const metaParts = [project.client];
    if (project.period) {
      metaParts.push(project.period);
    } else if (project.year) {
      metaParts.push(String(project.year));
    }
    if (project.location) {
      metaParts.push(project.location);
    }
    const metaText = metaParts.filter(Boolean).join(' · ');
    if (metaEl) metaEl.textContent = metaText;

    // Description
    const taglineEl = document.getElementById('project-modal-tagline');
    if (taglineEl) {
      taglineEl.textContent = project.tagline || '';
      taglineEl.style.display = project.tagline ? 'block' : 'none';
    }

    if (visualEl) {
      const coverImage = getProjectCoverImage(project);
      const visualImg = visualEl.querySelector('img');
      if (coverImage && visualImg) {
        visualImg.src = coverImage;
        visualImg.alt = `${project.title} – ${project.location || project.client}`;
      }
      visualEl.dataset.hasCover = coverImage ? 'true' : 'false';
      visualEl.style.display = coverImage ? 'block' : 'none';
    }

    this.resetMediaContainers(videoEl, audioEl);

    if (descEl) {
      descEl.innerHTML = '';
      const rawParagraphs = Array.isArray(project.longDescription)
        ? project.longDescription
        : project.longDescription.split('\n\n');

      rawParagraphs
        .map((p) => p.trim())
        .filter(Boolean)
        .forEach((paragraph) => {
          const p = document.createElement('p');
          p.textContent = paragraph;
          descEl.appendChild(p);
        });
    }

    if (statsEl && statsContentEl) {
      const details = this.buildProjectDetails(project);
      if (details.length > 0) {
        statsContentEl.innerHTML = '';
        details.forEach(({ label, value }) => {
          const item = document.createElement('div');
          item.className = 'stat-item';

          const term = document.createElement('dt');
          term.textContent = label;
          const description = document.createElement('dd');
          description.textContent = value;

          item.append(term, description);
          statsContentEl.appendChild(item);
        });
        statsEl.style.display = 'block';
      } else {
        statsEl.style.display = 'none';
      }
    }

    // Ouvrir la modale
    this.modal.classList.add('active');
    this.modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Focus trap
    setTimeout(() => {
      this.closeBtn?.focus();
    }, 100);

    this.updateMediaAssets(project, mediaRequestId, { visualEl, videoEl, audioEl });
  }

  resetMediaContainers(videoEl, audioEl) {
    const videoContainer = videoEl || document.getElementById('project-modal-video');
    const audioContainer = audioEl || document.getElementById('project-modal-audio');

    if (videoContainer) {
      const existingVideo = videoContainer.querySelector('video');
      if (existingVideo && typeof existingVideo.pause === 'function') {
        existingVideo.pause();
        existingVideo.currentTime = 0;
      }
      videoContainer.innerHTML = '';
      videoContainer.style.display = 'none';
    }

    if (audioContainer) {
      const existingAudio = audioContainer.querySelector('audio');
      if (existingAudio && typeof existingAudio.pause === 'function') {
        existingAudio.pause();
        existingAudio.currentTime = 0;
      }
      audioContainer.innerHTML = '';
      audioContainer.style.display = 'none';
    }
  }

  async updateMediaAssets(project, requestId, containers = {}) {
    const { visualEl = document.getElementById('project-modal-visual'), videoEl = document.getElementById('project-modal-video'), audioEl = document.getElementById('project-modal-audio') } = containers;

    const slug = project.slug || project.id || this.currentProject;
    if (!slug) {
      return;
    }

    const mp4Path = `/assets/videos/projects/${slug}/video.mp4`;
    const webmPath = `/assets/videos/projects/${slug}/video.webm`;
    const audioPath = `/assets/audio/projects/${slug}/audio.mp3`;

    const [mp4Exists, webmExists, audioExists] = await Promise.all([
      checkAssetExists(mp4Path),
      checkAssetExists(webmPath),
      checkAssetExists(audioPath),
    ]);

    if (requestId !== this.mediaRequestId) {
      return;
    }

    const videoSource = mp4Exists ? mp4Path : webmExists ? webmPath : null;
    if (videoSource && videoEl) {
      const videoElement = document.createElement('video');
      videoElement.className = 'project-modal__video-player';
      videoElement.controls = true;
      videoElement.preload = 'metadata';
      videoElement.playsInline = true;
      videoElement.setAttribute('aria-label', `Vidéo du projet ${project.title}`);

      const sourceElement = document.createElement('source');
      sourceElement.src = videoSource;
      sourceElement.type = `video/${mp4Exists ? 'mp4' : 'webm'}`;
      videoElement.appendChild(sourceElement);

      videoEl.innerHTML = '';
      videoEl.appendChild(videoElement);
      videoEl.style.display = 'block';

      if (visualEl) {
        visualEl.style.display = 'none';
      }
    } else if (visualEl) {
      const hasCover = visualEl.dataset?.hasCover !== 'false';
      visualEl.style.display = hasCover ? 'block' : 'none';
    }

    if (audioExists && audioEl) {
      const audioElement = document.createElement('audio');
      audioElement.className = 'project-modal__audio-player';
      audioElement.controls = true;
      audioElement.preload = 'metadata';
      audioElement.src = audioPath;
      audioElement.setAttribute('aria-label', `Audio du projet ${project.title}`);

      audioEl.innerHTML = '';
      audioEl.appendChild(audioElement);
      audioEl.style.display = 'block';
    }
  }

  buildProjectDetails(project) {
    const details = [];

    if (project.sector) {
      details.push({ label: 'Secteur', value: SECTOR_LABELS[project.sector] || project.sector });
    }
    if (project.typology) {
      details.push({ label: 'Typologie', value: project.typology });
    }
    if (project.themes?.length) {
      details.push({ label: 'Thèmes', value: project.themes.join(' • ') });
    }
    if (project.roles?.length) {
      details.push({ label: 'Rôles', value: project.roles.join(' • ') });
    }
    if (project.devices?.length) {
      details.push({ label: 'Dispositifs', value: project.devices.join(' • ') });
    }
    if (project.partners?.length) {
      details.push({ label: 'Partenaires', value: project.partners.join(', ') });
    }
    if (project.playsCount) {
      details.push({ label: 'Représentations', value: `${project.playsCount}+` });
    }
    details.push({
      label: 'Statut',
      value: project.status === 'in_production' ? 'En production' : 'Livré',
    });

    return details;
  }

  closeModal() {
    this.resetMediaContainers();
    this.modal?.classList.remove('active');
    this.modal?.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    this.currentProject = null;
  }

  destroy() {
    this.closeBtn?.removeEventListener('click', () => this.closeModal());
    this.overlay?.removeEventListener('click', () => this.closeModal());
  }
}
