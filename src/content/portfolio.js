/**
 * Contenu du portfolio (projets)
 * À remplir avec le contenu actuel dans une étape suivante
 */

export const portfolioContent = {
  section: {
    title: 'Ils nous ont fait confiance',
    stats: [
      { value: '60+', label: 'représentations' },
      { value: '15+', label: 'institutions' },
    ],
  },

  filters: {
    client: [
      { label: 'Tout', value: 'all', active: true },
      { label: 'Institutions', value: 'institution' },
      { label: 'Entreprises', value: 'entreprise' },
      { label: 'Spectacles', value: 'spectacle' },
    ],
    type: [
      { label: 'Tous les types', value: 'all', active: true },
      { label: 'Hymnes & marque', value: 'brand' },
      { label: 'Spectacles & médiations', value: 'mediation' },
      { label: 'Formats immersifs', value: 'immersive' },
    ],
  },

  projects: [
    {
      id: 'hymne-maine-et-loire',
      tag: 'Hymne officiel',
      title: 'La force de la douceur',
      client: 'Département Maine-et-Loire',
      year: '2024',
      description: "Hymne officiel célébrant l'identité et les valeurs du département. Performance inaugurale devant 500 invités.",
      categories: {
        category: 'institutions',
        client: 'institution',
        type: 'brand',
      },
      gradient: 'linear-gradient(135deg, #b8441e 0%, #e8924f 100%)',
    },
    {
      id: 'sival',
      tag: 'Récit narratif',
      title: 'Série promotionnelle agricole',
      client: 'Destination Angers / SIVAL',
      year: '2025',
      description: "Récits musicaux pour valoriser l'innovation agricole lors du plus grand salon européen.",
      categories: {
        category: 'entreprises',
        client: 'institution',
        type: 'brand',
      },
      gradient: 'linear-gradient(135deg, #e8924f 0%, #d4af37 100%)',
    },
    {
      id: 'atelier-lacour',
      tag: 'Anniversaire',
      title: '25 ans & passation',
      client: 'Atelier Lacour',
      year: '2024',
      description: 'Métaphore de la forêt pour célébrer un quart de siècle et préparer la transmission.',
      categories: {
        category: 'entreprises',
        client: 'entreprise',
        type: 'brand',
      },
      gradient: 'linear-gradient(135deg, #2d2d2d 0%, #7d2e2e 100%)',
    },
    {
      id: 'reseau-cocagne',
      tag: 'Portraits',
      title: 'Histoires de résilience',
      client: 'Réseau Cocagne',
      year: '2024',
      description: 'Collectage et mise en musique de parcours de réinsertion pour un réseau national.',
      categories: {
        category: 'institutions',
        client: 'institution',
        type: 'mediation',
      },
      gradient: 'linear-gradient(135deg, #f5e6d3 0%, #d4af37 100%)',
    },
    {
      id: 'etat-de-nature',
      tag: 'Spectacle',
      title: 'État de nature',
      client: 'PNR Loire-Anjou-Touraine',
      year: '2023 →',
      description: 'Spectacle immersif joué plus de 40 fois en pleine nature. Création phare du studio.',
      categories: {
        category: 'spectacles',
        client: 'institution',
        type: 'immersive',
      },
      gradient: 'linear-gradient(135deg, #7d2e2e 0%, #b8441e 100%)',
    },
    {
      id: 'clisson',
      tag: 'Immersif',
      title: 'Déambulation historique XVe s.',
      client: 'Ville de Clisson',
      year: '2023',
      description: "Récit immersif médiéval pour faire revivre l'histoire de la cité aux visiteurs.",
      categories: {
        category: 'institutions',
        client: 'institution',
        type: 'immersive',
      },
      gradient: 'linear-gradient(135deg, #1a2332 0%, #2d2d2d 100%)',
    },
  ],
};
