import React from 'react';
import { LinkedinIcon, InstagramIcon, FacebookIcon, YoutubeIcon, TiktokIcon, TwitchIcon, TwitterIcon, KickIcon } from './SocialIcons';

interface SocialLinksProps {
  variant: 'footer' | 'project';
  links: {
    linkedin?: string | null;
    instagram?: string | null;
    facebook?: string | null;
    tiktok?: string | null;
    youtube?: string | null;
    twitch?: string | null;
    x?: string | null;
    kick?: string | null;
  };
}

export default function SocialLinks({ variant, links }: SocialLinksProps) {
  const hasLinks = Object.values(links).some(url => url && url.trim() !== '');

  if (!hasLinks) return null;

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
          {links.linkedin && <SocialBubble href={links.linkedin} ariaLabel="LinkedIn"><LinkedinIcon size={18} /></SocialBubble>}
          {links.instagram && <SocialBubble href={links.instagram} ariaLabel="Instagram"><InstagramIcon size={18} /></SocialBubble>}
          {links.facebook && <SocialBubble href={links.facebook} ariaLabel="Facebook"><FacebookIcon size={18} /></SocialBubble>}
          {links.tiktok && <SocialBubble href={links.tiktok} ariaLabel="TikTok"><TiktokIcon size={18} /></SocialBubble>}
          {links.youtube && <SocialBubble href={links.youtube} ariaLabel="YouTube"><YoutubeIcon size={18} /></SocialBubble>}
          {links.twitch && <SocialBubble href={links.twitch} ariaLabel="Twitch"><TwitchIcon size={18} /></SocialBubble>}
          {links.x && <SocialBubble href={links.x} ariaLabel="X"><TwitterIcon size={16} /></SocialBubble>}
          {links.kick && <SocialBubble href={links.kick} ariaLabel="Kick"><KickIcon size={16} /></SocialBubble>}
        </div>
      </div>
    );
  }

  if (variant === 'project') {
    return (
      <div className="flex items-center gap-2 border-l border-z-border pl-4 md:flex flex-wrap">
        {links.instagram && (
          <a href={links.instagram} target="_blank" rel="noopener noreferrer" className="group p-1.5 rounded-lg border border-z-border bg-z-card/50 hover:bg-pink-500/10 hover:border-pink-500/20 transition-all" title="Instagram">
            <InstagramIcon size={16} className="text-z-muted group-hover:text-pink-500 transition-colors" />
          </a>
        )}
        {links.youtube && (
          <a href={links.youtube} target="_blank" rel="noopener noreferrer" className="group p-1.5 rounded-lg border border-z-border bg-z-card/50 hover:bg-red-500/10 hover:border-red-500/20 transition-all" title="Youtube">
            <YoutubeIcon size={16} className="text-z-muted group-hover:text-red-500 transition-colors" />
          </a>
        )}
        {links.tiktok && (
          <a href={links.tiktok} target="_blank" rel="noopener noreferrer" className="group p-1.5 rounded-lg border border-z-border bg-z-card/50 hover:bg-cyan-400/10 hover:border-cyan-400/20 transition-all" title="TikTok">
            <TiktokIcon size={16} className="text-z-muted group-hover:text-cyan-400 transition-colors" />
          </a>
        )}
        {links.twitch && (
          <a href={links.twitch} target="_blank" rel="noopener noreferrer" className="group p-1.5 rounded-lg border border-z-border bg-z-card/50 hover:bg-purple-500/10 hover:border-purple-500/20 transition-all" title="Twitch">
            <TwitchIcon size={16} className="text-z-muted group-hover:text-purple-500 transition-colors" />
          </a>
        )}
        {links.facebook && (
          <a href={links.facebook} target="_blank" rel="noopener noreferrer" className="group p-1.5 rounded-lg border border-z-border bg-z-card/50 hover:bg-blue-500/10 hover:border-blue-500/20 transition-all" title="Facebook">
            <FacebookIcon size={16} className="text-z-muted group-hover:text-blue-500 transition-colors" />
          </a>
        )}
        {links.x && (
          <a href={links.x} target="_blank" rel="noopener noreferrer" className="group p-1.5 rounded-lg border border-z-border bg-z-card/50 hover:bg-white/10 hover:border-white/20 transition-all" title="X">
            <TwitterIcon size={14} className="text-z-muted group-hover:text-white transition-colors" />
          </a>
        )}
        {links.kick && (
          <a href={links.kick} target="_blank" rel="noopener noreferrer" className="group p-1.5 rounded-lg border border-z-border bg-z-card/50 hover:bg-emerald-500/10 hover:border-emerald-500/20 transition-all" title="Kick">
            <KickIcon size={14} className="text-z-muted group-hover:text-emerald-400 transition-colors" />
          </a>
        )}
      </div>
    );
  }

  return null;
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
