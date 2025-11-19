import projectsData from '../../content/projects.json';
import { projectsSchema } from '@/schemas/project.schema';
import type { Project, ProjectSector } from '@/types/project';

const assetManifest = Object.keys(
  import.meta.glob('../../public/assets/**/*', { eager: true })
).map((key) => key.replace('../../public', ''));

const COLOR_TOKEN_MAP: Record<string, string> = {
  '--color-primary-300': '#f7b5a3',
  '--color-primary-400': '#f08c6e',
  '--color-primary-500': '#b95a40',
  '--color-primary-600': '#a04e37',
  '--color-primary-700': '#86402d',
  '--color-neutral-700': '#28303a',
  '--color-neutral-800': '#1a2332',
  '--color-warning': '#f6aa1c',
  '--color-info': '#1971c2',
  '--color-success': '#2d6e4f',
  '--color-success-light': '#d4edda',
};

function normalizeAssetPath(path?: string | null): string | null {
  if (!path) return null;
  return path.startsWith('/') ? path : `/${path}`;
}

function resolveColorToken(value?: string | null, fallback = '#1a2332'): string {
  if (!value) return fallback;
  const tokenMatch = value.match(/var\((--[^)]+)\)/);
  if (tokenMatch) {
    return COLOR_TOKEN_MAP[tokenMatch[1]] || fallback;
  }
  return value;
}

function createCoverPlaceholder(project: Partial<Project>): string {
  const initials = (project?.cover?.initials || project?.title?.slice(0, 2) || 'PJ').toUpperCase();
  const gradient = project?.cover?.gradient;
  const fromColor = resolveColorToken(gradient?.from, '#1a2332');
  const toColor = resolveColorToken(gradient?.to, '#b95a40');
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" role="img" aria-label="${initials} placeholder">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${fromColor}" />
          <stop offset="100%" stop-color="${toColor}" />
        </linearGradient>
      </defs>
      <rect width="800" height="600" rx="48" fill="url(#grad)" />
      <text x="50%" y="55%" font-family="'Plus Jakarta Sans', 'Inter', sans-serif" font-size="180" font-weight="700" fill="#ffffff" text-anchor="middle" dominant-baseline="middle" opacity="0.85">
        ${initials}
      </text>
    </svg>
  `;

  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

function assetExists(publicPath: string): boolean {
  const normalized = publicPath.startsWith('/') ? publicPath : `/${publicPath}`;
  return assetManifest.some((entry) => entry === normalized);
}

function findAssetByPrefix(prefix: string): string | null {
  const normalizedPrefix = prefix.startsWith('/') ? prefix : `/${prefix}`;
  return assetManifest.find((entry) => entry.startsWith(normalizedPrefix)) || null;
}

function collectGallery(slug: string): string[] {
  const prefix = `/assets/images/projects/${slug}/gallery-`;
  return assetManifest
    .filter((entry) => entry.startsWith(prefix))
    .sort()
    .map((entry) => entry);
}

// Validation avec gestion d'erreur
let validatedProjects: Project[] = [];

function sanitizeProjectsData() {
  return (projectsData as Array<Partial<Project>>).map((project) => {
    const slug = project?.slug || project?.id || '';
    const coverFromAssets = slug ? findAssetByPrefix(`/assets/images/projects/${slug}/cover`) : null;
    const thumbFromAssets = slug ? findAssetByPrefix(`/assets/images/projects/${slug}/thumb`) : null;
    const coverFromData = normalizeAssetPath(project?.media?.coverImage || project?.cover?.image || '');
    const hasCoverFromData = coverFromData && assetExists(coverFromData);
    const coverPlaceholder = createCoverPlaceholder(project);
    const coverSrc = coverFromAssets || (hasCoverFromData ? coverFromData : coverPlaceholder);
    const thumbnailSrc = thumbFromAssets || coverFromAssets || (hasCoverFromData ? coverFromData : coverPlaceholder);

    return {
      ...project,
      slug,
      tags: project?.tags || [],
      thumbnailSrc,
      coverSrc,
      media: {
        ...project?.media,
        coverImage: coverSrc,
        video: project?.media?.video ?? undefined,
        audio: project?.media?.audio ?? undefined,
      },
      video: project?.video ?? undefined,
      audio: project?.audio ?? undefined,
    } as Project;
  });
}

function resolveProjectVideo(slug: string, fallback?: string | null): string | null {
  const candidateVideos = [
    `/assets/videos/projects/${slug}/teaser.mp4`,
    `/assets/videos/projects/${slug}/video.mp4`,
  ];

  const directMatch = candidateVideos.find((path) => assetExists(path));
  if (directMatch) {
    return directMatch;
  }

  const autoDetected = findAssetByPrefix(`/assets/videos/projects/${slug}/`);
  if (autoDetected && autoDetected.endsWith('.mp4')) {
    return autoDetected;
  }

  return fallback ?? null;
}

function normalizeProjectMedia(project: Project): Project {
  const slug = project.slug || project.id;
  const coverPath = `/assets/images/projects/${slug}/cover.webp`;
  const resolvedCoverSrc = project.coverSrc || findAssetByPrefix(`/assets/images/projects/${slug}/cover`) || project.cover.image || '';
  const resolvedThumbnailSrc = project.thumbnailSrc || findAssetByPrefix(`/assets/images/projects/${slug}/thumb`) || resolvedCoverSrc;
  const gallery = project.media?.gallery?.length ? project.media.gallery : collectGallery(slug);
  const videoPath = resolveProjectVideo(slug, project.media?.video ?? project.video?.files?.mp4 ?? null);
  const audioPath = assetExists(`/assets/audio/projects/${slug}/extrait-01.mp3`)
    ? `/assets/audio/projects/${slug}/extrait-01.mp3`
    : project.media?.audio;
  const coverImage = resolvedCoverSrc || project.media?.coverImage || project.cover.image || '';

  const media = {
    gallery,
    video: videoPath ?? null,
    audio: audioPath ?? null,
    coverImage: assetExists(coverPath) ? coverPath : coverImage,
  } as Project['media'];

  const normalized: Project = {
    ...project,
    id: slug,
    slug,
    tags: project.tags || [],
    thumbnailSrc: resolvedThumbnailSrc,
    coverSrc: assetExists(coverPath) ? coverPath : resolvedCoverSrc,
    cover: {
      ...project.cover,
      ...(coverImage ? { image: assetExists(coverPath) ? coverPath : coverImage } : {}),
    },
    media,
  };

  if (!project.video && media.video) {
    normalized.video = {
      enabled: true,
      title: project.title,
      files: { mp4: media.video },
      description: project.details?.format,
    };
  }

  if (!project.audio && media.audio) {
    normalized.audio = {
      enabled: true,
      title: project.title,
      files: { mp3: media.audio },
      description: project.details?.format,
    };
  }

  return normalized;
}

try {
  const rawProjects = sanitizeProjectsData();
  validatedProjects = projectsSchema.parse(rawProjects).map(normalizeProjectMedia);
  console.log(`✅ Projects loader: ${validatedProjects.length} projets chargés et validés`);
} catch (error) {
  console.error('❌ Projects loader: Erreur de validation des projets', error);
  validatedProjects = [];
}

export function getAllProjects(): Project[] {
  return validatedProjects;
}

export function getProjectById(id: string): Project | undefined {
  return validatedProjects.find((project) => project.id === id);
}

export function getProjectsBySector(sector: ProjectSector): Project[] {
  return validatedProjects.filter((project) => project.sector === sector);
}

export function getUniqueSectors(): ProjectSector[] {
  const sectors = new Set<ProjectSector>();
  validatedProjects.forEach((project) => sectors.add(project.sector));
  return Array.from(sectors);
}
