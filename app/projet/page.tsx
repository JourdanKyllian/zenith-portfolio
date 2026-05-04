import { supabase } from '@/lib/supabase';
import GalleryClient from './GalleryClient';
import { Projet } from '@/types';

export default async function GalleryPage() {
  const { data: projets, error } = await supabase
    .from('projet')
    .select('*, categorie(*)')
    .eq('en_ligne', true)
    .order('created_at', { ascending: false });

  if (error) {
    return (
      <div className="pt-40 text-center text-z-muted">
        Erreur de chargement des projets.
      </div>
    );
  }

  // Cast pour s'assurer que le typage est correct avec la jointure categorie
  return <GalleryClient initialProjets={projets as unknown as Projet[]} />;
}