"use client";

import { FileText, ExternalLink } from 'lucide-react';

interface PdfPreviewProps {
  pdf: {
    id: string;
    name: string;
    previewUrl: string;
    thumbnailUrl: string;
  };
}

export default function PdfPreview({ pdf }: PdfPreviewProps) {
  return (
    <a 
      href={pdf.previewUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative aspect-video rounded-2xl overflow-hidden border border-z-blue/10 bg-z-card hover:border-z-blue/40 transition-all duration-300 shadow-md block cursor-pointer"
    >
      {/* Première page automatique du PDF générée par l'API Drive */}
      <img 
        src={pdf.thumbnailUrl} 
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103" 
        alt={pdf.name} 
      />
      
      {/* Overlay au survol */}
      <div className="absolute inset-0 bg-z-night/75 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
        <div className="w-10 h-10 bg-z-blue/20 backdrop-blur-md rounded-full flex items-center justify-center border border-z-blue/40">
          <ExternalLink size={18} className="text-z-blue" />
        </div>
        <span className="text-white font-sub text-[10px] font-bold uppercase tracking-widest">
          Ouvrir dans un nouvel onglet
        </span>
      </div>

      {/* Badge PDF permanent pour indiquer le type de document */}
      <div className="absolute top-3 left-3 bg-red-600/90 text-white font-sub text-[9px] font-bold px-2.5 py-1 rounded uppercase tracking-wider flex items-center gap-1.5 shadow-md">
        <FileText size={10} />
        PDF
      </div>
    </a>
  );
}