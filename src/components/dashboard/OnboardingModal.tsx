'use client'

import React, { useState, useEffect, useCallback } from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { ChevronRight, Calendar, Video, Mail, CheckCircle2, Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface OnboardingModalProps {
  isOpen: boolean
  onClose: () => void
}

const ONBOARDING_STEPS = [
  {
    id: 1,
    title: 'Schedule your meeting on Google Calendar',
    description:
      'Create a meeting in your Google Calendar with a video conferencing link (Google Meet, Zoom, or Teams). action.it will automatically detect scheduled meetings.',
    icon: Calendar,
  },
  {
    id: 2,
    title: 'Actionit automatically detects your meeting and joins when it starts',
    description:
      'When your meeting begins, action.it will automatically join as a participant. No manual intervention needed - just start your meeting as usual.',
    icon: Video,
  },
  {
    id: 3,
    title: 'Actionit sends you meeting notes in any language you want',
    description:
      'After the meeting, receive comprehensive meeting minutes, action items, and insights delivered to your email and Notion workspace. Configure your preferred language in the dashboard settings.',
    icon: Mail,
  },
  {
    id: 4,
    title: 'Ready to start using Actionit for all your online meetings?',
    description:
      "You're all set! Connect your integrations and start scheduling meetings. action.it will handle the rest automatically.",
    icon: CheckCircle2,
  },
]

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0)
  const step = ONBOARDING_STEPS[currentStep]
  const StepIcon = step.icon

  const handleComplete = useCallback(() => {
    try {
      localStorage.setItem('actionit_onboarding_completed', 'true')
    } catch {
      /* ignore quota / private mode */
    }
    onClose()
  }, [onClose])

  useEffect(() => {
    if (isOpen) setCurrentStep(0)
  }, [isOpen])

  const handleNext = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep((s) => s + 1)
    } else {
      handleComplete()
    }
  }

  const isLastStep = currentStep === ONBOARDING_STEPS.length - 1

  return (
    <DialogPrimitive.Root
      open={isOpen}
      onOpenChange={(open) => {
        if (!open && isLastStep) handleComplete()
      }}
    >
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          className={cn(
            'fixed inset-0 z-[80] bg-black/35 backdrop-blur-sm',
            'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
          )}
        />
        {/* Flex centering wrapper — avoids transform fights with shared DialogContent */}
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-3 sm:p-4 md:p-6 pointer-events-none">
          <DialogPrimitive.Content
            className={cn(
              'pointer-events-auto relative flex max-h-[min(95vh,56rem)] w-full max-w-6xl flex-col overflow-hidden rounded-xl border-2 border-transparent bg-white shadow-2xl outline-none sm:rounded-2xl',
              'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
            )}
            style={{
              backgroundImage: 'linear-gradient(white, white), linear-gradient(to right, #0099cb, #00c6f3)',
              backgroundOrigin: 'border-box',
              backgroundClip: 'padding-box, border-box',
            }}
            onInteractOutside={(e) => e.preventDefault()}
            onPointerDownOutside={(e) => e.preventDefault()}
            onEscapeKeyDown={(e) => {
              if (!isLastStep) e.preventDefault()
            }}
          >
            <DialogPrimitive.Title className="sr-only">
              Welcome to action.it — onboarding step {currentStep + 1} of {ONBOARDING_STEPS.length}
            </DialogPrimitive.Title>
            <DialogPrimitive.Description className="sr-only">
              {step.description}
            </DialogPrimitive.Description>

            <div className="flex min-h-0 flex-1 flex-col lg:flex-row lg:max-h-[min(95vh,56rem)]">
              {/* LEFT: steps */}
              <div className="flex min-h-0 flex-1 flex-col overflow-y-auto border-[#E7ECF1] p-4 sm:p-6 md:p-8 lg:flex-[1] lg:border-r-2 lg:p-12">
                <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col lg:justify-center">
                  <div className="mb-4 flex items-center gap-1.5 sm:mb-6 sm:gap-2 lg:mb-8">
                    {ONBOARDING_STEPS.map((s, index) => (
                      <div
                        key={s.id}
                        className={cn(
                          'h-1 flex-1 rounded-full transition-all duration-300',
                          index <= currentStep
                            ? 'bg-gradient-to-r from-[#0099cb] to-[#00c6f3]'
                            : 'bg-gray-200',
                        )}
                      />
                    ))}
                  </div>

                  <div className="mb-3 sm:mb-4 lg:mb-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-[#0099cb] to-[#00c6f3] text-white shadow-lg sm:h-14 sm:w-14 sm:rounded-2xl md:h-16 md:w-16">
                      <StepIcon className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8" />
                    </div>
                  </div>

                  <h2 className="mb-2 bg-gradient-to-r from-[#0099cb] to-[#00c6f3] bg-clip-text text-xl font-semibold text-transparent sm:mb-3 sm:text-2xl md:text-3xl lg:mb-4 lg:text-4xl">
                    {step.title}
                  </h2>

                  <p className="mb-3 text-sm leading-relaxed text-[#23272C] opacity-80 sm:mb-4 sm:text-base md:text-lg lg:mb-6">
                    {step.description}
                  </p>

                  {isLastStep ? (
                    <div className="mt-auto flex flex-row items-center gap-2 sm:gap-4">
                      {currentStep > 0 && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setCurrentStep((c) => c - 1)}
                          className="h-9 border-gray-200 text-xs sm:h-10 sm:text-sm"
                        >
                          Previous
                        </Button>
                      )}
                      <Button
                        type="button"
                        onClick={handleComplete}
                        className="h-9 flex-1 bg-gradient-to-r from-[#0099cb] to-[#00c6f3] text-xs text-white hover:from-[#0088b8] hover:to-[#00b5e0] sm:h-10 sm:text-sm"
                      >
                        Let&apos;s go!
                        <Play className="ml-1 h-3 w-3 sm:ml-2 sm:h-4 sm:w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="mt-auto flex flex-row items-center gap-2 sm:gap-4">
                      {currentStep > 0 && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setCurrentStep((c) => c - 1)}
                          className="h-9 border-gray-200 text-xs sm:h-10 sm:text-sm"
                        >
                          Previous
                        </Button>
                      )}
                      <Button
                        type="button"
                        onClick={handleNext}
                        className="h-9 flex-1 bg-gradient-to-r from-[#0099cb] to-[#00c6f3] text-xs text-white hover:from-[#0088b8] hover:to-[#00b5e0] sm:h-10 sm:text-sm"
                      >
                        Next
                        <ChevronRight className="ml-1 h-3 w-3 sm:ml-2 sm:h-4 sm:w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* RIGHT: placeholder */}
              <div
                className="relative flex w-full flex-1 items-center justify-center border-t border-transparent bg-gradient-to-br from-[#0099cb] via-[#00c6f3] to-[#0099cb] lg:flex-[2] lg:border-l lg:border-t-0"
                style={{ borderImage: 'linear-gradient(to bottom, #0099cb, #00c6f3) 1' }}
              >
                <div className="p-4 text-center text-white sm:p-6 md:p-8">
                  <div className="mb-4 sm:mb-6">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-[#0099cb] to-[#00c6f3] shadow-2xl ring-4 ring-[#0099cb]/30 backdrop-blur-sm sm:h-20 sm:w-20 md:h-24 md:w-24">
                      <Play className="ml-1 h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12" fill="currentColor" />
                    </div>
                  </div>
                  <p className="mb-1 text-xs font-medium text-white opacity-90 sm:mb-2 sm:text-sm">Onboarding Video</p>
                  <p className="text-[10px] text-white opacity-80 sm:text-xs">
                    This video plays continuously and demonstrates action.it in action
                  </p>
                </div>
              </div>
            </div>
          </DialogPrimitive.Content>
        </div>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
