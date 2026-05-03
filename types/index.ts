export interface Category {
  id: string;
  nom: string;
  slug: string;
}

export interface Project {
  id: string;
  titre: string;
  description: string;
  image_url: string;
  youtube_url?: string;
  drive_url?: string;
  comeup_url?: string;
  en_ligne: boolean;
  categorie_id: string;
  categories: Category;
  created_at: string;
}