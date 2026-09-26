/**
 * Table de correspondance de rétrocompatibilité.
 * Mappe les identifiants textuels historiques de la base de données vers leurs équivalents hexadécimaux stricts.
 * 
 * @constant
 * @type {Record<string, string>}
 */
export const LEGACY_COLORS: Record<string, string> = {
  blue: '#3b82f6', bleu: '#3b82f6',
  pink: '#ec4899', rose: '#ec4899',
  purple: '#a855f7', violet: '#a855f7',
  green: '#10b981', vert: '#10b981',
  yellow: '#f59e0b', jaune: '#f59e0b',
  orange: '#f97316',
  red: '#ef4444', rouge: '#ef4444',
  gray: '#8E8EA8', gris: '#8E8EA8', slate: '#8E8EA8',
  brown: '#8b4513', marron: '#8b4513',
  white: '#E8E8F8', blanc: '#E8E8F8'
};

/**
 * Normalise un code couleur entrant et génère une palette de styles CSS liés (Couleur pleine, fond translucide, bordure).
 * Gère nativement les codes hexadécimaux (3 ou 6 caractères), les opacités, et le fallback sur les anciennes valeurs textuelles.
 *
 * @param {string | null | undefined} colorValue - La valeur brute de la couleur stockée en base de données.
 * @returns {{ backgroundColor: string, color: string, borderColor: string }} Objet de style React contenant les valeurs CSS traitées.
 */
export function getCategoryStyle(colorValue: string | null | undefined) {
  let hex = '#8E8EA8';

  if (colorValue && colorValue !== 'NULL' && colorValue !== 'EMPTY') {
    const normalized = colorValue.toLowerCase().trim();
    if (normalized.startsWith('#')) {
      hex = normalized;
    } else if (LEGACY_COLORS[normalized]) {
      hex = LEGACY_COLORS[normalized];
    }
  }

  const cleanHex = hex.length === 4 
    ? `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}` 
    : hex;

  return {
    backgroundColor: `${cleanHex}1A`,
    color: cleanHex,                 
    borderColor: `${cleanHex}33`     
  };
}
