import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { ArrowLeft, Film, Calendar } from 'lucide-react';
import ProjectMediaContent from '@/components/ProjectMediaContent';
import { getProjectAssetsFromDrive } from '@/lib/googleDrive';
import { Projet, SousProjet } from '@/types';

export const revalidate = 3600;

/**
 * Extrait l'identifiant d'un fichier Google Drive depuis son URL.
 * 
 * @param {string | null | undefined} urlOrId - L'URL ou l'ID brut du fichier.
 * @returns {string | null} L'identifiant du fichier résolu.
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
 * Convertit une URL de miniature ou un lien Google Drive en source d'image valide.
 * 
 * @param {string | null | undefined} miniatureUrl - L'URL source enregistrée.
 * @returns {string} L'URL finale de l'image résolue.
 */
function getCoverImageUrl(miniatureUrl: string | null | undefined): string {
  if (!miniatureUrl) {
    return "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1025&auto=format&fit=cover";
  }
  if (miniatureUrl.startsWith('http') && !miniatureUrl.includes('drive.google.com')) {
    return miniatureUrl;
  }
  const driveImageId = getDriveFileId(miniatureUrl);
  return driveImageId 
    ? `https://drive.google.com/thumbnail?id=${driveImageId}&sz=w1200`
    : miniatureUrl;
}

/**
 * Génère les paramètres statiques pour le rendu côté serveur (SSG) des routes dynamiques.
 *
 * @returns {Promise<{ slug: string }[]>} Les paramètres de routage pré-compilés.
 */
export async function generateStaticParams() {
  const { data: projets, error } = await supabase
    .from('projet')
    .select('slug');

  if (error || !projets) {
    console.error('Erreur lors de la pré-génération des routes dynamiques:', error);
    return [];
  }

  return projets.map((projet: { slug: string }) => ({
    slug: projet.slug,
  }));
}

/**
 * Server Component : Page de détail d'un projet.
 * Restaure la structure de mise en page originale avec traitement hybride des médias.
 *
 * @param {Promise<{ slug: string }>} params - Promesse contenant le slug de l'URL du projet.
 */
export default async function ProjetUniquePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const { data: dataProjet, error } = await supabase
    .from('projet')
    .select('*, sousprojet(*)')
    .eq('slug', slug)
    .single();

  if (error || !dataProjet) {
    notFound();
  }

  const projet = dataProjet as Projet & { sousprojet: SousProjet[] };

  const sousProjetsTransformes = await Promise.all(
    (projet.sousprojet || [])
      .sort((a, b) => a.ordre - b.ordre)
      .map(async (sp) => {
        let driveImages: string[] = [];
        let driveYoutubeUrl = null;
        let pdf = null;
        let driveVideoUrl = null;

        if (sp.drive_url) {
          const driveData = await getProjectAssetsFromDrive(sp.drive_url);
          driveImages = driveData.images;
          driveYoutubeUrl = driveData.youtubeUrl;
          pdf = driveData.pdf;
          driveVideoUrl = driveData.videoUrl;
        }

        return {
          ...sp,
          driveImages,
          pdf,
          driveVideoUrl,
          finalYoutubeUrl: sp.youtube_url || driveYoutubeUrl,
        };
      })
  );

  const dateProjet = new Date(projet.created_at).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const coverImageUrl = getCoverImageUrl(projet.miniature_url);

  return (
    <main className="min-h-screen bg-z-bg text-z-text px-4 py-12 md:py-24 transition-all duration-300">
      <div className="max-w-5xl mx-auto space-y-8">
        
        <Link 
          href="/projet" 
          className="inline-flex items-center space-x-2 text-z-muted hover:text-z-blue text-sm font-medium group transition-colors"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Retour aux projets</span>
        </Link>

        <header className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-z-text">
            {projet.titre}
          </h1>
          
          <div className="flex flex-wrap items-center gap-4 text-xs md:text-sm text-z-muted font-medium">
            <span className="flex items-center space-x-1.5">
              <Calendar className="w-4 h-4 text-z-blue" />
              <time>{dateProjet}</time>
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-z-border" />
            <span className="flex items-center space-x-1.5 bg-z-card px-3 py-1 rounded-full border border-z-border">
              <Film className="w-3.5 h-3.5 text-z-blue" />
              <span>Production Réalisation</span>
            </span>
          </div>
        </header>

        {/* RESTAURATION : Zone Média Principale en plein écran sous l'en-tête */}
        <section className="relative aspect-video w-full overflow-hidden rounded-2xl border border-z-border bg-z-card shadow-2xl group">
          <img
            src={coverImageUrl}
            alt={`Couverture du projet ${projet.titre}`}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-102"
            loading="eager"
          />
          <div className="absolute inset-0 bg-linear-to-t from-z-bg/60 via-transparent to-transparent pointer-events-none" />
        </section>

        {/* RESTAURATION : Grille de contenu originale (Description + Galerie à gauche, Fiche technique à droite) */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4 items-start">
          
          <div className="md:col-span-2 space-y-12">
            {projet.description && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-z-blue uppercase tracking-wider">
                  À propos du projet
                </h2>
                <p className="text-z-text/90 leading-relaxed text-base md:text-lg font-light whitespace-pre-line">
                  {projet.description}
                </p>
              </div>
            )}

            {/* Affiche les sous-projets ou grilles uniquement s'ils existent (comme pour Gabzer & Guigzer) */}
            {sousProjetsTransformes.length > 0 && (
              <ProjectMediaContent 
                sousProjets={sousProjetsTransformes as any} 
                coverImageUrl={coverImageUrl} 
                projectTitle={projet.titre}
              />
            )}
          </div>

          {/* Fiche Technique latérale originale */}
          <div className="p-6 bg-z-card border border-z-border rounded-xl h-fit space-y-4">
            <h3 className="font-bold text-sm uppercase tracking-wider text-z-text">
              Fiche Technique
            </h3>
            <hr className="border-z-border" />
            <div className="space-y-3 text-xs md:text-sm">
              <div className="flex justify-between">
                <span className="text-z-muted">Client</span>
                <span className="font-medium text-z-text">Zenith Production</span>
              </div>
              <div className="flex justify-between">
                <span className="text-z-muted">Format</span>
                <span className="font-medium text-z-text">4K UHD / 2.39:1</span>
              </div>
              <div className="flex justify-between">
                <span className="text-z-muted">Statut</span>
                <span className="text-z-blue font-semibold uppercase text-xs tracking-wide">
                  {projet.en_ligne ? "Disponible" : "Privé"}
                </span>
              </div>
            </div>
          </div>

        </section>

      </div>
    </main>
  );
}