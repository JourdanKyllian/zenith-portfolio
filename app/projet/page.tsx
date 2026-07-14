import { supabase } from '@/lib/supabase';
import GalleryClient from './GalleryClient';
import { Metadata } from 'next';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'La Galerie | ZENITH PRODUCTION',
  description: 'Explorez les univers artistiques et l’ensemble des projets de Zenith Production : clips, vidéos, et créations graphiques.',
};

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