export interface NotificationPreferences {
  emailAlerts: boolean;
  highPriorityPush: boolean;
  dailyDigest: boolean;
  taskReminderTime: string;
}

export interface AIModelConfig {
  preferredModel: 'gemini-3.5-pro' | 'gemini-3.5-flash' | 'fastapi-custom';
  creativityLevel: number;
  autoDraftReplies: boolean;
  extractTasksAutomatically: boolean;
}

export interface UserSettings {
  theme: 'dark' | 'light' | 'system';
  notifications: NotificationPreferences;
  aiConfig: AIModelConfig;
  account: {
    name: string;
    email: string;
    timezone: string;
  };
}
