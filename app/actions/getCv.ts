"use server";

import { supabase as publicSupabase } from '@/lib/supabase';
import { createClient } from '@supabase/supabase-js';
import { getCvAssetsFromDrive } from '@/lib/googleDrive';

export async function fetchCvData() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  // Repli de sécurité automatique sur le client public
  let client = publicSupabase;

  if (supabaseUrl && serviceRoleKey) {
    try {
      client = createClient(supabaseUrl, serviceRoleKey);
    } catch (e) {
      console.error("Échec d'initialisation admin, repli sur le client public :", e);
    }
  }

  try {
    const { data, error } = await client
      .from('parametres')
      .select('valeur')
      .eq('cle', 'cv_drive_folder_id')
      .single();

    if (error || !data?.valeur) {
      console.error("Dossier CV non configuré dans la table parametres.");
      return { cvUrl: null, previewUrl: null };
    }

    return await getCvAssetsFromDrive(data.valeur);
    
  } catch (error) {
    console.error("Erreur globale lors de la récupération du CV:", error);
    return { cvUrl: null, previewUrl: null };
  }
}