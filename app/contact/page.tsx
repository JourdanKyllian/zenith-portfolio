"use client";

import { useState, useRef, useEffect } from 'react';
import { Mail, MessageSquare, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { sendEmail } from '../actions/sendEmail';

/**
 * Client Component : Gère l'affichage, les états d'envoi synchrones, 
 * et l'injection des charges utiles techniques requises par les processus de sécurité.
 */
export default function ContactPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [mountedAt, setMountedAt] = useState<number>(0);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    setMountedAt(Date.now());
  }, []);

  /**
   * Intercepte l'événement de soumission, injecte les métadonnées temporelles
   * et transmet la charge utile au traitement asynchrone côté serveur.
   * 
   * @param {FormData} formData - Instance de données du formulaire natif HTML.
   */
  async function handleAction(formData: FormData) {
    setStatus('loading');
    setFeedbackMessage(null);

    formData.append('form_timestamp', mountedAt.toString());

    const result = await sendEmail(formData);

    if (result.success) {
      setStatus('success');
      formRef.current?.reset();
      setMountedAt(Date.now());
      setTimeout(() => setStatus('idle'), 5000);
    } else {
      setStatus('error');
      setFeedbackMessage(result.error || "Une erreur est survenue lors du traitement du message.");
    }
  }

  return (
    <main className="min-h-screen bg-z-bg text-z-text">
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

              {/* Élément visuel décoratif (Desktop uniquement) pour équilibrer la hauteur du formulaire. */}
              <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden border border-z-border shadow-2xl group hidden lg:block animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <img
                  src="/aigle-contact.jpg"
                  alt="Emblème Zenith Production"
                  className="w-full h-full object-cover filter brightness-90 saturate-50 contrast-125 group-hover:saturate-100 group-hover:scale-105 transition-all duration-700"
                  loading="lazy"
                />
                {/* Masque de fondu vertical assurant la transition avec la charte sombre. */}
                <div className="absolute inset-0 bg-linear-to-t from-z-bg via-transparent to-transparent opacity-90 pointer-events-none" />
                {/* Bordure interne subtile (Glassmorphism). */}
                <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-2xl pointer-events-none" />
              </div>
            </div>

            <div className="lg:col-span-3 p-8 sm:p-10 rounded-2xl bg-z-card border border-z-border shadow-2xl">
              <form action={handleAction} ref={formRef} className="space-y-6">
                
                {/* 
                  Champ Honeypot masqué aux technologies d'assistance et utilisateurs humains.
                  Utilise un nommage métier neutre et désactive explicitement l'auto-complétion
                  pour contourner l'auto-remplissage des gestionnaires de mots de passe.
                */}
                <div className="absolute opacity-0 -z-10 h-0 w-0 overflow-hidden pointer-events-none" aria-hidden="true">
                  <label htmlFor="company_tax_id" tabIndex={-1}>Identifiant légal de l'entreprise :</label>
                  <input 
                    type="text" 
                    id="company_tax_id" 
                    name="company_tax_id" 
                    tabIndex={-1} 
                    autoComplete="off" 
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="fullname" className="text-[10px] uppercase font-bold tracking-widest text-z-muted ml-1">Nom complet</label>
                    <input id="fullname" name="name" required type="text" placeholder="Prenom NOM" className="w-full bg-z-bg border border-z-border rounded-lg p-4 text-sm focus:border-z-blue focus:outline-none transition-colors" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-[10px] uppercase font-bold tracking-widest text-z-muted ml-1">Email</label>
                    <input id="email" name="email" required type="email" placeholder="contact@exemple.com" className="w-full bg-z-bg border border-z-border rounded-lg p-4 text-sm focus:border-z-blue focus:outline-none transition-colors" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="mission_type" className="text-[10px] uppercase font-bold tracking-widest text-z-muted ml-1">Type de mission</label>
                  <select id="mission_type" name="type" className="w-full bg-z-bg border border-z-border rounded-lg p-4 text-sm focus:border-z-blue focus:outline-none transition-colors appearance-none">
                    <option>Montage Vidéo / Post-prod</option>
                    <option>Cadrage / Captation</option>
                    <option>Design Graphique</option>
                    <option>Autre</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-[10px] uppercase font-bold tracking-widest text-z-muted ml-1">Message</label>
                  <textarea id="message" name="message" required rows={5} placeholder="Dites-moi tout sur votre projet..." className="w-full bg-z-bg border border-z-border rounded-lg p-4 text-sm focus:border-z-blue focus:outline-none transition-colors resize-none"></textarea>
                </div>

                {status === 'error' && feedbackMessage && (
                  <div className="flex items-start gap-2.5 p-4 rounded-lg border border-red-500/20 bg-red-500/5 text-red-400 text-xs font-body leading-relaxed animate-fade-in">
                    <AlertCircle size={16} className="shrink-0 mt-0.5" />
                    <span>{feedbackMessage}</span>
                  </div>
                )}

                <button 
                  type="submit" 
                  disabled={status === 'loading' || status === 'success'}
                  className={`btn-blue w-full p-4 rounded-lg flex items-center justify-center gap-3 text-xs font-bold transition-all ${
                    status === 'loading' || status === 'success' ? 'opacity-70 cursor-not-allowed' : 'hover:scale-[1.01]'
                  }`}
                >
                  {status === 'loading' ? (
                    'Envoi en cours...'
                  ) : status === 'success' ? (
                    <><CheckCircle2 size={16} /> Envoyé !</>
                  ) : status === 'error' ? (
                    <><AlertCircle size={16} /> Échec de la demande</>
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