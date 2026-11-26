import type { Metadata } from 'next';

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

/**
 * Layout racine du segment /admin.
 * Applique la directive noindex/nofollow à toutes les routes d'administration
 * sans exposer le chemin /admin dans robots.txt.
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
