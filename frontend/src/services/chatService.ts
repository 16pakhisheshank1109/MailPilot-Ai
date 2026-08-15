import type { ChatMessage, QuickPrompt } from '../types/chat';
import { PRESET_QUICK_PROMPTS, APP_CONFIG } from '../constants/config';

const MOCK_CHAT_HISTORY: ChatMessage[] = [
  {
    id: 'msg_1',
    role: 'assistant',
    content: "Hello Naman! I'm your MailPilot AI assistant. I've analyzed your inbox for today. You have 3 high-priority messages, including an interview invitation from Google Recruitment. How can I assist you right now?",
    timestamp: new Date(Date.now() - 3600 * 1000).toISOString(),
    suggestedActions: [
      { label: "Summarize Google Email", actionType: 'summarize', payload: 'em_1' },
      { label: "Draft Reply to Google", actionType: 'reply', payload: 'em_1' },
    ],
  },
];

export const chatService = {
  async getQuickPrompts(): Promise<QuickPrompt[]> {
    return PRESET_QUICK_PROMPTS;
  },

  async getChatHistory(): Promise<ChatMessage[]> {
    await new Promise((res) => setTimeout(res, 200));
    return [...MOCK_CHAT_HISTORY];
  },

  async sendMessage(promptText: string): Promise<ChatMessage> {
    await new Promise((res) => setTimeout(res, APP_CONFIG.mockDelayMs + 300));
    const lower = promptText.toLowerCase();

    let responseContent = `I have processed your request: "${promptText}".`;

    if (lower.includes('summarize') || lower.includes('inbox')) {
      responseContent = `### Today's Inbox Executive Summary\n- **16 Total Emails** received across 4 categories.\n- **Top Action Item**: Reply to Google Recruitment confirming interview slot before 6 PM.\n- **Security Notice**: Stripe API Secret Key expires in 3 days. Action needed.`;
    } else if (lower.includes('internship') || lower.includes('google')) {
      responseContent = `Found **1 Urgent Match**:\n- **Sender**: Google Recruitment\n- **Role**: Software Engineer Internship 2026\n- **Status**: Passed initial tech round. Waiting for confirmation by 6:00 PM today.`;
    } else if (lower.includes('task') || lower.includes('action')) {
      responseContent = `Extracted **3 Immediate Action Items**:\n1. Confirm Google interview availability\n2. Rotate Stripe production secret API key\n3. Review Figma dynamic layout variables update`;
    }

    return {
      id: `msg_${Date.now()}`,
      role: 'assistant',
      content: responseContent,
      timestamp: new Date().toISOString(),
    };
  },
};
