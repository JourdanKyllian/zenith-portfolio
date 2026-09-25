import { supabase } from '@/lib/supabase';
import Hero from '../components/Hero';
import Link from 'next/link';
import { Projet } from '@/types';

export const revalidate = 3600;

// Utilitaire pour extraire l'ID YouTube si pas d'image Drive
function getYoutubeId(url: string | null | undefined): string | null {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

export default async function Home() {
  // On récupère une sélection de 8 projets maximum pour alimenter la pellicule
  const { data: recentProjects } = await supabase
    .from('projet') 
    .select('*, categorie(*), sousprojet(*)')
    .eq('en_ligne', true)
    .eq('user_id', process.env.NEXT_PUBLIC_PORTFOLIO_USER_ID)
    .order('created_at', { ascending: false })
    .limit(8);

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

  // Extraction intelligente des images pour la pellicule
  const marqueeImages = (recentProjects as unknown as Projet[])?.map(p => {
    if (p.miniature_url) return p.miniature_url;
    const premierSousProjet = p.sousprojet?.sort((a, b) => a.ordre - b.ordre)?.[0];
    const youtubeId = getYoutubeId(premierSousProjet?.youtube_url);
    if (youtubeId) return `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;
    return null;
  }).filter((url): url is string => url !== null && url.trim() !== '') || [];

  return (
    <main className="min-h-screen bg-z-bg overflow-x-hidden flex flex-col">
      <Hero 
        categoriesCount={categoriesCount || 0} 
        yearsOfExperience={yearsOfExperience} 
        marqueeImages={marqueeImages}
      />

      <section className="py-32 lg:py-48 bg-linear-to-b from-z-bg to-[#08080c] text-center px-6 relative overflow-hidden grow flex flex-col justify-center">
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
