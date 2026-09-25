"use client";

import { useState } from 'react';
import { Plus, Trash2, X } from 'lucide-react';
import { AVAILABLE_SOCIALS } from '@/config/socials';

interface DynamicSocialLinksProps {
  links: Record<string, string>;
  setLinks: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  activeLinks: string[];
  setActiveLinks: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function DynamicSocialLinks({ links, setLinks, activeLinks, setActiveLinks }: DynamicSocialLinksProps) {
  const [showModal, setShowModal] = useState(false);
  
  const availableToAdd = AVAILABLE_SOCIALS.filter(f => !activeLinks.includes(f.id));

  return (
    <div className="space-y-4">
      {activeLinks.length === 0 && (
        <div className="p-6 border border-dashed border-z-border rounded-xl text-center">
          <p className="text-sm text-z-muted italic">Aucun réseau configuré.</p>
        </div>
      )}

      {activeLinks.map(netId => {
        const field = AVAILABLE_SOCIALS.find(f => f.id === netId);
        if (!field) return null;
        const Icon = field.icon;
        
        return (
          <div key={netId} className="flex items-center gap-3 animate-in fade-in slide-in-from-left-2 duration-300">
            <div className="w-11 h-11 rounded-lg bg-z-bg border border-z-border flex items-center justify-center text-z-muted shrink-0 shadow-inner">
              <Icon size={18} />
            </div>
            <div className="flex-1">
              <input 
                type="url" 
                value={links[netId] || ''} 
                onChange={(e) => setLinks(prev => ({ ...prev, [netId]: e.target.value }))} 
                className="w-full bg-z-bg border border-z-border rounded-lg py-2.5 px-4 text-sm text-z-text focus:border-z-blue focus:outline-none transition-colors" 
                placeholder={field.placeholder} 
              />
            </div>
            <button 
              type="button" 
              onClick={() => {
                setLinks(prev => ({ ...prev, [netId]: '' }));
                setActiveLinks(prev => prev.filter(id => id !== netId));
              }}
              className="w-11 h-11 rounded-lg border border-transparent text-z-muted hover:text-red-400 hover:bg-red-400/10 transition-colors flex items-center justify-center shrink-0 cursor-pointer"
              title="Retirer ce réseau"
            >
              <Trash2 size={18} />
            </button>
          </div>
        );
      })}

      {availableToAdd.length > 0 && (
        <div className="pt-2">
          <button 
            type="button" 
            onClick={() => setShowModal(true)}
            className="w-full py-3 border border-dashed border-z-blue/40 text-z-blue rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-z-blue/5 transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Plus size={16} /> Lier un réseau
          </button>
        </div>
      )}

      {/* --- FENÊTRE MODALE DE SÉLECTION --- */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-z-card border border-z-border rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between p-4 border-b border-z-border bg-white/5">
              <h3 className="font-sub text-xs uppercase tracking-widest font-bold text-white">Sélectionner un réseau</h3>
              <button 
                type="button" 
                onClick={() => setShowModal(false)} 
                className="text-z-muted hover:text-white transition-colors p-1 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-3 overflow-y-auto custom-scrollbar space-y-1">
              {availableToAdd.map(field => {
                const Icon = field.icon;
                return (
                  <button
                    key={field.id}
                    type="button"
                    onClick={() => {
                      setActiveLinks(prev => [...prev, field.id]);
                      setShowModal(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-z-text hover:bg-z-blue/10 hover:text-z-blue rounded-xl transition-all text-left cursor-pointer group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-z-bg border border-z-border flex items-center justify-center text-z-muted group-hover:text-z-blue group-hover:border-z-blue/30 transition-colors">
                      <Icon size={16} />
                    </div>
                    <span className="font-medium">{field.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="p-3 bg-white/5 border-t border-z-border text-center">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="w-full py-2.5 bg-z-bg border border-z-border text-z-muted hover:text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Annuler
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
