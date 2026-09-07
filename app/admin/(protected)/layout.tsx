"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
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
      // On compare l'ID du compte connecté avec l'ID du propriétaire du portfolio configuré sur Vercel
      if (session.user.id !== process.env.NEXT_PUBLIC_PORTFOLIO_USER_ID) {
        console.warn("Intrusion bloquée : Tentative d'accès inter-tenant.");
        await supabase.auth.signOut(); // On le déconnecte de force par sécurité
        router.push('/admin/login');
        return;
      }

      // 4. Tout est bon, on lève le rideau
      setIsAuthorized(true);
    };

    verifierHabilitation();
  }, [router]);

  // Écran d'attente pendant la vérification (évite un flash de l'interface admin)
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-z-bg flex items-center justify-center">
        <span className="font-sub text-[10px] text-z-blue uppercase tracking-widest animate-pulse">
          Vérification des accréditations...
        </span>
      </div>
    );
  }

  // Si autorisé, on affiche les pages de l'administration (le dashboard)
  return <>{children}</>;
}
