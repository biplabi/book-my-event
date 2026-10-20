import { AnimatePresence, motion } from 'framer-motion'
import { useElementHeight } from '@/hooks/useElementHeight'
import { AuthTabs, type AuthMode } from './AuthTabs'
import { LoginForm } from './LoginForm'
import { RegisterForm } from './RegisterForm'

const copy: Record<AuthMode, { title: string; subtitle: string }> = {
  login: {
    title: 'Welcome back',
    subtitle: 'Sign in to pick up right where the music left off.',
  },
  register: {
    title: 'Join the crowd',
    subtitle: 'Create your account in under a minute. Your next night out is waiting.',
  },
}

const formVariants = {
  enter: (dir: number) => ({ x: dir * 56, opacity: 0, filter: 'blur(8px)' }),
  center: { x: 0, opacity: 1, filter: 'blur(0px)' },
  exit: (dir: number) => ({ x: dir * -56, opacity: 0, filter: 'blur(8px)' }),
}

interface AuthPanelProps {
  mode: AuthMode
  prefillEmail: string
  onModeChange: (mode: AuthMode, email?: string) => void
}

export function AuthPanel({ mode, prefillEmail, onModeChange }: AuthPanelProps) {
  const [contentRef, height] = useElementHeight<HTMLDivElement>()
  const direction = mode === 'register' ? 1 : -1

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="w-full rounded-[24px] border border-paper/10 bg-ink-900 shadow-[0_40px_120px_-30px_rgb(0_0_0/0.9)]"
    >
      <div className="relative overflow-hidden rounded-[24px] p-6 sm:p-9">
        <header className="mb-7">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <h1 className="font-display text-[40px] leading-none tracking-[-0.01em] text-paper sm:text-[46px]">
                {copy[mode].title}
              </h1>
              <p className="mt-3 text-[15px] leading-relaxed text-paper/50">
                {copy[mode].subtitle}
              </p>
            </motion.div>
          </AnimatePresence>
        </header>

        <AuthTabs mode={mode} onChange={(m) => onModeChange(m)} />

        <motion.div
          id="auth-panel"
          role="tabpanel"
          aria-labelledby={`auth-tab-${mode}`}
          animate={{ height }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="-mx-2 mt-7 overflow-hidden px-2"
        >
          <div ref={contentRef} className="pt-1">
            <AnimatePresence mode="wait" initial={false} custom={direction}>
              <motion.div
                key={mode}
                custom={direction}
                variants={formVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              >
                {mode === 'login' ? (
                  <LoginForm
                    defaultEmail={prefillEmail}
                    onSwitchToRegister={(email) => onModeChange('register', email)}
                  />
                ) : (
                  <RegisterForm
                    defaultEmail={prefillEmail}
                    onSwitchToLogin={(email) => onModeChange('login', email)}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        <p className="mt-6 text-center text-[13px] text-paper/40">
          {mode === 'login' ? 'New to BookMyEvent? ' : 'Already have an account? '}
          <button
            type="button"
            onClick={() => onModeChange(mode === 'login' ? 'register' : 'login')}
            className="font-medium text-paper/85 underline decoration-paper/25 underline-offset-4 transition hover:text-brand hover:decoration-brand"
          >
            {mode === 'login' ? 'Create an account' : 'Sign in'}
          </button>
        </p>
      </div>
    </motion.div>
  )
}
