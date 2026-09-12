"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { LogOut, FolderKanban, Tags, Settings } from 'lucide-react';
import Link from 'next/link';

export default function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const verifierHabilitation = async () => {
      // 1. Récupération de la session active dans le navigateur
      const { data: { session } } = await supabase.auth.getSession();

      // 2. S'il n'est pas du tout connecté -> Retour au login
      if (!session) {
        router.push('/admin/login');
        return;
      }

      // 3. LE VERROU MULTI-TENANT : Vérification de l'identité stricte
      if (session.user.id !== process.env.NEXT_PUBLIC_PORTFOLIO_USER_ID) {
        console.warn("Intrusion bloquée : Tentative d'accès inter-tenant.");
        await supabase.auth.signOut();
        router.push('/admin/login');
        return;
      }

      // 4. Tout est bon, on lève le rideau
      setIsAuthorized(true);
    };

    verifierHabilitation();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  const navLinks = [
    { href: '/admin/dashboard', icon: FolderKanban, label: 'Projets' },
    { href: '/admin/categories', icon: Tags, label: 'Catégories' },
    { href: '/admin/configuration', icon: Settings, label: 'Configuration' },
  ];

  // Écran d'attente pendant la vérification
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-z-bg flex items-center justify-center">
        <span className="font-sub text-[10px] text-z-blue uppercase tracking-widest animate-pulse">
          Vérification des accréditations...
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-z-bg text-z-text flex flex-col md:flex-row">
      
      {/* 
        --- SIDEBAR DESKTOP ---
        La sidebar est désormais cachée sur mobile (hidden md:flex).
        On ajoute h-screen et sticky top-0 pour la figer à l'écran. 
      */}
      <aside className="hidden md:flex w-64 h-screen sticky top-0 bg-z-card border-r border-z-border p-6 flex-col z-20 shadow-2xl">
        <div className="mb-10">
          <Link href="/" className="font-martyric text-3xl text-white hover:text-z-blue transition-colors">
            ZENITH
          </Link>
          <p className="font-sub text-[9px] uppercase tracking-widest text-z-muted mt-1">
            Administration
          </p>
        </div>

        <nav className="flex-1 space-y-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || pathname?.startsWith(`${link.href}/`);
            const Icon = link.icon;

            return (
              <Link 
                key={link.href} 
                href={link.href} 
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors ${
                  isActive 
                    ? 'bg-z-blue/10 text-z-blue border border-z-blue/20 cursor-default' 
                    : 'text-z-muted hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <Icon size={16} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* mt-auto pousse le bouton tout en bas de la hauteur h-screen, donc toujours visible ! */}
        <button 
          onClick={handleLogout}
          className="mt-auto flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-400/10 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer"
        >
          <LogOut size={16} />
          Déconnexion
        </button>
      </aside>

      {/* --- HEADER MOBILE SEULEMENT --- */}
      <header className="md:hidden flex items-center justify-between px-6 py-4 bg-z-card/90 backdrop-blur-md border-b border-z-border sticky top-0 z-40">
        <Link href="/" className="font-martyric text-2xl text-white">
          ZENITH
        </Link>
        <span className="font-sub text-[9px] uppercase tracking-widest text-z-blue bg-z-blue/10 px-2 py-1 rounded">
          Admin
        </span>
      </header>

      {/* 
        --- CONTENEUR PRINCIPAL --- 
        On ajoute pb-28 sur mobile pour que le contenu ne soit pas caché sous la Bottom Nav
      */}
      <main className="flex-1 p-4 sm:p-6 md:p-10 pb-28 md:pb-10 relative">
        <div className="absolute top-0 right-0 w-125 h-125 bg-z-blue/5 blur-[120px] pointer-events-none" />
        
        {/* L'intérieur des pages s'injectera directement ici */}
        {children} 

      </main>

      {/* 
        --- BOTTOM NAV MOBILE ---
        Visible uniquement sur petit écran.
        Utilisation de env(safe-area-inset-bottom) pour les iPhones sans bouton Home.
      */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-z-card/90 backdrop-blur-xl border-t border-z-border z-50">
        <div className="flex items-center justify-around px-2 pt-2 pb-[calc(env(safe-area-inset-bottom)+0.5rem)]">
          
          {navLinks.map((link) => {
            const isActive = pathname === link.href || pathname?.startsWith(`${link.href}/`);
            const Icon = link.icon;

            return (
              <Link 
                key={link.href} 
                href={link.href} 
                className={`flex flex-col items-center justify-center w-full gap-1 p-2 transition-colors ${
                  isActive ? 'text-z-blue' : 'text-z-muted hover:text-white'
                }`}
              >
                <div className={`relative p-1.5 rounded-xl transition-all ${isActive ? 'bg-z-blue/15' : ''}`}>
                  <Icon size={20} className={isActive ? 'drop-shadow-[0_0_8px_rgba(0,123,255,0.5)]' : ''} />
                </div>
                <span className="text-[9px] font-bold uppercase tracking-widest">
                  {link.label}
                </span>
              </Link>
            );
          })}

          <button 
            onClick={handleLogout}
            className="flex flex-col items-center justify-center w-full gap-1 p-2 text-z-muted hover:text-red-400 transition-colors"
          >
            <div className="relative p-1.5 rounded-xl transition-all hover:bg-red-400/10">
              <LogOut size={20} />
            </div>
            <span className="text-[9px] font-bold uppercase tracking-widest">
              Sortir
            </span>
          </button>

        </div>
      </nav>

    </div>
  );
}
