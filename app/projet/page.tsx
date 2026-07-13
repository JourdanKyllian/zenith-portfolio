// app/projet/page.tsx (Serveur)
import { supabase } from '@/lib/supabase';
import GalleryClient from './GalleryClient';

export default async function GalleryPage() {
  // L'appel se fait pendant le rendu serveur
  const { data: projets } = await supabase
    .from('projet')
    .select('*, categorie(*), sousprojet(*)')
    .eq('en_ligne', true)
    .order('created_at', { ascending: false });

  const { data: categories } = await supabase
    .from('categorie')
    .select('*');
    
  return (
    <GalleryClient 
      initialProjets={projets || []} 
      toutesLesCategories={categories || []} 
    />
  );
}