import { google } from 'googleapis';

// Initialisation sécurisée du client Google Drive (côté serveur uniquement)
const auth = new google.auth.JWT({
  email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  scopes: ['https://www.googleapis.com/auth/drive.readonly']
});

const drive = google.drive({ version: 'v3', auth });

export interface DriveAssets {
  images: string[];
  youtubeUrl: string | null;
}

/**
 * Extrait l'ID d'un dossier Google Drive à partir d'une URL complète ou renvoie l'ID brut.
 */
export function extractFolderId(urlOrId: string): string {
  if (!urlOrId) return '';
  const match = urlOrId.match(/folders\/([a-zA-Z0-9-_]+)/);
  return match ? match[1] : urlOrId;
}

/**
 * Récupère les assets d'un projet stockés dans un dossier Google Drive
 */
export async function getProjectAssetsFromDrive(folderUrlOrId: string): Promise<DriveAssets> {
  const folderId = extractFolderId(folderUrlOrId);
  if (!folderId) return { images: [], youtubeUrl: null };

  try {
    // 1. Lister les fichiers non supprimés du dossier
    const response = await drive.files.list({
      q: `'${folderId}' in parents and trashed = false`,
      fields: 'files(id, name, mimeType)',
    });

    const files = response.data.files || [];
    const images: string[] = [];
    let youtubeUrl: string | null = null;

    // Trier par nom pour garder l'ordre alphabétique des fichiers de Gabin
    files.sort((a, b) => (a.name || '').localeCompare(b.name || ''));

    for (const file of files) {
      if (!file.id) continue;

      // Si c'est une image, on génère son lien de rendu direct haute qualité
      if (file.mimeType?.startsWith('image/')) {
        // ✅ CORRIGÉ : Remplacement du "3{" par "${" et utilisation du lien d'affichage direct Drive
        images.push(`https://docs.google.com/uc?export=view&id=${file.id}`);
      }

      // Si c'est le fichier texte contenant le lien de la vidéo YouTube
      if (file.name === 'youtube.txt') {
        try {
          const fileContent = await drive.files.get({
            fileId: file.id,
            alt: 'media',
          });
          
          const rawData = fileContent.data as any;
          
          if (typeof rawData === 'string') {
            youtubeUrl = rawData.trim();
          }
        } catch (e) {
          console.error("Impossible de lire le fichier youtube.txt", e);
        }
      }
    }

    return { images, youtubeUrl };
  } catch (error) {
    console.error('Erreur lors de la récupération Google Drive:', error);
    return { images: [], youtubeUrl: null };
  }
}