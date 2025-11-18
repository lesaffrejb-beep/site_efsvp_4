import { getAllProjects, getUniqueSectors } from '@/data/projects.loader';
import { ProjectGrid } from '@/components/projects/ProjectGrid';
import { ProjectModal } from '@/components/projects/ProjectModal';
import { SectorFilter } from '@/components/projects/SectorFilter';
import type { Project, ProjectSector } from '@/types/project';

export function initProjectsApp() {
  console.log('🚀 initProjectsApp: Démarrage');

  const filtersContainer = document.querySelector('.projects__filters');
  const gridContainer = document.querySelector('.projects__grid');

  if (!filtersContainer || !gridContainer) {
    console.warn('⚠️ initProjectsApp: Containers non trouvés', {
      filtersContainer: !!filtersContainer,
      gridContainer: !!gridContainer,
    });
    return;
  }

  const projects = getAllProjects().sort((a, b) => b.year - a.year);
  const sectors = getUniqueSectors();

  console.log(`📊 initProjectsApp: ${projects.length} projets, ${sectors.length} secteurs uniques`, {
    sectors,
  });

  const modal = new ProjectModal();
  const grid = new ProjectGrid({
    container: gridContainer as HTMLElement,
    onSelect: (project: Project) => modal.open(project),
  });

  const handleFilterChange = (sector: ProjectSector | 'tous') => {
    const filtered = sector === 'tous' ? projects : projects.filter((project) => project.sector === sector);
    console.log(`🔍 Filtrage: secteur="${sector}", ${filtered.length} projets affichés`);
    grid.render(filtered);
  };

  new SectorFilter({
    container: filtersContainer as HTMLElement,
    sectors,
    selected: 'tous',
    onChange: handleFilterChange,
  });

  grid.render(projects);
  console.log('✅ initProjectsApp: Rendu complet');
}
