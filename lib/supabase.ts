import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

/**
 * Initialisation de l'instance client Supabase publique (Singleton).
 * Les clés sont vérifiées avant instanciation pour garantir la compilation
 * lors de la phase de build statique (Next.js) où les variables d'environnement
 * d'exécution ne sont pas toujours disponibles.
 */
export const supabase = supabaseUrl && supabaseKey 
  ? createClient(supabaseUrl, supabaseKey)
  : (null as unknown as ReturnType<typeof createClient>);