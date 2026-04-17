'use client'

import React, { useState, useEffect } from 'react'
import { Globe, Settings, LogOut, ChevronLeft, ChevronRight, Menu, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { cn } from '@/lib/utils'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { SUPPORTED_LANGUAGES, getLanguageName } from '@/lib/languages'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

const RAIL_COLLAPSED = 72
const RAIL_EXPANDED = 260

/** Site card chrome (globals: surface, border, sign-in style shadow). */
const SITE_CARD_SHADOW = 'shadow-[0_25px_50px_-12px_rgb(15_23_42/0.12)]'
const SITE_POPOVER_SHELL = cn(
  'overflow-hidden rounded-2xl border border-[#0099cb]/25 bg-card text-card-foreground',
  SITE_CARD_SHADOW,
)

/** Extra gap between rail and floating panels so popovers clear the navbar edge. */
const POPOVER_SIDE_OFFSET = 22
const POPOVER_COLLISION_PADDING = 20

/** No enter/exit motion for rail tooltips and popovers (dashboard “navbar”). */
const RAIL_OVERLAY_NO_MOTION =
  'animate-none data-[state=closed]:animate-none data-[state=open]:animate-none data-[state=delayed-open]:animate-none data-[state=instant-open]:animate-none'

/** Desktop rail header — matches dashboard card / hero polish */
const RAIL_HEADER_SHELL =
  'rounded-xl border border-[#0099cb]/12 bg-gradient-to-br from-white to-[#0099cb]/[0.05] shadow-[0_4px_20px_-10px_rgba(0,153,203,0.12)]'

/** Inset panel for primary nav actions — aligns icons and labels on one grid */
const RAIL_NAV_GROUP =
  'mx-1.5 rounded-2xl border border-[#0099cb]/10 bg-gradient-to-b from-slate-50/95 via-white/90 to-slate-50/80 p-1 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.85)]'

/** Footer cluster — account actions visually separated from workspace controls */
const RAIL_FOOTER_GROUP =
  'mx-1.5 rounded-2xl border border-[#0099cb]/10 bg-gradient-to-b from-white to-slate-50/90 p-1 shadow-[0_1px_0_0_rgba(255,255,255,0.9)_inset,0_8px_24px_-12px_rgba(15,23,42,0.08)]'

/** Width of the fixed left rail — keep in sync with `Dashboard` main column (lg+ only). */
export function getDashboardMainMarginLeft(expanded: boolean): number {
  return expanded ? RAIL_EXPANDED : RAIL_COLLAPSED
}

export interface DashboardSidebarProps {
  transcriptionLanguage: string
  onTranscriptionLanguageChange: (code: string) => void
  isAgentEnabled: boolean
  onAgentToggle: (enabled: boolean) => void
  isCalendarUpdateEnabled: boolean
  onCalendarUpdateToggle: (enabled: boolean) => void
  analysisDepth: 'light' | 'standard' | 'deep'
  onAnalysisDepthChange: (depth: 'light' | 'standard' | 'deep') => void
  onExpansionChange?: (expanded: boolean) => void
}

function SidebarLogoImage({ className }: { className?: string }) {
  return (
    <img src="/ehanced_logo.png" alt="" className={cn('h-9 w-9 object-contain', className)} />
  )
}

function ThemePopoverChrome({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className={SITE_POPOVER_SHELL}>
      <div className="border-b border-[#0099cb]/15 bg-gradient-to-r from-muted/50 via-white/60 to-[#0099cb]/[0.04] px-4 py-3.5">
        <h3 className="bg-gradient-to-r from-[#0099cb] to-[#00c6f3] bg-clip-text font-sans text-sm font-semibold leading-snug tracking-tight text-transparent">
          {title}
        </h3>
        <p className="mt-1 font-sans text-[11px] font-medium uppercase tracking-[0.06em] text-muted-foreground">
          actionit.ai
        </p>
      </div>
      <div className="bg-card">{children}</div>
    </div>
  )
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  transcriptionLanguage,
  onTranscriptionLanguageChange,
  isAgentEnabled,
  onAgentToggle,
  isCalendarUpdateEnabled,
  onCalendarUpdateToggle,
  analysisDepth,
  onAnalysisDepthChange,
  onExpansionChange,
}) => {
  const { logout } = useAuth()
  const router = useRouter()

  const [isExpanded, setIsExpanded] = useState(() => {
    if (typeof window === 'undefined') return true
    try {
      return localStorage.getItem('dashboard_sidebar_expanded') !== 'false'
    } catch {
      return true
    }
  })
  const [isLanguageOpen, setIsLanguageOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    onExpansionChange?.(isExpanded)
    try {
      localStorage.setItem('dashboard_sidebar_expanded', String(isExpanded))
    } catch {
      /* ignore */
    }
  }, [isExpanded, onExpansionChange])

  useEffect(() => {
    if (!mobileOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [mobileOpen])

  const closeMobile = () => setMobileOpen(false)

  const toggleSidebar = () => setIsExpanded((v) => !v)

  const navBtn = (className?: string) =>
    cn(
      'group relative flex w-full items-center rounded-xl py-2.5 text-left outline-none transition-none hover:bg-slate-100',
      isExpanded ? 'gap-3 px-3' : 'justify-center px-2',
      className,
    )

  const languageList = (afterPick?: () => void) => (
    <div className="max-h-[min(60vh,320px)] space-y-0.5 overflow-y-auto p-2 font-sans">
      {SUPPORTED_LANGUAGES.map((lang) => (
        <button
          key={lang.code}
          type="button"
          onClick={() => {
            onTranscriptionLanguageChange(lang.code)
            setIsLanguageOpen(false)
            afterPick?.()
          }}
          className={cn(
            'flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm transition-none',
            transcriptionLanguage === lang.code
              ? 'bg-gradient-to-r from-[#0099cb]/12 to-[#00c6f3]/12 font-semibold text-foreground'
              : 'text-foreground/90 hover:bg-muted',
          )}
        >
          <span className="w-5 shrink-0 text-center font-medium text-[#0099cb]">
            {transcriptionLanguage === lang.code ? '✓' : ''}
          </span>
          <span
            className={
              transcriptionLanguage === lang.code
                ? 'bg-gradient-to-r from-[#0099cb] to-[#00c6f3] bg-clip-text text-transparent'
                : undefined
            }
          >
            {getLanguageName(lang.code)}
          </span>
        </button>
      ))}
    </div>
  )

  const agentSettings = (variant: 'drawer' | 'popover') => {
    const sid = variant === 'drawer' ? 'm' : 'p'
    return (
      <div className={cn('space-y-5 font-sans', variant === 'drawer' ? 'p-4' : 'p-5')}>
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <Label htmlFor={`${sid}-auto-join`} className="text-sm font-medium text-foreground">
              Auto-join meetings
            </Label>
            <p className="mt-1 text-xs leading-snug text-muted-foreground">
              Join calendar meetings automatically when they start
            </p>
          </div>
          <Switch
            id={`${sid}-auto-join`}
            checked={isAgentEnabled}
            onCheckedChange={onAgentToggle}
            className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-[#0099cb] data-[state=checked]:to-[#00c6f3]"
          />
        </div>
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <Label htmlFor={`${sid}-calendar`} className="text-sm font-medium text-foreground">
              Calendar updates
            </Label>
            <p className="mt-1 text-xs leading-snug text-muted-foreground">
              Post analyses to your calendar events
            </p>
          </div>
          <Switch
            id={`${sid}-calendar`}
            checked={isCalendarUpdateEnabled}
            onCheckedChange={onCalendarUpdateToggle}
            className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-[#0099cb] data-[state=checked]:to-[#00c6f3]"
          />
        </div>
        <div>
          <Label htmlFor={`${sid}-depth`} className="mb-2 block text-sm font-medium text-foreground">
            Analysis depth
          </Label>
          <Select value={analysisDepth} onValueChange={onAnalysisDepthChange}>
            <SelectTrigger
              id={`${sid}-depth`}
              className={cn(
                'h-11 w-full rounded-xl border-[#0099cb]/25 bg-background font-sans text-foreground transition-none',
                'hover:border-[#0099cb]/35 focus:border-[#0099cb]/45 focus:ring-2 focus:ring-[#0099cb]/20 focus:ring-offset-0',
                '[&>span]:text-foreground',
              )}
            >
              <SelectValue placeholder="Select depth" />
            </SelectTrigger>
            <SelectContent
              position="popper"
              className={cn(
                'z-[100] rounded-xl border border-[#0099cb]/22 bg-card p-1 font-sans text-card-foreground',
                SITE_CARD_SHADOW,
              )}
            >
              <SelectItem
                value="light"
                className="rounded-lg py-2.5 focus:bg-muted data-[highlighted]:bg-gradient-to-r data-[highlighted]:from-[#0099cb]/10 data-[highlighted]:to-[#00c6f3]/10 data-[highlighted]:text-foreground"
              >
                Light
              </SelectItem>
              <SelectItem
                value="standard"
                className="rounded-lg py-2.5 focus:bg-muted data-[highlighted]:bg-gradient-to-r data-[highlighted]:from-[#0099cb]/10 data-[highlighted]:to-[#00c6f3]/10 data-[highlighted]:text-foreground"
              >
                Standard
              </SelectItem>
              <SelectItem
                value="deep"
                className="rounded-lg py-2.5 focus:bg-muted data-[highlighted]:bg-gradient-to-r data-[highlighted]:from-[#0099cb]/10 data-[highlighted]:to-[#00c6f3]/10 data-[highlighted]:text-foreground"
              >
                Deep
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    )
  }

  return (
    <TooltipProvider delayDuration={300}>
      {/* Mobile / tablet: top bar */}
      <header
        className={cn(
          'lg:hidden sticky top-0 z-[60] flex h-[3.75rem] shrink-0 items-stretch',
          'border-b border-[#0099cb]/10 bg-gradient-to-b from-card/98 via-card/95 to-[#0099cb]/[0.04] px-3 py-2 font-sans shadow-[0_1px_0_0_rgba(255,255,255,0.65)_inset,0_8px_30px_-18px_rgba(0,153,203,0.18)] backdrop-blur-md',
        )}
      >
        <div className={cn(RAIL_HEADER_SHELL, 'flex w-full min-w-0 items-center gap-2.5 p-1.5')}>
          <button
            type="button"
            onClick={() => {
              router.push('/dashboard')
              closeMobile()
            }}
            className="flex min-h-10 min-w-0 flex-1 items-center gap-2.5 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-white/85 active:bg-white/70"
          >
            <SidebarLogoImage className="h-8 w-8 shrink-0" />
            <span className="min-w-0 truncate bg-gradient-to-r from-[#0099cb] to-[#00c6f3] bg-clip-text text-[0.9375rem] font-semibold leading-tight tracking-tight text-transparent">
              actionit.ai
            </span>
          </button>
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#0099cb]/20 bg-white/95 text-slate-700 shadow-sm ring-1 ring-black/[0.03] transition-colors hover:border-[#0099cb]/40 hover:bg-white hover:text-[#0099cb] active:scale-[0.98]"
            aria-label="Open menu"
          >
            <Menu className="h-[1.125rem] w-[1.125rem]" strokeWidth={2.25} aria-hidden />
          </button>
        </div>
      </header>

      {/* Mobile drawer overlay */}
      <button
        type="button"
        aria-label="Close menu"
        aria-hidden={!mobileOpen}
        tabIndex={mobileOpen ? 0 : -1}
        className={cn(
          'lg:hidden fixed inset-0 z-[70] bg-slate-900/40 backdrop-blur-[2px] transition-opacity duration-300',
          mobileOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={closeMobile}
      />

      {/* Mobile drawer panel */}
      <div
        className={cn(
          'lg:hidden fixed inset-y-0 left-0 z-[75] flex w-[min(20rem,92vw)] max-w-full flex-col border-r border-border bg-card font-sans shadow-2xl transition-transform duration-300 ease-out',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex h-full min-h-0 flex-col bg-gradient-to-b from-white to-slate-50/90">
          <div className="flex items-center justify-between gap-3 border-b border-slate-200/80 bg-gradient-to-r from-white via-slate-50/40 to-white px-4 py-3.5">
            <div className="flex min-w-0 flex-1 items-center gap-2.5">
              <SidebarLogoImage className="h-9 w-9 shrink-0" />
              <div className="min-w-0">
                <p className="truncate bg-gradient-to-r from-[#0099cb] to-[#00c6f3] bg-clip-text text-sm font-semibold tracking-tight text-transparent">
                  Menu
                </p>
                <p className="truncate text-[11px] font-medium text-muted-foreground">Workspace & preferences</p>
              </div>
            </div>
            <button
              type="button"
              onClick={closeMobile}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200/90 bg-white text-slate-600 shadow-sm transition-colors hover:border-[#0099cb]/35 hover:bg-slate-50 hover:text-foreground"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" aria-hidden />
            </button>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto">
            <div className="border-b border-border px-4 py-4">
              <Label
                htmlFor="mobile-drawer-transcription-lang"
                className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground"
              >
                Transcription language
              </Label>
              <Select
                value={transcriptionLanguage}
                onValueChange={(code) => {
                  onTranscriptionLanguageChange(code)
                  closeMobile()
                }}
              >
                <SelectTrigger
                  id="mobile-drawer-transcription-lang"
                  className={cn(
                    'mt-2 h-11 w-full rounded-xl border-[#0099cb]/25 bg-background font-sans text-foreground transition-none',
                    'hover:border-[#0099cb]/35 focus:border-[#0099cb]/45 focus:ring-2 focus:ring-[#0099cb]/20 focus:ring-offset-0',
                    '[&>span]:text-foreground',
                  )}
                >
                  <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent
                  position="popper"
                  className={cn(
                    'z-[100] max-h-[min(70vh,320px)] rounded-xl border border-[#0099cb]/22 bg-card p-1 font-sans text-card-foreground',
                    SITE_CARD_SHADOW,
                  )}
                >
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <SelectItem
                      key={lang.code}
                      value={lang.code}
                      className="rounded-lg py-2.5 focus:bg-muted data-[highlighted]:bg-gradient-to-r data-[highlighted]:from-[#0099cb]/10 data-[highlighted]:to-[#00c6f3]/10 data-[highlighted]:text-foreground"
                    >
                      {getLanguageName(lang.code)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="border-b border-slate-100">
              <div className="border-b border-slate-100/90 bg-gradient-to-r from-[#0099cb]/[0.07] via-[#00c6f3]/[0.05] to-transparent px-4 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-600">AI meeting agent</p>
                <p className="mt-0.5 text-xs text-muted-foreground">Auto-join, calendar, and analysis</p>
              </div>
              {agentSettings('drawer')}
            </div>
            <div className="p-4">
              <button
                type="button"
                onClick={() => {
                  closeMobile()
                  logout()
                }}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50/80 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-100"
              >
                <LogOut className="h-4 w-4" />
                Log out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop / large tablet: collapsible rail */}
      <aside
        className={cn(
          'hidden lg:flex fixed inset-y-0 left-0 z-[60] h-screen min-h-0 flex-col overflow-hidden font-sans',
          'border-r border-[#0099cb]/22 bg-gradient-to-b from-card via-card to-slate-50/40 text-card-foreground shadow-[4px_0_24px_-16px_rgba(15,23,42,0.12)]',
          'transition-[width] duration-300 ease-out',
          isExpanded ? 'w-[260px]' : 'w-[72px]',
        )}
        aria-label="Dashboard navigation"
      >
        <div className="flex h-full min-h-0 flex-col">
          <div className="shrink-0 border-b border-[#0099cb]/12 bg-gradient-to-b from-card to-[#0099cb]/[0.025] px-2.5 pb-3 pt-3">
            {isExpanded ? (
              <div className={cn(RAIL_HEADER_SHELL, 'p-1.5')}>
                <div className="flex min-h-10 items-center gap-2">
                  <button
                    type="button"
                    onClick={() => router.push('/dashboard')}
                    className="flex min-w-0 flex-1 items-center gap-2.5 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-white/85 active:bg-white/70"
                    aria-label="Dashboard home"
                  >
                    <SidebarLogoImage className="shrink-0" />
                    <span className="min-w-0 truncate bg-gradient-to-r from-[#0099cb] to-[#00c6f3] bg-clip-text text-[0.9375rem] font-semibold leading-tight tracking-tight text-transparent">
                      actionit.ai
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={toggleSidebar}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#0099cb]/20 bg-white/95 text-slate-600 shadow-sm ring-1 ring-black/[0.03] transition-colors hover:border-[#0099cb]/40 hover:bg-white hover:text-[#0099cb]"
                    aria-label="Collapse sidebar"
                  >
                    <ChevronLeft className="h-4 w-4" aria-hidden />
                  </button>
                </div>
              </div>
            ) : (
              <div className={cn(RAIL_HEADER_SHELL, 'p-1')}>
                <div className="flex h-10 w-full min-w-0 overflow-hidden rounded-xl border border-[#0099cb]/16 bg-white/95 shadow-sm ring-1 ring-black/[0.03]">
                  <button
                    type="button"
                    onClick={() => router.push('/dashboard')}
                    className="flex min-h-10 min-w-0 flex-1 items-center justify-center rounded-l-[0.65rem] transition-colors hover:bg-[#0099cb]/[0.08]"
                    aria-label="Dashboard home"
                  >
                    <SidebarLogoImage className="h-6 w-6" />
                  </button>
                  <button
                    type="button"
                    onClick={toggleSidebar}
                    className="flex w-10 shrink-0 items-center justify-center border-l border-[#0099cb]/12 bg-white/95 text-slate-600 transition-colors hover:bg-[#0099cb]/[0.08] hover:text-[#0099cb]"
                    aria-label="Expand sidebar"
                  >
                    <ChevronRight className="h-4 w-4" aria-hidden />
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="flex min-h-0 flex-1 flex-col overflow-y-auto overflow-x-hidden px-2 pb-3 pt-3">
            {isExpanded && (
              <p className="mb-2 px-2.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                Workspace
              </p>
            )}
            <div className={cn(RAIL_NAV_GROUP, 'space-y-0.5')}>
            <Popover open={isLanguageOpen} onOpenChange={setIsLanguageOpen}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        className={navBtn()}
                        aria-label="Transcription language"
                      >
                        <Globe className="h-5 w-5 shrink-0 text-slate-600 transition-colors group-hover:text-[#0099cb]" />
                        {isExpanded && (
                          <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">Language</span>
                        )}
                      </button>
                    </PopoverTrigger>
                  </div>
                </TooltipTrigger>
                {!isExpanded && (
                  <TooltipContent side="right" className={cn('max-w-xs', RAIL_OVERLAY_NO_MOTION)}>
                    Transcription language
                  </TooltipContent>
                )}
              </Tooltip>
              <PopoverContent
                align="start"
                side="right"
                sideOffset={POPOVER_SIDE_OFFSET}
                collisionPadding={POPOVER_COLLISION_PADDING}
                className={cn(
                  'w-[min(calc(100vw-6rem),17.5rem)] border-0 bg-transparent p-0 shadow-none',
                  RAIL_OVERLAY_NO_MOTION,
                )}
              >
                <ThemePopoverChrome title="Transcription language">{languageList()}</ThemePopoverChrome>
              </PopoverContent>
            </Popover>

            <Popover open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        className={navBtn()}
                        aria-label="AI meeting agent settings"
                      >
                        <Settings className="h-5 w-5 shrink-0 text-slate-600 transition-colors group-hover:text-[#0099cb]" />
                        {isExpanded && (
                          <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">Settings</span>
                        )}
                      </button>
                    </PopoverTrigger>
                  </div>
                </TooltipTrigger>
                {!isExpanded && (
                  <TooltipContent side="right" className={RAIL_OVERLAY_NO_MOTION}>
                    AI meeting agent
                  </TooltipContent>
                )}
              </Tooltip>
              <PopoverContent
                align="start"
                side="right"
                sideOffset={POPOVER_SIDE_OFFSET}
                collisionPadding={POPOVER_COLLISION_PADDING}
                className={cn(
                  'w-[min(calc(100vw-6rem),22rem)] border-0 bg-transparent p-0 shadow-none',
                  RAIL_OVERLAY_NO_MOTION,
                )}
              >
                <ThemePopoverChrome title="AI meeting agent">{agentSettings('popover')}</ThemePopoverChrome>
              </PopoverContent>
            </Popover>
            </div>
          </div>

          <div className="mt-auto shrink-0 border-t border-[#0099cb]/12 px-2 pb-3 pt-3">
            <div className={cn(RAIL_FOOTER_GROUP, 'flex flex-col space-y-0.5')}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className={navBtn()}
                  onClick={() => logout()}
                  aria-label="Log out"
                >
                  <LogOut className="h-5 w-5 shrink-0 text-slate-600 transition-colors group-hover:text-red-600" />
                  {isExpanded && (
                    <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">Log out</span>
                  )}
                </button>
              </TooltipTrigger>
              {!isExpanded && (
                <TooltipContent side="right" className={RAIL_OVERLAY_NO_MOTION}>
                  Log out
                </TooltipContent>
              )}
            </Tooltip>
            </div>
          </div>
        </div>
      </aside>
    </TooltipProvider>
  )
}
