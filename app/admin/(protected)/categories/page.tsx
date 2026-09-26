"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus } from 'lucide-react';
import ConfirmModal from '@/components/ui/ConfirmModal';
import DeleteBlockerModal from '@/components/ui/DeleteBlockerModal';
import Alert from '@/components/ui/Alert';
import { purgeCache } from '@/app/actions/revalidate';
import CategoryForm from '@/components/admin/CategoryForm';
import CategoryTable from '@/components/admin/CategoryTable';

interface Categorie {
  id: string;
  name: string;
  slug: string;
  color: string | null;
  projet: { id: string }[];
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Categorie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // États de l'interface
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Categorie | null>(null);
  const [globalMessage, setGlobalMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  // Modals de suppression
  const [deleteTarget, setDeleteTarget] = useState<{ id: string, name: string } | null>(null);
  const [blockerTarget, setBlockerTarget] = useState<{ id: string, name: string, count: number } | null>(null);
  const [isForceDeleting, setIsForceDeleting] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from('categorie')
        .select('*, projet(id)')
        .eq('user_id', process.env.NEXT_PUBLIC_PORTFOLIO_USER_ID)
        .order('name', { ascending: true });

      if (!error && data) setCategories(data as Categorie[]);
      setIsLoading(false);
    };
    fetchCategories();
  }, []);

  const handleFormSuccess = (cat: Categorie, isNew: boolean) => {
    if (isNew) {
      setCategories([...categories, cat].sort((a, b) => a.name.localeCompare(b.name)));
    } else {
      setCategories(categories.map(c => c.id === cat.id ? cat : c).sort((a, b) => a.name.localeCompare(b.name)));
    }
    setShowForm(false);
    setEditingCategory(null);
  };

  const handleEditClick = (cat: Categorie) => {
    setEditingCategory(cat);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const requestDelete = (cat: Categorie) => {
    const linkedProjectsCount = cat.projet?.length || 0;
    if (linkedProjectsCount > 0) {
      setBlockerTarget({ id: cat.id, name: cat.name, count: linkedProjectsCount });
      return;
    }

    const skipUntil = localStorage.getItem('skipDeleteConfirmUntil');
    if (skipUntil && parseInt(skipUntil) > new Date().getTime()) executeDelete(cat.id);
    else setDeleteTarget({ id: cat.id, name: cat.name });
  };

  const executeDelete = async (id: string) => {
    setDeleteTarget(null);
    const { error } = await supabase.from('categorie').delete().eq('id', id);
    if (!error) {
      await purgeCache(); 
      setCategories(categories.filter(c => c.id !== id));
    }
  };

  const handleForceDeleteCategory = async () => {
    if (!blockerTarget) return;
    setIsForceDeleting(true);
    await supabase.from('projet').update({ categorie_id: null }).eq('categorie_id', blockerTarget.id);
    const { error } = await supabase.from('categorie').delete().eq('id', blockerTarget.id);
    
    if (!error) {
      await purgeCache();
      setCategories(categories.filter(c => c.id !== blockerTarget.id));
      setBlockerTarget(null);
    }
    setIsForceDeleting(false);
  };

  return (
    <>
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 relative z-10">
        <div>
          <h1 className="font-display font-bold text-3xl uppercase tracking-wider text-white">Catégories</h1>
          <p className="font-body text-sm text-z-muted mt-1">Organisez vos projets par type de prestation.</p>
        </div>
        {!showForm && (
          <button 
            onClick={() => { setEditingCategory(null); setShowForm(true); }} 
            className="btn-blue px-5 py-2.5 rounded-lg flex items-center justify-center gap-2 text-xs font-bold tracking-widest shadow-lg shadow-z-blue/20 hover:scale-105 transition-all"
          >
            <Plus size={16} /> Nouvelle Catégorie
          </button>
        )}
      </header>

      {globalMessage && (
        <div className="mb-8 animate-in fade-in slide-in-from-top-2 duration-300">
          <Alert type={globalMessage.type}>{globalMessage.text}</Alert>
        </div>
      )}

      {showForm && (
        <CategoryForm 
          initialData={editingCategory}
          onSuccess={handleFormSuccess}
          onCancel={() => { setShowForm(false); setEditingCategory(null); }}
        />
      )}

      <CategoryTable 
        categories={categories}
        isLoading={isLoading}
        onEdit={handleEditClick}
        onDelete={requestDelete}
      />

      {/* --- MODALS DE SUPPRESSION --- */}
      <ConfirmModal 
        isOpen={deleteTarget !== null} 
        title={deleteTarget?.name || ''} 
        onConfirm={() => deleteTarget && executeDelete(deleteTarget.id)} 
        onCancel={() => setDeleteTarget(null)} 
      />
      
      <DeleteBlockerModal 
        isOpen={blockerTarget !== null}
        title={blockerTarget?.name || ''}
        dependencyCount={blockerTarget?.count || 0}
        dependencyName="projet(s)"
        explanation="En forçant la suppression, tous les projets liés perdront cette catégorie et passeront au statut 'Général'. Cette action est irréversible, mais aucun de vos projets ne sera supprimé."
        forceDeleteLabel="Détacher et supprimer"
        isForceDeleting={isForceDeleting}
        onClose={() => setBlockerTarget(null)}
        onForceDelete={handleForceDeleteCategory}
      />
    </>
  );
}
