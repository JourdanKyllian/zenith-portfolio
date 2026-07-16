/**
 * UI Component : Squelette de chargement (Suspense Boundary).
 * Intercepté par Next.js pendant la résolution asynchrone des données de la route
 * `[slug]/page.tsx` pour offrir une transition fluide sans gel de l'écran.
 */
export default function Loading() {
  return (
    <main className="min-h-screen bg-z-bg flex flex-col items-center justify-center p-4">
      <div className="relative flex flex-col items-center space-y-6 max-w-md text-center">
        
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-z-blue/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-z-blue border-t-transparent rounded-full animate-spin"></div>
        </div>

        <div className="space-y-1">
          <p className="text-z-text font-bold uppercase tracking-widest text-sm animate-pulse">
            Chargement de la fiche
          </p>
          <p className="text-z-muted text-xs font-light">
            Calcul des flux médias et récupération des sources...
          </p>
        </div>

      </div>
    </main>
  );
}