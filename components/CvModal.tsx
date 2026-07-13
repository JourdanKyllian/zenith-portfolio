"use client";

import React from 'react';
import { X, Download } from 'lucide-react';

interface CvModalProps {
  isOpen: boolean;
  onClose: () => void;
  cvUrl: string;
}

export default function CvModal({ isOpen, onClose, cvUrl }: CvModalProps) {
  if (!isOpen) return null;

  // On crée l'URL pour l'affichage (iframe)
  // Si c'est un lien drive, on force le /preview ou on remplace /view par /preview
  const previewUrl = cvUrl.replace(/\/view.*$/, '/preview')
                          .replace(/\/file\/d\//, '/file/d/') 
                          + (cvUrl.includes('?') ? '' : '?usp=drivesdk');

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Overlay sombre */}
      <div 
        className="absolute inset-0 bg-z-bg/90 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      {/* Conteneur du modal */}
      <div className="relative w-full max-w-4xl h-[80vh] bg-z-bg border border-z-blue/20 rounded-xl shadow-2xl overflow-hidden flex flex-col">
        {/* Barre du haut */}
        <div className="flex items-center justify-between p-4 border-b border-z-blue/20 bg-z-bg/50">
          <h2 className="font-display text-lg text-z-text font-bold uppercase tracking-widest">Mon CV</h2>
          <button 
            onClick={onClose}
            className="p-2 text-z-text hover:text-z-blue transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Visionneuse PDF*/}
        <iframe 
          src={previewUrl} 
          className="w-full flex-grow border-0 bg-white" // background blanc pour mieux voir le PDF
          title="Mon CV"
        />

        {/* Bouton de téléchargement */}
        <div className="p-4 border-t border-z-blue/20 bg-z-bg/50 flex justify-end">
          <a 
            href={cvUrl} 
            download="CV_Gabin_Husson.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-3 bg-z-blue text-white rounded-md hover:bg-blue-600 transition-colors font-bold uppercase text-xs tracking-widest"
          >
            <Download size={16} />
            Télécharger le PDF
          </a>
        </div>
      </div>
    </div>
  );
}