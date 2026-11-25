import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Joins class names; when two Tailwind classes set the same thing (`h-13` and `h-10`), the later
 * one wins. Without the merge, whichever rule comes later in the CSS file wins instead.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
