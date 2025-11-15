/**
 * ============================================
 * PROJECT MODAL - Affichage des détails projets
 * Gère l'ouverture, fermeture et contenu dynamique
 * Utilise les données de src/data/projects.js
 * ============================================
 */

import { projectsData } from '../../data/projects.js';

export class ProjectModal {
  constructor() {
    this.modal = null;
    this.closeBtn = null;
    this.overlay = null;
    this.projectCards = [];
    this.currentProject = null;
    this.projectsData = projectsData;

    this.init();
  }

  init() {
    this.modal = document.getElementById('project-modal');
    this.closeBtn = document.getElementById('project-modal-close');
    this.overlay = this.modal?.querySelector('.modal-overlay');
    this.projectCards = document.querySelectorAll('.project-card');

    if (!this.modal) {
      console.warn('ProjectModal: modal element not found');
      return;
    }

    this.setupEventListeners();
  }

  setupEventListeners() {
    // Click sur les cartes projet
    this.projectCards.forEach((card) => {
      const link = card.querySelector('.project-card__link');

      if (link) {
        link.style.cursor = 'pointer';
        link.setAttribute('role', 'button');
        link.setAttribute('tabindex', '0');

        link.addEventListener('click', (e) => {
          e.preventDefault();
          const projectId = this.getProjectIdFromCard(card);
          if (projectId) {
            this.openModal(projectId);
          }
        });

        // Support clavier
        link.addEventListener('keydown', (e) => {
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

    if (tagEl) tagEl.textContent = project.type || 'Projet';
    if (titleEl) titleEl.textContent = project.title;

    // Meta: Client · Année
    const metaText = [project.client, project.year].filter(Boolean).join(' · ');
    if (metaEl) metaEl.textContent = metaText;

    // Description
    if (descEl) {
      // Convertir le texte brut en paragraphes HTML
      const paragraphs = project.description
        .split('\n\n')
        .filter(p => p.trim())
        .map(p => `<p>${p.trim()}</p>`)
        .join('');
      descEl.innerHTML = paragraphs;
    }

    // Stats (si disponibles)
    if (statsEl && statsContentEl && project.stats) {
      const statsHTML = Object.entries(project.stats)
        .map(([key, value]) => {
          const label = this.formatStatLabel(key);
          return `
            <div class="stat-item">
              <dt>${label}</dt>
              <dd>${value}</dd>
            </div>
          `;
        })
        .join('');

      statsContentEl.innerHTML = statsHTML;
      statsEl.style.display = 'block';
    } else if (statsEl) {
      statsEl.style.display = 'none';
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

  formatStatLabel(key) {
    const labels = {
      duration: 'Durée',
      team: 'Équipe',
      deliverables: 'Livrables',
      audience: 'Public',
      format: 'Format',
      performance: 'Performance',
      immersion: 'Immersion',
      restitutions: 'Restitutions',
      representations: 'Représentations',
      collectage: 'Collectage'
    };
    return labels[key] || key.charAt(0).toUpperCase() + key.slice(1);
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
