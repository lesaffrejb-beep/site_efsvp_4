import projectsData from '../../content/projects.json';
import { projectsSchema } from '@/schemas/project.schema';
import type { Project, ProjectSector } from '@/types/project';

const assetManifest = Object.keys(
  import.meta.glob('../../public/assets/**/*', { eager: true })
).map((key) => key.replace('../../public', ''));

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
    const coverFromData = project?.media?.coverImage || project?.cover?.image || '';
    const coverSrc = coverFromAssets || coverFromData;
    const thumbnailSrc = thumbFromAssets || coverSrc;

    return {
      ...project,
      slug,
      tags: project?.tags || [],
      thumbnailSrc,
      coverSrc,
      media: {
        ...project?.media,
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
