'use client'

import React, { useState } from 'react'
import { MoreHorizontal, X } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useIsMobile } from '@/hooks/use-mobile'

interface DockIcon {
  id: string
  name: string
  icon: React.ReactNode
  connected: boolean
}

interface DockProps {
  icons: DockIcon[]
  onIconClick: (id: string) => void
  /** Left margin to align with main content when sidebar expands (e.g. '104px' / '216px'). Applied only on md+. */
  sidebarMarginLeft?: string
}

export const Dock: React.FC<DockProps> = ({ icons, onIconClick, sidebarMarginLeft }) => {
  const isMobile = useIsMobile()
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [showMoreMenu, setShowMoreMenu] = useState(false)

  const MOBILE_VISIBLE_COUNT = 5
  const visibleIcons = icons.slice(0, MOBILE_VISIBLE_COUNT)
  const hiddenIcons = icons.slice(MOBILE_VISIBLE_COUNT)

  const renderIcon = (icon: DockIcon, index: number, isInMenu = false) => {
    const isHovered = hoveredIndex === index
    const showCallout = !isMobile && isHovered

    return (
      <div key={icon.id} className="relative flex flex-col items-center">
        {showCallout && (
          <div
            className="pointer-events-none absolute -top-20 left-1/2 z-[100] -translate-x-1/2"
            style={{ marginTop: '12px' }}
          >
            <div className="whitespace-nowrap rounded-lg border-2 border-[#0099cb] bg-[#0099cb]/50 px-3 py-1.5 shadow-lg">
              <p className="text-xs font-semibold text-white">Click for {icon.name} integration</p>
              <div className="absolute bottom-0 left-1/2 h-0 w-0 -translate-x-1/2 translate-y-full border-l-4 border-r-4 border-t-4 border-transparent border-t-[#0099cb]" />
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={() => {
            onIconClick(icon.id)
            if (isInMenu) setShowMoreMenu(false)
          }}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
          className={`relative flex flex-shrink-0 flex-col items-center justify-center transition-transform duration-200 ease-out ${
            isHovered ? 'scale-105 -translate-y-0.5' : 'scale-100'
          }`}
          style={{
            transformOrigin: 'bottom center',
            position: isHovered ? 'relative' : 'static',
            zIndex: isHovered ? 60 : 'auto',
          }}
          aria-label={`${icon.name} integration`}
        >
          <div
            className={`
                flex h-10 w-10 items-center justify-center rounded-lg border border-transparent transition-all duration-200
                sm:h-12 sm:w-12 sm:rounded-xl
                ${icon.connected ? 'bg-gradient-to-r from-[#0099cb] to-[#00c6f3] text-white shadow-md shadow-[#0099cb]/50' : 'bg-[#F7F9FA] text-[#23272C] hover:bg-[#E0E0E0]'}
                ${isHovered ? 'ring-2 ring-[#0099cb]/50 shadow-lg shadow-[#00c6f3]/50' : ''}
              `}
            style={
              icon.connected
                ? undefined
                : {
                    backgroundImage: 'linear-gradient(#F7F9FA, #F7F9FA), linear-gradient(to right, #0099cb, #00c6f3)',
                    backgroundOrigin: 'border-box',
                    backgroundClip: 'padding-box, border-box',
                  }
            }
          >
            <div className="h-5 w-5 sm:h-6 sm:w-6">{icon.icon}</div>
          </div>
          {icon.connected && (
            <div className="absolute -bottom-0.5 h-1.5 w-1.5 rounded-full border-2 border-white bg-green-500 shadow-sm sm:-bottom-1 sm:h-2 sm:w-2" />
          )}
        </button>
      </div>
    )
  }

  return (
    <TooltipProvider>
      <div
        className="fixed bottom-0 left-0 right-0 z-50 flex justify-center overflow-visible pb-3 transition-[margin-left] duration-300 ease-in-out sm:pb-6 max-md:!ml-0"
        style={sidebarMarginLeft ? { marginLeft: sidebarMarginLeft } : undefined}
      >
        <div
          className="
            flex max-w-[calc(100vw-1rem)] items-end gap-2 overflow-visible rounded-xl border border-transparent
            bg-white/95 px-3 py-2 shadow-2xl shadow-[#0099cb]/30 backdrop-blur-2xl transition-all duration-300
            sm:max-w-none sm:gap-3 sm:rounded-2xl sm:px-5 sm:py-3
            max-md:translate-x-0 md:translate-x-6
          "
          style={{
            boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.1)',
            backgroundImage: 'linear-gradient(white, white), linear-gradient(to right, #0099cb, #00c6f3)',
            backgroundOrigin: 'border-box',
            backgroundClip: 'padding-box, border-box',
          }}
        >
          <div className="hidden items-end gap-2 sm:flex sm:gap-3">
            {icons.map((icon, index) => renderIcon(icon, index))}
          </div>

          <div className="flex items-end gap-2 sm:hidden">
            {visibleIcons.map((icon, index) => renderIcon(icon, index))}

            {hiddenIcons.length > 0 && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={() => setShowMoreMenu(true)}
                    onMouseEnter={() => setHoveredIndex(-1)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    className={`relative flex flex-shrink-0 flex-col items-center justify-center transition-transform duration-200 ease-out ${
                      hoveredIndex === -1 ? 'scale-105 -translate-y-0.5' : 'scale-100'
                    }`}
                    style={{
                      transformOrigin: 'bottom center',
                    }}
                    aria-label="More integrations"
                  >
                    <div
                      className={`
                        flex h-10 w-10 items-center justify-center rounded-lg border border-transparent transition-all duration-200
                        bg-[#F7F9FA] text-[#23272C] hover:bg-[#E0E0E0]
                        ${hoveredIndex === -1 ? 'ring-2 ring-[#0099cb]/50 shadow-lg shadow-[#00c6f3]/50' : ''}
                      `}
                      style={{
                        backgroundImage: 'linear-gradient(#F7F9FA, #F7F9FA), linear-gradient(to right, #0099cb, #00c6f3)',
                        backgroundOrigin: 'border-box',
                        backgroundClip: 'padding-box, border-box',
                      }}
                    >
                      <MoreHorizontal className="h-5 w-5" />
                    </div>
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" className="mb-2">
                  <p className="text-xs font-medium">More integrations</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>
      </div>

      {showMoreMenu && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 sm:hidden"
            onClick={() => setShowMoreMenu(false)}
            aria-hidden
          />

          <div
            className="
              fixed bottom-0 left-0 right-0 z-50
              transform rounded-t-2xl bg-white shadow-2xl
              transition-transform duration-300 ease-out
              sm:hidden
            "
            style={{
              maxHeight: '70vh',
              boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.15)',
            }}
          >
            <div className="flex justify-center pb-2 pt-3">
              <div className="h-1 w-12 rounded-full bg-[#E7ECF1]" />
            </div>

            <div className="absolute right-4 top-4">
              <button
                type="button"
                onClick={() => setShowMoreMenu(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-[#E7ECF1] bg-[#F7F9FA] transition-colors hover:bg-[#E0E0E0]"
                aria-label="Close menu"
              >
                <X className="h-4 w-4 text-[#23272C]" />
              </button>
            </div>

            <div className="px-6 pb-4">
              <h3 className="text-lg font-semibold text-[#23272C]">More Integrations</h3>
              <p className="mt-1 text-sm text-[#23272C]">Select an integration to view its tutorial</p>
            </div>

            <div className="overflow-y-auto px-6 pb-6" style={{ maxHeight: 'calc(70vh - 100px)' }}>
              <div className="grid grid-cols-4 gap-4">
                {hiddenIcons.map((icon) => (
                  <button
                    key={icon.id}
                    type="button"
                    onClick={() => {
                      onIconClick(icon.id)
                      setShowMoreMenu(false)
                    }}
                    className="flex flex-col items-center gap-2 rounded-xl p-3 transition-colors hover:bg-[#F7F9FA]"
                    aria-label={`${icon.name} integration`}
                  >
                    <div
                      className={`
                          flex h-12 w-12 items-center justify-center rounded-lg
                          border border-transparent
                          ${icon.connected ? 'bg-gradient-to-r from-[#0099cb] to-[#00c6f3] text-white shadow-md shadow-[#0099cb]/50' : 'bg-[#F7F9FA] text-[#23272C]'}
                        `}
                      style={
                        icon.connected
                          ? undefined
                          : {
                              backgroundImage:
                                'linear-gradient(#F7F9FA, #F7F9FA), linear-gradient(to right, #0099cb, #00c6f3)',
                              backgroundOrigin: 'border-box',
                              backgroundClip: 'padding-box, border-box',
                            }
                      }
                    >
                      <div className="h-6 w-6">{icon.icon}</div>
                    </div>
                    <span className="text-center text-xs font-medium text-[#23272C]">{icon.name}</span>
                    {icon.connected && (
                      <div className="h-2 w-2 rounded-full border border-white bg-green-500" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </TooltipProvider>
  )
}
