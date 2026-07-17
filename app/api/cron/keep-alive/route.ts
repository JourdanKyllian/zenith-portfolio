import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

/**
 * Endpoint de maintenance planifié (Vercel Cron).
 * Purge de manière glissante les signatures réseau (adresses IP) obsolètes de plus de 7 jours
 * conformément aux exigences du RGPD concernant la minimisation et la limitation de la rétention des données.
 * 
 * @param {Request} request - Requête HTTP entrante authentifiée par le planificateur d'infrastructure.
 * @returns {Promise<NextResponse>} Réponse d'état indiquant le bilan transactionnel de l'opération de purge.
 */
export async function GET(request: Request): Promise<NextResponse> {
  // Validation de l'origine de la requête via le secret asymétrique d'infrastructure Vercel
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
    // Calcul de la borne d'historique de la fenêtre glissante (Instant T - 7 jours)
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    // Exécution de la purge sélective sur l'index chronologique (DELETE séquentiel non bloquant)
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