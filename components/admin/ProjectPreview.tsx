"use client";

import { useState } from 'react';
import { Monitor, Smartphone, Eye } from 'lucide-react';
import ProjectMediaContent from '@/components/project/ProjectMediaContent';
import { CategoryBadge } from '@/components/CategoryBadge';
import { Categorie } from '@/types';

/**
 * Interface étendue pour la prévisualisation asynchrone des sous-projets.
 */
interface PreviewSousProjet {
  id: number;
  projet_id: number;
  titre: string | null;
  description: string | null;
  drive_url: string | null;
  ordre: number;
  created_at: string;
  finalYoutubeUrl: string | null;
  driveImages: string[];
  pdf: { id: string; name: string; previewUrl: string; thumbnailUrl: string; } | null;
  driveVideoUrl: string | null;
}

interface ProjectPreviewProps {
  titre: string;
  description: string;
  miniatureUrl: string;
  activeCategory: Categorie | null | undefined;
  previewSousProjets: PreviewSousProjet[];
}

/**
 * Extrait l'identifiant unique d'une ressource Google Drive à partir d'une URL publique.
 * 
 * @param {string | null | undefined} urlOrId - L'URL source ou l'identifiant brut.
 * @returns {string | null} L'identifiant extrait ou null si la chaîne est invalide.
 */
function getDriveFileId(urlOrId: string | null | undefined): string | null {
  if (!urlOrId) return null;
  if (!urlOrId.includes('/')) return urlOrId;
  const fileDMatch = urlOrId.match(/\/d\/([a-zA-Z0-9-_]+)/);
  if (fileDMatch) return fileDMatch[1];
  const idParamMatch = urlOrId.match(/id=([a-zA-Z0-9-_]+)/);
  if (idParamMatch) return idParamMatch[1];
  return null;
}

/**
 * Composant d'aperçu en temps réel pour l'éditeur de projets.
 * Simule le rendu client de la fiche projet avec prise en charge du responsive design (Bureau/Mobile).
 *
 * @param {string} titre - Titre du projet.
 * @param {string} description - Description au format HTML.
 * @param {string} miniatureUrl - URL de couverture (Drive ou lien direct).
 * @param {Categorie | null | undefined} activeCategory - Catégorie active pour le badge.
 * @param {PreviewSousProjet[]} previewSousProjets - Collection des séquences médias formatées.
 */
export default function ProjectPreview({
  titre, description, miniatureUrl, activeCategory, previewSousProjets
}: ProjectPreviewProps) {
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');

  let previewCoverUrl = "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1025&auto=format&fit=cover";
  if (miniatureUrl) {
    if (miniatureUrl.startsWith('http') && !miniatureUrl.includes('drive.google.com')) {
      previewCoverUrl = miniatureUrl;
    } else {
      const driveImageId = getDriveFileId(miniatureUrl);
      if (driveImageId) previewCoverUrl = `https://drive.google.com/thumbnail?id=${driveImageId}&sz=w2048`;
    }
  }

  return (
    <div className="w-full h-full bg-[#020203] flex flex-col overflow-hidden">
      <div className="shrink-0 flex justify-center items-center p-3 border-b border-white/5 bg-black/40 backdrop-blur-sm z-20">
        <div className="flex bg-z-card p-1 rounded-lg border border-z-border">
          <button
            type="button"
            title="Mode Bureau"
            onClick={() => setPreviewDevice('desktop')}
            className={`flex items-center justify-center gap-2 h-7 sm:h-8 px-2.5 2xl:px-4 rounded-md transition-all ${
              previewDevice === 'desktop' ? 'bg-white/10 text-white' : 'text-z-muted hover:text-white'
            }`}
          >
            <Monitor size={14} className="shrink-0" /> 
            <span className="hidden 2xl:block text-[10px] font-bold uppercase tracking-widest">Bureau</span>
          </button>
          <button
            type="button"
            title="Mode Mobile"
            onClick={() => setPreviewDevice('mobile')}
            className={`flex items-center justify-center gap-2 h-7 sm:h-8 px-2.5 2xl:px-4 rounded-md transition-all ${
              previewDevice === 'mobile' ? 'bg-white/10 text-white' : 'text-z-muted hover:text-white'
            }`}
          >
            <Smartphone size={14} className="shrink-0" /> 
            <span className="hidden 2xl:block text-[10px] font-bold uppercase tracking-widest">Mobile</span>
          </button>
        </div>
      </div>

      <div className="flex-1 flex justify-center items-start overflow-y-auto custom-scrollbar relative p-0 sm:p-4 bg-[#0a0a0a]">
        <div
          className={`bg-z-bg transition-all duration-300 flex flex-col ${
            previewDevice === 'mobile'
              ? 'w-93.75 min-h-203 my-4 rounded-[2.5rem] border-10 border-z-card shadow-2xl ring-1 ring-white/10 overflow-hidden shrink-0'
              : 'w-full min-h-full rounded-none sm:rounded-xl shadow-2xl'
          }`}
        >
          <div className="pb-20 w-full">
            <section className="relative h-[40vh] sm:h-[60vh] w-full overflow-hidden">
              <img src={previewCoverUrl} alt="Cover" className="w-full h-full object-cover opacity-30" />
              <div className="absolute inset-0 bg-linear-to-t from-z-bg to-transparent" />
              <div className="absolute bottom-0 left-0 w-full p-6 sm:p-12 z-10">
                <h1 className="font-display font-bold text-4xl sm:text-6xl uppercase tracking-tighter leading-none mb-4">
                  {titre || "Titre du projet"}
                </h1>
                <CategoryBadge category={activeCategory} className="px-3 py-1 text-[9px]" />
              </div>
            </section>

            <section className="px-6 sm:px-12 py-12 grid grid-cols-1 gap-12">
              {description && (
                <div>
                  <h3 className="text-z-muted font-sub text-[10px] font-bold uppercase tracking-widest mb-6">Introduction</h3>
                  <div className="font-body text-z-text/80 leading-relaxed whitespace-pre-wrap rich-text" dangerouslySetInnerHTML={{ __html: description }} />
                </div>
              )}
              
              <div className="border border-dashed border-z-blue/30 rounded-xl p-4 sm:p-6 bg-z-card/30">
                <div className="text-[10px] text-z-blue font-bold uppercase tracking-widest mb-6 flex items-center justify-center gap-2">
                  <Eye size={14} /> Séquençage des détails
                </div>
                <ProjectMediaContent sousProjets={previewSousProjets} coverImageUrl="" projectTitle={titre} />
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
