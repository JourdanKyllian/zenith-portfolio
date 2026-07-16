'use client';

import { useState, useEffect } from 'react';
import { PlayCircle, ChevronLeft, ChevronRight, X, Maximize2 } from 'lucide-react';
import PdfPreview from '@/components/PdfPreview';

interface ExtendedSousProjet {
  id: number;
  projet_id: number;
  titre: string;
  description: string | null;
  youtube_url: string | null;
  drive_url: string | null;
  ordre: number;
  created_at: string;
  finalYoutubeUrl: string | null;
  driveImages: string[];
  pdf: any;
}

interface ProjectMediaContentProps {
  sousProjets: ExtendedSousProjet[];
  coverImageUrl: string;
}

export default function ProjectMediaContent({ sousProjets, coverImageUrl }: ProjectMediaContentProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Extraction et aplatissement de TOUTES les images de TOUS les sous-projets pour le voyage global
  const allImages = sousProjets.flatMap(sp => sp.driveImages);

  // Gestion des touches du clavier pour une navigation fluide
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

  const openLightbox = (url: string) => {
    const index = allImages.indexOf(url);
    if (index !== -1) {
      setCurrentIndex(index);
      setIsOpen(true);
    }
  };

  if (sousProjets.length === 0) {
    return <img src={coverImageUrl} className="w-full rounded-2xl border border-z-blue/10" alt="Couverture du projet" />;
  }

  return (
    <>
      <div className="lg:col-span-2 space-y-16">
        {sousProjets.map((sp, idx) => {
          const hasMedia = sp.finalYoutubeUrl || sp.driveImages.length > 0 || sp.pdf;

          return (
            <div key={sp.id || idx} className="space-y-8 animate-fade-up">
              
              {(sp.titre || sp.description) && (
                <div className="border-l-2 border-z-blue/50 pl-4 py-1">
                  {sp.titre && <h4 className="font-display text-2xl uppercase font-bold text-z-text">{sp.titre}</h4>}
                  {sp.description && (
                    <p className={`font-body text-z-muted mt-2 ${hasMedia ? 'text-sm' : 'text-base leading-relaxed text-z-text/90'}`}>
                      {sp.description}
                    </p>
                  )}
                </div>
              )}

              {sp.finalYoutubeUrl && (
                <div className="aspect-video bg-z-card rounded-2xl overflow-hidden border border-z-blue/10 shadow-2xl">
                  <iframe 
                    width="100%" height="100%" 
                    src={sp.finalYoutubeUrl.replace("watch?v=", "embed/").replace("youtu.be/", "youtube.com/embed/")} 
                    frameBorder="0" allowFullScreen 
                  />
                </div>
              )}

              {(sp.driveImages.length > 0 || sp.pdf) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {sp.pdf && <PdfPreview pdf={sp.pdf} />}

                  {sp.driveImages.map((imgUrl: string, imgIndex: number) => (
                    <button 
                      key={imgIndex}
                      onClick={() => openLightbox(imgUrl)}
                      className="group relative aspect-video rounded-2xl overflow-hidden border border-z-blue/10 bg-z-card hover:border-z-blue/40 transition-all duration-300 shadow-md block cursor-zoom-in text-left w-full"
                      title="Cliquez pour ouvrir la visionneuse"
                    >
                      <img 
                        src={imgUrl} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102" 
                        alt={`Rendu graphique ${imgIndex + 1}`} 
                        loading="lazy" 
                      />
                      
                      <div className="absolute inset-0 bg-z-night/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                        <div className="w-10 h-10 bg-z-blue/20 backdrop-blur-md rounded-full flex items-center justify-center border border-z-blue/40">
                          <Maximize2 size={16} className="text-z-blue" />
                        </div>
                        <span className="text-white font-sub text-[9px] font-bold uppercase tracking-widest">
                          Agrandir l'image
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* VISIONNEUSE INTERACTIVE GLOBALE (LIGHTBOX) */}
      {isOpen && allImages.length > 0 && (
        <div className="fixed inset-0 z-2000 flex items-center justify-center bg-z-bg/95 backdrop-blur-md select-none animate-fade-in">
          
          {/* Bouton de fermeture */}
          <button 
            onClick={() => setIsOpen(false)}
            className="absolute top-6 right-6 z-2001 p-3 text-z-muted hover:text-white bg-z-card border border-z-border rounded-full transition-colors cursor-pointer focus:outline-none"
            aria-label="Fermer la visionneuse"
          >
            <X size={24} />
          </button>

          {/* Bouton Précédent */}
          {allImages.length > 1 && (
            <button 
              onClick={handlePrev}
              className="absolute left-4 md:left-8 z-2001 p-4 text-white hover:text-z-blue bg-z-card/50 hover:bg-z-card border border-z-border/40 rounded-full transition-all cursor-pointer group focus:outline-none"
              aria-label="Image précédente"
            >
              <ChevronLeft size={28} className="group-hover:-translate-x-0.5 transition-transform" />
            </button>
          )}

          {/* Affichage central de la photo en ultra HD originelle */}
          <div className="relative max-w-5xl max-h-[85vh] p-4 flex flex-col items-center justify-center">
            <img 
              src={allImages[currentIndex].replace('sz=w1200', 'sz=w4000')} 
              alt={`Rendu plein écran ${currentIndex + 1}`}
              className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl animate-scale-in"
            />
            
            {/* Indexateur bas de page */}
            <div className="mt-6 px-4 py-1.5 rounded-full bg-z-card/80 border border-z-border text-[10px] font-sub font-bold uppercase tracking-widest text-z-muted">
              {currentIndex + 1} / {allImages.length}
            </div>
          </div>

          {/* Bouton Suivant */}
          {allImages.length > 1 && (
            <button 
              onClick={handleNext}
              className="absolute right-4 md:right-8 z-2001 p-4 text-white hover:text-z-blue bg-z-card/50 hover:bg-z-card border border-z-border/40 rounded-full transition-all cursor-pointer group focus:outline-none"
              aria-label="Image suivante"
            >
              <ChevronRight size={28} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          )}
        </div>
      )}
    </>
  );
}