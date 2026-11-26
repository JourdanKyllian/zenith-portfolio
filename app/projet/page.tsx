import { supabase } from '@/lib/supabase';
import GalleryClient from './GalleryClient';
import { Metadata } from 'next';
import { CategorieSummary, ProjetSummary } from '@/types';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'La Galerie | ZENITH PRODUCTION',
  description:
    'Explorez les univers artistiques et l’ensemble des projets de Zenith Production : clips, vidéos, et créations graphiques.',
};

const PAGE_SIZE = 9;

export type GallerySort = 'recent' | 'oldest' | 'az';

function truncateDescriptionExcerpt(html: string | null, maxLength = 220): string | null {
  if (!html) return null;
  const plainText = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  if (!plainText) return null;
  if (plainText.length <= maxLength) return plainText;
  return `${plainText.slice(0, maxLength).trimEnd()}…`;
}

/**
 * Point d'entrée serveur (RSC) de l'index des projets.
 * Applique une réponse partielle (uniquement les champs requis par les cartes),
 * la pagination SQL (.range), la recherche par titre et le tri côté serveur.
 */
export default async function GalleryPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; category?: string; q?: string; sort?: string }>;
}) {
  const params = await searchParams;
  const requestedPage = Number.parseInt(params.page || '1', 10);
  const currentPage = Number.isFinite(requestedPage) && requestedPage > 0 ? requestedPage : 1;
  const activeCategory = (params.category || 'all').trim();
  const searchQuery = (params.q || '').trim().slice(0, 80);
  const sortOrder: GallerySort =
    params.sort === 'oldest' || params.sort === 'az' ? params.sort : 'recent';

  const { data: categoriesData } = await supabase
    .from('categorie')
    .select('id, name, slug, color')
    .eq('user_id', process.env.NEXT_PUBLIC_PORTFOLIO_USER_ID);

  const categories = (categoriesData as CategorieSummary[] | null) || [];
  const selectedCategory =
    activeCategory !== 'all' ? categories.find((c) => c.slug === activeCategory) : undefined;

  let query = supabase
    .from('projet')
    .select(
      'id, titre, slug, description, miniature_url, created_at, categorie:categorie_id(id, name, slug, color), sousprojet(youtube_url, drive_url, ordre)',
      { count: 'exact' }
    )
    .eq('en_ligne', true)
    .eq('user_id', process.env.NEXT_PUBLIC_PORTFOLIO_USER_ID);

  if (selectedCategory) {
    query = query.eq('categorie_id', selectedCategory.id);
  }

  if (searchQuery) {
    const safePattern = searchQuery.replace(/[%_]/g, '\\$&');
    query = query.ilike('titre', `%${safePattern}%`);
  }

  if (sortOrder === 'oldest') {
    query = query.order('created_at', { ascending: true });
  } else if (sortOrder === 'az') {
    query = query.order('titre', { ascending: true });
  } else {
    query = query.order('created_at', { ascending: false });
  }

  const from = (currentPage - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const { data: projetsData, count } = await query.range(from, to);

  const totalCount = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  const rawProjets = (projetsData as unknown as ProjetSummary[] | null) || [];
  const projets: ProjetSummary[] = rawProjets.map((p) => ({
    ...p,
    description: truncateDescriptionExcerpt(p.description),
    sousprojet: p.sousprojet?.slice().sort((a, b) => a.ordre - b.ordre),
  }));

  return (
    <GalleryClient
      projets={projets}
      categories={categories}
      currentPage={Math.min(currentPage, totalPages)}
      totalPages={totalPages}
      totalCount={totalCount}
      pageSize={PAGE_SIZE}
      activeCategory={selectedCategory ? selectedCategory.slug : 'all'}
      initialSearch={searchQuery}
      initialSort={sortOrder}
    />
  );
}
