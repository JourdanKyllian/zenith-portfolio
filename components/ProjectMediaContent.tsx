'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X, Maximize2, Loader2 } from 'lucide-react';
import PdfPreview from '@/components/PdfPreview';

interface ExtendedSousProjet {
  id: number;
  projet_id: number;
  titre: string;
  description: string | null;
  drive_url: string | null;
  ordre: number;
  created_at: string;
  finalYoutubeUrl: string | null;
  driveImages: string[];
  pdf: any;
  driveVideoUrl: string | null; // ✨ AJOUT
}

interface ProjectMediaContentProps {
  sousProjets: ExtendedSousProjet[];
  coverImageUrl: string;
  projectTitle: string;
}

export default function ProjectMediaContent({ sousProjets, coverImageUrl, projectTitle }: ProjectMediaContentProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isImageLoading, setIsImageLoading] = useState(true);

  const allImages = sousProjets.flatMap(sp => sp.driveImages);

  const getHdUrl = (url: string) => {
    return url.includes('drive.google.com/thumbnail')
      ? url.replace('sz=w1200', 'sz=w2048')
      : url;
  };

  const nextIndex = (currentIndex + 1) % allImages.length;
  const prevIndex = (currentIndex - 1 + allImages.length) % allImages.length;

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
    setIsImageLoading(true);
    setCurrentIndex(nextIndex);
  };

  const handlePrev = () => {
    setIsImageLoading(true);
    setCurrentIndex(prevIndex);
  };

  const openLightbox = (url: string) => {
    const index = allImages.indexOf(url);
    if (index !== -1) {
      setIsImageLoading(true);
      setCurrentIndex(index);
      setIsOpen(true);
    }
  };

  if (sousProjets.length === 0) {
    return <img src={coverImageUrl} className="w-full rounded-2xl border border-z-blue/10" alt={`Portfolio ${projectTitle}`} />;
  }

  return (
    <>
      <div className="lg:col-span-2 space-y-16">
        {sousProjets.map((sp, idx) => {
          // Ajustement de la détection sémantique
          const hasMedia = sp.finalYoutubeUrl || sp.driveVideoUrl || sp.driveImages.length > 0 || sp.pdf;
          const seoDescription = `${sp.titre || 'Rendu visuel'} — Projet ${projectTitle} par Zenith Production`;

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

              {/* BLOC 1 : Vidéo YouTube (Prioritaire si présente) */}
              {sp.finalYoutubeUrl && (
                <div className="aspect-video bg-z-card rounded-2xl overflow-hidden border border-z-blue/10 shadow-2xl">
                  <iframe 
                    width="100%" height="100%" 
                    src={sp.finalYoutubeUrl.replace("watch?v=", "embed/").replace("youtu.be/", "youtube.com/embed/")} 
                    allowFullScreen 
                    className="border-none"
                  />
                </div>
              )}

              {/* BLOC 2 ✨ AJOUT : Vidéo Google Drive Native (si pas de lien YouTube fourni) */}
              {sp.driveVideoUrl && !sp.finalYoutubeUrl && (
                <div className="aspect-video bg-z-card rounded-2xl overflow-hidden border border-z-blue/10 shadow-2xl">
                  <iframe 
                    width="100%" height="100%" 
                    src={sp.driveVideoUrl} 
                    allow="autoplay"
                    allowFullScreen 
                    className="border-none bg-black"
                    title={`Vidéo native — ${sp.titre || projectTitle}`}
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
                    >
                      <Image 
                        src={imgUrl} 
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-102" 
                        alt={`${seoDescription} (${imgIndex + 1})`}
                        loading="lazy"
                      />
                      
                      <div className="absolute inset-0 bg-z-night/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 z-10">
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

      {/* LIGHTBOX POPUP */}
      {isOpen && allImages.length > 0 && (
        <div className="fixed inset-0 z-2000 flex items-center justify-center bg-z-bg/95 backdrop-blur-md select-none animate-fade-in">
          <div className="hidden" aria-hidden="true">
            <img src={getHdUrl(allImages[nextIndex])} alt="" />
            <img src={getHdUrl(allImages[prevIndex])} alt="" />
          </div>

          <button 
            onClick={() => setIsOpen(false)}
            className="absolute top-6 right-6 z-2001 p-3 text-z-muted hover:text-white bg-z-card border border-z-border rounded-full transition-colors cursor-pointer focus:outline-none"
          >
            <X size={24} />
          </button>

          {allImages.length > 1 && (
            <button 
              onClick={handlePrev}
              className="absolute left-4 md:left-8 z-2001 p-4 text-white hover:text-z-blue bg-z-card/50 hover:bg-z-card border border-z-border/40 rounded-full transition-all cursor-pointer group focus:outline-none"
            >
              <ChevronLeft size={28} className="group-hover:-translate-x-0.5 transition-transform" />
            </button>
          )}

          <div className="relative max-w-5xl max-h-[85vh] p-4 flex flex-col items-center justify-center w-full">
            {isImageLoading && (
              <div className="absolute inset-0 flex items-center justify-center z-10 text-z-blue">
                <Loader2 size={40} className="animate-spin" />
              </div>
            )}

            <img 
              src={getHdUrl(allImages[currentIndex])} 
              alt={`Agrandissement plein écran numéro ${currentIndex + 1} — ${projectTitle}`}
              onLoad={() => setIsImageLoading(false)}
              className={`max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl transition-opacity duration-300 ${
                isImageLoading ? 'opacity-30' : 'opacity-100'
              }`}
            />
            
            <div className="mt-6 px-4 py-1.5 rounded-full bg-z-card/80 border border-z-border text-[10px] font-sub font-bold uppercase tracking-widest text-z-muted">
              {currentIndex + 1} / {allImages.length}
            </div>
          </div>

          {allImages.length > 1 && (
            <button 
              onClick={handleNext}
              className="absolute right-4 md:right-8 z-2001 p-4 text-white hover:text-z-blue bg-z-card/50 hover:bg-z-card border border-z-border/40 rounded-full transition-all cursor-pointer group focus:outline-none"
            >
              <ChevronRight size={28} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          )}
        </div>
      )}
    </>
  );
}