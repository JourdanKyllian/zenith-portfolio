"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, Save, Image as ImageIcon, Link2, FileText, ToggleLeft, ToggleRight, Eye, PenTool } from 'lucide-react';
import Link from 'next/link';
import { Categorie, Projet, SousProjet } from '@/types';
import ConfirmModal from '@/components/ui/ConfirmModal';
import Alert from '@/components/ui/Alert';
import { purgeCache } from '@/app/actions/revalidate';
import RichTextEditor from '@/components/ui/RichTextEditor';

// --- IMPORT DES NOUVEAUX COMPOSANTS FACTORISÉS ---
import ProjectPreview from '@/components/admin/ProjectPreview';
import ProjectDetailsSidebar from '@/components/admin/ProjectDetailsSidebar';

export default function EditProjetPage() {
  const router = useRouter();
  const params = useParams();
  const projetId = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  // --- ÉTATS DU PROJET PRINCIPAL ---
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
  
  // --- ÉTATS DES DÉTAILS (SOUS-PROJETS) ---
  const [sousProjets, setSousProjets] = useState<SousProjet[]>([]);
  const [deletedSpIds, setDeletedSpIds] = useState<number[]>([]);
  const [editingSpId, setEditingSpId] = useState<number | null>(null); 
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSavingDetails, setIsSavingDetails] = useState(false);
  const [deleteSpTarget, setDeleteSpTarget] = useState<{ id: number, titre: string } | null>(null);

  // --- ÉTATS UI (Drag & Drop / Split-Screen) ---
  const [draggedId, setDraggedId] = useState<number | null>(null);
  const [dragOverId, setDragOverId] = useState<number | null>(null);
  const [leftPanelMode, setLeftPanelMode] = useState<'edit' | 'preview'>('edit');

  const fetchData = useCallback(async () => {
    const { data: catData } = await supabase.from('categorie').select('*').eq('user_id', process.env.NEXT_PUBLIC_PORTFOLIO_USER_ID).order('name');
    if (catData) setCategories(catData as Categorie[]);

    const { data: projetData, error } = await supabase.from('projet').select('*, sousprojet(*)').eq('id', projetId).eq('user_id', process.env.NEXT_PUBLIC_PORTFOLIO_USER_ID).single();

    if (error || !projetData) {
      router.push('/admin/dashboard'); return;
    }

    const p = projetData as Projet;
    setTitre(p.titre || ''); setSlug(p.slug || ''); setCategorieId(p.categorie_id ? p.categorie_id.toString() : '');
    setDescription(p.description || ''); setEnLigne(p.en_ligne || false); setMiniatureUrl(p.miniature_url || '');
    setLinkInstagram(p.link_instagram || ''); setLinkYoutube(p.link_youtube || ''); setLinkTiktok(p.link_tiktok || '');
    setLinkTwitch(p.link_twitch || ''); setLinkFacebook(p.link_facebook || '');
    
    setSousProjets(p.sousprojet ? p.sousprojet.sort((a, b) => a.ordre - b.ordre) : []);
    setIsLoading(false);
  }, [projetId, router]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // --- ACTIONS DU PROJET PRINCIPAL ---
  const handleUpdateProjet = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSubmitting(true); setMessage(null);

    const safeTitre = titre.replace(/"/g, '""');
    const { data: existingData } = await supabase.from('projet').select('id').eq('user_id', process.env.NEXT_PUBLIC_PORTFOLIO_USER_ID).neq('id', projetId).or(`titre.eq."${safeTitre}",slug.eq."${slug}"`);

    if (existingData && existingData.length > 0) {
      setMessage({ text: "Impossible d'enregistrer : un projet avec ce titre/slug existe déjà.", type: 'error' });
      setIsSubmitting(false); return; 
    }

    const updatedProjet = {
      titre, slug, categorie_id: categorieId ? parseInt(categorieId) : null, description: description || null, en_ligne: enLigne, miniature_url: miniatureUrl || null,
      link_instagram: linkInstagram || null, link_youtube: linkYoutube || null, link_tiktok: linkTiktok || null, link_twitch: linkTwitch || null, link_facebook: linkFacebook || null,
    };

    const { error } = await supabase.from('projet').update(updatedProjet).eq('id', projetId).eq('user_id', process.env.NEXT_PUBLIC_PORTFOLIO_USER_ID);

    if (error) setMessage({ text: "Erreur lors de la sauvegarde : " + error.message, type: 'error' });
    else {
      await purgeCache();
      setMessage({ text: "Projet mis à jour avec succès !", type: 'success' });
      setTimeout(() => setMessage(null), 3000);
    }
    setIsSubmitting(false);
  };
  
  // --- ACTIONS DES SOUS-PROJETS (DÉTAILS) ---
  const handleAddSp = () => {
    const newId = -Date.now(); 
    const newSp: SousProjet = { id: newId, projet_id: parseInt(projetId), titre: '', description: '', youtube_url: '', drive_url: '', ordre: sousProjets.length + 1, created_at: new Date().toISOString() };
    setSousProjets([...sousProjets, newSp]); setEditingSpId(newId); setHasUnsavedChanges(true);
  };

  const executeDeleteSp = (id: number) => {
    if (id > 0) setDeletedSpIds(prev => [...prev, id]); 
    const filtered = sousProjets.filter(sp => sp.id !== id);
    setSousProjets(filtered.map((sp, idx) => ({ ...sp, ordre: idx + 1 })));
    if (editingSpId === id) setEditingSpId(null);
    setHasUnsavedChanges(true); setDeleteSpTarget(null);
  };

  const requestDeleteSp = (id: number, titre: string | null) => {
    const skipUntil = localStorage.getItem('skipDeleteConfirmUntil');
    if (skipUntil && parseInt(skipUntil) > new Date().getTime()) executeDeleteSp(id);
    else setDeleteSpTarget({ id, titre: titre || `Séquence média` });
  };

  const updateActiveSp = (field: keyof SousProjet, value: any) => {
    setSousProjets(prev => prev.map(sp => sp.id === editingSpId ? { ...sp, [field]: value } : sp));
    setHasUnsavedChanges(true);
  };

  const handleSaveDetails = async () => {
    setIsSavingDetails(true);
    try {
      if (deletedSpIds.length > 0) await supabase.from('sousprojet').delete().in('id', deletedSpIds);
      const toUpdate = sousProjets.filter(sp => sp.id > 0).map(({ created_at, ...rest }) => rest);
      if (toUpdate.length > 0) await supabase.from('sousprojet').upsert(toUpdate);
      const toInsert = sousProjets.filter(sp => sp.id < 0).map(({ id, created_at, ...rest }) => rest);
      if (toInsert.length > 0) await supabase.from('sousprojet').insert(toInsert);
      
      await purgeCache(); setDeletedSpIds([]); setHasUnsavedChanges(false); setEditingSpId(null); await fetchData(); 
    } catch (err) { console.error("Erreur :", err); }
    setIsSavingDetails(false);
  };

  const handleDragStart = (e: React.DragEvent, id: number) => { setDraggedId(id); e.dataTransfer.effectAllowed = 'move'; };
  const handleDragOver = (e: React.DragEvent, id: number) => { e.preventDefault(); if (dragOverId !== id) setDragOverId(id); };

  const handleDrop = async (e: React.DragEvent, targetId: number) => {
    e.preventDefault(); setDragOverId(null);
    if (!draggedId || draggedId === targetId) { setDraggedId(null); return; }

    const draggedIndex = sousProjets.findIndex(sp => sp.id === draggedId);
    const targetIndex = sousProjets.findIndex(sp => sp.id === targetId);

    const newItems = [...sousProjets];
    const [draggedItem] = newItems.splice(draggedIndex, 1);
    newItems.splice(targetIndex, 0, draggedItem);

    setSousProjets(newItems.map((sp, index) => ({ ...sp, ordre: index + 1 })));
    setDraggedId(null); setHasUnsavedChanges(true);
  };

  if (isLoading) return <div className="flex items-center justify-center text-z-blue h-full min-h-[50vh]">Chargement de l'éditeur...</div>;

  const activeCategory = categories.find(c => c.id.toString() === categorieId);
  const previewSousProjets = sousProjets.map(sp => ({ ...sp, finalYoutubeUrl: sp.youtube_url, driveImages: [], pdf: null, driveVideoUrl: null }));

  return (
    <>
      <div className="w-full flex flex-col lg:flex-row gap-4 xl:gap-6 h-auto lg:h-[calc(100vh-4rem)]">
        
        {/* COLONNE 1 : PROJET PRINCIPAL (Onglets Édition / Aperçu Live) */}
        <div className="flex-[1.2] flex flex-col min-w-0 bg-z-card/80 border border-z-border rounded-xl shadow-xl overflow-hidden relative z-10">
          
          <header className="shrink-0 p-3 sm:p-4 border-b border-z-border flex items-center justify-between gap-4 bg-z-card/50 backdrop-blur-md">
            <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
              <Link href="/admin/dashboard" className="shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-z-bg border border-z-border flex items-center justify-center text-z-muted hover:text-white hover:border-z-blue transition-all">
                <ArrowLeft size={18} />
              </Link>
              <div className="min-w-0">
                <h1 className="font-display font-bold text-lg sm:text-xl uppercase tracking-wider text-white truncate" title={titre || "Nouveau Projet"}>
                  {titre || "Nouveau Projet"}
                </h1>
              </div>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <div className="flex bg-z-bg p-1 rounded-lg border border-z-border">
                <button type="button" title="Édition" onClick={() => setLeftPanelMode('edit')} className={`flex items-center justify-center gap-2 h-7 sm:h-8 px-2.5 2xl:px-4 rounded-md transition-all ${leftPanelMode === 'edit' ? 'bg-z-card text-white shadow-sm' : 'text-z-muted hover:text-white'}`}>
                  <PenTool size={14} className="shrink-0" /> <span className="hidden 2xl:block text-[10px] font-bold uppercase tracking-widest">Édition</span>
                </button>
                <button type="button" title="Aperçu Live" onClick={() => setLeftPanelMode('preview')} className={`flex items-center justify-center gap-2 h-7 sm:h-8 px-2.5 2xl:px-4 rounded-md transition-all ${leftPanelMode === 'preview' ? 'bg-z-card text-z-blue shadow-sm' : 'text-z-muted hover:text-white'}`}>
                  <Eye size={14} className="shrink-0" /> <span className="hidden 2xl:block text-[10px] font-bold uppercase tracking-widest">Aperçu</span>
                </button>
              </div>

              {leftPanelMode === 'edit' && (
                <button type="button" title="Enregistrer le projet" onClick={() => handleUpdateProjet()} disabled={isSubmitting} className="shrink-0 btn-blue h-9 sm:h-10 px-3 2xl:px-5 rounded-lg flex items-center justify-center gap-2 shadow-lg hover:scale-105 transition-all disabled:opacity-50">
                  <Save size={16} className="shrink-0" /> <span className="hidden 2xl:block text-[10px] font-bold uppercase tracking-widest">{isSubmitting ? '...' : 'Enregistrer'}</span>
                </button>
              )}
            </div>
          </header>

          <div className="flex-1 overflow-y-auto custom-scrollbar relative">
            
            {/* VUE 1 : FORMULAIRE D'ÉDITION */}
            <div className={`p-4 sm:p-6 space-y-6 ${leftPanelMode === 'edit' ? 'block' : 'hidden'}`}>
              {message && <Alert type={message.type}>{message.text}</Alert>}

              <form onSubmit={handleUpdateProjet} className="space-y-6">
                <section className="bg-z-bg border border-z-border rounded-xl p-4 sm:p-6">
                  <h2 className="font-sub text-xs uppercase tracking-[0.2em] text-z-blue mb-6 flex items-center gap-2"><FileText size={16} /> Informations</h2>
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-2"><label className="text-[10px] uppercase font-bold tracking-widest text-z-muted ml-1">Titre</label><input required type="text" value={titre} onChange={(e) => {setTitre(e.target.value); setMessage(null);}} className="w-full bg-z-card border border-z-border rounded-lg p-3 text-sm focus:border-z-blue focus:outline-none" /></div>
                    <div className="space-y-2"><label className="text-[10px] uppercase font-bold tracking-widest text-z-muted ml-1">Slug (URL)</label><input required type="text" value={slug} onChange={(e) => {setSlug(e.target.value); setMessage(null);}} className="w-full bg-z-card border border-z-border rounded-lg p-3 text-sm text-z-muted focus:border-z-blue focus:outline-none" /></div>
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

                <section className="bg-z-bg border border-z-border rounded-xl p-4 sm:p-6">
                  <h2 className="font-sub text-xs uppercase tracking-[0.2em] text-z-blue mb-6 flex items-center gap-2"><ImageIcon size={16} /> Média Principal</h2>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] uppercase font-bold tracking-widest text-z-muted ml-1">URL de la miniature</label>
                      <span className="text-[9px] text-z-blue/70 italic px-2 py-0.5 bg-z-blue/5 rounded border border-z-blue/10">Drive direct</span>
                    </div>
                    <input type="url" value={miniatureUrl} onChange={(e) => setMiniatureUrl(e.target.value)} className="w-full bg-z-card border border-z-border rounded-lg p-3 text-sm focus:border-z-blue focus:outline-none placeholder:text-z-muted/30" placeholder="https://drive.google.com/uc?id=..." />
                  </div>
                </section>

                <section className="bg-z-bg border border-z-border rounded-xl p-4 sm:p-6">
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

            {/* VUE 2 : APERÇU LIVE (Composant Externe) */}
            <div className={`w-full h-full ${leftPanelMode === 'preview' ? 'block' : 'hidden'}`}>
               <ProjectPreview 
                 titre={titre} 
                 description={description} 
                 miniatureUrl={miniatureUrl} 
                 activeCategory={activeCategory} 
                 previewSousProjets={previewSousProjets} 
               />
            </div>

          </div>
        </div>

        {/* COLONNE 2 : LES DÉTAILS DU PROJET (Composant Externe) */}
        <ProjectDetailsSidebar 
           sousProjets={sousProjets}
           hasUnsavedChanges={hasUnsavedChanges}
           isSavingDetails={isSavingDetails}
           handleSaveDetails={handleSaveDetails}
           handleAddSp={handleAddSp}
           handleDragStart={handleDragStart}
           handleDragOver={handleDragOver}
           handleDrop={handleDrop}
           setDraggedId={setDraggedId}
           setDragOverId={setDragOverId}
           editingSpId={editingSpId}
           setEditingSpId={setEditingSpId}
           draggedId={draggedId}
           dragOverId={dragOverId}
           requestDeleteSp={requestDeleteSp}
           updateActiveSp={updateActiveSp}
        />

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
