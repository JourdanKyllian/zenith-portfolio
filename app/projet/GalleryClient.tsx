"use client";

import { useState } from 'react';
import Navbar from '../../components/Navbar';
import ProjectCard from '../../components/ProjectCard';
import { Projet } from '@/types';

export default function GalleryClient({ initialProjets }: { initialProjets: Projet[] }) {
  const [activeFilter, setActiveFilter] = useState('all');

  const categories = [
    { name: 'Tous', slug: 'all' },
    { name: 'Personnel', slug: 'perso' },
    { name: 'Professionnel', slug: 'pro' },
    { name: 'Associatif', slug: 'asso' },
    { name: 'Larauze', slug: 'larauze' },
  ];

  const filteredProjects = activeFilter === 'all' 
    ? initialProjets 
    : initialProjets.filter(p => p.categorie?.slug === activeFilter);

  return (
    <main className="min-h-screen bg-z-bg text-z-text pb-20 overflow-x-hidden">
      <Navbar />

      <section className="pt-32 px-6 max-w-7xl mx-auto">
        <header className="mb-16">
          <span className="font-sub text-z-blue text-[10px] font-bold uppercase tracking-[0.4em] mb-4 block">Archive</span>
          <h1 className="font-display font-bold text-5xl sm:text-7xl uppercase tracking-tighter mb-10">
            Explorer les <span className="text-glow">Travaux</span>
          </h1>

          <div className="flex flex-wrap gap-3 border-b border-z-blue/10 pb-8">
            {categories.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => setActiveFilter(cat.slug)}
                className={`px-6 py-2.5 rounded-full font-sub text-[10px] font-bold uppercase tracking-widest transition-all duration-300 ${
                  activeFilter === cat.slug 
                  ? 'bg-z-blue text-white shadow-lg shadow-z-blue/40 scale-105' 
                  : 'bg-z-card text-z-muted border border-z-border hover:border-z-blue/30'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects?.map((projet) => (
            <div key={projet.id} className="animate-fade-up">
              <ProjectCard project={projet} />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}