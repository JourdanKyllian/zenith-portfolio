"use client";

import { useState } from 'react';
import { Lock, Mail, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import PasswordInput from '@/components/ui/PasswordInput';
import Alert from '@/components/ui/Alert';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMessage("Identifiants incorrects ou accès refusé.");
        setIsLoading(false);
        return;
      }

      if (data.session) {
        router.push('/admin/dashboard');
      }
    } catch (err) {
      console.error("Erreur d'authentification :", err);
      setErrorMessage("Une erreur critique est survenue.");
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      setErrorMessage("Veuillez saisir votre adresse email ci-dessus pour la réinitialisation.");
      return;
    }
    
    setIsResetting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/admin/configuration`,
    });

    if (error) {
      setErrorMessage("Erreur lors de l'envoi : " + error.message);
    } else {
      setSuccessMessage("Un email de réinitialisation vous a été envoyé.");
    }
    
    setIsResetting(false);
  };

  return (
    <main className="min-h-screen bg-z-bg flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-200 bg-z-blue/5 blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 bg-radial from-transparent to-z-bg pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
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
                  className="w-full bg-z-bg border border-z-border rounded-lg py-3 pl-12 pr-4 text-sm text-z-text focus:border-z-blue focus:outline-none transition-all"
                  placeholder="admin@zenithproduction.fr"
                />
              </div>
            </div>

            <div className="space-y-2">
              <PasswordInput 
                label="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div className="flex justify-end mt-1">
                <button
                  type="button"
                  onClick={handleResetPassword}
                  disabled={isResetting}
                  className="text-[10px] text-z-muted hover:text-z-blue transition-colors uppercase tracking-widest font-bold disabled:opacity-50"
                >
                  {isResetting ? 'Envoi...' : 'Mot de passe oublié ?'}
                </button>
              </div>
            </div>

            {/* Zone d'affichage des alertes avec le composant DRY */}
            {errorMessage && <Alert type="error">{errorMessage}</Alert>}
            {successMessage && <Alert type="success">{successMessage}</Alert>}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full btn-blue py-3.5 rounded-lg flex items-center justify-center gap-3 text-xs font-bold tracking-widest transition-all ${
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
