"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, Save, Image as ImageIcon, Link2, FileText, ToggleLeft, ToggleRight, Eye, PenTool } from 'lucide-react';
import Link from 'next/link';
import { Categorie } from '@/types';
import Alert from '@/components/ui/Alert';
import { purgeCache } from '@/app/actions/revalidate';
import RichTextEditor from '@/components/ui/RichTextEditor';
import { getBadgeTheme } from '@/config/colors';

export default function NouveauProjetPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Categorie[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [titre, setTitre] = useState('');
  const [slug, setSlug] = useState('');
  const [categorieId, setCategorieId] = useState<string>('');
  const [description, setDescription] = useState('');
  const [enLigne, setEnLigne] = useState(false);
  const [miniatureUrl, setMiniatureUrl] = useState('');
  
  const [linkInstagram, setLinkInstagram] = useState('');
  const [linkYoutube, setLinkYoutube] = useState('');
  const [linkTiktok, setLinkTiktok] = useState('');
  const [linkTwitch, setLinkTwitch] = useState('');
  const [linkFacebook, setLinkFacebook] = useState('');

  // L'onglet actif à gauche
  const [leftPanelMode, setLeftPanelMode] = useState<'edit' | 'preview'>('edit');

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase.from('categorie').select('*').eq('user_id', process.env.NEXT_PUBLIC_PORTFOLIO_USER_ID).order('name');
      if (data) setCategories(data as Categorie[]);
    };
    fetchCategories();
  }, []);

  const handleTitreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitre(val); setErrorMessage(null);
    setSlug(val.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-'));
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if(e) e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    const safeTitre = titre.replace(/"/g, '""');
    const { data: existingData } = await supabase.from('projet').select('id').eq('user_id', process.env.NEXT_PUBLIC_PORTFOLIO_USER_ID).or(`titre.eq."${safeTitre}",slug.eq."${slug}"`);

    if (existingData && existingData.length > 0) {
      setErrorMessage("Impossible d'enregistrer : un projet avec ce titre/slug existe déjà.");
      setIsSubmitting(false); return; 
    }

    const newProjet = {
      titre, slug, categorie_id: categorieId ? parseInt(categorieId) : null,
      description: description || null, en_ligne: enLigne, miniature_url: miniatureUrl || null,
      link_instagram: linkInstagram || null, link_youtube: linkYoutube || null,
      link_tiktok: linkTiktok || null, link_twitch: linkTwitch || null, link_facebook: linkFacebook || null,
      user_id: process.env.NEXT_PUBLIC_PORTFOLIO_USER_ID
    };

    const { data, error } = await supabase.from('projet').insert([newProjet]).select('id').single();

    if (error) { setErrorMessage(error.message); setIsSubmitting(false); } 
    else if (data) { await purgeCache(); router.push(`/admin/dashboard/projet/${data.id}`); }
  };

  const activeCategory = categories.find(c => c.id.toString() === categorieId);
  const badgeTheme = getBadgeTheme(activeCategory?.color);

  return (
    <div className="w-full flex flex-col lg:flex-row gap-6 h-auto lg:h-[calc(100vh-4rem)]">
      
      {/* COLONNE 1 : LE FORMULAIRE / APERÇU */}
      <div className="flex-[1.2] flex flex-col min-w-0 bg-z-card/80 border border-z-border rounded-xl shadow-xl overflow-hidden relative z-10">
        
        <header className="shrink-0 p-4 border-b border-z-border flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-z-card/50 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard" className="shrink-0 w-10 h-10 rounded-lg bg-z-bg border border-z-border flex items-center justify-center text-z-muted hover:text-white hover:border-z-blue transition-all"><ArrowLeft size={18} /></Link>
            <div>
              <h1 className="font-display font-bold text-xl uppercase tracking-wider text-white">Nouveau Projet</h1>
            </div>
          </div>
          
          <div className="flex items-center justify-between xl:justify-end gap-4 w-full xl:w-auto">
            <div className="flex bg-z-bg p-1 rounded-lg border border-z-border shrink-0">
              <button onClick={() => setLeftPanelMode('edit')} className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all ${leftPanelMode === 'edit' ? 'bg-z-card text-white shadow-sm' : 'text-z-muted hover:text-white'}`}>
                <PenTool size={12} /> Édition
              </button>
              <button onClick={() => setLeftPanelMode('preview')} className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all ${leftPanelMode === 'preview' ? 'bg-z-card text-z-blue shadow-sm' : 'text-z-muted hover:text-white'}`}>
                <Eye size={12} /> Aperçu Live
              </button>
            </div>

            {leftPanelMode === 'edit' && (
              <button type="button" onClick={() => handleSubmit()} disabled={isSubmitting} className="shrink-0 btn-blue px-4 py-2 rounded-lg flex items-center justify-center gap-2 text-[10px] font-bold tracking-widest shadow-lg hover:scale-105 transition-all disabled:opacity-50">
                <Save size={14} /> {isSubmitting ? '...' : 'Créer le projet'}
              </button>
            )}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto custom-scrollbar relative">
          
          {/* VUE ÉDITION */}
          <div className={`p-6 space-y-6 ${leftPanelMode === 'edit' ? 'block' : 'hidden'}`}>
            {errorMessage && <Alert type="error">{errorMessage}</Alert>}

            <form onSubmit={handleSubmit} className="space-y-6">
              <section className="bg-z-bg border border-z-border rounded-xl p-6">
                <h2 className="font-sub text-xs uppercase tracking-[0.2em] text-z-blue mb-6 flex items-center gap-2"><FileText size={16} /> Informations</h2>
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-2"><label className="text-[10px] uppercase font-bold tracking-widest text-z-muted ml-1">Titre du projet *</label><input required type="text" value={titre} onChange={handleTitreChange} className="w-full bg-z-card border border-z-border rounded-lg p-3 text-sm focus:border-z-blue focus:outline-none" /></div>
                  <div className="space-y-2"><label className="text-[10px] uppercase font-bold tracking-widest text-z-muted ml-1">Slug (URL) *</label><input required type="text" value={slug} onChange={(e) => { setSlug(e.target.value); setErrorMessage(null); }} className="w-full bg-z-card border border-z-border rounded-lg p-3 text-sm text-z-muted focus:border-z-blue focus:outline-none" /></div>
                </div>
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-z-muted ml-1">Catégorie</label>
                    <select value={categorieId} onChange={(e) => setCategorieId(e.target.value)} className="w-full bg-z-card border border-z-border rounded-lg p-3 text-sm text-white focus:border-z-blue focus:outline-none appearance-none">
                      <option value="">-- Sans catégorie --</option>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2 flex flex-col justify-center">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-z-muted ml-1 mb-2">Visibilité</label>
                    <button type="button" onClick={() => setEnLigne(!enLigne)} className={`flex items-center gap-3 w-fit px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-widest transition-colors ${enLigne ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-z-card border border-z-border text-z-muted'}`}>
                      {enLigne ? <ToggleRight size={20} /> : <ToggleLeft size={20} />} {enLigne ? 'Public' : 'Brouillon'}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-z-muted ml-1">Description du projet</label>
                  <RichTextEditor value={description} onChange={setDescription} placeholder="Présentez le contexte..." minHeight="200px" />
                </div>
              </section>

              <section className="bg-z-bg border border-z-border rounded-xl p-6">
                <h2 className="font-sub text-xs uppercase tracking-[0.2em] text-z-blue mb-6 flex items-center gap-2"><ImageIcon size={16} /> Visuel</h2>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-z-muted ml-1">URL de la miniature</label>
                    <span className="text-[9px] text-z-blue/70 italic px-2 py-0.5 bg-z-blue/5 rounded border border-z-blue/10">Drive direct</span>
                  </div>
                  <input type="url" value={miniatureUrl} onChange={(e) => setMiniatureUrl(e.target.value)} className="w-full bg-z-card border border-z-border rounded-lg p-3 text-sm focus:border-z-blue focus:outline-none placeholder:text-z-muted/30" placeholder="https://drive.google.com/uc?id=..." />
                </div>
              </section>

              <section className="bg-z-bg border border-z-border rounded-xl p-6">
                <h2 className="font-sub text-xs uppercase tracking-[0.2em] text-z-blue mb-6 flex items-center gap-2"><Link2 size={16} /> Réseaux liés</h2>
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                  <input type="url" value={linkYoutube} onChange={(e) => setLinkYoutube(e.target.value)} className="bg-z-card border border-z-border rounded-lg p-3 text-sm" placeholder="YouTube" />
                  <input type="url" value={linkInstagram} onChange={(e) => setLinkInstagram(e.target.value)} className="bg-z-card border border-z-border rounded-lg p-3 text-sm" placeholder="Instagram" />
                  <input type="url" value={linkTiktok} onChange={(e) => setLinkTiktok(e.target.value)} className="bg-z-card border border-z-border rounded-lg p-3 text-sm" placeholder="TikTok" />
                  <input type="url" value={linkTwitch} onChange={(e) => setLinkTwitch(e.target.value)} className="bg-z-card border border-z-border rounded-lg p-3 text-sm" placeholder="Twitch" />
                  <input type="url" value={linkFacebook} onChange={(e) => setLinkFacebook(e.target.value)} className="bg-z-card border border-z-border rounded-lg p-3 text-sm xl:col-span-2" placeholder="Facebook" />
                </div>
              </section>
            </form>
          </div>

          {/* VUE APERÇU LIVE */}
          <div className={`w-full bg-[#040407] min-h-full ${leftPanelMode === 'preview' ? 'block' : 'hidden'}`}>
            <div className="p-8 sm:p-12 space-y-12">
              <div className="border-b border-z-border pb-8">
                <h1 className="font-display font-bold text-4xl sm:text-6xl uppercase tracking-tighter leading-none mb-4">{titre || "Titre du projet"}</h1>
                {activeCategory && (
                  <div className={`inline-block px-3 py-1 rounded border transition-colors duration-300 ${badgeTheme.border} ${badgeTheme.bg} ${badgeTheme.text} text-[9px] font-bold uppercase tracking-widest`}>
                    {activeCategory.name}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 gap-12">
                {description && (
                  <div>
                    <h3 className="text-z-muted font-sub text-[10px] font-bold uppercase tracking-widest mb-4">Introduction</h3>
                    <div className="font-body text-z-text/80 leading-relaxed whitespace-pre-wrap rich-text" dangerouslySetInnerHTML={{ __html: description }} />
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* COLONNE 2 : GRISEE (Disponible après création) */}
      <div className="flex-[0.8] flex flex-col min-w-0 bg-z-card/40 border border-z-border rounded-xl shadow-xl overflow-hidden relative z-10 opacity-60 pointer-events-none">
        <header className="shrink-0 p-6 border-b border-z-border flex items-center justify-between bg-z-card/50">
          <h2 className="font-sub text-xs uppercase tracking-[0.2em] text-white flex items-center gap-2">Détails du projet</h2>
        </header>
        <div className="flex-1 flex items-center justify-center p-6 text-center">
          <p className="font-body text-sm text-z-muted italic">Veuillez d'abord créer le projet (sauvegarder) pour pouvoir lui ajouter des séquences médias, vidéos ou liens Drive.</p>
        </div>
      </div>
    </div>
  );
}
