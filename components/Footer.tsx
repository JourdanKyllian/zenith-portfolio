"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import SocialLinks from './SocialLinks';

interface FooterProps {
  socials: {
    linkedin: string;
    instagram: string;
    facebook: string;
    tiktok: string;
    youtube: string;
  }
}

export default function Footer({ socials }: FooterProps) {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  if (pathname?.startsWith('/admin')) return null;

  return (
    <footer className="w-full bg-z-night border-t border-z-silver/10 pt-16 pb-8 px-6 mt-20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
        <div className="flex flex-col items-center md:items-start gap-1">
          <Link href="/" className="group">
            <span className="font-martyric text-6xl text-white group-hover:text-z-blue transition-colors duration-300 drop-shadow-lg">
              ZENITH
            </span>
          </Link>
        </div>

        {/* --- INJECTION DU NOUVEAU COMPOSANT --- */}
        <SocialLinks variant="footer" links={socials} />
      </div>

      <div className="max-w-7xl mx-auto mt-16 pt-6 border-t border-z-silver/10 flex flex-col md:flex-row items-center justify-between gap-4 font-sub text-[10px] font-bold uppercase tracking-widest text-z-muted">
        <p>
          <Link href="/admin/login" className="hover:text-white transition-colors cursor-default outline-none">
            © 2025-{currentYear} ZENITH PRODUCTION - TOUS DROITS RÉSERVÉS
          </Link>
        </p>
        
        <div className="flex flex-wrap justify-center items-center gap-6">
          <Link href="/contact" className="hover:text-z-blue transition-colors">
            Nous contacter
          </Link>
          <Link href="/mentions-legales" className="hover:text-z-blue transition-colors">
            Mentions légales
          </Link>
        </div>
      </div>
    </footer>
  );
}
