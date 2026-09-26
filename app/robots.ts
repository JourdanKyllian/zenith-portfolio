import { MetadataRoute } from 'next';

/**
 * Définition des règles d'indexation pour les moteurs de recherche (Web Crawlers).
 * Autorise l'exploration publique globale et référence le plan de site (sitemap.xml).
 *
 * @returns {MetadataRoute.Robots} Objet de configuration conforme aux spécifications Next.js.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'https://zenithproduction.fr/sitemap.xml',
  };
}
