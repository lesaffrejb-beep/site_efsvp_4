import type { Project } from '@/types/project';
import { createProjectStatus } from './ProjectStatus';

interface ProjectCardProps {
  project: Project;
  onSelect: (project: Project, trigger?: HTMLElement | null) => void;
}

export function createProjectCard({ project, onSelect }: ProjectCardProps): HTMLElement {
  const card = document.createElement('article');
  card.className = 'project-card card-lift';
  card.tabIndex = 0;
  card.dataset.projectId = project.id;
  card.dataset.sector = project.sector;
  card.dataset.status = project.status;
  card.id = `project-${project.id}`;

  const visual = document.createElement('div');
  visual.className = 'project-card__visual';

  const coverImage = project.media?.coverImage || project.cover.image;

  const frame = document.createElement('div');
  frame.className = 'project-card__visual-frame';
  const gradient = `linear-gradient(135deg, ${project.cover.gradient?.from || 'var(--color-primary-500)'} 0%, ${
    project.cover.gradient?.to || 'var(--color-primary-700)'
  } 100%)`;
  if (coverImage) {
    frame.style.backgroundImage = `linear-gradient(120deg, rgba(0,0,0,0.35), rgba(0,0,0,0.5)), url(${coverImage})`;
    frame.style.backgroundSize = 'cover';
    frame.style.backgroundPosition = 'center';
  } else {
    frame.style.backgroundImage = gradient;
  }

  const badge = document.createElement('span');
  badge.className = 'project-card__category';
  badge.textContent = project.category;

  const monogram = document.createElement('span');
  monogram.className = 'project-card__initials';
  monogram.textContent = project.cover.initials;

  const location = document.createElement('span');
  location.className = 'project-card__location';
  location.textContent = project.location;

  frame.appendChild(badge);
  frame.appendChild(monogram);
  frame.appendChild(location);
  visual.appendChild(frame);

  const body = document.createElement('div');
  body.className = 'project-card__body';

  const header = document.createElement('div');
  header.className = 'project-card__header';

  const title = document.createElement('h3');
  title.className = 'project-card__title';
  title.textContent = project.title;

  const year = document.createElement('span');
  year.className = 'project-card__year';
  year.textContent = `${project.year}`;

  header.appendChild(title);
  header.appendChild(year);

  const tagline = document.createElement('p');
  tagline.className = 'project-card__tagline';
  tagline.textContent = project.shortDescription;

  const footer = document.createElement('div');
  footer.className = 'project-card__footer';

  const tagsWrapper = document.createElement('div');
  tagsWrapper.className = 'project-card__tags';
  const tagsToRender = (project.tags && project.tags.length ? project.tags : project.themes).slice(0, 4);
  tagsToRender.forEach((tagText) => {
    const tag = document.createElement('span');
    tag.className = 'project-card__tag';
    tag.textContent = tagText;
    tagsWrapper.appendChild(tag);
  });

  const footerRow = document.createElement('div');
  footerRow.className = 'project-card__footer-row';

  const status = createProjectStatus(project.status);
  const link = document.createElement('button');
  link.type = 'button';
  link.className = 'project-card__link';
  link.textContent = 'Voir le projet';
  link.addEventListener('click', (event) => onSelect(project, event.currentTarget as HTMLElement));

  footerRow.appendChild(status);
  footerRow.appendChild(link);

  if (tagsToRender.length) {
    footer.appendChild(tagsWrapper);
  }
  footer.appendChild(footerRow);

  body.appendChild(header);
  body.appendChild(tagline);
  body.appendChild(footer);

  card.appendChild(visual);
  card.appendChild(body);

  const handleSelect = (event?: Event) =>
    onSelect(project, (event?.currentTarget as HTMLElement | null) || card);
  card.addEventListener('click', handleSelect);
  card.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleSelect(event);
    }
  });

  return card;
}
