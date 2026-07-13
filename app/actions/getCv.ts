"use server";

import { getCvAssetsFromDrive } from '@/lib/googleDrive';
import { supabase } from '@/lib/supabase';

export async function fetchCvData() {
  try {
    // On va chercher l'ID du dossier stocké en BDD
    const { data, error } = await supabase
      .from('parametres')
      .select('valeur')
      .eq('cle', 'cv_drive_folder_id')
      .single();

    if (error || !data?.valeur) {
      console.error("Dossier CV non configuré dans la base de données.");
      return { cvUrl: null, previewUrl: null };
    }

    const folderId = data.valeur;
    
    // On interroge Drive avec cet ID pour récupérer le PDF et la preview
    return await getCvAssetsFromDrive(folderId);
    
  } catch (error) {
    console.error("Erreur globale lors de la récupération du CV:", error);
    return { cvUrl: null, previewUrl: null };
  }
}