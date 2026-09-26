import { getCategoryStyle } from '@/config/colors';

interface CategoryBadgeProps {
  category?: {
    name: string;
    color?: string | null;
  } | null;
  className?: string;
}

/**
 * UI Component : Étiquette de catégorie (Badge) universelle.
 * Génère ses couleurs dynamiquement à partir d'un code Hexadécimal.
 */
export function CategoryBadge({ category, className }: CategoryBadgeProps) {
  if (!category) return null;
  
  const style = getCategoryStyle(category.color);
  const baseClasses = className || "px-2.5 py-1 text-[10px]";

  return (
    <span 
      style={style}
      className={`inline-block font-bold tracking-widest uppercase rounded border transition-all duration-300 ${baseClasses}`}
    >
      {category.name}
    </span>
  );
}
