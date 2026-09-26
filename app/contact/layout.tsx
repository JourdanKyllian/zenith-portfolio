import { Metadata } from 'next';

/**
 * Métadonnées d'indexation spécifiques au segment de contact public.
 */
export const metadata: Metadata = {
  title: 'Contact & Collaboration | ZENITH PRODUCTION',
  description: 'Un projet de cadrage, de montage vidéo, de charte graphique ou de post-production ? Discutons-en.',
};

/**
 * Composant Layout restreint au périmètre du formulaire de contact.
 * Isole les règles de métadonnées de la logique client interactive.
 */
export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
