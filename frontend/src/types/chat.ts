export type ChatRole = 'user' | 'assistant' | 'system';

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  timestamp: string;
  relatedEmailId?: string;
  suggestedActions?: {
    label: string;
    actionType: 'reply' | 'summarize' | 'task' | 'navigate';
    payload?: string;
  }[];
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: string;
}

export interface QuickPrompt {
  id: string;
  label: string;
  prompt: string;
  icon?: string;
}
