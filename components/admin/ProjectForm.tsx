"use client";

import React from "react";
import { FileText, Image as ImageIcon, Link2, ToggleLeft, ToggleRight } from "lucide-react";
import { Categorie } from "@/types";
import RichTextEditor from "@/components/ui/RichTextEditor";
import DynamicSocialLinks from "@/components/admin/DynamicSocialLinks";

interface ProjectFormProps {
  titre: string;
  setTitre: (val: string) => void;
  slug: string;
  setSlug: (val: string) => void;
  categorieId: string;
  setCategorieId: (val: string) => void;
  categories: Categorie[];
  enLigne: boolean;
  setEnLigne: (val: boolean) => void;
  description: string;
  setDescription: (val: string) => void;
  miniatureUrl: string;
  setMiniatureUrl: (val: string) => void;
  links: Record<string, string>;
  setLinks: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  activeLinks: string[];
  setActiveLinks: React.Dispatch<React.SetStateAction<string[]>>;
  onClearMessage: () => void;
  onSubmit: (e?: React.FormEvent) => void;
}

export default function ProjectForm({
  titre, setTitre, slug, setSlug, categorieId, setCategorieId, categories,
  enLigne, setEnLigne, description, setDescription, miniatureUrl, setMiniatureUrl,
  links, setLinks, activeLinks, setActiveLinks, onClearMessage, onSubmit
}: ProjectFormProps) {
  
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <section className="bg-z-bg border border-z-border rounded-xl p-4 sm:p-6">
        <h2 className="font-sub text-xs uppercase tracking-[0.2em] text-z-blue mb-6 flex items-center gap-2">
          <FileText size={16} /> Informations
        </h2>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold tracking-widest text-z-muted ml-1">Titre</label>
            <input
              required type="text" value={titre}
              onChange={(e) => { setTitre(e.target.value); onClearMessage(); }}
              className="w-full bg-z-card border border-z-border rounded-lg p-3 text-sm focus:border-z-blue focus:outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold tracking-widest text-z-muted ml-1">Slug (URL)</label>
            <input
              required type="text" value={slug}
              onChange={(e) => { setSlug(e.target.value); onClearMessage(); }}
              className="w-full bg-z-card border border-z-border rounded-lg p-3 text-sm text-z-muted focus:border-z-blue focus:outline-none"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold tracking-widest text-z-muted ml-1">Catégorie</label>
            <select
              value={categorieId} onChange={(e) => setCategorieId(e.target.value)}
              className="w-full bg-z-card border border-z-border rounded-lg p-3 text-sm text-white focus:border-z-blue focus:outline-none appearance-none"
            >
              <option value="">-- Sans catégorie --</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="space-y-2 flex flex-col justify-center">
            <label className="text-[10px] uppercase font-bold tracking-widest text-z-muted ml-1 mb-2">Visibilité</label>
            <button
              type="button" onClick={() => setEnLigne(!enLigne)}
              className={`flex items-center gap-3 w-fit px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-widest transition-colors ${enLigne ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-z-card border border-z-border text-z-muted"}`}
            >
              {enLigne ? <ToggleRight size={20} /> : <ToggleLeft size={20} />} {enLigne ? "Public" : "Brouillon"}
            </button>
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] uppercase font-bold tracking-widest text-z-muted ml-1">Description</label>
          <RichTextEditor value={description} onChange={setDescription} minHeight="200px" />
        </div>
      </section>
      
      <section className="bg-z-bg border border-z-border rounded-xl p-4 sm:p-6">
        <h2 className="font-sub text-xs uppercase tracking-[0.2em] text-z-blue mb-6 flex items-center gap-2">
          <ImageIcon size={16} /> Média Principal
        </h2>
        <input
          type="url" value={miniatureUrl} onChange={(e) => setMiniatureUrl(e.target.value)}
          className="w-full bg-z-card border border-z-border rounded-lg p-3 text-sm focus:border-z-blue focus:outline-none placeholder:text-z-muted/30"
          placeholder="https://drive.google.com/uc?id=..."
        />
      </section>

      <section className="bg-z-bg border border-z-border rounded-xl p-4 sm:p-6">
        <h2 className="font-sub text-xs uppercase tracking-[0.2em] text-z-blue mb-6 flex items-center gap-2">
          <Link2 size={16} /> Réseaux liés
        </h2>
        <DynamicSocialLinks links={links} setLinks={setLinks} activeLinks={activeLinks} setActiveLinks={setActiveLinks} />
      </section>
    </form>
  );
}
