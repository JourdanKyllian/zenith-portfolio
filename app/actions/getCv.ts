"use server";

import { getCvFromDrive } from '@/lib/googleDrive';
import { supabase } from '@/lib/supabase';

export async function fetchCvUrl() {
  try {
    // 1. On va chercher l'ID du dossier stocké par Gabin dans la BDD
    const { data, error } = await supabase
      .from('parametres')
      .select('valeur')
      .eq('cle', 'cv_drive_folder_id')
      .single();

    if (error || !data?.valeur) {
      console.error("Dossier CV non configuré dans la base de données.");
      return null;
    }

    const folderId = data.valeur;
    
    // 2. On interroge Drive avec cet ID pour récupérer le PDF
    const cvUrl = await getCvFromDrive(folderId);
    return cvUrl;
    
  } catch (error) {
    console.error("Erreur globale lors de la récupération du CV:", error);
    return null;
  }
}