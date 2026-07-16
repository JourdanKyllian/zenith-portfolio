import { MetadataRoute } from 'next';

/**
 * Génère dynamiquement le fichier robots.txt.
 * Autorise l'indexation globale du site par les robots d'exploration (crawlers)
 * et pointe vers le sitemap dynamique de l'application.
 *
 * @returns {MetadataRoute.Robots} Configuration des règles d'exploration.
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