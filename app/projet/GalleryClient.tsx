"use client";

import { useState, useMemo } from 'react';
import Navbar from '@/components/Navbar';
import ProjectCard from '@/components/ProjectCard';
import ProjectFilters from '@/components/ProjectFilters';
import { Projet } from '@/types';

export default function GalleryClient({ initialProjets }: { initialProjets: Projet[] }) {
  const [activeFilter, setActiveFilter] = useState('all');

  const categories = useMemo(() => {
    const map = new Map();
    
    initialProjets.forEach(p => {
      if (p.categorie && !map.has(p.categorie.slug)) {
        map.set(p.categorie.slug, {
          id: p.categorie.id,
          name: p.categorie.name,
          slug: p.categorie.slug
        });
      }
    });

    return Array.from(map.values());
  }, [initialProjets]);

  const filteredProjects = activeFilter === 'all' 
    ? initialProjets 
    : initialProjets.filter(p => p.categorie?.slug === activeFilter);

  return (
    <main className="min-h-screen bg-z-bg text-z-text pb-20 overflow-x-hidden">
      <Navbar />

      <section className="pt-32 px-6 max-w-7xl mx-auto">
        <header className="mb-16">
          <span className="font-sub text-z-blue text-[10px] font-bold uppercase tracking-[0.4em] mb-4 block">
            Archive
          </span>
          <h1 className="font-display font-bold text-5xl sm:text-7xl uppercase tracking-tighter mb-10">
            Explorer les <span className="text-glow">Travaux</span>
          </h1>

          {/* C'est ici que la magie opère désormais */}
          <ProjectFilters 
            categories={categories} 
            activeFilter={activeFilter} 
            onFilterChange={setActiveFilter} 
          />
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