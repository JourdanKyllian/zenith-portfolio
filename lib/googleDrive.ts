import { google } from 'googleapis';

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
  pdf: {
    id: string;
    name: string;
    previewUrl: string;
    thumbnailUrl: string;
  } | null;
  videoUrl: string | null;
}

/**
 * Extrait l'identifiant unique d'un dossier Google Drive à partir de son URL complète.
 * @param {string} urlOrId - L'URL complète ou l'ID direct.
 * @returns {string} L'ID du dossier.
 */
export function extractFolderId(urlOrId: string): string {
  if (!urlOrId) return '';
  const match = urlOrId.match(/folders\/([a-zA-Z0-9-_]+)/);
  return match ? match[1] : urlOrId;
}

/**
 * Interroge l'API Google Drive pour lister et classifier les assets liés à un projet.
 * Trie les fichiers trouvés (Images, Vidéos natives, PDF, liens YouTube textuels).
 *
 * @param {string} folderUrlOrId - L'URL ou l'ID du dossier Drive cible.
 * @returns {Promise<DriveAssets>} Un objet structuré contenant les URLs résolues des médias.
 */
export async function getProjectAssetsFromDrive(folderUrlOrId: string): Promise<DriveAssets> {
  const folderId = extractFolderId(folderUrlOrId);
  if (!folderId) return { images: [], youtubeUrl: null, pdf: null, videoUrl: null };

  try {
    const response = await drive.files.list({
      q: `'${folderId}' in parents and trashed = false`,
      fields: 'files(id, name, mimeType)',
    });

    const files = response.data.files || [];
    const images: string[] = [];
    let youtubeUrl: string | null = null;
    let pdf: DriveAssets['pdf'] = null;
    let videoUrl: string | null = null;

    files.sort((a, b) => (a.name || '').localeCompare(b.name || ''));

    for (const file of files) {
      if (!file.id) continue;

      if (file.mimeType?.startsWith('image/')) {
        images.push(`https://drive.google.com/thumbnail?id=${file.id}&sz=w1200`);
      }

      if (file.mimeType === 'application/pdf') {
        pdf = {
          id: file.id,
          name: file.name || 'Document PDF',
          previewUrl: `https://drive.google.com/file/d/${file.id}/preview`,
          thumbnailUrl: `https://drive.google.com/thumbnail?id=${file.id}&sz=w1200`
        };
      }

      if (file.mimeType?.startsWith('video/')) {
        videoUrl = `https://drive.google.com/file/d/${file.id}/preview`;
      }

      if (file.name === 'youtube.txt') {
        try {
          const fileContent = await drive.files.get({ fileId: file.id, alt: 'media' });
          const rawData = fileContent.data as unknown;
          if (typeof rawData === 'string') youtubeUrl = rawData.trim();
        } catch (e) {
          console.error("Échec de la lecture du fichier de configuration youtube.txt", e);
        }
      }
    }

    return { images, youtubeUrl, pdf, videoUrl };
  } catch (error) {
    console.error('Échec de la résolution des assets via Google Drive API:', error);
    return { images: [], youtubeUrl: null, pdf: null, videoUrl: null };
  }
}

/**
 * Récupère le lien de téléchargement direct et l'aperçu du Curriculum Vitae.
 *
 * @param {string} folderUrlOrId - L'URL ou l'ID du dossier contenant le CV.
 * @returns {Promise<{ cvUrl: string | null; previewUrl: string | null }>} Les liens d'accès au document.
 */
export async function getCvAssetsFromDrive(folderUrlOrId: string): Promise<{ cvUrl: string | null; previewUrl: string | null }> {
  const folderId = extractFolderId(folderUrlOrId);
  if (!folderId) return { cvUrl: null, previewUrl: null };

  try {
    const response = await drive.files.list({
      q: `'${folderId}' in parents and trashed = false`,
      fields: 'files(id, name, mimeType)',
    });

    const pdfFile = (response.data.files || []).find(f => f.mimeType === 'application/pdf');
    if (pdfFile?.id) {
      return {
        cvUrl: `https://docs.google.com/uc?export=view&id=${pdfFile.id}`,
        previewUrl: `https://drive.google.com/file/d/${pdfFile.id}/preview`
      };
    }

    return { cvUrl: null, previewUrl: null };
  } catch (error) {
    console.error('Échec de la récupération du CV via Google Drive API:', error);
    return { cvUrl: null, previewUrl: null };
  }
}