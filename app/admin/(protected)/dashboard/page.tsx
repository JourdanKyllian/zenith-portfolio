"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { 
  LogOut, 
  Plus, 
  FolderKanban, 
  Tags, 
  Settings, 
  Edit3, 
  Trash2
} from 'lucide-react';
import Link from 'next/link';
import { Projet } from '@/types';

export default function DashboardPage() {
  const router = useRouter();
  const [projets, setProjets] = useState<Projet[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProjets();
  }, []);

  const fetchProjets = async () => {
    setIsLoading(true);
    // On récupère les projets spécifiques à ce tenant
    const { data, error } = await supabase
      .from('projet')
      .select('*, categorie(*)')
      .eq('user_id', process.env.NEXT_PUBLIC_PORTFOLIO_USER_ID)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setProjets(data as unknown as Projet[]);
    } else {
      console.error("Erreur lors de la récupération des projets :", error);
    }
    setIsLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-z-bg text-z-text flex flex-col md:flex-row">
      
      {/* --- SIDEBAR (Navigation latérale) --- */}
      <aside className="w-full md:w-64 bg-z-card border-b md:border-b-0 md:border-r border-z-border p-6 flex flex-col">
        <div className="mb-10">
          <Link href="/" className="font-martyric text-3xl text-white hover:text-z-blue transition-colors">
            ZENITH
          </Link>
          <p className="font-sub text-[9px] uppercase tracking-widest text-z-muted mt-1">
            Administration
          </p>
        </div>

        <nav className="flex-1 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-z-blue/10 text-z-blue rounded-lg text-xs font-bold uppercase tracking-widest border border-z-blue/20 cursor-default">
            <FolderKanban size={16} />
            Projets
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-z-muted hover:text-white hover:bg-white/5 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors cursor-not-allowed opacity-50">
            <Tags size={16} />
            Catégories
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-z-muted hover:text-white hover:bg-white/5 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors cursor-not-allowed opacity-50">
            <Settings size={16} />
            Configuration
          </button>
        </nav>

        <button 
          onClick={handleLogout}
          className="mt-auto flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-400/10 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer"
        >
          <LogOut size={16} />
          Déconnexion
        </button>
      </aside>

      {/* --- CONTENU PRINCIPAL --- */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto relative">
        <div className="absolute top-0 right-0 w-125 h-125 bg-z-blue/5 blur-[120px] pointer-events-none" />

        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 relative z-10">
          <div>
            <h1 className="font-display font-bold text-3xl uppercase tracking-wider text-white">
              Gestion des Projets
            </h1>
            <p className="font-body text-sm text-z-muted mt-1">
              Gérez les réalisations visibles sur le portfolio public.
            </p>
          </div>
          <button className="btn-blue px-5 py-2.5 rounded-lg flex items-center justify-center gap-2 text-xs font-bold tracking-widest shadow-lg shadow-z-blue/20 hover:scale-105 transition-all">
            <Plus size={16} />
            Nouveau Projet
          </button>
        </header>

        {/* --- LISTE DES PROJETS --- */}
        <section className="bg-z-card border border-z-border rounded-xl overflow-hidden relative z-10 shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 border-b border-z-border font-sub text-[10px] uppercase tracking-widest text-z-muted">
                  <th className="p-4 font-bold">Projet</th>
                  <th className="p-4 font-bold">Catégorie</th>
                  <th className="p-4 font-bold">Statut</th>
                  <th className="p-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-z-border">
                
                {isLoading ? (
                  /* --- SKELETON LOADER (Génère 4 fausses lignes de chargement) --- */
                  Array.from({ length: 4 }).map((_, i) => (
                    <tr key={i} className="animate-pulse bg-white/1">
                      <td className="p-4">
                        <div className="h-4 w-48 bg-z-blue/10 rounded mb-2"></div>
                        <div className="h-3 w-32 bg-z-blue/5 rounded"></div>
                      </td>
                      <td className="p-4">
                        <div className="h-5 w-20 bg-z-blue/10 rounded"></div>
                      </td>
                      <td className="p-4">
                        <div className="h-4 w-16 bg-z-blue/10 rounded"></div>
                      </td>
                      <td className="p-4 text-right flex justify-end gap-2">
                        <div className="h-8 w-8 bg-z-blue/10 rounded"></div>
                        <div className="h-8 w-8 bg-z-blue/10 rounded"></div>
                      </td>
                    </tr>
                  ))

                ) : projets.length === 0 ? (
                  /* --- ÉTAT VIDE --- */
                  <tr>
                    <td colSpan={4} className="p-12 text-center">
                      <FolderKanban size={48} className="mx-auto text-z-muted/30 mb-4" />
                      <p className="font-body text-z-muted">Aucun projet trouvé.</p>
                    </td>
                  </tr>

                ) : (
                  /* --- DONNÉES RÉELLES --- */
                  projets.map((projet) => (
                    <tr key={projet.id} className="hover:bg-white/2 transition-colors">
                      <td className="p-4">
                        <div className="font-display font-bold text-sm tracking-wide text-white">
                          {projet.titre}
                        </div>
                        <div className="font-body text-xs text-z-muted mt-0.5 truncate max-w-62.5">
                          {projet.slug}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-1 bg-z-bg border border-z-border rounded text-[10px] font-sub font-bold uppercase tracking-widest text-z-muted">
                          {projet.categorie?.name || 'Général'}
                        </span>
                      </td>
                      <td className="p-4">
                        {projet.en_ligne ? (
                          <span className="flex items-center gap-1.5 text-emerald-400 text-xs font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Public
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5 text-amber-400 text-xs font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span> Brouillon
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-2 text-z-muted hover:text-white hover:bg-z-blue/20 rounded transition-colors cursor-pointer" title="Modifier">
                            <Edit3 size={16} />
                          </button>
                          <button className="p-2 text-z-muted hover:text-red-400 hover:bg-red-400/10 rounded transition-colors cursor-pointer" title="Supprimer">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
                
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
