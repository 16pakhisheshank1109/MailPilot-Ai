import type { DashboardMetric } from '../types/analytics';
import { APP_CONFIG } from '../constants/config';

export interface SmartAdvice {
  id: string;
  title: string;
  description: string;
  sourceSender: string;
  deadline?: string;
  actionText: string;
  emailId: string;
}

export interface DashboardSummary {
  metrics: DashboardMetric[];
  smartAdvice: SmartAdvice;
}

export const dashboardService = {
  async getDashboardSummary(): Promise<DashboardSummary> {
    await new Promise((res) => setTimeout(res, APP_CONFIG.mockDelayMs));
    return {
      metrics: [
        {
          id: 'm1',
          label: 'New Emails',
          value: 16,
          change: '+12% this week',
          trend: 'up',
          color: 'primary',
          icon: 'mail',
        },
        {
          id: 'm2',
          label: 'High Priority',
          value: 3,
          change: 'Action needed today',
          trend: 'up',
          color: 'error',
          icon: 'alert-triangle',
        },
        {
          id: 'm3',
          label: 'Deadlines',
          value: 2,
          change: 'Before 6:00 PM',
          trend: 'neutral',
          color: 'tertiary',
          icon: 'clock',
        },
        {
          id: 'm4',
          label: 'Tasks Extracted',
          value: 5,
          change: 'Auto-synchronized',
          trend: 'up',
          color: 'secondary',
          icon: 'check-square',
        },
      ],
      smartAdvice: {
        id: 'adv_1',
        title: 'You should reply to Google Recruitment before 6:00 PM.',
        description: 'Based on your internship search history, the latest technical interview invite from Google is critical for your candidate status.',
        sourceSender: 'Google Recruitment',
        deadline: 'Today, 6:00 PM',
        actionText: 'Draft Reply with AI',
        emailId: 'em_1',
      },
    };
  },
};
