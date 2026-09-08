"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { 
  ArrowLeft, Save, Image as ImageIcon, Link2, FileText, ToggleLeft, ToggleRight, 
  Plus, Trash2, Video, HardDrive, ListOrdered, Edit3
} from 'lucide-react';
import Link from 'next/link';
import { Categorie, Projet, SousProjet } from '@/types';
import ConfirmModal from '@/components/ui/ConfirmModal';
import Alert from '@/components/ui/Alert';

export default function EditProjetPage() {
  const router = useRouter();
  const params = useParams();
  const projetId = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

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

  const [categories, setCategories] = useState<Categorie[]>([]);
  const [sousProjets, setSousProjets] = useState<SousProjet[]>([]);

  const [showSpForm, setShowSpForm] = useState(false);
  const [editingSpId, setEditingSpId] = useState<number | null>(null); 
  const [spTitre, setSpTitre] = useState('');
  const [spDescription, setSpDescription] = useState('');
  const [spYoutube, setSpYoutube] = useState('');
  const [spDrive, setSpDrive] = useState('');
  const [spOrdre, setSpOrdre] = useState(1);
  const [spError, setSpError] = useState<string | null>(null);

  const [deleteSpTarget, setDeleteSpTarget] = useState<{ id: number, titre: string } | null>(null);

  useEffect(() => {
    fetchData();
  }, [projetId]);

  const fetchData = async () => {
    setIsLoading(true);
    
    const { data: catData } = await supabase
      .from('categorie')
      .select('*')
      .eq('user_id', process.env.NEXT_PUBLIC_PORTFOLIO_USER_ID)
      .order('name');
    if (catData) setCategories(catData as Categorie[]);

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
    
    const sp = p.sousprojet ? p.sousprojet.sort((a, b) => a.ordre - b.ordre) : [];
    setSousProjets(sp);
    setSpOrdre(sp.length + 1); 

    setIsLoading(false);
  };

  const handleUpdateProjet = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    const safeTitre = titre.replace(/"/g, '""');
    const { data: existingData } = await supabase
      .from('projet')
      .select('id')
      .eq('user_id', process.env.NEXT_PUBLIC_PORTFOLIO_USER_ID)
      .neq('id', projetId) 
      .or(`titre.eq."${safeTitre}",slug.eq."${slug}"`);

    if (existingData && existingData.length > 0) {
      setMessage({ text: "Impossible d'enregistrer : un autre projet avec ce titre ou ce slug existe déjà.", type: 'error' });
      setIsSubmitting(false);
      return; 
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
  
  const resetSpForm = () => {
    setSpTitre('');
    setSpDescription('');
    setSpYoutube('');
    setSpDrive('');
    setSpOrdre(sousProjets.length + 1);
    setEditingSpId(null);
    setShowSpForm(false);
    setSpError(null);
  };

  const handleEditClick = (sp: SousProjet) => {
    setSpTitre(sp.titre);
    setSpDescription(sp.description || '');
    setSpYoutube(sp.youtube_url || '');
    setSpDrive(sp.drive_url || '');
    setSpOrdre(sp.ordre);
    setEditingSpId(sp.id); 
    setShowSpForm(true); 
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
  };

  const handleSaveSousProjet = async () => {
    if (!spTitre) return;
    setSpError(null);
    
    const spData = {
      titre: spTitre,
      description: spDescription || null,
      youtube_url: spYoutube || null,
      drive_url: spDrive || null,
      ordre: spOrdre,
      projet_id: parseInt(projetId)
    };

    if (editingSpId) {
      const { error } = await supabase
        .from('sousprojet')
        .update(spData)
        .eq('id', editingSpId);

      if (!error) {
        setSousProjets(sousProjets.map(sp => 
          sp.id === editingSpId ? { ...sp, ...spData, id: editingSpId } : sp
        ).sort((a, b) => a.ordre - b.ordre));
        resetSpForm();
      } else {
        setSpError(error.message);
      }
    } else {
      const { data, error } = await supabase
        .from('sousprojet')
        .insert([spData])
        .select()
        .single();

      if (!error && data) {
        setSousProjets([...sousProjets, data as SousProjet].sort((a, b) => a.ordre - b.ordre));
        resetSpForm();
      } else {
        setSpError(error?.message || "Erreur d'insertion");
      }
    }
  };

  const requestDeleteSp = (id: number, titre: string) => {
    const skipUntil = localStorage.getItem('skipDeleteConfirmUntil');
    if (skipUntil && parseInt(skipUntil) > Date.now()) {
      executeDeleteSp(id);
    } else {
      setDeleteSpTarget({ id, titre });
    }
  };

  const executeDeleteSp = async (id: number) => {
    setDeleteSpTarget(null);
    const { error } = await supabase
      .from('sousprojet')
      .delete()
      .eq('id', id);

    if (!error) {
      setSousProjets(sousProjets.filter(sp => sp.id !== id));
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center text-z-blue h-full min-h-[50vh]">Chargement de l'éditeur...</div>;
  }

  return (
    <>
      <div className="max-w-6xl mx-auto grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* --- COLONNE GAUCHE : ÉDITION DU PROJET --- */}
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
            <div className="mb-6">
              <Alert type={message.type}>{message.text}</Alert>
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
              
              {/* --- MODIFICATION UX DRIVE ICI --- */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-z-muted ml-1">URL de la miniature</label>
                  <span className="text-[9px] text-z-blue/70 italic px-2 py-0.5 bg-z-blue/5 rounded border border-z-blue/10">Drive direct</span>
                </div>
                <input 
                  type="url" 
                  value={miniatureUrl} 
                  onChange={(e) => setMiniatureUrl(e.target.value)} 
                  className="w-full bg-z-bg border border-z-border rounded-lg p-3 text-sm focus:border-z-blue focus:outline-none placeholder:text-z-muted/30" 
                  placeholder="https://drive.google.com/uc?id=1A2b3C4d..." 
                />
                <p className="text-[9px] text-z-muted ml-1 leading-relaxed">
                  Pour que l'image s'affiche, le lien doit utiliser <code className="text-emerald-400 bg-emerald-400/10 px-1 rounded mx-0.5">/uc?id=</code> au lieu de <code className="text-red-400 bg-red-400/10 px-1 rounded mx-0.5">/view</code>.
                </p>
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

        {/* --- COLONNE DROITE : GESTION DES SOUS-PROJETS --- */}
        <div className="xl:col-span-1 space-y-6">
          <div className="bg-z-card border border-z-border rounded-xl p-6 shadow-xl sticky top-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-sub text-xs uppercase tracking-[0.2em] text-white flex items-center gap-2">
                <Video size={16} className="text-z-blue" /> Détails
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
                  <div key={sp.id} className={`bg-z-bg border rounded-lg p-4 group transition-colors ${editingSpId === sp.id ? 'border-z-blue' : 'border-z-border'}`}>
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
                      <div className="flex items-center gap-1">
                        <button type="button" onClick={() => handleEditClick(sp)} className="text-z-muted hover:text-white p-1 transition-colors">
                          <Edit3 size={14} />
                        </button>
                        <button 
                          type="button" 
                          onClick={() => requestDeleteSp(sp.id, sp.titre)}
                          className="text-z-muted hover:text-red-400 p-1 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* BOUTON / FORMULAIRE D'AJOUT OU MODIFICATION */}
            {!showSpForm ? (
              <button 
                type="button"
                onClick={() => { resetSpForm(); setShowSpForm(true); }}
                className="w-full py-3 border border-dashed border-z-blue/50 text-z-blue rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-z-blue/5 transition-colors flex items-center justify-center gap-2"
              >
                <Plus size={16} /> Ajouter un détail
              </button>
            ) : (
              <div className="bg-z-bg border border-z-blue/30 rounded-lg p-4 space-y-4">
                <h4 className="text-xs font-bold text-white uppercase tracking-widest">
                  {editingSpId ? 'Modifier Sous-Projet' : 'Nouveau Sous-Projet'}
                </h4>
                
                {spError && (
                  <div className="mb-2">
                    <Alert type="error">{spError}</Alert>
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
                
                {/* --- MODIFICATION UX DRIVE SOUS-PROJET ICI --- */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-z-muted ml-1">Fichier Drive (Optionnel)</label>
                    <span className="text-[9px] text-z-blue/70 italic px-2 py-0.5 bg-z-blue/5 rounded border border-z-blue/10">Drive direct</span>
                  </div>
                  <input 
                    type="url" 
                    placeholder="https://drive.google.com/uc?id=..." 
                    value={spDrive} 
                    onChange={e => setSpDrive(e.target.value)} 
                    className="w-full bg-z-card border border-z-border rounded p-2 text-xs placeholder:text-z-muted/30 focus:border-z-blue focus:outline-none" 
                  />
                  <p className="text-[9px] text-z-muted ml-1 leading-relaxed">
                    Utilisez <code className="text-emerald-400 bg-emerald-400/10 px-1 rounded mx-0.5">/uc?id=</code> au lieu de <code className="text-red-400 bg-red-400/10 px-1 rounded mx-0.5">/view</code>.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-z-muted ml-1">Ordre d'affichage</label>
                  <input type="number" min="1" value={spOrdre} onChange={e => setSpOrdre(parseInt(e.target.value))} className="w-full bg-z-card border border-z-border rounded p-2 text-xs focus:border-z-blue focus:outline-none" />
                </div>
                <div className="flex gap-2 pt-2">
                  <button type="button" onClick={handleSaveSousProjet} disabled={!spTitre} className="flex-1 btn-blue py-2 rounded text-xs font-bold tracking-widest disabled:opacity-50">
                    {editingSpId ? 'Mettre à jour' : 'Ajouter'}
                  </button>
                  <button type="button" onClick={resetSpForm} className="flex-1 bg-z-card border border-z-border text-white py-2 rounded text-xs font-bold hover:bg-white/5">
                    Annuler
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <ConfirmModal 
        isOpen={deleteSpTarget !== null}
        title={deleteSpTarget?.titre || ''}
        onConfirm={() => deleteSpTarget && executeDeleteSp(deleteSpTarget.id)}
        onCancel={() => setDeleteSpTarget(null)}
      />
    </>
  );
}
