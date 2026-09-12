"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Link as LinkIcon, Mail, ShieldCheck, User, Share2, Edit3, X, ExternalLink } from 'lucide-react';
import { LinkedinIcon, InstagramIcon, FacebookIcon, YoutubeIcon, TiktokIcon } from '@/components/SocialIcons';
import PasswordInput from '@/components/ui/PasswordInput';
import Alert from '@/components/ui/Alert';

export default function ConfigurationPage() {
  const [authEmail, setAuthEmail] = useState('');
  const [cvUrl, setCvUrl] = useState('');
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [globalMessage, setGlobalMessage] = useState<{ text: string, type: 'success' | 'error' | 'warning' } | null>(null);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passMessage, setPassMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // --- ÉTATS RÉSEAUX SOCIAUX ---
  const [socials, setSocials] = useState({
    linkedin_url: '',
    instagram_url: '',
    facebook_url: '',
    tiktok_url: '',
    youtube_url: ''
  });
  
  // Nouvel état pour suivre individuellement quel réseau est en cours d'édition
  const [editingSocials, setEditingSocials] = useState<Record<string, boolean>>({});
  const [isSavingSocials, setIsSavingSocials] = useState(false);
  const [socialMessage, setSocialMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  const fetchSettings = async () => {
    const { data: authData } = await supabase.auth.getUser();
    if (authData.user) setAuthEmail(authData.user.email || '');

    const { data: dbData } = await supabase.from('parametres').select('*').eq('user_id', process.env.NEXT_PUBLIC_PORTFOLIO_USER_ID).single();
    if (dbData) {
      setCvUrl(dbData.cv_url || '');
      setSocials({
        linkedin_url: dbData.linkedin_url || '',
        instagram_url: dbData.instagram_url || '',
        facebook_url: dbData.facebook_url || '',
        tiktok_url: dbData.tiktok_url || '',
        youtube_url: dbData.youtube_url || ''
      });
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    setGlobalMessage(null);

    try {
      const { error: dbError } = await supabase.from('parametres').update({ cv_url: cvUrl }).eq('user_id', process.env.NEXT_PUBLIC_PORTFOLIO_USER_ID);
      if (dbError) throw new Error(dbError.message);

      const { data: currentUser } = await supabase.auth.getUser();
      if (currentUser.user && currentUser.user.email !== authEmail) {
        const { error: authError } = await supabase.auth.updateUser({ email: authEmail });
        if (authError) throw new Error(authError.message);
        setGlobalMessage({ text: "Un mail de confirmation a été envoyé à la nouvelle adresse.", type: 'warning' });
      } else {
        setGlobalMessage({ text: "Informations enregistrées avec succès !", type: 'success' });
        setTimeout(() => setGlobalMessage(null), 3000);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Une erreur est survenue";
      setGlobalMessage({ text: message, type: 'error' });
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

    if (error) {
      setPassMessage({ text: "Erreur : " + error.message, type: 'error' });
      setIsUpdatingPassword(false);
    } else {
      setPassMessage({ text: "Mot de passe mis à jour !", type: 'success' });
      setNewPassword(''); 
      setConfirmPassword('');
      setTimeout(() => setPassMessage(null), 3000);
    }
  };

  const toggleSocialEdit = (key: string) => {
    setEditingSocials(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSaveSocials = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSocials(true);
    setSocialMessage(null);

    try {
      const { error } = await supabase
        .from('parametres')
        .update({
          linkedin_url: socials.linkedin_url,
          instagram_url: socials.instagram_url,
          facebook_url: socials.facebook_url,
          tiktok_url: socials.tiktok_url,
          youtube_url: socials.youtube_url,
        })
        .eq('user_id', process.env.NEXT_PUBLIC_PORTFOLIO_USER_ID);

      if (error) throw new Error(error.message);
      
      setSocialMessage({ text: "Réseaux sociaux mis à jour avec succès !", type: 'success' });
      
      // On referme tous les champs en mode édition après sauvegarde
      setEditingSocials({});
      
      setTimeout(() => setSocialMessage(null), 3000);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Une erreur est survenue";
      setSocialMessage({ text: message, type: 'error' });
    }
    setIsSavingSocials(false);
  };

  // Tableau de configuration pour générer l'UI dynamiquement (DRY)
  const socialFields: { id: keyof typeof socials; label: string; icon: React.ElementType; placeholder: string }[] = [
    { id: 'linkedin_url', label: 'LinkedIn', icon: LinkedinIcon, placeholder: 'https://linkedin.com/in/...' },
    { id: 'instagram_url', label: 'Instagram', icon: InstagramIcon, placeholder: 'https://instagram.com/...' },
    { id: 'facebook_url', label: 'Facebook', icon: FacebookIcon, placeholder: 'https://facebook.com/...' },
    { id: 'tiktok_url', label: 'TikTok', icon: TiktokIcon, placeholder: 'https://tiktok.com/...' },
    { id: 'youtube_url', label: 'YouTube', icon: YoutubeIcon, placeholder: 'https://youtube.com/...' },
  ];

  return (
    <>
      <header className="mb-10 relative z-10">
        <h1 className="font-display font-bold text-3xl uppercase tracking-wider text-white">Configuration</h1>
        <p className="font-body text-sm text-z-muted mt-1">Gérez les identifiants de votre compte.</p>
      </header>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* CARTE 1 : CONNEXION & CV */}
        <section className="bg-z-card border border-z-border rounded-xl p-6 shadow-2xl">
          <div className="mb-6">
            <h2 className="font-sub text-xs uppercase tracking-[0.2em] text-z-blue mb-1 flex items-center gap-2">
              <User size={16} /> Connexion & CV
            </h2>
            <p className="text-xs text-z-muted">Modifiez votre identifiant d'accès et votre CV public.</p>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold tracking-widest text-z-muted ml-1">Email de connexion (Auth)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-z-muted"><Mail size={16} /></div>
                <input type="email" value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} className="w-full bg-z-bg border border-z-border rounded-lg py-3 pl-12 pr-4 text-sm text-z-text focus:border-z-blue focus:outline-none" />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold tracking-widest text-z-muted ml-1">Lien du CV (Google Drive PDF)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-z-muted"><LinkIcon size={16} /></div>
                <input type="url" value={cvUrl} onChange={(e) => setCvUrl(e.target.value)} className="w-full bg-z-bg border border-z-border rounded-lg py-3 pl-12 pr-4 text-sm text-z-text focus:border-z-blue focus:outline-none" />
              </div>
            </div>

            {globalMessage && (
              <div className="pt-2">
                <Alert type={globalMessage.type}>{globalMessage.text}</Alert>
              </div>
            )}

            <div className="pt-2">
              <button type="submit" disabled={isSavingSettings} className="btn-blue px-6 py-3 rounded-lg text-xs font-bold tracking-widest hover:scale-105 transition-all disabled:opacity-50">
                {isSavingSettings ? 'Enregistrement...' : 'Enregistrer les infos'}
              </button>
            </div>
          </form>
        </section>

        {/* CARTE 2 : SÉCURITÉ */}
        <section className="bg-z-card border border-z-border rounded-xl p-6 shadow-2xl">
          <div className="mb-6">
            <h2 className="font-sub text-xs uppercase tracking-[0.2em] text-z-blue mb-1 flex items-center gap-2">
              <ShieldCheck size={16} /> Sécurité du compte
            </h2>
            <p className="text-xs text-z-muted">Modifiez votre mot de passe d'accès à l'administration.</p>
          </div>
          
          <form onSubmit={handlePasswordUpdate} className="space-y-6">
            <PasswordInput label="Nouveau mot de passe" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
            <PasswordInput label="Confirmer le mot de passe" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
            
            {passMessage && (
              <div className="pt-2">
                <Alert type={passMessage.type}>{passMessage.text}</Alert>
              </div>
            )}

            <div className="pt-2">
              <button type="submit" disabled={isUpdatingPassword} className="bg-z-bg border border-z-border text-white px-6 py-3 rounded-lg text-xs font-bold tracking-widest hover:bg-white/5 transition-colors disabled:opacity-50">
                {isUpdatingPassword ? 'Mise à jour...' : 'Modifier le mot de passe'}
              </button>
            </div>
          </form>
        </section>

        {/* CARTE 3 : RÉSEAUX SOCIAUX (MODE INLINE EDIT) */}
        <section className="bg-z-card border border-z-border rounded-xl p-6 shadow-2xl lg:col-span-2">
          <div className="mb-8">
            <h2 className="font-sub text-xs uppercase tracking-[0.2em] text-z-blue mb-1 flex items-center gap-2">
              <Share2 size={16} /> Réseaux Sociaux
            </h2>
            <p className="text-xs text-z-muted">Gérez les liens de vos réseaux sociaux affichés dans le pied de page du site public.</p>
          </div>

          <form onSubmit={handleSaveSocials} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              
              {socialFields.map((field) => {
                const isEditing = editingSocials[field.id];
                const value = socials[field.id];
                const Icon = field.icon;

                return (
                  <div key={field.id} className="space-y-2">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-z-muted ml-1 flex items-center gap-2">
                      <Icon size={12} className="opacity-70" /> {field.label}
                    </label>

                    {!isEditing ? (
                      // MODE AFFICHAGE LECTURE SEULE
                      <div className="flex items-center justify-between p-3 bg-white/5 border border-z-border rounded-lg group h-11.5 transition-colors hover:bg-white/10">
                        <div className="flex items-center gap-3 overflow-hidden pr-2">
                          {value ? (
                            <a 
                              href={value} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-sm text-z-text hover:text-z-blue truncate transition-colors flex items-center gap-2"
                              title={value}
                            >
                              {value} <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                            </a>
                          ) : (
                            <span className="text-sm text-z-muted italic">Non renseigné</span>
                          )}
                        </div>
                        <button 
                          type="button" 
                          onClick={() => toggleSocialEdit(field.id)}
                          className="text-z-muted hover:text-white p-1.5 bg-z-bg rounded border border-transparent hover:border-z-border transition-all shrink-0 cursor-pointer"
                          title="Modifier le lien"
                        >
                          <Edit3 size={14} />
                        </button>
                      </div>
                    ) : (
                      // MODE ÉDITION (INPUT)
                      <div className="flex items-center gap-2 h-11.5 animate-in fade-in slide-in-from-right-2 duration-200">
                        <input 
                          type="url" 
                          autoFocus
                          value={value} 
                          onChange={(e) => setSocials({ ...socials, [field.id]: e.target.value })} 
                          className="w-full bg-z-bg border border-z-blue shadow-[0_0_10px_rgba(0,123,255,0.1)] rounded-lg px-3 h-full text-sm text-z-text focus:outline-none" 
                          placeholder={field.placeholder} 
                        />
                        <button 
                          type="button" 
                          onClick={() => toggleSocialEdit(field.id)}
                          className="h-full px-3.5 bg-z-card border border-z-border rounded-lg text-z-muted hover:text-white hover:bg-white/5 transition-colors shrink-0 flex items-center justify-center cursor-pointer"
                          title="Fermer l'édition"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}

            </div>

            {socialMessage && (
              <div className="pt-2">
                <Alert type={socialMessage.type}>{socialMessage.text}</Alert>
              </div>
            )}

            <div className="pt-4 border-t border-z-border">
              <button 
                type="submit" 
                disabled={isSavingSocials} 
                className="btn-blue px-6 py-3 rounded-lg text-xs font-bold tracking-widest hover:scale-105 transition-all disabled:opacity-50"
              >
                {isSavingSocials ? 'Enregistrement...' : 'Mettre à jour les réseaux'}
              </button>
            </div>
          </form>
        </section>

      </div>
    </>
  );
}
