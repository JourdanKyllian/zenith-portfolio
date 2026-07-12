import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import { ArrowLeft, PlayCircle } from 'lucide-react';
import Link from 'next/link';
import Navbar from '../../../components/Navbar';
import { getProjectAssetsFromDrive } from '@/lib/googleDrive';

export default async function ProjectPage({ params }: { params: { id: string } }) {
  // 1. On récupère le projet, sa catégorie, et ses sous-projets associés
  const { data: project } = await supabase
    .from('projet')
    .select('*, categorie(*), sousprojet(*)')
    .eq('id', params.id)
    .single();

  if (!project) return notFound();

  // 2. On isole le premier sous-projet qui contient nos médias
  const premierSousProjet = project.sousprojet?.[0];

  // 3. On récupère dynamiquement les rendus et la vidéo depuis l'URL Drive du SOUS-PROJET
  const driveAssets = premierSousProjet?.drive_url 
    ? await getProjectAssetsFromDrive(premierSousProjet.drive_url)
    : { images: [], youtubeUrl: null };

  // 4. Variables de secours : on regarde dans le Drive, sinon on prend le lien du SOUS-PROJET
  const finalYoutubeUrl = driveAssets.youtubeUrl || premierSousProjet?.youtube_url;
  const hasDriveImages = driveAssets.images.length > 0;

  return (
    <main className="min-h-screen bg-z-bg text-z-text pb-20">
      <Navbar />
      
      {/* Hero du projet */}
      <section className="relative h-[60vh] w-full overflow-hidden">
        <img src={project.image_url} alt={project.titre} className="w-full h-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-linear-to-t from-z-bg to-transparent" />
        <div className="absolute bottom-0 left-0 w-full p-8 sm:p-16 max-w-7xl mx-auto">
          <Link href="/projet" className="flex items-center gap-2 text-z-blue text-[13px] font-bold uppercase tracking-widest mb-6 hover:translate-x-2 transition-transform">
            <ArrowLeft size={14} /> Retour à la galerie
          </Link>
          <h1 className="font-display font-bold text-5xl sm:text-8xl uppercase tracking-tighter leading-none mb-4">{project.titre}</h1>
          <span className="px-3 py-1 rounded border border-z-blue/30 bg-z-blue/10 text-z-blue text-[9px] font-bold uppercase tracking-widest">
            {project.categorie?.name || "Général"}
          </span>
        </div>
      </section>

      {/* Contenu */}
      <section className="max-w-7xl mx-auto px-8 py-20 grid grid-cols-1 lg:grid-cols-3 gap-20">
        <div className="lg:col-span-1 space-y-10">
          <div>
            <h3 className="text-z-muted font-sub text-[10px] font-bold uppercase tracking-widest mb-6">Le Projet</h3>
            <p className="font-body text-z-text/80 leading-relaxed">{project.description}</p>
          </div>
          
          <div className="flex flex-col gap-4">
            {finalYoutubeUrl && (
              <a href={finalYoutubeUrl} target="_blank" rel="noopener noreferrer" className="btn-blue p-4 rounded-lg flex items-center justify-center gap-3 text-[10px] font-bold uppercase tracking-widest">
                <PlayCircle size={18} /> Regarder la vidéo
              </a>
            )}
          </div>
        </div>

        {/* Colonne Droite : Médias dynamiques */}
        <div className="lg:col-span-2 space-y-8">
          {/* Lecteur Vidéo principal si présent */}
          {finalYoutubeUrl && (
            <div className="aspect-video bg-z-card rounded-2xl overflow-hidden border border-z-blue/10 shadow-2xl">
              <iframe 
                width="100%" height="100%" 
                src={finalYoutubeUrl.replace("watch?v=", "embed/").replace("youtu.be/", "youtube.com/embed/")} 
                frameBorder="0" allowFullScreen 
              />
            </div>
          )}

          {/* Grille d'images chargées depuis Google Drive */}
          {hasDriveImages ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {driveAssets.images.map((imgUrl: string, index: number) => (
                <div key={index} className="aspect-video rounded-2xl overflow-hidden border border-z-blue/10 bg-z-card hover:border-z-blue/40 transition-all duration-300 shadow-md">
                  <img src={imgUrl} className="w-full h-full object-cover" alt={`Rendu ${index + 1}`} />
                </div>
              ))}
            </div>
          ) : (
            /* Image de couverture classique si le Drive n'a pas d'images ou n'est pas configuré */
            !finalYoutubeUrl && <img src={project.image_url} className="w-full rounded-2xl border border-z-blue/10" alt="Cover" />
          )}
        </div>
      </section>
    </main>
  );
}