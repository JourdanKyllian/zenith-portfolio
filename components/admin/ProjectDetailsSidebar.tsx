"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { purgeCache } from "@/app/actions/revalidate";
import { Video, HardDrive, ListOrdered, Trash2, GripVertical, Plus, CheckCircle2 } from "lucide-react";
import RichTextEditor from "@/components/ui/RichTextEditor";
import Alert from "@/components/ui/Alert";
import ConfirmModal from "@/components/ui/ConfirmModal";
import SubmitButton, { SubmitStatus } from "@/components/ui/SubmitButton";
import { SousProjet } from "@/types";

interface ProjectDetailsSidebarProps {
  projetId: string;
  initialSousProjets: SousProjet[];
  onUpdatePreview: (sousProjets: SousProjet[]) => void;
}

/**
 * Panneau latéral gérant l'arborescence des séquences médias (sous-projets).
 * Implémente le glisser-déposer (Drag & Drop) pour réordonner le contenu 
 * et gère les opérations CRUD (Création, Lecture, Mise à jour, Suppression) en cascade.
 */
export default function ProjectDetailsSidebar({ projetId, initialSousProjets, onUpdatePreview }: ProjectDetailsSidebarProps) {
  
  const [prevInitial, setPrevInitial] = useState(initialSousProjets);
  const [sousProjets, setSousProjets] = useState<SousProjet[]>(initialSousProjets);

  // État dérivé : synchronise l'état local si les propriétés parentes changent.
  if (initialSousProjets !== prevInitial) {
    setPrevInitial(initialSousProjets);
    setSousProjets(initialSousProjets);
  }

  const [deletedSpIds, setDeletedSpIds] = useState<number[]>([]);
  const [editingSpId, setEditingSpId] = useState<number | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [detailsStatus, setDetailsStatus] = useState<SubmitStatus>("idle");
  const [detailsMessage, setDetailsMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  
  const [draggedId, setDraggedId] = useState<number | null>(null);
  const [dragOverId, setDragOverId] = useState<number | null>(null);
  const [deleteSpTarget, setDeleteSpTarget] = useState<{ id: number; titre: string } | null>(null);

  useEffect(() => {
    onUpdatePreview(sousProjets);
  }, [sousProjets, onUpdatePreview]);

  /**
   * Instancie une nouvelle séquence média locale avant persistance.
   * L'utilisation d'un identifiant négatif temporaire permet de la distinguer
   * des entités déjà enregistrées en base de données.
   */
  const handleAddSp = () => {
    const newId = -Date.now();
    setSousProjets([...sousProjets, { id: newId, projet_id: parseInt(projetId), titre: "", description: "", youtube_url: "", drive_url: "", ordre: sousProjets.length + 1, created_at: new Date().toISOString() }]);
    setEditingSpId(newId);
    setHasUnsavedChanges(true);
  };

  /**
   * Intercepte la demande de suppression pour vérifier si une modale 
   * de confirmation doit être affichée (vérification du cache localStorage).
   * 
   * @param {number} id - Identifiant de la séquence.
   * @param {string | null} titre - Titre de la séquence pour affichage contextuel.
   */
  const requestDeleteSp = (id: number, titre: string | null) => {
    const skipUntil = localStorage.getItem("skipDeleteConfirmUntil");
    if (skipUntil && parseInt(skipUntil) > new Date().getTime()) executeDeleteSp(id);
    else setDeleteSpTarget({ id, titre: titre || `Séquence média` });
  };

  /**
   * Exécute la suppression locale de la séquence. 
   * Marque l'élément pour suppression distante lors de la prochaine sauvegarde.
   * 
   * @param {number} id - Identifiant de la séquence.
   */
  const executeDeleteSp = (id: number) => {
    if (id > 0) setDeletedSpIds((prev) => [...prev, id]);
    setSousProjets(sousProjets.filter((sp) => sp.id !== id).map((sp, idx) => ({ ...sp, ordre: idx + 1 })));
    if (editingSpId === id) setEditingSpId(null);
    setHasUnsavedChanges(true);
    setDeleteSpTarget(null);
  };

  /**
   * Met à jour dynamiquement une propriété spécifique de la séquence en cours d'édition.
   * 
   * @param {keyof SousProjet} field - Le champ de l'entité à mettre à jour.
   * @param {string | number | null} value - La nouvelle valeur.
   */
  const updateActiveSp = (field: keyof SousProjet, value: string | number | null) => {
    setSousProjets((prev) => prev.map((sp) => sp.id === editingSpId ? { ...sp, [field]: value } : sp));
    setHasUnsavedChanges(true);
  };

  /**
   * Traite les modifications par lots (Batch) de la collection de sous-projets.
   * Effectue séquentiellement : suppressions, mises à jour et insertions sur Supabase.
   */
  const handleSaveDetails = async () => {
    setDetailsStatus("loading"); setDetailsMessage(null);
    try {
      if (deletedSpIds.length > 0) await supabase.from("sousprojet").delete().in("id", deletedSpIds);
      
      const toUpdate = sousProjets.filter((sp) => sp.id > 0).map((sp) => ({
        id: sp.id, projet_id: sp.projet_id, titre: sp.titre, description: sp.description, youtube_url: sp.youtube_url, drive_url: sp.drive_url, ordre: sp.ordre,
      }));
      if (toUpdate.length > 0) await supabase.from("sousprojet").upsert(toUpdate);
      
      const toInsert = sousProjets.filter((sp) => sp.id < 0).map((sp) => ({
        projet_id: sp.projet_id, titre: sp.titre, description: sp.description, youtube_url: sp.youtube_url, drive_url: sp.drive_url, ordre: sp.ordre,
      }));
      if (toInsert.length > 0) await supabase.from("sousprojet").insert(toInsert);

      await purgeCache();
      setDeletedSpIds([]);
      setHasUnsavedChanges(false);
      setEditingSpId(null);
      
      const { data } = await supabase.from('sousprojet').select('*').eq('projet_id', projetId).order('ordre');
      if (data) setSousProjets(data as SousProjet[]);

      setDetailsStatus("success");
      setDetailsMessage({ text: "Séquençage mis à jour avec succès !", type: "success" });
      setTimeout(() => { setDetailsStatus("idle"); setDetailsMessage(null); }, 3000);
    } catch (err) {
      setDetailsStatus("error");
      setDetailsMessage({ text: err instanceof Error ? err.message : "Erreur lors de la sauvegarde.", type: "error" });
      setTimeout(() => { setDetailsStatus("idle"); setDetailsMessage(null); }, 3000);
    }
  };

  /**
   * Événements relatifs au système de Drag & Drop (Réarrangement des séquences)
   */
  const handleDragStart = (e: React.DragEvent, id: number) => { setEditingSpId(null); setDraggedId(id); e.dataTransfer.effectAllowed = "move"; };
  const handleDragOver = (e: React.DragEvent, id: number) => { e.preventDefault(); if (dragOverId !== id) setDragOverId(id); };
  
  const handleDrop = (e: React.DragEvent, targetId: number) => {
    e.preventDefault(); setDragOverId(null);
    if (!draggedId || draggedId === targetId) { setDraggedId(null); return; }
    
    const draggedIndex = sousProjets.findIndex((sp) => sp.id === draggedId);
    const targetIndex = sousProjets.findIndex((sp) => sp.id === targetId);
    
    const newItems = [...sousProjets];
    const [draggedItem] = newItems.splice(draggedIndex, 1);
    newItems.splice(targetIndex, 0, draggedItem);
    
    setSousProjets(newItems.map((sp, index) => ({ ...sp, ordre: index + 1 })));
    setDraggedId(null); 
    setHasUnsavedChanges(true);
  };

  const activeSp = sousProjets.find((sp) => sp.id === editingSpId);

  return (
    <>
      <div className="w-full lg:w-90 xl:w-105 shrink-0 flex flex-col min-w-0 bg-z-card/80 border border-z-border rounded-xl shadow-xl overflow-hidden relative z-10">
        <header className="shrink-0 p-4 xl:p-6 border-b border-z-border flex items-center justify-between bg-z-card/50 backdrop-blur-md">
          <div className="flex items-center gap-3 min-w-0">
            <h2 className="font-sub text-xs uppercase tracking-[0.2em] text-white flex items-center gap-2 truncate">
              <Video size={16} className="text-z-blue shrink-0" />
              <span className="hidden xl:inline">Détails</span>
            </h2>
            <span className="px-2 py-1 bg-z-blue/10 text-z-blue rounded-full text-[10px] font-bold shrink-0">
              {sousProjets.length}
            </span>
          </div>

          {hasUnsavedChanges && (
            <SubmitButton
              status={detailsStatus} onClick={handleSaveDetails} type="button" idleText="Sauver"
              className="h-8 sm:h-9 px-2.5 2xl:px-4 text-[10px] shrink-0" textClassName="hidden 2xl:block uppercase"
            />
          )}
        </header>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          {detailsMessage && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
              <Alert type={detailsMessage.type}>{detailsMessage.text}</Alert>
            </div>
          )}

          <div className="space-y-3">
            {sousProjets.length === 0 ? (
              <p className="text-sm text-z-muted italic text-center py-4">Aucun détail lié.</p>
            ) : (
              sousProjets.map((sp) => (
                <div
                  key={sp.id} draggable
                  onDragStart={(e) => handleDragStart(e, sp.id)} onDragOver={(e) => handleDragOver(e, sp.id)} onDrop={(e) => handleDrop(e, sp.id)} onDragEnd={() => { setDraggedId(null); setDragOverId(null); }} onClick={() => setEditingSpId(sp.id)}
                  className={`bg-z-bg border rounded-lg p-3 group transition-all duration-200 cursor-pointer ${
                    editingSpId === sp.id ? "border-z-blue bg-z-blue/5" : "border-z-border hover:border-z-blue/50"
                  } ${draggedId === sp.id ? "opacity-40 scale-95 border-dashed border-z-blue" : ""} ${
                    dragOverId === sp.id && draggedId !== sp.id ? "border-z-blue bg-z-blue/10 translate-y-1" : ""
                  }`}
                >
                  <div className="flex justify-between items-start gap-3">
                    <div className="cursor-grab active:cursor-grabbing text-z-muted/30 hover:text-white pt-1 transition-colors"><GripVertical size={16} /></div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-white mb-1 truncate">{sp.titre || `Séquence Média`}</h4>
                      <div className="flex items-center gap-3 text-z-muted">
                        <span className="flex items-center gap-1 text-[10px] font-bold uppercase text-z-blue"><ListOrdered size={12} /> {sp.ordre}</span>
                        {sp.youtube_url && <span title="Vidéo YouTube"><Video size={12} /></span>}
                        {sp.drive_url && <span title="Lien Drive"><HardDrive size={12} /></span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button type="button" onClick={(e) => { e.stopPropagation(); requestDeleteSp(sp.id, sp.titre); }} className="text-z-muted hover:text-red-400 p-1 transition-colors cursor-pointer"><Trash2 size={14} /></button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <button
            type="button" onClick={handleAddSp}
            className="w-full py-3 border border-dashed border-z-blue/50 text-z-blue rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-z-blue/5 transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Plus size={16} /> Ajouter un détail
          </button>

          {activeSp && (
            <div className="bg-z-bg border border-z-blue/30 rounded-lg p-4 sm:p-5 space-y-5 animate-in fade-in slide-in-from-top-4 mt-6">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold text-white uppercase tracking-widest">{activeSp.id < 0 ? "Nouveau Détail" : "Édition en cours"}</h4>
                <span className="flex items-center gap-1 text-[9px] text-emerald-400 uppercase tracking-widest"><CheckCircle2 size={12} /> Actif</span>
              </div>
              <div className="space-y-2"><input type="text" placeholder="Titre (ex: Teaser)" value={activeSp.titre || ""} onChange={(e) => updateActiveSp("titre", e.target.value)} className="w-full bg-z-card border border-z-border rounded p-3 text-sm focus:border-z-blue focus:outline-none" /></div>
              <div className="space-y-2"><RichTextEditor value={activeSp.description || ""} onChange={(val) => updateActiveSp("description", val)} placeholder="Description optionnelle..." minHeight="150px" /></div>
              <div className="space-y-2"><input type="url" placeholder="URL iframe YouTube" value={activeSp.youtube_url || ""} onChange={(e) => updateActiveSp("youtube_url", e.target.value)} className="w-full bg-z-card border border-z-border rounded p-3 text-sm focus:border-z-blue focus:outline-none" /></div>
              <div className="space-y-2">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-z-muted ml-1">Fichier Drive</label>
                  <span className="text-[9px] text-z-blue/70 italic px-2 py-0.5 bg-z-blue/5 rounded border border-z-blue/10">Drive direct</span>
                </div>
                <input type="url" placeholder="https://drive.google.com/uc?id=..." value={activeSp.drive_url || ""} onChange={(e) => updateActiveSp("drive_url", e.target.value)} className="w-full bg-z-card border border-z-border rounded p-3 text-sm placeholder:text-z-muted/30 focus:border-z-blue focus:outline-none" />
              </div>
              <div className="pt-4 border-t border-z-border">
                <button type="button" onClick={() => setEditingSpId(null)} className="w-full bg-z-card border border-z-border text-white py-3 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-white/5 cursor-pointer transition-colors">
                  Fermer l'éditeur
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <ConfirmModal
        isOpen={deleteSpTarget !== null}
        title={deleteSpTarget?.titre || ""}
        onConfirm={() => deleteSpTarget && executeDeleteSp(deleteSpTarget.id)}
        onCancel={() => setDeleteSpTarget(null)}
      />
    </>
  );
}
