import ProjectCard from './ProjectCard';
import { Project } from '@/types';

interface ProjectSectionProps {
  id: string;
  title: string;
  description?: string;
  projects: Project[];
  slug: string; // Utilisé pour appliquer les styles spécifiques (couleurs)
}

export default function ProjectSection({ id, title, description, projects, slug }: ProjectSectionProps) {
  // Configuration des styles selon le slug pour garder la cohérence visuelle
  const styles: Record<string, { label: string; sep: string }> = {
    perso: { label: "text-z-blue", sep: "border-z-blue/30" },
    pro: { label: "opacity-70", sep: "opacity-50 border-z-silver/20" },
    asso: { label: "text-emerald-400", sep: "border-emerald-500/20" },
    larauze: { label: "text-purple-400", sep: "border-purple-500/20" },
  };

  const currentStyle = styles[slug] || styles.perso;

  return (
    <section id={id} className="scroll-mt-32 animate-fade-in">
      <div className="mb-10">
        <p className={`cat-label mb-3 ${currentStyle.label}`}>Catégorie</p>
        
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          {/* Correctif Responsive : text-3xl sur mobile, sm:text-5xl ensuite */}
          <h2 className="font-display font-bold text-3xl sm:text-5xl text-z-text uppercase tracking-wide wrap-break-word max-w-full">
            {title}
          </h2>
          
          {description && (
            <p className="font-body text-z-muted text-xs sm:text-sm max-w-xs leading-relaxed">
              {description}
            </p>
          )}
        </div>
        
        <div className={`sep mt-6 mb-10 ${currentStyle.sep}`}></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
}