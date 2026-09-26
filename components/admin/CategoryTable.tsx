"use client";

import { FolderOpen, Edit3, Trash2 } from 'lucide-react';
import { CategoryBadge } from '@/components/CategoryBadge';
import { Categorie } from '@/types';

interface CategoryTableProps {
  categories: Categorie[];
  isLoading: boolean;
  onEdit: (cat: Categorie) => void;
  onDelete: (cat: Categorie) => void;
}

/**
 * Composant d'affichage sous forme de tableau interactif pour la gestion des catégories.
 * Intègre les actions de modification et de suppression pour chaque entrée.
 *
 * @param {Categorie[]} categories - Liste des catégories à afficher.
 * @param {boolean} isLoading - État de chargement initial des données.
 * @param {(cat: Categorie) => void} onEdit - Fonction de rappel déclenchée lors du clic sur le bouton d'édition.
 * @param {(cat: Categorie) => void} onDelete - Fonction de rappel déclenchée lors d'une demande de suppression.
 */
export default function CategoryTable({ categories, isLoading, onEdit, onDelete }: CategoryTableProps) {
  return (
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
              categories.map((cat) => {
                const linkedProjectsCount = cat.projet?.length || 0;
                const canDelete = linkedProjectsCount === 0;

                return (
                  <tr key={cat.id} className="hover:bg-white/2 transition-colors">
                    <td className="p-4"><CategoryBadge category={{ name: cat.name, color: cat.color }} /></td>
                    <td className="p-4 text-center">
                      <span className="px-3 py-1 bg-z-blue/10 text-z-blue border border-z-blue/20 rounded-full text-[10px] font-bold">
                        {linkedProjectsCount}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => onEdit(cat)} 
                          className="p-2 text-z-muted hover:text-white hover:bg-white/5 rounded transition-colors cursor-pointer" 
                          title="Modifier"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button 
                          onClick={() => onDelete(cat)} 
                          className={`p-2 rounded transition-colors cursor-pointer ${
                            canDelete ? 'text-z-muted hover:text-red-400 hover:bg-red-400/10' : 'text-z-muted/50 hover:text-amber-400 hover:bg-amber-400/10'
                          }`} 
                          title={canDelete ? "Supprimer" : "Détacher et supprimer"}
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
  );
}
