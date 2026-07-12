"use server";

import { getCvFromDrive } from '@/lib/googleDrive';

export async function fetchCvUrl() {
  // Remplace cette chaîne par l'ID réel du dossier Drive de Gabin, 
  // ou récupère-le via un appel supabase.from('parametres')... si tu préfères utiliser la BDD.
  const folderId = process.env.DRIVE_CV_FOLDER_ID || "ID_DU_DOSSIER_DRIVE_DE_GABIN"; 
  
  if (!folderId) return null;
  
  const cvUrl = await getCvFromDrive(folderId);
  return cvUrl;
}