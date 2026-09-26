import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

/**
 * Instance client singleton pour les interactions avec l'API Supabase (PostgreSQL).
 * Instanciée de manière conditionnelle avec une vérification de sécurité des variables d'environnement
 * pour prévenir les échecs de compilation lors de la génération statique (SSG) de Next.js.
 * 
 * @constant
 */
export const supabase = supabaseUrl && supabaseKey 
  ? createClient(supabaseUrl, supabaseKey)
  : (null as unknown as ReturnType<typeof createClient>);
  