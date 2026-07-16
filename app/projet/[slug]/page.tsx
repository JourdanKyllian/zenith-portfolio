import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Projet } from '@/types';
import ProjectMediaContent from '@/components/ProjectMediaContent';
import { CATEGORY_COLORS, CategoryColorKey } from '@/config/colors';

export const revalidate = 3600;

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const { data } = await supabase
    .from('projet')
    .select('*, categorie(*), sousprojet(*)')
    .eq('slug', slug)
    .single();

  if (!data) return notFound();

  const project = data as unknown as Projet;
  
  const colorKey = (project.categorie?.color as CategoryColorKey) || 'blue';
  const badgeTheme = CATEGORY_COLORS[colorKey] || CATEGORY_COLORS.blue;

  // Logique de traitement des médias et coverImageUrl inchangée ici
  const coverImageUrl = "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1025&auto=format&fit=cover";

  return (
    <main className="min-h-screen bg-z-bg text-z-text pb-20">
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
          
          <span className={`px-3 py-1 rounded border ${badgeTheme.border} ${badgeTheme.bg} ${badgeTheme.text} text-[9px] font-bold uppercase tracking-widest`}>
            {project.categorie?.name || "Général"}
          </span>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-8 py-20 grid grid-cols-1 lg:grid-cols-3 gap-20">
        <div className="lg:col-span-1 space-y-10">
          <div>
            <h3 className="text-z-muted font-sub text-[10px] font-bold uppercase tracking-widest mb-6">L'Artiste</h3>
            <p className="font-body text-z-text/80 leading-relaxed whitespace-pre-wrap">{project.description}</p>
          </div>
        </div>

        <ProjectMediaContent 
          sousProjets={project.sousprojet as any} 
          coverImageUrl={coverImageUrl}
          projectTitle={project.titre} 
        />
      </section>
    </main>
  );
}