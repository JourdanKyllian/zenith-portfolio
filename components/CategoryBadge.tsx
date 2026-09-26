import { getCategoryStyle } from '@/config/colors';

interface CategoryBadgeProps {
  category?: {
    name: string;
    color?: string | null;
  } | null;
  className?: string;
}

/**
 * Étiquette visuelle (Badge) représentant une catégorie de projet.
 * Génère dynamiquement ses couleurs (fond, bordure, texte) à partir du code hexadécimal associé.
 *
 * @param {CategoryBadgeProps} props - Les propriétés du composant.
 * @param {Object} [props.category] - L'objet catégorie contenant le nom et la couleur.
 * @param {string} [props.className] - Classes CSS additionnelles pour surcharger le style par défaut.
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
