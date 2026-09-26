"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, Trash2, FolderOpen, Edit3, X } from 'lucide-react';
import ConfirmModal from '@/components/ui/ConfirmModal';
import Alert from '@/components/ui/Alert';
import { purgeCache } from '@/app/actions/revalidate';
import { CategoryBadge } from '@/components/CategoryBadge';
import ColorPicker from '@/components/ui/ColorPicker';
import { getCategoryStyle } from '@/config/colors';
import SubmitButton, { SubmitStatus } from '@/components/admin/SubmitButton';

interface Categorie {
  id: string;
  name: string;
  slug: string;
  color: string | null;
  projet: { id: string }[];
}

const PRESET_COLORS = [
  { name: 'Bleu', hex: '#3B82F6' },
  { name: 'Rose', hex: '#EC4899' },
  { name: 'Violet', hex: '#A855F7' },
  { name: 'Vert', hex: '#10B981' },
  { name: 'Jaune', hex: '#F59E0B' },
  { name: 'Orange', hex: '#F97316' },
  { name: 'Rouge', hex: '#EF4444' },
  { name: 'Blanc', hex: '#E8E8F8' },
];

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Categorie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [newSlug, setNewSlug] = useState('');
  const [newColor, setNewColor] = useState('');
  
  const [formMessage, setFormMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);
  const [status, setStatus] = useState<SubmitStatus>('idle');

  const [deleteTarget, setDeleteTarget] = useState<{ id: string, name: string } | null>(null);

  const fetchCategories = async () => {
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

  useEffect(() => {
    fetchCategories();
  }, []);

  const resetForm = () => {
    setNewName('');
    setNewSlug('');
    setNewColor('');
    setEditingId(null);
    setShowForm(false);
    setFormMessage(null);
  };

  const handleEditClick = (cat: Categorie) => {
    setNewName(cat.name);
    setNewSlug(cat.slug);
    setNewColor(cat.color || '');
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
    
    setStatus('loading');
    setFormMessage(null);

    const safeName = newName.replace(/"/g, '""');
    
    let query = supabase
      .from('categorie')
      .select('id')
      .eq('user_id', process.env.NEXT_PUBLIC_PORTFOLIO_USER_ID)
      .or(`name.eq."${safeName}",slug.eq."${newSlug}"`);
      
    if (editingId) query = query.neq('id', editingId);

    const { data: existingData } = await query;

    if (existingData && existingData.length > 0) {
      setStatus('error');
      setFormMessage({ text: "Cette catégorie (nom ou slug) existe déjà.", type: 'error' });
      document.getElementById('category-form')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => setStatus('idle'), 3000);
      return; 
    }

    const catData = { 
      name: newName, 
      slug: newSlug, 
      color: newColor || null,
      user_id: process.env.NEXT_PUBLIC_PORTFOLIO_USER_ID 
    };

    if (editingId) {
      const { error } = await supabase.from('categorie').update(catData).eq('id', editingId);

      if (!error) {
        await purgeCache(); 
        setCategories(categories.map(c => c.id === editingId ? { ...c, ...catData } : c).sort((a, b) => a.name.localeCompare(b.name)));
        setStatus('success');
        setFormMessage({ text: "Catégorie mise à jour avec succès !", type: 'success' });
        setTimeout(() => { setStatus('idle'); resetForm(); }, 1500);
      } else {
        setStatus('error');
        setFormMessage({ text: error.message, type: 'error' });
        document.getElementById('category-form')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => setStatus('idle'), 3000);
      }
    } else {
      const { data, error } = await supabase.from('categorie').insert([catData]).select('*, projet(id)').single();

      if (!error && data) {
        await purgeCache(); 
        setCategories([...categories, data as Categorie].sort((a, b) => a.name.localeCompare(b.name)));
        setStatus('success');
        setFormMessage({ text: "Catégorie créée avec succès !", type: 'success' });
        setTimeout(() => { setStatus('idle'); resetForm(); }, 1500);
      } else {
        setStatus('error');
        setFormMessage({ text: error?.message || "Erreur d'insertion", type: 'error' });
        document.getElementById('category-form')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => setStatus('idle'), 3000);
      }
    }
  };

  const requestDelete = (id: string, name: string) => {
    const skipUntil = localStorage.getItem('skipDeleteConfirmUntil');
    if (skipUntil && parseInt(skipUntil) > new Date().getTime()) {
      executeDelete(id);
    } else {
      setDeleteTarget({ id, name });
    }
  };

  const executeDelete = async (id: string) => {
    setDeleteTarget(null);
    const { error } = await supabase.from('categorie').delete().eq('id', id);
    if (!error) {
      await purgeCache(); 
      setCategories(categories.filter(c => c.id !== id));
    }
  };

  return (
    <>
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 relative z-10">
        <div>
          <h1 className="font-display font-bold text-3xl uppercase tracking-wider text-white">Catégories</h1>
          <p className="font-body text-sm text-z-muted mt-1">Organisez vos projets par type de prestation.</p>
        </div>
        {!showForm && (
          <button onClick={() => { resetForm(); setShowForm(true); }} className="btn-blue px-5 py-2.5 rounded-lg flex items-center justify-center gap-2 text-xs font-bold tracking-widest shadow-lg shadow-z-blue/20 hover:scale-105 transition-all">
            <Plus size={16} /> Nouvelle Catégorie
          </button>
        )}
      </header>

      {showForm && (
        <div id="category-form" className="bg-z-card border border-z-blue/30 rounded-xl p-6 mb-8 shadow-[0_0_20px_rgba(0,123,255,0.1)] relative z-10 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-sub text-xs uppercase tracking-widest text-z-blue">
              {editingId ? 'Modifier la catégorie' : 'Créer une catégorie'}
            </h3>
            <button onClick={resetForm} className="text-z-muted hover:text-white transition-colors"><X size={18} /></button>
          </div>
          
          {formMessage && <div className="mb-6"><Alert type={formMessage.type}>{formMessage.text}</Alert></div>}

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2"><label className="text-[10px] uppercase font-bold tracking-widest text-z-muted ml-1">Nom de la catégorie</label><input type="text" value={newName} onChange={handleNameChange} className="w-full bg-z-bg border border-z-border rounded-lg py-3 px-4 text-sm focus:border-z-blue focus:outline-none transition-colors" placeholder="Ex: Post Production" /></div>
              <div className="space-y-2"><label className="text-[10px] uppercase font-bold tracking-widest text-z-muted ml-1">Slug généré (URL)</label><input type="text" value={newSlug} onChange={(e) => { setNewSlug(e.target.value); setFormMessage(null); }} className="w-full bg-z-bg border border-z-border rounded-lg py-3 px-4 text-sm text-z-muted focus:border-z-blue focus:outline-none transition-colors" /></div>
            </div>

            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between mb-1">
                <label className="text-[10px] uppercase font-bold tracking-widest text-z-muted ml-1">Couleur visuelle</label>
                {newName && <CategoryBadge category={{ name: newName, color: newColor }} className="px-2 py-0.5 text-[9px]" />}
              </div>

              <div className="flex flex-wrap gap-2 mb-2">
                <button type="button" onClick={() => setNewColor('')} className={`px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-widest border transition-all ${!newColor ? 'bg-z-card text-white border-z-blue ring-1 ring-z-blue/50 scale-105 shadow-md' : 'bg-z-bg text-z-muted border-z-border hover:border-z-blue/30'}`}>Gris par défaut</button>
                {PRESET_COLORS.map(preset => {
                  const isSelected = newColor.toUpperCase() === preset.hex.toUpperCase();
                  const style = getCategoryStyle(preset.hex);
                  return (
                    <button key={preset.hex} type="button" onClick={() => setNewColor(preset.hex)} style={style} className={`px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-widest border transition-all ${isSelected ? 'scale-105 shadow-md opacity-100 ring-1' : 'opacity-50 hover:opacity-100 hover:scale-105'}`}>
                      {preset.name}
                    </button>
                  );
                })}
              </div>
              <ColorPicker value={newColor} onChange={setNewColor} />
            </div>

            <div className="pt-4 border-t border-z-border flex justify-end">
              <SubmitButton 
                status={status}
                onClick={handleSaveCategorie}
                disabled={!newName}
                idleText={editingId ? 'Mettre à jour' : 'Enregistrer'}
                className="py-3 px-6 text-xs"
              />
            </div>
          </div>
        </div>
      )}

      <section className="bg-z-card border border-z-border rounded-xl overflow-hidden relative z-10 shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-z-border font-sub text-[10px] uppercase tracking-widest text-z-muted">
                <th className="p-4 font-bold">Catégorie</th>
                <th className="p-4 font-bold text-center">Projets liés</th>
                <th className="p-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-z-border">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i} className="animate-pulse bg-white/1">
                    <td className="p-4"><div className="h-6 w-32 bg-z-blue/10 rounded"></div></td>
                    <td className="p-4"><div className="h-6 w-10 mx-auto bg-z-blue/10 rounded-full"></div></td>
                    <td className="p-4 text-right flex justify-end gap-2"><div className="h-8 w-8 bg-z-blue/10 rounded"></div></td>
                  </tr>
                ))
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan={3} className="p-12 text-center">
                    <FolderOpen size={48} className="mx-auto text-z-muted/30 mb-4" />
                    <p className="font-body text-z-muted">Aucune catégorie existante.</p>
                  </td>
                </tr>
              ) : (
                categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-white/2 transition-colors">
                    <td className="p-4"><CategoryBadge category={{ name: cat.name, color: cat.color }} /></td>
                    <td className="p-4 text-center"><span className="px-3 py-1 bg-z-blue/10 text-z-blue border border-z-blue/20 rounded-full text-[10px] font-bold">{cat.projet?.length || 0}</span></td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleEditClick(cat)} className="p-2 text-z-muted hover:text-white hover:bg-white/5 rounded transition-colors cursor-pointer" title="Modifier"><Edit3 size={16} /></button>
                        <button onClick={() => requestDelete(cat.id, cat.name)} className="p-2 text-z-muted hover:text-red-400 hover:bg-red-400/10 rounded transition-colors cursor-pointer" title="Supprimer"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <ConfirmModal isOpen={deleteTarget !== null} title={deleteTarget?.name || ''} onConfirm={() => deleteTarget && executeDelete(deleteTarget.id)} onCancel={() => setDeleteTarget(null)} />
    </>
  );
}
