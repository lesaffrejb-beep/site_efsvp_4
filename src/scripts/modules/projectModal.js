/**
 * Project Modal - Affichage des détails des projets portfolio
 * Gère l'ouverture, la fermeture et le contenu dynamique
 */

export class ProjectModal {
  constructor() {
    this.modal = null;
    this.closeBtn = null;
    this.overlay = null;
    this.projectCards = [];
    this.currentProject = null;

    // Données détaillées des projets
    this.projectsData = {
      'la-force-de-la-douceur': {
        tag: 'Hymne officiel',
        title: 'La force de la douceur',
        meta: 'Département Maine-et-Loire · 2024',
        description: `
          <p>Hymne officiel célébrant l'identité et les valeurs du département Maine-et-Loire.
          Performance inaugurale devant 500 invités lors de la cérémonie officielle des vœux du département.</p>

          <p>Un projet d'envergure qui demandait de capturer l'essence d'un territoire et de ses habitants
          en quelques minutes de musique et de texte. Après deux semaines d'immersion et d'entretiens avec
          les acteurs locaux, nous avons créé un hymne qui résonne avec l'histoire et les valeurs du territoire.</p>

          <p>La performance a été saluée par les élus et le public, créant un moment d'émotion partagée
          et de fierté collective.</p>
        `,
      },
      'serie-promotionnelle-agricole': {
        tag: 'Récit narratif',
        title: 'Série promotionnelle agricole',
        meta: 'Destination Angers / SIVAL · 2025',
        description: `
          <p>Série de récits musicaux courts (3-5 min) mettant en lumière des histoires humaines d'innovateurs
          lors du plus grand salon européen du secteur agricole.</p>

          <p>Collectage sur site pendant le salon, composition musicale sur mesure, et diffusion lors des
          conférences plénières. 8 récits diffusés auprès de 2 000+ visiteurs.</p>

          <p>Reprise média (France Bleu, Ouest-France). NPS client : 9.2/10. Un projet qui démontre la
          puissance de la narration pour valoriser l'innovation au-delà des chiffres.</p>
        `,
      },
      '25-ans-passation': {
        tag: 'Anniversaire',
        title: '25 ans & passation',
        meta: 'Atelier Lacour · 2024',
        description: `
          <p>Performance narrative et musicale célébrant 25 ans d'artisanat et préparant une passation
          générationnelle sensible, sans tomber dans l'institutionnel ou l'émotionnel facile.</p>

          <p>Nous avons utilisé la métaphore de la forêt : racines (fondation), tronc (savoir-faire),
          branches (transmission). Texte poétique + composition instrumentale bois & cordes.
          Performance de 18 minutes.</p>

          <p>120 collaborateurs & partenaires réunis. Témoignage du fondateur :
          "C'était exactement ça, et je n'aurais jamais su le dire."</p>
        `,
      },
      'histoires-de-resilience': {
        tag: 'Portraits',
        title: 'Histoires de résilience',
        meta: 'Réseau Cocagne · 2024',
        description: `
          <p>Collectage et mise en musique de parcours de réinsertion pour un réseau national
          de jardins biologiques à vocation d'insertion sociale et professionnelle.</p>

          <p>Un projet délicat nécessitant dignité, vérité et émotion maîtrisée. Nous avons recueilli
          les témoignages de personnes en parcours de réinsertion, et créé des portraits musicaux
          qui honorent leur histoire sans misérabilisme.</p>

          <p>L'approche a été saluée par le réseau pour sa justesse et son respect des personnes.
          Ces portraits sont désormais utilisés lors des événements nationaux du réseau.</p>
        `,
      },
      'etat-de-nature': {
        tag: 'Spectacle',
        title: 'État de nature',
        meta: 'PNR Loire-Anjou-Touraine · 2023 →',
        description: `
          <p>Spectacle immersif en pleine forêt, 35 minutes de déambulation avec texte poétique
          et musique live acoustique. Comment sensibiliser aux enjeux écologiques sans militantisme
          moralisateur, et créer une expérience marquante dans un lieu naturel protégé ?</p>

          <p>Public limité à 40 personnes par représentation pour préserver l'intimité de l'expérience
          et la fragilité du lieu. Dispositif lumière douce intégré à l'environnement naturel.</p>

          <p>60+ représentations depuis 2023, 2 400+ spectateurs. Taux de satisfaction : 94%.
          Programmation reconduite 2025-2026. Notre création phare.</p>
        `,
      },
      'deambulation-historique': {
        tag: 'Immersif',
        title: 'Déambulation historique XVe s.',
        meta: 'Ville de Clisson · 2023',
        description: `
          <p>Récit immersif médiéval pour faire revivre l'histoire de la cité de Clisson aux visiteurs.
          Création d'une déambulation sonore et narrative dans les ruelles historiques de la ville.</p>

          <p>Recherches historiques approfondies, écriture d'un récit mêlant histoire et fiction,
          composition musicale inspirée de la musique médiévale et renaissance.</p>

          <p>Une expérience unique qui transforme la visite touristique en voyage dans le temps,
          plébiscitée par les visiteurs et l'office de tourisme.</p>
        `,
      },
    };

    this.init();
  }

  init() {
    this.modal = document.getElementById('project-modal');
    this.closeBtn = document.getElementById('project-modal-close');
    this.overlay = this.modal?.querySelector('.modal__overlay');
    this.projectCards = document.querySelectorAll('.portfolio-card');

    if (!this.modal) return;

    this.setupEventListeners();
  }

  setupEventListeners() {
    // Click sur les cartes projet
    this.projectCards.forEach((card) => {
      card.style.cursor = 'pointer';
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');

      card.addEventListener('click', (e) => {
        // Ne pas ouvrir si on clique sur un lien
        if (e.target.tagName === 'A') return;

        const projectId = this.getProjectIdFromCard(card);
        if (projectId) {
          this.openModal(projectId);
        }
      });

      // Support clavier
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const projectId = this.getProjectIdFromCard(card);
          if (projectId) {
            this.openModal(projectId);
          }
        }
      });
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
    // Extraire l'ID du projet depuis le titre de la carte
    const title = card.querySelector('.portfolio-card__title')?.textContent?.trim();

    // Mapper les titres aux IDs
    const titleToId = {
      'La force de la douceur': 'la-force-de-la-douceur',
      'Série promotionnelle agricole': 'serie-promotionnelle-agricole',
      '25 ans & passation': '25-ans-passation',
      'Histoires de résilience': 'histoires-de-resilience',
      'État de nature': 'etat-de-nature',
      'Déambulation historique XVe s.': 'deambulation-historique',
    };

    return titleToId[title] || null;
  }

  openModal(projectId) {
    const project = this.projectsData[projectId];
    if (!project) return;

    this.currentProject = projectId;

    // Remplir le contenu
    const tagEl = document.getElementById('project-modal-tag');
    const titleEl = document.getElementById('project-modal-title');
    const metaEl = document.getElementById('project-modal-meta');
    const descEl = document.getElementById('project-modal-description');

    if (tagEl) tagEl.textContent = project.tag;
    if (titleEl) titleEl.textContent = project.title;
    if (metaEl) metaEl.textContent = project.meta;
    if (descEl) descEl.innerHTML = project.description;

    // Ouvrir la modale
    this.modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Focus trap
    setTimeout(() => {
      this.closeBtn?.focus();
    }, 100);
  }

  closeModal() {
    this.modal?.classList.remove('active');
    document.body.style.overflow = '';
    this.currentProject = null;
  }

  destroy() {
    this.closeBtn?.removeEventListener('click', this.closeModal);
    this.overlay?.removeEventListener('click', this.closeModal);
  }
}
