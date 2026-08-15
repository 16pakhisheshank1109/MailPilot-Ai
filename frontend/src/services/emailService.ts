import type { Email, EmailFilter } from '../types/email';
import { APP_CONFIG } from '../constants/config';

const MOCK_EMAILS: Email[] = [
  {
    id: 'em_1',
    sender: {
      name: 'Google Recruitment',
      email: 'careers@google.com',
      initials: 'G',
    },
    recipient: 'naman@mailpilot.ai',
    subject: 'Follow-up: Software Engineer Internship 2026',
    snippet: 'Dear Naman, we would like to invite you for the next round of technical interviews for the Software Engineer role...',
    body: `Dear Naman,

We were highly impressed by your background and technical assessment results. We would love to invite you for the next 45-minute technical interview round for the Software Engineer Internship position.

Please confirm your availability before 6:00 PM today by selecting a slot via the candidate portal link below.

Best regards,
Google Recruiting Team`,
    timestamp: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    category: 'Career',
    priority: 'urgent',
    isRead: false,
    isStarred: true,
    isArchived: false,
    hasTasks: true,
    aiSummary: {
      keyTakeaways: [
        'Passed initial technical screening for Google SWE Internship.',
        'Action required: Confirm interview availability by 6:00 PM today.',
      ],
      recommendedAction: 'Draft reply to confirm 4:00 PM interview time slot.',
      deadline: 'Today, 6:00 PM',
      sentiment: 'urgent',
    },
  },
  {
    id: 'em_2',
    sender: {
      name: 'AWS Training & Certification',
      email: 'no-reply@aws.amazon.com',
      initials: 'A',
    },
    recipient: 'naman@mailpilot.ai',
    subject: 'Mastering Serverless Architecture with AWS Lambda & DynamoDB',
    snippet: 'Check out our latest deep dive into serverless architecture and how to scale applications efficiently...',
    body: `Hi Naman,

Discover how high-velocity engineering teams leverage AWS Lambda, Amazon EventBridge, and DynamoDB to build resilient, serverless workflows.

In this edition:
- Zero-cold-start performance tuning
- Distributed tracing with AWS X-Ray
- Architectural design patterns for real-time streaming

Read full guide online.`,
    timestamp: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
    category: 'Newsletters',
    priority: 'medium',
    isRead: true,
    isStarred: false,
    isArchived: false,
    hasTasks: false,
    aiSummary: {
      keyTakeaways: ['Educational resource on serverless architecture optimization.'],
      recommendedAction: 'Archive or bookmark for weekend reading.',
      sentiment: 'neutral',
    },
  },
  {
    id: 'em_3',
    sender: {
      name: 'Figma Team',
      email: 'updates@figma.com',
      initials: 'F',
    },
    recipient: 'naman@mailpilot.ai',
    subject: 'New Features Released: Variables, Dynamic Layouts & Code Connect',
    snippet: 'We are introducing several new ways to build more realistic prototypes in Figma. Variables allow dynamic state...',
    body: `Hey Naman,

We've just shipped a huge update to Figma! 

What's New:
1. Dynamic Variables & Modes (Dark/Light tokens)
2. Advanced Prototyping Expressions
3. Code Connect for React & Tailwind CSS

Check out the interactive playground file attached to your workspace.`,
    timestamp: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    category: 'Design',
    priority: 'low',
    isRead: true,
    isStarred: true,
    isArchived: false,
    hasTasks: false,
    aiSummary: {
      keyTakeaways: ['Figma major update: Variables, Expressions, Code Connect.'],
      recommendedAction: 'Explore Figma design system tokens.',
      sentiment: 'positive',
    },
  },
  {
    id: 'em_4',
    sender: {
      name: 'Stripe Security',
      email: 'security@stripe.com',
      initials: 'S',
    },
    recipient: 'naman@mailpilot.ai',
    subject: 'Action Required: API Key Rotation Alert for Production Environment',
    snippet: 'Your primary API key for MailPilot Billing service is set to expire in 3 days. Please rotate your secret keys...',
    body: `Hello Admin,

This is an automated security notice. Your live production API secret key ending in ...8f2a will expire in 72 hours.

Please log into your Stripe Dashboard and roll your API keys to prevent service interruption.`,
    timestamp: new Date(Date.now() - 10 * 3600 * 1000).toISOString(),
    category: 'System',
    priority: 'high',
    isRead: false,
    isStarred: false,
    isArchived: false,
    hasTasks: true,
    aiSummary: {
      keyTakeaways: ['Stripe production secret key expires in 3 days.'],
      recommendedAction: 'Rotate Stripe API secret key in dashboard settings.',
      deadline: '3 days',
      sentiment: 'urgent',
    },
  },
];

export const emailService = {
  async getEmails(filter?: EmailFilter): Promise<Email[]> {
    await new Promise((res) => setTimeout(res, APP_CONFIG.mockDelayMs));
    let result = [...MOCK_EMAILS];

    if (filter?.category && filter.category !== 'All') {
      result = result.filter((e) => e.category === filter.category);
    }
    if (filter?.priorityOnly) {
      result = result.filter((e) => e.priority === 'urgent' || e.priority === 'high');
    }
    if (filter?.searchQuery) {
      const q = filter.searchQuery.toLowerCase();
      result = result.filter(
        (e) =>
          e.subject.toLowerCase().includes(q) ||
          e.snippet.toLowerCase().includes(q) ||
          e.sender.name.toLowerCase().includes(q)
      );
    }

    return result;
  },

  async getEmailById(id: string): Promise<Email | null> {
    await new Promise((res) => setTimeout(res, APP_CONFIG.mockDelayMs));
    const found = MOCK_EMAILS.find((e) => e.id === id);
    return found || null;
  },

  async markAsRead(id: string): Promise<void> {
    await new Promise((res) => setTimeout(res, 150));
    const email = MOCK_EMAILS.find((e) => e.id === id);
    if (email) email.isRead = true;
  },

  async toggleStar(id: string): Promise<boolean> {
    await new Promise((res) => setTimeout(res, 150));
    const email = MOCK_EMAILS.find((e) => e.id === id);
    if (email) {
      email.isStarred = !email.isStarred;
      return email.isStarred;
    }
    return false;
  },

  async archiveEmail(id: string): Promise<void> {
    await new Promise((res) => setTimeout(res, 200));
    const email = MOCK_EMAILS.find((e) => e.id === id);
    if (email) email.isArchived = true;
  },

  async generateDraftReply(emailId: string): Promise<string> {
    await new Promise((res) => setTimeout(res, 600));
    const email = MOCK_EMAILS.find((e) => e.id === emailId);
    if (!email) return 'Thank you for reaching out. I will get back to you shortly.';

    if (email.sender.name.includes('Google')) {
      return `Hi ${email.sender.name},\n\nThank you so much for the update! I am excited to proceed with the technical interview round. I am available today between 3:00 PM and 5:30 PM EST.\n\nBest regards,\nNaman Singh`;
    }
    return `Hi ${email.sender.name},\n\nThank you for sharing this update. I have reviewed the details and will proceed with the recommended action items.\n\nBest regards,\nNaman`;
  },
};
