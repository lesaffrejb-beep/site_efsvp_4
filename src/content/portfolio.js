import { projectsCollection } from './projects/index.js';

const uniqueValues = (key) => {
  return Array.from(new Set(projectsCollection.map((project) => project[key]))).sort();
};

const buildOptions = (values, { includeAllLabel }) => [
  { label: includeAllLabel, value: 'all', active: true },
  ...values.map((value) => ({ label: value, value })),
];

const filterGroups = [
  {
    id: 'typology',
    label: 'Typologie',
    options: buildOptions(uniqueValues('typology'), { includeAllLabel: 'Toutes les typologies' }),
  },
  {
    id: 'sector',
    label: 'Secteur',
    options: buildOptions(uniqueValues('sector'), { includeAllLabel: 'Tous les secteurs' }),
  },
  {
    id: 'status',
    label: 'Statut',
    options: [
      { label: 'Tous les statuts', value: 'all', active: true },
      { label: 'Livrés', value: 'delivered' },
      { label: 'En production', value: 'in_production' },
    ],
  },
];

export const portfolioContent = {
  section: {
    eyebrow: 'Projets récents',
    title: 'Quelques histoires que nous avons racontées',
    description:
      'Chaque projet est écrit à partir de votre réalité : collectage, écriture, musique et mise en voix pour une expérience qui vous ressemble.',
  },
  metrics: [
    { value: '60+', label: 'représentations' },
    { value: '15+', label: 'institutions et entreprises accompagnées' },
  ],
  filters: filterGroups,
  projects: projectsCollection,
};
