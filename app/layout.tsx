import type { Metadata } from "next";
import { Rajdhani, Roboto, Montserrat } from "next/font/google";
import "./globals.css"; // <-- localFont a disparu d'ici
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from "@vercel/speed-insights/react";
import Footer from "@/components/Footer";

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

// <-- Le bloc "const martyric = localFont..." a été supprimé

export const metadata: Metadata = {
  title: "ZENITH PRODUCTION — Gabin Husson",
  description: "Gabin Husson — Zenith Production · Graphiste, Cadreur, Monteur Vidéo & Photo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" data-scroll-behavior="smooth">
      <body className={`${rajdhani.variable} ${roboto.variable} ${montserrat.variable} antialiased flex flex-col min-h-screen`}>
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