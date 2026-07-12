'use client';

import { useState } from 'react';
import Navbar from '../../components/Navbar';
import ProjectCard from '../../components/ProjectCard';
import { Projet, Categorie } from '@/types'; // Ajout de Categorie ici

export default function GalleryClient({ 
  initialProjets, 
  toutesLesCategories 
}: { 
  initialProjets: Projet[];
  toutesLesCategories: Categorie[]; 
}) {
  const [activeFilter, setActiveFilter] = useState<string>('all');

  // Filtrage ultra-rapide basé directement sur le slug
  const projetsFiltres = initialProjets.filter((p) => {
    if (activeFilter === 'all') return true;
    return p.categorie?.slug === activeFilter;
  });

  return (
    <main className="min-h-screen bg-z-bg text-z-text pb-24">
      <Navbar />

      <header className="max-w-7xl mx-auto px-6 pt-40 pb-12">
        <span className="font-sub text-z-blue text-[10px] font-bold uppercase tracking-[0.5em] mb-4 block">Archives</span>
        <h1 className="font-display font-bold text-5xl sm:text-8xl uppercase tracking-tighter mb-8">
          La <span className="text-glow">Galerie</span>
        </h1>

        {/* Boutons de Filtres */}
        <div className="flex flex-wrap gap-3 mt-12 border-b border-z-blue/10 pb-8">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-5 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border ${
              activeFilter === 'all'
                ? 'bg-z-blue text-white border-z-blue shadow-lg shadow-z-blue/20'
                : 'bg-z-card text-z-muted border-z-blue/5 hover:border-z-blue/30 hover:text-z-text'
            }`}
          >
            Tous ({initialProjets.length})
          </button>

          {/* On utilise maintenant directement la liste des catégories venue de Supabase */}
          {toutesLesCategories.map((cat) => {
            const count = initialProjets.filter(p => p.categorie?.slug === cat.slug).length;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveFilter(cat.slug)}
                className={`px-5 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border ${
                  activeFilter === cat.slug
                    ? 'bg-z-blue text-white border-z-blue shadow-lg shadow-z-blue/20'
                    : 'bg-z-card text-z-muted border-z-blue/5 hover:border-z-blue/30 hover:text-z-text'
                }`}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>
      </header>

      {/* Grille de résultats */}
      <section className="max-w-7xl mx-auto px-6">
        {projetsFiltres.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {projetsFiltres.map((projet) => (
              <ProjectCard key={projet.id} project={projet} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-z-muted font-body text-sm">
            Aucun projet ne correspond à cette catégorie pour le moment.
          </div>
        )}
      </section>
    </main>
  );
}