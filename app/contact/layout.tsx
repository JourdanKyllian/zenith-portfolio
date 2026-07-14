import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact & Collaboration | ZENITH PRODUCTION',
  description: 'Un projet de cadrage, de montage vidéo, de charte graphique ou de post-production ? Discutons-en.',
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}