export interface DashboardMetric {
  id: string;
  label: string;
  value: number | string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  color: 'primary' | 'error' | 'tertiary' | 'secondary';
  icon: string;
}

export interface DailyVolume {
  day: string;
  emailsReceived: number;
  tasksExtracted: number;
  timeSavedMinutes: number;
}

export interface CategoryDistribution {
  category: string;
  count: number;
  percentage: number;
}

export interface EmailAnalytics {
  totalProcessed: number;
  highPriorityCount: number;
  upcomingDeadlinesCount: number;
  extractedTasksCount: number;
  averageResponseTimeHours: number;
  timeSavedHoursTotal: number;
  dailyVolume: DailyVolume[];
  categoryDistribution: CategoryDistribution[];
}
