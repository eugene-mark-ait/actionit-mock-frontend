'use client'

import { useState } from 'react'
import { Sparkles } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '@/components/ui/dialog'
import { PlanSelectionView } from '@/components/plan/PlanSelectionView'
import { cn } from '@/lib/utils'

/**
 * Dashboard rail entry for plan upgrades. Tooltip label when the rail is collapsed is provided
 * by the parent `Tooltip` in `DashboardSidebar` (same pattern as Language / Settings).
 */
export function UpgradePlanDialog({
  triggerClassName,
  isExpanded = true,
}: {
  triggerClassName: string
  isExpanded?: boolean
}) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className={cn('group min-w-0 w-full', triggerClassName)}
          aria-label="Upgrade plan"
        >
          <Sparkles
            className="h-5 w-5 shrink-0 text-slate-600 transition-colors group-hover:text-[#0099cb]"
            strokeWidth={2}
            aria-hidden
          />
          {isExpanded && (
            <span className="min-w-0 flex-1 truncate text-left text-sm font-medium text-foreground">
              Upgrade plan
            </span>
          )}
        </button>
      </DialogTrigger>
      <DialogContent className="flex max-h-[min(92vh,920px)] w-[calc(100vw-1.25rem)] max-w-6xl flex-col overflow-hidden border-[#0099cb]/20 bg-card p-0 sm:w-full sm:max-w-6xl">
        <div className="overflow-y-auto px-4 py-6 sm:px-8 sm:py-8">
          <DialogHeader className="space-y-1 text-center sm:text-center">
          </DialogHeader>
          <PlanSelectionView mode="upgrade" onDone={() => setOpen(false)} className="mx-auto max-w-5xl px-0 pt-4" />
        </div>
      </DialogContent>
    </Dialog>
  )
}
