"use client";

import React from 'react';
import { Palette } from 'lucide-react';

interface ColorPickerProps {
  value: string;
  onChange: (hex: string) => void;
}

export default function ColorPicker({ value, onChange }: ColorPickerProps) {
  // L'input color natif exige un format strict #RRGGBB.
  // Si la valeur est vide ou invalide, on affiche le bleu Zenith par défaut sur la palette.
  const safeValue = /^#[0-9A-Fa-f]{6}$/.test(value) ? value : '#007BFF';

  return (
    <div className="flex items-center gap-3">
      {/* Le carré de couleur cliquable */}
      <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-z-border shadow-inner cursor-pointer shrink-0 group bg-z-card">
        <input 
          type="color" 
          value={safeValue}
          onChange={(e) => onChange(e.target.value.toUpperCase())}
          className="absolute -inset-4 w-20 h-20 cursor-pointer"
          title="Choisir une couleur sur la palette"
        />
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
          <Palette size={16} className="text-white drop-shadow-md" />
        </div>
      </div>
      
      {/* Le champ texte libre pour les codes Hexadécimaux */}
      <div className="flex-1 relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-z-muted font-bold">#</span>
        <input 
          type="text" 
          value={value.replace('#', '')} 
          onChange={(e) => {
            const val = e.target.value.replace(/[^0-9A-Fa-f]/g, '').slice(0, 6).toUpperCase();
            onChange(val ? `#${val}` : '');
          }}
          className="w-full bg-z-bg border border-z-border rounded-lg py-3 pl-8 pr-4 text-sm font-sub font-bold uppercase text-z-text focus:border-z-blue focus:outline-none transition-colors" 
          placeholder="007BFF"
          maxLength={6}
        />
      </div>
    </div>
  );
}
