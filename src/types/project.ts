export type ProjectStatus = 'delivered' | 'in-progress';

export type ProjectSector =
  | 'artisanat'
  | 'btp'
  | 'environnement'
  | 'patrimoine'
  | 'agriculture'
  | 'mobilite'
  | 'economie-sociale'
  | 'spectacle-vivant'
  | 'territoire'
  | 'vie-associative';

export const SECTOR_LABELS: Record<ProjectSector, string> = {
  artisanat: 'Artisanat',
  btp: 'BTP',
  environnement: 'Environnement',
  patrimoine: 'Patrimoine',
  agriculture: 'Agriculture',
  mobilite: 'Mobilité',
  'economie-sociale': 'Économie sociale',
  territoire: 'Territoire',
  'spectacle-vivant': 'Spectacle vivant',
  'vie-associative': 'Vie associative',
};

export const SECTOR_OPTIONS = [
  { id: 'tous', label: 'Tous les secteurs' },
  { id: 'btp', label: SECTOR_LABELS.btp },
  { id: 'environnement', label: SECTOR_LABELS.environnement },
  { id: 'agriculture', label: SECTOR_LABELS.agriculture },
  { id: 'mobilite', label: SECTOR_LABELS.mobilite },
  { id: 'economie-sociale', label: SECTOR_LABELS['economie-sociale'] },
  { id: 'spectacle-vivant', label: SECTOR_LABELS['spectacle-vivant'] },
  { id: 'artisanat', label: SECTOR_LABELS.artisanat },
  { id: 'territoire', label: SECTOR_LABELS.territoire },
  { id: 'patrimoine', label: SECTOR_LABELS.patrimoine },
  { id: 'vie-associative', label: SECTOR_LABELS['vie-associative'] },
] as const;

export interface Project {
  id: string;
  slug: string;
  title: string;
  client: string;
  year: number;
  location: string;
  status: ProjectStatus;
  tags: string[];
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
  hasVideo?: boolean;
  hasAudio?: boolean;
  details: {
    format: string;
    duration: string;
    audience: string;
    deliverables: string[];
  };
  team: string[];
  partners?: string[];
  media: {
    coverImage: string;
    gallery?: string[];
    video?: string | null;
    audio?: string | null;
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
  video?: {
    enabled: boolean;
    title: string;
    duration?: number;
    files: {
      mp4: string;
      webm?: string;
    };
    poster?: string;
    autoplay?: boolean;
    description?: string;
  };
}
