// config/colors.ts
export const CATEGORY_COLORS = {
  blue: {
    name: "Bleu",
    bg: "bg-blue-500/10",
    text: "text-blue-400",
    border: "border-blue-500/20",
  },
  pink: {
    name: "Rose",
    bg: "bg-pink-500/10",
    text: "text-pink-400",
    border: "border-pink-500/20",
  },
  purple: {
    name: "Violet",
    bg: "bg-purple-500/10",
    text: "text-purple-400",
    border: "border-purple-500/20",
  },
  green: {
    name: "Vert",
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    border: "border-emerald-500/20",
  },
  yellow: {
    name: "Jaune",
    bg: "bg-amber-500/10",
    text: "text-amber-400",
    border: "border-amber-500/20",
  },
} as const;

export type CategoryColorKey = keyof typeof CATEGORY_COLORS;

/**
 * Résout le thème graphique d'un badge en fonction de la valeur de la base de données.
 * Gère le français, l'anglais, la casse ainsi que les valeurs NULL / EMPTY.
 */
export function getBadgeTheme(colorName: string | null | undefined) {
  if (!colorName || colorName === 'NULL' || colorName === 'EMPTY') {
    // Style basique neutre si aucune couleur n'est spécifiée
    return {
      bg: "bg-z-card/50",
      text: "text-z-muted",
      border: "border-z-border"
    };
  }

  const normalized = colorName.toLowerCase().trim();

  if (normalized === 'bleu' || normalized === 'blue') return CATEGORY_COLORS.blue;
  if (normalized === 'rose' || normalized === 'pink') return CATEGORY_COLORS.pink;
  if (normalized === 'violet' || normalized === 'purple') return CATEGORY_COLORS.purple;
  if (normalized === 'vert' || normalized === 'green') return CATEGORY_COLORS.green;
  if (normalized === 'jaune' || normalized === 'yellow') return CATEGORY_COLORS.yellow;

  // Repli par défaut sur le bleu de la charte en cas de valeur exotique
  return CATEGORY_COLORS.blue;
}