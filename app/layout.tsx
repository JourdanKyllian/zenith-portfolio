import type { Metadata } from "next";
import { Rajdhani, Roboto, Montserrat } from "next/font/google";
import "./globals.css";
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from "@vercel/speed-insights/react";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import { fetchCvData } from "@/app/actions/getCv";
import { supabase } from "@/lib/supabase";
import { AVAILABLE_SOCIALS } from "@/config/socials";

export const revalidate = 3600; 

const rajdhani = Rajdhani({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-rajdhani" });
const roboto = Roboto({ subsets: ["latin"], weight: ["300", "400", "500", "700"], variable: "--font-roboto" });
const montserrat = Montserrat({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700"], variable: "--font-montserrat" });

export const metadata: Metadata = {
  metadataBase: new URL('https://zenithproduction.fr'),
  title: "ZENITH PRODUCTION",
  description: "Portfolio officiel de Zenith Production — Gabin Husson. Services professionnels en graphisme, cadrage, montage vidéo et post-production.",
  applicationName: "ZENITH PRODUCTION",
  appleWebApp: { title: "ZENITH PRODUCTION", statusBarStyle: "black-translucent" },
  openGraph: { title: "ZENITH PRODUCTION", description: "Gabin Husson — Zenith Production · Graphiste, Cadreur, Monteur Vidéo & Photo", siteName: "ZENITH PRODUCTION", locale: "fr_FR", type: "website" },
};

/**
 * Layout principal (Root Layout) encapsulant l'ensemble de l'application.
 * Configure le contexte global : polices personnalisées, métadonnées SEO dynamiques,
 * navigation partagée (Navbar/Footer) et outils d'analyse de performance Vercel.
 *
 * @param {Object} props - Propriétés d'encapsulation React.
 * @param {React.ReactNode} props.children - Les vues enfants injectées par le routeur.
 */
export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
  const cvData = await fetchCvData();

  const queryFields = AVAILABLE_SOCIALS.map(net => `${net.id}_url`).join(', ');

  const { data: paramData } = await supabase
    .from('parametres')
    .select(queryFields)
    .eq('user_id', process.env.NEXT_PUBLIC_PORTFOLIO_USER_ID)
    .single();

  const socials = AVAILABLE_SOCIALS.reduce((acc, net) => {
    acc[net.id] = (paramData as unknown as Record<string, string>)?.[`${net.id}_url`] || "";
    return acc;
  }, {} as Record<string, string>);

  const validSocials = Object.values(socials).filter(url => url && url.trim() !== "");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "Zenith Production",
    "image": "https://zenithproduction.fr/gabin.webp",
    "url": "https://zenithproduction.fr",
    "address": { "@type": "PostalAddress", "streetAddress": "2A, RUELLE DU PETIT VOUET", "addressLocality": "Fagnières", "postalCode": "51510", "addressCountry": "FR" },
    "founder": { "@type": "Person", "name": "Gabin Husson", "jobTitle": "Graphiste, Cadreur, Monteur Vidéo & Photo" },
    "sameAs": validSocials
  };

  return (
    <html lang="fr" data-scroll-behavior="smooth">
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body className={`${rajdhani.variable} ${roboto.variable} ${montserrat.variable} antialiased flex flex-col min-h-screen`}>
        <Navbar cvUrl={cvData.cvUrl} previewUrl={cvData.previewUrl} />
        <main className="grow">{children}</main>
        <Footer socials={socials} />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
