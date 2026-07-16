@AGENTS.md

# ZENITH PRODUCTION — Guide Contextuel du Projet

## 🛠️ Commandes Utiles
- **Développement local :** `npm run dev`
- **Compiler l'application :** `npm run build`
- **Vérification du code (Linter) :** `npm run lint`

---

## 🧭 Cartographie Architecturale des Pages

### 👤 Focus : Page À Propos (About)
- **Fichier :** `app/about/page.tsx`
- **Objectif :** Présentation du profil de Gabin Husson.
- **Composants internes :**
  - **Hero Section :** En-tête centré avec un halo lumineux diffus en arrière-plan.
  - **Viseur Ciné :** Section affichant la photo locale `/public/gabin.jpg` sous un filtre d'overlay sombre simulant le viseur d'une caméra ("Live Focus").
  - **Grille sémantique d'expertises :** Structure en `ul` / `li` utilisant les icônes de `lucide-react` (Camera, Film, Palette, Target) pour lister les champs d'action.
- **Règle de maintenance :** Cette page est 100% statique et côté serveur. Toute retouche textuelle de sa biographie se fait directement dans ce fichier.

### 🪐 Autres routes clés
- **Accueil (`app/page.tsx`) :** Section Hero animée et mise en avant dynamique des 3 dernières créations de Gabin.
- **Galerie (`app/projet/page.tsx` & `GalleryClient.tsx`) :** Système d'archives complet filtrable par univers créatif côté client.
- **Fiche Projet (`app/projet/[slug]/page.tsx`) :** Récupération dynamique des données (Supabase) et génération asynchrone des médias (Google Drive API).
- **Contact (`app/contact/page.tsx`) :** Formulaire de demande de devis lié à la Server Action Resend (`app/actions/sendEmail.ts`).

---

## 🎨 Charte Graphique & Couleurs (Tailwind v4)

Les couleurs de l'interface sombre de Zenith Production sont centralisées via des variables CSS. Ne jamais utiliser de codes hexadécimaux bruts pour les structures globales :
- Fond principal : `bg-z-bg`
- Cartes & Modules : `bg-z-card`
- Bordures fines : `border-z-border`
- Couleur signature (Bleu néon) : `text-z-blue` ou `bg-z-blue`
- Texte secondaire : `text-z-muted`

### 🏷️ Règle critique pour les catégories :
Le nom et la couleur des badges de catégories affichés sur le site sont gérés de manière dynamique via la colonne `color` de Supabase. Pour toute modification ou ajout de couleur, vous devez impérativement mettre à jour le dictionnaire de mapping situé dans `config/colors.ts`.