import { z } from '../utils/zod-lite.ts';
import type { Project, ProjectSector, ProjectStatus } from '../types/project';

export const projectSchema = z.object<Project>({
  id: z.string().regex(/^[a-z0-9-]+$/),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string().min(1),
  client: z.string().min(1),
  year: z.number().int().min(2020).max(2030),
  location: z.string().min(1),
  status: z.enum<ProjectStatus>(['delivered', 'in-progress']),
  tags: z.array(z.string()),
  cover: z.object({
    image: z.string().optional(),
    initials: z.string().length(2),
    gradient: z
      .object({
        from: z.string(),
        to: z.string(),
      })
      .optional(),
  }),
  shortDescription: z.string().min(10).max(400),
  longDescription: z.array(z.string().min(1)),
  category: z.string().min(1),
  sector: z.enum<ProjectSector>([
    'artisanat',
    'btp',
    'environnement',
    'patrimoine',
    'agriculture',
    'mobilite',
    'economie-sociale',
    'spectacle-vivant',
    'territoire',
    'vie-associative',
  ]),
  themes: z.array(z.string()),
  hasVideo: z.boolean().optional(),
  hasAudio: z.boolean().optional(),
  details: z.object({
    format: z.string(),
    duration: z.string(),
    audience: z.string(),
    deliverables: z.array(z.string()),
  }),
  team: z.array(z.string().min(1)),
  partners: z.array(z.string()).optional(),
  media: z.object({
    coverImage: z.string().min(1),
    gallery: z.array(z.string()).optional(),
    video: z.string().min(1).optional(),
    audio: z.string().min(1).optional(),
  }),
  audio: z
    .object({
      enabled: z.boolean(),
      title: z.string().min(1),
      artist: z.string().optional(),
      duration: z.number().int().positive().optional(),
      files: z.object({
        mp3: z.string().min(1),
        ogg: z.string().optional(),
      }),
      waveformColor: z.string().optional(),
      description: z.string().optional(),
    })
    .optional(),
  video: z
    .object({
      enabled: z.boolean(),
      title: z.string().min(1),
      duration: z.number().int().positive().optional(),
      files: z.object({
        mp4: z.string().min(1),
        webm: z.string().optional(),
      }),
      poster: z.string().optional(),
      autoplay: z.boolean().optional(),
      description: z.string().optional(),
    })
    .optional(),
});

export const projectsSchema = z.array(projectSchema);
