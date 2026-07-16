import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { ArrowLeft, Film, Calendar } from 'lucide-react';

// Conserve ton comportement ISR : Revalidation toutes les heures
export const revalidate = 3600;

// Interface TypeScript stricte alignée avec ta table Supabase
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
 * 1. GÉNÉRATION DES PARAMÈTRES STATIQUES (generateStaticParams)
 * Permet à Next.js de compiler toutes les pages au moment du build.
 * Résultat : Ouverture instantanée (0ms) pour l'utilisateur au clic.
 */
export async function generateStaticParams() {
  const { data: projets, error } = await supabase
    .from('projet')
    .select('slug');

  if (error || !projets) {
    console.error(' [StaticParams] Erreur de récupération des slugs:', error);
    return [];
  }

  return projets.map((projet: { slug: string }) => ({
    slug: projet.slug,
  }));
}

/**
 * 2. COMPOSANT PAGE PRINCIPAL
 * Note : Conforme à Next.js 16, 'params' est traité comme une Promise.
 */
export default async function ProjetUniquePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // Règle Next.js 16 absolue : On DOIT await les params avant d'extraire le slug
  const { slug } = await params;

  // Récupération des données du projet actuel
  const { data: dataProjet, error } = await supabase
    .from('projet')
    .select('*')
    .eq('slug', slug)
    .single();

  // Redirection automatique vers la page 404 du framework si le slug n'existe pas
  if (error || !dataProjet) {
    notFound();
  }

  const projet = dataProjet as Projet;

  // Formater la date proprement (Ex: 11 juillet 2026)
  const dateProjet = new Date(projet.created_at).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <main className="min-h-screen bg-z-bg text-z-text px-4 py-12 md:py-24 transition-all duration-300">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Bouton Retour avec jetons de couleur de ta charte */}
        <Link 
          href="/projet" 
          className="inline-flex items-center space-x-2 text-z-muted hover:text-z-blue text-sm font-medium group transition-colors"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Retour aux projets</span>
        </Link>

        {/* En-tête du Projet */}
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

        {/* Zone Média Principale (Utilisation de la balise img autorisée par ton ESLint) */}
        <section className="relative aspect-video w-full overflow-hidden rounded-2xl border border-z-border bg-z-card shadow-2xl group">
          <img
            src={projet.miniature_url}
            alt={`Couverture du projet ${projet.titre}`}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-102"
            loading="eager"
          />
          {/* Overlay cinématique diffus en arrière-plan */}
          <div className="absolute inset-0 bg-linear-to-t from-z-bg/60 via-transparent to-transparent pointer-events-none" />
        </section>

        {/* Section Descriptif */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
          <div className="md:col-span-2 space-y-4">
            <h2 className="text-xl font-bold text-z-blue uppercase tracking-wider">
              À propos du projet
            </h2>
            <p className="text-z-text/90 leading-relaxed text-base md:text-lg font-light whitespace-pre-line">
              {projet.description}
            </p>
          </div>

          {/* En-encadré Infos Complémentaires / Sidebar de droite */}
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