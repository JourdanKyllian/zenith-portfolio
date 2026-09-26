"use client";

import { useState, useEffect } from 'react';
import { X, Download } from 'lucide-react';

interface CvModalProps {
  isOpen: boolean;
  onClose: () => void;
  cvUrl: string | null;
  previewUrl: string | null;
}

/**
 * Client Component : Fenêtre modale gérant la prévisualisation asynchrone du document CV.
 * Intègre une mécanique de nettoyage d'iframe (about:blank) pour éviter les fuites mémoires sur mobile.
 */
export default function CvModal({ isOpen, onClose, cvUrl, previewUrl }: CvModalProps) {
  const [shouldRender, setShouldRender] = useState(isOpen);

  // CORRECTION LINTER: Derived State (Mise à jour d'état pendant le rendu). 
  // Rend l'exécution instantanée et évite le "cascading render" (Double Render) d'un useEffect.
  if (isOpen && !shouldRender) {
    setShouldRender(true);
  }

  useEffect(() => {
    if (!isOpen) {
      // On laisse un léger délai pour que l'iframe se vide (about:blank) 
      // et que l'animation de fermeture (opacity) se termine avant le démontage complet
      const timer = setTimeout(() => setShouldRender(false), 150);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!shouldRender && !isOpen) return null;

  return (
    <div className={`fixed inset-0 z-9999 transition-opacity duration-150 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div 
        className="absolute inset-0 bg-z-bg/95 cursor-pointer" 
        onClick={onClose}
        aria-hidden="true"
      />
      
      <div className="absolute inset-0 flex items-center justify-center p-4 pointer-events-none">
        
        <div className={`relative w-full max-w-2xl bg-z-card border border-z-border p-6 rounded-2xl shadow-2xl flex flex-col h-[85vh] pointer-events-auto transition-transform duration-200 ${isOpen ? 'scale-100' : 'scale-95'}`}>
          
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

          <div className="grow rounded-lg bg-z-bg border border-z-border/40 mb-6 overflow-hidden relative min-h-0 w-full">
            {previewUrl ? (
              <iframe 
                /* L'astuce anti-fuite mémoire : on passe à about:blank dès la fermeture */
                src={isOpen ? previewUrl : 'about:blank'} 
                className="w-full h-full border-none bg-z-bg"
                allow="autoplay"
                title="Lecteur PDF du Curriculum Vitae"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-z-muted text-xs font-sub uppercase tracking-wider">
                Aperçu indisponible
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <button 
              onClick={onClose}
              className="flex-1 bg-z-bg border border-z-border text-z-muted hover:text-white p-3.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer"
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
    </div>
  );
}
