import { Link } from 'react-router'
import { Backdrop } from '@/components/layout/Backdrop'
import { paths } from '@/config/routes'

export function NotFoundPage() {
  return (
    <div className="relative grid min-h-dvh place-items-center px-6 text-center">
      <Backdrop />
      <title>Page not found · BookMyEvent</title>
      <div>
        <p className="font-display text-[120px] leading-none text-brand italic sm:text-[180px]">
          404
        </p>
        <h1 className="mt-4 font-display text-4xl">This show isn&apos;t on the lineup</h1>
        <p className="mt-2 text-paper/50">The page you&apos;re looking for doesn&apos;t exist.</p>
        <Link
          to={paths.root}
          className="mt-8 inline-flex h-12 items-center rounded-xl border border-paper/15 px-6 font-medium transition hover:border-paper/35 hover:bg-paper/[0.04]"
        >
          Take me home
        </Link>
      </div>
    </div>
  )
}
