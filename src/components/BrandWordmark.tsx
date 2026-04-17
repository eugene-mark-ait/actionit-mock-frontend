import { cn } from '@/lib/cn'

/** Colored actionit.ai logotype — use with `font-navbar-mark` or heading classes on the wrapper. */
export function BrandWordmark({ className }: { className?: string }) {
  return (
    <span className={cn(className)}>
      <span className="text-brand-wordmark">actionit</span>
      <span className="text-brand-cyan">.ai</span>
    </span>
  )
}
