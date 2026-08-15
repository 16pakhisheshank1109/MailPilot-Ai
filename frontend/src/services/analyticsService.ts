import type { EmailAnalytics } from '../types/analytics';
import { APP_CONFIG } from '../constants/config';

export const analyticsService = {
  async getAnalytics(): Promise<EmailAnalytics> {
    await new Promise((res) => setTimeout(res, APP_CONFIG.mockDelayMs));
    return {
      totalProcessed: 284,
      highPriorityCount: 42,
      upcomingDeadlinesCount: 8,
      extractedTasksCount: 65,
      averageResponseTimeHours: 1.4,
      timeSavedHoursTotal: 18.5,
      dailyVolume: [
        { day: 'Mon', emailsReceived: 35, tasksExtracted: 8, timeSavedMinutes: 120 },
        { day: 'Tue', emailsReceived: 48, tasksExtracted: 12, timeSavedMinutes: 180 },
        { day: 'Wed', emailsReceived: 42, tasksExtracted: 10, timeSavedMinutes: 150 },
        { day: 'Thu', emailsReceived: 56, tasksExtracted: 15, timeSavedMinutes: 210 },
        { day: 'Fri', emailsReceived: 39, tasksExtracted: 9, timeSavedMinutes: 140 },
        { day: 'Sat', emailsReceived: 18, tasksExtracted: 4, timeSavedMinutes: 60 },
        { day: 'Sun', emailsReceived: 12, tasksExtracted: 2, timeSavedMinutes: 40 },
      ],
      categoryDistribution: [
        { category: 'Career', count: 32, percentage: 35 },
        { category: 'System', count: 24, percentage: 25 },
        { category: 'Design', count: 18, percentage: 20 },
        { category: 'Newsletters', count: 15, percentage: 15 },
        { category: 'Other', count: 5, percentage: 5 },
      ],
    };
  },
};
