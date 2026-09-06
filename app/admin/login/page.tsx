"use client";

import { useState } from 'react';
import { Lock, Mail, Key, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  // On prépare les states pour la future logique d'authentification
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // TODO: Implémenter la logique Supabase Auth ici plus tard
    console.log("Tentative de connexion avec :", email);
    setTimeout(() => setIsLoading(false), 1000); // Simulation de chargement
  };

  return (
    <main className="min-h-screen bg-z-bg flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Effets de lumière en arrière-plan */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-z-blue/5 blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 bg-radial from-transparent to-z-bg pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        {/* En-tête */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-block mb-6 group">
            <div className="w-12 h-12 rounded-xl bg-z-card border border-z-border flex items-center justify-center group-hover:border-z-blue/50 group-hover:shadow-[0_0_20px_rgba(0,123,255,0.2)] transition-all">
              <Lock size={20} className="text-z-muted group-hover:text-z-blue transition-colors" />
            </div>
          </Link>
          <h1 className="font-display font-bold text-3xl uppercase tracking-wider text-z-text">
            Accès <span className="text-glow">Restreint</span>
          </h1>
          <p className="font-sub text-[10px] uppercase tracking-[0.3em] text-z-muted mt-3">
            Panneau d'administration
          </p>
        </div>

        {/* Formulaire */}
        <div className="bg-z-card border border-z-border p-8 rounded-2xl shadow-2xl backdrop-blur-sm">
          <form onSubmit={handleLogin} className="space-y-6">
            
            <div className="space-y-2">
              <label htmlFor="email" className="text-[10px] uppercase font-bold tracking-widest text-z-muted ml-1">
                Identifiant
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-z-muted">
                  <Mail size={16} />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-z-bg border border-z-border rounded-lg py-4 pl-12 pr-4 text-sm text-z-text focus:border-z-blue focus:ring-1 focus:ring-z-blue focus:outline-none transition-all"
                  placeholder="admin@zenithproduction.fr"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-[10px] uppercase font-bold tracking-widest text-z-muted ml-1">
                Mot de passe
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-z-muted">
                  <Key size={16} />
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-z-bg border border-z-border rounded-lg py-4 pl-12 pr-4 text-sm text-z-text focus:border-z-blue focus:ring-1 focus:ring-z-blue focus:outline-none transition-all"
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full btn-blue py-4 rounded-lg flex items-center justify-center gap-3 text-xs font-bold tracking-widest transition-all ${
                isLoading ? 'opacity-70 cursor-wait' : 'hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(0,123,255,0.3)]'
              }`}
            >
              {isLoading ? 'Authentification...' : 'Déverrouiller le module'}
              {!isLoading && <ArrowRight size={16} />}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
