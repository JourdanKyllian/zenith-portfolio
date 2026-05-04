"use client";

import { useState, useEffect } from 'react';
import { Menu, X, Play } from 'lucide-react';
import Link from 'next/link';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
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
    <header className={`fixed top-0 left-0 right-0 z-999 transition-all duration-300 ${
      scrolled ? 'bg-z-bg/90 backdrop-blur-md border-b border-z-blue/20 py-2' : 'py-4'
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
        
        <Link href="/" className="flex items-center gap-3 z-1001" onClick={() => setIsOpen(false)}>
          <div className="w-9 h-9 rounded-full border border-z-blue/50 bg-z-blue/10 flex items-center justify-center">
            <span className="text-z-blue font-bold text-lg">Z</span>
          </div>
          <div className="leading-none">
            <span className="font-display font-bold text-base tracking-widest uppercase text-z-text">ZENITH</span>
            <span className="block font-sub text-[9px] font-semibold tracking-[0.2em] uppercase text-white">PRODUCTION</span>
          </div>
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link key={link.name} href={link.href} className="font-sub text-[10px] font-bold uppercase tracking-widest text-z-text/60 hover:text-z-blue transition-colors">
              {link.name}
            </Link>
          ))}
        </nav>

        {/* ACTIONS & BURGER */}
        <div className="flex items-center gap-4 z-1001">
          <Link href="/contact" className="btn-blue hidden md:flex px-5 py-2.5 rounded-md items-center gap-2 text-[11px] font-bold">
            <Play size={12} fill="currentColor" />
            SHOWREEL
          </Link>
          
          <button 
            className="md:hidden p-2 text-z-text focus:outline-none" 
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={30} /> : <Menu size={30} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      <div className={`fixed inset-0 w-full h-screen bg-z-bg z-1000 transition-transform duration-500 ease-in-out md:hidden ${
        isOpen ? 'translate-y-0' : '-translate-y-full'
      }`}>
        <div className="flex flex-col h-full pt-32 px-10">
          <p className="font-sub text-z-blue text-[10px] font-bold uppercase tracking-[0.4em] mb-10 opacity-50">Menu</p>
          
          <nav className="flex flex-col gap-6">
            {navLinks.map((link, index) => (
              <Link 
                key={link.name} 
                href={link.href} 
                onClick={() => setIsOpen(false)}
                className="font-display text-4xl font-bold uppercase tracking-tighter text-z-text hover:text-z-blue active:scale-95 transition-all"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="mt-auto pb-12">
            <Link 
              href="/contact" 
              onClick={() => setIsOpen(false)}
              className="btn-blue w-full p-5 rounded-xl flex items-center justify-center gap-3 font-bold uppercase tracking-widest text-sm mb-6"
            >
              <Play size={18} fill="currentColor" />
              Regarder le Showreel
            </Link>
            <p className="text-z-muted text-[10px] font-bold uppercase tracking-[0.2em] text-center">
              © 2026 ZENITH PRODUCTION
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}