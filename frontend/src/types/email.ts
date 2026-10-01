export type PriorityLevel = 'urgent' | 'high' | 'medium' | 'low';
export type EmailCategory = 'Inbox' | 'Urgent' | 'Tasks' | 'Newsletters' | 'Design' | 'Career' | 'System';

export interface EmailSummary {
  keyTakeaways: string[];
  recommendedAction: string;
  deadline?: string;
  sentiment: 'positive' | 'neutral' | 'urgent' | 'action_required';
}

export interface Email {
  id: string;
  sender: {
    name: string;
    email: string;
    avatarUrl?: string;
    initials: string;
  };
  recipient: string;
  subject: string;
  body: string;
  snippet: string;
  timestamp: string;
  category: EmailCategory;
  priority: PriorityLevel;
  isRead: boolean;
  isStarred: boolean;
  isArchived: boolean;
  hasTasks: boolean;
  aiSummary?: EmailSummary;
}

export interface EmailFilter {
  category?: EmailCategory | 'All';
  searchQuery?: string;
  priorityOnly?: boolean;
  unreadOnly?: boolean;
  starredOnly?: boolean;
  archivedOnly?: boolean;
}
