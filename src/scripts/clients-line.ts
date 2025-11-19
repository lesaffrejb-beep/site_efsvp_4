import { getAllProjects } from '@/data/projects.loader';
import { FEATURED_PROJECTS_ORDER } from '@/data/projectsOrder';
import type { Project } from '@/types/project';

const sortRemainingProjects = (projects: Project[]) =>
  [...projects].sort((a, b) => {
    const yearDiff = b.year - a.year;
    if (yearDiff !== 0) return yearDiff;
    return a.title.localeCompare(b.title);
  });

export function initClientsLine() {
  const list = document.querySelector<HTMLElement>('[data-clients-list]');
  if (!list) return;

  const projects = getAllProjects();
  if (!projects.length) {
    list.innerHTML = '';
    return;
  }

  const projectMap = new Map(projects.map((project) => [project.slug, project]));
  const ordered: Project[] = [];
  const seen = new Set<string>();

  const pushProject = (project: Project | undefined) => {
    if (!project || seen.has(project.slug)) return;
    seen.add(project.slug);
    ordered.push(project);
  };

  FEATURED_PROJECTS_ORDER.forEach((slug) => pushProject(projectMap.get(slug)));
  sortRemainingProjects(projects).forEach((project) => pushProject(project));

  list.innerHTML = '';
  list.setAttribute('role', 'list');

  ordered.forEach((project) => {
    const item = document.createElement('li');
    item.className = 'client-badge';
    item.dataset.projectSlug = project.slug;
    item.setAttribute('role', 'listitem');

    const label = document.createElement('span');
    label.className = 'client-badge__label';
    label.textContent = project.title;

    item.appendChild(label);
    list.appendChild(item);
  });
}
