/**
 * Dictionnaire de rétrocompatibilité pour traduire les anciennes couleurs
 * textuelles de la base de données vers de vrais codes hexadécimaux.
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
 * Normalise l'entrée base de données et génère les styles CSS (Couleur, Fond 10%, Bordure 20%).
 * Accepte les Hexadécimaux (#FF0000) et les anciens mots-clés ('blue').
 */
export function getCategoryStyle(colorValue: string | null | undefined) {
  let hex = '#8E8EA8'; // Gris "z-muted" par défaut

  if (colorValue && colorValue !== 'NULL' && colorValue !== 'EMPTY') {
    const normalized = colorValue.toLowerCase().trim();
    if (normalized.startsWith('#')) {
      hex = normalized;
    } else if (LEGACY_COLORS[normalized]) {
      hex = LEGACY_COLORS[normalized];
    }
  }

  // Transformation du format #XXX en #XXXXXX pour supporter l'opacité
  const cleanHex = hex.length === 4 
    ? `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}` 
    : hex;

  return {
    backgroundColor: `${cleanHex}1A`, // Hex + 10% opacité
    color: cleanHex,                  // Couleur pure
    borderColor: `${cleanHex}33`      // Hex + 20% opacité
  };
}
