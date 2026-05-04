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
    console.error("Détails de l'erreur Supabase :", error.message, error.hint);
    
    return (
      <div className="pt-40 text-center text-z-muted">
        Erreur : {error.message} (Vérifie ton terminal)
      </div>
    );
  }

  return <GalleryClient initialProjets={projets as unknown as Projet[]} />;
}