import { cn } from '@/lib/utils'
import { projectCategories } from '@/data/projects'

interface ProjectFiltersProps {
  active: string
  onChange: (category: string) => void
}

export function ProjectFilters({ active, onChange }: ProjectFiltersProps) {
  return (
    <div className="flex flex-wrap justify-center gap-2 mb-12">
      {projectCategories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onChange(cat.id)}
          className={cn(
            'rounded-full px-4 py-2 text-sm font-medium transition-all duration-300',
            active === cat.id
              ? 'bg-primary text-background shadow-lg shadow-primary/20'
              : 'border border-white/10 text-text-secondary hover:border-primary/30 hover:text-text-primary'
          )}
        >
          {cat.label}
        </button>
      ))}
    </div>
  )
}
