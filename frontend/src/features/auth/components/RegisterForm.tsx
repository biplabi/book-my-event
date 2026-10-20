import { zodResolver } from '@hookform/resolvers/zod'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, AtSign, CalendarDays, Phone, UserRound } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { toast } from 'sonner'
import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { PasswordField } from '@/components/ui/PasswordField'
import { TextField } from '@/components/ui/TextField'
import { useAuth } from '../hooks/useAuth'
import { registerSchema, registerSteps, type RegisterFormValues } from '../schemas/auth.schemas'
import { describeRegisterError, type AuthErrorInfo } from '../utils/errors'
import { PasswordStrength } from './PasswordStrength'

interface RegisterFormProps {
  defaultEmail?: string
  onSwitchToLogin: (email: string) => void
}

const today = (() => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
})()

const stepVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 40 : -40, opacity: 0, filter: 'blur(6px)' }),
  center: { x: 0, opacity: 1, filter: 'blur(0px)' },
  exit: (dir: number) => ({ x: dir > 0 ? -40 : 40, opacity: 0, filter: 'blur(6px)' }),
}

export function RegisterForm({ defaultEmail = '', onSwitchToLogin }: RegisterFormProps) {
  const { register: registerUser, login } = useAuth()
  const [step, setStep] = useState(0)
  const [direction, setDirection] = useState(1)
  const [formError, setFormError] = useState<AuthErrorInfo | null>(null)
  const [passwordFocused, setPasswordFocused] = useState(false)

  const {
    register,
    control,
    handleSubmit,
    trigger,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: 'onTouched',
    defaultValues: {
      firstName: '',
      lastName: '',
      phoneNumber: '',
      dateOfBirth: '',
      email: defaultEmail,
      password: '',
      confirmPassword: '',
    },
  })

  const password = useWatch({ control, name: 'password' })
  const isLastStep = step === registerSteps.length - 1

  const goTo = (next: number) => {
    setDirection(next > step ? 1 : -1)
    setStep(next)
  }

  const next = async () => {
    const valid = await trigger([...registerSteps[step]!.fields], { shouldFocus: true })
    if (valid) goTo(step + 1)
  }

  const submit = handleSubmit(async (values) => {
    setFormError(null)
    try {
      await registerUser({
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        phoneNumber: Number(values.phoneNumber),
        email: values.email.trim(),
        password: values.password,
        dateOfBirth: values.dateOfBirth,
      })
    } catch (err) {
      setFormError(describeRegisterError(err))
      return
    }

    // Account exists now; sign straight in so the user lands in the app.
    try {
      await login({ email: values.email.trim(), password: values.password })
      toast.success(`You're in, ${values.firstName.trim()}! Welcome to BookMyEvent.`)
    } catch {
      toast.success('Account created! Sign in to continue.')
      onSwitchToLogin(values.email.trim())
    }
  })

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    if (isLastStep) return void submit(e)
    e.preventDefault()
    void next()
  }

  return (
    <form onSubmit={onSubmit} noValidate className="pt-1 pb-2">
      {/* Progress */}
      <div className="mb-6">
        <div className="mb-2.5 flex items-center justify-between text-xs">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={step}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="font-medium text-paper/80"
            >
              {registerSteps[step]!.title}
            </motion.span>
          </AnimatePresence>
          <span className="font-mono text-paper/40 tabular-nums">
            Step {step + 1} of {registerSteps.length}
          </span>
        </div>
        <div className="flex gap-1.5">
          {registerSteps.map((s, i) => (
            <div key={s.title} className="h-0.5 flex-1 overflow-hidden rounded-full bg-paper/10">
              <motion.div
                className="h-full rounded-full bg-brand"
                initial={false}
                animate={{ width: i <= step ? '100%' : '0%' }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence initial={false}>
        {formError && (
          <Alert
            key={formError.code}
            tone={formError.code === 'UNREACHABLE' ? 'offline' : 'error'}
            action={
              formError.code === 'ALREADY_EXISTS' ? (
                <button
                  type="button"
                  onClick={() => onSwitchToLogin(getValues('email'))}
                  className="font-medium text-paper underline decoration-paper/30 underline-offset-4 transition hover:decoration-paper"
                >
                  Sign in instead →
                </button>
              ) : undefined
            }
          >
            {formError.message}
          </Alert>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait" initial={false} custom={direction}>
        <motion.div
          key={step}
          custom={direction}
          variants={stepVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-4"
        >
          {step === 0 ? (
            <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <TextField
                  label="First name"
                  icon={UserRound}
                  autoComplete="given-name"
                  error={errors.firstName?.message}
                  {...register('firstName')}
                />
                <TextField
                  label="Last name"
                  autoComplete="family-name"
                  error={errors.lastName?.message}
                  {...register('lastName')}
                />
              </div>
              <Controller
                control={control}
                name="phoneNumber"
                render={({ field, fieldState }) => (
                  <TextField
                    label="Mobile number"
                    icon={Phone}
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel-national"
                    maxLength={10}
                    error={fieldState.error?.message}
                    hint="10 digits, no country code"
                    {...field}
                    onChange={(e) => field.onChange(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  />
                )}
              />
              <TextField
                label="Date of birth"
                icon={CalendarDays}
                type="date"
                max={today}
                min="1900-01-01"
                autoComplete="bday"
                floatLabel
                error={errors.dateOfBirth?.message}
                {...register('dateOfBirth')}
              />
            </>
          ) : (
            <>
              <TextField
                label="Email address"
                type="email"
                icon={AtSign}
                autoComplete="email"
                inputMode="email"
                autoFocus
                error={errors.email?.message}
                {...register('email')}
              />
              <div>
                <PasswordField
                  label="Create password"
                  autoComplete="new-password"
                  error={errors.password?.message}
                  {...register('password', {
                    onBlur: () => setPasswordFocused(false),
                  })}
                  onFocus={() => setPasswordFocused(true)}
                />
                <AnimatePresence initial={false}>
                  {(passwordFocused || password) && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <PasswordStrength password={password} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <PasswordField
                label="Confirm password"
                autoComplete="new-password"
                error={errors.confirmPassword?.message}
                {...register('confirmPassword')}
              />
            </>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="mt-7 flex gap-3">
        <AnimatePresence initial={false}>
          {step > 0 && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.25 }}
              className="shrink-0 overflow-hidden"
            >
              <Button
                variant="secondary"
                onClick={() => goTo(step - 1)}
                disabled={isSubmitting}
                aria-label="Back"
                className="w-13 px-0"
              >
                <ArrowLeft className="size-[18px]" aria-hidden />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
        <Button
          type="submit"
          loading={isSubmitting}
          loadingText="Creating your account…"
          className="flex-1"
        >
          {isLastStep ? 'Create account' : 'Continue'}
          <ArrowRight
            className="size-[18px] transition-transform duration-300 group-hover/button:translate-x-1"
            aria-hidden
          />
        </Button>
      </div>
    </form>
  )
}
