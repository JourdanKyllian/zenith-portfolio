import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import { ArrowLeft, PlayCircle, Instagram, Youtube, Twitch, Facebook } from 'lucide-react';
import Link from 'next/link';
import { getProjectAssetsFromDrive, DriveAssets } from '@/lib/googleDrive';
import { SousProjet, Projet } from '@/types';
import ProjectMediaContent from '@/components/ProjectMediaContent';
import { getBadgeTheme } from '@/config/colors';

export const revalidate = 3600;

/**
 * Interface locale étendant SousProjet.
 * Garantit un typage strict après la résolution asynchrone des médias Google Drive,
 * évitant l'utilisation du type 'any' lors du passage des props au composant enfant.
 */
interface ProcessedSousProjet extends SousProjet {
  finalYoutubeUrl: string | null;
  driveImages: string[];
  pdf: {
    id: string;
    name: string;
    previewUrl: string;
    thumbnailUrl: string;
  } | null;
  driveVideoUrl: string | null;
}

/**
 * Génère les métadonnées SEO dynamiques pour la page projet.
 * 
 * @param {Promise<{ slug: string }>} params - Paramètres dynamiques de la route.
 * @returns {Promise<{ title: string }>} Les métadonnées formatées pour le <head>.
 */
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const { data } = await supabase
    .from('projet')
    .select('*, categorie(*)')
    .eq('slug', slug)
    .single();

  if (!data) {
    return { title: 'Projet — ZENITH PRODUCTION' };
  }

  // Cast nécessaire car Supabase renvoie un type générique sur les jointures (*)
  const project = data as unknown as Projet;
  const categoryName = project.categorie?.name || 'Général';

  return {
    title: `${project.titre} — ${categoryName} | ZENITH PRODUCTION`,
  };
}

/**
 * Extrait l'ID unique d'un fichier hébergé sur Google Drive depuis divers formats d'URL.
 * Utile pour exploiter l'API de miniature Drive (thumbnail) plutôt que le viewer natif complet.
 */
function getDriveFileId(urlOrId: string | null | undefined): string | null {
  if (!urlOrId) return null;
  if (!urlOrId.includes('/')) return urlOrId;
  
  const fileDMatch = urlOrId.match(/\/d\/([a-zA-Z0-9-_]+)/);
  if (fileDMatch) return fileDMatch[1];
  
  const idParamMatch = urlOrId.match(/id=([a-zA-Z0-9-_]+)/);
  if (idParamMatch) return idParamMatch[1];

  const driveViewerMatch = urlOrId.match(/\/drive-viewer\/([a-zA-Z0-9-_]+)/);
  if (driveViewerMatch) return driveViewerMatch[1];
  
  return null;
}

/**
 * Server Component : Page de détail d'un projet.
 */
export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // Récupération du projet principal et de ses relations (Catégorie pour le badge, Sous-projets pour les médias)
  const { data } = await supabase
    .from('projet')
    .select('*, categorie(*), sousprojet(*)')
    .eq('slug', slug)
    .single();

  if (!data) return notFound();

  const project = data as unknown as Projet;

  // Tri côté client pour pallier l'absence de garantie d'ordre sur la jointure Supabase
  const sousProjets: SousProjet[] = (project.sousprojet || [])
    .sort((a: SousProjet, b: SousProjet) => (a.ordre || 0) - (b.ordre || 0));

  // Résolution parallèle des assets Drive pour chaque sous-projet.
  // Remplace les liens bruts par des listes d'images, de PDF et d'URL vidéo directes.
  const sousProjetsAvecMedias: ProcessedSousProjet[] = await Promise.all(
    sousProjets.map(async (sp) => {
      const driveAssets: DriveAssets = sp.drive_url 
        ? await getProjectAssetsFromDrive(sp.drive_url)
        : { images: [], youtubeUrl: null, pdf: null, videoUrl: null }; // Fallback de sécurité si le champ est vide
      
      return {
        ...sp,
        // La vidéo YouTube détectée dans Drive prend la priorité sur l'URL de la BDD
        finalYoutubeUrl: driveAssets.youtubeUrl || sp.youtube_url,
        driveImages: driveAssets.images,
        pdf: driveAssets.pdf,
        driveVideoUrl: driveAssets.videoUrl
      };
    })
  );

  // Détermine s'il faut afficher l'indicateur UI "Vidéos disponibles"
  const hasAnyVideo = sousProjetsAvecMedias.some(sp => sp.finalYoutubeUrl || sp.driveVideoUrl);

  const badgeTheme = getBadgeTheme(project.categorie?.color);

  // Logique de résolution de l'image de couverture (Hero)
  const miniatureUrl = project.miniature_url;
  let coverImageUrl = "";

  if (miniatureUrl) {
    if (miniatureUrl.startsWith('http') && !miniatureUrl.includes('drive.google.com')) {
      // 1. URL externe standard (Unsplash, AWS, etc.) -> Utilisée telle quelle
      coverImageUrl = miniatureUrl;
    } else {
      // 2. URL Google Drive -> Extraction de l'ID pour générer une miniature haute résolution (sz=w2048)
      const driveImageId = getDriveFileId(miniatureUrl);
      coverImageUrl = driveImageId 
        ? `https://drive.google.com/thumbnail?id=${driveImageId}&sz=w2048`
        : miniatureUrl;
    }
  } else {
    // 3. Fallback -> Image par défaut globale si aucune miniature n'est renseignée
    coverImageUrl = "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1025&auto=format&fit=cover";
  }

  return (
    <main className="min-h-screen bg-z-bg text-z-text pb-20">
      {/* --- SECTION HERO --- */}
      <section className="relative h-[60vh] w-full overflow-hidden">
        <img 
          src={coverImageUrl} 
          alt={project.titre} 
          className="w-full h-full object-cover opacity-30" 
          loading="eager"
        />
        <div className="absolute inset-0 bg-linear-to-t from-z-bg to-transparent" />
        <div className="absolute bottom-0 left-0 w-full p-8 sm:p-16 max-w-7xl mx-auto z-10">
          <Link href="/projet" className="flex items-center gap-2 text-z-blue text-[13px] font-bold uppercase tracking-widest mb-6 hover:translate-x-2 transition-transform">
            <ArrowLeft size={14} /> Retour à la galerie
          </Link>
          <h1 className="font-display font-bold text-5xl sm:text-8xl uppercase tracking-tighter leading-none mb-6">
            {project.titre}
          </h1>
          
          {/* Ligne Méta : S'affiche uniquement si une catégorie ou au moins un réseau social est défini en base */}
          {(project.categorie?.name || project.link_instagram || project.link_youtube || project.link_tiktok || project.link_twitch || project.link_facebook) && (
            <div className="flex flex-wrap items-center gap-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              
              {project.categorie && (
                <div className={`px-3 py-1 rounded border transition-colors duration-300 ${badgeTheme.border} ${badgeTheme.bg} ${badgeTheme.text} text-[9px] font-bold uppercase tracking-widest`}>
                  {project.categorie?.name || "Général"}
                </div>
              )}

              {/* 
                NOTE TECHNIQUE : Utilisation de SVG natifs pour les réseaux sociaux.
                La librairie 'lucide-react' a retiré les logos de marques pour des raisons de droits.
                Les SVG bruts permettent de garder un design homogène sans installer de librairie tierce (ex: react-icons).
              */}
              {(project.link_instagram || project.link_youtube || project.link_tiktok || project.link_twitch || project.link_facebook) && (
                <div className="flex items-center gap-2 border-l border-z-border pl-4 md:flex">
                  
                  {project.link_instagram && (
                    <a href={project.link_instagram} target="_blank" rel="noopener noreferrer" className="group p-1.5 rounded-lg border border-z-border bg-z-card/50 hover:bg-pink-500/10 hover:border-pink-500/20 transition-all" title="Suivre sur Instagram">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-z-muted group-hover:text-pink-500 transition-colors">
                        <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                      </svg>
                    </a>
                  )}

                  {project.link_youtube && (
                    <a href={project.link_youtube} target="_blank" rel="noopener noreferrer" className="group p-1.5 rounded-lg border border-z-border bg-z-card/50 hover:bg-red-500/10 hover:border-red-500/20 transition-all" title="Suivre sur Youtube">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-z-muted group-hover:text-red-500 transition-colors">
                        <path d="M2.5 7.1C2.6 5.9 3.5 5 4.7 4.9 7 4.5 12 4.5 12 4.5s5 0 7.3.4c1.2.1 2.1 1 2.2 2.2.4 2.4.4 4.9.4 4.9s0 2.5-.4 4.9c-.1 1.2-1 2.1-2.2 2.2-2.3.4-7.3.4-7.3.4s-5 0-7.3-.4c-1.2-.1-2.1-1-2.2-2.2C2 14.5 2 12 2 12s0-2.5.5-4.9z"/>
                        <path d="M10 15l5-3-5-3v6z"/>
                      </svg>
                    </a>
                  )}

                  {project.link_tiktok && (
                    <a href={project.link_tiktok} target="_blank" rel="noopener noreferrer" className="group p-1.5 rounded-lg border border-z-border bg-z-card/50 hover:bg-cyan-400/10 hover:border-cyan-400/20 transition-all" title="Suivre sur TikTok">
                      {/* Logo TikTok en mode 'outline' avec les attributs de tracé Lucide */}
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-z-muted group-hover:text-cyan-400 transition-colors">
                        <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/>
                      </svg>
                    </a>
                  )}

                  {project.link_twitch && (
                    <a href={project.link_twitch} target="_blank" rel="noopener noreferrer" className="group p-1.5 rounded-lg border border-z-border bg-z-card/50 hover:bg-purple-500/10 hover:border-purple-500/20 transition-all" title="Suivre sur Twitch">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-z-muted group-hover:text-purple-500 transition-colors">
                        <path d="M21 2H3v16h5v4l4-4h5l4-4V2zm-10 9V7m5 4V7"/>
                      </svg>
                    </a>
                  )}

                  {project.link_facebook && (
                    <a href={project.link_facebook} target="_blank" rel="noopener noreferrer" className="group p-1.5 rounded-lg border border-z-border bg-z-card/50 hover:bg-blue-500/10 hover:border-blue-500/20 transition-all" title="Suivre sur Facebook">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-z-muted group-hover:text-blue-500 transition-colors">
                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                      </svg>
                    </a>
                  )}

                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* --- SECTION CONTENU --- */}
      <section className="max-w-7xl mx-auto px-8 py-20 grid grid-cols-1 lg:grid-cols-3 gap-20">
        
        {/* Colonne latérale (gauche) : Contexte du projet */}
        <div className="lg:col-span-1 space-y-10">
          <div>
            <h3 className="text-z-muted font-sub text-[10px] font-bold uppercase tracking-widest mb-6">Introduction</h3>
            {/* whitespace-pre-wrap assure le rendu des sauts de ligne tapés dans le back-office */}
            <p className="font-body text-z-text/80 leading-relaxed whitespace-pre-wrap">{project.description}</p>
          </div>
          
          {hasAnyVideo && (
            <div className="flex flex-col gap-4">
              <div className="btn-blue p-4 rounded-lg flex items-center justify-center gap-3 text-[10px] font-bold uppercase tracking-widest opacity-80 cursor-default">
                <PlayCircle size={18} /> Vidéos disponibles
              </div>
            </div>
          )}
        </div>

        {/* Colonne principale (droite) : Grille d'affichage des médias (Composant Client) */}
        <ProjectMediaContent 
          sousProjets={sousProjetsAvecMedias} 
          coverImageUrl={coverImageUrl}
          projectTitle={project.titre} 
        />
      </section>
    </main>
  );
}