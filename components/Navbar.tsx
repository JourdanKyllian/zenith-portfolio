"use client";

import { useState, useEffect } from 'react';
import { Menu, X, FileText } from 'lucide-react';
import Link from 'next/link';
import CvModal from './CvModal';

interface NavbarProps {
  cvUrl: string | null;
  previewUrl: string | null;
}

export default function Navbar({ cvUrl, previewUrl }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isCvOpen, setIsCvOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = (isOpen || isCvOpen) ? 'hidden' : 'unset';
  }, [isOpen, isCvOpen]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Accueil', href: '/' },
    { name: 'Projets', href: '/projet' },
    { name: 'À Propos', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-999 transition-all duration-500 ${
        scrolled ? 'bg-z-bg/95 backdrop-blur-md border-b border-z-blue/20 py-1' : 'py-4'
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
          
          <Link href="/" className="flex items-center gap-3 z-1001" onClick={() => setIsOpen(false)}>
            <div className="w-10 h-10 rounded-full border border-z-blue/50 bg-z-blue/10 flex items-center justify-center transition-transform hover:scale-105">
              <span className="text-z-blue font-bold text-xl">Z</span>
            </div>
            <div className="leading-tight">
              <span className="font-display font-bold text-lg tracking-widest uppercase text-z-text">ZENITH</span>
              <span className="block font-sub text-[10px] font-semibold tracking-[0.3em] uppercase text-white/80">PRODUCTION</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link key={link.name} href={link.href} className="font-sub text-[13px] font-bold uppercase tracking-[0.15em] text-z-text/60 hover:text-z-blue py-2 transition-colors">
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-6 z-1001">
            {/* Déclenchement du modal d'aperçu du CV (Desktop) */}
            <button 
              onClick={() => setIsCvOpen(true)}
              className="btn-blue hidden md:flex px-6 py-3 rounded-md items-center gap-2 text-xs font-bold tracking-wider cursor-pointer"
            >
              <FileText size={14} fill="currentColor" />
              MON CV
            </button>
            
            <button className="md:hidden p-2 text-z-text hover:text-z-blue transition-colors" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X size={32} /> : <Menu size={32} />}
            </button>
          </div>
        </div>

        {/* MENU MOBILE */}
        <div className={`fixed inset-0 w-full h-screen bg-z-bg z-1000 transition-transform duration-500 ease-in-out md:hidden ${
          isOpen ? 'translate-y-0' : '-translate-y-full'
        }`}>
          <div className="flex flex-col h-full pt-32 px-10">
            <p className="font-sub text-z-blue text-[10px] font-bold uppercase tracking-[0.4em] mb-10 opacity-50">Menu</p>
            <nav className="flex flex-col gap-8">
              {navLinks.map((link) => (
                <Link key={link.name} href={link.href} onClick={() => setIsOpen(false)} className="font-display text-5xl font-bold uppercase tracking-tighter text-z-text hover:text-z-blue active:scale-95 transition-all">
                  {link.name}
                </Link>
              ))}
            </nav>
            <div className="mt-auto pb-12">
              {/* Déclenchement du modal d'aperçu du CV (Mobile) */}
              <button 
                onClick={() => { setIsOpen(false); setIsCvOpen(true); }}
                className="btn-blue w-full p-5 rounded-xl flex items-center justify-center gap-3 font-bold uppercase tracking-widest text-sm mb-6 cursor-pointer"
              >
                <FileText size={18} fill="currentColor" />
                Visualiser mon CV
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Rendu global du composant modal */}
      <CvModal 
        isOpen={isCvOpen} 
        onClose={() => setIsCvOpen(false)} 
        cvUrl={cvUrl} 
        previewUrl={previewUrl} 
      />
    </>
  );
}