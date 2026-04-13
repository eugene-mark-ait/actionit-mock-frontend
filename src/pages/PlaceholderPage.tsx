import { Link } from 'react-router-dom'

export function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col items-center justify-center px-6 text-center">
      <h1 className="text-3xl font-bold text-[#0F172A] mb-4" style={{ fontFamily: "'Recoleta Light', sans-serif" }}>
        {title}
      </h1>
      <p className="text-neutral-600 max-w-md mb-8">
        This route is a placeholder in the static recreation. Wire it to your app when ready.
      </p>
      <Link
        to="/"
        className="inline-flex rounded-full px-6 py-3 font-semibold bg-[#00B4D8] text-white hover:bg-[#0ea5e9] transition"
      >
        Back to home
      </Link>
    </div>
  )
}
