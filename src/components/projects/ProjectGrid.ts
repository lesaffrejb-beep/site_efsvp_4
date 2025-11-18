import type { Project } from '@/types/project';
import { createProjectCard } from './ProjectCard';

interface ProjectGridOptions {
  container: HTMLElement;
  onSelect: (project: Project, trigger?: HTMLElement | null) => void;
}

export class ProjectGrid {
  private container: HTMLElement;
  private onSelect: (project: Project, trigger?: HTMLElement | null) => void;

  constructor(options: ProjectGridOptions) {
    this.container = options.container;
    this.onSelect = options.onSelect;
  }

  render(projects: Project[]) {
    this.container.innerHTML = '';
    this.container.setAttribute('role', 'list');
    projects.forEach((project) => {
      const card = createProjectCard({ project, onSelect: this.onSelect });
      card.setAttribute('role', 'listitem');
      this.container.appendChild(card);
    });
  }
}
