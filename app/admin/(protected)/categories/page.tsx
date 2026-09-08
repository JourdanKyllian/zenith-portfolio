"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Plus, 
  Trash2, 
  FolderOpen,
  Save
} from 'lucide-react';
import ConfirmModal from '@/components/ui/ConfirmModal';

interface Categorie {
  id: string;
  name: string;
  slug: string;
  projet: { id: string }[];
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Categorie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [showForm, setShowForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newSlug, setNewSlug] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- NOUVEAUX ÉTATS POUR LA MODALE ---
  const [deleteTarget, setDeleteTarget] = useState<{ id: string, name: string } | null>(null);

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
    setFormError(null);
    setNewSlug(
      val
        .toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
    );
  };

  const handleSaveCategorie = async () => {
    if (!newName || !newSlug) return;
    
    setIsSubmitting(true);
    setFormError(null);

    const safeName = newName.replace(/"/g, '""');
    const { data: existingData } = await supabase
      .from('categorie')
      .select('id')
      .eq('user_id', process.env.NEXT_PUBLIC_PORTFOLIO_USER_ID)
      .or(`name.eq."${safeName}",slug.eq."${newSlug}"`);

    if (existingData && existingData.length > 0) {
      setFormError("Cette catégorie (nom ou slug) existe déjà.");
      setIsSubmitting(false);
      return; 
    }

    const { data, error } = await supabase
      .from('categorie')
      .insert([{ 
        name: newName, 
        slug: newSlug, 
        user_id: process.env.NEXT_PUBLIC_PORTFOLIO_USER_ID 
      }])
      .select('*, projet(id)')
      .single();

    if (!error && data) {
      setCategories([...categories, data as Categorie].sort((a, b) => a.name.localeCompare(b.name)));
      setNewName('');
      setNewSlug('');
      setShowForm(false);
    } else {
      setFormError(error?.message || "Erreur lors de l'insertion");
    }
    setIsSubmitting(false);
  };

  // --- LOGIQUE DE SUPPRESSION ---
  const requestDelete = (id: string, name: string) => {
    const skipUntil = localStorage.getItem('skipDeleteConfirmUntil');
    if (skipUntil && parseInt(skipUntil) > Date.now()) {
      executeDelete(id);
    } else {
      setDeleteTarget({ id, name });
    }
  };

  const executeDelete = async (id: string) => {
    setDeleteTarget(null);
    const { error } = await supabase.from('categorie').delete().eq('id', id);
    if (!error) {
      setCategories(categories.filter(c => c.id !== id));
    }
  };

  return (
    <>
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
          
          {formError && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold rounded-lg">
              {formError}
            </div>
          )}

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
                onChange={(e) => { setNewSlug(e.target.value); setFormError(null); }}
                className="w-full bg-z-bg border border-z-border rounded-lg py-3 px-4 text-sm text-z-muted focus:border-z-blue focus:outline-none transition-colors" 
              />
            </div>
            <button 
              onClick={handleSaveCategorie} 
              disabled={isSubmitting}
              className="btn-blue h-11.5 px-6 rounded-lg font-bold text-xs tracking-widest flex items-center gap-2 hover:scale-105 transition-transform disabled:opacity-50"
            >
              <Save size={16} /> {isSubmitting ? '...' : 'Enregistrer'}
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
                        <button 
                          onClick={() => requestDelete(cat.id, cat.name)} // <-- MODIFICATION ICI
                          className="p-2 text-z-muted hover:text-red-400 hover:bg-red-400/10 rounded transition-colors cursor-pointer" 
                          title="Supprimer"
                        >
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

      {/* --- INJECTION DE LA MODALE --- */}
      <ConfirmModal 
        isOpen={deleteTarget !== null}
        title={deleteTarget?.name || ''}
        onConfirm={() => deleteTarget && executeDelete(deleteTarget.id)}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
}
