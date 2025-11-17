/**
 * ============================================
 * PROJECT MODAL - Affichage des détails projets
 * Gère l'ouverture, fermeture et contenu dynamique
 * Utilise les données de src/data/projects.js
 * ============================================
 */

import { projectsBySlug } from '../../content/projects/index.js';

export class ProjectModal {
  constructor() {
    this.modal = null;
    this.closeBtn = null;
    this.overlay = null;
    this.projectCards = [];
    this.currentProject = null;
    this.projectsData = projectsBySlug;

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

    // Remplir le contenu
    const tagEl = document.getElementById('project-modal-tag');
    const titleEl = document.getElementById('project-modal-title');
    const metaEl = document.getElementById('project-modal-meta');
    const descEl = document.getElementById('project-modal-description');
    const statsEl = document.getElementById('project-modal-stats');
    const statsContentEl = document.getElementById('project-modal-stats-content');

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

    if (descEl) {
      const paragraphs = project.longDescription
        .split('\n\n')
        .filter((p) => p.trim())
        .map((p) => `<p>${p.trim()}</p>`)
        .join('');
      descEl.innerHTML = paragraphs;
    }

    if (statsEl && statsContentEl) {
      const details = this.buildProjectDetails(project);
      if (details.length > 0) {
        const statsHTML = details
          .map(
            ({ label, value }) => `
            <div class="stat-item">
              <dt>${label}</dt>
              <dd>${value}</dd>
            </div>
          `
          )
          .join('');

        statsContentEl.innerHTML = statsHTML;
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
  }

  buildProjectDetails(project) {
    const details = [];

    if (project.sector) {
      details.push({ label: 'Secteur', value: project.sector });
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
