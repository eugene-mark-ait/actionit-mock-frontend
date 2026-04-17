type JsonRecord = Record<string, unknown>

export function JsonLd({ data }: { data: JsonRecord }) {
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  )
}
