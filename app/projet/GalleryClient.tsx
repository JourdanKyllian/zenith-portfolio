'use client';

import { useState, useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';
import ProjectCard from '@/components/project/ProjectCard';
import { CategorieSummary, ProjetSummary } from '@/types';
import type { GallerySort } from './page';

interface GalleryClientProps {
  projets: ProjetSummary[];
  categories: CategorieSummary[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  activeCategory: string;
  initialSearch: string;
  initialSort: GallerySort;
}

/**
 * Interface client interactive de la galerie globale.
 * Pilote la recherche, le tri, le filtrage par catégorie et la pagination serveur via les paramètres d'URL.
 */
export default function GalleryClient({
  projets,
  categories,
  currentPage,
  totalPages,
  totalCount,
  pageSize,
  activeCategory,
  initialSearch,
  initialSort,
}: GalleryClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [searchInput, setSearchInput] = useState(initialSearch);

  function navigateWithParams(next: {
    page?: number;
    category?: string;
    q?: string;
    sort?: GallerySort;
  }) {
    const params = new URLSearchParams();
    const targetCategory = next.category ?? activeCategory;
    const targetQ = (next.q ?? searchInput).trim();
    const targetSort = next.sort ?? initialSort;
    const targetPage = next.page ?? 1;

    if (targetCategory && targetCategory !== 'all') params.set('category', targetCategory);
    if (targetQ) params.set('q', targetQ);
    if (targetSort !== 'recent') params.set('sort', targetSort);
    if (targetPage > 1) params.set('page', targetPage.toString());

    const qs = params.toString();
    startTransition(() => {
      router.push(qs ? `/projet?${qs}` : '/projet');
    });
  }

  useEffect(() => {
    const trimmed = searchInput.trim();
    if (trimmed === initialSearch) return;
    const timer = setTimeout(() => {
      navigateWithParams({ q: trimmed, page: 1 });
    }, 350);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  const startItem = totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalCount);

  const pageNumbers: (number | 'ellipsis')[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || Math.abs(i - currentPage) <= 1) {
      pageNumbers.push(i);
    } else if (pageNumbers[pageNumbers.length - 1] !== 'ellipsis') {
      pageNumbers.push('ellipsis');
    }
  }

  return (
    <main className="min-h-screen bg-z-bg text-z-text pb-24">
      <header className="max-w-7xl mx-auto px-6 pt-40 pb-10">
        <span className="font-sub text-z-blue text-[10px] font-bold uppercase tracking-[0.5em] mb-4 block">
          Archives
        </span>
        <h1 className="font-display font-bold text-5xl sm:text-8xl uppercase tracking-tighter mb-6">
          La <span className="text-glow">Galerie</span>
        </h1>

        <p className="font-body text-z-muted text-sm sm:text-base max-w-2xl leading-relaxed mb-8">
          Chaque projet est le fruit d&apos;une écoute attentive et d&apos;une analyse rigoureuse de vos objectifs. Chez Zenith Production, nous décortiquons vos besoins pour concevoir des réalisations visuelles et audiovisuelles sur mesure, sans détour et avec une exigence absolue de qualité.
        </p>

        {/* Barre de recherche & tri */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-z-muted pointer-events-none"
            />
            <input
              type="search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Rechercher un projet par titre..."
              aria-label="Rechercher un projet"
              className="w-full bg-z-card border border-z-border rounded-xl py-3.5 pl-11 pr-10 text-sm text-z-text placeholder:text-z-muted/60 focus:border-z-blue focus:outline-none transition-colors"
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => {
                  setSearchInput('');
                  navigateWithParams({ q: '', page: 1 });
                }}
                aria-label="Effacer la recherche"
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-z-muted hover:text-white transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <div className="relative sm:w-56">
            <ArrowUpDown
              size={14}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-z-blue pointer-events-none"
            />
            <select
              value={initialSort}
              onChange={(e) => navigateWithParams({ sort: e.target.value as GallerySort, page: 1 })}
              aria-label="Trier les projets"
              className="w-full bg-z-card border border-z-border rounded-xl py-3.5 pl-10 pr-4 text-xs font-sub font-bold uppercase tracking-wider text-z-text focus:border-z-blue focus:outline-none transition-colors appearance-none cursor-pointer"
            >
              <option value="recent">Plus récents</option>
              <option value="oldest">Plus anciens</option>
              <option value="az">Ordre A → Z</option>
            </select>
          </div>
        </div>

        {/* Filtres par catégorie */}
        <nav
          className="flex flex-wrap gap-3 border-b border-z-blue/10 pb-8"
          aria-label="Filtrage par univers"
        >
          <button
            type="button"
            onClick={() => navigateWithParams({ category: 'all', page: 1 })}
            className={`px-5 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border cursor-pointer ${
              activeCategory === 'all'
                ? 'bg-z-blue text-white border-z-blue shadow-lg shadow-z-blue/20'
                : 'bg-z-card text-z-muted border-z-blue/5 hover:border-z-blue/30 hover:text-z-text'
            }`}
          >
            Tous
          </button>

          {categories.map((cat) => (
            <button
              type="button"
              key={cat.id}
              onClick={() => navigateWithParams({ category: cat.slug, page: 1 })}
              className={`px-5 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border cursor-pointer ${
                activeCategory === cat.slug
                  ? 'bg-z-blue text-white border-z-blue shadow-lg shadow-z-blue/20'
                  : 'bg-z-card text-z-muted border-z-blue/5 hover:border-z-blue/30 hover:text-z-text'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </nav>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-5 text-xs text-z-muted font-body">
          <div className="flex items-center gap-3">
            <span>
              {totalCount > 0
                ? `Affichage ${startItem}–${endItem} sur ${totalCount} projet${totalCount > 1 ? 's' : ''}`
                : 'Aucun projet trouvé'}
            </span>
            {isPending && (
              <span className="font-sub text-[10px] uppercase tracking-widest text-z-blue animate-pulse">
                Chargement...
              </span>
            )}
          </div>

          {totalPages > 1 && (
            <div className="inline-flex items-center gap-1.5 ml-auto" aria-label="Pagination rapide">
              <button
                type="button"
                disabled={currentPage <= 1 || isPending}
                onClick={() => navigateWithParams({ page: currentPage - 1 })}
                aria-label="Page précédente"
                className="w-8 h-8 rounded-lg bg-z-card border border-z-border flex items-center justify-center text-z-muted hover:text-white hover:border-z-blue/40 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                <ChevronLeft size={14} />
              </button>
              <span className="px-2 font-sub text-[11px] font-bold tracking-wider text-z-text/80 tabular-nums">
                {currentPage} / {totalPages}
              </span>
              <button
                type="button"
                disabled={currentPage >= totalPages || isPending}
                onClick={() => navigateWithParams({ page: currentPage + 1 })}
                aria-label="Page suivante"
                className="w-8 h-8 rounded-lg bg-z-card border border-z-border flex items-center justify-center text-z-muted hover:text-white hover:border-z-blue/40 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          )}
        </div>
      </header>

      <section className={`max-w-7xl mx-auto px-6 transition-opacity duration-200 ${isPending ? 'opacity-60' : 'opacity-100'}`}>
        {projets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {projets.map((projet) => (
              <ProjectCard key={projet.id} project={projet} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 rounded-2xl border border-z-border bg-z-card/40 text-z-muted font-body text-sm space-y-4">
            <p>Aucun projet ne correspond à votre recherche pour le moment.</p>
            {(activeCategory !== 'all' || initialSearch) && (
              <button
                type="button"
                onClick={() => {
                  setSearchInput('');
                  navigateWithParams({ category: 'all', q: '', sort: 'recent', page: 1 });
                }}
                className="btn-outline px-5 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-widest cursor-pointer"
              >
                Réinitialiser les filtres
              </button>
            )}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <nav
            className="mt-16 flex items-center justify-center gap-2 flex-wrap"
            aria-label="Pagination de la galerie"
          >
            <button
              type="button"
              disabled={currentPage <= 1 || isPending}
              onClick={() => navigateWithParams({ page: currentPage - 1 })}
              className="px-4 py-2.5 rounded-lg bg-z-card border border-z-border text-xs font-sub font-bold uppercase tracking-wider text-z-muted hover:text-white hover:border-z-blue/40 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <ChevronLeft size={14} /> Précédent
            </button>

            {pageNumbers.map((item, idx) =>
              item === 'ellipsis' ? (
                <span key={`ellipsis-${idx}`} className="px-2 text-z-muted">
                  …
                </span>
              ) : (
                <button
                  type="button"
                  key={item}
                  disabled={isPending}
                  onClick={() => navigateWithParams({ page: item })}
                  aria-current={item === currentPage ? 'page' : undefined}
                  className={`w-10 h-10 rounded-lg text-xs font-sub font-bold transition-all border cursor-pointer ${
                    item === currentPage
                      ? 'bg-z-blue text-white border-z-blue shadow-lg shadow-z-blue/25'
                      : 'bg-z-card text-z-muted border-z-border hover:border-z-blue/40 hover:text-white'
                  }`}
                >
                  {item}
                </button>
              )
            )}

            <button
              type="button"
              disabled={currentPage >= totalPages || isPending}
              onClick={() => navigateWithParams({ page: currentPage + 1 })}
              className="px-4 py-2.5 rounded-lg bg-z-card border border-z-border text-xs font-sub font-bold uppercase tracking-wider text-z-muted hover:text-white hover:border-z-blue/40 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              Suivant <ChevronRight size={14} />
            </button>
          </nav>
        )}
      </section>
    </main>
  );
}
