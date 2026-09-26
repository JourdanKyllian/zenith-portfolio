"use server";

import { revalidatePath } from "next/cache";

/**
 * Server Action : Interface de purge du cache statique Next.js (Incremental Static Regeneration).
 * Invoqué post-mutation par les panneaux d'administration pour forcer la regénération des pages.
 * 
 * Si un chemin spécifique est fourni, seule cette page est invalidée.
 * Sinon, une purge globale du layout racine et de l'arborescence dynamique des projets est exécutée.
 *
 * @param {string} [path] - Le chemin spécifique de la route à purger (Optionnel).
 */
export async function purgeCache(path?: string) {
  if (path) {
    revalidatePath(path, 'page');
  } else {
    revalidatePath('/', 'layout');
    revalidatePath('/projet/[slug]', 'page');
  }
}
