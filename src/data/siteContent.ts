export const pillars = [
  {
    id: 'privacy',
    title: 'Privacy — Your Data Never Stays',
    description:
      "actionit.ai deletes every recording and note right after it's synced to your systems. Nothing is stored on our servers — your meetings remain your data, period.",
  },
  {
    id: 'automation',
    title: 'Automation — Insights Where You Need Them',
    description:
      'No more copying notes between apps. actionit.ai automatically posts summaries, tasks, and highlights directly into Salesforce, Notion, Freshservice, and more.',
  },
  {
    id: 'intelligence',
    title: 'Intelligence — More Than Transcripts',
    description:
      "actionit.ai understands context, decisions, and action items — not just keywords. It summarizes the 'why' and 'what next', not just the 'what'.",
  },
] as const

export const howItWorksSteps = [
  {
    id: 'joins',
    title: 'actionit.ai Joins',
    description: 'Securely and automatically, via a calendar invite',
  },
  {
    id: 'analyzes',
    title: 'AI Listens & Analyzes',
    description: 'Transcribes and identifies key moments during the meeting',
  },
  {
    id: 'delivery',
    title: 'Instant Delivery',
    description: 'Emails meeting notes with action items in seconds',
  },
  {
    id: 'deleted',
    title: 'Data is Deleted',
    description: "All meeting data is wiped from actionit.ai's memory once delivered",
  },
] as const

export const integrations = [
  { name: 'Google Meet', logo: '/google.png', comingSoon: false },
  { name: 'Salesforce', logo: '/Salesforce.png', comingSoon: false },
  { name: 'Microsoft Teams', logo: '/teams.png', comingSoon: false },
  { name: 'Notion', logo: '/notion-logo-no-background.png', comingSoon: false },
  { name: 'Zoom', logo: '/zoom.png', comingSoon: false },
  { name: 'HubSpot', logo: '/hubspot.png', comingSoon: false },
] as const

export const partnerLogos = [
  { src: '/danaan.png', alt: 'Partner logo' },
  { src: '/masterinbox.png', alt: 'Partner logo' },
  { src: '/riskready.png', alt: 'Risk Ready' },
  { src: '/moatly.png', alt: 'Moatly' },
] as const

export const faqItems = [
  {
    id: 'dataless-ai-training',
    question: 'What is dataless AI and does actionit.ai train on my meeting data?',
    answer:
      'Dataless AI is a privacy-first approach where AI processes and deletes recordings immediately after transcription. actionit.ai is a dataless AI meeting notetaker that processes meetings, sends insights to your Notion, then deletes everything—no stored data, no breach risk. Unlike many AI meeting tools, we never train our models on your data. We use enterprise-grade encryption and SOC 2-compliant infrastructure so your conversations stay protected and private.',
  },
  {
    id: 'enterprise-security',
    question: 'Is actionit.ai secure and compliant for Enterprise use?',
    answer:
      "Yes. actionit.ai is built with security, privacy, and control first. We're SOC 2, HIPAA, and GDPR compliant, using end-to-end encryption and continuous monitoring. By default, only internal meeting attendees can access your notes and recordings—one-on-ones and leadership meetings stay private. You can optionally share to custom channels for broader visibility.",
  },
  {
    id: 'notion-project-management',
    question: 'How does actionit.ai integrate with Notion and project management tools?',
    answer:
      "actionit.ai connects to Notion and automatically creates meeting notes with summaries, action items, and key decisions after each meeting. You can also use the /actionit command in any Notion page to start recording. It integrates with Asana, Monday, Jira, Linear, and ClickUp to sync action items directly to your task lists so follow-ups don't get missed.",
  },
  {
    id: 'crm-integration',
    question: 'Does actionit.ai work with CRMs like Salesforce and HubSpot?',
    answer:
      'Yes. actionit.ai integrates with Salesforce and HubSpot to find relevant details (deal updates, contact notes, next steps) and suggests CRM fields to update automatically, keeping your pipeline accurate without manual data entry.',
  },
  {
    id: 'getting-started',
    question: 'How can I get started with actionit.ai?',
    answer:
      "You can start for free—yourself, your team, or your whole organization. Get 14 days of free access to the Pro plan with AI recording credits included. After 14 days, you're moved to the free plan (free forever).",
  },
] as const

export const navProductLinks = [
  { href: '#product', label: 'Features', description: 'Explore our core features' },
  { href: '#how-it-works', label: 'How It Works', description: 'See how actionit.ai works' },
  { href: '#integrations', label: 'Integrations', description: 'Connect with your tools' },
  { href: '#security', label: 'Security', description: 'Privacy-first architecture' },
] as const

export const navIndustries = [
  { href: '/industries#legal', label: 'Legal' },
  { href: '/industries#healthcare', label: 'Healthcare' },
  { href: '/industries#consulting', label: 'Consulting' },
  { href: '/industries#sales', label: 'Sales' },
  { href: '/industries#enterprise', label: 'Enterprise' },
] as const

export const navFeatures = [
  { href: '/features#dataless-architecture', label: 'Dataless Architecture' },
  { href: '/features#automatic-meeting-joining', label: 'Automatic Joining' },
  { href: '/features#speaker-diarization', label: 'Speaker Diarization' },
  { href: '/features#notion-integration', label: 'Notion Integration' },
] as const
