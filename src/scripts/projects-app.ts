import { getAllProjects, getUniqueSectors } from '@/data/projects.loader';
import { ProjectGrid } from '@/components/projects/ProjectGrid';
import { ProjectModal } from '@/components/projects/ProjectModal';
import { SectorFilter } from '@/components/projects/SectorFilter';
import type { Project, ProjectSector } from '@/types/project';
import { devLog } from '@/scripts/utils/logger';

export function initProjectsApp() {
  devLog('🚀 initProjectsApp: Démarrage');

  const FEATURED_ORDER = [
    'la-force-de-la-douceur',
    'sival',
    'a2mo',
    'atelier-lacour',
    'le-jardin-de-cocagne',
    'les-seigneurs-de-clisson',
    'etat-de-nature',
  ];

  const sortProjects = (a: Project, b: Project) => {
    const indexA = FEATURED_ORDER.indexOf(a.id);
    const indexB = FEATURED_ORDER.indexOf(b.id);

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

  devLog(`📊 initProjectsApp: ${projects.length} projets, ${sectors.length} secteurs uniques`, {
    sectors,
  });

  const modal = new ProjectModal();
  const grid = new ProjectGrid({
    container: gridContainer as HTMLElement,
    onSelect: (project: Project, trigger?: HTMLElement | null) => modal.open(project, trigger),
  });

  const handleFilterChange = (sector: ProjectSector | 'tous') => {
    const filtered = sector === 'tous' ? projects : projects.filter((project) => project.sector === sector);
    devLog(`🔍 Filtrage: secteur="${sector}", ${filtered.length} projets affichés`);
    grid.render(filtered);
  };

  new SectorFilter({
    container: filtersContainer as HTMLElement,
    sectors,
    selected: 'tous',
    onChange: handleFilterChange,
  });

  grid.render(projects);
  devLog('✅ initProjectsApp: Rendu complet');
}
