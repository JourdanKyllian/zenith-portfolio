import { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase';

/**
 * Génère dynamiquement le fichier sitemap.xml pour le SEO.
 * Interroge Supabase pour récupérer les slugs des projets actifs et encode les URI
 * pour éviter les rejets de parsing XML par Google Search Console.
 *
 * @returns {Promise<MetadataRoute.Sitemap>} L'arborescence des routes indexables.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://zenithproduction.fr';

  const { data: projets } = await supabase
    .from('projet')
    .select('slug')
    .eq('en_ligne', true);

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