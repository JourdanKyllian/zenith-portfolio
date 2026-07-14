"use client";

import { Eye, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface HeroProps {
  categoriesCount: number;
  yearsOfExperience: number;
}

export default function Hero({ categoriesCount, yearsOfExperience }: HeroProps) {
  return (
    <section className="hero-bg relative min-h-screen flex flex-col items-center justify-center text-center px-4 pt-32 pb-16 overflow-hidden">
      <div className="diag-lines"></div>

      <div className="animate-fade-in relative flex items-center gap-2.5 px-4 py-2 rounded-md border border-z-blue/20 bg-z-blue/5 mb-10 overflow-hidden">
        <div className="relative w-2 h-2">
          <span className="absolute inset-0 rounded-full bg-z-blue ping-dot"></span>
          <span className="relative block w-2 h-2 rounded-full bg-z-blue"></span>
        </div>
        <span className="font-sub text-z-blue text-[10px] font-bold uppercase tracking-[0.2em]">
          Disponible · 24h/24 et 7J/7
        </span>
      </div>

      <h1 className="animate-fade-up font-display tracking-wide mb-4 leading-none text-[clamp(3rem,9vw,7rem)]">
        <span className="font-martyric text-z-text">ZENITH</span><br/>
        <span className="font-bold text-glow">PRODUCTION</span>
      </h1>

      <p className="animate-fade-up font-sub font-semibold tracking-[0.35em] uppercase text-z-muted text-sm mb-4">
        Gabin HUSSON
      </p>

      <p className="animate-fade-up font-body font-light text-z-text/70 text-base sm:text-lg max-w-lg mx-auto mb-12 leading-relaxed">
        Graphiste · Cadreur · Monteur Vidéo & Photo · Marketing
      </p>

      <div className="animate-fade-up flex flex-wrap items-center justify-center gap-4">
        <Link href="/projet" className="btn-blue px-7 py-3.5 rounded-md flex items-center gap-3 text-sm transition-transform hover:scale-105">
          <Eye size={16} />
          Explorer les projets
        </Link>
        <Link href="/contact" className="btn-outline px-7 py-3.5 rounded-md flex items-center gap-3 text-sm">
          Me contacter
          <ArrowRight size={14} />
        </Link>
      </div>

      <div className="animate-fade-up w-full max-w-md mt-20">
        <div className="flex items-center border border-z-blue/15 rounded-lg overflow-hidden bg-z-blue/5 backdrop-blur-sm">
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
    </section>
  );
}