import { supabase } from '@/lib/supabase';
import Hero from '../components/Hero';
import Link from 'next/link';
import { Projet } from '@/types';

export const revalidate = 3600;

export default async function Home() {
  // On récupère uniquement les 10 derniers projets pour alimenter la pellicule (Marquee)
  const { data: recentProjects } = await supabase
    .from('projet') 
    .select('miniature_url')
    .eq('en_ligne', true)
    .eq('user_id', process.env.NEXT_PUBLIC_PORTFOLIO_USER_ID)
    .order('created_at', { ascending: false })
    .limit(6);

  const { count: categoriesCount } = await supabase
    .from('categorie')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', process.env.NEXT_PUBLIC_PORTFOLIO_USER_ID);

  const startDate = new Date("2017-09-01");
  const today = new Date();
  
  let yearsOfExperience = today.getFullYear() - startDate.getFullYear();
  const monthDiff = today.getMonth() - startDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < startDate.getDate())) {
    yearsOfExperience--;
  }

  // Extraction propre des URLs pour le composant client
  const marqueeImages = (recentProjects as { miniature_url: string | null }[])
    ?.map(p => p.miniature_url)
    .filter((url): url is string => url !== null && url.trim() !== '') || [];

  return (
    <main className="min-h-screen bg-z-bg overflow-x-hidden">
      {/* On passe nos images au Hero pour générer le Marquee */}
      <Hero 
        categoriesCount={categoriesCount || 0} 
        yearsOfExperience={yearsOfExperience} 
        marqueeImages={marqueeImages}
      />

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
