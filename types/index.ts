export interface Categorie {
  id: number;
  name: string;
  slug: string;
  created_at: string;
}

export interface SousProjet {
  id: number;
  projet_id: number;
  titre: string;
  description: string | null;
  youtube_url: string | null;
  drive_url: string | null;
  created_at: string;
}

export interface Projet {
  id: number;
  titre: string;
  description: string;
  en_ligne: boolean;
  categorie_id: number;
  miniature_url: string | null;
  slug: string;
  categorie?: Categorie;
  sousprojet?: SousProjet[];
  created_at: string;
}