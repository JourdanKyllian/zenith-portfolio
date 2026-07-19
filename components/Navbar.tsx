"use client";

import { useState, useEffect } from 'react';
import { Menu, X, FileText } from 'lucide-react';
import Link from 'next/link';
import CvModal from './CvModal';

interface NavbarProps {
  cvUrl: string | null;
  previewUrl: string | null;
}

/**
 * Client Component : Navigation principale globale.
 * Gère l'état d'ancrage dynamique au défilement, l'affichage du menu tiroir mobile,
 * et le verrouillage du défilement du document lors de l'ouverture des surcouches (modales/menus).
 */
export default function Navbar({ cvUrl, previewUrl }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isCvOpen, setIsCvOpen] = useState(false);

  useEffect(() => {
    // L'affectation d'une chaîne vide ('') force le reflow WebKit et libère le scroll Safari
    if (isOpen || isCvOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, isCvOpen]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isOpen) setIsOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen]);

  const navLinks = [
    { name: 'Accueil', href: '/' },
    { name: 'Projets', href: '/projet' },
    { name: 'À Propos', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-[999] transition-all duration-500 ${
        scrolled ? 'bg-z-bg/95 backdrop-blur-md border-b border-z-blue/20 py-1' : 'py-4'
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
          <Link href="/" className="group flex flex-col items-start z-[1001] select-none" onClick={() => setIsOpen(false)}>
            {/* inline-block, overflow-visible et padding proportionnel obligatoires pour empêcher WebKit de rogner la police */}
            <span className="font-martyric text-3xl text-white group-hover:text-z-blue transition-colors duration-300 drop-shadow-lg leading-none inline-block overflow-visible pr-[0.3em] -mr-[0.3em]">
              ZENITH
            </span>
            <span className="block font-sub text-[10px] font-semibold tracking-[0.3em] uppercase text-white/80 leading-none mt-1">
              PRODUCTION
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link key={link.name} href={link.href} className="font-sub text-[13px] font-bold uppercase tracking-[0.15em] text-z-text/60 hover:text-z-blue py-2 transition-colors">
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-6 z-[1001]">
            <button 
              onClick={() => setIsCvOpen(true)}
              className="btn-blue hidden md:flex px-6 py-3 rounded-md items-center gap-2 text-xs font-bold tracking-wider cursor-pointer"
            >
              <FileText size={14} fill="currentColor" />
              MON CV
            </button>
            
            <button 
              className="md:hidden p-2 text-z-text hover:text-z-blue transition-colors cursor-pointer" 
              onClick={() => setIsOpen(!isOpen)}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
              aria-label={isOpen ? "Fermer le menu de navigation" : "Ouvrir le menu de navigation"}
            >
              {isOpen ? <X size={32} /> : <Menu size={32} />}
            </button>
          </div>
        </div>

        <nav 
          id="mobile-menu"
          aria-hidden={!isOpen}
          className={`fixed inset-0 w-full h-dvh bg-z-bg z-[1000] transition-transform duration-500 ease-in-out md:hidden ${
            isOpen ? 'translate-y-0' : '-translate-y-full'
          }`}
        >
          <div className="flex flex-col h-full pt-32 px-10">
            <p className="font-sub text-z-blue text-[10px] font-bold uppercase tracking-[0.4em] mb-10 opacity-50">Menu</p>
            <div className="flex flex-col gap-8">
              {navLinks.map((link) => (
                <Link key={link.name} href={link.href} onClick={() => setIsOpen(false)} className="font-display text-5xl font-bold uppercase tracking-tighter text-z-text hover:text-z-blue active:scale-95 transition-all">
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="mt-auto pb-[calc(2rem+env(safe-area-inset-bottom))]">
              <button 
                onClick={() => { setIsOpen(false); setIsCvOpen(true); }}
                className="btn-blue w-full p-5 rounded-xl flex items-center justify-center gap-3 font-bold uppercase tracking-widest text-sm mb-6 cursor-pointer"
              >
                <FileText size={18} fill="currentColor" />
                Visualiser mon CV
              </button>
            </div>
          </div>
        </nav>
      </header>

      <CvModal 
        isOpen={isCvOpen} 
        onClose={() => setIsCvOpen(false)} 
        cvUrl={cvUrl} 
        previewUrl={previewUrl} 
      />
    </>
  );
}