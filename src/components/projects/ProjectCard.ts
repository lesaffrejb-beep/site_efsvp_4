import type { Project } from '@/types/project';
import { createProjectStatus } from './ProjectStatus';
import { setupProjectAccentFromImage } from '@/scripts/modules/projectAccentFromImage';

interface ProjectCardProps {
  project: Project;
  onSelect: (project: Project, trigger?: HTMLElement | null) => void;
}

export function createProjectCard({ project, onSelect }: ProjectCardProps): HTMLElement {
  const card = document.createElement('article');
  card.className = 'project-card card-lift';
  card.tabIndex = 0;
  card.dataset.projectId = project.id;
  card.dataset.projectSlug = project.slug;
  card.dataset.sector = project.sector;
  card.dataset.status = project.status;
  card.id = `project-${project.id}`;

  // Set accent color for description based on project theme
  if (project.accentTheme) {
    card.dataset.accentTheme = project.accentTheme;
    card.style.setProperty('--project-accent-color', `var(--accent-${project.accentTheme}-dark)`);
  }

  const visual = document.createElement('div');
  visual.className = 'project-card__visual';

  const frame = document.createElement('div');
  frame.className = 'project-card__visual-frame';
  const gradient = `linear-gradient(135deg, ${project.cover.gradient?.from || 'var(--color-primary-500)'} 0%, ${
    project.cover.gradient?.to || 'var(--color-primary-700)'
  } 100%)`;
  frame.style.backgroundImage = gradient;

  if (project.thumbnailSrc) {
    const image = document.createElement('img');
    image.className = 'project-card__image';
    image.src = project.thumbnailSrc;
    image.alt = `${project.title} – ${project.location}`;
    image.loading = 'lazy';
    frame.appendChild(image);

    // Setup adaptive accent color from image analysis
    setupProjectAccentFromImage(card, image);
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

  const content = document.createElement('div');
  content.className = 'project-card__content';

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

  content.appendChild(header);
  content.appendChild(tagline);

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
  link.dataset.projectSlug = project.slug;
  link.addEventListener('click', (event) => onSelect(project, event.currentTarget as HTMLElement));

  footerRow.appendChild(status);
  footerRow.appendChild(link);

  if (tagsToRender.length) {
    footer.appendChild(tagsWrapper);
  }
  footer.appendChild(footerRow);

  body.appendChild(content);
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
