import { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://zenithproduction.fr';

  // Récupération automatique de tous les projets actifs depuis Supabase
  const { data: projets } = await supabase
    .from('projet')
    .select('slug')
    .eq('en_ligne', true);

  const projetUrls = (projets || []).map((p: any) => ({
    url: `${baseUrl}/projet/${p.slug}`,
    lastModified: new Date(),
  }));

  return [
    { url: baseUrl, lastModified: new Date() },
    { url: `${baseUrl}/projet`, lastModified: new Date() },
    { url: `${baseUrl}/about`, lastModified: new Date() },
    { url: `${baseUrl}/contact`, lastModified: new Date() },
    ...projetUrls,
  ];
}