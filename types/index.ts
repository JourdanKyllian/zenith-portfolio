/**
 * Modèles de données stricts pour le typage TypeScript des retours de l'API Supabase.
 */

export interface Categorie {
  id: number;
  created_at: string;
  name: string;
  slug: string;
  color: string | null;
  user_id: string;
}

export interface Projet {
  id: number;
  created_at: string;
  titre: string;
  categorie_id: number | null;
  description: string | null;
  en_ligne: boolean;
  miniature_url: string | null;
  slug: string;
  link_instagram: string | null;
  link_youtube: string | null;
  link_tiktok: string | null;
  link_twitch: string | null;
  link_facebook: string | null;
  user_id: string;
  categorie?: Categorie;
  sousprojet?: SousProjet[];
}

export interface SousProjet {
  id: number;
  created_at: string;
  titre: string;
  description: string | null;
  youtube_url: string | null;
  drive_url: string | null;
  projet_id: number;
  ordre: number;
}
