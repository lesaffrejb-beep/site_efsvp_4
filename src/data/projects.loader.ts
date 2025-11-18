import projectsData from '../../content/projects.json';
import { projectsSchema } from '@/schemas/project.schema';
import type { Project, ProjectSector } from '@/types/project';

// Validation avec gestion d'erreur
let validatedProjects: Project[] = [];

function normalizeProjectMedia(project: Project): Project {
  const coverImage = project.media?.coverImage || project.cover.image || '';

  const media = {
    gallery: project.media?.gallery || [],
    video: project.media?.video ?? null,
    audio: project.media?.audio ?? null,
    coverImage,
  } as Project['media'];

  const normalized: Project = {
    ...project,
    cover: {
      ...project.cover,
      ...(coverImage ? { image: coverImage } : {}),
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
  validatedProjects = projectsSchema.parse(projectsData).map(normalizeProjectMedia);
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
