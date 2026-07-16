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
  orange: {
    name: "Orange",
    bg: "bg-orange-500/10",
    text: "text-orange-400",
    border: "border-orange-500/20",
  },
  red: {
    name: "Rouge",
    bg: "bg-red-500/10",
    text: "text-red-400",
    border: "border-red-500/20",
  },
  gray: {
    name: "Gris",
    bg: "bg-slate-500/10",
    text: "text-slate-400",
    border: "border-slate-500/20",
  },
  brown: {
    name: "Marron",
    bg: "bg-[#4a2c11]/40",
    text: "text-[#dd9046]",
    border: "border-[#6a3e19]/40",
  },
  white: {
    name: "Blanc",
    bg: "bg-white/10",
    text: "text-white/90",
    border: "border-white/20",
  },
} as const;

export type CategoryColorKey = keyof typeof CATEGORY_COLORS;

/**
 * Résout le thème graphique d'un badge en fonction de la valeur de la base de données.
 * Gère le français, l'anglais, la casse ainsi que les valeurs NULL / EMPTY.
 */
export function getBadgeTheme(colorName: string | null | undefined) {
  if (!colorName || colorName === 'NULL' || colorName === 'EMPTY') {
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
  if (normalized === 'orange') return CATEGORY_COLORS.orange;
  if (normalized === 'rouge' || normalized === 'red') return CATEGORY_COLORS.red;
  if (normalized === 'gris' || normalized === 'gray' || normalized === 'grey' || normalized === 'slate') return CATEGORY_COLORS.gray;
  if (normalized === 'marron' || normalized === 'brown') return CATEGORY_COLORS.brown;
  if (normalized === 'blanc' || normalized === 'white') return CATEGORY_COLORS.white;

  // Repli par défaut
  return CATEGORY_COLORS.gray;
}