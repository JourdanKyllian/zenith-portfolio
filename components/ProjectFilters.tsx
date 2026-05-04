'use client';

interface Category {
  id: string | number;
  name: string;
  slug: string;
}

interface FiltersProps {
  categories: Category[];
  activeFilter: string;
  onFilterChange: (slug: string) => void;
}

export default function ProjectFilters({ categories, activeFilter, onFilterChange }: FiltersProps) {
  return (
    <nav className="flex flex-wrap gap-3 border-b border-z-blue/10 pb-8">
      <button
        onClick={() => onFilterChange('all')}
        className={`px-6 py-2.5 rounded-full font-sub text-[10px] font-bold uppercase tracking-widest transition-all duration-300 ${
          activeFilter === 'all' 
          ? 'bg-z-blue text-white shadow-lg shadow-z-blue/40 scale-105' 
          : 'bg-z-card text-z-muted border border-z-border hover:border-z-blue/30'
        }`}
      >
        Tous
      </button>

      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onFilterChange(cat.slug)}
          className={`px-6 py-2.5 rounded-full font-sub text-[10px] font-bold uppercase tracking-widest transition-all duration-300 ${
            activeFilter === cat.slug 
            ? 'bg-z-blue text-white shadow-lg shadow-z-blue/40 scale-105' 
            : 'bg-z-card text-z-muted border border-z-border hover:border-z-blue/30'
          }`}
        >
          {cat.name}
        </button>
      ))}
    </nav>
  );
}