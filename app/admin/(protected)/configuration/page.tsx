"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { 
  LogOut, 
  FolderKanban, 
  Tags, 
  Settings,
  Save,
  Link as LinkIcon,
  Mail
} from 'lucide-react';
import Link from 'next/link';

export default function ConfigurationPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  
  // Variables d'état du formulaire
  const [contactEmail, setContactEmail] = useState('');
  const [cvUrl, setCvUrl] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setIsLoading(true);
    // Exemple d'appel Supabase vers une table 'parametres'
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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-z-bg text-z-text flex flex-col md:flex-row">
      
      {/* --- SIDEBAR --- */}
      <aside className="w-full md:w-64 bg-z-card border-b md:border-b-0 md:border-r border-z-border p-6 flex flex-col">
        <div className="mb-10">
          <Link href="/" className="font-martyric text-3xl text-white hover:text-z-blue transition-colors">
            ZENITH
          </Link>
          <p className="font-sub text-[9px] uppercase tracking-widest text-z-muted mt-1">
            Administration
          </p>
        </div>

        <nav className="flex-1 space-y-2">
          <Link href="/admin/dashboard" className="w-full flex items-center gap-3 px-4 py-3 text-z-muted hover:text-white hover:bg-white/5 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors">
            <FolderKanban size={16} />
            Projets
          </Link>
          <Link href="/admin/categories" className="w-full flex items-center gap-3 px-4 py-3 text-z-muted hover:text-white hover:bg-white/5 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors">
            <Tags size={16} />
            Catégories
          </Link>
          {/* Bouton actif */}
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-z-blue/10 text-z-blue rounded-lg text-xs font-bold uppercase tracking-widest border border-z-blue/20 cursor-default">
            <Settings size={16} />
            Configuration
          </button>
        </nav>

        <button 
          onClick={handleLogout}
          className="mt-auto flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-400/10 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer"
        >
          <LogOut size={16} />
          Déconnexion
        </button>
      </aside>

      {/* --- CONTENU PRINCIPAL --- */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto relative">
        <div className="absolute top-0 right-0 w-125 h-125 bg-z-blue/5 blur-[120px] pointer-events-none" />

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
          
          {/* Section Informations Globales */}
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
                      className="w-full bg-z-bg border border-z-border rounded-lg py-3 pl-12 pr-4 text-sm text-z-text focus:border-z-blue focus:ring-1 focus:ring-z-blue focus:outline-none transition-all"
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
                      className="w-full bg-z-bg border border-z-border rounded-lg py-3 pl-12 pr-4 text-sm text-z-text focus:border-z-blue focus:ring-1 focus:ring-z-blue focus:outline-none transition-all"
                      placeholder="https://drive.google.com/file/d/..."
                    />
                  </div>
                )}
              </div>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}
