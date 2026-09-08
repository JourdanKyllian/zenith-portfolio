"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Save,
  Link as LinkIcon,
  Mail,
  ShieldCheck
} from 'lucide-react';

export default function ConfigurationPage() {
  const [isLoading, setIsLoading] = useState(true);
  
  // Variables Configuration
  const [contactEmail, setContactEmail] = useState('');
  const [cvUrl, setCvUrl] = useState('');

  // Variables Mot de passe
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passMessage, setPassMessage] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('parametres')
      .select('*')
      .eq('user_id', process.env.NEXT_PUBLIC_PORTFOLIO_USER_ID)
      .single();

    if (!error && data) {
      setContactEmail(data.contact_email || '');
      setCvUrl(data.cv_url || '');
    }
    setIsLoading(false);
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassMessage('');

    if (newPassword !== confirmPassword) {
      setPassMessage("Les mots de passe ne correspondent pas.");
      return;
    }
    if (newPassword.length < 6) {
      setPassMessage("Le mot de passe doit faire au moins 6 caractères.");
      return;
    }

    setIsUpdatingPassword(true);
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) {
      setPassMessage("Erreur lors de la mise à jour : " + error.message);
    } else {
      setPassMessage("Succès : Mot de passe mis à jour !");
      setNewPassword('');
      setConfirmPassword('');
    }
    setIsUpdatingPassword(false);
  };

  return (
    <>
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 relative z-10">
        <div>
          <h1 className="font-display font-bold text-3xl uppercase tracking-wider text-white">
            Configuration
          </h1>
          <p className="font-body text-sm text-z-muted mt-1">
            Gérez les paramètres globaux de votre portfolio.
          </p>
        </div>
        <button className="btn-blue px-5 py-2.5 rounded-lg flex items-center justify-center gap-2 text-xs font-bold tracking-widest shadow-lg shadow-z-blue/20 hover:scale-105 transition-all">
          <Save size={16} />
          Enregistrer
        </button>
      </header>

      <div className="relative z-10 max-w-2xl space-y-6">
        
        {/* INFORMATIONS GLOBALES */}
        <section className="bg-z-card border border-z-border rounded-xl p-6 shadow-2xl">
          <h2 className="font-sub text-xs uppercase tracking-[0.2em] text-z-blue mb-6">Informations Générales</h2>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold tracking-widest text-z-muted ml-1">
                Email de contact public
              </label>
              {isLoading ? (
                <div className="w-full h-12 bg-z-blue/5 border border-z-blue/10 rounded-lg animate-pulse" />
              ) : (
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-z-muted">
                    <Mail size={16} />
                  </div>
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full bg-z-bg border border-z-border rounded-lg py-3 pl-12 pr-4 text-sm text-z-text focus:border-z-blue focus:outline-none transition-all"
                    placeholder="contact@zenithproduction.fr"
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold tracking-widest text-z-muted ml-1">
                Lien du CV (Google Drive PDF)
              </label>
              {isLoading ? (
                <div className="w-full h-12 bg-z-blue/5 border border-z-blue/10 rounded-lg animate-pulse" />
              ) : (
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-z-muted">
                    <LinkIcon size={16} />
                  </div>
                  <input
                    type="url"
                    value={cvUrl}
                    onChange={(e) => setCvUrl(e.target.value)}
                    className="w-full bg-z-bg border border-z-border rounded-lg py-3 pl-12 pr-4 text-sm text-z-text focus:border-z-blue focus:outline-none transition-all"
                    placeholder="https://drive.google.com/file/d/..."
                  />
                </div>
              )}
            </div>
          </div>
        </section>

        {/* SÉCURITÉ */}
        <section className="bg-z-card border border-z-border rounded-xl p-6 shadow-2xl">
          <h2 className="font-sub text-xs uppercase tracking-[0.2em] text-z-blue mb-6 flex items-center gap-2">
            <ShieldCheck size={16} /> Sécurité du compte
          </h2>
          
          <form onSubmit={handlePasswordUpdate} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold tracking-widest text-z-muted ml-1">Nouveau mot de passe</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-z-bg border border-z-border rounded-lg py-3 px-4 text-sm text-z-text focus:border-z-blue focus:outline-none"
                placeholder="••••••••"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold tracking-widest text-z-muted ml-1">Confirmer le mot de passe</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-z-bg border border-z-border rounded-lg py-3 px-4 text-sm text-z-text focus:border-z-blue focus:outline-none"
                placeholder="••••••••"
                required
              />
            </div>

            {passMessage && (
              <p className={`text-xs font-bold font-sub tracking-widest uppercase ${passMessage.includes('Succès') ? 'text-emerald-400' : 'text-red-400'}`}>
                {passMessage}
              </p>
            )}

            <button 
              type="submit" 
              disabled={isUpdatingPassword}
              className="btn-blue px-5 py-2.5 rounded-lg text-xs font-bold tracking-widest hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100"
            >
              {isUpdatingPassword ? 'Mise à jour...' : 'Mettre à jour le mot de passe'}
            </button>
          </form>
        </section>

      </div>
    </>
  );
}
