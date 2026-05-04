import { supabase } from '@/lib/supabase';
import GalleryClient from './GalleryClient';
import { Projet } from '@/types'; // Assure-toi que c'est le bon chemin

export default async function GalleryPage() {
  const { data: projets, error } = await supabase
    .from('projet')            // Nom de l'onglet 1 : projet
    .select('*, categorie(*)') // Nom de l'onglet 2 : categorie
    .eq('en_ligne', true)
    .order('created_at', { ascending: false });

  if (error) {
    // Regarde ton TERMINAL VS Code pour voir le message ici :
    console.error("Détails de l'erreur Supabase :", error.message, error.hint);
    
    return (
      <div className="pt-40 text-center text-z-muted">
        Erreur : {error.message} (Vérifie ton terminal)
      </div>
    );
  }

  return <GalleryClient initialProjets={projets as unknown as Projet[]} />;
}