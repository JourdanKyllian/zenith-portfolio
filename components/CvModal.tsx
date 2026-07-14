"use client";

import { X, Download } from 'lucide-react';

interface CvModalProps {
  isOpen: boolean;
  onClose: () => void;
  cvUrl: string | null;
  previewUrl: string | null;
}

export default function CvModal({ isOpen, onClose, cvUrl, previewUrl }: CvModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1002] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-z-bg/80 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative w-full max-w-lg bg-z-card border border-z-border p-6 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] z-10">
        
        <div className="flex items-center justify-between mb-4 border-b border-z-blue/10 pb-3">
          <h3 className="font-display font-bold text-xl uppercase tracking-wide text-z-text">Mon Curriculum Vitae</h3>
          <button 
            onClick={onClose} 
            className="p-1.5 text-z-muted hover:text-z-blue rounded-lg transition-colors cursor-pointer"
            aria-label="Fermer"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto rounded-lg bg-z-bg border border-z-border/40 p-2 mb-6 flex justify-center items-start">
          {previewUrl ? (
            <img 
              src={previewUrl} 
              alt="Aperçu du CV" 
              className="w-full h-auto rounded shadow-lg max-h-[55vh] object-contain"
            />
          ) : (
            <div className="py-20 text-z-muted text-xs font-sub uppercase tracking-wider">
              Aperçu indisponible
            </div>
          )}
        </div>

        <div className="flex gap-4">
          <button 
            onClick={onClose}
            className="flex-1 bg-z-bg border border-z-border text-z-muted hover:text-z-text p-3.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer"
          >
            Fermer
          </button>
          <a 
            href={cvUrl || "#"} 
            target="_blank" 
            rel="noopener noreferrer"
            className={`flex-1 btn-blue p-3.5 rounded-lg flex items-center justify-center gap-2 text-xs font-bold tracking-widest transition-transform hover:scale-[1.01] ${!cvUrl ? 'opacity-50 pointer-events-none' : ''}`}
          >
            <Download size={14} />
            Télécharger le PDF
          </a>
        </div>

      </div>
    </div>
  );
}