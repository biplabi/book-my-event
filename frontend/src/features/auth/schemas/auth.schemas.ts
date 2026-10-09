import { z } from 'zod'

// Rules mirror RegisterUserRequestDto. They have to be enforced here: Spring's
// validation errors go to /error, which the security config does not permit,
// so the browser only ever sees a bare 403 for them.

export const SPECIAL_CHARS = '@$!%*?&'

export const passwordRules = [
  { id: 'length', label: 'At least 8 characters', test: (v: string) => v.length >= 8 },
  { id: 'upper', label: 'One uppercase letter', test: (v: string) => /[A-Z]/.test(v) },
  { id: 'lower', label: 'One lowercase letter', test: (v: string) => /[a-z]/.test(v) },
  { id: 'digit', label: 'One number', test: (v: string) => /\d/.test(v) },
  {
    id: 'special',
    label: `One of ${SPECIAL_CHARS.split('').join(' ')}`,
    test: (v: string) => /[@$!%*?&]/.test(v),
  },
] as const

const email = z
  .string()
  .trim()
  .min(1, 'Email is required')
  .pipe(z.email('Enter a valid email address'))

export const loginSchema = z.object({
  email,
  password: z.string().min(1, 'Password is required'),
})
export type LoginFormValues = z.infer<typeof loginSchema>

const name = (field: string) =>
  z
    .string()
    .trim()
    .min(2, `${field} must be at least 2 characters`)
    .max(50, `${field} must be at most 50 characters`)

const passwordPair = z.object({ password: z.string(), confirmPassword: z.string().min(1) })

export const registerSchema = z
  .object({
    firstName: name('First name'),
    lastName: name('Last name'),
    phoneNumber: z.string().regex(/^[1-9]\d{9}$/, 'Enter a valid 10-digit phone number'),
    dateOfBirth: z
      .string()
      .min(1, 'Date of birth is required')
      .refine((v) => {
        const d = new Date(`${v}T00:00:00`)
        return !Number.isNaN(d.getTime()) && d < new Date() && d.getFullYear() >= 1900
      }, 'Enter a valid date in the past'),
    email,
    password: z
      .string()
      .min(1, 'Password is required')
      .refine(
        (v) => passwordRules.every((r) => r.test(v)),
        'Password does not meet all requirements',
      ),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((v) => v.password === v.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
    // Run the comparison even while other fields are still invalid.
    when: (payload) => passwordPair.safeParse(payload.value).success,
  })
export type RegisterFormValues = z.infer<typeof registerSchema>

export const registerSteps = [
  {
    title: 'About you',
    fields: ['firstName', 'lastName', 'phoneNumber', 'dateOfBirth'],
  },
  {
    title: 'Secure your account',
    fields: ['email', 'password', 'confirmPassword'],
  },
] as const satisfies ReadonlyArray<{
  title: string
  fields: ReadonlyArray<keyof RegisterFormValues>
}>
