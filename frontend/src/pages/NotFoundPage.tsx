import { Link } from 'react-router'
import { AuroraBackground } from '@/components/layout/AuroraBackground'
import { paths } from '@/config/routes'

export function NotFoundPage() {
  return (
    <div className="relative grid min-h-dvh place-items-center px-6 text-center">
      <AuroraBackground />
      <title>Page not found · BookMyEvent</title>
      <div>
        <p className="text-gradient font-display text-[120px] leading-none italic sm:text-[180px]">
          404
        </p>
        <h1 className="mt-4 text-2xl font-semibold tracking-tight">
          This show isn&apos;t on the lineup
        </h1>
        <p className="mt-2 text-white/50">The page you&apos;re looking for doesn&apos;t exist.</p>
        <Link
          to={paths.root}
          className="mt-8 inline-flex h-12 items-center rounded-2xl border border-white/10 bg-white/[0.05] px-6 font-medium transition hover:bg-white/[0.1]"
        >
          Take me home
        </Link>
      </div>
    </div>
  )
}
