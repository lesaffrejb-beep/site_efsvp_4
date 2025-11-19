import { getAllProjects, getUniqueSectors } from '@/data/projects.loader';
import { FEATURED_PROJECTS_ORDER } from '@/data/projectsOrder';
import { ProjectGrid } from '@/components/projects/ProjectGrid';
import { ProjectModal } from '@/components/projects/ProjectModal';
import { SectorFilter } from '@/components/projects/SectorFilter';
import type { Project, ProjectSector } from '@/types/project';

export function initProjectsApp() {
  if (import.meta.env.DEV) {
    console.log('🚀 initProjectsApp: Démarrage');
  }

  const sortProjects = (a: Project, b: Project) => {
    const indexA = FEATURED_PROJECTS_ORDER.indexOf(a.slug);
    const indexB = FEATURED_PROJECTS_ORDER.indexOf(b.slug);

    const aFeatured = indexA !== -1;
    const bFeatured = indexB !== -1;

    if (aFeatured && bFeatured) return indexA - indexB;
    if (aFeatured) return -1;
    if (bFeatured) return 1;

    const yearDiff = b.year - a.year;
    if (yearDiff !== 0) return yearDiff;

    return a.title.localeCompare(b.title);
  };

  const filtersContainer = document.querySelector('.projects__filters');
  const gridContainer = document.querySelector('.projects__grid');

  if (!filtersContainer || !gridContainer) {
    console.warn('⚠️ initProjectsApp: Containers non trouvés', {
      filtersContainer: !!filtersContainer,
      gridContainer: !!gridContainer,
    });
    return;
  }

  const projects = getAllProjects().sort(sortProjects);
  const sectors = getUniqueSectors();

  if (import.meta.env.DEV) {
    console.log(`📊 initProjectsApp: ${projects.length} projets, ${sectors.length} secteurs uniques`, {
      sectors,
    });
  }

  const modal = new ProjectModal();
  const grid = new ProjectGrid({
    container: gridContainer as HTMLElement,
    onSelect: (project: Project, trigger?: HTMLElement | null) => modal.open(project, trigger),
  });

  const handleFilterChange = (sector: ProjectSector | 'tous') => {
    const filtered = sector === 'tous' ? projects : projects.filter((project) => project.sector === sector);
    if (import.meta.env.DEV) {
      console.log(`🔍 Filtrage: secteur="${sector}", ${filtered.length} projets affichés`);
    }
    grid.render(filtered);
  };

  new SectorFilter({
    container: filtersContainer as HTMLElement,
    sectors,
    selected: 'tous',
    onChange: handleFilterChange,
  });

  grid.render(projects);
  if (import.meta.env.DEV) {
    console.log('✅ initProjectsApp: Rendu complet');
  }
}
