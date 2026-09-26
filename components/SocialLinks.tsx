import React from 'react';
import { AVAILABLE_SOCIALS } from '@/config/socials';

interface SocialLinksProps {
  variant: 'footer' | 'project';
  links: Record<string, string | null | undefined>;
}

/**
 * Composant de présentation dynamique des liens de réseaux sociaux.
 * Filtre les entrées vides et adapte sa disposition selon le contexte parent (Pied de page ou Fiche Projet).
 *
 * @param {SocialLinksProps} props - Le contexte d'affichage (variant) et le dictionnaire des URLs.
 */
export default function SocialLinks({ variant, links }: SocialLinksProps) {
  const activeNetworks = AVAILABLE_SOCIALS.filter(net => links[net.id] && links[net.id]?.trim() !== '');

  if (activeNetworks.length === 0) return null;

  if (variant === 'footer') {
    return (
      <div className="flex flex-col items-center md:items-start gap-4 animate-fade-in w-full md:w-auto mt-8 md:mt-0">
        <div className="flex items-center justify-center md:justify-start gap-4 w-full">
          <span className="font-sub text-xs sm:text-sm font-bold uppercase tracking-[0.25em] text-z-muted">
            Mes réseaux
          </span>
          <span className="hidden md:block flex-1 h-px bg-z-border min-w-15 max-w-37.5"></span>
        </div>
        
        <div className="flex items-center justify-center md:justify-start gap-3 w-full flex-wrap">
          {activeNetworks.map(net => {
            const Icon = net.icon;
            return (
              <SocialBubble key={net.id} href={links[net.id]!} ariaLabel={net.label} hoverClass={net.hoverClass}>
                <Icon size={18} />
              </SocialBubble>
            );
          })}
        </div>
      </div>
    );
  }

  if (variant === 'project') {
    return (
      <div className="flex items-center gap-2 border-l border-z-border pl-4 md:flex flex-wrap">
        {activeNetworks.map(net => {
          const Icon = net.icon;
          return (
            <a 
              key={net.id} 
              href={links[net.id]!} 
              target="_blank" 
              rel="noopener noreferrer" 
              className={`group p-1.5 rounded-lg border border-z-border bg-z-card/50 transition-all ${net.hoverClass || 'hover:bg-white/10 hover:border-white/20'}`} 
              title={net.label}
            >
              <Icon size={16} className="text-z-muted group-hover:text-inherit transition-colors" />
            </a>
          );
        })}
      </div>
    );
  }

  return null;
}

/**
 * Sous-composant stylisant un lien social sous forme de bulle interactive.
 */
function SocialBubble({ href, children, ariaLabel, hoverClass }: { href: string, children: React.ReactNode, ariaLabel: string, hoverClass?: string }) {
  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      className={`w-11 h-11 rounded-full border border-z-silver/20 bg-z-card flex items-center justify-center text-z-text transition-all duration-300 hover:scale-110 shadow-lg shadow-black/20 ${hoverClass || 'hover:bg-z-blue hover:text-white hover:border-z-blue'}`}
    >
      {children}
    </a>
  );
}
