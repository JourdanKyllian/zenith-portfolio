"use server";

import { createClient } from '@supabase/supabase-js';
import { getCvAssetsFromDrive } from '@/lib/googleDrive';

export async function fetchCvData() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  // Sécurité anti-crash pour le build Vercel si les variables ne sont pas encore injectées
  if (!supabaseUrl || !serviceRoleKey) {
    console.warn("⚠️ [Supabase] URL ou Service Role Key manquante. Saut de la récupération du CV.");
    return { cvUrl: null, previewUrl: null };
  }

  try {
    // Instanciation "lazy" uniquement au moment de l'appel de la fonction
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

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