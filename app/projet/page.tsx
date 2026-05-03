import { supabase } from '@/lib/supabase';
import GalleryClient from './GalleryClient';
import { Project } from '@/types';

export default async function GalleryPage() {
  const { data: projects, error } = await supabase
    .from('projets')
    .select('*, categories(*)')
    .eq('en_ligne', true)
    .order('created_at', { ascending: false });

  if (error) {
    return <div className="pt-40 text-center text-z-muted">Erreur de connexion à la base de données.</div>;
  }

  return <GalleryClient initialProjects={projects as unknown as Project[]} />;
}