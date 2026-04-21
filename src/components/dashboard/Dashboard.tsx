'use client'

import React, { useState, useEffect } from 'react'
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
import { TutorialModal, type Tutorial } from '@/components/dashboard/TutorialModal'
import { Dock } from '@/components/dashboard/Dock'
import { OnboardingModal } from '@/components/dashboard/OnboardingModal'
import { DashboardSidebar, getDashboardMainMarginLeft } from '@/components/dashboard/DashboardSidebar'
import { DashboardIntegrationsSection } from '@/components/dashboard/DashboardIntegrationsSection'
import { DashboardAccountSection } from '@/components/dashboard/DashboardAccountSection'
import { DashboardHero } from '@/components/dashboard/DashboardHero'
import { isGoogleCalendarConnected } from '@/lib/google-calendar-integration'

// Tutorial data for dock → modal flow (unchanged from previous dashboard)
const TUTORIALS: Tutorial[] = [
  {
    id: '1',
    platform: 'Google Calendar',
    title: 'Getting Started with Google Calendar Integration',
    duration: '5:23',
    thumbnail: '/placeholder-tutorial-1.jpg',
    videoUrl: 'https://example.com/video1.mp4',
    connected: true,
    steps: [
      {
        title: 'Connect Your Calendar',
        description: 'Authorize action.it to access your Google Calendar for automatic meeting detection.',
      },
      {
        title: 'Schedule a Meeting',
        description: 'Create a meeting in your calendar with a Google Meet, Zoom, or Teams link.',
      },
      {
        title: 'Auto-Join Enabled',
        description: 'action.it will automatically join your meeting at the scheduled time.',
      },
      {
        title: 'Receive Analysis',
        description: 'Get comprehensive meeting minutes and insights delivered to your email and Notion.',
      },
    ],
  },
  {
    id: '2',
    platform: 'Notion',
    title: 'Setting Up Notion Integration',
    duration: '4:15',
    thumbnail: '/placeholder-tutorial-2.jpg',
    videoUrl: 'https://example.com/video2.mp4',
    connected: false,
    steps: [
      {
        title: 'Connect Notion',
        description: 'Authorize action.it to access your Notion workspace.',
      },
      {
        title: 'Select a Page',
        description: 'Choose where you want meeting summaries to be posted.',
      },
      {
        title: 'Use /actionit Command',
        description: 'Type /actionit followed by a meeting link in any Notion page.',
      },
      {
        title: 'Automatic Updates',
        description: 'Meeting analyses will automatically appear in your selected Notion pages.',
      },
    ],
  },
  {
    id: '3',
    platform: 'Zoom',
    title: 'Using action.it with Zoom Meetings',
    duration: '3:42',
    thumbnail: '/placeholder-tutorial-3.jpg',
    videoUrl: 'https://example.com/video3.mp4',
    connected: false,
    steps: [
      {
        title: 'Schedule Zoom Meeting',
        description: 'Create a Zoom meeting in your calendar with the Zoom link included.',
      },
      {
        title: 'Join the Meeting',
        description: 'Join your Zoom meeting at the scheduled time.',
      },
      {
        title: 'Actionit Joins Automatically',
        description: 'action.it will automatically join as a participant when the meeting starts.',
      },
      {
        title: 'Review Analysis',
        description: 'Access meeting summaries in your Notion workspace or email.',
      },
    ],
  },
  {
    id: '4',
    platform: 'Microsoft Teams',
    title: 'Microsoft Teams Integration Guide',
    duration: '4:30',
    thumbnail: '/placeholder-tutorial-4.jpg',
    videoUrl: 'https://example.com/video4.mp4',
    connected: false,
    steps: [
      {
        title: 'Schedule Teams Meeting',
        description: 'Create a Microsoft Teams meeting in your calendar.',
      },
      {
        title: 'Auto-Join Setup',
        description: 'action.it will automatically detect and join your Teams meetings.',
      },
      {
        title: 'Meeting Recording',
        description: 'action.it records and transcribes the meeting automatically.',
      },
      {
        title: 'Get Summary',
        description: 'Receive meeting notes and action items via email and Notion.',
      },
    ],
  },
  {
    id: '5',
    platform: 'Salesforce',
    title: 'Salesforce Integration Setup',
    duration: '5:00',
    thumbnail: '/placeholder-tutorial-5.jpg',
    videoUrl: 'https://example.com/video5.mp4',
    connected: false,
    steps: [
      {
        title: 'Connect Salesforce',
        description: 'Authorize action.it to access your Salesforce account.',
      },
      {
        title: 'Configure Sync',
        description: 'Set up how meeting data should sync with Salesforce records.',
      },
      {
        title: 'Automatic Updates',
        description: 'Meeting insights will automatically update relevant Salesforce records.',
      },
    ],
  },
  {
    id: '6',
    platform: 'Trello',
    title: 'Trello Integration Setup',
    duration: '4:00',
    thumbnail: '/placeholder-tutorial-6.jpg',
    videoUrl: 'https://example.com/video6.mp4',
    connected: false,
    steps: [
      {
        title: 'Connect Trello',
        description: 'Authorize action.it to access your Trello boards.',
      },
      {
        title: 'Select Board',
        description: 'Choose which Trello board to sync meeting action items to.',
      },
      {
        title: 'Automatic Card Creation',
        description: 'Meeting action items will automatically be created as Trello cards.',
      },
    ],
  },
  {
    id: '7',
    platform: 'HubSpot',
    title: 'HubSpot Integration Setup',
    duration: '4:30',
    thumbnail: '/placeholder-tutorial-7.jpg',
    videoUrl: 'https://example.com/video7.mp4',
    connected: false,
    steps: [
      {
        title: 'Connect HubSpot',
        description: 'Authorize action.it to access your HubSpot CRM.',
      },
      {
        title: 'Configure Sync',
        description: 'Set up how meeting notes and insights sync with HubSpot contacts and deals.',
      },
      {
        title: 'Automatic Updates',
        description: 'Meeting insights will automatically update relevant HubSpot records.',
      },
    ],
  },
  {
    id: '8',
    platform: 'Slack',
    title: 'Slack Integration Setup',
    duration: '3:30',
    thumbnail: '/placeholder-tutorial-8.jpg',
    videoUrl: 'https://example.com/video8.mp4',
    connected: false,
    steps: [
      {
        title: 'Connect Slack',
        description: 'Authorize action.it to access your Slack workspace.',
      },
      {
        title: 'Select Channel',
        description: 'Choose which Slack channel to send meeting summaries to.',
      },
      {
        title: 'Automatic Notifications',
        description: 'Meeting summaries and action items will be posted to your selected channel.',
      },
    ],
  },
  {
    id: '9',
    platform: 'Odoo',
    title: 'Odoo Integration Setup',
    duration: '5:00',
    thumbnail: '/placeholder-tutorial-9.jpg',
    videoUrl: 'https://example.com/video9.mp4',
    connected: false,
    steps: [
      {
        title: 'Connect Odoo',
        description: 'Authorize action.it to access your Odoo ERP system.',
      },
      {
        title: 'Configure Sync',
        description: 'Set up how meeting data should sync with Odoo modules.',
      },
      {
        title: 'Automatic Updates',
        description: 'Meeting insights will automatically update relevant Odoo records.',
      },
    ],
  },
]

const DOCK_ID_TO_PLATFORM: Record<string, string> = {
  notion: 'Notion',
  zoom: 'Zoom',
  hubspot: 'HubSpot',
  trello: 'Trello',
  salesforce: 'Salesforce',
  'microsoft-teams': 'Microsoft Teams',
  slack: 'Slack',
  odoo: 'Odoo',
}

const Dashboard = () => {
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
      const tutorial = TUTORIALS.find((t) => t.platform === platform)
      if (tutorial) {
        setSelectedTutorial(tutorial)
        setIsTutorialModalOpen(true)
      }
    }
  }

  const handleSuggestedTutorialClick = (tutorial: Tutorial) => {
    setSelectedTutorial(tutorial)
  }

  const tutorialsWithStatus = TUTORIALS.map((tutorial) => {
    if (tutorial.platform === 'Google Calendar') {
      return { ...tutorial, connected: isGoogleCalendarConnected(user) }
    }
    return tutorial
  })

  const dockIcons = [
    {
      id: 'notion',
      name: 'Notion',
      icon: <img src="/notion-logo-no-background.png" alt="Notion" className="h-6 w-6 object-contain" />,
      connected: false,
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
  ]

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
            <main
              className="min-h-[40vh] px-4 pb-10 pt-14 md:px-6 md:pb-14 lg:pt-6"
              aria-label="Dashboard"
            >
              <div className="mx-auto max-w-6xl space-y-12 md:space-y-16">
                <DashboardHero user={user} transcriptionLanguage={transcriptionLanguage} />
                <DashboardIntegrationsSection user={user} />
                <DashboardAccountSection user={user} />
              </div>
            </main>
          </div>

          <Dock
            icons={dockIcons}
            onIconClick={handleDockIconClick}
            sidebarMarginLeft={isLgUp ? `${desktopMainMarginPx}px` : undefined}
          />

          <TutorialModal
            isOpen={isTutorialModalOpen}
            onClose={() => setIsTutorialModalOpen(false)}
            tutorial={selectedTutorial}
            suggestedTutorials={tutorialsWithStatus.filter((t) => t.id !== selectedTutorial?.id)}
            onSuggestedClick={handleSuggestedTutorialClick}
          />

          <OnboardingModal isOpen={showOnboarding} onClose={() => setShowOnboarding(false)} />
    </div>
  )
}

export default Dashboard
