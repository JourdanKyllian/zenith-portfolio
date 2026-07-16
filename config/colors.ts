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

// Type de sécurité pour TypeScript
export type CategoryColorKey = keyof typeof CATEGORY_COLORS;