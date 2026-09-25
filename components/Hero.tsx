"use client";

import { Eye, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useMemo } from 'react';

interface MarqueeProject {
  url: string;
  slug: string;
  titre: string;
}

interface HeroProps {
  categoriesCount: number;
  yearsOfExperience: number;
  marqueeProjects?: MarqueeProject[];
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

export default function Hero({ categoriesCount, yearsOfExperience, marqueeProjects = [] }: HeroProps) {
  
  // Résolution optimisée des images Drive
  const resolvedProjects = useMemo(() => {
    return marqueeProjects.map(p => {
      let finalUrl = p.url;
      if (finalUrl.startsWith('http') && !finalUrl.includes('drive.google.com')) {
        // Lien classique, on ne touche à rien
      } else {
        const id = getDriveFileId(finalUrl);
        if (id) finalUrl = `https://drive.google.com/thumbnail?id=${id}&sz=w600`;
      }
      return { ...p, url: finalUrl };
    });
  }, [marqueeProjects]);

  const displayProjects = resolvedProjects.length > 0 
    ? [...resolvedProjects, ...resolvedProjects] 
    : [];

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 pt-28 pb-8 overflow-hidden">
      
      {/* --- SHOWREEL VIDEO --- */}
      <div className="absolute inset-0 z-0 bg-z-bg">
        <video
          autoPlay loop muted playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-25 grayscale-40"
          poster="/gabin.webp"
        >
          <source src="/showreel.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-z-bg/50 mix-blend-multiply" />
        <div className="absolute inset-0 bg-radial from-transparent via-z-bg/70 to-z-bg" />
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-linear-to-t from-z-bg to-transparent" />
      </div>

      <div className="diag-lines z-0 opacity-40"></div>

      <div className="animate-fade-in relative z-10 flex items-center gap-2.5 px-4 py-2 rounded-md border border-z-blue/20 bg-z-blue/5 mb-8 overflow-hidden shadow-lg backdrop-blur-sm">
        <div className="relative w-2 h-2">
          <span className="absolute inset-0 rounded-full bg-z-blue ping-dot"></span>
          <span className="relative block w-2 h-2 rounded-full bg-z-blue"></span>
        </div>
        <span className="font-sub text-z-blue text-[10px] font-bold uppercase tracking-[0.2em]">
          Disponible · 24h/24 et 7J/7
        </span>
      </div>

      <div className="relative z-10">
        <h1 className="animate-fade-up font-display tracking-wide mb-3 flex flex-col items-center gap-2 sm:gap-4">
          <span className="font-martyric text-z-text text-[clamp(3.5rem,9vw,7rem)] leading-none drop-shadow-2xl">
            ZENITH
          </span>
          <span className="font-bold text-glow animate-neon-flicker text-[clamp(1.2rem,4.5vw,2.8rem)] tracking-[0.15em] leading-none">
            PRODUCTION
          </span>
        </h1>
      </div>

      <p className="relative z-10 animate-fade-up font-sub font-semibold tracking-[0.35em] uppercase text-z-muted text-xs sm:text-sm mb-4">
        Gabin HUSSON
      </p>

      <p className="relative z-10 animate-fade-up font-body font-light text-z-text/70 text-sm sm:text-base max-w-lg mx-auto mb-10 leading-relaxed">
        Graphiste · Cadreur · Monteur Vidéo & Photo · Marketing
      </p>

      <div className="relative z-10 animate-fade-up flex flex-wrap items-center justify-center gap-4">
        <Link href="/projet" className="btn-blue px-6 py-3 rounded-md flex items-center gap-3 text-xs sm:text-sm transition-transform hover:scale-105">
          <Eye size={16} /> Explorer la galerie
        </Link>
        <Link href="/contact" className="btn-outline px-6 py-3 rounded-md flex items-center gap-3 text-xs sm:text-sm bg-z-bg/50 backdrop-blur-md">
           Démarrer un projet <ArrowRight size={14} />
        </Link>
      </div>

      <div className="relative z-10 animate-fade-up w-full max-w-sm sm:max-w-md mt-12 mb-8">
        <div className="flex items-center border border-z-blue/15 rounded-lg overflow-hidden bg-z-card/60 backdrop-blur-md shadow-2xl">
          <div className="flex-1 py-3 border-r border-z-blue/15">
            <div className="font-display font-bold text-2xl sm:text-3xl text-z-text">180<span className="text-z-blue">+</span></div>
            <div className="font-sub text-z-muted text-[8px] sm:text-[9px] tracking-widest uppercase mt-1">Projets</div>
          </div>
          <div className="flex-1 py-3 border-r border-z-blue/15">
            <div className="font-display font-bold text-2xl sm:text-3xl text-z-text">{yearsOfExperience}<span className="text-z-blue">+</span></div>
            <div className="font-sub text-z-muted text-[8px] sm:text-[9px] tracking-widest uppercase mt-1">Années</div>
          </div>
          <div className="flex-1 py-3">
            <div className="font-display font-bold text-2xl sm:text-3xl text-z-text">{categoriesCount}</div>
            <div className="font-sub text-z-muted text-[8px] sm:text-[9px] tracking-widest uppercase mt-1">Univers</div>
          </div>
        </div>
      </div>

      {/* --- PELLICULE DÉFILANTE (MARQUEE) --- */}
      {displayProjects.length > 0 && (
        <div className="w-full relative z-10 flex flex-col items-center mt-4">
          <div className="w-full max-w-7xl overflow-hidden mask-edges py-2">
            <div className="flex w-max gap-6 group">
              <div className="flex shrink-0 items-center gap-6 animate-marquee group-hover:[animation-play-state:paused]">
                {displayProjects.map((p, idx) => (
                  <Link 
                    key={`m1-${idx}`} 
                    href={`/projet/${p.slug}`}
                    className="relative block aspect-video w-36 sm:w-48 lg:w-56 rounded-xl overflow-hidden border border-z-blue/10 shadow-xl transition-all duration-300 hover:border-z-blue hover:scale-105 cursor-pointer"
                  >
                    <Image 
                      src={p.url} 
                      alt={`Aperçu du projet ${p.titre}`}
                      fill
                      sizes="(max-width: 1024px) 200px, 250px"
                      className="object-cover filter saturate-50 hover:saturate-100 transition-all duration-300" 
                    />
                  </Link>
                ))}
              </div>
              <div className="flex shrink-0 items-center gap-6 animate-marquee group-hover:[animation-play-state:paused]">
                {displayProjects.map((p, idx) => (
                  <Link 
                    key={`m2-${idx}`} 
                    href={`/projet/${p.slug}`}
                    className="relative block aspect-video w-36 sm:w-48 lg:w-56 rounded-xl overflow-hidden border border-z-blue/10 shadow-xl transition-all duration-300 hover:border-z-blue hover:scale-105 cursor-pointer"
                  >
                    <Image 
                      src={p.url} 
                      alt={`Aperçu du projet ${p.titre}`}
                      fill
                      sizes="(max-width: 1024px) 200px, 250px"
                      className="object-cover filter saturate-50 hover:saturate-100 transition-all duration-300" 
                    />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
