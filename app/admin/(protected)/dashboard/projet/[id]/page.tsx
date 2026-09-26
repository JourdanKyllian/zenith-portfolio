"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, Eye, PenTool } from "lucide-react";
import Link from "next/link";
import { Categorie, Projet, SousProjet } from "@/types";
import Alert from "@/components/ui/Alert";
import { purgeCache } from "@/app/actions/revalidate";
import ProjectPreview from "@/components/admin/ProjectPreview";
import ProjectDetailsSidebar from "@/components/admin/ProjectDetailsSidebar";
import SubmitButton, { SubmitStatus } from "@/components/ui/SubmitButton";
import ProjectForm from "@/components/admin/ProjectForm";
import { AVAILABLE_SOCIALS } from "@/config/socials";

/**
 * Interface étendue pour la prévisualisation des sous-projets.
 * Ajoute les propriétés résolues nécessaires à l'affichage des médias.
 */
interface PreviewSousProjet extends SousProjet {
  finalYoutubeUrl: string | null;
  driveImages: string[];
  pdf: { id: string; name: string; previewUrl: string; thumbnailUrl: string; } | null;
  driveVideoUrl: string | null;
}

/**
 * Vue d'édition globale d'un projet.
 * Orchestre les données du projet, le formulaire de modification (gauche)
 * et le panneau latéral de gestion des séquences médias (droite).
 */
export default function EditProjetPage() {
  const router = useRouter();
  const params = useParams();
  const projetId = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const [titre, setTitre] = useState("");
  const [slug, setSlug] = useState("");
  const [categorieId, setCategorieId] = useState<string>("");
  const [description, setDescription] = useState("");
  const [enLigne, setEnLigne] = useState(false);
  const [miniatureUrl, setMiniatureUrl] = useState("");
  const [categories, setCategories] = useState<Categorie[]>([]);
  
  const [links, setLinks] = useState<Record<string, string>>(AVAILABLE_SOCIALS.reduce((acc, net) => ({ ...acc, [net.id]: "" }), {}));
  const [activeLinks, setActiveLinks] = useState<string[]>([]);
  
  const [initialSousProjets, setInitialSousProjets] = useState<SousProjet[]>([]);
  const [previewSousProjets, setPreviewSousProjets] = useState<PreviewSousProjet[]>([]);
  const [leftPanelMode, setLeftPanelMode] = useState<"edit" | "preview">("edit");

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  /**
   * Charge les informations du projet, ses séquences liées et les catégories disponibles.
   */
  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      const { data: catData } = await supabase.from("categorie").select("*").eq("user_id", process.env.NEXT_PUBLIC_PORTFOLIO_USER_ID).order("name");
      if (!isMounted) return;
      if (catData) setCategories(catData as Categorie[]);

      const { data: projetData, error } = await supabase.from("projet").select("*, sousprojet(*)").eq("id", projetId).eq("user_id", process.env.NEXT_PUBLIC_PORTFOLIO_USER_ID).single();
      
      if (!isMounted) return;
      
      if (error || !projetData) {
        router.push("/admin/dashboard");
        return;
      }

      const p = projetData as Projet;
      setTitre(p.titre || ""); setSlug(p.slug || ""); setCategorieId(p.categorie_id ? p.categorie_id.toString() : "");
      setDescription(p.description || ""); setEnLigne(p.en_ligne || false); setMiniatureUrl(p.miniature_url || "");

      const fetchedLinks = AVAILABLE_SOCIALS.reduce((acc, net) => {
        acc[net.id] = (p[`link_${net.id}` as keyof Projet] as string) || "";
        return acc;
      }, {} as Record<string, string>);

      setLinks(fetchedLinks);
      setActiveLinks(Object.keys(fetchedLinks).filter((k) => fetchedLinks[k] !== ""));
      setInitialSousProjets(p.sousprojet ? p.sousprojet.sort((a, b) => a.ordre - b.ordre) : []);
      setIsLoading(false);
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [projetId, router]);

  /**
   * Sauvegarde les modifications globales du projet (titre, description, réseaux).
   * Vérifie l'unicité du slug avant l'insertion en base.
   * 
   * @param {React.FormEvent} [e] - Événement de soumission du formulaire (optionnel).
   */
  const handleUpdateProjet = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setStatus("loading"); setMessage(null);

    const safeTitre = titre.replace(/"/g, '""');
    const { data: existingData } = await supabase.from("projet").select("id").eq("user_id", process.env.NEXT_PUBLIC_PORTFOLIO_USER_ID).neq("id", projetId).or(`titre.eq."${safeTitre}",slug.eq."${slug}"`);

    if (existingData && existingData.length > 0) {
      setStatus("error"); setMessage({ text: "Impossible d'enregistrer : un projet avec ce titre/slug existe déjà.", type: "error" });
      scrollToTop(); setTimeout(() => setStatus("idle"), 3000); return;
    }

    const socialPayload = AVAILABLE_SOCIALS.reduce((acc, net) => {
      acc[`link_${net.id}`] = links[net.id] || null;
      return acc;
    }, {} as Record<string, string | null>);

    const updatedProjet = {
      titre, slug, categorie_id: categorieId ? parseInt(categorieId) : null, description: description || null, en_ligne: enLigne, miniature_url: miniatureUrl || null, ...socialPayload,
    };

    const { error } = await supabase.from("projet").update(updatedProjet).eq("id", projetId).eq("user_id", process.env.NEXT_PUBLIC_PORTFOLIO_USER_ID);

    if (error) {
      setStatus("error"); setMessage({ text: "Erreur : " + error.message, type: "error" });
      scrollToTop(); setTimeout(() => setStatus("idle"), 3000);
    } else {
      await purgeCache();
      setStatus("success"); setMessage({ text: "Projet mis à jour avec succès !", type: "success" });
      setTimeout(() => { setStatus("idle"); setMessage(null); }, 3000);
    }
  };

  /**
   * Maintient la synchronisation visuelle entre l'éditeur de séquences (Sidebar)
   * et la vue d'aperçu dynamique du projet.
   * 
   * @param {SousProjet[]} sp - Collection de sous-projets en cours d'édition.
   */
  const handleUpdatePreview = useCallback((sp: SousProjet[]) => {
    setPreviewSousProjets(sp.map((s) => ({
      ...s, finalYoutubeUrl: s.youtube_url, driveImages: [], pdf: null, driveVideoUrl: null,
    })));
  }, []);

  if (isLoading) return <div className="flex items-center justify-center text-z-blue h-full min-h-[50vh]">Chargement de l'éditeur...</div>;

  return (
    <div className="w-full flex flex-col lg:flex-row gap-4 xl:gap-6 h-auto lg:h-[calc(100vh-4rem)]">
      <div className="flex-[1.2] flex flex-col min-w-0 bg-z-card/80 border border-z-border rounded-xl shadow-xl overflow-hidden relative z-10">
        <header className="shrink-0 p-3 sm:p-4 border-b border-z-border flex items-center justify-between gap-4 bg-z-card/50 backdrop-blur-md">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
            <Link href="/admin/dashboard" className="shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-z-bg border border-z-border flex items-center justify-center text-z-muted hover:text-white hover:border-z-blue transition-all"><ArrowLeft size={18} /></Link>
            <div className="min-w-0"><h1 className="font-display font-bold text-lg sm:text-xl uppercase tracking-wider text-white truncate" title={titre}>{titre}</h1></div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="flex bg-z-bg p-1 rounded-lg border border-z-border">
              <button type="button" onClick={() => setLeftPanelMode("edit")} className={`flex items-center justify-center gap-2 h-7 sm:h-8 px-2.5 2xl:px-4 rounded-md transition-all ${leftPanelMode === "edit" ? "bg-z-card text-white shadow-sm" : "text-z-muted hover:text-white"}`}>
                <PenTool size={14} /> <span className="hidden 2xl:block text-[10px] font-bold uppercase tracking-widest">Édition</span>
              </button>
              <button type="button" onClick={() => setLeftPanelMode("preview")} className={`flex items-center justify-center gap-2 h-7 sm:h-8 px-2.5 2xl:px-4 rounded-md transition-all ${leftPanelMode === "preview" ? "bg-z-card text-z-blue shadow-sm" : "text-z-muted hover:text-white"}`}>
                <Eye size={14} /> <span className="hidden 2xl:block text-[10px] font-bold uppercase tracking-widest">Aperçu</span>
              </button>
            </div>
            {leftPanelMode === "edit" && (
              <SubmitButton status={status} onClick={() => handleUpdateProjet()} type="button" className="h-9 sm:h-10 px-3 2xl:px-5 text-[10px] shrink-0" textClassName="hidden 2xl:block uppercase" />
            )}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto custom-scrollbar relative">
          <div className={`p-4 sm:p-6 space-y-6 ${leftPanelMode === "edit" ? "block" : "hidden"}`}>
            {message && <Alert type={message.type}>{message.text}</Alert>}
            
            <ProjectForm
              titre={titre} setTitre={setTitre} slug={slug} setSlug={setSlug}
              categorieId={categorieId} setCategorieId={setCategorieId} categories={categories}
              enLigne={enLigne} setEnLigne={setEnLigne} description={description} setDescription={setDescription}
              miniatureUrl={miniatureUrl} setMiniatureUrl={setMiniatureUrl}
              links={links} setLinks={setLinks} activeLinks={activeLinks} setActiveLinks={setActiveLinks}
              onClearMessage={() => setMessage(null)} onSubmit={handleUpdateProjet}
            />
          </div>

          <div className={`w-full h-full ${leftPanelMode === "preview" ? "block" : "hidden"}`}>
            <ProjectPreview
              titre={titre} description={description} miniatureUrl={miniatureUrl}
              activeCategory={categories.find((c) => c.id.toString() === categorieId)}
              previewSousProjets={previewSousProjets}
            />
          </div>
        </div>
      </div>

      <ProjectDetailsSidebar
        projetId={projetId}
        initialSousProjets={initialSousProjets}
        onUpdatePreview={handleUpdatePreview}
      />
    </div>
  );
}
