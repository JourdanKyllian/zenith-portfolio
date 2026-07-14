"use client";

import Link from 'next/link';
import { FolderOpen, ExternalLink, Video } from 'lucide-react';
import { Projet } from '@/types';

// Fonction pour extraire l'ID d'une vidéo YouTube
function getYoutubeId(url: string | null | undefined): string | null {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

// Fonction pour extraire l'ID d'un fichier image sur Google Drive
function getDriveFileId(urlOrId: string | null | undefined): string | null {
  if (!urlOrId) return null;
  if (!urlOrId.includes('/')) return urlOrId; // C'est déjà un ID brut
  
  const fileDMatch = urlOrId.match(/\/d\/([a-zA-Z0-9-_]+)/);
  if (fileDMatch) return fileDMatch[1];
  
  const idParamMatch = urlOrId.match(/id=([a-zA-Z0-9-_]+)/);
  if (idParamMatch) return idParamMatch[1];
  
  return null;
}

export default function ProjectCard({ project }: { project: Projet }) {
  const badgeStyles: Record<string, string> = {
    perso: "bg-blue-500/15 text-z-blue border-z-blue/30",
    pro: "bg-gray-400/12 text-z-silver border-z-silver/25",
    asso: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    larauze: "bg-purple-500/12 text-purple-400 border-purple-500/25",
  };

  // 1. On tente de récupérer l'image personnalisée de la table Projet
  const driveImageId = getDriveFileId(project.miniature_url);
  let coverImageUrl = "";
  
  if (driveImageId) {
    coverImageUrl = `https://drive.google.com/thumbnail?id=${driveImageId}&sz=w1200`;
  } else {
    // Fallback 1 : On prend la miniature YouTube du premier sous-projet
    const premierSousProjet = project.sousprojet?.[0];
    const youtubeId = getYoutubeId(premierSousProjet?.youtube_url);
    
    // Fallback 2 : Une belle image par défaut d'Unsplash si rien n'est configuré
    coverImageUrl = youtubeId 
      ? `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg` 
      : "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1025&auto=format&fit=cover";
  }

  const hasVideos = project.sousprojet && project.sousprojet.length > 0;
  const hasDrive = project.sousprojet?.some(sp => sp.drive_url);

  return (
    <article className="project-card group">
      {/* Redirection propre vers le slug de l'artiste */}
      <Link href={`/projet/${project.slug}`} className="block thumb-wrap">
        <img src={coverImageUrl} alt={project.titre} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-z-night/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3">
          <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 scale-75 group-hover:scale-100 transition-transform">
            <FolderOpen size={20} className="text-white" />
          </div>
          <span className="text-white font-sub text-[10px] font-bold uppercase tracking-widest">Ouvrir l'artiste</span>
        </div>
      </Link>

      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${badgeStyles[project.categorie?.slug || ""] || ""}`}>
            {project.categorie?.name || "Général"}
          </span>
          
          <div className="flex items-center gap-2">
            {hasVideos && <div className="text-z-muted"><Video size={14} /></div>}
            {hasDrive && <div className="text-z-muted"><ExternalLink size={14} /></div>}
          </div>
        </div>
        
        <Link href={`/projet/${project.slug}`}>
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