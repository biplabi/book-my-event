import { useState } from 'react'
import { useMatch, useNavigate } from 'react-router'
import { Logo } from '@/components/brand/Logo'
import { Backdrop } from '@/components/layout/Backdrop'
import { paths } from '@/config/routes'
import { AuthPanel } from '@/features/auth/components/AuthPanel'
import type { AuthMode } from '@/features/auth/components/AuthTabs'
import { AuthShowcase } from '@/features/auth/components/showcase/AuthShowcase'

/** Layout route for /login and /register so the page (and its animations) persists across the switch. */
export function AuthPage() {
  const navigate = useNavigate()
  const mode: AuthMode = useMatch(paths.register) ? 'register' : 'login'
  const [prefillEmail, setPrefillEmail] = useState('')

  const changeMode = (next: AuthMode, email?: string) => {
    if (email !== undefined) setPrefillEmail(email)
    if (next !== mode) {
      navigate(next === 'register' ? paths.register : paths.login, { replace: true })
    }
  }

  return (
    <div className="relative min-h-dvh">
      <Backdrop />
      <title>{mode === 'login' ? 'Sign in · BookMyEvent' : 'Create account · BookMyEvent'}</title>

      <div className="mx-auto grid min-h-dvh max-w-[1600px] grid-cols-1 gap-4 p-4 lg:grid-cols-[1.15fr_1fr]">
        <AuthShowcase />

        <main className="flex flex-col items-center justify-center py-8 sm:py-12">
          <div className="mb-8 lg:hidden">
            <Logo />
          </div>
          <div className="w-full max-w-[460px]">
            <AuthPanel mode={mode} prefillEmail={prefillEmail} onModeChange={changeMode} />
          </div>
          <p className="mt-8 max-w-sm text-center text-xs leading-relaxed text-paper/30">
            By continuing you agree to BookMyEvent&apos;s Terms of Service and acknowledge our
            Privacy Policy.
          </p>
        </main>
      </div>
    </div>
  )
}
