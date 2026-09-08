"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Plus, 
  Trash2, 
  FolderOpen,
  Save,
  Edit3,
  X
} from 'lucide-react';
import ConfirmModal from '@/components/ui/ConfirmModal';
import Alert from '@/components/ui/Alert';

interface Categorie {
  id: string;
  name: string;
  slug: string;
  projet: { id: string }[];
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Categorie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // --- ÉTATS DU FORMULAIRE ---
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [newSlug, setNewSlug] = useState('');
  
  const [formMessage, setFormMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);
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

  const resetForm = () => {
    setNewName('');
    setNewSlug('');
    setEditingId(null);
    setShowForm(false);
    setFormMessage(null);
  };

  const handleEditClick = (cat: Categorie) => {
    setNewName(cat.name);
    setNewSlug(cat.slug);
    setEditingId(cat.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setNewName(val);
    setFormMessage(null);
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
    setFormMessage(null);

    const safeName = newName.replace(/"/g, '""');
    
    // Vérification des doublons (en excluant la catégorie courante si on modifie)
    let query = supabase
      .from('categorie')
      .select('id')
      .eq('user_id', process.env.NEXT_PUBLIC_PORTFOLIO_USER_ID)
      .or(`name.eq."${safeName}",slug.eq."${newSlug}"`);
      
    if (editingId) {
      query = query.neq('id', editingId);
    }

    const { data: existingData } = await query;

    if (existingData && existingData.length > 0) {
      setFormMessage({ text: "Cette catégorie (nom ou slug) existe déjà.", type: 'error' });
      setIsSubmitting(false);
      return; 
    }

    const catData = { 
      name: newName, 
      slug: newSlug, 
      user_id: process.env.NEXT_PUBLIC_PORTFOLIO_USER_ID 
    };

    if (editingId) {
      // LOGIQUE DE MODIFICATION
      const { error } = await supabase
        .from('categorie')
        .update(catData)
        .eq('id', editingId);

      if (!error) {
        setCategories(categories.map(c => c.id === editingId ? { ...c, ...catData } : c).sort((a, b) => a.name.localeCompare(b.name)));
        setFormMessage({ text: "Catégorie mise à jour avec succès !", type: 'success' });
        setTimeout(() => resetForm(), 1500);
      } else {
        setFormMessage({ text: error.message, type: 'error' });
      }
    } else {
      // LOGIQUE DE CRÉATION
      const { data, error } = await supabase
        .from('categorie')
        .insert([catData])
        .select('*, projet(id)')
        .single();

      if (!error && data) {
        setCategories([...categories, data as Categorie].sort((a, b) => a.name.localeCompare(b.name)));
        setFormMessage({ text: "Catégorie créée avec succès !", type: 'success' });
        setTimeout(() => resetForm(), 1500);
      } else {
        setFormMessage({ text: error?.message || "Erreur d'insertion", type: 'error' });
      }
    }
    
    setIsSubmitting(false);
  };

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
        {!showForm && (
          <button 
            onClick={() => { resetForm(); setShowForm(true); }}
            className="btn-blue px-5 py-2.5 rounded-lg flex items-center justify-center gap-2 text-xs font-bold tracking-widest shadow-lg shadow-z-blue/20 hover:scale-105 transition-all"
          >
            <Plus size={16} />
            Nouvelle Catégorie
          </button>
        )}
      </header>

      {showForm && (
        <div className="bg-z-card border border-z-blue/30 rounded-xl p-6 mb-8 shadow-[0_0_20px_rgba(0,123,255,0.1)] relative z-10 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-sub text-xs uppercase tracking-widest text-z-blue">
              {editingId ? 'Modifier la catégorie' : 'Créer une catégorie'}
            </h3>
            <button onClick={resetForm} className="text-z-muted hover:text-white transition-colors">
              <X size={18} />
            </button>
          </div>
          
          {formMessage && (
            <div className="mb-4">
              <Alert type={formMessage.type}>{formMessage.text}</Alert>
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
                onChange={(e) => { setNewSlug(e.target.value); setFormMessage(null); }}
                className="w-full bg-z-bg border border-z-border rounded-lg py-3 px-4 text-sm text-z-muted focus:border-z-blue focus:outline-none transition-colors" 
              />
            </div>
            <button 
              onClick={handleSaveCategorie} 
              disabled={isSubmitting || !newName}
              className="btn-blue h-11.5 px-6 rounded-lg font-bold text-xs tracking-widest flex items-center gap-2 hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100"
            >
              <Save size={16} /> {isSubmitting ? '...' : (editingId ? 'Mettre à jour' : 'Enregistrer')}
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
                          onClick={() => handleEditClick(cat)}
                          className="p-2 text-z-muted hover:text-white hover:bg-white/5 rounded transition-colors cursor-pointer" 
                          title="Modifier"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button 
                          onClick={() => requestDelete(cat.id, cat.name)}
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

      <ConfirmModal 
        isOpen={deleteTarget !== null}
        title={deleteTarget?.name || ''}
        onConfirm={() => deleteTarget && executeDelete(deleteTarget.id)}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
}
