import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

/**
 * Route API exécutée par Vercel Cron.
 * Maintient l'instance Supabase (Tier Gratuit) active en prévenant la mise en veille
 * automatique déclenchée après 7 jours d'inactivité.
 *
 * @param {Request} request - La requête entrante contenant le header d'autorisation.
 * @returns {NextResponse} Le statut de l'opération de réveil.
 */
export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Non autorisé', { status: 401 });
  }

  try {
    const { error } = await supabase
      .from('categorie')
      .select('id')
      .limit(1)
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, message: 'Instance Supabase maintenue active.' });
  } catch (err) {
    console.error('Erreur de maintenance Supabase :', err);
    const errorMessage = err instanceof Error ? err.message : 'Erreur interne inattendue';
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}