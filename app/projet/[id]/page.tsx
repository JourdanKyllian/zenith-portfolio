// app/projet/[id]/page.tsx

import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import { ArrowLeft, ExternalLink, Film } from 'lucide-react';
import Link from 'next/link';
import Navbar from '../../../components/Navbar';
import { Projet } from '@/types';

// Convertit n'importe quel lien YouTube standard en lien d'intégration propre pour Iframe
function formatYoutubeEmbed(url: string | null): string {
  if (!url) return '';
  let videoId = '';
  if (url.includes('youtu.be/')) videoId = url.split('youtu.be/')[1]?.split(/[?#]/)[0];
  else if (url.includes('v=')) videoId = url.split('v=')[1]?.split('&')[0];
  return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
}

function getYoutubeId(url: string | null): string | null {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

export default async function ProjectPage({ params }: { params: { id: string } }) {
  const { data: project } = await supabase
    .from('projet')
    .select('*, categorie(*), sousprojet(*)')
    .eq('id', params.id)
    .single();

  if (!project) return notFound();

  const typedProject = project as unknown as Projet;
  const listClips = typedProject.sousprojet || [];

  // Image de fond du Hero basée sur la première vidéo disponible
  const firstVideoId = getYoutubeId(listClips[0]?.youtube_url);
  const heroBgImage = firstVideoId 
    ? `https://img.youtube.com/vi/${firstVideoId}/maxresdefault.jpg`
    : "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1025&auto=format&fit=cover";

  return (
    <main className="min-h-screen bg-z-bg text-z-text pb-20">
      <Navbar />
      
      {/* Grand Hero Header */}
      <section className="relative h-[55vh] w-full overflow-hidden">
        <img src={heroBgImage} alt={typedProject.titre} className="w-full h-full object-cover opacity-20 blur-xs" />
        <div className="absolute inset-0 bg-linear-to-t from-z-bg to-transparent" />
        <div className="absolute bottom-0 left-0 w-full p-8 sm:p-16 max-w-7xl mx-auto">
          <Link href="/projet" className="flex items-center gap-2 text-z-blue text-[10px] font-bold uppercase tracking-widest mb-6 hover:translate-x-2 transition-transform">
            <ArrowLeft size={14} /> Retour à la galerie
          </Link>
          <h1 className="font-display font-bold text-4xl sm:text-7xl uppercase tracking-tighter leading-none mb-4">
            {typedProject.titre}
          </h1>
          <span className="px-3 py-1 rounded border border-z-blue/30 bg-z-blue/10 text-z-blue text-[9px] font-bold uppercase tracking-widest">
            {typedProject.categorie?.name || "Général"}
          </span>
        </div>
      </section>

      {/* Description Contextuelle */}
      <section className="max-w-6xl mx-auto px-8 pt-12 pb-6 border-b border-z-blue/10">
        <h3 className="text-z-muted font-sub text-[10px] font-bold uppercase tracking-widest mb-3">À propos du projet</h3>
        <p className="font-body text-z-text/80 leading-relaxed max-w-3xl">{typedProject.description}</p>
      </section>

      {/* Parcours des Sous-projets (Master-Detail) */}
      <section className="max-w-6xl mx-auto px-8 py-16 space-y-28">
        {listClips.length > 0 ? (
          listClips.map((clip, index) => (
            <div key={clip.id} className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
              
              {/* Descriptif du Bloc de Réalisation */}
              <div className="lg:col-span-1 lg:sticky lg:top-28 space-y-4">
                <div className="flex items-center gap-2 text-z-blue font-sub text-[10px] font-bold uppercase tracking-widest">
                  <Film size={12} />
                  <span>Réalisation #{index + 1}</span>
                </div>
                <h2 className="font-display font-bold text-2xl uppercase tracking-tight text-z-text">
                  {clip.titre}
                </h2>
                {clip.description && (
                  <p className="font-body text-xs sm:text-sm text-z-muted leading-relaxed">
                    {clip.description}
                  </p>
                )}
                
                {clip.drive_folder_id && (
                  <div className="pt-2">
                    <a 
                      href={`https://drive.google.com/drive/folders/${clip.drive_folder_id}`} 
                      target="_blank" 
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-z-silver hover:text-z-blue transition-colors text-[10px] font-bold uppercase tracking-wider"
                    >
                      <ExternalLink size={14} /> Dossier de rendus (Drive)
                    </a>
                  </div>
                )}
              </div>

              {/* Conteneur Vidéo */}
              <div className="lg:col-span-2">
                {clip.youtube_url ? (
                  <div className="aspect-video bg-z-card rounded-2xl overflow-hidden border border-z-blue/10 shadow-2xl">
                    <iframe 
                      width="100%" height="100%" 
                      src={formatYoutubeEmbed(clip.youtube_url)} 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen 
                      className="w-full h-full"
                    />
                  </div>
                ) : (
                  <div className="aspect-video bg-z-card rounded-2xl flex items-center justify-center border border-dashed border-z-blue/10 text-z-muted text-xs font-body">
                    Aperçu vidéo indisponible
                  </div>
                )}
              </div>

            </div>
          ))
        ) : (
          <div className="text-center py-16 text-z-muted font-body text-sm">
            Aucun sous-projet n'est lié à cette fiche pour l'instant.
          </div>
        )}
      </section>
    </main>
  );
}