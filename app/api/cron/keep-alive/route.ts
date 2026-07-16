import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  // Vérification de sécurité pour s'assurer que seul Vercel peut déclencher ce cron
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Non autorisé', { status: 401 });
  }

  try {
    // Une requête ultra-légère : on demande juste l'ID d'une catégorie
    const { error } = await supabase
      .from('categorie')
      .select('id')
      .limit(1)
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, message: 'Supabase est bien réveillé !' });
  } catch (err) {
    console.error('Erreur lors du réveil de Supabase:', err);
    const errorMessage = err instanceof Error ? err.message : 'Une erreur inconnue est survenue';
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}