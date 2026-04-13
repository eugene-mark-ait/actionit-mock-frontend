/** Temporary meta/link tags for SPA routes; remove on cleanup to avoid duplicates. */

export type RouteMetaTag =
  | { type: 'name'; name: string; content: string }
  | { type: 'property'; property: string; content: string }

export function injectMetaTags(tags: RouteMetaTag[]): () => void {
  const created: HTMLMetaElement[] = []
  for (const t of tags) {
    const m = document.createElement('meta')
    if (t.type === 'name') m.setAttribute('name', t.name)
    else m.setAttribute('property', t.property)
    m.setAttribute('content', t.content)
    document.head.appendChild(m)
    created.push(m)
  }
  return () => {
    for (const el of created) {
      el.remove()
    }
  }
}

export function injectLinkTag(rel: string, href: string, extra?: Record<string, string>): () => void {
  const link = document.createElement('link')
  link.setAttribute('rel', rel)
  link.setAttribute('href', href)
  if (extra) {
    for (const [k, v] of Object.entries(extra)) {
      link.setAttribute(k, v)
    }
  }
  document.head.appendChild(link)
  return () => {
    link.remove()
  }
}
