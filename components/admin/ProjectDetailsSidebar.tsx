"use client";

import { Video, HardDrive, ListOrdered, Trash2, GripVertical, Plus, CheckCircle2 } from 'lucide-react';
import RichTextEditor from '@/components/ui/RichTextEditor';
import Alert from '@/components/ui/Alert';
import { SousProjet } from '@/types';
import SubmitButton, { SubmitStatus } from '@/components/admin/SubmitButton';

interface ProjectDetailsSidebarProps {
  sousProjets: SousProjet[];
  hasUnsavedChanges: boolean;
  detailsStatus: SubmitStatus;
  detailsMessage: { text: string; type: 'success' | 'error' } | null;
  handleSaveDetails: () => void;
  handleAddSp: () => void;
  handleDragStart: (e: React.DragEvent, id: number) => void;
  handleDragOver: (e: React.DragEvent, id: number) => void;
  handleDrop: (e: React.DragEvent, id: number) => void;
  setDraggedId: (val: number | null) => void;
  setDragOverId: (val: number | null) => void;
  editingSpId: number | null;
  setEditingSpId: (val: number | null) => void;
  draggedId: number | null;
  dragOverId: number | null;
  requestDeleteSp: (id: number, titre: string | null) => void;
  updateActiveSp: (field: keyof SousProjet, value: string | number | null) => void;
}

export default function ProjectDetailsSidebar({
  sousProjets, hasUnsavedChanges, detailsStatus, detailsMessage, handleSaveDetails, handleAddSp,
  handleDragStart, handleDragOver, handleDrop, setDraggedId, setDragOverId,
  editingSpId, setEditingSpId, draggedId, dragOverId, requestDeleteSp, updateActiveSp
}: ProjectDetailsSidebarProps) {
  
  const activeSp = sousProjets.find(sp => sp.id === editingSpId);

  return (
    <div className="w-full lg:w-90 xl:w-105 shrink-0 flex flex-col min-w-0 bg-z-card/80 border border-z-border rounded-xl shadow-xl overflow-hidden relative z-10">
      <header className="shrink-0 p-4 xl:p-6 border-b border-z-border flex items-center justify-between bg-z-card/50 backdrop-blur-md">
        <div className="flex items-center gap-3 min-w-0">
          <h2 className="font-sub text-xs uppercase tracking-[0.2em] text-white flex items-center gap-2 truncate">
            <Video size={16} className="text-z-blue shrink-0" /> 
            <span className="hidden xl:inline">Détails</span>
          </h2>
          <span className="px-2 py-1 bg-z-blue/10 text-z-blue rounded-full text-[10px] font-bold shrink-0">{sousProjets.length}</span>
        </div>

        {hasUnsavedChanges && (
          <SubmitButton 
            status={detailsStatus}
            onClick={handleSaveDetails}
            type="button"
            idleText="Sauver"
            className="h-8 sm:h-9 px-2.5 2xl:px-4 text-[10px] shrink-0"
            textClassName="hidden 2xl:block uppercase"
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
            sousProjets.map(sp => (
              <div 
                key={sp.id} draggable
                onDragStart={(e) => handleDragStart(e, sp.id)} onDragOver={(e) => handleDragOver(e, sp.id)} onDrop={(e) => handleDrop(e, sp.id)} onDragEnd={() => { setDraggedId(null); setDragOverId(null); }}
                onClick={() => setEditingSpId(sp.id)}
                className={`bg-z-bg border rounded-lg p-3 group transition-all duration-200 cursor-pointer ${
                  editingSpId === sp.id ? 'border-z-blue bg-z-blue/5' : 'border-z-border hover:border-z-blue/50'
                } ${draggedId === sp.id ? 'opacity-40 scale-95 border-dashed border-z-blue' : ''} ${
                  dragOverId === sp.id && draggedId !== sp.id ? 'border-z-blue bg-z-blue/10 translate-y-1' : ''
                }`}
              >
                <div className="flex justify-between items-start gap-3">
                  <div className="cursor-grab active:cursor-grabbing text-z-muted/30 hover:text-white pt-1 transition-colors"><GripVertical size={16} /></div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-white mb-1 truncate">{sp.titre || `Séquence Média`}</h4>
                    <div className="flex items-center gap-3 text-z-muted">
                        <span className="flex items-center gap-1 text-[10px] font-bold uppercase text-z-blue"><ListOrdered size={12}/> {sp.ordre}</span>
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
              <h4 className="text-xs font-bold text-white uppercase tracking-widest">
                {activeSp.id < 0 ? 'Nouveau Détail' : 'Édition en cours'}
              </h4>
              <span className="flex items-center gap-1 text-[9px] text-emerald-400 uppercase tracking-widest"><CheckCircle2 size={12}/> Actif</span>
            </div>
            
            <div className="space-y-2">
              <input type="text" placeholder="Titre (ex: Teaser, Making-of)" value={activeSp.titre || ''} onChange={e => updateActiveSp('titre', e.target.value)} className="w-full bg-z-card border border-z-border rounded p-3 text-sm focus:border-z-blue focus:outline-none" />
            </div>
            <div className="space-y-2">
              <RichTextEditor value={activeSp.description || ''} onChange={val => updateActiveSp('description', val)} placeholder="Description optionnelle..." minHeight="150px" />
            </div>
            <div className="space-y-2">
              <input type="url" placeholder="URL iframe YouTube (optionnel)" value={activeSp.youtube_url || ''} onChange={e => updateActiveSp('youtube_url', e.target.value)} className="w-full bg-z-card border border-z-border rounded p-3 text-sm focus:border-z-blue focus:outline-none" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between mb-1">
                <label className="text-[10px] uppercase font-bold tracking-widest text-z-muted ml-1">Fichier Drive</label>
                <span className="text-[9px] text-z-blue/70 italic px-2 py-0.5 bg-z-blue/5 rounded border border-z-blue/10">Drive direct</span>
              </div>
              <input type="url" placeholder="https://drive.google.com/uc?id=..." value={activeSp.drive_url || ''} onChange={e => updateActiveSp('drive_url', e.target.value)} className="w-full bg-z-card border border-z-border rounded p-3 text-sm placeholder:text-z-muted/30 focus:border-z-blue focus:outline-none" />
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
  );
}
