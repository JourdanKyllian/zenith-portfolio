import Link from 'next/link';
import { LinkedinIcon, InstagramIcon, FacebookIcon, YoutubeIcon, TiktokIcon } from './SocialIcons';

/**
 * Server Component : Pied de page global du site.
 * Contient les liens de réseaux sociaux et les mentions obligatoires.
 */
export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-z-night border-t border-z-silver/10 pt-16 pb-8 px-6 mt-20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
        <div className="flex flex-col items-center md:items-start gap-1">
          <Link href="/" className="group">
            <span className="font-martyric text-6xl text-white group-hover:text-z-blue transition-colors duration-300 drop-shadow-lg px-3 -mx-3">
              ZENITH
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <SocialBubble href="https://www.linkedin.com/in/gabin-husson-08244521b/" ariaLabel="LinkedIn">
            <LinkedinIcon size={18} />
          </SocialBubble>

          <SocialBubble href="https://www.instagram.com/zenithproduction.off/" ariaLabel="Instagram">
            <InstagramIcon size={18} />
          </SocialBubble>

          <SocialBubble href="https://www.facebook.com/profile.php?id=61579746212800" ariaLabel="Facebook">
            <FacebookIcon size={18} />
          </SocialBubble>

          <SocialBubble href="https://www.tiktok.com/@gabzerguigzer/video/7383765160030244129" ariaLabel="TikTok">
            <TiktokIcon size={18} />
          </SocialBubble>

          <SocialBubble href="https://www.youtube.com/@GabzerEtGuigzer" ariaLabel="YouTube">
            <YoutubeIcon size={18} />
          </SocialBubble>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-16 pt-6 border-t border-z-silver/10 flex flex-col md:flex-row items-center justify-between gap-4 font-sub text-[10px] font-bold uppercase tracking-widest text-z-muted">
        <p>© 2025-{currentYear} ZENITH PRODUCTION - TOUS DROITS RÉSERVÉS</p>
        
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

function SocialBubble({ href, children, ariaLabel }: { href: string, children: React.ReactNode, ariaLabel: string }) {
  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      className="w-11 h-11 rounded-full border border-z-silver/20 bg-z-card flex items-center justify-center text-z-text hover:bg-z-blue hover:text-white hover:border-z-blue transition-all duration-300 hover:scale-110 shadow-lg shadow-black/20"
    >
      {children}
    </a>
  );
}