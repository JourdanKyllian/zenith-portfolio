import { supabase } from '@/lib/supabase';
import GalleryClient from './GalleryClient';
import { Metadata } from 'next';
import { CategorieSummary, ProjetSummary } from '@/types';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'La Galerie | ZENITH PRODUCTION',
  description:
    'Explorez les univers artistiques et l’ensemble des projets de Zenith Production : clips, vidéos, et créations graphiques.',
};

function truncateDescriptionExcerpt(html: string | null, maxLength = 220): string | null {
  if (!html) return null;
  const plainText = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  if (!plainText) return null;
  if (plainText.length <= maxLength) return plainText;
  return `${plainText.slice(0, maxLength).trimEnd()}…`;
}

/**
 * Point d'entrée serveur (RSC) de l'index des projets.
 * Utilise le cache ISR (revalidate = 3600, purgé par l'admin) et une réponse partielle
 * (uniquement les champs nécessaires aux cartes) exécutée en parallèle,
 * permettant une pagination, une recherche et un tri instantanés (0 ms) côté client.
 */
export default async function GalleryPage() {
  const userId = process.env.NEXT_PUBLIC_PORTFOLIO_USER_ID;

  const [{ data: projetsData }, { data: categoriesData }] = await Promise.all([
    supabase
      .from('projet')
      .select(
        'id, titre, slug, description, miniature_url, created_at, categorie:categorie_id(id, name, slug, color), sousprojet(youtube_url, drive_url, ordre)'
      )
      .eq('en_ligne', true)
      .eq('user_id', userId)
      .order('created_at', { ascending: false }),
    supabase
      .from('categorie')
      .select('id, name, slug, color')
      .eq('user_id', userId),
  ]);

  const categories = (categoriesData as CategorieSummary[] | null) || [];
  const rawProjets = (projetsData as unknown as ProjetSummary[] | null) || [];

  const projets: ProjetSummary[] = rawProjets.map((p) => ({
    ...p,
    description: truncateDescriptionExcerpt(p.description),
    sousprojet: p.sousprojet?.slice().sort((a, b) => a.ordre - b.ordre),
  }));

  return <GalleryClient projets={projets} categories={categories} />;
}
