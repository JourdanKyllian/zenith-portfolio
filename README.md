# 🪐 ZENITH PRODUCTION — Portfolio Audiovisuel Haut de Gamme

Bienvenue sur le dépôt officiel du portfolio de **ZENITH PRODUCTION**, vitrine numérique de Gabin Husson, graphiste, cadreur, et monteur vidéo & photo. Ce projet est une application web moderne combinant la puissance de la Jamstack, une architecture de données hybride et un pipeline de déploiement GitOps automatisé.

---

## 🚀 Vision & Objectifs Techniques

L'application a été conçue pour répondre à trois exigences strictes :
*   **Performance Absolue (0ms de latence) :** Chargement instantané des galeries et des projets grâce à une mise en cache agressive au niveau du serveur (Edge Caching).
*   **Autonomie Éditoriale :** Synchronisation automatique et fluide du contenu sans nécessiter de redéploiement manuel.
*   **Workflow DevOps Moderne :** Isolation complète des environnements de développement, de préproduction et de production.

---

## 🛠️ Stack Technique & Écosystème

L'architecture s'appuie sur les dernières innovations technologiques de l'écosystème JavaScript/TypeScript :

*   **Framework :** Next.js 16+ (App Router) utilisant le rendu hybride et les Server Actions .
*   **Runtime & Langage :** React 19 et TypeScript pour un code robuste, typé et hautement maintenable .
*   **Styles :** Tailwind CSS v4 avec une configuration de thèmes centralisée sous forme de variables CSS natives .
*   **Base de Données :** Supabase (PostgreSQL) pour la persistance des métadonnées relationnelles (projets, catégories, configurations) .
*   **Gestion des Médias Lourds :** API Google Drive (via Google APIs Service Account) pour l'extraction dynamique d'images haute définition, de documents PDF et de configurations vidéo .
*   **Routage des Mails :** Resend API pour le traitement sécurisé du formulaire de contact avec protection Honeypot anti-bot intégrée .
*   **Hébergement & CDN :** Vercel Edge Network couplé aux services Vercel Analytics et Speed Insights .

---

## 🏗️ Choix d'Architecture Majeurs

### 1. Gestion Hybride des Données (Supabase + Google Drive API)
Pour éviter de surcharger la base de données relationnelle ou de payer un service d'hébergement d'assets tiers (comme AWS S3 ou Cloudinary), le projet implémente un couplage intelligent :
*   **Supabase :** Stocke uniquement les données structurelles légères : titres, descriptions, slugs, associations de catégories et arborescences de sous-projets .
*   **Google Drive :** Sert de CMS de stockage pour l'artiste . En renseignant simplement l'URL d'un dossier Drive dans Supabase, le serveur Next.js interroge l'API Google au moment du build pour lister, trier et formater les miniatures d'images, les fichiers `youtube.txt` et les livrets PDF .

### 2. Stratégie d'Optimisation : ISR (Incremental Static Regeneration)
Plutôt que d'interroger la base de données à chaque clic utilisateur (ce qui génère de la latence et consomme des quotas d'API), l'application exploite l'**ISR** :
```typescript
export const revalidate = 3600; // Les pages sont reconstruites en arrière-plan toutes les heures au maximum
```
Les requêtes vers Supabase et Google Drive sont exécutées côté serveur . Le HTML généré est instantanément mis en cache globale sur le CDN de Vercel. Résultat : la navigation entre l'Accueil et la Galerie est immédiate pour l'utilisateur, tout en maintenant les données à jour de manière transparente.

### 3. Automatisation du SEO (Dynamic Sitemap)
Le fichier `app/sitemap.ts` est entièrement dynamique . Il effectue une requête directe vers Supabase lors du processus de génération du cache pour récupérer tous les slugs des projets actifs mis en ligne . L'arborescence XML est ainsi mise à jour de manière autonome pour les robots de Google (Googlebot) .

---

## ⚙️ Pipeline de Déploiement GitOps (Multi-Environnement)

Le projet intègre une barrière de sécurité étanche entre le code en cours de développement et la vitrine client grâce à une gestion fine des enregistrements DNS (CNAME chez OVH) :

| Environnement | Branche Git | URL Officielle | Rôle |
| :--- | :--- | :--- | :--- |
| **Production** | `main` | `https://zenithproduction.fr` | Version stable indexée par Google et accessible aux clients . |
| **Préproduction** | `dev` | `https://preprod.zenithproduction.fr` | Version de staging permettant de valider les nouveautés avant la mise en prod. |

Chaque commit poussé sur la branche `dev` déclenche un build de préproduction isolé sur Vercel, sans aucun impact sur l'expérience des utilisateurs finaux ou sur le référencement de la marque.

---

## 🛠️ Installation & Développement Local

### Prérequis
*   Node.js (version 20+ recommandée)
*   Un compte Supabase et un compte Google Cloud Platform (Service Account) 

### 1. Clonage du dépôt et installation des dépendances
```bash
git clone https://github.com/votre-compte/zenith-portfolio.git
cd zenith-portfolio
npm install
```

### 2. Configuration des Variables d'Environnement
Créez un fichier `.env.local` à la racine du projet et complétez les clés requises :
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anonyme

# Resend Mail Configuration
RESEND_API_KEY=re_votre_cle_resend

# Google Service Account Credentials
GOOGLE_SERVICE_ACCOUNT_EMAIL=votre-service-account@votre-projet.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nVotre_Cle_Privee_Ici\n-----END PRIVATE KEY-----\n"
```

### 3. Lancement du serveur de développement
```bash
npm run dev
```
L'application est maintenant accessible en local à l'adresse : `http://localhost:3000`.

---

## 📝 Licence

Ce projet est distribué sous licence **MIT** . Voir le fichier `LICENSE` pour plus de détails .

---
*Développé avec rigueur et passion par [KyllianDev](https://github.com/JourdanKyllian) — 2026.* 
