import { google } from 'googleapis'; //[cite: 2]

// Initialisation sécurisée du client Google Drive (côté serveur uniquement)[cite: 2]
const auth = new google.auth.JWT({
  email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL, //[cite: 2]
  key: process.env.GOOGLE_PRIVATE_KEY?.includes('-----BEGIN PRIVATE KEY-----') 
    ? process.env.GOOGLE_PRIVATE_KEY 
    : process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'), //[cite: 2]
  scopes: ['https://www.googleapis.com/auth/drive.readonly'] //[cite: 2]
});

const drive = google.drive({ version: 'v3', auth }); //[cite: 2]

// Interface des assets contenant le support du PDF[cite: 2]
export interface DriveAssets {
  images: string[]; //[cite: 2]
  youtubeUrl: string | null; //[cite: 2]
  pdf: {
    id: string; //[cite: 2]
    name: string; //[cite: 2]
    previewUrl: string; //[cite: 2]
    thumbnailUrl: string; //[cite: 2]
  } | null; //[cite: 2]
}

/**
 * Extrait l'ID d'un dossier Google Drive à partir d'une URL complète ou renvoie l'ID brut.[cite: 2]
 */
export function extractFolderId(urlOrId: string): string {
  if (!urlOrId) return ''; //[cite: 2]
  const match = urlOrId.match(/folders\/([a-zA-Z0-9-_]+)/); //[cite: 2]
  return match ? match[1] : urlOrId; //[cite: 2]
}

/**
 * Récupère les assets d'un projet stockés dans un dossier Google Drive[cite: 2]
 */
export async function getProjectAssetsFromDrive(folderUrlOrId: string): Promise<DriveAssets> {
  const folderId = extractFolderId(folderUrlOrId); //[cite: 2]
  if (!folderId) return { images: [], youtubeUrl: null, pdf: null }; //[cite: 2]

  try {
    const response = await drive.files.list({
      q: `'${folderId}' in parents and trashed = false`, //[cite: 2]
      fields: 'files(id, name, mimeType)', //[cite: 2]
    });

    const files = response.data.files || []; //[cite: 2]
    const images: string[] = []; //[cite: 2]
    let youtubeUrl: string | null = null; //[cite: 2]
    let pdf: DriveAssets['pdf'] = null; //[cite: 2]

    files.sort((a, b) => (a.name || '').localeCompare(b.name || '')); //[cite: 2]

    for (const file of files) {
      if (!file.id) continue; //[cite: 2]

      // Détection et formatage des images[cite: 2]
      if (file.mimeType?.startsWith('image/')) {
        images.push(`https://drive.google.com/thumbnail?id=${file.id}&sz=w1200`); //[cite: 2]
      }

      // Détection et formatage du PDF[cite: 2]
      if (file.mimeType === 'application/pdf') {
        pdf = {
          id: file.id, //[cite: 2]
          name: file.name || 'Document PDF', //[cite: 2]
          previewUrl: `https://drive.google.com/file/d/${file.id}/preview`, //[cite: 2]
          thumbnailUrl: `https://drive.google.com/thumbnail?id=${file.id}&sz=w1200` //[cite: 2]
        };
      }

      // Traitement du fichier youtube.txt[cite: 2]
      if (file.name === 'youtube.txt') {
        try {
          const fileContent = await drive.files.get({
            fileId: file.id, //[cite: 2]
            alt: 'media', //[cite: 2]
          });
          
          const rawData = fileContent.data as any; //[cite: 2]
          
          if (typeof rawData === 'string') {
            youtubeUrl = rawData.trim(); //[cite: 2]
          }
        } catch (e) {
          console.error("Impossible de lire le fichier youtube.txt", e); //[cite: 2]
        }
      }
    }

    return { images, youtubeUrl, pdf }; //[cite: 2]
  } catch (error) {
    console.error('Erreur lors de la récupération Google Drive:', error); //[cite: 2]
    return { images: [], youtubeUrl: null, pdf: null }; //[cite: 2]
  }
}

/**
 * Récupère le PDF ET l'Image d'aperçu du dossier de CV Drive[cite: 2]
 */
export async function getCvAssetsFromDrive(folderUrlOrId: string): Promise<{ cvUrl: string | null; previewUrl: string | null }> {
  const folderId = extractFolderId(folderUrlOrId); //[cite: 2]
  if (!folderId) return { cvUrl: null, previewUrl: null }; //[cite: 2]

  try {
    const response = await drive.files.list({
      q: `'${folderId}' in parents and trashed = false`, //[cite: 2]
      fields: 'files(id, name, mimeType)', //[cite: 2]
    });

    const files = response.data.files || []; //[cite: 2]
    let cvUrl: string | null = null; //[cite: 2]
    let previewUrl: string | null = null; //[cite: 2]

    // Trouve le premier fichier PDF disponible[cite: 2]
    const pdfFile = files.find(f => f.mimeType === 'application/pdf'); //[cite: 2]
    if (pdfFile?.id) {
      cvUrl = `https://docs.google.com/uc?export=view&id=${pdfFile.id}`; //[cite: 2]
    }

    // Trouve la première image disponible (Aperçu du CV)[cite: 2]
    const imgFile = files.find(f => f.mimeType?.startsWith('image/')); //[cite: 2]
    if (imgFile?.id) {
      previewUrl = `https://drive.google.com/thumbnail?id=${imgFile.id}&sz=w1600`; //[cite: 2]
    }

    return { cvUrl, previewUrl }; //[cite: 2]
  } catch (error) {
    console.error('Erreur lors de la récupération des assets du CV Drive:', error); //[cite: 2]
    return { cvUrl: null, previewUrl: null }; //[cite: 2]
  }
}