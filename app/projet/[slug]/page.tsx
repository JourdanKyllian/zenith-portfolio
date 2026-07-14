import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import { ArrowLeft, PlayCircle } from 'lucide-react';
import Link from 'next/link';
import { getProjectAssetsFromDrive, DriveAssets } from '@/lib/googleDrive';
import { SousProjet, Projet } from '@/types';
import PdfPreview from '@/components/PdfPreview';

export const revalidate = 3600;

// GÉNÉRATION DYNAMIQUE DES MÉTADONNÉES SEO (TITRE — CATÉGORIE)
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const { data } = await supabase
    .from('projet')
    .select('*, categorie(*)')
    .eq('slug', slug)
    .single();

  if (!data) {
    return {
      title: 'Projet — ZENITH PRODUCTION',
    };
  }

  const project = data as unknown as Projet;
  const categoryName = project.categorie?.name || 'Général';

  return {
    title: `${project.titre} — ${categoryName} | ZENITH PRODUCTION`,
  };
}

function getDriveFileId(urlOrId: string | null | undefined): string | null {
  if (!urlOrId) return null;
  if (!urlOrId.includes('/')) return urlOrId;
  
  const fileDMatch = urlOrId.match(/\/d\/([a-zA-Z0-9-_]+)/);
  if (fileDMatch) return fileDMatch[1];
  
  const idParamMatch = urlOrId.match(/id=([a-zA-Z0-9-_]+)/);
  if (idParamMatch) return idParamMatch[1];
  
  return null;
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const { data } = await supabase
    .from('projet')
    .select('*, categorie(*), sousprojet(*)')
    .eq('slug', slug)
    .single();

  if (!data) return notFound();

  const project = data as unknown as Projet;

  const sousProjets: SousProjet[] = (project.sousprojet || [])
    .sort((a: SousProjet, b: SousProjet) => (a.ordre || 0) - (b.ordre || 0));

  const sousProjetsAvecMedias = await Promise.all(
    sousProjets.map(async (sp) => {
      const driveAssets: DriveAssets = sp.drive_url 
        ? await getProjectAssetsFromDrive(sp.drive_url)
        : { images: [], youtubeUrl: null, pdf: null };
      
      return {
        ...sp,
        finalYoutubeUrl: driveAssets.youtubeUrl || sp.youtube_url,
        driveImages: driveAssets.images,
        pdf: driveAssets.pdf
      };
    })
  );

  const hasAnyVideo = sousProjetsAvecMedias.some(sp => sp.finalYoutubeUrl);

  const miniatureUrl = project.miniature_url;
  let coverImageUrl = "";

  if (miniatureUrl) {
    if (miniatureUrl.startsWith('http') && !miniatureUrl.includes('drive.google.com')) {
      coverImageUrl = miniatureUrl;
    } else {
      const driveImageId = getDriveFileId(miniatureUrl);
      coverImageUrl = driveImageId 
        ? `https://drive.google.com/thumbnail?id=${driveImageId}&sz=w1600`
        : miniatureUrl;
    }
  } else {
    coverImageUrl = "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1025&auto=format&fit=cover";
  }

  return (
    <main className="min-h-screen bg-z-bg text-z-text pb-20">
      
      {/* Hero */}
      <section className="relative h-[60vh] w-full overflow-hidden">
        <img 
          src={coverImageUrl} 
          alt={project.titre} 
          className="w-full h-full object-cover opacity-30" 
          loading="eager"
        />
        <div className="absolute inset-0 bg-linear-to-t from-z-bg to-transparent" />
        <div className="absolute bottom-0 left-0 w-full p-8 sm:p-16 max-w-7xl mx-auto">
          <Link href="/projet" className="flex items-center gap-2 text-z-blue text-[13px] font-bold uppercase tracking-widest mb-6 hover:translate-x-2 transition-transform">
            <ArrowLeft size={14} /> Retour à la galerie
          </Link>
          <h1 className="font-display font-bold text-5xl sm:text-8xl uppercase tracking-tighter leading-none mb-4">
            {project.titre}
          </h1>
          <span className="px-3 py-1 rounded border border-z-blue/30 bg-z-blue/10 text-z-blue text-[9px] font-bold uppercase tracking-widest">
            {project.categorie?.name || "Général"}
          </span>
        </div>
      </section>

      {/* Contenu */}
      <section className="max-w-7xl mx-auto px-8 py-20 grid grid-cols-1 lg:grid-cols-3 gap-20">
        
        {/* Colonne Gauche */}
        <div className="lg:col-span-1 space-y-10">
          <div>
            <h3 className="text-z-muted font-sub text-[10px] font-bold uppercase tracking-widest mb-6">{"L'Artiste"}</h3>
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

        {/* Colonne Droite */}
        <div className="lg:col-span-2 space-y-16">
          {sousProjetsAvecMedias.length > 0 ? (
            sousProjetsAvecMedias.map((sp, index) => {
              const hasMedia = sp.finalYoutubeUrl || sp.driveImages.length > 0 || sp.pdf;

              return (
                <div key={sp.id || index} className="space-y-8 animate-fade-up">
                  
                  {(sp.titre || sp.description) && (
                    <div className="border-l-2 border-z-blue/50 pl-4 py-1">
                      {sp.titre && <h4 className="font-display text-2xl uppercase font-bold text-z-text">{sp.titre}</h4>}
                      {sp.description && (
                        <p className={`font-body text-z-muted mt-2 ${hasMedia ? 'text-sm' : 'text-base leading-relaxed text-z-text/90'}`}>
                          {sp.description}
                        </p>
                      )}
                    </div>
                  )}

                  {sp.finalYoutubeUrl && (
                    <div className="aspect-video bg-z-card rounded-2xl overflow-hidden border border-z-blue/10 shadow-2xl">
                      <iframe 
                        width="100%" height="100%" 
                        src={sp.finalYoutubeUrl.replace("watch?v=", "embed/").replace("youtu.be/", "youtube.com/embed/")} 
                        frameBorder="0" allowFullScreen 
                      />
                    </div>
                  )}

                  {(sp.driveImages.length > 0 || sp.pdf) && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {sp.pdf && <PdfPreview pdf={sp.pdf} />}

                      {sp.driveImages.map((imgUrl: string, imgIndex: number) => (
                        <div key={imgIndex} className="aspect-video rounded-2xl overflow-hidden border border-z-blue/10 bg-z-card hover:border-z-blue/40 transition-all duration-300 shadow-md">
                          <img 
                            src={imgUrl} 
                            className="w-full h-full object-cover" 
                            alt={`Rendu ${imgIndex + 1}`} 
                            loading="lazy" 
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <img src={coverImageUrl} className="w-full rounded-2xl border border-z-blue/10" alt="Cover" />
          )}
        </div>
      </section>
    </main>
  );
}