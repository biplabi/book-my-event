import { MotionConfig } from 'framer-motion'
import type { ReactNode } from 'react'
import { Toaster } from 'sonner'
import { AuthProvider } from '@/features/auth/context/AuthProvider'

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <AuthProvider>
        {children}
        <Toaster
          theme="dark"
          position="top-center"
          richColors
          toastOptions={{
            className: '!rounded-xl !border-paper/10 !bg-ink-900 !text-paper !font-sans',
          }}
        />
      </AuthProvider>
    </MotionConfig>
  )
}
