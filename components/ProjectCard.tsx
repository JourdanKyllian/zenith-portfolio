import Link from 'next/link';
import { FolderOpen, ExternalLink } from 'lucide-react';
import { Project } from '@/types';

const YoutubeIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M21.8 8s-.2-1.4-.8-2c-.8-.8-1.6-.8-2-.9C16.8 5 12 5 12 5s-4.8 0-7 .1c-.4.1-1.2.1-2 .9-.6.6-.8 2-.8 2S2 9.6 2 11.2v1.5c0 1.6.2 3.2.2 3.2s.2 1.4.8 2c.8.8 1.8.7 2.2.8C6.8 19 12 19 12 19s4.8 0 7-.2c.4-.1 1.2-.1 2-.9.6-.6.8-2 .8-2s.2-1.6.2-3.2v-1.5C22 9.6 21.8 8 21.8 8zM9.7 15.5v-5.6l5.6 2.8-5.6 2.8z"/>
  </svg>
);

export default function ProjectCard({ project }: { project: Project }) {
  const badgeStyles: Record<string, string> = {
    perso: "bg-blue-500/15 text-z-blue border-z-blue/30",
    pro: "bg-gray-400/12 text-z-silver border-z-silver/25",
    asso: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    larauze: "bg-purple-500/12 text-purple-400 border-purple-500/25",
  };

  return (
    <article className="project-card group">
      <Link href={`/projet/${project.id}`} className="block thumb-wrap">
        <img src={project.image_url} alt={project.titre} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-z-night/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3">
          <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 scale-75 group-hover:scale-100 transition-transform">
            <FolderOpen size={20} className="text-white" />
          </div>
          <span className="text-white font-sub text-[10px] font-bold uppercase tracking-widest">Ouvrir le dossier</span>
        </div>
      </Link>

      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${badgeStyles[project.categories.slug] || ""}`}>
            {project.categories.nom}
          </span>
          <div className="flex items-center gap-2">
            {project.youtube_url && <div className="text-z-muted"><YoutubeIcon size={14} /></div>}
            {project.drive_url && <div className="text-z-muted"><ExternalLink size={14} /></div>}
          </div>
        </div>
        <Link href={`/projet/${project.id}`}>
          <h3 className="font-display font-semibold text-z-text text-lg uppercase tracking-wide hover:text-z-blue transition-colors">
            {project.titre}
          </h3>
        </Link>
        <p className="font-body text-z-muted text-xs leading-relaxed mt-2 line-clamp-2">
          {project.description}
        </p>
      </div>
    </article>
  );
}