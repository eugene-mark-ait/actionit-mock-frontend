import Link from 'next/link'

export function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-page px-6 text-center">
      <h1 className="font-heading-recoleta mb-4 text-3xl font-bold text-brand-navy">
        {title}
      </h1>
      <p className="text-neutral-600 max-w-md mb-8">
        This route is a placeholder in the static recreation. Wire it to your app when ready.
      </p>
      <Link
        href="/"
        className="inline-flex rounded-full px-6 py-3 font-semibold bg-[#00B4D8] text-white hover:bg-[#0ea5e9] transition"
      >
        Back to home
      </Link>
    </div>
  )
}
