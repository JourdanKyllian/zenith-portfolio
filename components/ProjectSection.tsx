import ProjectCard from './ProjectCard';
import { Projet } from '@/types';
import { CATEGORY_COLORS, CategoryColorKey } from '@/config/colors';

interface ProjectSectionProps {
  id: string;
  title: string;
  description?: string;
  projects: Projet[];
  colorKey?: string;
}

/**
 * UI Component : Wrapper regroupant une liste de cartes de projets.
 * Utilisé principalement pour structurer des catégories avec une entête stylisée.
 */
export default function ProjectSection({ id, title, description, projects, colorKey = 'blue' }: ProjectSectionProps) {
  const theme = CATEGORY_COLORS[colorKey as CategoryColorKey] || CATEGORY_COLORS.blue;

  return (
    <section id={id} className="scroll-mt-32 animate-fade-in">
      <div className="mb-10">
        <p className={`cat-label mb-3 ${theme.text}`}>Catégorie</p>
        
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <h2 className="font-display font-bold text-3xl sm:text-5xl text-z-text uppercase tracking-wide wrap-break-word max-w-full">
            {title}
          </h2>
          
          {description && (
            <p className="font-body text-z-muted text-xs sm:text-sm max-w-xs leading-relaxed">
              {description}
            </p>
          )}
        </div>
        
        <div className={`sep mt-6 mb-10 border-b ${theme.border}`}></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
}