import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { ArrowLeft, Film, Calendar } from 'lucide-react';
import ProjectMediaContent from '@/components/ProjectMediaContent';
import { getProjectAssetsFromDrive } from '@/lib/googleDrive';

export const revalidate = 3600;

interface Projet {
  id: number;
  created_at: string;
  titre: string;
  description: string;
  en_ligne: boolean;
  categorie_id: number;
  miniature_url: string;
  slug: string;
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
 * Hydrate les données du projet via Supabase et agrège les médias distants via Google Drive API.
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

  const projet = dataProjet as Projet & { sousprojet: any[] };

  // Agrégation asynchrone des sources médias (Drive & YouTube) pour les sous-projets
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

        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
          
          <ProjectMediaContent 
            sousProjets={sousProjetsTransformes} 
            coverImageUrl={projet.miniature_url} 
            projectTitle={projet.titre}
          />

          <div className="md:col-span-1 p-6 bg-z-card border border-z-border rounded-xl h-fit space-y-4">
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