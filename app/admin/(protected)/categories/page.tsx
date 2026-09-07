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
  Trash2, 
  FolderOpen,
  Save
} from 'lucide-react';
import Link from 'next/link';

interface Categorie {
  id: string;
  name: string;
  slug: string;
  projet: { id: string }[];
}

export default function CategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Categorie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // États pour le formulaire d'ajout
  const [showForm, setShowForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newSlug, setNewSlug] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('categorie')
      .select('*, projet(id)')
      .eq('user_id', process.env.NEXT_PUBLIC_PORTFOLIO_USER_ID)
      .order('name', { ascending: true });

    if (!error && data) {
      setCategories(data as Categorie[]);
    } else {
      console.error("Erreur lors de la récupération des catégories :", error);
    }
    setIsLoading(false);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setNewName(val);
    setNewSlug(
      val
        .toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Supprime les accents
        .replace(/[^a-z0-9\s-]/g, '') // Garde uniquement lettres, chiffres, espaces et tirets
        .trim()
        .replace(/\s+/g, '-') // Remplace les espaces par des tirets
    );
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-z-bg text-z-text flex flex-col md:flex-row">
      
      {/* --- SIDEBAR --- */}
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
          <Link href="/admin/dashboard" className="w-full flex items-center gap-3 px-4 py-3 text-z-muted hover:text-white hover:bg-white/5 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors">
            <FolderKanban size={16} />
            Projets
          </Link>
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-z-blue/10 text-z-blue rounded-lg text-xs font-bold uppercase tracking-widest border border-z-blue/20 cursor-default">
            <Tags size={16} />
            Catégories
          </button>
          <Link href="/admin/configuration" className="w-full flex items-center gap-3 px-4 py-3 text-z-muted hover:text-white hover:bg-white/5 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors">
            <Settings size={16} />
            Configuration
          </Link>
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
              Catégories
            </h1>
            <p className="font-body text-sm text-z-muted mt-1">
              Organisez vos projets par type de prestation.
            </p>
          </div>
          <button 
            onClick={() => setShowForm(!showForm)}
            className="btn-blue px-5 py-2.5 rounded-lg flex items-center justify-center gap-2 text-xs font-bold tracking-widest shadow-lg shadow-z-blue/20 hover:scale-105 transition-all"
          >
            <Plus size={16} />
            Nouvelle Catégorie
          </button>
        </header>

        {showForm && (
          <div className="bg-z-card border border-z-blue/30 rounded-xl p-6 mb-8 shadow-[0_0_20px_rgba(0,123,255,0.1)] relative z-10">
            <h3 className="font-sub text-xs uppercase tracking-widest text-z-blue mb-4">Créer une catégorie</h3>
            <div className="flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1 w-full space-y-2">
                <label className="text-[10px] uppercase font-bold tracking-widest text-z-muted ml-1">Nom de la catégorie</label>
                <input 
                  type="text" 
                  value={newName} 
                  onChange={handleNameChange}
                  className="w-full bg-z-bg border border-z-border rounded-lg py-3 px-4 text-sm focus:border-z-blue focus:outline-none transition-colors" 
                  placeholder="Ex: Post Production"
                />
              </div>
              <div className="flex-1 w-full space-y-2">
                <label className="text-[10px] uppercase font-bold tracking-widest text-z-muted ml-1">Slug généré (URL)</label>
                <input 
                  type="text" 
                  value={newSlug} 
                  onChange={(e) => setNewSlug(e.target.value)}
                  className="w-full bg-z-bg border border-z-border rounded-lg py-3 px-4 text-sm text-z-muted focus:border-z-blue focus:outline-none transition-colors" 
                />
              </div>
              <button className="btn-blue h-11.5 px-6 rounded-lg font-bold text-xs tracking-widest flex items-center gap-2 hover:scale-105 transition-transform">
                <Save size={16} /> Enregistrer
              </button>
            </div>
          </div>
        )}

        <section className="bg-z-card border border-z-border rounded-xl overflow-hidden relative z-10 shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 border-b border-z-border font-sub text-[10px] uppercase tracking-widest text-z-muted">
                  <th className="p-4 font-bold">Nom</th>
                  <th className="p-4 font-bold">Slug (URL)</th>
                  <th className="p-4 font-bold text-center">Projets liés</th>
                  <th className="p-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-z-border">
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <tr key={i} className="animate-pulse bg-white/1">
                      <td className="p-4"><div className="h-4 w-32 bg-z-blue/10 rounded"></div></td>
                      <td className="p-4"><div className="h-4 w-24 bg-z-blue/10 rounded"></div></td>
                      <td className="p-4"><div className="h-6 w-10 mx-auto bg-z-blue/10 rounded-full"></div></td>
                      <td className="p-4 text-right flex justify-end gap-2">
                        <div className="h-8 w-8 bg-z-blue/10 rounded"></div>
                      </td>
                    </tr>
                  ))
                ) : categories.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-12 text-center">
                      <FolderOpen size={48} className="mx-auto text-z-muted/30 mb-4" />
                      <p className="font-body text-z-muted">Aucune catégorie existante.</p>
                    </td>
                  </tr>
                ) : (
                  categories.map((cat) => (
                    <tr key={cat.id} className="hover:bg-white/2 transition-colors">
                      <td className="p-4 font-display font-bold text-sm tracking-wide text-white">
                        {cat.name}
                      </td>
                      <td className="p-4 font-body text-xs text-z-muted">
                        /{cat.slug}
                      </td>
                      <td className="p-4 text-center">
                        <span className="px-3 py-1 bg-z-blue/10 text-z-blue border border-z-blue/20 rounded-full text-[10px] font-bold">
                          {cat.projet?.length || 0}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
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
