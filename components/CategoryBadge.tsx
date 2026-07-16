// components/CategoryBadge.tsx
import { getBadgeTheme } from '@/config/colors';

interface CategoryBadgeProps {
  category: {
    name: string;
    color?: string;
  };
}

export function CategoryBadge({ category }: CategoryBadgeProps) {
  const styles = getBadgeTheme(category.color);

  return (
    <span className={`inline-block px-2.5 py-1 text-[10px] font-bold tracking-widest uppercase rounded border transition-all duration-300 ${styles.bg} ${styles.text} ${styles.border}`}>
      {category.name}
    </span>
  );
}