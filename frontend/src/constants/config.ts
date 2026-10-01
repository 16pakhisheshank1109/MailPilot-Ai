import type { QuickPrompt } from '../types/chat';
import type { UserRole } from '../types/auth';

export const APP_CONFIG = {
  name: 'MailPilot AI',
  tagline: 'Transform Your Inbox Into An Intelligent Workspace',
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  mockDelayMs: 400,
};

export const USER_ROLES: UserRole[] = [
  'Student',
  'Software Engineer',
  'Designer',
  'Executive',
  'Product Manager',
  'Other',
];

export const PRESET_QUICK_PROMPTS: QuickPrompt[] = [
  {
    id: '1',
    label: "Summarize today's emails",
    prompt: "Can you provide a concise executive summary of all unread high-priority emails received today?",
    icon: 'mail',
  },
  {
    id: '2',
    label: 'Find internship opportunities',
    prompt: 'Search my inbox for any recruiters or internship follow-up messages requiring immediate action.',
    icon: 'search',
  },
  {
    id: '3',
    label: 'Track my Amazon order',
    prompt: 'Locate recent delivery confirmation emails and show estimated arrival dates.',
    icon: 'package',
  },
  {
    id: '4',
    label: 'Extract action items',
    prompt: 'Scan all incoming emails from the last 24 hours and generate a checklist of actionable tasks.',
    icon: 'check-square',
  },
];
