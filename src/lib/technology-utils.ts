import { TechnologyType, SolutionArea, SolutionAreaTechnologies, TechnologyTypeLabels } from '@/types';

/**
 * Gets technologies for a specific solution area
 */
export function getTechnologiesForSolutionArea(solutionArea?: string): TechnologyType[] {
  if (!solutionArea) {
    // If no solution area, return all technologies
    return Object.values(TechnologyType).filter(
      value => typeof value === 'number'
    ) as TechnologyType[];
  }

  const techs = SolutionAreaTechnologies[solutionArea as SolutionArea] || [];
  return techs.sort((a, b) => {
    const labelA = TechnologyTypeLabels[a] || String(a);
    const labelB = TechnologyTypeLabels[b] || String(b);
    return labelA.localeCompare(labelB);
  });
}

/**
 * Gets all technologies sorted alphabetically
 */
export function getAllTechnologies(): TechnologyType[] {
  const allTechs = Object.values(TechnologyType).filter(
    value => typeof value === 'number'
  ) as TechnologyType[];
  
  return allTechs.sort((a, b) => {
    const labelA = TechnologyTypeLabels[a] || String(a);
    const labelB = TechnologyTypeLabels[b] || String(b);
    return labelA.localeCompare(labelB);
  });
}

/**
 * Search technologies by label
 */
export function searchTechnologies(query: string, solutionArea?: string): TechnologyType[] {
  const searchLower = query.toLowerCase();
  const allTechs = getAllTechnologies();
  const solutionAreaTechs = solutionArea ? getTechnologiesForSolutionArea(solutionArea) : [];
  
  return allTechs.filter(tech => {
    const label = TechnologyTypeLabels[tech] || String(tech);
    return label.toLowerCase().includes(searchLower);
  }).sort((a, b) => {
    // Prioritize solution area technologies in search results
    const aInSolutionArea = solutionAreaTechs.includes(a);
    const bInSolutionArea = solutionAreaTechs.includes(b);
    
    if (aInSolutionArea && !bInSolutionArea) return -1;
    if (!aInSolutionArea && bInSolutionArea) return 1;
    
    const labelA = TechnologyTypeLabels[a] || String(a);
    const labelB = TechnologyTypeLabels[b] || String(b);
    return labelA.localeCompare(labelB);
  });
}
