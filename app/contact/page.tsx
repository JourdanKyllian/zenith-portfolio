"use client";

import { Mail, MessageSquare, Send, ExternalLink } from 'lucide-react';
import Navbar from '../../components/Navbar';

// Icône YouTube manuelle pour éviter l'erreur d'exportation
const YoutubeIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M21.8 8s-.2-1.4-.8-2c-.8-.8-1.6-.8-2-.9C16.8 5 12 5 12 5s-4.8 0-7 .1c-.4.1-1.2.1-2 .9-.6.6-.8 2-.8 2S2 9.6 2 11.2v1.5c0 1.6.2 3.2.2 3.2s.2 1.4.8 2c.8.8 1.8.7 2.2.8C6.8 19 12 19 12 19s4.8 0 7-.2c.4-.1 1.2-.1 2-.9.6-.6.8-2 .8-2s.2-1.6.2-3.2v-1.5C22 9.6 21.8 8 21.8 8zM9.7 15.5v-5.6l5.6 2.8-5.6 2.8z"/>
  </svg>
);

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-z-bg text-z-text">
      <Navbar />

      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Effet de fond lumineux (Glow) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-z-blue/10 blur-[120px] pointer-events-none" />
        
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <span className="font-sub text-z-blue text-[10px] font-bold uppercase tracking-[0.3em] mb-4 block animate-fade-in">
              Collaboration
            </span>
            <h1 className="font-display font-bold text-5xl sm:text-7xl uppercase tracking-tighter mb-6 animate-fade-up">
              Parlons de votre <span className="text-glow">Projet</span>
            </h1>
            <p className="font-body text-z-muted max-w-2xl mx-auto leading-relaxed animate-fade-up">
              Disponible pour des missions de cadrage, montage et graphisme. 
              Je vous réponds sous 24h pour discuter de vos ambitions visuelles.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
            
            {/* Colonne de gauche : Infos directes */}
            <div className="lg:col-span-2 space-y-8 animate-fade-in">
              <div className="p-8 rounded-2xl bg-z-card border border-z-border hover:border-z-blue/30 transition-colors">
                <h3 className="font-display font-bold text-xl uppercase mb-6">Coordonnées</h3>
                
                <div className="space-y-6">
                  <a href="mailto:gabin@zenithproduction.fr" className="flex items-center gap-4 group">
                    <div className="w-10 h-10 rounded-lg bg-z-blue/10 flex items-center justify-center text-z-blue group-hover:bg-z-blue group-hover:text-white transition-all">
                      <Mail size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase text-z-muted font-bold tracking-widest">Email Professionnel</p>
                      <p className="text-sm font-medium">gabin@zenithproduction.fr</p>
                    </div>
                  </a>

                  <div className="flex items-center gap-4 group">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                      <MessageSquare size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase text-z-muted font-bold tracking-widest">Statut actuel</p>
                      <p className="text-sm font-medium text-emerald-400">Disponible en Freelance</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8 rounded-2xl bg-z-card border border-z-border">
                <h3 className="font-display font-bold text-xl uppercase mb-6">Suivre mon travail</h3>
                <div className="grid grid-cols-2 gap-4">
                  <a href="#" className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-z-muted hover:text-z-blue transition-colors">
                    <YoutubeIcon size={16} /> YouTube
                  </a>
                  <a href="#" className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-z-muted hover:text-z-blue transition-colors">
                    <ExternalLink size={16} /> ComeUp
                  </a>
                </div>
              </div>
            </div>

            {/* Colonne de droite : Formulaire */}
            <div className="lg:col-span-3 p-8 sm:p-10 rounded-2xl bg-z-card border border-z-border shadow-2xl animate-fade-up">
              <form className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-z-muted ml-1">Nom complet</label>
                    <input type="text" placeholder="Gabin Husson" className="w-full bg-z-bg border border-z-border rounded-lg p-4 text-sm focus:border-z-blue focus:outline-none transition-colors" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-z-muted ml-1">Email</label>
                    <input type="email" placeholder="contact@exemple.com" className="w-full bg-z-bg border border-z-border rounded-lg p-4 text-sm focus:border-z-blue focus:outline-none transition-colors" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-z-muted ml-1">Type de mission</label>
                  <select className="w-full bg-z-bg border border-z-border rounded-lg p-4 text-sm focus:border-z-blue focus:outline-none transition-colors appearance-none">
                    <option>Montage Vidéo / Post-prod</option>
                    <option>Cadrage / Captation</option>
                    <option>Design Graphique</option>
                    <option>Autre</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-z-muted ml-1">Message</label>
                  <textarea rows={5} placeholder="Dites-moi tout sur votre projet..." className="w-full bg-z-bg border border-z-border rounded-lg p-4 text-sm focus:border-z-blue focus:outline-none transition-colors resize-none"></textarea>
                </div>

                <button type="submit" className="btn-blue w-full p-4 rounded-lg flex items-center justify-center gap-3 text-xs font-bold transition-all hover:scale-[1.01] active:scale-[0.99]">
                  <Send size={16} /> Envoyer la demande
                </button>
              </form>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}