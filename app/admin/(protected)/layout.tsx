"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { LogOut, FolderKanban, Tags, Settings, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import Link from 'next/link';

export default function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    const verifierHabilitation = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        router.push('/admin/login');
        return;
      }

      if (session.user.id !== process.env.NEXT_PUBLIC_PORTFOLIO_USER_ID) {
        console.warn("Intrusion bloquée : Tentative d'accès inter-tenant.");
        await supabase.auth.signOut();
        router.push('/admin/login');
        return;
      }

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
    <div className="min-h-screen bg-z-bg text-z-text flex flex-col md:flex-row overflow-hidden">
      
      {/* SIDEBAR DESKTOP RÉCRACTABLE */}
      <aside className={`hidden md:flex h-screen sticky top-0 bg-z-card border-r border-z-border flex-col z-20 shadow-2xl transition-all duration-300 ${
        isSidebarCollapsed ? 'w-20 p-4 items-center' : 'w-64 p-6'
      }`}>
        <div className={`mb-10 w-full flex ${isSidebarCollapsed ? 'justify-center mt-2' : 'justify-between items-center'}`}>
          {!isSidebarCollapsed ? (
            <div>
              <Link href="/" className="font-martyric text-3xl text-white hover:text-z-blue transition-colors">ZENITH</Link>
              <p className="font-sub text-[9px] uppercase tracking-widest text-z-muted mt-1">Administration</p>
            </div>
          ) : (
            <Link href="/" className="font-martyric text-3xl text-white hover:text-z-blue transition-colors">Z</Link>
          )}
        </div>

        <nav className="flex-1 space-y-2 w-full">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || pathname?.startsWith(`${link.href}/`);
            const Icon = link.icon;

            return (
              <Link 
                key={link.href} 
                href={link.href}
                title={isSidebarCollapsed ? link.label : undefined}
                className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center p-3' : 'gap-3 px-4 py-3'} rounded-lg text-xs font-bold uppercase tracking-widest transition-colors ${
                  isActive 
                    ? 'bg-z-blue/10 text-z-blue border border-z-blue/20 cursor-default' 
                    : 'text-z-muted hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <Icon size={isSidebarCollapsed ? 20 : 16} />
                {!isSidebarCollapsed && <span>{link.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto space-y-2 w-full">
          <button 
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            title={isSidebarCollapsed ? "Déplier le menu" : "Réduire le menu"}
            className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center p-3' : 'gap-3 px-4 py-3'} text-z-muted hover:text-white hover:bg-white/5 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer border border-transparent`}
          >
            {isSidebarCollapsed ? <PanelLeftOpen size={20} /> : <><PanelLeftClose size={16} /> <span>Réduire</span></>}
          </button>

          <button 
            onClick={handleLogout}
            title={isSidebarCollapsed ? "Déconnexion" : undefined}
            className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center p-3' : 'gap-3 px-4 py-3'} text-red-400 hover:bg-red-400/10 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer border border-transparent`}
          >
            <LogOut size={isSidebarCollapsed ? 20 : 16} />
            {!isSidebarCollapsed && <span>Déconnexion</span>}
          </button>
        </div>
      </aside>

      {/* HEADER MOBILE SEULEMENT */}
      <header className="md:hidden flex items-center justify-between px-6 py-4 bg-z-card/90 backdrop-blur-md border-b border-z-border sticky top-0 z-40">
        <Link href="/" className="font-martyric text-2xl text-white">ZENITH</Link>
        <span className="font-sub text-[9px] uppercase tracking-widest text-z-blue bg-z-blue/10 px-2 py-1 rounded">Admin</span>
      </header>

      {/* CONTENEUR PRINCIPAL */}
      <main className="flex-1 p-4 md:p-6 lg:p-8 pb-28 md:pb-8 relative h-screen overflow-y-auto custom-scrollbar">
        <div className="absolute top-0 right-0 w-125 h-125 bg-z-blue/5 blur-[120px] pointer-events-none" />
        {children} 
      </main>

      {/* BOTTOM NAV MOBILE */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-z-card/90 backdrop-blur-xl border-t border-z-border z-50">
        <div className="flex items-center justify-around px-2 pt-2 pb-[calc(env(safe-area-inset-bottom)+0.5rem)]">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || pathname?.startsWith(`${link.href}/`);
            const Icon = link.icon;
            return (
              <Link key={link.href} href={link.href} className={`flex flex-col items-center justify-center w-full gap-1 p-2 transition-colors ${isActive ? 'text-z-blue' : 'text-z-muted hover:text-white'}`}>
                <div className={`relative p-1.5 rounded-xl transition-all ${isActive ? 'bg-z-blue/15' : ''}`}>
                  <Icon size={20} className={isActive ? 'drop-shadow-[0_0_8px_rgba(0,123,255,0.5)]' : ''} />
                </div>
                <span className="text-[9px] font-bold uppercase tracking-widest">{link.label}</span>
              </Link>
            );
          })}
          <button onClick={handleLogout} className="flex flex-col items-center justify-center w-full gap-1 p-2 text-z-muted hover:text-red-400 transition-colors">
            <div className="relative p-1.5 rounded-xl transition-all hover:bg-red-400/10"><LogOut size={20} /></div>
            <span className="text-[9px] font-bold uppercase tracking-widest">Sortir</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
