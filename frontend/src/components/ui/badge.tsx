import { type HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'secondary' | 'outline'
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors',
        variant === 'default' && 'bg-primary/20 text-primary border border-primary/30',
        variant === 'secondary' && 'bg-secondary/20 text-secondary border border-secondary/30',
        variant === 'outline' && 'border border-white/10 text-text-secondary',
        className
      )}
      {...props}
    />
  )
}
