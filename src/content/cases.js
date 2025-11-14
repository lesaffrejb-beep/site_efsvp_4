/**
 * Contenu des cas étendards (Flagship Cases)
 * À remplir avec le contenu actuel dans une étape suivante
 */

export const casesContent = {
  section: {
    title: 'Trois créations qui racontent notre approche',
    subtitle: 'Problème · Approche · Effet',
  },

  cases: [
    {
      id: 'sival',
      badge: 'Série narrative',
      title: "SIVAL — L'innovation agricole racontée",
      client: 'Destination Angers · 2025',
      year: '2025',
      category: 'institutions',
      featured: false,
      problem: "Comment valoriser l'innovation agricole au-delà des chiffres et communiqués, lors du plus grand salon européen du secteur ?",
      approach: "Série de récits musicaux courts (3-5 min) mettant en lumière des histoires humaines d'innovateurs. Collectage sur site, composition sur mesure, diffusion lors des conférences.",
      effect: '8 récits diffusés auprès de 2 000+ visiteurs. Reprise média (France Bleu, Ouest-France). NPS client : 9.2/10.',
      metrics: [],
    },
    {
      id: 'atelier-lacour',
      badge: 'Anniversaire entreprise',
      title: 'Atelier Lacour — Métaphore de la forêt',
      client: 'Entreprise familiale · 2024',
      year: '2024',
      category: 'entreprises',
      featured: false,
      problem: "Célébrer 25 ans d'artisanat et préparer une passation générationnelle sensible, sans tomber dans l'institutionnel ou l'émotionnel facile.",
      approach: 'Métaphore forestière : racines (fondation), tronc (savoir-faire), branches (transmission). Texte poétique + composition instrumentale bois & cordes. Performance 18 min.',
      effect: `120 collaborateurs & partenaires réunis. Témoignage fondateur : "C'était exactement ça, et je n'aurais jamais su le dire."`,
    },
    {
      id: 'etat-de-nature',
      badge: 'Spectacle immersif',
      title: 'État de nature — Spectacle en pleine forêt',
      client: 'PNR Loire-Anjou-Touraine · 2023 →',
      year: '2023 →',
      category: 'spectacles',
      featured: true,
      tagFeatured: 'Création phare',
      problem: 'Comment sensibiliser aux enjeux écologiques sans militantisme moralisateur, et créer une expérience marquante dans un lieu naturel protégé ?',
      approach: 'Spectacle immersif 35 min en déambulation forestière. Texte poétique + musique live acoustique + dispositif lumière douce. Public 40 personnes max par représentation.',
      effect: '60+ représentations depuis 2023, 2 400+ spectateurs. Taux satisfaction : 94%. Programmation reconduite 2025-2026.',
    },
  ],

  cta: {
    label: 'Voir tous les projets',
    href: '#portfolio',
  },
};
