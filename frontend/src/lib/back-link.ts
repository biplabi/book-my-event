/** Where a page's back link goes, and the words it shows. */
export interface BackLink {
  to: string
  label: string
}

/**
 * Router state for a `<Link>` so the page it opens can link back here, e.g.
 * `<Link to={eventPath(id)} state={backTo(location, 'Admin events')}>`.
 */
export function backTo(location: { pathname: string; search: string }, label: string) {
  return { backTo: { to: location.pathname + location.search, label } satisfies BackLink }
}

/** The back link left by `backTo` in the router state, or `fallback` when there is none. */
export function readBackLink(state: unknown, fallback: BackLink): BackLink {
  if (state && typeof state === 'object' && 'backTo' in state) {
    const back = state.backTo
    if (
      back &&
      typeof back === 'object' &&
      'to' in back &&
      'label' in back &&
      typeof back.to === 'string' &&
      typeof back.label === 'string' &&
      // Only paths inside this app.
      back.to.startsWith('/')
    ) {
      return { to: back.to, label: back.label }
    }
  }
  return fallback
}
