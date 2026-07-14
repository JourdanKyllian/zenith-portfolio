"use server";

import { createClient } from '@supabase/supabase-js';
import { getCvAssetsFromDrive } from '@/lib/googleDrive';

// On instancie un client admin isolé côté serveur pour bypass la RLS
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Pense à ajouter cette clé secrète sur ton tableau de bord Vercel
);

export async function fetchCvData() {
  try {
    // Requête sécurisée via le client admin
    const { data, error } = await supabaseAdmin
      .from('parametres')
      .select('valeur')
      .eq('cle', 'cv_drive_folder_id')
      .single();

    if (error || !data?.valeur) {
      console.error("Dossier CV non configuré dans la table parametres.");
      return { cvUrl: null, previewUrl: null };
    }

    // Extraction des fichiers depuis Google Drive
    return await getCvAssetsFromDrive(data.valeur);
    
  } catch (error) {
    console.error("Erreur globale lors de la récupération du CV:", error);
    return { cvUrl: null, previewUrl: null };
  }
}