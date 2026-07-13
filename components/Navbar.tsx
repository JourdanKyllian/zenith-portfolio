"use client";

import { useState, useEffect } from 'react';
import { Menu, X, FileText } from 'lucide-react';
import Link from 'next/link';

// On reçoit cvUrl en prop
export default function Navbar({ cvUrl }: { cvUrl: string | null }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
  }, [isOpen]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Accueil', href: '/' },
    { name: 'Projets', href: '/projet' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
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
          {/* Le bouton est prêt instantanément */}
          <a 
            href={cvUrl || "#"} 
            target="_blank"
            rel="noopener noreferrer"
            className="btn-blue hidden md:flex px-6 py-3 rounded-md items-center gap-2 text-xs font-bold tracking-wider"
          >
            <FileText size={14} fill="currentColor" />
            MON CV
          </a>
          
          <button className="md:hidden p-2 text-z-text hover:text-z-blue transition-colors" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={32} /> : <Menu size={32} />}
          </button>
        </div>
      </div>

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
            <a href={cvUrl || "#"} target="_blank" rel="noopener noreferrer" onClick={() => setIsOpen(false)} className="btn-blue w-full p-5 rounded-xl flex items-center justify-center gap-3 font-bold uppercase tracking-widest text-sm mb-6">
              <FileText size={18} fill="currentColor" />
              Télécharger mon CV
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}