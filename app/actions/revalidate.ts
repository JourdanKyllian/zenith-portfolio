"use server";

import { revalidatePath } from "next/cache";

/**
 * Server Action : Purge le cache statique de Next.js à la demande.
 * Invoqué par le tableau de bord client après une modification réussie.
 */
export async function purgeCache(path?: string) {
  if (path) {
    // Purge une page spécifique (ex: '/projet' ou '/projet/mon-film')
    revalidatePath(path, 'page');
  } else {
    // Purge absolue de tout le site (reconstruit le layout global, navbar, footer)
    revalidatePath('/', 'layout');
  }
}
