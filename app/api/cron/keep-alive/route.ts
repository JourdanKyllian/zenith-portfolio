import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

/**
 * Route d'exécution des tâches de maintenance planifiées (Vercel Cron).
 * Purge de manière glissante les signatures réseau (adresses IP) obsolètes du journal de sécurité
 * pour se conformer au RGPD (principe de limitation de la conservation).
 * 
 * @param {Request} request - Requête HTTP entrante authentifiée.
 * @returns {Promise<NextResponse>} Réponse JSON indiquant le statut de l'opération de purge.
 */
export async function GET(request: Request): Promise<NextResponse> {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Non autorisé', { status: 401 });
  }

  if (!supabase) {
    return NextResponse.json(
      { success: false, error: 'Composant de persistance Supabase introuvable.' }, 
      { status: 500 }
    );
  }

  try {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const { error } = await supabase
      .from('form_rate_limits')
      .delete()
      .lt('created_at', oneWeekAgo.toISOString());

    if (error) throw error;

    return NextResponse.json({ 
      success: true, 
      message: 'Purge des enregistrements obsolètes exécutée avec succès.' 
    });

  } catch (err) {
    console.error('Échec de la transaction de maintenance préventive (Cron) :', err);
    const errorMessage = err instanceof Error ? err.message : 'Erreur applicative interne indéterminée';
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
