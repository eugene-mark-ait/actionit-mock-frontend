'use client'

import { useEffect, useState } from 'react'

type Sequence = { text: string; deleteAfter?: boolean }

type Props = {
  sequences: Sequence[]
  typingSpeed?: number
  deleteSpeed?: number
  pauseBeforeDelete?: number
  autoLoop?: boolean
  loopDelay?: number
  className?: string
}

const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))

export function TypewriterSequences({
  sequences,
  typingSpeed = 50,
  deleteSpeed = 30,
  pauseBeforeDelete = 1500,
  autoLoop = true,
  loopDelay = 1000,
  className = '',
}: Props) {
  const [display, setDisplay] = useState('')

  useEffect(() => {
    let cancelled = false

    const run = async () => {
      while (!cancelled) {
        for (let s = 0; s < sequences.length; s++) {
          const { text, deleteAfter } = sequences[s]

          for (let i = 0; i <= text.length; i++) {
            if (cancelled) return
            setDisplay(text.slice(0, i))
            await wait(typingSpeed)
          }

          const shouldDelete = deleteAfter !== false
          if (!shouldDelete) {
            await wait(loopDelay)
            if (autoLoop) {
              for (let i = text.length; i >= 0; i--) {
                if (cancelled) return
                setDisplay(text.slice(0, i))
                await wait(deleteSpeed)
              }
            } else {
              return
            }
            continue
          }

          await wait(pauseBeforeDelete)
          for (let i = text.length; i >= 0; i--) {
            if (cancelled) return
            setDisplay(text.slice(0, i))
            await wait(deleteSpeed)
          }
          await wait(loopDelay)
        }
        if (!autoLoop) return
      }
    }

    void run()
    return () => {
      cancelled = true
    }
  }, [sequences, typingSpeed, deleteSpeed, pauseBeforeDelete, autoLoop, loopDelay])

  return (
    <span className={className}>
      {display}
      <span className="inline-block w-0.5 h-[1em] ml-0.5 bg-current animate-pulse align-[-2px]" aria-hidden="true" />
    </span>
  )
}
