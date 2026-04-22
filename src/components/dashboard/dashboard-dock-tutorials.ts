import type { Tutorial } from '@/components/dashboard/TutorialModal'

export const DOCK_TUTORIALS: Tutorial[] = [
  {
    id: '1',
    platform: 'Google Calendar',
    title: 'Getting Started with Google Calendar Integration',
    duration: '5:23',
    thumbnail: '/placeholder-tutorial-1.jpg',
    videoUrl: 'https://example.com/video1.mp4',
    connected: true,
    steps: [
      {
        title: 'Connect Your Calendar',
        description: 'Authorize action.it to access your Google Calendar for automatic meeting detection.',
      },
      {
        title: 'Schedule a Meeting',
        description: 'Create a meeting in your calendar with a Google Meet, Zoom, or Teams link.',
      },
      {
        title: 'Auto-Join Enabled',
        description: 'action.it will automatically join your meeting at the scheduled time.',
      },
      {
        title: 'Receive Analysis',
        description: 'Get comprehensive meeting minutes and insights delivered to your email and Notion.',
      },
    ],
  },
  {
    id: '2',
    platform: 'Notion',
    title: 'Setting Up Notion Integration',
    duration: '4:15',
    thumbnail: '/placeholder-tutorial-2.jpg',
    videoUrl: 'https://example.com/video2.mp4',
    connected: false,
    steps: [
      {
        title: 'Connect Notion',
        description: 'Authorize action.it to access your Notion workspace.',
      },
      {
        title: 'Select a Page',
        description: 'Choose where you want meeting summaries to be posted.',
      },
      {
        title: 'Use /actionit Command',
        description: 'Type /actionit followed by a meeting link in any Notion page.',
      },
      {
        title: 'Automatic Updates',
        description: 'Meeting analyses will automatically appear in your selected Notion pages.',
      },
    ],
  },
  {
    id: '3',
    platform: 'Zoom',
    title: 'Using action.it with Zoom Meetings',
    duration: '3:42',
    thumbnail: '/placeholder-tutorial-3.jpg',
    videoUrl: 'https://example.com/video3.mp4',
    connected: false,
    steps: [
      {
        title: 'Schedule Zoom Meeting',
        description: 'Create a Zoom meeting in your calendar with the Zoom link included.',
      },
      {
        title: 'Join the Meeting',
        description: 'Join your Zoom meeting at the scheduled time.',
      },
      {
        title: 'Actionit Joins Automatically',
        description: 'action.it will automatically join as a participant when the meeting starts.',
      },
      {
        title: 'Review Analysis',
        description: 'Access meeting summaries in your Notion workspace or email.',
      },
    ],
  },
  {
    id: '4',
    platform: 'Microsoft Teams',
    title: 'Microsoft Teams Integration Guide',
    duration: '4:30',
    thumbnail: '/placeholder-tutorial-4.jpg',
    videoUrl: 'https://example.com/video4.mp4',
    connected: false,
    steps: [
      {
        title: 'Schedule Teams Meeting',
        description: 'Create a Microsoft Teams meeting in your calendar.',
      },
      {
        title: 'Auto-Join Setup',
        description: 'action.it will automatically detect and join your Teams meetings.',
      },
      {
        title: 'Meeting Recording',
        description: 'action.it records and transcribes the meeting automatically.',
      },
      {
        title: 'Get Summary',
        description: 'Receive meeting notes and action items via email and Notion.',
      },
    ],
  },
  {
    id: '5',
    platform: 'Salesforce',
    title: 'Salesforce Integration Setup',
    duration: '5:00',
    thumbnail: '/placeholder-tutorial-5.jpg',
    videoUrl: 'https://example.com/video5.mp4',
    connected: false,
    steps: [
      {
        title: 'Connect Salesforce',
        description: 'Authorize action.it to access your Salesforce account.',
      },
      {
        title: 'Configure Sync',
        description: 'Set up how meeting data should sync with Salesforce records.',
      },
      {
        title: 'Automatic Updates',
        description: 'Meeting insights will automatically update relevant Salesforce records.',
      },
    ],
  },
  {
    id: '6',
    platform: 'Trello',
    title: 'Trello Integration Setup',
    duration: '4:00',
    thumbnail: '/placeholder-tutorial-6.jpg',
    videoUrl: 'https://example.com/video6.mp4',
    connected: false,
    steps: [
      {
        title: 'Connect Trello',
        description: 'Authorize action.it to access your Trello boards.',
      },
      {
        title: 'Select Board',
        description: 'Choose which Trello board to sync meeting action items to.',
      },
      {
        title: 'Automatic Card Creation',
        description: 'Meeting action items will automatically be created as Trello cards.',
      },
    ],
  },
  {
    id: '7',
    platform: 'HubSpot',
    title: 'HubSpot Integration Setup',
    duration: '4:30',
    thumbnail: '/placeholder-tutorial-7.jpg',
    videoUrl: 'https://example.com/video7.mp4',
    connected: false,
    steps: [
      {
        title: 'Connect HubSpot',
        description: 'Authorize action.it to access your HubSpot CRM.',
      },
      {
        title: 'Configure Sync',
        description: 'Set up how meeting notes and insights sync with HubSpot contacts and deals.',
      },
      {
        title: 'Automatic Updates',
        description: 'Meeting insights will automatically update relevant HubSpot records.',
      },
    ],
  },
  {
    id: '8',
    platform: 'Slack',
    title: 'Slack Integration Setup',
    duration: '3:30',
    thumbnail: '/placeholder-tutorial-8.jpg',
    videoUrl: 'https://example.com/video8.mp4',
    connected: false,
    steps: [
      {
        title: 'Connect Slack',
        description: 'Authorize action.it to access your Slack workspace.',
      },
      {
        title: 'Select Channel',
        description: 'Choose which Slack channel to send meeting summaries to.',
      },
      {
        title: 'Automatic Notifications',
        description: 'Meeting summaries and action items will be posted to your selected channel.',
      },
    ],
  },
  {
    id: '9',
    platform: 'Odoo',
    title: 'Odoo Integration Setup',
    duration: '5:00',
    thumbnail: '/placeholder-tutorial-9.jpg',
    videoUrl: 'https://example.com/video9.mp4',
    connected: false,
    steps: [
      {
        title: 'Connect Odoo',
        description: 'Authorize action.it to access your Odoo ERP system.',
      },
      {
        title: 'Configure Sync',
        description: 'Set up how meeting data should sync with Odoo modules.',
      },
      {
        title: 'Automatic Updates',
        description: 'Meeting insights will automatically update relevant Odoo records.',
      },
    ],
  },
]

export const DOCK_ID_TO_PLATFORM: Record<string, string> = {
  notion: 'Notion',
  zoom: 'Zoom',
  hubspot: 'HubSpot',
  trello: 'Trello',
  salesforce: 'Salesforce',
  'microsoft-teams': 'Microsoft Teams',
  slack: 'Slack',
  odoo: 'Odoo',
}
