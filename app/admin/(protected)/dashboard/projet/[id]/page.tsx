"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { 
  ArrowLeft, Save, Image as ImageIcon, Link2, FileText, ToggleLeft, ToggleRight, 
  Plus, Trash2, Video, HardDrive, ListOrdered, Edit3, GripVertical, CheckCircle2, Eye, PenTool
} from 'lucide-react';
import Link from 'next/link';
import { Categorie, Projet, SousProjet } from '@/types';
import ConfirmModal from '@/components/ui/ConfirmModal';
import Alert from '@/components/ui/Alert';
import { purgeCache } from '@/app/actions/revalidate';
import RichTextEditor from '@/components/ui/RichTextEditor';
import ProjectMediaContent from '@/components/ProjectMediaContent';
import { getBadgeTheme } from '@/config/colors';

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

  const [categories, setCategories] = useState<Categorie[]>([]);
  
  // --- ÉTATS RÉACTIFS (LIVE-EDIT) ---
  const [sousProjets, setSousProjets] = useState<SousProjet[]>([]);
  const [deletedSpIds, setDeletedSpIds] = useState<number[]>([]);
  const [editingSpId, setEditingSpId] = useState<number | null>(null); 
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSavingDetails, setIsSavingDetails] = useState(false);
  const [deleteSpTarget, setDeleteSpTarget] = useState<{ id: number, titre: string } | null>(null);

  // --- ÉTATS UI ---
  const [draggedId, setDraggedId] = useState<number | null>(null);
  const [dragOverId, setDragOverId] = useState<number | null>(null);
  const [leftPanelMode, setLeftPanelMode] = useState<'edit' | 'preview'>('edit'); // L'onglet actif à gauche

  const fetchData = useCallback(async () => {
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
    setIsLoading(false);
  }, [projetId, router]);

  useEffect(() => { 
    fetchData(); 
  }, [fetchData]);

  const handleUpdateProjet = async (e?: React.FormEvent) => {
    if(e) e.preventDefault();
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
      setMessage({ text: "Impossible d'enregistrer : un projet avec ce titre/slug existe déjà.", type: 'error' });
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
      await purgeCache();
      setMessage({ text: "Projet mis à jour avec succès !", type: 'success' });
      setTimeout(() => setMessage(null), 3000);
    }
    setIsSubmitting(false);
  };
  
  // --- MÉCANIQUE LIVE-EDIT DES DÉTAILS ---
  const handleAddSp = () => {
    const newId = -Date.now(); 
    const newSp: SousProjet = { 
      id: newId, 
      projet_id: parseInt(projetId), 
      titre: '', 
      description: '', 
      youtube_url: '', 
      drive_url: '', 
      ordre: sousProjets.length + 1, 
      created_at: new Date().toISOString() 
    };
    setSousProjets([...sousProjets, newSp]); 
    setEditingSpId(newId); 
    setHasUnsavedChanges(true);
  };

  const executeDeleteSp = (id: number) => {
    if (id > 0) setDeletedSpIds(prev => [...prev, id]); 
    const filtered = sousProjets.filter(sp => sp.id !== id);
    const reordered = filtered.map((sp, idx) => ({ ...sp, ordre: idx + 1 }));
    setSousProjets(reordered);
    
    if (editingSpId === id) setEditingSpId(null);
    setHasUnsavedChanges(true); 
    setDeleteSpTarget(null);
  };

  const requestDeleteSp = (id: number, titre: string | null) => {
    const skipUntil = localStorage.getItem('skipDeleteConfirmUntil');
    if (skipUntil && parseInt(skipUntil) > new Date().getTime()) {
      executeDeleteSp(id);
    } else {
      setDeleteSpTarget({ id, titre: titre || `Séquence média` });
    }
  };

  const updateActiveSp = (field: keyof SousProjet, value: any) => {
    setSousProjets(prev => prev.map(sp => sp.id === editingSpId ? { ...sp, [field]: value } : sp));
    setHasUnsavedChanges(true);
  };

  const handleSaveDetails = async () => {
    setIsSavingDetails(true);
    try {
      if (deletedSpIds.length > 0) {
        await supabase.from('sousprojet').delete().in('id', deletedSpIds);
      }
      
      const toUpdate = sousProjets.filter(sp => sp.id > 0).map(({ created_at, ...rest }) => rest);
      if (toUpdate.length > 0) {
        await supabase.from('sousprojet').upsert(toUpdate);
      }
      
      const toInsert = sousProjets.filter(sp => sp.id < 0).map(({ id, created_at, ...rest }) => rest);
      if (toInsert.length > 0) {
        await supabase.from('sousprojet').insert(toInsert);
      }
      
      await purgeCache();
      setDeletedSpIds([]); 
      setHasUnsavedChanges(false); 
      setEditingSpId(null);
      await fetchData(); 
    } catch (err) { 
      console.error("Erreur :", err); 
    }
    setIsSavingDetails(false);
  };

  // --- LOGIQUE DRAG & DROP ---
  const handleDragStart = (e: React.DragEvent, id: number) => { 
    setDraggedId(id); 
    e.dataTransfer.effectAllowed = 'move'; 
  };
  
  const handleDragOver = (e: React.DragEvent, id: number) => { 
    e.preventDefault(); 
    if (dragOverId !== id) setDragOverId(id); 
  };

  const handleDrop = async (e: React.DragEvent, targetId: number) => {
    e.preventDefault(); 
    setDragOverId(null);
    
    if (!draggedId || draggedId === targetId) { 
      setDraggedId(null); 
      return; 
    }

    const draggedIndex = sousProjets.findIndex(sp => sp.id === draggedId);
    const targetIndex = sousProjets.findIndex(sp => sp.id === targetId);

    const newItems = [...sousProjets];
    const [draggedItem] = newItems.splice(draggedIndex, 1);
    newItems.splice(targetIndex, 0, draggedItem);

    const updatedItems = newItems.map((sp, index) => ({ ...sp, ordre: index + 1 }));
    setSousProjets(updatedItems); 
    setDraggedId(null); 
    setHasUnsavedChanges(true);
  };

  if (isLoading) return <div className="flex items-center justify-center text-z-blue h-full min-h-[50vh]">Chargement de l'éditeur...</div>;

  const activeSp = sousProjets.find(sp => sp.id === editingSpId);
  const activeCategory = categories.find(c => c.id.toString() === categorieId);
  const badgeTheme = getBadgeTheme(activeCategory?.color);

  // Construction des données simulées pour la preview live
  const previewSousProjets = sousProjets.map(sp => ({
    ...sp,
    finalYoutubeUrl: sp.youtube_url,
    driveImages: miniatureUrl && sp.ordre === 1 ? [miniatureUrl] : [], // On triche un peu en simulant une image
    pdf: null,
    driveVideoUrl: null
  }));

  return (
    <>
      <div className="w-full flex flex-col lg:flex-row gap-6 h-auto lg:h-[calc(100vh-4rem)]">
        
        {/* COLONNE 1 : PROJET PRINCIPAL (Avec Onglets Édition / Aperçu) */}
        <div className="flex-[1.2] flex flex-col min-w-0 bg-z-card/80 border border-z-border rounded-xl shadow-xl overflow-hidden relative z-10">
          
          <header className="shrink-0 p-4 border-b border-z-border flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-z-card/50 backdrop-blur-md">
            <div className="flex items-center gap-4">
              <Link href="/admin/dashboard" className="shrink-0 w-10 h-10 rounded-lg bg-z-bg border border-z-border flex items-center justify-center text-z-muted hover:text-white hover:border-z-blue transition-all">
                <ArrowLeft size={18} />
              </Link>
              <div className="min-w-0">
                <h1 className="font-display font-bold text-xl uppercase tracking-wider text-white truncate">{titre || "Nouveau Projet"}</h1>
              </div>
            </div>
            
            {/* LES ONGLETS DE SWITCH */}
            <div className="flex items-center justify-between xl:justify-end gap-4 w-full xl:w-auto">
              <div className="flex bg-z-bg p-1 rounded-lg border border-z-border shrink-0">
                <button 
                  onClick={() => setLeftPanelMode('edit')} 
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all ${leftPanelMode === 'edit' ? 'bg-z-card text-white shadow-sm' : 'text-z-muted hover:text-white'}`}
                >
                  <PenTool size={12} /> Édition
                </button>
                <button 
                  onClick={() => setLeftPanelMode('preview')} 
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all ${leftPanelMode === 'preview' ? 'bg-z-card text-z-blue shadow-sm' : 'text-z-muted hover:text-white'}`}
                >
                  <Eye size={12} /> Aperçu Live
                </button>
              </div>

              {leftPanelMode === 'edit' && (
                <button 
                  type="button" 
                  onClick={() => handleUpdateProjet()} 
                  disabled={isSubmitting} 
                  className="shrink-0 btn-blue px-4 py-2 rounded-lg flex items-center justify-center gap-2 text-[10px] font-bold tracking-widest shadow-lg hover:scale-105 transition-all disabled:opacity-50"
                >
                  <Save size={14} /> {isSubmitting ? '...' : 'Enregistrer'}
                </button>
              )}
            </div>
          </header>

          <div className="flex-1 overflow-y-auto custom-scrollbar relative">
            
            {/* VUE ÉDITION */}
            <div className={`p-6 space-y-6 ${leftPanelMode === 'edit' ? 'block' : 'hidden'}`}>
              {message && <Alert type={message.type}>{message.text}</Alert>}

              <form onSubmit={handleUpdateProjet} className="space-y-6">
                <section className="bg-z-bg border border-z-border rounded-xl p-6">
                  <h2 className="font-sub text-xs uppercase tracking-[0.2em] text-z-blue mb-6 flex items-center gap-2"><FileText size={16} /> Informations</h2>
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-bold tracking-widest text-z-muted ml-1">Titre</label>
                      <input required type="text" value={titre} onChange={(e) => {setTitre(e.target.value); setMessage(null);}} className="w-full bg-z-card border border-z-border rounded-lg p-3 text-sm focus:border-z-blue focus:outline-none" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-bold tracking-widest text-z-muted ml-1">Slug (URL)</label>
                      <input required type="text" value={slug} onChange={(e) => {setSlug(e.target.value); setMessage(null);}} className="w-full bg-z-card border border-z-border rounded-lg p-3 text-sm text-z-muted focus:border-z-blue focus:outline-none" />
                    </div>
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
                  <h2 className="font-sub text-xs uppercase tracking-[0.2em] text-z-blue mb-6 flex items-center gap-2"><ImageIcon size={16} /> Média Principal</h2>
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
                
                {/* Mini Hero Simulé */}
                <div className="border-b border-z-border pb-8">
                  <h1 className="font-display font-bold text-4xl sm:text-6xl uppercase tracking-tighter leading-none mb-4">{titre || "Titre du projet"}</h1>
                  {activeCategory && (
                    <div className={`inline-block px-3 py-1 rounded border transition-colors duration-300 ${badgeTheme.border} ${badgeTheme.bg} ${badgeTheme.text} text-[9px] font-bold uppercase tracking-widest`}>
                      {activeCategory.name}
                    </div>
                  )}
                </div>

                {/* Introduction & Médias Live */}
                <div className="grid grid-cols-1 gap-12">
                  {description && (
                    <div>
                      <h3 className="text-z-muted font-sub text-[10px] font-bold uppercase tracking-widest mb-4">Introduction</h3>
                      <div className="font-body text-z-text/80 leading-relaxed whitespace-pre-wrap rich-text" dangerouslySetInnerHTML={{ __html: description }} />
                    </div>
                  )}
                  
                  <div className="border border-dashed border-z-blue/30 rounded-xl p-4 bg-z-card/50">
                    <div className="text-[10px] text-z-blue font-bold uppercase tracking-widest mb-6">↓ Séquençage des détails ↓</div>
                    {/* On réutilise le composant de la vitrine pour un rendu 100% fidèle */}
                    <ProjectMediaContent sousProjets={previewSousProjets} coverImageUrl="" projectTitle={titre} />
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>

        {/* COLONNE 2 : LES DÉTAILS DU PROJET (Reste inchangée et toujours visible) */}
        <div className="flex-[0.8] flex flex-col min-w-0 bg-z-card/80 border border-z-border rounded-xl shadow-xl overflow-hidden relative z-10">
          <header className="shrink-0 p-6 border-b border-z-border flex items-center justify-between bg-z-card/50 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <h2 className="font-sub text-xs uppercase tracking-[0.2em] text-white flex items-center gap-2"><Video size={16} className="text-z-blue" /> Détails</h2>
              <span className="px-2 py-1 bg-z-blue/10 text-z-blue rounded-full text-[10px] font-bold">{sousProjets.length}</span>
            </div>

            {hasUnsavedChanges && (
              <button 
                onClick={handleSaveDetails} 
                disabled={isSavingDetails}
                className="flex items-center gap-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500 hover:text-white px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-colors animate-in fade-in zoom-in duration-200 cursor-pointer disabled:opacity-50 shadow-lg shadow-emerald-500/10"
              >
                {isSavingDetails ? <span className="animate-pulse">Sauvegarde...</span> : <><Save size={14} /> Sauver</>}
              </button>
            )}
          </header>

          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 custom-scrollbar">
            <div className="space-y-3">
              {sousProjets.length === 0 ? (
                <p className="text-sm text-z-muted italic text-center py-4">Aucun détail lié.</p>
              ) : (
                sousProjets.map(sp => (
                  <div 
                    key={sp.id} 
                    draggable
                    onDragStart={(e) => handleDragStart(e, sp.id)} 
                    onDragOver={(e) => handleDragOver(e, sp.id)} 
                    onDrop={(e) => handleDrop(e, sp.id)} 
                    onDragEnd={() => { setDraggedId(null); setDragOverId(null); }}
                    onClick={() => setEditingSpId(sp.id)}
                    className={`bg-z-bg border rounded-lg p-3 sm:p-4 group transition-all duration-200 cursor-pointer ${
                      editingSpId === sp.id ? 'border-z-blue bg-z-blue/5' : 'border-z-border hover:border-z-blue/50'
                    } ${draggedId === sp.id ? 'opacity-40 scale-95 border-dashed border-z-blue' : ''} ${
                      dragOverId === sp.id && draggedId !== sp.id ? 'border-z-blue bg-z-blue/10 translate-y-1' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start gap-3">
                      <div className="cursor-grab active:cursor-grabbing text-z-muted/30 hover:text-white pt-1 transition-colors">
                        <GripVertical size={16} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-white mb-1 truncate">{sp.titre || `Séquence Média`}</h4>
                        <div className="flex items-center gap-3 text-z-muted">
                            <span className="flex items-center gap-1 text-[10px] font-bold uppercase text-z-blue"><ListOrdered size={12}/> {sp.ordre}</span>
                            {sp.youtube_url && <span title="Vidéo YouTube"><Video size={12} /></span>}
                            {sp.drive_url && <span title="Lien Drive"><HardDrive size={12} /></span>}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button type="button" onClick={(e) => { e.stopPropagation(); requestDeleteSp(sp.id, sp.titre); }} className="text-z-muted hover:text-red-400 p-1 transition-colors cursor-pointer">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <button 
              type="button" onClick={handleAddSp}
              className="w-full py-3 border border-dashed border-z-blue/50 text-z-blue rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-z-blue/5 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus size={16} /> Ajouter un détail
            </button>

            {activeSp && (
              <div className="bg-z-bg border border-z-blue/30 rounded-lg p-4 sm:p-5 space-y-5 animate-in fade-in slide-in-from-top-4 mt-6">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold text-white uppercase tracking-widest">
                    {activeSp.id < 0 ? 'Nouveau Détail' : 'Édition en cours'}
                  </h4>
                  <span className="flex items-center gap-1 text-[9px] text-emerald-400 uppercase tracking-widest"><CheckCircle2 size={12}/> Actif</span>
                </div>
                
                <div className="space-y-2">
                  <input type="text" placeholder="Titre (ex: Teaser, Making-of)" value={activeSp.titre || ''} onChange={e => updateActiveSp('titre', e.target.value)} className="w-full bg-z-card border border-z-border rounded p-3 text-sm focus:border-z-blue focus:outline-none" />
                </div>
                <div className="space-y-2">
                  <RichTextEditor value={activeSp.description || ''} onChange={val => updateActiveSp('description', val)} placeholder="Description optionnelle..." minHeight="150px" />
                </div>
                <div className="space-y-2">
                  <input type="url" placeholder="URL iframe YouTube (optionnel)" value={activeSp.youtube_url || ''} onChange={e => updateActiveSp('youtube_url', e.target.value)} className="w-full bg-z-card border border-z-border rounded p-3 text-sm focus:border-z-blue focus:outline-none" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-z-muted ml-1">Fichier Drive</label>
                    <span className="text-[9px] text-z-blue/70 italic px-2 py-0.5 bg-z-blue/5 rounded border border-z-blue/10">Drive direct</span>
                  </div>
                  <input type="url" placeholder="https://drive.google.com/uc?id=..." value={activeSp.drive_url || ''} onChange={e => updateActiveSp('drive_url', e.target.value)} className="w-full bg-z-card border border-z-border rounded p-3 text-sm placeholder:text-z-muted/30 focus:border-z-blue focus:outline-none" />
                </div>

                <div className="pt-4 border-t border-z-border">
                  <button type="button" onClick={() => setEditingSpId(null)} className="w-full bg-z-card border border-z-border text-white py-3 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-white/5 cursor-pointer transition-colors">
                    Fermer l'éditeur de ce détail
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
