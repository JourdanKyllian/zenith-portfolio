// lib/googleDrive.ts
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
}

export function extractFolderId(urlOrId: string): string {
  if (!urlOrId) return '';
  const match = urlOrId.match(/folders\/([a-zA-Z0-9-_]+)/);
  return match ? match[1] : urlOrId;
}

export async function getProjectAssetsFromDrive(folderUrlOrId: string): Promise<DriveAssets> {
  const folderId = extractFolderId(folderUrlOrId);
  if (!folderId) return { images: [], youtubeUrl: null, pdf: null };

  try {
    const response = await drive.files.list({
      q: `'${folderId}' in parents and trashed = false`,
      fields: 'files(id, name, mimeType)',
    });

    const files = response.data.files || [];
    const images: string[] = [];
    let youtubeUrl: string | null = null;
    let pdf: DriveAssets['pdf'] = null;

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

      if (file.name === 'youtube.txt') {
        try {
          const fileContent = await drive.files.get({
            fileId: file.id,
            alt: 'media',
          });
          
          const rawData = fileContent.data as unknown;
          
          if (typeof rawData === 'string') {
            youtubeUrl = rawData.trim();
          }
        } catch (e) {
          console.error("Impossible de lire le fichier youtube.txt", e);
        }
      }
    }

    return { images, youtubeUrl, pdf };
  } catch (error) {
    console.error('Erreur lors de la récupération Google Drive:', error);
    return { images: [], youtubeUrl: null, pdf: null };
  }
}

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

    const pdfFile = files.find(f => f.mimeType === 'application/pdf');
    if (pdfFile?.id) {
      // Lien de téléchargement natif du PDF
      cvUrl = `https://docs.google.com/uc?export=view&id=${pdfFile.id}`;
      
      // ✨ CORRECTIF PRÉVIEW : Génération automatique de l'aperçu image directement depuis le PDF
      previewUrl = `https://drive.google.com/thumbnail?id=${pdfFile.id}&sz=w1200`;
    }

    return { cvUrl, previewUrl };
  } catch (error) {
    console.error('Erreur lors de la récupération des assets du CV Drive:', error);
    return { cvUrl: null, previewUrl: null };
  }
}