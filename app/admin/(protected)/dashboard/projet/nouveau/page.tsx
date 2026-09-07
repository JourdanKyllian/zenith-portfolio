"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, Save, Image as ImageIcon, Link2, FileText, ToggleLeft, ToggleRight } from 'lucide-react';
import Link from 'next/link';
import { Categorie } from '@/types';

export default function NouveauProjetPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Categorie[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // États du formulaire
  const [titre, setTitre] = useState('');
  const [slug, setSlug] = useState('');
  const [categorieId, setCategorieId] = useState<string>('');
  const [description, setDescription] = useState('');
  const [enLigne, setEnLigne] = useState(false);
  const [miniatureUrl, setMiniatureUrl] = useState('');
  
  // Liens Réseaux
  const [linkInstagram, setLinkInstagram] = useState('');
  const [linkYoutube, setLinkYoutube] = useState('');
  const [linkTiktok, setLinkTiktok] = useState('');
  const [linkTwitch, setLinkTwitch] = useState('');
  const [linkFacebook, setLinkFacebook] = useState('');

  // Récupération des catégories pour le menu déroulant
  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase
        .from('categorie')
        .select('*')
        .eq('user_id', process.env.NEXT_PUBLIC_PORTFOLIO_USER_ID)
        .order('name');
      if (data) setCategories(data as Categorie[]);
    };
    fetchCategories();
  }, []);

  // Génération automatique du slug
  const handleTitreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitre(val);
    setSlug(
      val.toLowerCase()
         .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
         .replace(/[^a-z0-9\s-]/g, '')
         .trim()
         .replace(/\s+/g, '-')
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    // Préparation de la donnée exacte calquée sur ton MCD
    const newProjet = {
      titre,
      slug,
      categorie_id: categorieId ? parseInt(categorieId) : null,
      description: description || null,
      en_ligne: enLigne,
      miniature_url: miniatureUrl || null,
      link_instagram: linkInstagram || null,
      link_youtube: linkYoutube || null,
      link_tiktok: linkTiktok || null,
      link_twitch: linkTwitch || null,
      link_facebook: linkFacebook || null,
      // Le fameux tampon d'architecture
      user_id: process.env.NEXT_PUBLIC_PORTFOLIO_USER_ID
    };

    const { data, error } = await supabase
      .from('projet')
      .insert([newProjet])
      .select('id') // On demande l'ID en retour pour rediriger vers la modification
      .single();

    if (error) {
      console.error(error);
      setErrorMessage(error.message);
      setIsSubmitting(false);
    } else if (data) {
      // Redirection vers la page d'édition de ce projet spécifique (où on gérera les sous-projets)
      router.push(`/admin/dashboard/projet/${data.id}`);
    }
  };

  return (
    <div className="min-h-screen bg-z-bg text-z-text p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        
        {/* HEADER DE LA PAGE */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard" className="w-10 h-10 rounded-lg bg-z-card border border-z-border flex items-center justify-center text-z-muted hover:text-white hover:border-z-blue transition-all">
              <ArrowLeft size={18} />
            </Link>
            <div>
              <h1 className="font-display font-bold text-3xl uppercase tracking-wider text-white">Nouveau Projet</h1>
              <p className="font-body text-sm text-z-muted mt-1">Créez la fiche principale du projet.</p>
            </div>
          </div>
          
          <button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="btn-blue px-6 py-3 rounded-lg flex items-center justify-center gap-2 text-xs font-bold tracking-widest shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100"
          >
            <Save size={16} />
            {isSubmitting ? 'Création...' : 'Créer et continuer'}
          </button>
        </header>

        {errorMessage && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* INFORMATIONS PRINCIPALES */}
          <section className="bg-z-card border border-z-border rounded-xl p-6 shadow-xl">
            <h2 className="font-sub text-xs uppercase tracking-[0.2em] text-z-blue mb-6 flex items-center gap-2">
              <FileText size={16} /> Informations
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold tracking-widest text-z-muted ml-1">Titre du projet *</label>
                <input required type="text" value={titre} onChange={handleTitreChange} className="w-full bg-z-bg border border-z-border rounded-lg p-3 text-sm focus:border-z-blue focus:outline-none" placeholder="Ex: Mariage Sloane & Alexia" />
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold tracking-widest text-z-muted ml-1">Slug (URL générée) *</label>
                <input required type="text" value={slug} onChange={(e) => setSlug(e.target.value)} className="w-full bg-z-bg border border-z-border rounded-lg p-3 text-sm text-z-muted focus:border-z-blue focus:outline-none" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold tracking-widest text-z-muted ml-1">Catégorie</label>
                <select 
                  value={categorieId} 
                  onChange={(e) => setCategorieId(e.target.value)}
                  className="w-full bg-z-bg border border-z-border rounded-lg p-3 text-sm text-white focus:border-z-blue focus:outline-none appearance-none"
                >
                  <option value="">-- Sans catégorie --</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2 flex flex-col justify-center">
                <label className="text-[10px] uppercase font-bold tracking-widest text-z-muted ml-1 mb-2">Visibilité</label>
                <button 
                  type="button" 
                  onClick={() => setEnLigne(!enLigne)}
                  className={`flex items-center gap-3 w-fit px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-widest transition-colors ${enLigne ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-z-bg border border-z-border text-z-muted'}`}
                >
                  {enLigne ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                  {enLigne ? 'Public (En ligne)' : 'Brouillon (Masqué)'}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold tracking-widest text-z-muted ml-1">Description courte (Affichée sur la carte)</label>
              <textarea 
                value={description} onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full bg-z-bg border border-z-border rounded-lg p-3 text-sm focus:border-z-blue focus:outline-none resize-none" 
                placeholder="Résumé du projet..." 
              />
            </div>
          </section>

          {/* MÉDIAS & MINIATURE */}
          <section className="bg-z-card border border-z-border rounded-xl p-6 shadow-xl">
            <h2 className="font-sub text-xs uppercase tracking-[0.2em] text-z-blue mb-6 flex items-center gap-2">
              <ImageIcon size={16} /> Visuel
            </h2>
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold tracking-widest text-z-muted ml-1">URL de la miniature (Image de couverture)</label>
              <input type="url" value={miniatureUrl} onChange={(e) => setMiniatureUrl(e.target.value)} className="w-full bg-z-bg border border-z-border rounded-lg p-3 text-sm focus:border-z-blue focus:outline-none" placeholder="https://..." />
            </div>
          </section>

          {/* RÉSEAUX SOCIAUX */}
          <section className="bg-z-card border border-z-border rounded-xl p-6 shadow-xl">
            <h2 className="font-sub text-xs uppercase tracking-[0.2em] text-z-blue mb-6 flex items-center gap-2">
              <Link2 size={16} /> Réseaux liés au projet
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="url" value={linkYoutube} onChange={(e) => setLinkYoutube(e.target.value)} className="bg-z-bg border border-z-border rounded-lg p-3 text-sm" placeholder="Lien YouTube" />
              <input type="url" value={linkInstagram} onChange={(e) => setLinkInstagram(e.target.value)} className="bg-z-bg border border-z-border rounded-lg p-3 text-sm" placeholder="Lien Instagram" />
              <input type="url" value={linkTiktok} onChange={(e) => setLinkTiktok(e.target.value)} className="bg-z-bg border border-z-border rounded-lg p-3 text-sm" placeholder="Lien TikTok" />
              <input type="url" value={linkTwitch} onChange={(e) => setLinkTwitch(e.target.value)} className="bg-z-bg border border-z-border rounded-lg p-3 text-sm" placeholder="Lien Twitch" />
              <input type="url" value={linkFacebook} onChange={(e) => setLinkFacebook(e.target.value)} className="bg-z-bg border border-z-border rounded-lg p-3 text-sm md:col-span-2" placeholder="Lien Facebook" />
            </div>
          </section>

        </form>
      </div>
    </div>
  );
}
