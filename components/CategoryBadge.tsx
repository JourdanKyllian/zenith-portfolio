import { CATEGORY_COLORS, type CategoryColorKey } from '@/config/colors';

interface CategoryBadgeProps {
  category: {
    name: string;
    color?: string; // Optionnel au cas où d'anciennes catégories n'ont pas encore de couleur définie
  };
}

export function CategoryBadge({ category }: CategoryBadgeProps) {
  // Si la couleur n'est pas définie ou n'existe pas dans notre dictionnaire, on utilise "blue" par défaut
  const colorKey = (category.color && category.color in CATEGORY_COLORS 
    ? category.color 
    : 'blue') as CategoryColorKey;
  
  const styles = CATEGORY_COLORS[colorKey];

  return (
    <span className={`inline-block px-2.5 py-1 text-[10px] font-bold tracking-widest uppercase rounded border transition-all duration-300 ${styles.bg} ${styles.text} ${styles.border}`}>
      {category.name}
    </span>
  );
}