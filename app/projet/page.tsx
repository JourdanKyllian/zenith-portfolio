import { supabase } from '@/lib/supabase';
import GalleryClient from './GalleryClient';
import { Projet, Categorie } from '@/types';

export default async function GalleryPage() {
  // 1. On récupère les projets en ligne
  const { data: projets, error: projetsError } = await supabase
    .from('projet') // Mets 'projets' si ta table est au pluriel
    .select('*, categorie(*), sousprojet(*)')
    .eq('en_ligne', true)
    .order('created_at', { ascending: false });

  // 2. On récupère TOUTES les catégories séparément
  const { data: categories, error: catError } = await supabase
    .from('categorie') // Mets 'categories' si ta table est au pluriel
    .select('*');

  if (projetsError || catError) {
    return (
      <div className="pt-40 text-center text-z-muted font-body">
        Erreur lors du chargement de la galerie.
      </div>
    );
  }

  return (
    <GalleryClient 
      initialProjets={projets as unknown as Projet[]} 
      toutesLesCategories={categories as Categorie[]} 
    />
  );
}