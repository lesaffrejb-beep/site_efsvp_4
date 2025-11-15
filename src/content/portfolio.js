import { projectsCollection } from './projects/index.js';

const sectorFilterOptions = [
  { label: 'Tous les secteurs', value: 'all', active: true },
  { label: 'Agriculture', value: 'Agriculture' },
  { label: 'Artisanat', value: 'Artisanat' },
  { label: 'BTP', value: 'BTP' },
  { label: 'Environnement', value: 'Environnement' },
  { label: 'Mobilité', value: 'Mobilité' },
  { label: 'Patrimoine', value: 'Patrimoine' },
  { label: 'Spectacle vivant', value: 'Spectacle vivant' },
  { label: 'Territoire', value: 'Territoire' },
  { label: 'Économie sociale et solidaire', value: 'Économie sociale et solidaire' },
];

export const portfolioContent = {
  section: {
    title: 'Quelques histoires que nous avons racontées',
    description:
      'Chaque projet est écrit à partir de votre réalité : collectage, écriture, musique et mise en voix pour une expérience qui vous ressemble.',
  },
  metrics: [
    { value: '60+', label: 'Représentations' },
    { value: '15+', label: 'Institutions & entreprises accompagnées' },
  ],
  filters: [
    {
      id: 'sector',
      label: 'Secteur',
      options: sectorFilterOptions,
    },
  ],
  projects: projectsCollection,
};
