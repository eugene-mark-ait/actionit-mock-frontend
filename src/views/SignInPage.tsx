'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { BrandWordmark } from '@/components/BrandWordmark'
import { SiteImage } from '@/components/SiteImage'
import { HeroFirstViewportBackdrop } from '../components/Hero'
import { Navbar } from '../components/Navbar'

function GoogleMark({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
      width={22}
      height={22}
      aria-hidden
    >
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
      <path fill="none" d="M0 0h48v48H0z" />
    </svg>
  )
}

const googleSignInUrl = process.env.NEXT_PUBLIC_GOOGLE_SIGNIN_URL?.trim() ?? ''

const btnBase =
  'inline-flex w-full items-center justify-center gap-3 rounded-full min-h-[48px] px-6 py-3 text-[15px] font-semibold tracking-tight transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/50 focus-visible:ring-offset-2 focus-visible:ring-offset-white/80'

export function SignInPage() {
  useEffect(() => {
    const prev = document.title
    document.title = 'Sign in | actionit.ai'
    return () => {
      document.title = prev
    }
  }, [])

  const oauthRel = googleSignInUrl.startsWith('http') ? 'noopener noreferrer' : undefined

  return (
    <div className="relative min-h-screen min-w-0 overflow-x-clip bg-page">
      <div className="pointer-events-none absolute inset-x-0 top-0 z-0 min-h-[100dvh]">
        <HeroFirstViewportBackdrop />
      </div>

      <Navbar />

      <main className="relative z-10 mx-auto flex min-h-[calc(100dvh-5rem)] w-full min-w-0 max-w-lg flex-col justify-center px-4 pb-16 pt-8 sm:px-6">
        <div className="w-full rounded-2xl border border-white/25 bg-white/55 p-8 shadow-signin-card backdrop-blur-xl sm:p-10">
          <div className="mb-8 flex flex-col items-center text-center">
            <SiteImage
              src="/ehanced_logo.png"
              alt=""
              width={56}
              height={56}
              className="mb-5 rounded-xl shadow-sm"
              priority
            />
            <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight text-brand-navy sm:text-[1.65rem]">
              Sign in to <BrandWordmark className="font-navbar-mark inline font-bold" />
            </h1>
          </div>

          {googleSignInUrl ? (
            <a
              href={googleSignInUrl}
              rel={oauthRel}
              className={`${btnBase} border border-zinc-200/90 bg-white text-zinc-800 shadow-sm hover:bg-zinc-50 hover:shadow-md`}
            >
              <GoogleMark className="shrink-0" />
              Sign in with Google
            </a>
          ) : (
            <button
              type="button"
              disabled
              className={`${btnBase} cursor-not-allowed border border-zinc-200/60 bg-zinc-100/80 text-zinc-500`}
            >
              <GoogleMark className="shrink-0 opacity-60" />
              Sign in with Google
            </button>
          )}

          <p className="mt-8 text-center text-xs text-zinc-500">
            By continuing, you agree to our{' '}
            <Link href="/TOS" className="font-medium text-brand-wordmark underline-offset-2 hover:underline">
              Terms
            </Link>{' '}
            and{' '}
            <Link
              href="/privacy-policy"
              className="font-medium text-brand-wordmark underline-offset-2 hover:underline"
            >
              Privacy Policy
            </Link>
            .
          </p>

          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-sm font-medium text-zinc-600 underline-offset-2 transition hover:text-brand-cyan hover:underline"
            >
              ← Back to home
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
