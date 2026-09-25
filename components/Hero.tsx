"use client";

import { Eye, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useMemo } from 'react';

interface HeroProps {
  categoriesCount: number;
  yearsOfExperience: number;
  marqueeImages?: string[];
}

function getDriveFileId(urlOrId: string | null | undefined): string | null {
  if (!urlOrId) return null;
  if (!urlOrId.includes('/')) return urlOrId;
  const fileDMatch = urlOrId.match(/\/d\/([a-zA-Z0-9-_]+)/);
  if (fileDMatch) return fileDMatch[1];
  const idParamMatch = urlOrId.match(/id=([a-zA-Z0-9-_]+)/);
  if (idParamMatch) return idParamMatch[1];
  return null;
}

export default function Hero({ categoriesCount, yearsOfExperience, marqueeImages = [] }: HeroProps) {
  
  // Résolution optimisée des images Drive en miniatures
  const resolvedImages = useMemo(() => {
    return marqueeImages.map(url => {
      if (url.startsWith('http') && !url.includes('drive.google.com')) return url;
      const id = getDriveFileId(url);
      return id ? `https://drive.google.com/thumbnail?id=${id}&sz=w800` : url;
    });
  }, [marqueeImages]);

  // Duplication de la liste pour assurer la continuité de la boucle CSS
  const displayImages = resolvedImages.length > 0 
    ? [...resolvedImages, ...resolvedImages] 
    : [];

  return (
    <section className="hero-bg relative min-h-screen flex flex-col items-center justify-center text-center px-4 pt-32 pb-16 overflow-hidden">
      <div className="diag-lines"></div>

      <div className="animate-fade-in relative z-10 flex items-center gap-2.5 px-4 py-2 rounded-md border border-z-blue/20 bg-z-blue/5 mb-10 overflow-hidden shadow-lg backdrop-blur-sm">
        <div className="relative w-2 h-2">
          <span className="absolute inset-0 rounded-full bg-z-blue ping-dot"></span>
          <span className="relative block w-2 h-2 rounded-full bg-z-blue"></span>
        </div>
        <span className="font-sub text-z-blue text-[10px] font-bold uppercase tracking-[0.2em]">
          Disponible · 24h/24 et 7J/7
        </span>
      </div>

      <div className="relative z-10">
        <h1 className="animate-fade-up font-display tracking-wide mb-4 flex flex-col items-center gap-3 sm:gap-4">
          <span className="font-martyric text-z-text text-[clamp(3rem,9vw,7rem)] leading-none drop-shadow-2xl">
            ZENITH
          </span>
          <span className="font-bold text-glow animate-neon-flicker text-[clamp(1.2rem,4.5vw,2.8rem)] tracking-[0.15em] leading-none">
            PRODUCTION
          </span>
        </h1>
      </div>

      <p className="relative z-10 animate-fade-up font-sub font-semibold tracking-[0.35em] uppercase text-z-muted text-sm mb-4">
        Gabin HUSSON
      </p>

      <p className="relative z-10 animate-fade-up font-body font-light text-z-text/70 text-base sm:text-lg max-w-lg mx-auto mb-12 leading-relaxed">
        Graphiste · Cadreur · Monteur Vidéo & Photo · Marketing
      </p>

      <div className="relative z-10 animate-fade-up flex flex-wrap items-center justify-center gap-4">
        <Link href="/projet" className="btn-blue px-7 py-3.5 rounded-md flex items-center gap-3 text-sm transition-transform hover:scale-105">
          <Eye size={16} />
          Explorer la galerie
        </Link>
        <Link href="/contact" className="btn-outline px-7 py-3.5 rounded-md flex items-center gap-3 text-sm bg-z-bg/50 backdrop-blur-md">
           Me contacter
          <ArrowRight size={14} />
        </Link>
      </div>

      <div className="relative z-10 animate-fade-up w-full max-w-md mt-16 sm:mt-24 mb-12">
        <div className="flex items-center border border-z-blue/15 rounded-lg overflow-hidden bg-z-blue/5 backdrop-blur-md shadow-2xl">
          <div className="flex-1 py-4 border-r border-z-blue/15">
            <div className="font-display font-bold text-3xl text-z-text">180<span className="text-z-blue">+</span></div>
            <div className="font-sub text-z-muted text-[9px] tracking-widest uppercase mt-1">Projets</div>
          </div>
          <div className="flex-1 py-4 border-r border-z-blue/15">
            <div className="font-display font-bold text-3xl text-z-text">{yearsOfExperience}<span className="text-z-blue">+</span></div>
            <div className="font-sub text-z-muted text-[9px] tracking-widest uppercase mt-1">Années</div>
          </div>
          <div className="flex-1 py-4">
            <div className="font-display font-bold text-3xl text-z-text">{categoriesCount}</div>
            <div className="font-sub text-z-muted text-[9px] tracking-widest uppercase mt-1">Univers</div>
          </div>
        </div>
      </div>

      {/* --- PELLICULE DÉFILANTE (MARQUEE) --- */}
      {displayImages.length > 0 && (
        <div className="w-full relative z-10 overflow-hidden flex flex-col items-center animate-fade-in mt-4">
          <div className="w-full max-w-[100vw] flex gap-4 mask-edges group">
            {/* Première bande */}
            <div className="flex shrink-0 items-center justify-around gap-4 animate-marquee group-hover:[animation-play-state:paused]">
              {displayImages.map((src, idx) => (
                <div key={`m1-${idx}`} className="relative aspect-video w-55 sm:w-[320px] rounded-xl overflow-hidden border border-z-blue/10 shadow-xl transition-all duration-300 hover:border-z-blue hover:scale-105 cursor-pointer">
                  <img src={src} alt="" className="w-full h-full object-cover filter saturate-50 hover:saturate-100 transition-all duration-300" />
                </div>
              ))}
            </div>
            {/* Seconde bande pour assurer la jonction parfaite */}
            <div className="flex shrink-0 items-center justify-around gap-4 animate-marquee group-hover:[animation-play-state:paused]">
              {displayImages.map((src, idx) => (
                <div key={`m2-${idx}`} className="relative aspect-video w-55 sm:w-[320px] rounded-xl overflow-hidden border border-z-blue/10 shadow-xl transition-all duration-300 hover:border-z-blue hover:scale-105 cursor-pointer">
                  <img src={src} alt="" className="w-full h-full object-cover filter saturate-50 hover:saturate-100 transition-all duration-300" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
    </section>
  );
}
