import { zodResolver } from '@hookform/resolvers/zod'
import { AnimatePresence } from 'framer-motion'
import { ArrowRight, AtSign } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { PasswordField } from '@/components/ui/PasswordField'
import { TextField } from '@/components/ui/TextField'
import { useAuth } from '../hooks/useAuth'
import { loginSchema, type LoginFormValues } from '../schemas/auth.schemas'
import { describeLoginError, type AuthErrorInfo } from '../utils/errors'

interface LoginFormProps {
  defaultEmail?: string
  onSwitchToRegister: (email: string) => void
}

export function LoginForm({ defaultEmail = '', onSwitchToRegister }: LoginFormProps) {
  const { login } = useAuth()
  const [formError, setFormError] = useState<AuthErrorInfo | null>(null)

  const {
    register,
    handleSubmit,
    getValues,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: 'onTouched',
    defaultValues: { email: defaultEmail, password: '' },
  })

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null)
    try {
      const user = await login({ email: values.email, password: values.password })
      toast.success(`Welcome back, ${user.firstName}!`)
    } catch (err) {
      const info = describeLoginError(err)
      setFormError(info)
      if (info.code === 'BAD_CREDENTIALS') setFocus('password')
    }
  })

  return (
    <form onSubmit={onSubmit} noValidate className="pt-1 pb-2">
      <AnimatePresence initial={false}>
        {formError && (
          <Alert
            key={formError.code}
            tone={formError.code === 'UNREACHABLE' ? 'offline' : 'error'}
            action={
              formError.code === 'NOT_REGISTERED' ? (
                <button
                  type="button"
                  onClick={() => onSwitchToRegister(getValues('email'))}
                  className="font-medium text-paper underline decoration-paper/30 underline-offset-4 transition hover:decoration-paper"
                >
                  Create an account with this email →
                </button>
              ) : undefined
            }
          >
            {formError.message}
          </Alert>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        <TextField
          label="Email address"
          type="email"
          icon={AtSign}
          autoComplete="email"
          inputMode="email"
          autoFocus={!defaultEmail}
          error={errors.email?.message}
          {...register('email')}
        />
        <PasswordField
          label="Password"
          autoComplete="current-password"
          autoFocus={!!defaultEmail}
          error={errors.password?.message}
          {...register('password')}
        />
      </div>

      <Button
        type="submit"
        loading={isSubmitting}
        loadingText="Signing you in…"
        className="mt-7 w-full"
      >
        Sign in
        <ArrowRight
          className="size-[18px] transition-transform duration-300 group-hover/button:translate-x-1"
          aria-hidden
        />
      </Button>
    </form>
  )
}
