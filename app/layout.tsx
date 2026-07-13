import type { Metadata } from "next";
import { Rajdhani, Roboto, Montserrat } from "next/font/google";
import "./globals.css";
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from "@vercel/speed-insights/react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { fetchCvData } from "@/app/actions/getCv"; // Import mis à jour

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
  title: "ZENITH PRODUCTION — Gabin Husson",
  description: "Gabin Husson — Zenith Production · Graphiste, Cadreur, Monteur Vidéo & Photo",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Récupération des données du CV (PDF + Image) côté serveur
  const cvData = await fetchCvData();

  return (
    <html lang="fr" data-scroll-behavior="smooth">
      <body className={`${rajdhani.variable} ${roboto.variable} ${montserrat.variable} antialiased flex flex-col min-h-screen`}>
        {/* On transmet les deux propriétés à la Navbar */}
        <Navbar cvUrl={cvData.cvUrl} previewUrl={cvData.previewUrl} />
        
        <main className="flex-grow">
          {children}
        </main>
        
        <Footer />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}