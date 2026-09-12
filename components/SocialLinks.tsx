import React from 'react';
import { LinkedinIcon, InstagramIcon, FacebookIcon, YoutubeIcon, TiktokIcon, TwitchIcon } from './SocialIcons';

interface SocialLinksProps {
  variant: 'footer' | 'project';
  links: {
    linkedin?: string | null;
    instagram?: string | null;
    facebook?: string | null;
    tiktok?: string | null;
    youtube?: string | null;
    twitch?: string | null;
  };
}

export default function SocialLinks({ variant, links }: SocialLinksProps) {
  // --- VARIANT FOOTER ---
  if (variant === 'footer') {
    return (
      <div className="flex items-center gap-3">
        {links.linkedin && (
          <SocialBubble href={links.linkedin} ariaLabel="LinkedIn"><LinkedinIcon size={18} /></SocialBubble>
        )}
        {links.instagram && (
          <SocialBubble href={links.instagram} ariaLabel="Instagram"><InstagramIcon size={18} /></SocialBubble>
        )}
        {links.facebook && (
          <SocialBubble href={links.facebook} ariaLabel="Facebook"><FacebookIcon size={18} /></SocialBubble>
        )}
        {links.tiktok && (
          <SocialBubble href={links.tiktok} ariaLabel="TikTok"><TiktokIcon size={18} /></SocialBubble>
        )}
        {links.youtube && (
          <SocialBubble href={links.youtube} ariaLabel="YouTube"><YoutubeIcon size={18} /></SocialBubble>
        )}
      </div>
    );
  }

  // --- VARIANT PROJET ---
  if (variant === 'project') {
    return (
      <div className="flex items-center gap-2 border-l border-z-border pl-4 md:flex">
        {links.instagram && (
          <a href={links.instagram} target="_blank" rel="noopener noreferrer" className="group p-1.5 rounded-lg border border-z-border bg-z-card/50 hover:bg-pink-500/10 hover:border-pink-500/20 transition-all" title="Suivre sur Instagram">
            <InstagramIcon size={16} className="text-z-muted group-hover:text-pink-500 transition-colors" />
          </a>
        )}
        {links.youtube && (
          <a href={links.youtube} target="_blank" rel="noopener noreferrer" className="group p-1.5 rounded-lg border border-z-border bg-z-card/50 hover:bg-red-500/10 hover:border-red-500/20 transition-all" title="Suivre sur Youtube">
            <YoutubeIcon size={16} className="text-z-muted group-hover:text-red-500 transition-colors" />
          </a>
        )}
        {links.tiktok && (
          <a href={links.tiktok} target="_blank" rel="noopener noreferrer" className="group p-1.5 rounded-lg border border-z-border bg-z-card/50 hover:bg-cyan-400/10 hover:border-cyan-400/20 transition-all" title="Suivre sur TikTok">
            <TiktokIcon size={16} className="text-z-muted group-hover:text-cyan-400 transition-colors" />
          </a>
        )}
        {links.twitch && (
          <a href={links.twitch} target="_blank" rel="noopener noreferrer" className="group p-1.5 rounded-lg border border-z-border bg-z-card/50 hover:bg-purple-500/10 hover:border-purple-500/20 transition-all" title="Suivre sur Twitch">
            <TwitchIcon size={16} className="text-z-muted group-hover:text-purple-500 transition-colors" />
          </a>
        )}
        {links.facebook && (
          <a href={links.facebook} target="_blank" rel="noopener noreferrer" className="group p-1.5 rounded-lg border border-z-border bg-z-card/50 hover:bg-blue-500/10 hover:border-blue-500/20 transition-all" title="Suivre sur Facebook">
            <FacebookIcon size={16} className="text-z-muted group-hover:text-blue-500 transition-colors" />
          </a>
        )}
      </div>
    );
  }

  return null;
}

// Sous-composant mutualisé pour le Footer
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
