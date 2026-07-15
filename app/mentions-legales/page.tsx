"use client";

import { X, Scale, ShieldCheck, EyeOff } from 'lucide-react';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LegalModal({ isOpen, onClose }: LegalModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1002] flex items-center justify-center p-4">
      {/* Arrière-plan flouté */}
      <div className="absolute inset-0 bg-z-bg/80 backdrop-blur-md" onClick={onClose} />
      
      {/* Conteneur du Modal */}
      <div className="relative w-full max-w-2xl bg-z-card border border-z-border p-6 rounded-2xl shadow-2xl flex flex-col max-h-[85vh] z-10 animate-fade-in">
        
        {/* En-tête */}
        <div className="flex items-center justify-between mb-6 border-b border-z-blue/10 pb-4">
          <div className="flex items-center gap-2 text-z-blue">
            <Scale size={20} />
            <h3 className="font-display font-bold text-xl uppercase tracking-wide text-z-text">
              Conformité & Mentions Légales
            </h3>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 text-z-muted hover:text-z-blue rounded-lg transition-colors cursor-pointer"
            aria-label="Fermer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Corps du texte (Scrollable) */}
        <div className="flex-grow overflow-y-auto pr-2 space-y-6 font-body text-xs text-z-text/80 leading-relaxed scrollbar-thin">
          
          {/* Section 1 : ÉQUIPE */}
          <section className="space-y-2">
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
              1. Édition du site
            </h4>
            <p>
              En vertu de l'article 6 de la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l'économie numérique, il est précisé aux utilisateurs du site l'identité des différents intervenants dans le cadre de sa réalisation et de son suivi :
            </p>
            <ul className="list-disc pl-5 space-y-1 text-z-muted">
              <li><strong className="text-z-text">Propriétaire & Éditeur :</strong> Gabin Husson — Zenith Production</li>
              <li><strong className="text-z-text">Statut juridique :</strong> Entreprise Individuelle (Micro-entreprise) — SIRET : 99056877600019</li>
              <li><strong className="text-z-text">Siège social :</strong> 2A, RUELLE DU PETIT VOUET, 51510 FAGNIERES, France</li>
              <li><strong className="text-z-text">Contact :</strong> zenithprod.contact@gmail.com</li>
              <li><strong className="text-z-text">Directeur de la publication :</strong> Gabin Husson</li>
              <li><strong className="text-z-text">Conception & Développement Web :</strong> Kyllian Jourdan</li>
            </ul>
          </section>

          {/* Section 2 : HÉBERGEMENT */}
          <section className="space-y-2">
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-white">
              2. Hébergement
            </h4>
            <p>
              Le site est hébergé par la société <strong className="text-white">Vercel Inc.</strong>, situé au 950 Tower Lane, Suite 2200, Foster City, CA 94404, États-Unis. Réseau de diffusion de contenu sécurisé et respectueux des infrastructures européennes. Contact technique : https://vercel.com.
            </p>
          </section>

          {/* Section 3 : RGPD */}
          <section className="space-y-2">
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <ShieldCheck size={14} className="text-emerald-400" />
              3. Protection des Données Personnelles (RGPD)
            </h4>
            <p>
              Zenith Production s'engage à ce que la collecte et le traitement de vos données, effectués à partir de notre formulaire de contact, soient conformes au règlement général sur la protection des données (RGPD) et à la loi Informatique et Libertés.
            </p>
            <ul className="list-disc pl-5 space-y-1 text-z-muted">
              <li><strong className="text-z-text">Données collectées :</strong> Nom, adresse e-mail et contenu du message via le formulaire de contact.</li>
              <li><strong className="text-z-text">Finalité :</strong> Ces données sont uniquement utilisées pour traiter, recontacter et répondre à vos demandes de devis ou de collaboration de projet. Aucune donnée n'est cédée ou revendue à des tiers.</li>
              <li><strong className="text-z-text">Sous-traitant technique :</strong> Les emails sont propulsés de manière sécurisée via l'infrastructure applicative de <strong className="text-white">Resend</strong>.</li>
              <li><strong className="text-z-text">Durée de conservation :</strong> Les données sont conservées pendant une durée maximale de 3 ans après le dernier échange commercial.</li>
              <li><strong className="text-z-text">Vos droits :</strong> Vous disposez d'un droit d'accès, de rectification et de suppression de vos données. Pour exercer ce droit, écrivez directement à : <span className="text-z-blue">zenithprod.contact@gmail.com</span>.</li>
            </ul>
          </section>

          {/* Section 4 : COOKIES */}
          <section className="space-y-2">
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <EyeOff size={14} className="text-z-blue" />
              4. Politique relative aux Cookies
            </h4>
            <p>
              Ce site n'utilise <strong className="text-white">aucun cookie publicitaire, marketing ou de traçage comportemental</strong>. Aucun bandeau de consentement n'est requis car nous protégeons nativement votre navigation. 
            </p>
            <p>
              Seul un outil de mesure d'audience anonymisé et axé sur les performances (<strong className="text-white">Vercel Analytics & Speed Insights</strong>) est activé. Les adresses IP y sont cryptées, respectant scrupuleusement les recommandations d'exemption de la CNIL.
            </p>
          </section>

          {/* Section 5 : PROPRIÉTÉ INTÉLECTUELLE */}
          <section className="space-y-2">
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-white">
              5. Propriété intellectuelle
            </h4>
            <p>
              L'ensemble des contenus présents sur ce site (créations graphiques, vidéos, logos, textes, animations, arborescences) est protégé par le droit d'auteur. Toute reproduction, distribution ou modification sans l'accord écrit préalable de Gabin Husson est strictement interdite.
            </p>
          </section>

        </div>

        {/* Pied du modal */}
        <div className="mt-6 pt-4 border-t border-z-blue/10">
          <button 
            onClick={onClose}
            className="w-full bg-z-bg border border-z-border text-z-muted hover:text-z-text p-3 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer text-center"
          >
            Prendre acte et fermer
          </button>
        </div>

      </div>
    </div>
  );
}