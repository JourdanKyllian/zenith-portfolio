import type { Metadata } from "next";
import { Rajdhani, Roboto, Montserrat } from "next/font/google";
import "./globals.css";
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from "@vercel/speed-insights/react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { fetchCvData } from "@/app/actions/getCv";

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
  title: "ZENITH PRODUCTION — Gabin Husson",
  description: "Gabin Husson — Zenith Production · Graphiste, Cadreur, Monteur Vidéo & Photo",
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
  // Récupération des données du CV (PDF + Image) côté serveur
  const cvData = await fetchCvData();

  // Carte d'identité sémantique (JSON-LD)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "Zenith Production",
    "image": "https://zenithproduction.fr/gabin.jpg",
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
    "sameAs": [
      "https://www.linkedin.com/in/gabin-husson-08244521b/",
      "https://www.instagram.com/zenithproduction.off/",
      "https://www.facebook.com/profile.php?id=61579746212800"
    ]
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
        {/* On transmet les deux propriétés dynamiques à la Navbar */}
        <Navbar cvUrl={cvData.cvUrl} previewUrl={cvData.previewUrl} />
        
        <main className="grow">
          {children}
        </main>
        
        <Footer />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}