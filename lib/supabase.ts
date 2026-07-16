import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Initialisation de l'instance client Supabase publique (Singleton).
 * Les clés sont vérifiées avant instanciation pour garantir la compilation
 * lors de la phase de build statique (Next.js) où les variables d'environnement
 * d'exécution ne sont pas toujours disponibles.
 */
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : (null as unknown as ReturnType<typeof createClient>);