import type { Metadata } from "next";
import { Rajdhani, Roboto, Montserrat } from "next/font/google";
import "./globals.css";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body className={`${rajdhani.variable} ${roboto.variable} ${montserrat.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}