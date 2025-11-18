import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { projectsSchema } from '../src/schemas/project.schema.ts';
import type { Project, ProjectSector, ProjectStatus } from '../src/types/project';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT = path.resolve(__dirname, '..');
const INPUT_PATH = path.join(ROOT, 'PROJETS.txt');
const OUTPUT_PATH = path.join(ROOT, 'content', 'projects.json');

interface RawProject {
  title: string;
  client: string;
  year: number;
  location: string;
  cover?: string;
  shortDescription: string;
  themes: string[];
  category: string;
  sector: string;
  longDescription: string[];
  format: string;
  duration: string;
  audience: string;
  deliverables: string[];
  team: string[];
  status: ProjectStatus;
  video?: string;
  gallery?: string[];
}

function normalizeSlug(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function buildInitials(title: string): string {
  const letters = title
    .replace(/[^A-Za-z0-9]/g, '')
    .toUpperCase()
    .slice(0, 2);
  return letters.padEnd(2, 'X');
}

export function normalizeSector(raw: string): ProjectSector {
  const text = raw.toLowerCase();
  if (text.includes('btp')) return 'btp';
  if (text.includes('agric')) return 'agriculture';
  if (text.includes('artisan')) return 'artisanat';
  if (text.includes('environ') || text.includes('zone humide')) return 'environnement';
  if (text.includes('transport') || text.includes('mobil')) return 'mobilite';
  if (text.includes('spectacle')) return 'spectacle-vivant';
  if (text.includes('patrimoine')) return 'patrimoine';
  if (text.includes('insertion') || text.includes('social')) return 'economie-sociale';
  if (text.includes('association') || text.includes('associatif')) return 'vie-associative';
  if (
    text.includes('tourisme') ||
    text.includes('institutionnel') ||
    text.includes('territoire') ||
    text.includes('collectivit')
  )
    return 'territoire';
  return 'territoire';
}

function deriveStatus(text: string): ProjectStatus {
  return text.toLowerCase().includes('cours') ? 'in-progress' : 'delivered';
}

function extractField(block: string, label: string): string {
  const lowerLabel = label.toLowerCase();
  const line = block
    .split('\n')
    .map((entry) => entry.trim())
    .find((entry) => entry.toLowerCase().startsWith(`${lowerLabel} :`));

  if (!line) return '';
  const parts = line.split(':');
  return parts.slice(1).join(':').trim();
}

function extractSection(block: string, index: number): string {
  const headerPattern = new RegExp(`^${index}\\)`, 'm');
  const startIndex = block.search(headerPattern);
  if (startIndex === -1) return '';

  const afterHeader = block.slice(startIndex);
  const firstLineBreak = afterHeader.indexOf('\n');
  const contentStart = firstLineBreak >= 0 ? firstLineBreak + 1 : 0;
  const remaining = afterHeader.slice(contentStart);

  const nextSectionMatch = remaining.search(/\n\d\)/);
  const sectionBody = nextSectionMatch >= 0 ? remaining.slice(0, nextSectionMatch) : remaining;
  return sectionBody.trim();
}

function parseRawProject(block: string): RawProject {
  const title = block.split('\n')[0].trim();
  const info = extractSection(block, 1);
  const shortSection = extractSection(block, 2);
  const longSection = extractSection(block, 3);
  const infoSection = extractSection(block, 4);
  const mediaSection = extractSection(block, 5);

  const client = extractField(info, 'Client');
  const year = Number.parseInt(extractField(info, 'Année'), 10);
  const location = extractField(info, 'Lieu');
  const cover = extractField(info, 'Image principale');

  if (!client) {
    console.warn(`ℹ️ Impossible d'extraire le client pour ${title}`, info);
  }

  const category = extractField(shortSection, 'Forme') || extractField(infoSection, 'Forme');
  const sector = extractField(infoSection, 'Secteur') || extractField(shortSection, 'Secteur');
  const theme = extractField(shortSection, 'Thème') || extractField(shortSection, 'Thème (optionnel)');
  const shortDescription = shortSection
    .split('Accroche courte :')[1]
    ?.split('Tags')[0]
    ?.trim() || '';

  const cleanedLongSection = longSection.replace(/\(3 à 5 paragraphes[^)]*\)/i, '').trim();

  const longDescription = cleanedLongSection
    .split('\n')
    .map((line) => line.trim())
    .join('\n')
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  const format = extractField(infoSection, 'Forme') || category;
  const duration = extractField(infoSection, 'Durée') || extractField(infoSection, 'Durée / Format');
  const audience = extractField(infoSection, 'Public');
  const deliverablesRaw = extractField(infoSection, 'Livrables principaux');
  const deliverables = deliverablesRaw
    ? deliverablesRaw
        .split(/,|•|\bet\b/)
        .map((item) => item.trim())
        .filter(Boolean)
    : [];

  const teamRaw = extractField(infoSection, 'Équipe EfSVP') || extractField(infoSection, 'Equipe EfSVP');
  const team = teamRaw
    ? teamRaw
        .split(',')
        .map((member) => member.trim())
        .filter(Boolean)
    : [];

  const video = extractField(mediaSection, 'Vidéo');
  const galleryLine = extractField(mediaSection, 'Galerie images');
  const gallery = galleryLine
    ? galleryLine
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
    : [];

  return {
    title,
    client,
    year,
    location,
    cover: cover || undefined,
    shortDescription,
    themes: theme ? [theme] : [],
    category,
    sector,
    longDescription,
    format,
    duration,
    audience,
    deliverables,
    team,
    status: deriveStatus(info),
    video: video || undefined,
    gallery,
  };
}

function sectorGradient(sector: ProjectSector): { from: string; to: string } {
  switch (sector) {
    case 'agriculture':
      return { from: 'var(--color-success)', to: 'var(--color-primary-500)' };
    case 'artisanat':
      return { from: 'var(--color-primary-400)', to: 'var(--color-primary-700)' };
    case 'btp':
      return { from: 'var(--color-neutral-700)', to: 'var(--color-primary-500)' };
    case 'environnement':
      return { from: 'var(--color-success)', to: 'var(--color-success-light)' };
    case 'mobilite':
      return { from: 'var(--color-info)', to: 'var(--color-primary-300)' };
    case 'patrimoine':
      return { from: 'var(--color-neutral-800)', to: 'var(--color-primary-600)' };
    case 'spectacle-vivant':
      return { from: 'var(--color-primary-500)', to: 'var(--color-warning)' };
    case 'territoire':
      return { from: 'var(--color-info)', to: 'var(--color-neutral-700)' };
    case 'vie-associative':
    case 'economie-sociale':
    default:
      return { from: 'var(--color-primary-300)', to: 'var(--color-success)' };
  }
}

function transformProject(raw: RawProject): Project {
  const sector = normalizeSector(raw.sector);
  const hasGallery = raw.gallery && raw.gallery.length > 0;
  const hasVideo = Boolean(raw.video);
  const slug = normalizeSlug(raw.title);
  const coverImage =
    raw.cover && raw.cover !== '(chemin de fichier ou lien)'
      ? raw.cover
      : `/assets/images/projects/${slug}/cover.webp`;
  const gallery = hasGallery ? raw.gallery : [];
  return {
    id: slug,
    slug,
    title: raw.title,
    client: raw.client,
    year: Number.isFinite(raw.year) ? raw.year : new Date().getFullYear(),
    location: raw.location,
    status: raw.status,
    cover: {
      image: coverImage,
      initials: buildInitials(raw.title),
      gradient: sectorGradient(sector),
    },
    shortDescription: raw.shortDescription,
    longDescription: raw.longDescription,
    category: raw.category || raw.format,
    sector,
    tags: raw.themes.filter(Boolean),
    themes: raw.themes.filter(Boolean),
    hasVideo,
    hasAudio: false,
    details: {
      format: raw.format || raw.category,
      duration: raw.duration || '—',
      audience: raw.audience || '—',
      deliverables: raw.deliverables.length ? raw.deliverables : ['Livrables non spécifiés'],
    },
    team: raw.team,
    media: {
      coverImage,
      gallery,
      video: raw.video,
      audio: undefined,
    },
    video: raw.video
      ? {
          enabled: true,
          title: raw.title,
          files: { mp4: raw.video },
          description: raw.format,
        }
      : undefined,
  };
}

function parseProjectsFile(filePath: string): Project[] {
  const content = fs.readFileSync(filePath, 'utf-8');
  const blocks = content
    .split('🟫 FICHE PROJET —')
    .map((part) => part.trim())
    .filter((part) => Boolean(part) && part.includes('1)'));

  const rawProjects = blocks.map((block) => parseRawProject(block));
  rawProjects.forEach((project, index) => {
    if (!project.client || !project.title) {
      console.warn(`⚠️ Projet ${index + 1} manquant d'informations essentielles`, project);
    }
  });

  const projects: Project[] = rawProjects.map((project) => transformProject(project));
  return projectsSchema.parse(projects);
}

function main() {
  if (!fs.existsSync(INPUT_PATH)) {
    throw new Error(`Le fichier ${INPUT_PATH} est introuvable`);
  }

  const projects = parseProjectsFile(INPUT_PATH);
  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(projects, null, 2), 'utf-8');
  console.log(`✅ ${projects.length} projets parsés et validés`);
}

if (process.argv[1] === __filename) {
  main();
}
