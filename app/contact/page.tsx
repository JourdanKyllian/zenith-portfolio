"use client";

import { useState } from 'react';
import { Mail, MessageSquare, Send, ExternalLink, CheckCircle2, AlertCircle } from 'lucide-react';
import Navbar from '../../components/Navbar';
import { sendEmail } from '../actions/sendEmail';

const YoutubeIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M21.8 8s-.2-1.4-.8-2c-.8-.8-1.6-.8-2-.9C16.8 5 12 5 12 5s-4.8 0-7 .1c-.4.1-1.2.1-2 .9-.6.6-.8 2-.8 2S2 9.6 2 11.2v1.5c0 1.6.2 3.2.2 3.2s.2 1.4.8 2c.8.8 1.8.7 2.2.8C6.8 19 12 19 12 19s4.8 0 7-.2c.4-.1 1.2-.1 2-.9.6-.6.8-2 .8-2s.2-1.6.2-3.2v-1.5C22 9.6 21.8 8 21.8 8zM9.7 15.5v-5.6l5.6 2.8-5.6 2.8z"/>
  </svg>
);

export default function ContactPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('loading');

    const formData = new FormData(event.currentTarget);
    const result = await sendEmail(formData);

    if (result.success) {
      setStatus('success');
      (event.target as HTMLFormElement).reset();
      setTimeout(() => setStatus('idle'), 5000); // Reset le bouton après 5s
    } else {
      setStatus('error');
    }
  }

  return (
    <main className="min-h-screen bg-z-bg text-z-text">
      <Navbar />

      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-z-blue/10 blur-[120px] pointer-events-none" />
        
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <span className="font-sub text-z-blue text-[10px] font-bold uppercase tracking-[0.3em] mb-4 block animate-fade-in">
              Collaboration
            </span>
            <h1 className="font-display font-bold text-5xl sm:text-7xl uppercase tracking-tighter mb-6 animate-fade-up">
              Parlons de votre <span className="text-glow">Projet</span>
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
            
            {/* Colonne Gauche : Infos */}
            <div className="lg:col-span-2 space-y-8">
              <div className="p-8 rounded-2xl bg-z-card border border-z-border">
                <h3 className="font-display font-bold text-xl uppercase mb-6">Coordonnées</h3>
                <div className="space-y-6">
                  <div className="flex items-center gap-4 group">
                    <div className="w-10 h-10 rounded-lg bg-z-blue/10 flex items-center justify-center text-z-blue">
                      <Mail size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase text-z-muted font-bold tracking-widest">Email</p>
                      <p className="text-sm font-medium">zenithprod.contact@gmail.com</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 group">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                      <MessageSquare size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase text-z-muted font-bold tracking-widest">Statut</p>
                      <p className="text-sm font-medium text-emerald-400">Disponible en Freelance</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Colonne Droite : Formulaire */}
            <div className="lg:col-span-3 p-8 sm:p-10 rounded-2xl bg-z-card border border-z-border shadow-2xl">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-z-muted ml-1">Nom complet</label>
                    <input name="name" required type="text" placeholder="Gabin Husson" className="w-full bg-z-bg border border-z-border rounded-lg p-4 text-sm focus:border-z-blue focus:outline-none transition-colors" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-z-muted ml-1">Email</label>
                    <input name="email" required type="email" placeholder="contact@exemple.com" className="w-full bg-z-bg border border-z-border rounded-lg p-4 text-sm focus:border-z-blue focus:outline-none transition-colors" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-z-muted ml-1">Type de mission</label>
                  <select name="type" className="w-full bg-z-bg border border-z-border rounded-lg p-4 text-sm focus:border-z-blue focus:outline-none transition-colors appearance-none">
                    <option>Montage Vidéo / Post-prod</option>
                    <option>Cadrage / Captation</option>
                    <option>Design Graphique</option>
                    <option>Autre</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-z-muted ml-1">Message</label>
                  <textarea name="message" required rows={5} placeholder="Dites-moi tout sur votre projet..." className="w-full bg-z-bg border border-z-border rounded-lg p-4 text-sm focus:border-z-blue focus:outline-none transition-colors resize-none"></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={status === 'loading'}
                  className={`btn-blue w-full p-4 rounded-lg flex items-center justify-center gap-3 text-xs font-bold transition-all ${status === 'loading' ? 'opacity-70 cursor-not-allowed' : 'hover:scale-[1.01]'}`}
                >
                  {status === 'loading' ? (
                    'Envoi en cours...'
                  ) : status === 'success' ? (
                    <><CheckCircle2 size={16} /> Envoyé !</>
                  ) : status === 'error' ? (
                    <><AlertCircle size={16} /> Erreur, réessayez</>
                  ) : (
                    <><Send size={16} /> Envoyer la demande</>
                  )}
                </button>
              </form>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}