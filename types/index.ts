export interface Categorie {
  id: number;
  name: string;
  slug: string;
  created_at: string;
}

export interface Projet {
  id: number;
  titre: string;
  description: string;
  image_url: string;
  youtube_url?: string;
  drive_url?: string;
  en_ligne: boolean;
  categorie: Categorie;
  created_at: string;
}