import { supabase } from '@/lib/supabase';
import GalleryClient from './GalleryClient';
import { Metadata } from 'next';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'La Galerie | ZENITH PRODUCTION',
  description: 'Explorez les univers artistiques et l’ensemble des projets de Zenith Production : clips, vidéos, et créations graphiques.',
};

/**
 * Server Component : Point d'entrée de la galerie des projets.
 * Pré-charge l'intégralité des projets actifs et de leurs relations depuis Supabase
 * avant de les transmettre au composant client responsable du filtrage.
 */
export default async function GalleryPage() {
  const { data: projets } = await supabase
    .from('projet')
    .select('*, categorie(*), sousprojet(*)')
    .eq('en_ligne', true)
    // --- BOUCLIER MULTI-TENANT ---
    .eq('user_id', process.env.NEXT_PUBLIC_PORTFOLIO_USER_ID)
    .order('created_at', { ascending: false });

  const { data: categories } = await supabase
    .from('categorie')
    .select('*')
    // --- BOUCLIER MULTI-TENANT ---
    .eq('user_id', process.env.NEXT_PUBLIC_PORTFOLIO_USER_ID);
    
  return (
    <GalleryClient 
      initialProjets={projets || []} 
      toutesLesCategories={categories || []} 
    />
  );
}
