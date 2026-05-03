import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import { ArrowLeft, ExternalLink, PlayCircle } from 'lucide-react';
import Link from 'next/link';
import Navbar from '../../../components/Navbar';

export default async function ProjectPage({ params }: { params: { id: string } }) {
  const { data: project } = await supabase
    .from('projets')
    .select('*, categories(*)')
    .eq('id', params.id)
    .single();

  if (!project) return notFound();

  return (
    <main className="min-h-screen bg-z-bg text-z-text pb-20">
      <Navbar />
      
      {/* Hero du projet */}
      <section className="relative h-[60vh] w-full overflow-hidden">
        <img src={project.image_url} alt={project.titre} className="w-full h-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-linear-to-t from-z-bg to-transparent" />
        <div className="absolute bottom-0 left-0 w-full p-8 sm:p-16 max-w-7xl mx-auto">
          <Link href="/projets" className="flex items-center gap-2 text-z-blue text-[10px] font-bold uppercase tracking-widest mb-6 hover:translate-x-2 transition-transform">
            <ArrowLeft size={14} /> Retour à la galerie
          </Link>
          <h1 className="font-display font-bold text-5xl sm:text-8xl uppercase tracking-tighter leading-none mb-4">{project.titre}</h1>
          <span className="px-3 py-1 rounded border border-z-blue/30 bg-z-blue/10 text-z-blue text-[9px] font-bold uppercase tracking-widest">
            {project.categories.nom}
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
            {project.youtube_url && (
              <a href={project.youtube_url} target="_blank" className="btn-blue p-4 rounded-lg flex items-center justify-center gap-3 text-[10px] font-bold uppercase tracking-widest">
                <PlayCircle size={18} /> Regarder la vidéo
              </a>
            )}
          </div>
        </div>

        <div className="lg:col-span-2">
          {project.youtube_url ? (
            <div className="aspect-video bg-z-card rounded-2xl overflow-hidden border border-z-blue/10 shadow-2xl">
              <iframe 
                width="100%" height="100%" 
                src={project.youtube_url.replace("watch?v=", "embed/")} 
                frameBorder="0" allowFullScreen 
              />
            </div>
          ) : (
            <img src={project.image_url} className="w-full rounded-2xl border border-z-blue/10" alt="Cover" />
          )}
        </div>
      </section>
    </main>
  );
}