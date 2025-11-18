export type ProjectStatus = 'delivered' | 'in-progress';

export type ProjectSector =
  | 'artisanat'
  | 'btp'
  | 'environnement'
  | 'institutionnel'
  | 'patrimoine'
  | 'social'
  | 'spectacle-vivant'
  | 'transport'
  | 'vie-associative';

export const SECTOR_LABELS: Record<ProjectSector, string> = {
  artisanat: 'Artisanat',
  btp: 'BTP',
  environnement: 'Environnement',
  institutionnel: 'Institutionnel',
  patrimoine: 'Patrimoine',
  social: 'Social',
  'spectacle-vivant': 'Spectacle vivant',
  transport: 'Transport',
  'vie-associative': 'Vie associative',
};

export const SECTOR_OPTIONS = [
  { id: 'tous', label: 'Tous les secteurs' },
  { id: 'btp', label: SECTOR_LABELS.btp },
  { id: 'institutionnel', label: SECTOR_LABELS.institutionnel },
  { id: 'environnement', label: SECTOR_LABELS.environnement },
  { id: 'social', label: SECTOR_LABELS.social },
  { id: 'spectacle-vivant', label: SECTOR_LABELS['spectacle-vivant'] },
  { id: 'artisanat', label: SECTOR_LABELS.artisanat },
  { id: 'transport', label: SECTOR_LABELS.transport },
  { id: 'patrimoine', label: SECTOR_LABELS.patrimoine },
  { id: 'vie-associative', label: SECTOR_LABELS['vie-associative'] },
] as const;

export interface Project {
  id: string;
  title: string;
  client: string;
  year: number;
  location: string;
  status: ProjectStatus;
  cover: {
    image?: string;
    initials: string;
    gradient?: {
      from: string;
      to: string;
    };
  };
  shortDescription: string;
  longDescription: string[];
  category: string;
  sector: ProjectSector;
  themes: string[];
  details: {
    format: string;
    duration: string;
    audience: string;
    deliverables: string[];
  };
  team: string[];
  partners?: string[];
  media?: {
    gallery?: string[];
    video?: string;
    testimonial?: {
      quote: string;
      author: string;
      role?: string;
    };
  };
  audio?: {
    enabled: boolean;
    title: string;
    artist?: string;
    duration?: number;
    files: {
      mp3: string;
      ogg?: string;
    };
    waveformColor?: string;
    description?: string;
  };
}
