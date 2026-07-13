import { google } from 'googleapis';

// Initialisation sécurisée du client Google Drive (côté serveur uniquement)
const auth = new google.auth.JWT({
  email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  key: process.env.GOOGLE_PRIVATE_KEY?.includes('-----BEGIN PRIVATE KEY-----') 
    ? process.env.GOOGLE_PRIVATE_KEY 
    : process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
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
    const response = await drive.files.list({
      q: `'${folderId}' in parents and trashed = false`,
      fields: 'files(id, name, mimeType)',
    });

    const files = response.data.files || [];
    const images: string[] = [];
    let youtubeUrl: string | null = null;

    files.sort((a, b) => (a.name || '').localeCompare(b.name || ''));

    for (const file of files) {
      if (!file.id) continue;

      if (file.mimeType?.startsWith('image/')) {
        // MAJ : Utilisation du lien thumbnail haute résolution (Largeur 1200px) pour éviter les blocages
        images.push(`https://drive.google.com/thumbnail?id=${file.id}&sz=w1200`);
      }

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

/**
 * Récupère le PDF ET l'Image d'aperçu du dossier de CV Drive
 */
export async function getCvAssetsFromDrive(folderUrlOrId: string): Promise<{ cvUrl: string | null; previewUrl: string | null }> {
  const folderId = extractFolderId(folderUrlOrId);
  if (!folderId) return { cvUrl: null, previewUrl: null };

  try {
    const response = await drive.files.list({
      q: `'${folderId}' in parents and trashed = false`,
      fields: 'files(id, name, mimeType)',
    });

    const files = response.data.files || [];
    let cvUrl: string | null = null;
    let previewUrl: string | null = null;

    // Trouve le premier fichier PDF disponible
    const pdfFile = files.find(f => f.mimeType === 'application/pdf');
    if (pdfFile?.id) {
      cvUrl = `https://docs.google.com/uc?export=view&id=${pdfFile.id}`;
    }

    // Trouve la première image disponible (Aperçu du CV)
    const imgFile = files.find(f => f.mimeType?.startsWith('image/'));
    if (imgFile?.id) {
      // MAJ : Utilisation du lien thumbnail très haute résolution (Largeur 1600px) pour garantir la lisibilité du texte
      previewUrl = `https://drive.google.com/thumbnail?id=${imgFile.id}&sz=w1600`;
    }

    return { cvUrl, previewUrl };
  } catch (error) {
    console.error('Erreur lors de la récupération des assets du CV Drive:', error);
    return { cvUrl: null, previewUrl: null };
  }
}