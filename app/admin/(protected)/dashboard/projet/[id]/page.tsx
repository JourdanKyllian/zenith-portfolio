"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { 
  ArrowLeft, Save, Image as ImageIcon, Link2, FileText, ToggleLeft, ToggleRight, 
  Plus, Trash2, Video, HardDrive, ListOrdered
} from 'lucide-react';
import Link from 'next/link';
import { Categorie, Projet, SousProjet } from '@/types';

export default function EditProjetPage() {
  const router = useRouter();
  const params = useParams();
  const projetId = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  // --- ÉTATS DU PROJET ---
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

  // --- ÉTATS DES DONNÉES ANNEXES ---
  const [categories, setCategories] = useState<Categorie[]>([]);
  const [sousProjets, setSousProjets] = useState<SousProjet[]>([]);

  // --- ÉTATS DU NOUVEAU SOUS-PROJET ---
  const [showSpForm, setShowSpForm] = useState(false);
  const [spTitre, setSpTitre] = useState('');
  const [spDescription, setSpDescription] = useState('');
  const [spYoutube, setSpYoutube] = useState('');
  const [spDrive, setSpDrive] = useState('');
  const [spOrdre, setSpOrdre] = useState(1);
  const [spError, setSpError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, [projetId]);

  const fetchData = async () => {
    setIsLoading(true);
    
    // 1. Récupérer les catégories
    const { data: catData } = await supabase
      .from('categorie')
      .select('*')
      .eq('user_id', process.env.NEXT_PUBLIC_PORTFOLIO_USER_ID)
      .order('name');
    if (catData) setCategories(catData as Categorie[]);

    // 2. Récupérer le projet ET ses sous-projets
    const { data: projetData, error } = await supabase
      .from('projet')
      .select('*, sousprojet(*)')
      .eq('id', projetId)
      .eq('user_id', process.env.NEXT_PUBLIC_PORTFOLIO_USER_ID)
      .single();

    if (error || !projetData) {
      router.push('/admin/dashboard');
      return;
    }

    const p = projetData as Projet;
    setTitre(p.titre || '');
    setSlug(p.slug || '');
    setCategorieId(p.categorie_id ? p.categorie_id.toString() : '');
    setDescription(p.description || '');
    setEnLigne(p.en_ligne || false);
    setMiniatureUrl(p.miniature_url || '');
    setLinkInstagram(p.link_instagram || '');
    setLinkYoutube(p.link_youtube || '');
    setLinkTiktok(p.link_tiktok || '');
    setLinkTwitch(p.link_twitch || '');
    setLinkFacebook(p.link_facebook || '');
    
    // Trier les sous-projets par ordre
    const sp = p.sousprojet ? p.sousprojet.sort((a, b) => a.ordre - b.ordre) : [];
    setSousProjets(sp);
    setSpOrdre(sp.length + 1); // Prépare l'ordre du prochain

    setIsLoading(false);
  };

  // --- MISE À JOUR DU PROJET ---
  const handleUpdateProjet = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    // 1. Vérification anti-doublon (on exclut le projet en cours d'édition)
    const safeTitre = titre.replace(/"/g, '""');
    const { data: existingData } = await supabase
      .from('projet')
      .select('id')
      .eq('user_id', process.env.NEXT_PUBLIC_PORTFOLIO_USER_ID)
      .neq('id', projetId) // On ne teste pas contre lui-même
      .or(`titre.eq."${safeTitre}",slug.eq."${slug}"`);

    if (existingData && existingData.length > 0) {
      setMessage({ text: "Impossible d'enregistrer : un autre projet avec ce titre ou ce slug existe déjà.", type: 'error' });
      setIsSubmitting(false);
      return; // On coupe la requête
    }

    const updatedProjet = {
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
    };

    const { error } = await supabase
      .from('projet')
      .update(updatedProjet)
      .eq('id', projetId)
      .eq('user_id', process.env.NEXT_PUBLIC_PORTFOLIO_USER_ID);

    if (error) {
      setMessage({ text: "Erreur lors de la sauvegarde : " + error.message, type: 'error' });
    } else {
      setMessage({ text: "Projet mis à jour avec succès !", type: 'success' });
      setTimeout(() => setMessage(null), 3000);
    }
    setIsSubmitting(false);
  };

  // --- GESTION DES SOUS-PROJETS ---
  const handleCreateSousProjet = async () => {
    if (!spTitre) return;
    setSpError(null);
    
    const newSp = {
      titre: spTitre,
      description: spDescription || null,
      youtube_url: spYoutube || null,
      drive_url: spDrive || null,
      ordre: spOrdre,
      projet_id: parseInt(projetId)
    };

    const { data, error } = await supabase
      .from('sousprojet')
      .insert([newSp])
      .select()
      .single();

    if (!error && data) {
      setSousProjets([...sousProjets, data as SousProjet]);
      // Reset form
      setSpTitre('');
      setSpDescription('');
      setSpYoutube('');
      setSpDrive('');
      setSpOrdre(spOrdre + 1);
      setShowSpForm(false);
    } else {
      console.error("Erreur insertion sous-projet:", error);
      setSpError(error?.message || "Erreur inconnue lors de l'insertion");
    }
  };

  const handleDeleteSousProjet = async (id: number) => {
    if (!confirm('Voulez-vous vraiment supprimer ce sous-projet ?')) return;
    
    const { error } = await supabase
      .from('sousprojet')
      .delete()
      .eq('id', id);

    if (!error) {
      setSousProjets(sousProjets.filter(sp => sp.id !== id));
    }
  };

  if (isLoading) {
    return <div className="min-h-screen bg-z-bg flex items-center justify-center text-z-blue">Chargement de l'éditeur...</div>;
  }

  return (
    <div className="min-h-screen bg-z-bg text-z-text p-6 md:p-10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* --- COLONNE GAUCHE : ÉDITION DU PROJET (2/3 de l'écran) --- */}
        <div className="xl:col-span-2 space-y-6">
          <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <Link href="/admin/dashboard" className="w-10 h-10 rounded-lg bg-z-card border border-z-border flex items-center justify-center text-z-muted hover:text-white hover:border-z-blue transition-all">
                <ArrowLeft size={18} />
              </Link>
              <div>
                <h1 className="font-display font-bold text-3xl uppercase tracking-wider text-white truncate max-w-sm">
                  {titre}
                </h1>
                <p className="font-body text-sm text-z-muted mt-1">Édition du projet</p>
              </div>
            </div>
            <button 
              type="button"
              onClick={handleUpdateProjet}
              disabled={isSubmitting}
              className="btn-blue px-6 py-3 rounded-lg flex items-center justify-center gap-2 text-xs font-bold tracking-widest shadow-lg hover:scale-105 transition-all disabled:opacity-50"
            >
              <Save size={16} /> {isSubmitting ? 'Sauvegarde...' : 'Enregistrer'}
            </button>
          </header>

          {message && (
            <div className={`p-4 rounded-lg text-sm font-bold ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleUpdateProjet} className="space-y-6">
            <section className="bg-z-card border border-z-border rounded-xl p-6 shadow-xl">
              <h2 className="font-sub text-xs uppercase tracking-[0.2em] text-z-blue mb-6 flex items-center gap-2">
                <FileText size={16} /> Informations
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-z-muted ml-1">Titre</label>
                  <input required type="text" value={titre} onChange={(e) => {setTitre(e.target.value); setMessage(null);}} className="w-full bg-z-bg border border-z-border rounded-lg p-3 text-sm focus:border-z-blue focus:outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-z-muted ml-1">Slug (URL)</label>
                  <input required type="text" value={slug} onChange={(e) => {setSlug(e.target.value); setMessage(null);}} className="w-full bg-z-bg border border-z-border rounded-lg p-3 text-sm text-z-muted focus:border-z-blue focus:outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-z-muted ml-1">Catégorie</label>
                  <select value={categorieId} onChange={(e) => setCategorieId(e.target.value)} className="w-full bg-z-bg border border-z-border rounded-lg p-3 text-sm text-white focus:border-z-blue focus:outline-none appearance-none">
                    <option value="">-- Sans catégorie --</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="space-y-2 flex flex-col justify-center">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-z-muted ml-1 mb-2">Visibilité</label>
                  <button type="button" onClick={() => setEnLigne(!enLigne)} className={`flex items-center gap-3 w-fit px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-widest transition-colors ${enLigne ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-z-bg border border-z-border text-z-muted'}`}>
                    {enLigne ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                    {enLigne ? 'Public' : 'Brouillon'}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold tracking-widest text-z-muted ml-1">Description courte</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full bg-z-bg border border-z-border rounded-lg p-3 text-sm focus:border-z-blue focus:outline-none resize-none" />
              </div>
            </section>

            <section className="bg-z-card border border-z-border rounded-xl p-6 shadow-xl">
              <h2 className="font-sub text-xs uppercase tracking-[0.2em] text-z-blue mb-6 flex items-center gap-2">
                <ImageIcon size={16} /> Média Principal
              </h2>
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold tracking-widest text-z-muted ml-1">URL de la miniature</label>
                <input type="url" value={miniatureUrl} onChange={(e) => setMiniatureUrl(e.target.value)} className="w-full bg-z-bg border border-z-border rounded-lg p-3 text-sm focus:border-z-blue focus:outline-none" />
              </div>
            </section>

            <section className="bg-z-card border border-z-border rounded-xl p-6 shadow-xl">
              <h2 className="font-sub text-xs uppercase tracking-[0.2em] text-z-blue mb-6 flex items-center gap-2">
                <Link2 size={16} /> Réseaux liés
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="url" value={linkYoutube} onChange={(e) => setLinkYoutube(e.target.value)} className="bg-z-bg border border-z-border rounded-lg p-3 text-sm" placeholder="YouTube" />
                <input type="url" value={linkInstagram} onChange={(e) => setLinkInstagram(e.target.value)} className="bg-z-bg border border-z-border rounded-lg p-3 text-sm" placeholder="Instagram" />
                <input type="url" value={linkTiktok} onChange={(e) => setLinkTiktok(e.target.value)} className="bg-z-bg border border-z-border rounded-lg p-3 text-sm" placeholder="TikTok" />
                <input type="url" value={linkTwitch} onChange={(e) => setLinkTwitch(e.target.value)} className="bg-z-bg border border-z-border rounded-lg p-3 text-sm" placeholder="Twitch" />
                <input type="url" value={linkFacebook} onChange={(e) => setLinkFacebook(e.target.value)} className="bg-z-bg border border-z-border rounded-lg p-3 text-sm md:col-span-2" placeholder="Facebook" />
              </div>
            </section>
          </form>
        </div>

        {/* --- COLONNE DROITE : GESTION DES SOUS-PROJETS (1/3 de l'écran) --- */}
        <div className="xl:col-span-1 space-y-6">
          <div className="bg-z-card border border-z-border rounded-xl p-6 shadow-xl sticky top-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-sub text-xs uppercase tracking-[0.2em] text-white flex items-center gap-2">
                <Video size={16} className="text-z-blue" /> Détails (Sous-projets)
              </h2>
              <span className="px-2 py-1 bg-z-blue/10 text-z-blue rounded-full text-[10px] font-bold">
                {sousProjets.length}
              </span>
            </div>

            {/* LISTE DES SOUS-PROJETS */}
            <div className="space-y-3 mb-6 max-h-100 overflow-y-auto pr-2">
              {sousProjets.length === 0 ? (
                <p className="text-sm text-z-muted italic text-center py-4">Aucun sous-projet lié.</p>
              ) : (
                sousProjets.map(sp => (
                  <div key={sp.id} className="bg-z-bg border border-z-border rounded-lg p-4 group">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-sm font-bold text-white mb-1">{sp.titre}</h4>
                        <div className="flex items-center gap-3 text-z-muted">
                            <span className="flex items-center gap-1 text-[10px] font-bold uppercase">
                                <ListOrdered size={12}/> {sp.ordre}
                            </span>
                            {sp.youtube_url && (
                                <span title="A une vidéo YouTube" className="flex items-center">
                                <Video size={12} />
                                </span>
                            )}
                            {sp.drive_url && (
                                <span title="A un lien Drive" className="flex items-center">
                                <HardDrive size={12} />
                                </span>
                            )}
                        </div>
                      </div>
                      <button type="button" onClick={() => handleDeleteSousProjet(sp.id)} className="text-z-muted hover:text-red-400 p-1 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* BOUTON / FORMULAIRE D'AJOUT */}
            {!showSpForm ? (
              <button 
                type="button"
                onClick={() => setShowSpForm(true)}
                className="w-full py-3 border border-dashed border-z-blue/50 text-z-blue rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-z-blue/5 transition-colors flex items-center justify-center gap-2"
              >
                <Plus size={16} /> Ajouter un détail
              </button>
            ) : (
              <div className="bg-z-bg border border-z-blue/30 rounded-lg p-4 space-y-4">
                <h4 className="text-xs font-bold text-white uppercase tracking-widest">Nouveau Sous-Projet</h4>
                
                {spError && (
                  <div className="p-2 bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-bold rounded">
                    {spError}
                  </div>
                )}

                <div className="space-y-2">
                  <input type="text" placeholder="Titre (ex: Teaser, Making-of)*" value={spTitre} onChange={e => setSpTitre(e.target.value)} className="w-full bg-z-card border border-z-border rounded p-2 text-xs" />
                </div>
                <div className="space-y-2">
                  <textarea placeholder="Description optionnelle..." value={spDescription} onChange={e => setSpDescription(e.target.value)} className="w-full bg-z-card border border-z-border rounded p-2 text-xs resize-none" rows={2} />
                </div>
                <div className="space-y-2">
                  <input type="url" placeholder="URL iframe YouTube (optionnel)" value={spYoutube} onChange={e => setSpYoutube(e.target.value)} className="w-full bg-z-card border border-z-border rounded p-2 text-xs" />
                </div>
                <div className="space-y-2">
                  <input type="url" placeholder="URL Google Drive PDF (optionnel)" value={spDrive} onChange={e => setSpDrive(e.target.value)} className="w-full bg-z-card border border-z-border rounded p-2 text-xs" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase text-z-muted">Ordre d'affichage</label>
                  <input type="number" min="1" value={spOrdre} onChange={e => setSpOrdre(parseInt(e.target.value))} className="w-full bg-z-card border border-z-border rounded p-2 text-xs" />
                </div>
                <div className="flex gap-2 pt-2">
                  <button type="button" onClick={handleCreateSousProjet} disabled={!spTitre} className="flex-1 btn-blue py-2 rounded text-xs font-bold disabled:opacity-50">Ajouter</button>
                  <button type="button" onClick={() => setShowSpForm(false)} className="flex-1 bg-z-card border border-z-border text-white py-2 rounded text-xs font-bold hover:bg-white/5">Annuler</button>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
