'use client'

import React, { useState, useEffect, useMemo } from 'react'
import dynamic from 'next/dynamic'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import { useIsLgUp } from '@/hooks/use-mobile'
import {
  SUPPORTED_LANGUAGES,
  DEFAULT_LANGUAGE,
  isLanguageSupported,
} from '@/lib/languages'
import { getUserPreferencesApiBase, updateTranscriptionLanguagePreference } from '@/lib/user-preferences-api'
import type { Tutorial } from '@/components/dashboard/TutorialModal'
import { Dock } from '@/components/dashboard/Dock'
import { DashboardSidebar, getDashboardMainMarginLeft } from '@/components/dashboard/DashboardSidebar'
import { isGoogleCalendarConnected } from '@/lib/google-calendar-integration'
import { useDashboardBackgroundSync } from '@/hooks/use-dashboard-background-sync'
import { DOCK_ID_TO_PLATFORM, DOCK_TUTORIALS } from '@/components/dashboard/dashboard-dock-tutorials'

const TutorialModalLazy = dynamic(
  () => import('@/components/dashboard/TutorialModal').then((m) => m.TutorialModal),
  { ssr: false },
)

const OnboardingModalLazy = dynamic(
  () => import('@/components/dashboard/OnboardingModal').then((m) => m.OnboardingModal),
  { ssr: false },
)

export interface DashboardShellChildContext {
  transcriptionLanguage: string
}

export interface DashboardShellProps {
  children: React.ReactNode | ((ctx: DashboardShellChildContext) => React.ReactNode)
  /** Passed to `<main aria-label="…">` for accessibility. */
  mainAriaLabel: string
  /**
   * When false, the delayed onboarding modal is not scheduled (e.g. on `/dashboard/insights`).
   * @default true
   */
  enableOnboarding?: boolean
}

export function DashboardShell({ children, mainAriaLabel, enableOnboarding = true }: DashboardShellProps) {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const isLgUp = useIsLgUp()

  const [isSidebarExpanded, setIsSidebarExpanded] = useState(() => {
    if (typeof window === 'undefined') return true
    try {
      return localStorage.getItem('dashboard_sidebar_expanded') !== 'false'
    } catch {
      return true
    }
  })
  const [transcriptionLanguage, setTranscriptionLanguage] = useState(DEFAULT_LANGUAGE)
  const [isAgentEnabled, setIsAgentEnabled] = useState(true)
  const [isCalendarUpdateEnabled, setIsCalendarUpdateEnabled] = useState(true)
  const [analysisDepth, setAnalysisDepth] = useState<'light' | 'standard' | 'deep'>('standard')

  const [selectedTutorial, setSelectedTutorial] = useState<Tutorial | null>(null)
  const [isTutorialModalOpen, setIsTutorialModalOpen] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [notionIntegrationConnected, setNotionIntegrationConnected] = useState(false)

  useDashboardBackgroundSync({
    userId: user?.id,
    onNotionConfiguredChange: setNotionIntegrationConnected,
  })

  useEffect(() => {
    const isLocalhost =
      typeof window !== 'undefined' &&
      (window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1' ||
        window.location.hostname === '[::1]')
    if (isLocalhost) return
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  useEffect(() => {
    const saved = localStorage.getItem('transcription_language')
    if (saved && SUPPORTED_LANGUAGES.some((l) => l.code === saved)) {
      setTranscriptionLanguage(saved)
    }
  }, [])

  useEffect(() => {
    if (!enableOnboarding) return
    try {
      if (localStorage.getItem('actionit_onboarding_completed') === 'true') {
        return
      }
    } catch {
      /* ignore */
    }
    const timer = setTimeout(() => {
      setShowOnboarding(true)
    }, 4000)
    return () => clearTimeout(timer)
  }, [enableOnboarding])

  /** Warm modal chunks after first paint so first open / onboarding feels instant. */
  useEffect(() => {
    if (typeof window === 'undefined') return
    const id = window.setTimeout(() => {
      void Promise.all([
        import('@/components/dashboard/TutorialModal'),
        import('@/components/dashboard/OnboardingModal'),
      ])
    }, 2000)
    return () => clearTimeout(id)
  }, [])

  const handleTranscriptionLanguageChange = async (code: string) => {
    if (!isLanguageSupported(code)) {
      toast({
        title: 'Unsupported language',
        description: 'Pick a language from the supported list.',
        variant: 'destructive',
      })
      return
    }
    if (code === transcriptionLanguage) return

    const label = SUPPORTED_LANGUAGES.find((l) => l.code === code)?.name ?? code

    const persistLocal = () => {
      setTranscriptionLanguage(code)
      try {
        localStorage.setItem('transcription_language', code)
      } catch {
        /* ignore */
      }
    }

    if (!user?.id) {
      persistLocal()
      toast({
        title: 'Language updated',
        description: `Transcription set to ${label} on this device.`,
      })
      return
    }

    const prefsBase = getUserPreferencesApiBase()
    if (!prefsBase) {
      persistLocal()
      toast({
        title: 'Language updated (this device only)',
        description: `Transcription set to ${label}. Configure NEXT_PUBLIC_USER_PREFERENCES_API_BASE or NEXT_PUBLIC_API_GATEWAY_URL to sync with your account.`,
      })
      return
    }

    try {
      const result = await updateTranscriptionLanguagePreference(user.id, code)
      persistLocal()
      toast({
        title: 'Language updated',
        description: result.message || `Transcription set to ${label}.`,
      })
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Could not save language preference.'
      toast({ title: 'Language not saved', description: msg, variant: 'destructive' })
    }
  }

  const desktopMainMarginPx = getDashboardMainMarginLeft(isSidebarExpanded)

  const handleDockIconClick = (id: string) => {
    const platform = DOCK_ID_TO_PLATFORM[id]
    if (platform) {
      const tutorial = DOCK_TUTORIALS.find((t) => t.platform === platform)
      if (tutorial) {
        setSelectedTutorial(tutorial)
        setIsTutorialModalOpen(true)
      }
    }
  }

  const handleSuggestedTutorialClick = (tutorial: Tutorial) => {
    setSelectedTutorial(tutorial)
  }

  const tutorialsWithStatus = useMemo(
    () =>
      DOCK_TUTORIALS.map((tutorial) => {
        if (tutorial.platform === 'Google Calendar') {
          return { ...tutorial, connected: isGoogleCalendarConnected(user) }
        }
        if (tutorial.platform === 'Notion') {
          return { ...tutorial, connected: notionIntegrationConnected }
        }
        return tutorial
      }),
    [user, notionIntegrationConnected],
  )

  const dockIcons = useMemo(
    () => [
      {
        id: 'notion',
        name: 'Notion',
        icon: <img src="/notion-logo-no-background.png" alt="Notion" className="h-6 w-6 object-contain" />,
        connected: notionIntegrationConnected,
      },
      {
        id: 'zoom',
        name: 'Zoom',
        icon: (
          <img
            src="/zoom logo.png"
            alt="Zoom"
            className="h-6 w-6 object-contain"
            onError={(e) => {
              e.currentTarget.src = '/zoom.png'
            }}
          />
        ),
        connected: false,
      },
      {
        id: 'hubspot',
        name: 'HubSpot',
        icon: <img src="https://cdn.simpleicons.org/hubspot/FF7A59" alt="HubSpot" className="h-6 w-6 object-contain" />,
        connected: false,
      },
      {
        id: 'trello',
        name: 'Trello',
        icon: <img src="https://cdn.simpleicons.org/trello/0052CC" alt="Trello" className="h-6 w-6 object-contain" />,
        connected: false,
      },
      {
        id: 'salesforce',
        name: 'Salesforce',
        icon: <img src="/Salesforce.png" alt="Salesforce" className="h-6 w-6 object-contain" />,
        connected: false,
      },
      {
        id: 'microsoft-teams',
        name: 'Microsoft Teams',
        icon: <img src="/teams.png" alt="Microsoft Teams" className="h-6 w-6 object-contain" />,
        connected: false,
      },
      {
        id: 'slack',
        name: 'Slack',
        icon: <img src="/Slack.png" alt="Slack" className="h-6 w-6 object-contain" />,
        connected: false,
      },
      {
        id: 'odoo',
        name: 'Odoo',
        icon: <img src="https://cdn.simpleicons.org/odoo/714B67" alt="Odoo" className="h-6 w-6 object-contain" />,
        connected: false,
      },
    ],
    [notionIntegrationConnected],
  )

  return (
    <div className="min-h-screen w-full bg-page pb-20 sm:pb-24 font-cooper">
      <DashboardSidebar
        transcriptionLanguage={transcriptionLanguage}
        onTranscriptionLanguageChange={handleTranscriptionLanguageChange}
        isAgentEnabled={isAgentEnabled}
        onAgentToggle={setIsAgentEnabled}
        isCalendarUpdateEnabled={isCalendarUpdateEnabled}
        onCalendarUpdateToggle={setIsCalendarUpdateEnabled}
        analysisDepth={analysisDepth}
        onAnalysisDepthChange={setAnalysisDepth}
        onExpansionChange={setIsSidebarExpanded}
      />

      <div
        className="min-h-screen transition-[margin] duration-300 ease-out"
        style={
          isLgUp
            ? {
                marginLeft: `${desktopMainMarginPx}px`,
                width: `calc(100% - ${desktopMainMarginPx}px)`,
              }
            : undefined
        }
      >
        <main className="min-h-[40vh] px-4 pb-10 pt-14 md:px-6 md:pb-14 lg:pt-6" aria-label={mainAriaLabel}>
          {typeof children === 'function' ? children({ transcriptionLanguage }) : children}
        </main>
      </div>

      <Dock
        icons={dockIcons}
        onIconClick={handleDockIconClick}
        sidebarMarginLeft={isLgUp ? `${desktopMainMarginPx}px` : undefined}
      />

      <TutorialModalLazy
        isOpen={isTutorialModalOpen}
        onClose={() => setIsTutorialModalOpen(false)}
        tutorial={selectedTutorial}
        suggestedTutorials={tutorialsWithStatus.filter((t) => t.id !== selectedTutorial?.id)}
        onSuggestedClick={handleSuggestedTutorialClick}
      />

      <OnboardingModalLazy isOpen={showOnboarding} onClose={() => setShowOnboarding(false)} />
    </div>
  )
}
