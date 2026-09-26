"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, FolderKanban, Edit3, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { Projet } from '@/types';
import ConfirmModal from '@/components/ui/ConfirmModal';
import DeleteBlockerModal from '@/components/ui/DeleteBlockerModal';
import { purgeCache } from '@/app/actions/revalidate';

export default function DashboardPage() {
  const [projets, setProjets] = useState<Projet[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals de suppression
  const [deleteTarget, setDeleteTarget] = useState<{ id: number, titre: string } | null>(null);
  const [blockerTarget, setBlockerTarget] = useState<{ id: number, titre: string, count: number } | null>(null);
  const [isForceDeleting, setIsForceDeleting] = useState(false);

  const fetchProjets = async () => {
    // CORRECTION : On demande spécifiquement la liste des sous-projets pour vérifier s'il y a des dépendances
    const { data, error } = await supabase
      .from('projet')
      .select('*, categorie(*), sousprojet(id)')
      .eq('user_id', process.env.NEXT_PUBLIC_PORTFOLIO_USER_ID)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setProjets(data as unknown as Projet[]);
    } else {
      console.error("Erreur lors de la récupération des projets :", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchProjets();
  }, []);

  const requestDelete = (projet: Projet) => {
    const linkedSubProjectsCount = projet.sousprojet?.length || 0;
    
    // S'il y a des sous-projets, on bloque avec le modal adapté
    if (linkedSubProjectsCount > 0) {
      setBlockerTarget({ id: projet.id, titre: projet.titre, count: linkedSubProjectsCount });
      return;
    }

    const skipUntil = localStorage.getItem('skipDeleteConfirmUntil');
    if (skipUntil && parseInt(skipUntil) > new Date().getTime()) {
      executeDelete(projet.id); 
    } else {
      setDeleteTarget({ id: projet.id, titre: projet.titre }); 
    }
  };

  const executeDelete = async (id: number) => {
    setDeleteTarget(null); 
    setIsLoading(true);
    const { error } = await supabase.from('projet').delete().eq('id', id);

    if (!error) {
      await purgeCache();
      setProjets(projets.filter(p => p.id !== id));
    } else {
      console.error("Erreur lors de la suppression :", error);
    }
    setIsLoading(false);
  };

  const handleForceDeleteProject = async () => {
    if (!blockerTarget) return;
    setIsForceDeleting(true);
    
    // 1. Suppression en cascade manuelle : on supprime toutes les séquences médias liées
    await supabase.from('sousprojet').delete().eq('projet_id', blockerTarget.id);
    
    // 2. On supprime le projet parent
    const { error } = await supabase.from('projet').delete().eq('id', blockerTarget.id);
    
    if (!error) {
      await purgeCache();
      setProjets(projets.filter(p => p.id !== blockerTarget.id));
      setBlockerTarget(null);
    } else {
      console.error("Erreur lors de la suppression forcée :", error);
    }
    
    setIsForceDeleting(false);
  };

  return (
    <>
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 relative z-10">
        <div>
          <h1 className="font-display font-bold text-3xl uppercase tracking-wider text-white">
            Gestion des Projets
          </h1>
          <p className="font-body text-sm text-z-muted mt-1">
            Gérez les réalisations visibles sur le portfolio public.
          </p>
        </div>
        <Link href="/admin/dashboard/projet/nouveau" className="btn-blue px-5 py-2.5 rounded-lg flex items-center justify-center gap-2 text-xs font-bold tracking-widest shadow-lg shadow-z-blue/20 hover:scale-105 transition-all">
          <Plus size={16} /> Nouveau Projet
        </Link>
      </header>

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
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="animate-pulse bg-white/1">
                    <td className="p-4"><div className="h-4 w-48 bg-z-blue/10 rounded mb-2"></div><div className="h-3 w-32 bg-z-blue/5 rounded"></div></td>
                    <td className="p-4"><div className="h-5 w-20 bg-z-blue/10 rounded"></div></td>
                    <td className="p-4"><div className="h-4 w-16 bg-z-blue/10 rounded"></div></td>
                    <td className="p-4 text-right flex justify-end gap-2"><div className="h-8 w-8 bg-z-blue/10 rounded"></div><div className="h-8 w-8 bg-z-blue/10 rounded"></div></td>
                  </tr>
                ))
              ) : projets.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-12 text-center">
                    <FolderKanban size={48} className="mx-auto text-z-muted/30 mb-4" />
                    <p className="font-body text-z-muted">Aucun projet trouvé.</p>
                  </td>
                </tr>
              ) : (
                projets.map((projet) => {
                  const linkedSubProjectsCount = projet.sousprojet?.length || 0;
                  const canDelete = linkedSubProjectsCount === 0;

                  return (
                    <tr key={projet.id} className="hover:bg-white/2 transition-colors">
                      <td className="p-4">
                        <div className="font-display font-bold text-sm tracking-wide text-white">{projet.titre}</div>
                        <div className="font-body text-xs text-z-muted mt-0.5 truncate max-w-62.5">{projet.slug}</div>
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-1 bg-z-bg border border-z-border rounded text-[10px] font-sub font-bold uppercase tracking-widest text-z-muted">
                          {projet.categorie?.name || 'Général'}
                        </span>
                      </td>
                      <td className="p-4">
                        {projet.en_ligne ? (
                          <span className="flex items-center gap-1.5 text-emerald-400 text-xs font-medium"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Public</span>
                        ) : (
                          <span className="flex items-center gap-1.5 text-amber-400 text-xs font-medium"><span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span> Brouillon</span>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/admin/dashboard/projet/${projet.id}`} className="p-2 text-z-muted hover:text-white hover:bg-z-blue/20 rounded transition-colors cursor-pointer" title="Modifier"><Edit3 size={16} /></Link>
                          
                          <button 
                              onClick={() => requestDelete(projet)} 
                              className={`p-2 rounded transition-colors cursor-pointer ${
                                canDelete 
                                  ? 'text-z-muted hover:text-red-400 hover:bg-red-400/10' 
                                  : 'text-z-muted/50 hover:text-amber-400 hover:bg-amber-400/10'
                              }`} 
                              title={canDelete ? "Supprimer" : "Suppression impossible : séquences liées"}
                          >
                              <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>

      <ConfirmModal isOpen={deleteTarget !== null} title={deleteTarget?.titre || ''} onConfirm={() => deleteTarget && executeDelete(deleteTarget.id)} onCancel={() => setDeleteTarget(null)} />

      <DeleteBlockerModal 
        isOpen={blockerTarget !== null}
        title={blockerTarget?.titre || ''}
        dependencyCount={blockerTarget?.count || 0}
        dependencyName="séquence(s) média(s)"
        explanation="En forçant la suppression, ce projet sera détruit en même temps que toutes les séquences (Vidéos, Drive, PDF) qui le composent. Les fichiers d'origine sur votre Google Drive resteront intacts."
        forceDeleteLabel="Écraser les séquences"
        isForceDeleting={isForceDeleting}
        onClose={() => setBlockerTarget(null)}
        onForceDelete={handleForceDeleteProject}
      />
    </>
  );
}
