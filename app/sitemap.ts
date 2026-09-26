import { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase';

/**
 * Générateur dynamique du plan de site (Sitemap XML).
 * Interroge la base de données pour inventorier l'ensemble des projets actifs 
 * et garantir une indexation exhaustive du contenu sur les moteurs de recherche.
 * Encode proprement les paramètres URI pour se conformer aux exigences de la Google Search Console.
 *
 * @returns {Promise<MetadataRoute.Sitemap>} Arborescence structurée des routes publiques.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://zenithproduction.fr';

  const { data: projets } = await supabase
    .from('projet')
    .select('slug')
    .eq('en_ligne', true)
    .eq('user_id', process.env.NEXT_PUBLIC_PORTFOLIO_USER_ID);

  const projetUrls = (projets as { slug: string }[] || [])
    .filter((p) => p.slug && p.slug.trim() !== '')
    .map((p) => ({
      url: `${baseUrl}/projet/${encodeURIComponent(p.slug.trim())}`,
      lastModified: new Date(),
    }));

  return [
    { url: baseUrl, lastModified: new Date() },
    { url: `${baseUrl}/projet`, lastModified: new Date() },
    { url: `${baseUrl}/about`, lastModified: new Date() },
    { url: `${baseUrl}/contact`, lastModified: new Date() },
    { url: `${baseUrl}/mentions-legales`, lastModified: new Date() },
    ...projetUrls,
  ];
}
