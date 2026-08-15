import type{ UserSettings } from '../types/settings';
import { APP_CONFIG } from '../constants/config';

const MOCK_SETTINGS: UserSettings = {
  theme: 'dark',
  notifications: {
    emailAlerts: true,
    highPriorityPush: true,
    dailyDigest: true,
    taskReminderTime: '09:00',
  },
  aiConfig: {
    preferredModel: 'gemini-3.5-pro',
    creativityLevel: 0.7,
    autoDraftReplies: true,
    extractTasksAutomatically: true,
  },
  account: {
    name: 'Naman Singh',
    email: 'naman@mailpilot.ai',
    timezone: 'America/New_York (EST)',
  },
};

export const settingsService = {
  async getSettings(): Promise<UserSettings> {
    await new Promise((res) => setTimeout(res, APP_CONFIG.mockDelayMs));
    const stored = localStorage.getItem('mailpilot_settings');
    if (stored) {
      try {
        return JSON.parse(stored) as UserSettings;
      } catch {
        return MOCK_SETTINGS;
      }
    }
    return MOCK_SETTINGS;
  },

  async updateSettings(newSettings: Partial<UserSettings>): Promise<UserSettings> {
    await new Promise((res) => setTimeout(res, APP_CONFIG.mockDelayMs));
    const current = await this.getSettings();
    const updated = { ...current, ...newSettings };
    localStorage.setItem('mailpilot_settings', JSON.stringify(updated));
    return updated;
  },
};
