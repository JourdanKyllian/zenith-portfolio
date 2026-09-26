"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { X } from "lucide-react";
import Alert from "@/components/ui/Alert";
import { purgeCache } from "@/app/actions/revalidate";
import { CategoryBadge } from "@/components/CategoryBadge";
import ColorPicker from "@/components/ui/ColorPicker";
import { getCategoryStyle } from "@/config/colors";
import SubmitButton, { SubmitStatus } from "@/components/ui/SubmitButton";
import { Categorie } from "@/types";

const PRESET_COLORS = [
  { name: "Bleu", hex: "#3B82F6" },
  { name: "Rose", hex: "#EC4899" },
  { name: "Violet", hex: "#A855F7" },
  { name: "Vert", hex: "#10B981" },
  { name: "Jaune", hex: "#F59E0B" },
  { name: "Orange", hex: "#F97316" },
  { name: "Rouge", hex: "#EF4444" },
  { name: "Blanc", hex: "#E8E8F8" },
];

interface CategoryFormProps {
  initialData: Categorie | null; // Les données de la catégorie si on est en mode "Édition"
  onSuccess: (cat: Categorie, isNew: boolean) => void;
  onCancel: () => void;
}

export default function CategoryForm({
  initialData,
  onSuccess,
  onCancel,
}: CategoryFormProps) {
  const [prevInitialData, setPrevInitialData] = useState(initialData);
  const [newName, setNewName] = useState(initialData?.name ?? "");
  const [newSlug, setNewSlug] = useState(initialData?.slug ?? "");
  const [newColor, setNewColor] = useState(initialData?.color ?? "");

  const [formMessage, setFormMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);
  const [status, setStatus] = useState<SubmitStatus>("idle");

  // Remplissage auto si on est en mode Édition (ajustement pendant le rendu,
  // recommandé par React à la place d'un useEffect + setState)
  if (initialData !== prevInitialData) {
    setPrevInitialData(initialData);
    setNewName(initialData?.name ?? "");
    setNewSlug(initialData?.slug ?? "");
    setNewColor(initialData?.color ?? "");
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setNewName(val);
    setFormMessage(null);
    setNewSlug(
      val
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-"),
    );
  };

  const handleSave = async () => {
    if (!newName || !newSlug) return;
    setStatus("loading");
    setFormMessage(null);

    const safeName = newName.replace(/"/g, '""');
    let query = supabase
      .from("categorie")
      .select("id")
      .eq("user_id", process.env.NEXT_PUBLIC_PORTFOLIO_USER_ID)
      .or(`name.eq."${safeName}",slug.eq."${newSlug}"`);
    if (initialData) query = query.neq("id", initialData.id);

    const { data: existingData } = await query;
    if (existingData && existingData.length > 0) {
      setStatus("error");
      setFormMessage({
        text: "Cette catégorie (nom ou slug) existe déjà.",
        type: "error",
      });
      setTimeout(() => setStatus("idle"), 3000);
      return;
    }

    const catData = {
      name: newName,
      slug: newSlug,
      color: newColor || null,
      user_id: process.env.NEXT_PUBLIC_PORTFOLIO_USER_ID as string,
    };

    if (initialData) {
      const { error } = await supabase
        .from("categorie")
        .update(catData)
        .eq("id", initialData.id);
      if (!error) {
        await purgeCache();
        setStatus("success");
        setFormMessage({ text: "Mise à jour réussie !", type: "success" });
        setTimeout(
          () => onSuccess({ ...initialData, ...catData }, false),
          1500,
        );
      } else {
        setStatus("error");
        setFormMessage({ text: error.message, type: "error" });
        setTimeout(() => setStatus("idle"), 3000);
      }
    } else {
      const { data, error } = await supabase
        .from("categorie")
        .insert([catData])
        .select("*, projet(id)")
        .single();
      if (!error && data) {
        await purgeCache();
        setStatus("success");
        setFormMessage({ text: "Création réussie !", type: "success" });
        setTimeout(() => onSuccess(data, true), 1500);
      } else {
        setStatus("error");
        setFormMessage({
          text: error?.message || "Erreur d'insertion",
          type: "error",
        });
        setTimeout(() => setStatus("idle"), 3000);
      }
    }
  };

  return (
    <div
      id="category-form"
      className="bg-z-card border border-z-blue/30 rounded-xl p-6 mb-8 shadow-[0_0_20px_rgba(0,123,255,0.1)] animate-in fade-in slide-in-from-top-4 duration-300"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-sub text-xs uppercase tracking-widest text-z-blue">
          {initialData ? "Modifier la catégorie" : "Créer une catégorie"}
        </h3>
        <button
          onClick={onCancel}
          className="text-z-muted hover:text-white transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      {formMessage && (
        <div className="mb-6">
          <Alert type={formMessage.type}>{formMessage.text}</Alert>
        </div>
      )}

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold tracking-widest text-z-muted ml-1">
              Nom de la catégorie
            </label>
            <input
              type="text"
              value={newName}
              onChange={handleNameChange}
              className="w-full bg-z-bg border border-z-border rounded-lg py-3 px-4 text-sm focus:border-z-blue focus:outline-none transition-colors"
              placeholder="Ex: Post Production"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold tracking-widest text-z-muted ml-1">
              Slug généré (URL)
            </label>
            <input
              type="text"
              value={newSlug}
              onChange={(e) => {
                setNewSlug(e.target.value);
                setFormMessage(null);
              }}
              className="w-full bg-z-bg border border-z-border rounded-lg py-3 px-4 text-sm text-z-muted focus:border-z-blue focus:outline-none transition-colors"
            />
          </div>
        </div>

        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between mb-1">
            <label className="text-[10px] uppercase font-bold tracking-widest text-z-muted ml-1">
              Couleur visuelle
            </label>
            {newName && (
              <CategoryBadge
                category={{ name: newName, color: newColor }}
                className="px-2 py-0.5 text-[9px]"
              />
            )}
          </div>

          <div className="flex flex-wrap gap-2 mb-2">
            <button
              type="button"
              onClick={() => setNewColor("")}
              className={`px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-widest border transition-all ${!newColor ? "bg-z-card text-white border-z-blue ring-1 ring-z-blue/50 scale-105 shadow-md" : "bg-z-bg text-z-muted border-z-border hover:border-z-blue/30"}`}
            >
              Gris par défaut
            </button>
            {PRESET_COLORS.map((preset) => {
              const isSelected =
                newColor.toUpperCase() === preset.hex.toUpperCase();
              const style = getCategoryStyle(preset.hex);
              return (
                <button
                  key={preset.hex}
                  type="button"
                  onClick={() => setNewColor(preset.hex)}
                  style={style}
                  className={`px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-widest border transition-all ${isSelected ? "scale-105 shadow-md opacity-100 ring-1" : "opacity-50 hover:opacity-100 hover:scale-105"}`}
                >
                  {preset.name}
                </button>
              );
            })}
          </div>
          <ColorPicker value={newColor} onChange={setNewColor} />
        </div>

        <div className="pt-4 border-t border-z-border flex justify-end">
          <SubmitButton
            status={status}
            onClick={handleSave}
            disabled={!newName}
            idleText={initialData ? "Mettre à jour" : "Enregistrer"}
            className="py-3 px-6 text-xs"
          />
        </div>
      </div>
    </div>
  );
}
