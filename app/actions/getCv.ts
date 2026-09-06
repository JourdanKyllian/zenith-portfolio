"use server";

import { supabase as publicSupabase } from '@/lib/supabase';
import { createClient } from '@supabase/supabase-js';
import { getCvAssetsFromDrive } from '@/lib/googleDrive';

/**
 * Server Action : Récupère le lien de prévisualisation et de téléchargement du CV.
 * Utilise la clé Service Role si disponible pour contourner les règles RLS de Supabase,
 * sinon se replie de manière sécurisée sur le client public anonyme.
 *
 * @returns {Promise<{ cvUrl: string | null; previewUrl: string | null }>}
 */
export async function fetchCvData() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  let client = publicSupabase;

  if (supabaseUrl && serviceRoleKey) {
    try {
      client = createClient(supabaseUrl, serviceRoleKey);
    } catch (e) {
      console.error("Échec de l'initialisation du client administrateur Supabase :", e);
    }
  }

  try {
    const { data, error } = await client
      .from('parametres')
      .select('valeur')
      .eq('cle', 'cv_drive_folder_id')
      // --- BOUCLIER MULTI-TENANT ---
      .eq('user_id', process.env.NEXT_PUBLIC_PORTFOLIO_USER_ID)
      .single();

    if (error || !data?.valeur) {
      console.error("Identifiant du dossier CV non trouvé dans la configuration.");
      return { cvUrl: null, previewUrl: null };
    }

    return await getCvAssetsFromDrive(data.valeur);
    
  } catch (error) {
    console.error("Erreur lors de la récupération des métadonnées du CV:", error);
    return { cvUrl: null, previewUrl: null };
  }
}
