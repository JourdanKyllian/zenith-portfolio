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

  // Si autorisé, on affiche l'architecture globale (Sidebar + Contenu)
  return (
    <div className="min-h-screen bg-z-bg text-z-text flex flex-col md:flex-row">
      
      {/* SIDEBAR UNIQUE POUR TOUTE L'ADMINISTRATION */}
      <aside className="w-full md:w-64 bg-z-card border-b md:border-b-0 md:border-r border-z-border p-6 flex flex-col z-20">
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

        <button 
          onClick={handleLogout}
          className="mt-auto flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-400/10 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer"
        >
          <LogOut size={16} />
          Déconnexion
        </button>
      </aside>

      {/* CONTENEUR PRINCIPAL DYNAMIQUE */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto relative">
        <div className="absolute top-0 right-0 w-125 h-125 bg-z-blue/5 blur-[120px] pointer-events-none" />
        
        {/* L'intérieur des pages s'injectera directement ici */}
        {children} 

      </main>
    </div>
  );
}
