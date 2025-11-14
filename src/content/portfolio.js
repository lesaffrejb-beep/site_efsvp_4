/**
 * Contenu du portfolio (projets)
 * À remplir avec le contenu actuel dans une étape suivante
 */

export const portfolioContent = {
  section: {
    title: '',
    stats: [
      { value: '', label: '' },
      { value: '', label: '' },
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
      tag: '',
      title: '',
      client: '',
      year: '',
      description: '',
      categories: {
        category: 'institutions',
        client: 'institution',
        type: 'brand',
      },
      gradient: 'linear-gradient(135deg, #b8441e 0%, #e8924f 100%)',
    },
    {
      id: 'sival',
      tag: '',
      title: '',
      client: '',
      year: '',
      description: '',
      categories: {
        category: 'entreprises',
        client: 'institution',
        type: 'brand',
      },
      gradient: 'linear-gradient(135deg, #e8924f 0%, #d4af37 100%)',
    },
    {
      id: 'atelier-lacour',
      tag: '',
      title: '',
      client: '',
      year: '',
      description: '',
      categories: {
        category: 'entreprises',
        client: 'entreprise',
        type: 'brand',
      },
      gradient: 'linear-gradient(135deg, #2d2d2d 0%, #7d2e2e 100%)',
    },
    {
      id: 'reseau-cocagne',
      tag: '',
      title: '',
      client: '',
      year: '',
      description: '',
      categories: {
        category: 'institutions',
        client: 'institution',
        type: 'mediation',
      },
      gradient: 'linear-gradient(135deg, #f5e6d3 0%, #d4af37 100%)',
    },
    {
      id: 'etat-de-nature',
      tag: '',
      title: '',
      client: '',
      year: '',
      description: '',
      categories: {
        category: 'spectacles',
        client: 'institution',
        type: 'immersive',
      },
      gradient: 'linear-gradient(135deg, #7d2e2e 0%, #b8441e 100%)',
    },
    {
      id: 'clisson',
      tag: '',
      title: '',
      client: '',
      year: '',
      description: '',
      categories: {
        category: 'institutions',
        client: 'institution',
        type: 'immersive',
      },
      gradient: 'linear-gradient(135deg, #1a2332 0%, #2d2d2d 100%)',
    },
  ],
};
