import type { Metadata } from "next";
import { Rajdhani, Roboto, Montserrat } from "next/font/google";
import "./globals.css";
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from "@vercel/speed-insights/react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { fetchCvData } from "@/app/actions/getCv";
import { supabase } from "@/lib/supabase";

export const revalidate = 3600; 

const rajdhani = Rajdhani({ 
  subsets: ["latin"], 
  weight: ["400", "500", "600", "700"],
  variable: "--font-rajdhani" 
});

const roboto = Roboto({ 
  subsets: ["latin"], 
  weight: ["300", "400", "500", "700"],
  variable: "--font-roboto" 
});

const montserrat = Montserrat({ 
  subsets: ["latin"], 
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-montserrat" 
});

export const metadata: Metadata = {
  metadataBase: new URL('https://zenithproduction.fr'),
  title: "ZENITH PRODUCTION",
  description: "Portfolio officiel de Zenith Production — Gabin Husson. Services professionnels en graphisme, cadrage, montage vidéo et post-production.",
  applicationName: "ZENITH PRODUCTION",
  appleWebApp: {
    title: "ZENITH PRODUCTION",
    statusBarStyle: "black-translucent",
  },
  openGraph: {
    title: "ZENITH PRODUCTION",
    description: "Gabin Husson — Zenith Production · Graphiste, Cadreur, Monteur Vidéo & Photo",
    siteName: "ZENITH PRODUCTION",
    locale: "fr_FR",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cvData = await fetchCvData();

  // 1. Récupération des réseaux sociaux depuis Supabase
  const { data: paramData } = await supabase
    .from('parametres')
    .select('linkedin_url, instagram_url, facebook_url, tiktok_url, youtube_url')
    .eq('user_id', process.env.NEXT_PUBLIC_PORTFOLIO_USER_ID)
    .single();

  // 2. Logique identique aux projets : on prend la valeur en BDD, si null -> chaîne vide (aucun affichage)
  const socials = {
    linkedin: paramData?.linkedin_url || "",
    instagram: paramData?.instagram_url || "",
    facebook: paramData?.facebook_url || "",
    tiktok: paramData?.tiktok_url || "",
    youtube: paramData?.youtube_url || ""
  };

  // 3. Extraction dynamique pour le JSON-LD (référencement Google)
  const validSocials = Object.values(socials).filter(url => url && url.trim() !== "");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "Zenith Production",
    "image": "https://zenithproduction.fr/gabin.webp",
    "url": "https://zenithproduction.fr",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "2A, RUELLE DU PETIT VOUET",
      "addressLocality": "Fagnières",
      "postalCode": "51510",
      "addressCountry": "FR"
    },
    "founder": {
      "@type": "Person",
      "name": "Gabin Husson",
      "jobTitle": "Graphiste, Cadreur, Monteur Vidéo & Photo"
    },
    "sameAs": validSocials
  };

  return (
    <html lang="fr" data-scroll-behavior="smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${rajdhani.variable} ${roboto.variable} ${montserrat.variable} antialiased flex flex-col min-h-screen`}>
        <Navbar cvUrl={cvData.cvUrl} previewUrl={cvData.previewUrl} />
        <main className="grow">
          {children}
        </main>
        {/* On passe les liens dynamiques au Footer */}
        <Footer socials={socials} />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
