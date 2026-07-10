// app/projet/page.tsx

import { supabase } from '@/lib/supabase';
import GalleryClient from './GalleryClient';
import { Projet } from '@/types';

export default async function GalleryPage() {
  const { data: projets, error } = await supabase
    .from('projet')
    .select('*, categorie(*), sousprojet(*)')
    .eq('en_ligne', true)
    .order('created_at', { ascending: false });

  if (error) {
    return (
      <div className="pt-40 text-center text-z-muted font-body">
        Erreur lors du chargement de la galerie.
      </div>
    );
  }

  return <GalleryClient initialProjets={projets as unknown as Projet[]} />;
}