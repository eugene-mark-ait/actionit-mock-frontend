import Link from 'next/link'
import {
  ArrowRight,
  Bot,
  Calendar,
  CircleAlert,
  CircleCheck,
  Database,
  FileText,
  Link2,
  List,
  Lock,
  MessageSquare,
  Mic,
  Search,
  Shield,
  Trash2,
  UserCheck,
  Users,
  Zap,
} from 'lucide-react'

function CtaButton({ children }: { children: React.ReactNode }) {
  return (
    <Link
      href="/login"
      className="inline-flex h-14 items-center gap-2 rounded-xl bg-brand-bright px-10 text-base font-semibold text-neutral-950 shadow-[0_0_30px_rgba(0,212,255,0.4)] transition-all duration-300 hover:bg-surface"
    >
      {children}
      <ArrowRight className="h-5 w-5" strokeWidth={2} />
    </Link>
  )
}

export function FeaturesPageContent() {
  return (
    <>
      <section
        id="dataless-architecture"
        className="relative scroll-mt-28 overflow-hidden bg-page py-24 lg:py-32"
      >
        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center sm:px-8 lg:px-12">
          <h1 className="font-heading-recoleta mb-6 text-4xl font-bold text-brand-navy sm:text-5xl md:text-6xl lg:text-7xl">
            Dataless AI: <span className="text-brand-bright">Privacy by Design</span>
          </h1>
          <p className="mx-auto mb-6 max-w-2xl text-lg text-neutral-600 sm:text-xl">
            <span className="font-bold text-brand-cyan">actionit.ai</span> is the #1 dataless AI meeting
            notetaker. Unlike other AI tools that store your data forever, dataless AI processes and deletes
            recordings immediately. Privacy isn&apos;t a policy—it&apos;s our dataless AI architecture.
          </p>
          <CtaButton>Experience Privacy-First Intelligence - Start Free</CtaButton>
        </div>
      </section>

      <section className="bg-page py-24">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <h2 className="font-heading-recoleta mb-12 text-center text-3xl font-bold text-brand-navy sm:text-4xl">
            How Dataless AI Works
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                icon: Zap,
                title: '1. Process',
                body: 'Recordings are transcribed, analyzed, and processed in real-time.',
              },
              {
                icon: Database,
                title: '2. Deliver',
                body: 'Summaries, action items, and insights are delivered to your tools.',
              },
              {
                icon: Trash2,
                title: '3. Delete',
                body: 'All recordings and data are immediately deleted. No persistent storage.',
              },
            ].map((s) => (
              <div
                key={s.title}
                className="rounded-xl border border-neutral-200 bg-section-soft p-8 text-center"
              >
                <div className="mb-4 flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-bright/20">
                    <s.icon className="h-8 w-8 text-brand-bright" strokeWidth={1.75} />
                  </div>
                </div>
                <h3 className="mb-3 text-xl font-semibold text-brand-navy">{s.title}</h3>
                <p className="text-neutral-600">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-page py-24">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <h2 className="font-heading-recoleta mb-12 text-center text-3xl font-bold text-brand-navy sm:text-4xl">
            Benefits of Dataless AI
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {[
              {
                icon: Shield,
                title: 'No Data Breach Risk',
                body: 'No recordings stored means no breach risk from stored data.',
              },
              { icon: Lock, title: 'HIPAA Compliance', body: 'HIPAA compliance without complex configurations.' },
              {
                icon: Database,
                title: 'GDPR Compliance',
                body: 'GDPR compliance by default. No data retention policies to manage.',
              },
              {
                icon: Trash2,
                title: 'No Data Retention',
                body: 'Immediate deletion ensures compliance.',
              },
              {
                icon: Zap,
                title: 'Reduced Storage Costs',
                body: 'No storage overhead means lower costs and faster processing.',
              },
              {
                icon: CircleAlert,
                title: 'Faster Processing',
                body: 'No storage overhead means faster transcription and analysis.',
              },
            ].map((b) => (
              <div
                key={b.title}
                className="rounded-xl border border-neutral-200 bg-surface p-6 shadow-sm"
              >
                <div className="flex items-start gap-4">
                  <b.icon className="mt-1 h-8 w-8 shrink-0 text-brand-bright" strokeWidth={1.75} />
                  <div>
                    <h3 className="mb-2 text-lg font-semibold text-brand-navy">{b.title}</h3>
                    <p className="text-neutral-600">{b.body}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="automatic-meeting-joining"
        className="relative scroll-mt-28 overflow-hidden bg-page py-24 lg:py-32"
      >
        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center sm:px-8 lg:px-12">
          <h1 className="font-heading-recoleta mb-6 text-4xl font-bold text-brand-navy sm:text-5xl md:text-6xl lg:text-7xl">
            Automatic Meeting Joining: <span className="text-brand-bright">Zero Touch Required</span>
          </h1>
          <p className="mx-auto mb-6 max-w-2xl text-lg text-neutral-600 sm:text-xl">
            Connect your calendar once.{' '}
            <span className="font-bold text-brand-cyan">actionit.ai</span> automatically detects meetings and
            joins them. No buttons to click, no apps to open.
          </p>
          <CtaButton>Never Miss a Meeting Again - Start Free</CtaButton>
        </div>
      </section>

      <section className="bg-page py-24">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <h2 className="font-heading-recoleta mb-12 text-center text-3xl font-bold text-brand-navy sm:text-4xl">
            How Automatic Meeting Joining Works
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                icon: Calendar,
                title: '1. Calendar Integration',
                body: 'Connect your Google Calendar once. actionit.ai monitors for new meetings.',
              },
              {
                icon: Zap,
                title: '2. Automatic Detection',
                body: 'When a meeting is scheduled, actionit.ai detects it via webhook—no polling.',
              },
              {
                icon: Bot,
                title: '3. Bot Joins Automatically',
                body: 'Two minutes before your meeting starts, our bot joins automatically.',
              },
            ].map((s) => (
              <div
                key={s.title}
                className="rounded-xl border border-neutral-200 bg-section-soft p-8 text-center"
              >
                <div className="mb-4 flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-bright/20">
                    <s.icon className="h-8 w-8 text-brand-bright" strokeWidth={1.75} />
                  </div>
                </div>
                <h3 className="mb-3 text-xl font-semibold text-brand-navy">{s.title}</h3>
                <p className="text-neutral-600">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-page py-24">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <h2 className="font-heading-recoleta mb-12 text-center text-3xl font-bold text-brand-navy sm:text-4xl">
            Supported Platforms
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {['Zoom', 'Google Meet', 'Microsoft Teams'].map((name) => (
              <div
                key={name}
                className="rounded-xl border border-neutral-200 bg-surface p-8 text-center shadow-sm"
              >
                <CircleCheck className="mx-auto mb-4 h-10 w-10 text-brand-bright" strokeWidth={1.75} />
                <h3 className="mb-3 text-xl font-semibold text-brand-navy">{name}</h3>
                <p className="text-neutral-600">Full support with automatic joining</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="speaker-diarization" className="relative scroll-mt-28 overflow-hidden bg-page py-24 lg:py-32">
        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center sm:px-8 lg:px-12">
          <h1 className="font-heading-recoleta mb-6 text-4xl font-bold text-brand-navy sm:text-5xl md:text-6xl lg:text-7xl">
            Speaker Diarization: <span className="text-brand-bright">Know Who Said What</span>
          </h1>
          <p className="mx-auto mb-6 max-w-2xl text-lg text-neutral-600 sm:text-xl">
            <span className="font-bold text-brand-cyan">actionit.ai</span> automatically identifies who said what
            in your meetings—no more guessing who owns that action item.
          </p>
          <CtaButton>Experience Accurate Attribution - Start Free</CtaButton>
        </div>
      </section>

      <section className="bg-page py-24">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <h2 className="font-heading-recoleta mb-12 text-center text-3xl font-bold text-brand-navy sm:text-4xl">
            How Speaker Diarization Works
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                icon: Mic,
                title: '1. Voice Pattern Recognition',
                body: 'Advanced AI identifies unique voice patterns for each speaker.',
              },
              {
                icon: UserCheck,
                title: '2. Automatic Attribution',
                body: 'Every statement is attributed to the correct speaker.',
              },
              {
                icon: CircleCheck,
                title: '3. Accurate Action Items',
                body: 'Action items are assigned to the correct person automatically.',
              },
            ].map((s) => (
              <div
                key={s.title}
                className="rounded-xl border border-neutral-200 bg-section-soft p-8 text-center"
              >
                <div className="mb-4 flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-bright/20">
                    <s.icon className="h-8 w-8 text-brand-bright" strokeWidth={1.75} />
                  </div>
                </div>
                <h3 className="mb-3 text-xl font-semibold text-brand-navy">{s.title}</h3>
                <p className="text-neutral-600">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-page py-24">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <h2 className="font-heading-recoleta mb-12 text-center text-3xl font-bold text-brand-navy sm:text-4xl">
            Benefits of Speaker Diarization
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {[
              {
                icon: CircleCheck,
                title: 'Accurate Action Item Assignment',
                body: 'Action items are assigned to the correct person automatically.',
              },
              {
                icon: MessageSquare,
                title: 'Clear Decision Attribution',
                body: 'Know exactly who made each decision in your meetings.',
              },
              {
                icon: Users,
                title: 'Better Meeting Context',
                body: 'Understand who said what and when.',
              },
              {
                icon: FileText,
                title: 'Easier Follow-Up Conversations',
                body: 'Reference specific statements and decisions with confidence.',
              },
              {
                icon: UserCheck,
                title: 'Improved Accountability',
                body: 'Clear attribution improves accountability and follow-through.',
              },
              {
                icon: Search,
                title: 'Searchable by Speaker',
                body: 'Search transcripts by speaker to find specific contributions.',
              },
            ].map((b) => (
              <div
                key={b.title}
                className="rounded-xl border border-neutral-200 bg-surface p-6 shadow-sm"
              >
                <div className="flex items-start gap-4">
                  <b.icon className="mt-1 h-8 w-8 shrink-0 text-brand-bright" strokeWidth={1.75} />
                  <div>
                    <h3 className="mb-2 text-lg font-semibold text-brand-navy">{b.title}</h3>
                    <p className="text-neutral-600">{b.body}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="notion-integration" className="relative scroll-mt-28 overflow-hidden bg-page py-24 lg:py-32">
        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center sm:px-8 lg:px-12">
          <h1 className="font-heading-recoleta mb-6 text-4xl font-bold text-brand-navy sm:text-5xl md:text-6xl lg:text-7xl">
            Notion Integration:{' '}
            <span className="text-brand-bright">Meeting Notes Where You Work</span>
          </h1>
          <p className="mx-auto mb-6 max-w-2xl text-lg text-neutral-600 sm:text-xl">
            Connect your Notion workspace once.{' '}
            <span className="font-bold text-brand-cyan">actionit.ai</span> automatically posts summaries, action
            items, and key decisions to your Notion pages.
          </p>
          <CtaButton>Keep Your Notion Updated - Start Free</CtaButton>
        </div>
      </section>

      <section className="bg-page py-24">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <h2 className="font-heading-recoleta mb-12 text-center text-3xl font-bold text-brand-navy sm:text-4xl">
            How Notion Integration Works
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                icon: Link2,
                title: '1. Connect Notion',
                body: 'Authorize actionit.ai to access your workspace and choose where to post.',
              },
              {
                icon: Zap,
                title: '2. Automatic Posting',
                body: 'After each meeting, a new page is created in your selected Notion database.',
              },
              {
                icon: FileText,
                title: '3. Rich Formatting',
                body: 'Summaries include action items, decisions, and speaker attribution.',
              },
            ].map((s) => (
              <div
                key={s.title}
                className="rounded-xl border border-neutral-200 bg-section-soft p-8 text-center"
              >
                <div className="mb-4 flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-bright/20">
                    <s.icon className="h-8 w-8 text-brand-bright" strokeWidth={1.75} />
                  </div>
                </div>
                <h3 className="mb-3 text-xl font-semibold text-brand-navy">{s.title}</h3>
                <p className="text-neutral-600">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-page py-24">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <h2 className="font-heading-recoleta mb-12 text-center text-3xl font-bold text-brand-navy sm:text-4xl">
            What Gets Posted to Notion
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {[
              { icon: FileText, title: 'Meeting Summary', body: 'AI-generated summary with topics and decisions.' },
              { icon: List, title: 'Action Items', body: 'Owners and tasks extracted automatically.' },
              { icon: CircleCheck, title: 'Key Decisions', body: 'Important decisions highlighted.' },
              { icon: Database, title: 'Speaker Attribution', body: 'Statements tied to the right speaker.' },
              { icon: Calendar, title: 'Meeting Metadata', body: 'Date, time, and participants included.' },
              { icon: Zap, title: 'Instant Sync', body: 'Content posted within seconds of meeting end.' },
            ].map((b) => (
              <div
                key={b.title}
                className="rounded-xl border border-neutral-200 bg-surface p-6 shadow-sm"
              >
                <div className="flex items-start gap-4">
                  <b.icon className="mt-1 h-8 w-8 shrink-0 text-brand-bright" strokeWidth={1.75} />
                  <div>
                    <h3 className="mb-2 text-lg font-semibold text-brand-navy">{b.title}</h3>
                    <p className="text-neutral-600">{b.body}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="actionit-command" className="scroll-mt-28 bg-page py-24">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <h2 className="font-heading-recoleta mb-6 text-center text-3xl font-bold text-brand-navy sm:text-4xl">
            Use /actionit Command
          </h2>
          <div className="rounded-xl border border-neutral-200 bg-section-soft p-8">
            <p className="mb-4 text-lg text-neutral-600">
              Use the{' '}
              <code className="rounded bg-brand-bright/20 px-2 py-1 text-brand-bright">/actionit</code> command in
              Notion to create meeting notes from any meeting.
            </p>
            <div className="mt-6 rounded-lg bg-zinc-900 p-4">
              <code className="text-sm text-neutral-300">/actionit [meeting-id]</code>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
