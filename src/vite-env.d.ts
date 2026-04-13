/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Full URL to start Google OAuth (e.g. backend `/auth/google` redirect). */
  readonly VITE_GOOGLE_SIGNIN_URL?: string
}
