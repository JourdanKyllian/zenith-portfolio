import React from 'react';

interface IconProps {
  size?: number;
  className?: string;
}

/**
 * Bibliothèque d'icônes SVG optimisées pour l'intégration inline.
 * Évite l'import de dépendances lourdes pour des SVG simples.
 */

export const LinkedinIcon = ({ size = 24, className = "" }: IconProps) => (
  <svg viewBox="0 0 24 24" width={size} height={size} className={className} stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export const InstagramIcon = ({ size = 24, className = "" }: IconProps) => (
  <svg viewBox="0 0 24 24" width={size} height={size} className={className} stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

export const FacebookIcon = ({ size = 24, className = "" }: IconProps) => (
  <svg viewBox="0 0 24 24" width={size} height={size} className={className} stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

export const YoutubeIcon = ({ size = 24, className = "" }: IconProps) => (
  <svg viewBox="0 0 24 24" width={size} height={size} className={className} stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
  </svg>
);

export const TiktokIcon = ({ size = 24, className = "" }: IconProps) => (
  <svg viewBox="0 0 24 24" width={size} height={size} className={className} stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

export const TwitchIcon = ({ size = 24, className = "" }: IconProps) => (
  <svg viewBox="0 0 24 24" width={size} height={size} className={className} stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 2H3v16h5v4l4-4h5l4-4V2zm-10 9V7m5 4V7" />
  </svg>
);

export const TwitterIcon = ({ size = 24, className = "" }: IconProps) => (
  <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export const KickIcon = ({ size = 24, className = "" }: IconProps) => (
  <svg viewBox="0 0 32 32" width={size} height={size} className={className} fill="currentColor">
    <path d="M2 0 L2 32 L13 32 L13 25 L16 25 L16 28 L19 28 L19 32 L30 32 L30 22 L29 22 L29 21 L26 21 L26 18 L23 18 L23 14 L26 14 L26 11 L29 11 L29 10 L30 10 L30 0 L19 0 L19 4 L16 4 L16 7 L13 7 L13 0 Z" />
  </svg>
);

export const SoundcloudIcon = ({ size = 24, className = "" }: IconProps) => (
  <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="currentColor">
    <path d="M11.17 11.286A.2.2 0 0 0 11 11.5v7.625c0 .11.09.2.2.2h.536a.2.2 0 0 0 .2-.2V11.5a.2.2 0 0 0-.2-.2h-.566zm-1.896.793a.2.2 0 0 0-.17.21v6.837c0 .11.09.2.2.2h.537a.2.2 0 0 0 .2-.2v-6.84a.2.2 0 0 0-.2-.2h-.567zm-1.92.366a.2.2 0 0 0-.17.21v6.07c0 .11.09.2.2.2h.536a.2.2 0 0 0 .2-.2v-6.074a.2.2 0 0 0-.2-.2h-.566zm-1.93.992a.2.2 0 0 0-.16.208v4.065c0 .11.09.2.2.2h.537a.2.2 0 0 0 .2-.2v-4.07a.2.2 0 0 0-.2-.2H5.42zm-1.922 1.33a.2.2 0 0 0-.16.207v1.365c0 .11.09.2.2.2h.536a.2.2 0 0 0 .2-.2v-1.37a.2.2 0 0 0-.2-.2h-.566v.002zm-1.468.216a.2.19 0 0 0-.14.205v.928c0 .11.09.2.2.2h.536a.2.2 0 0 0 .2-.2v-.93a.2.2 0 0 0-.2-.2h-.596zm8.68-4.982a.2.2 0 0 0-.2.2v9.426c0 .11.09.2.2.2h.536a.2.2 0 0 0 .2-.2v-9.43a.2.2 0 0 0-.2-.2h-.566v.004zm2.146-.534c-2.316-.272-3.868 1.488-3.868 3.52 0 1.942 1.552 3.513 3.868 3.513h6.417c1.47 0 2.664-1.18 2.664-2.633 0-1.455-1.194-2.635-2.664-2.635-.308 0-.602.054-.88.15-.36-1.077-1.4-1.85-2.63-1.85-.63 0-1.21.214-1.68.576-.395-.42-1.01-.64-1.227-.64h-.002Z" />
  </svg>
);
