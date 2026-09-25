"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Link as LinkIcon, Mail, ShieldCheck, User, Share2 } from 'lucide-react';
import PasswordInput from '@/components/ui/PasswordInput';
import Alert from '@/components/ui/Alert';
import { purgeCache } from '@/app/actions/revalidate';
import DynamicSocialLinks from '@/components/admin/DynamicSocialLinks';
import { AVAILABLE_SOCIALS } from '@/config/socials';

export default function ConfigurationPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [authEmail, setAuthEmail] = useState('');
  const [cvUrl, setCvUrl] = useState('');
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [globalMessage, setGlobalMessage] = useState<{ text: string, type: 'success' | 'error' | 'warning' } | null>(null);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passMessage, setPassMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const initialSocials = AVAILABLE_SOCIALS.reduce((acc, net) => ({ ...acc, [net.id]: '' }), {});
  const [socials, setSocials] = useState<Record<string, string>>(initialSocials);
  const [activeNetworks, setActiveNetworks] = useState<string[]>([]);
  const [isSavingSocials, setIsSavingSocials] = useState(false);
  const [socialMessage, setSocialMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      const { data: authData } = await supabase.auth.getUser();
      if (authData.user) setAuthEmail(authData.user.email || '');

      const { data: dbData } = await supabase.from('parametres').select('*').eq('user_id', process.env.NEXT_PUBLIC_PORTFOLIO_USER_ID).single();
      if (dbData) {
        setCvUrl(dbData.cv_url || '');
        
        const fetchedSocials = AVAILABLE_SOCIALS.reduce((acc, net) => {
          acc[net.id] = dbData[`${net.id}_url`] || '';
          return acc;
        }, {} as Record<string, string>);
        
        setSocials(fetchedSocials);
        setActiveNetworks(Object.keys(fetchedSocials).filter(k => fetchedSocials[k] !== ''));
      }
      setIsLoading(false);
    };

    fetchSettings();
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true); setGlobalMessage(null);
    try {
      const { error: dbError } = await supabase.from('parametres').update({ cv_url: cvUrl }).eq('user_id', process.env.NEXT_PUBLIC_PORTFOLIO_USER_ID);
      if (dbError) throw new Error(dbError.message);
      const { data: currentUser } = await supabase.auth.getUser();
      if (currentUser.user && currentUser.user.email !== authEmail) {
        const { error: authError } = await supabase.auth.updateUser({ email: authEmail });
        if (authError) throw new Error(authError.message);
        setGlobalMessage({ text: "Un mail de confirmation a été envoyé à la nouvelle adresse.", type: 'warning' });
      } else {
        await purgeCache();
        setGlobalMessage({ text: "Informations enregistrées avec succès !", type: 'success' });
        setTimeout(() => setGlobalMessage(null), 3000);
      }
    } catch (error) {
      setGlobalMessage({ text: error instanceof Error ? error.message : "Erreur", type: 'error' });
    }
    setIsSavingSettings(false);
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassMessage(null);
    if (newPassword !== confirmPassword) return setPassMessage({ text: "Les mots de passe ne correspondent pas.", type: 'error' });
    if (newPassword.length < 6) return setPassMessage({ text: "Au moins 6 caractères requis.", type: 'error' });
    setIsUpdatingPassword(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) setPassMessage({ text: "Erreur : " + error.message, type: 'error' });
    else { setPassMessage({ text: "Mot de passe mis à jour !", type: 'success' }); setNewPassword(''); setConfirmPassword(''); setTimeout(() => setPassMessage(null), 3000); }
    setIsUpdatingPassword(false);
  };

  const handleSaveSocials = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSocials(true); setSocialMessage(null);

    const payload = AVAILABLE_SOCIALS.reduce((acc, net) => {
      acc[`${net.id}_url`] = socials[net.id] || null;
      return acc;
    }, {} as Record<string, string | null>);

    try {
      const { error } = await supabase.from('parametres').update(payload).eq('user_id', process.env.NEXT_PUBLIC_PORTFOLIO_USER_ID);
      if (error) throw new Error(error.message);
      
      await purgeCache();
      
      setSocialMessage({ text: "Réseaux sociaux mis à jour avec succès !", type: 'success' });
      setTimeout(() => setSocialMessage(null), 3000);
    } catch (error) {
      setSocialMessage({ text: error instanceof Error ? error.message : "Erreur", type: 'error' });
    }
    setIsSavingSocials(false);
  };

  if (isLoading) return <div className="flex items-center justify-center min-h-[50vh] text-z-blue">Chargement de la configuration...</div>;

  return (
    <>
      <header className="mb-10 relative z-10">
        <h1 className="font-display font-bold text-3xl uppercase tracking-wider text-white">Configuration</h1>
        <p className="font-body text-sm text-z-muted mt-1">Gérez les identifiants de votre compte.</p>
      </header>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="space-y-8">
          <section className="bg-z-card border border-z-border rounded-xl p-6 shadow-2xl">
            <div className="mb-6"><h2 className="font-sub text-xs uppercase tracking-[0.2em] text-z-blue mb-1 flex items-center gap-2"><User size={16} /> Connexion & CV</h2></div>
            <form onSubmit={handleSaveSettings} className="space-y-6">
              <div className="space-y-2"><label className="text-[10px] uppercase font-bold tracking-widest text-z-muted ml-1">Email de connexion</label>
                <div className="relative"><div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-z-muted"><Mail size={16} /></div>
                <input type="email" value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} className="w-full bg-z-bg border border-z-border rounded-lg py-3 pl-12 pr-4 text-sm text-z-text focus:border-z-blue focus:outline-none" /></div>
              </div>
              <div className="space-y-2"><label className="text-[10px] uppercase font-bold tracking-widest text-z-muted ml-1">Lien du CV (Drive PDF)</label>
                <div className="relative"><div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-z-muted"><LinkIcon size={16} /></div>
                <input type="url" value={cvUrl} onChange={(e) => setCvUrl(e.target.value)} className="w-full bg-z-bg border border-z-border rounded-lg py-3 pl-12 pr-4 text-sm text-z-text focus:border-z-blue focus:outline-none" /></div>
              </div>
              {globalMessage && <Alert type={globalMessage.type}>{globalMessage.text}</Alert>}
              <button type="submit" disabled={isSavingSettings} className="btn-blue w-full py-3 rounded-lg text-xs font-bold tracking-widest hover:scale-[1.02] transition-all disabled:opacity-50">
                {isSavingSettings ? 'Enregistrement...' : 'Enregistrer les infos'}
              </button>
            </form>
          </section>

          <section className="bg-z-card border border-z-border rounded-xl p-6 shadow-2xl">
            <div className="mb-6"><h2 className="font-sub text-xs uppercase tracking-[0.2em] text-z-blue mb-1 flex items-center gap-2"><ShieldCheck size={16} /> Sécurité</h2></div>
            <form onSubmit={handlePasswordUpdate} className="space-y-6">
              <PasswordInput label="Nouveau mot de passe" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
              <PasswordInput label="Confirmer le mot de passe" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
              {passMessage && <Alert type={passMessage.type}>{passMessage.text}</Alert>}
              <button type="submit" disabled={isUpdatingPassword} className="bg-z-bg border border-z-border text-white w-full py-3 rounded-lg text-xs font-bold tracking-widest hover:bg-white/5 transition-colors disabled:opacity-50">
                {isUpdatingPassword ? 'Mise à jour...' : 'Modifier le mot de passe'}
              </button>
            </form>
          </section>
        </div>

        <section className="bg-z-card border border-z-border rounded-xl p-6 shadow-2xl">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="font-sub text-xs uppercase tracking-[0.2em] text-z-blue mb-1 flex items-center gap-2"><Share2 size={16} /> Réseaux Sociaux</h2>
              <p className="text-[10px] text-z-muted uppercase tracking-widest mt-1">Pied de page public</p>
            </div>
          </div>
          <form onSubmit={handleSaveSocials} className="space-y-6">
            <DynamicSocialLinks links={socials} setLinks={setSocials} activeLinks={activeNetworks} setActiveLinks={setActiveNetworks} />
            {socialMessage && <Alert type={socialMessage.type}>{socialMessage.text}</Alert>}
            <div className="pt-4 border-t border-z-border">
              <button type="submit" disabled={isSavingSocials} className="btn-blue w-full py-3 rounded-lg text-xs font-bold tracking-widest hover:scale-[1.02] transition-all disabled:opacity-50">
                {isSavingSocials ? 'Enregistrement...' : 'Sauvegarder les réseaux'}
              </button>
            </div>
          </form>
        </section>
      </div>
    </>
  );
}
