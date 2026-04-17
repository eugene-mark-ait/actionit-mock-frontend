import Link from 'next/link'
import { ArrowRight, Building2, HeartHandshake, Landmark, LineChart, Users } from 'lucide-react'

function IndustryHero({
  id,
  icon: Icon,
  title,
  headline,
  body,
}: {
  id: string
  icon: typeof Landmark
  title: string
  headline: string
  body: string
}) {
  return (
    <section id={id} className="scroll-mt-28 border-b border-neutral-200 bg-page py-20 lg:py-28">
      <div className="mx-auto max-w-4xl px-6 text-center sm:px-8 lg:px-12">
        <div className="mb-6 flex justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-bright/15 text-brand-bright">
            <Icon className="h-7 w-7" strokeWidth={1.75} />
          </div>
        </div>
        <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-neutral-500">{title}</p>
        <h1 className="font-heading-recoleta mb-6 text-3xl font-bold text-brand-navy sm:text-4xl md:text-5xl">
          {headline}
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-lg leading-relaxed text-neutral-600">
          <span className="font-bold text-brand-cyan">actionit.ai</span> {body}
        </p>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 rounded-xl bg-brand-bright px-8 py-3 text-base font-semibold text-neutral-950 shadow-[0_0_24px_rgba(0,212,255,0.35)] transition hover:bg-surface"
        >
          Start free
          <ArrowRight className="h-5 w-5" />
        </Link>
      </div>
    </section>
  )
}

export function IndustriesPageContent() {
  return (
    <div>
      <section className="border-b border-neutral-200 bg-page py-16 lg:py-20">
        <div className="mx-auto max-w-4xl px-6 text-center sm:px-8 lg:px-12">
          <h1 className="font-heading-recoleta mb-4 text-4xl font-bold text-brand-navy sm:text-5xl">
            Built for your <span className="text-brand-bright">industry</span>
          </h1>
          <p className="text-lg text-neutral-600">
            Privacy-first, dataless AI meeting intelligence—tailored workflows for teams that can&apos;t
            afford loose notes or retained recordings.
          </p>
        </div>
      </section>

      <IndustryHero
        id="legal"
        icon={Landmark}
        title="Legal"
        headline="Confidential matters stay confidential"
        body="keeps privileged discussions off permanent servers: join, transcribe, deliver to your systems, then delete. Perfect for firms that need attribution without a growing audio archive."
      />

      <IndustryHero
        id="healthcare"
        icon={HeartHandshake}
        title="Healthcare"
        headline="Clinical and admin conversations, responsibly handled"
        body="supports HIPAA-minded teams with immediate deletion after delivery—minimize retained PHI in third-party tooling while still getting structured follow-ups."
      />

      <IndustryHero
        id="consulting"
        icon={Users}
        title="Consulting"
        headline="Client-ready summaries without the copy-paste"
        body="captures decisions and action items, pushes them to Notion or your stack, and clears the recording so engagement data doesn’t pile up in yet another vault."
      />

      <IndustryHero
        id="sales"
        icon={LineChart}
        title="Sales"
        headline="Pipeline truth from every call"
        body="turns calls into crisp next steps and CRM-ready context—without leaving a transcript warehouse your reps didn’t ask for."
      />

      <IndustryHero
        id="enterprise"
        icon={Building2}
        title="Enterprise"
        headline="Governance-friendly by architecture"
        body="gives security and IT teams a dataless path: fewer places where meeting content can linger, with audit-friendly handoff to systems you already control."
      />
    </div>
  )
}
