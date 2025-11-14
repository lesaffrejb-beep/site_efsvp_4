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
          <p>En novembre 2024, le département du Maine et Loire nous commande un hymne pour la nouvelle marque de l'Anjou : La force de la douceur.</p>

          <p>En collaboration avec Mathieu Coupat et Camille Després, compositeurs de musique de film et Kryzalid Films, agence de vidéo angevine, nous écrivons et enregistrons 2 clips : une version longue, pour une diffusion aux assises des départements de France et une version courte, pour les cinémas du 49, la télé et les réseaux sociaux.</p>

          <p>L'objectif était de dévoiler toute la force que contenait la douceur de l'Anjou tout en soulignant sa diversité, son originalité et sa créativité.</p>
        `,
      },
      'serie-promotionnelle-agricole': {
        tag: 'Récit narratif',
        title: 'Série promotionnelle agricole',
        meta: 'Destination Angers / SIVAL · 2025',
        description: `
          <p>En janvier 2025, Destination Angers nous contacte pour réaliser une série de morceaux promotionnels dédiés au SIVAL, le Salon International des Techniques de Productions Végétales.</p>

          <p>Les morceaux doivent également célébrer l'héritage du président du salon, l'un des grands noms de l'agriculture en France : Bruno Dupont.</p>

          <p>Pour réaliser cette commande, nous choisissons de suivre le point de vue d'un enfant découvrant le monde de l'agriculture dans l'exploitation de son grand-père. Il y rencontre un collègue de son papi, un certain Bruno Dupont qui va tous les ans à un salon à Angers… Nous suivons ensuite l'évolution de cet enfant, et à travers ses yeux, l'évolution du SIVAL et de l'agriculture en France. Il va créer sa propre exploitation, et, aidé par les technologies découvertes au salon et Bruno, résoudre toutes les difficultés se présentant à lui.</p>

          <p>Le récit se veut proche du réel, de la terre, du vrai quotidien d'un maraîcher.</p>
        `,
      },
      'sival': {
        tag: 'Récit narratif',
        title: 'Série promotionnelle agricole',
        meta: 'Destination Angers / SIVAL · 2025',
        description: `
          <p>En janvier 2025, Destination Angers nous contacte pour réaliser une série de morceaux promotionnels dédiés au SIVAL, le Salon International des Techniques de Productions Végétales.</p>

          <p>Les morceaux doivent également célébrer l'héritage du président du salon, l'un des grands noms de l'agriculture en France : Bruno Dupont.</p>

          <p>Pour réaliser cette commande, nous choisissons de suivre le point de vue d'un enfant découvrant le monde de l'agriculture dans l'exploitation de son grand-père. Il y rencontre un collègue de son papi, un certain Bruno Dupont qui va tous les ans à un salon à Angers… Nous suivons ensuite l'évolution de cet enfant, et à travers ses yeux, l'évolution du SIVAL et de l'agriculture en France. Il va créer sa propre exploitation, et, aidé par les technologies découvertes au salon et Bruno, résoudre toutes les difficultés se présentant à lui.</p>

          <p>Le récit se veut proche du réel, de la terre, du vrai quotidien d'un maraîcher.</p>
        `,
      },
      '25-ans-passation': {
        tag: 'Anniversaire',
        title: '25 ans & passation',
        meta: 'Atelier Lacour · 2024',
        description: `
          <p>En juillet 2024, Alain Lacour, directeur de l'entreprise Atelier Lacour, nous commande une suite de morceaux pour célébrer les 25 ans de son entreprise et la passation de présidence entre lui et ses reprenants.</p>

          <p>Sa volonté n'est pas que nous écrivions un texte sur lui mais sur son entreprise, en la personnifiant. C'est L'atelier Lacour qui doit prendre la parole pour raconter son histoire.</p>

          <p>Pour réaliser cette commande, nous faisons un récit en métaphore filée avec d'un côté la création et la vie d'une entreprise et de l'autre, la création et la vie d'une forêt. Un arbre seul, rejoint par des arbrisseaux, se rassemblant, se renforçant, affrontant les tempêtes et les orages ensemble pour créer une forêt unie et robuste.</p>
        `,
      },
      'atelier-lacour': {
        tag: 'Anniversaire',
        title: '25 ans & passation',
        meta: 'Atelier Lacour · 2024',
        description: `
          <p>En juillet 2024, Alain Lacour, directeur de l'entreprise Atelier Lacour, nous commande une suite de morceaux pour célébrer les 25 ans de son entreprise et la passation de présidence entre lui et ses reprenants.</p>

          <p>Sa volonté n'est pas que nous écrivions un texte sur lui mais sur son entreprise, en la personnifiant. C'est L'atelier Lacour qui doit prendre la parole pour raconter son histoire.</p>

          <p>Pour réaliser cette commande, nous faisons un récit en métaphore filée avec d'un côté la création et la vie d'une entreprise et de l'autre, la création et la vie d'une forêt. Un arbre seul, rejoint par des arbrisseaux, se rassemblant, se renforçant, affrontant les tempêtes et les orages ensemble pour créer une forêt unie et robuste.</p>
        `,
      },
      'histoires-de-resilience': {
        tag: 'Portraits',
        title: 'Histoires de résilience',
        meta: 'Réseau Cocagne · 2024',
        description: `
          <p>En juin 2024, l'association des Jardins de Cocagne nous commande une série de morceaux pour leurs 25 ans. Leur volonté est que nous racontions plusieurs histoires de vie, des parcours atypiques, des chemins de traverses qu'on pû emprunter certains de leurs jardiniers. Il fallait rendre hommage à la résilience. Nous sommes allés rencontrer plusieurs d'entre eux et nous sommes efforcés de retranscrire au mieux leur histoire.</p>

          <p>3 récits, 3 personnages, 3 chemins différents convergeant en un point : Le jardin de Cocagne.</p>

          <p>Merci à Malya, Caroline et Ahmed pour leur générosité et leur confiance.</p>
        `,
      },
      'reseau-cocagne': {
        tag: 'Portraits',
        title: 'Histoires de résilience',
        meta: 'Réseau Cocagne · 2024',
        description: `
          <p>En juin 2024, l'association des Jardins de Cocagne nous commande une série de morceaux pour leurs 25 ans. Leur volonté est que nous racontions plusieurs histoires de vie, des parcours atypiques, des chemins de traverses qu'on pû emprunter certains de leurs jardiniers. Il fallait rendre hommage à la résilience. Nous sommes allés rencontrer plusieurs d'entre eux et nous sommes efforcés de retranscrire au mieux leur histoire.</p>

          <p>3 récits, 3 personnages, 3 chemins différents convergeant en un point : Le jardin de Cocagne.</p>

          <p>Merci à Malya, Caroline et Ahmed pour leur générosité et leur confiance.</p>
        `,
      },
      'etat-de-nature': {
        tag: 'Spectacle',
        title: 'État de nature',
        meta: 'PNR Loire-Anjou-Touraine · 2023 →',
        description: `
          <p>En avril 2023, le Parc Naturel Régional Loire Anjou Touraine nous commande un spectacle musical pour défendre l'intérêt des zones humides auprès du grand public.</p>

          <p>L'objectif est clair : il faut sensibiliser, informer, communiquer de manière nouvelle sur la nécessité de protéger ces espaces déjà menacés. Les zones humides sont des trésors de biodiversité et ont des caractéristiques essentielles permettant de lutter contre le stress hydrique.</p>

          <p>Notre proposition : État de Nature, un spectacle en violon / voix jouable dans les zones humides.</p>

          <p>Dans État de nature, la Rainette, le Héron, les poissons-chats, les castors ou les libellules sont tous des citoyens d'une société bien établie. Nous découvrons cette société au fil de 15 tableaux, 15 chapitres pour rencontrer ses habitants et ses enjeux.</p>

          <p>Depuis sa création, le spectacle a été joué plus d'une trentaine de fois dans les Pays de la Loire. En février 2024, une nouvelle version d'État de Nature voit le jour, adaptée pour le Parc Naturel Régional du Médoc.</p>

          <p>Merci aux équipes des deux parcs nous ayant permis de découvrir et de comprendre ces zones essentielles à nos écosystèmes.</p>
        `,
      },
      'deambulation-historique': {
        tag: 'Immersif',
        title: 'Déambulation historique XVe s.',
        meta: 'Ville de Clisson · 2023',
        description: `
          <p>En juin 2023, la commune de Clisson nous commande une visite musicale de leur centre-ville. L'objectif est de créer une déambulation poétique dévoilant l'histoire de la cité.</p>

          <p>Après une phase de collectage en collaboration avec l'association Clisson Histoire et Patrimoine, nous décidons de mettre en lumière une période rarement évoquée pour Clisson : le XVème siècle. Plus précisément encore les années 1486 et 1487 durant lesquelles la ville passa de l'influence bretonne à française.</p>

          <p>Nous racontons cette histoire à travers les yeux de François Ier d'Avaugour, le fils naturel du Duc de Bretagne qui jouera un rôle clé dans la défaite des bretons.</p>

          <p>Le spectacle joue avec les codes du roman de chevalerie pour proposer une déambulation historique et comique adaptée à tous les publics.</p>
        `,
      },
      'clisson': {
        tag: 'Immersif',
        title: 'Déambulation historique XVe s.',
        meta: 'Ville de Clisson · 2023',
        description: `
          <p>En juin 2023, la commune de Clisson nous commande une visite musicale de leur centre-ville. L'objectif est de créer une déambulation poétique dévoilant l'histoire de la cité.</p>

          <p>Après une phase de collectage en collaboration avec l'association Clisson Histoire et Patrimoine, nous décidons de mettre en lumière une période rarement évoquée pour Clisson : le XVème siècle. Plus précisément encore les années 1486 et 1487 durant lesquelles la ville passa de l'influence bretonne à française.</p>

          <p>Nous racontons cette histoire à travers les yeux de François Ier d'Avaugour, le fils naturel du Duc de Bretagne qui jouera un rôle clé dans la défaite des bretons.</p>

          <p>Le spectacle joue avec les codes du roman de chevalerie pour proposer une déambulation historique et comique adaptée à tous les publics.</p>
        `,
      },
      'capeb': {
        tag: 'Hommage métier',
        title: 'Artisans du bâtiment',
        meta: 'CAPEB Maine-et-Loire · 2023',
        description: `
          <p>En novembre 2023, la CAPEB nous commande un morceau pour raconter ce que c'est qu'être un artisan du bâtiment. Ils veulent que le morceau rende hommage aux travailleurs de leur filière et nous laissent carte blanche sur la forme.</p>

          <p>Après une phase de collectage, nous décidons de raconter l'histoire de Guillaume, menuisier spécialisé dans la restauration du patrimoine. Le morceau suit sa vie, de la création de sa boîte jusqu'à son adhésion à la CAPEB.</p>

          <p>La volonté est toujours de créer un récit authentique, c'était tout particulièrement le cas pour cette commande. Il était important d'être fidèle au vrai quotidien d'un menuisier. Nous avons donc passé 2 jours à suivre l'un d'entre eux dans son travail pour comprendre au mieux la réalité du terrain.</p>

          <p>Merci à Philippe pour sa gentillesse (et pour sa patience surtout devant notre nullité à tenir un rabot droit).</p>
        `,
      },
      'doue-en-anjou': {
        tag: 'Vœux du Maire',
        title: 'Le temps qui se fige',
        meta: 'Ville de Doué-en-Anjou · 2022',
        description: `
          <p>En janvier 2022, la commune de Doué en Anjou nous commande un texte pour les vœux du Maire, texte devant célébrer le patrimoine et la vie culturelle municipale.</p>

          <p>Nous travaillons en collaboration avec l'agence douessine Terre de pixels qui s'occupe de la vidéo. Pour parler de patrimoine et de culture, nous décidons d'axer le texte sur la notion de temps qui se fige. Au théâtre comme devant un monument séculaire, le temps ne se ressent plus de manière habituelle. Il se suspend et nous invite à une forme de contemplation. C'est cette idée que nous avons voulu explorer : comment, à Doué-en-Anjou, le passé et le présent coexistent, se répondent, et créent une harmonie unique.</p>
        `,
      },
      'brissac': {
        tag: 'Déambulation',
        title: 'Don Quichotte en Anjou',
        meta: 'Brissac Loire Aubance · 2023',
        description: `
          <p>En septembre 2023, pour les Journées Européennes du Patrimoine, la commune de Brissac Loire Aubance nous commande un spectacle déambulatoire pour raconter l'histoire de leur ville.</p>

          <p>La déambulation doit partir du moulin du pavé et faire ensuite le tour du vignoble brissacois. Nous avons carte blanche sur la manière dont nous voulons parler de ce patrimoine particulier.</p>

          <p>Nous décidons de nous lancer dans une continuation du pilier de la littérature L'ingénieux Hidalgo Don Quichotte de la Manche. Notre récit commence à la fin du roman et raconte l'arrivée du personnage de Don Quichotte en Anjou, désireux d'investir dans le vignoble local. Le spectacle joue avec les passages emblématiques du roman : les moulins, les moutons, le personnage de Sancho Panza tout en ajoutant les détails de l'histoire régionale. Les représentations se font en violon / voix pour pouvoir proposer une mise en scène légère et mobile.</p>
        `,
      },
      'agglobus': {
        tag: 'Prévention',
        title: 'Voyager en bus',
        meta: 'Saumur Val de Loire · 2023',
        description: `
          <p>En juin 2023, la communauté d'agglomération Saumur Val de Loire nous commande un texte de prévention pour les services Agglo'bus. En collaboration avec l'agence Terre de pixels qui s'occupe de la vidéo, l'objectif est d'informer sur les bons usages pour prendre le bus en toute sécurité. Nous racontons l'histoire de deux collégiens prenant le bus un matin d'hiver.</p>

          <p>Le bus devient un véhicule du quotidien, mais aussi un symbole de lien social, de rencontres et de partage. Chaque trajet est une aventure, une occasion de découvrir sa ville et ses habitants sous un nouveau jour.</p>
        `,
      },
      'theatre-jeune-plume': {
        tag: 'Spectacle musical',
        title: 'Thématiques sociales',
        meta: 'Théâtre de la Jeune Plume · 2022-2023',
        description: `
          <p>De novembre 2021 à mars 2023, nous collaborons avec le théâtre de la jeune plume pour la création de deux spectacles musicaux. Le premier Dis-moi des mots d'amour aborde les Affections de Longues Durées, le second Souffler sur les braises parlant de la vie sexuelle et intime des personnes âgées.</p>

          <p>Nous écrivons pour les deux projets une bande-son diffusée sur scène, accompagnant des danseurs. L'objectif de ces deux spectacles était d'amener dans les théâtres des thématiques sociales trop souvent taboues. Il fallait parler de ces sujets, sans les contourner, avec honnêteté et poésie, sans toutefois tomber dans le choquant ou le provoquant.</p>

          <p>Pour les deux bandes-son, une phase de recherche a été nécessaire, ainsi que du collectage auprès des personnes concernées pour ne pas projeter nos a priori sur le spectacle.</p>
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
      'Artisans du bâtiment': 'capeb',
      'Le temps qui se fige': 'doue-en-anjou',
      'Don Quichotte en Anjou': 'brissac',
      'Voyager en bus': 'agglobus',
      'Thématiques sociales': 'theatre-jeune-plume',
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
