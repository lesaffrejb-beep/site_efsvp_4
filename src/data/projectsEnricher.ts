/**
 * ============================================
 * PROJECTS ENRICHER
 * Enrichit les projets avec metadata.json optionnels
 * et chemins vers assets automatiques
 * ============================================
 */

import type { Project } from '@/types/project';
import { devLog } from '@/scripts/utils/logger';

const ASSETS_BASE_PATH = '/assets/projects';

/**
 * Enrichit un projet avec ses metadata.json optionnels
 * Charge depuis /assets/projects/[id]/metadata.json
 */
export async function enrichProject(project: Project): Promise<Project> {
  try {
    // Tente de charger le metadata.json spécifique au projet
    const metadataPath = `${ASSETS_BASE_PATH}/${project.id}/metadata.json`;
    const response = await fetch(metadataPath);

    if (response.ok) {
      const metadata = await response.json();

      // Fusionne les metadata avec le projet (metadata.json a priorité)
      const enriched = {
        ...project,
        ...metadata,
        // Préserve certains champs du projet de base
        id: project.id,
      };

      devLog(`✅ [ProjectsEnricher] Enriched project ${project.id} with metadata.json`);
      return addAssetPaths(enriched);
    }
  } catch (error) {
    // Pas grave si le metadata n'existe pas
    devLog(`ℹ️  [ProjectsEnricher] No metadata.json for project ${project.id}`);
  }

  // Pas de metadata, juste ajouter les chemins assets
  return addAssetPaths(project);
}

/**
 * Enrichit tous les projets
 */
export async function enrichAllProjects(projects: Project[]): Promise<Project[]> {
  const enriched = await Promise.all(
    projects.map(project => enrichProject(project))
  );

  return enriched;
}

/**
 * Ajoute les chemins vers les assets
 */
function addAssetPaths(project: Project): Project {
  const basePath = `${ASSETS_BASE_PATH}/${project.id}`;

  return {
    ...project,
    _assetPaths: {
      base: basePath,
      images: `${basePath}/images`,
      audio: `${basePath}/audio`,
    },
  };
}

/**
 * Vérifie si un fichier audio existe
 */
export async function checkAudioExists(project: Project): Promise<boolean> {
  if (!project?.audio?.enabled || !project?.audio?.files?.mp3) {
    return false;
  }

  try {
    // Construit le chemin complet vers le fichier audio
    const audioPath = project.audio.files.mp3.startsWith('/')
      ? project.audio.files.mp3
      : `${ASSETS_BASE_PATH}/${project.id}/audio/${project.audio.files.mp3}`;

    const response = await fetch(audioPath, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    console.warn(`[ProjectsEnricher] Audio check failed for ${project.id}:`, error);
    return false;
  }
}

/**
 * Résout le chemin d'une image de projet
 */
export function resolveImagePath(project: Project, imageName: string): string {
  if (imageName.startsWith('/') || imageName.startsWith('http')) {
    return imageName;
  }

  return `${ASSETS_BASE_PATH}/${project.id}/images/${imageName}`;
}

/**
 * Résout le chemin d'un fichier audio
 */
export function resolveAudioPath(project: Project, audioName: string): string {
  if (audioName.startsWith('/') || audioName.startsWith('http')) {
    return audioName;
  }

  return `${ASSETS_BASE_PATH}/${project.id}/audio/${audioName}`;
}

/**
 * Type augmentation pour ajouter _assetPaths au type Project
 */
declare module '@/types/project' {
  interface Project {
    _assetPaths?: {
      base: string;
      images: string;
      audio: string;
    };
  }
}
