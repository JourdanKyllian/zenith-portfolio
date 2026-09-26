"use client";

import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { Link as LinkIcon, Mail, ShieldCheck, User, Share2 } from 'lucide-react';
import PasswordInput from '@/components/ui/PasswordInput';
import Alert from '@/components/ui/Alert';
import { purgeCache } from '@/app/actions/revalidate';
import DynamicSocialLinks from '@/components/admin/DynamicSocialLinks';
import SubmitButton, { SubmitStatus } from '@/components/admin/SubmitButton';
import { AVAILABLE_SOCIALS } from '@/config/socials';

export default function ConfigurationPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [authEmail, setAuthEmail] = useState('');
  const [cvUrl, setCvUrl] = useState('');
  
  const [settingsStatus, setSettingsStatus] = useState<SubmitStatus>('idle');
  const [globalMessage, setGlobalMessage] = useState<{ text: string, type: 'success' | 'error' | 'warning' } | null>(null);
  const settingsFormRef = useRef<HTMLFormElement>(null);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordStatus, setPasswordStatus] = useState<SubmitStatus>('idle');
  const [passMessage, setPassMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);
  const passwordFormRef = useRef<HTMLFormElement>(null);

  const initialSocials = AVAILABLE_SOCIALS.reduce((acc, net) => ({ ...acc, [net.id]: '' }), {});
  const [socials, setSocials] = useState<Record<string, string>>(initialSocials);
  const [activeNetworks, setActiveNetworks] = useState<string[]>([]);
  const [socialsStatus, setSocialsStatus] = useState<SubmitStatus>('idle');
  const [socialMessage, setSocialMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);
  const socialsFormRef = useRef<HTMLFormElement>(null);

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
    setSettingsStatus('loading'); setGlobalMessage(null);
    try {
      const { error: dbError } = await supabase.from('parametres').update({ cv_url: cvUrl }).eq('user_id', process.env.NEXT_PUBLIC_PORTFOLIO_USER_ID);
      if (dbError) throw new Error(dbError.message);
      const { data: currentUser } = await supabase.auth.getUser();
      if (currentUser.user && currentUser.user.email !== authEmail) {
        const { error: authError } = await supabase.auth.updateUser({ email: authEmail });
        if (authError) throw new Error(authError.message);
        setSettingsStatus('success');
        setGlobalMessage({ text: "Un mail de confirmation a été envoyé à la nouvelle adresse.", type: 'warning' });
        setTimeout(() => { setSettingsStatus('idle'); setGlobalMessage(null); }, 3000);
      } else {
        await purgeCache();
        setSettingsStatus('success');
        setGlobalMessage({ text: "Informations enregistrées avec succès !", type: 'success' });
        setTimeout(() => { setSettingsStatus('idle'); setGlobalMessage(null); }, 3000);
      }
    } catch (error) {
      setSettingsStatus('error');
      setGlobalMessage({ text: error instanceof Error ? error.message : "Erreur", type: 'error' });
      settingsFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => setSettingsStatus('idle'), 3000);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordStatus('loading'); setPassMessage(null);
    if (newPassword !== confirmPassword) {
      setPasswordStatus('error'); setPassMessage({ text: "Les mots de passe ne correspondent pas.", type: 'error' });
      setTimeout(() => setPasswordStatus('idle'), 3000); return;
    }
    if (newPassword.length < 6) {
      setPasswordStatus('error'); setPassMessage({ text: "Au moins 6 caractères requis.", type: 'error' });
      setTimeout(() => setPasswordStatus('idle'), 3000); return;
    }
    
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      setPasswordStatus('error'); setPassMessage({ text: "Erreur : " + error.message, type: 'error' });
      passwordFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => setPasswordStatus('idle'), 3000);
    } else { 
      setPasswordStatus('success'); setPassMessage({ text: "Mot de passe mis à jour !", type: 'success' }); 
      setNewPassword(''); setConfirmPassword(''); 
      setTimeout(() => { setPasswordStatus('idle'); setPassMessage(null); }, 3000); 
    }
  };

  const handleSaveSocials = async (e: React.FormEvent) => {
    e.preventDefault();
    setSocialsStatus('loading'); setSocialMessage(null);

    const payload = AVAILABLE_SOCIALS.reduce((acc, net) => {
      acc[`${net.id}_url`] = socials[net.id] || null;
      return acc;
    }, {} as Record<string, string | null>);

    try {
      const { error } = await supabase.from('parametres').update(payload).eq('user_id', process.env.NEXT_PUBLIC_PORTFOLIO_USER_ID);
      if (error) throw new Error(error.message);
      await purgeCache();
      setSocialsStatus('success');
      setSocialMessage({ text: "Réseaux sociaux mis à jour avec succès !", type: 'success' });
      setTimeout(() => { setSocialsStatus('idle'); setSocialMessage(null); }, 3000);
    } catch (error) {
      setSocialsStatus('error');
      setSocialMessage({ text: error instanceof Error ? error.message : "Erreur", type: 'error' });
      socialsFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => setSocialsStatus('idle'), 3000);
    }
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
            <form ref={settingsFormRef} onSubmit={handleSaveSettings} className="space-y-6">
              <div className="space-y-2"><label className="text-[10px] uppercase font-bold tracking-widest text-z-muted ml-1">Email de connexion</label>
                <div className="relative"><div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-z-muted"><Mail size={16} /></div>
                <input type="email" value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} className="w-full bg-z-bg border border-z-border rounded-lg py-3 pl-12 pr-4 text-sm text-z-text focus:border-z-blue focus:outline-none" /></div>
              </div>
              <div className="space-y-2"><label className="text-[10px] uppercase font-bold tracking-widest text-z-muted ml-1">Lien du CV (Drive PDF)</label>
                <div className="relative"><div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-z-muted"><LinkIcon size={16} /></div>
                <input type="url" value={cvUrl} onChange={(e) => setCvUrl(e.target.value)} className="w-full bg-z-bg border border-z-border rounded-lg py-3 pl-12 pr-4 text-sm text-z-text focus:border-z-blue focus:outline-none" /></div>
              </div>
              {globalMessage && <Alert type={globalMessage.type}>{globalMessage.text}</Alert>}
              <SubmitButton status={settingsStatus} fullWidth className="py-3 text-xs" idleText="Enregistrer les infos" />
            </form>
          </section>

          <section className="bg-z-card border border-z-border rounded-xl p-6 shadow-2xl">
            <div className="mb-6"><h2 className="font-sub text-xs uppercase tracking-[0.2em] text-z-blue mb-1 flex items-center gap-2"><ShieldCheck size={16} /> Sécurité</h2></div>
            <form ref={passwordFormRef} onSubmit={handlePasswordUpdate} className="space-y-6">
              <PasswordInput label="Nouveau mot de passe" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
              <PasswordInput label="Confirmer le mot de passe" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
              {passMessage && <Alert type={passMessage.type}>{passMessage.text}</Alert>}
              <SubmitButton variant="ghost" status={passwordStatus} fullWidth className="py-3 text-xs" idleText="Modifier le mot de passe" />
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
          <form ref={socialsFormRef} onSubmit={handleSaveSocials} className="space-y-6">
            <DynamicSocialLinks links={socials} setLinks={setSocials} activeLinks={activeNetworks} setActiveLinks={setActiveNetworks} />
            {socialMessage && <Alert type={socialMessage.type}>{socialMessage.text}</Alert>}
            <div className="pt-4 border-t border-z-border">
              <SubmitButton status={socialsStatus} fullWidth className="py-3 text-xs" idleText="Sauvegarder les réseaux" />
            </div>
          </form>
        </section>
      </div>
    </>
  );
}
