"use client";

import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { AVAILABLE_SOCIALS } from '@/config/socials';

interface DynamicSocialLinksProps {
  links: Record<string, string>;
  setLinks: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  activeLinks: string[];
  setActiveLinks: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function DynamicSocialLinks({ links, setLinks, activeLinks, setActiveLinks }: DynamicSocialLinksProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  
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
            >
              <Trash2 size={18} />
            </button>
          </div>
        );
      })}

      {availableToAdd.length > 0 && (
        <div className="relative pt-2">
          <button 
            type="button" 
            onClick={() => setShowDropdown(!showDropdown)}
            className="w-full py-3 border border-dashed border-z-blue/40 text-z-blue rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-z-blue/5 transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Plus size={16} /> Lier un réseau
          </button>

          {showDropdown && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowDropdown(false)} />
              <div className="absolute top-full left-0 right-0 mt-2 bg-z-bg border border-z-border rounded-lg shadow-xl overflow-hidden z-20 animate-in fade-in slide-in-from-top-2">
                {availableToAdd.map(field => {
                  const Icon = field.icon;
                  return (
                    <button
                      key={field.id}
                      type="button"
                      onClick={() => {
                        setActiveLinks(prev => [...prev, field.id]);
                        setShowDropdown(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-z-text hover:bg-white/5 transition-colors text-left border-b border-z-border last:border-0 cursor-pointer"
                    >
                      <Icon size={16} className="text-z-muted" /> {field.label}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
