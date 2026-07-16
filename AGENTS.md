# 🚨 GUARDRAILS TECHNIQUES — NEXT.JS 16 & REACT 19

Ce fichier contient les règles de syntaxe absolues pour ce projet. Ne déviez jamais de ces conventions sous peine de casser le build de production.

## 📦 Stack Technologique Spécifique
- Framework : Next.js 16.2+ (App Router)
- Librairie UI : React 19.2+ (Utilisation native du compilateur React)
- Styles : Tailwind CSS v4 (Configuration via variables CSS natives)

## ⚠️ Règles Next.js 16 (App Router) impératives

### 1. Asynchronisme des paramètres de routes (`params` & `searchParams`)
Dans Next.js 16, `params` et `searchParams` reçus par les fonctions `Page`, `layout`, ou `generateMetadata` sont des **Promises**. Vous devez IMPÉRATIVEMENT les traiter de manière asynchrone avec `await` avant d'accéder à leurs propriétés.
*   ❌ **INTERDIT (Syntaxe obsolète) :**
    ```tsx
    export default function Page({ params }: { params: { slug: string } }) {
      const slug = params.slug; // Va crash au runtime !
    ```
*   ▲ **OBLIGATOIRE (Next.js 16+) :**
    ```tsx
    export default function Page({ params }: { params: Promise<{ slug: string }> }) {
      const { slug } = await params;
    ```

### 2. Composants Serveur (RSC) vs Composants Client
- Tous les fichiers dans `app/` sont des Server Components par défaut.
- Ne pas ajouter `'use client'` mécaniquement. Garder les composants serveurs pour le SEO, les requêtes directes à Supabase, et l'API Google Drive.
- Réserver `'use client'` uniquement aux fichiers gérant des states, des interactions directes (Lightbox, formulaires animés, Canvas) ou des hooks React.

### 3. Balises d'images
La règle ESLint sur les balises `<img>` natives est désactivée (`"@next/next/no-img-element": "off"`). Vous pouvez utiliser des balises `<img>` classiques pour les bannières lourdes et les résolutions distantes asynchrones complexes (Google Drive API).

### 4. Typage TypeScript Strict
Le projet refuse le type `any`. Tous les retours de fonctions de requêtes réseau (Supabase / Google Drive) doivent être explicitement mappés avec les interfaces définies dans `types/index.ts`.