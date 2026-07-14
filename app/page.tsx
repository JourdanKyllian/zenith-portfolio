// app/page.tsx
import { supabase } from '@/lib/supabase';
import Hero from '../components/Hero';
import ProjectCard from '../components/ProjectCard';
import Link from 'next/link';
import { Projet } from '@/types';

export default async function Home() {
  // Récupère les 3 derniers projets en ligne
  const { data: highlights } = await supabase
    .from('projet') 
    .select('*, categorie(*), sousprojet(*)')
    .eq('en_ligne', true)
    .order('created_at', { ascending: false })
    .limit(3);

  // Récupère dynamiquement le nombre total de catégories (Univers)
  const { count: categoriesCount } = await supabase
    .from('categorie')
    .select('*', { count: 'exact', head: true });

  // Calcul dynamique de l'expérience côté SERVEUR (Date de départ : 1er Septembre 2017)
  const startDate = new Date("2017-09-01");
  const today = new Date();
  
  let yearsOfExperience = today.getFullYear() - startDate.getFullYear();
  const monthDiff = today.getMonth() - startDate.getMonth();
  
  // Si on n'est pas encore en septembre, ou qu'on est en septembre mais avant le 1er
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < startDate.getDate())) {
    yearsOfExperience--;
  }

  return (
    <main className="min-h-screen bg-z-bg overflow-x-hidden">
      {/* On transmet les deux valeurs calculées au Hero */}
      <Hero 
        categoriesCount={categoriesCount || 0} 
        yearsOfExperience={yearsOfExperience} 
      />

      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-xl">
            <span className="font-sub text-z-blue text-[10px] font-bold uppercase tracking-[0.4em] mb-4 block">Sélection</span>
            <h2 className="font-display font-bold text-4xl sm:text-6xl text-z-text uppercase tracking-tighter leading-none">
              Dernières <span className="text-glow">Créations</span>
            </h2>
          </div>
          
          <Link href="/projet" className="group flex items-center gap-4 font-sub text-[11px] font-bold uppercase tracking-[0.2em] text-z-muted hover:text-z-blue transition-all">
            Explorer toute la galerie
            <div className="w-12 h-12 rounded-full border border-z-blue/20 flex items-center justify-center group-hover:bg-z-blue/10 group-hover:border-z-blue transition-all">
              <span className="text-xl">→</span>
            </div>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {highlights?.map((p) => (
            <ProjectCard key={p.id} project={p as unknown as Projet} />
          ))}
        </div>
      </section>

      <section className="py-48 bg-linear-to-b from-z-bg to-[#08080c] text-center px-6 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-125 bg-z-blue/5 blur-[120px] pointer-events-none" />
        <div className="max-w-3xl mx-auto relative z-10">
          <span className="font-sub text-z-blue text-[10px] font-bold uppercase tracking-[0.5em] mb-8 block">Collaborons</span>
          <h2 className="font-display font-bold text-4xl sm:text-7xl text-z-text uppercase mb-10 tracking-tighter leading-[0.9]">
            Là où vos messages <br/>
            <span className="text-glow">prennent de la hauteur</span>
          </h2>
          <Link href="/contact" className="btn-blue px-12 py-5 rounded-xl text-[11px] font-bold uppercase tracking-[0.2em] inline-block hover:scale-105 transition-all shadow-2xl shadow-z-blue/20">
            Prenez votre envol
          </Link>
        </div>
      </section>

    </main>
  );
}