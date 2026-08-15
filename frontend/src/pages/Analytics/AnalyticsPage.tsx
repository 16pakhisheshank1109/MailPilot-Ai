import React, { useEffect, useState } from 'react';
import { analyticsService } from '../../services/analyticsService';
import type { EmailAnalytics } from '../../types/analytics';
import { AnalyticsCard } from '../../components/ui/AnalyticsCard';
import { SkeletonLoader } from '../../components/common/SkeletonLoader';
import { Clock, Zap, CheckSquare, Mail } from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const [data, setData] = useState<EmailAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const result = await analyticsService.getAnalytics();
        setData(result);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <SkeletonLoader count={3} className="h-48" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold font-headline text-on-surface">Productivity & AI Analytics</h2>
        <p className="text-xs text-on-surface-variant mt-1">
          Detailed breakdown of email volume, AI time savings, and response performance metrics.
        </p>
      </div>

      {/* Metric Banners */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-3xl border border-white/10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-bold text-on-surface">{data?.timeSavedHoursTotal} hrs</p>
            <p className="text-xs text-on-surface-variant">Total AI Time Saved</p>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-3xl border border-white/10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-tertiary/10 border border-tertiary/20 flex items-center justify-center text-tertiary">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-bold text-on-surface">{data?.averageResponseTimeHours} hrs</p>
            <p className="text-xs text-on-surface-variant">Avg Response Time</p>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-3xl border border-white/10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-secondary/10 border border-secondary/20 flex items-center justify-center text-secondary">
            <CheckSquare className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-bold text-on-surface">{data?.extractedTasksCount}</p>
            <p className="text-xs text-on-surface-variant">Extracted Action Items</p>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-3xl border border-white/10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-on-surface">
            <Mail className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-bold text-on-surface">{data?.totalProcessed}</p>
            <p className="text-xs text-on-surface-variant">Emails Processed</p>
          </div>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnalyticsCard title="Daily Email & AI Volume" subtitle="Processed messages and time saved per day">
          <div className="space-y-3 pt-2">
            {data?.dailyVolume.map((item) => (
              <div key={item.day} className="space-y-1">
                <div className="flex justify-between text-xs text-on-surface-variant font-medium">
                  <span>{item.day}</span>
                  <span>{item.emailsReceived} emails ({item.timeSavedMinutes}m saved)</span>
                </div>
                <div className="w-full h-2.5 bg-surface-container-lowest rounded-full overflow-hidden flex">
                  <div
                    className="bg-primary h-full transition-all duration-500"
                    style={{ width: `${(item.emailsReceived / 60) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </AnalyticsCard>

        <AnalyticsCard title="Category Breakdown" subtitle="Distribution of incoming email topics">
          <div className="space-y-4 pt-2">
            {data?.categoryDistribution.map((cat) => (
              <div key={cat.category} className="space-y-1">
                <div className="flex justify-between text-xs text-on-surface font-semibold">
                  <span>{cat.category}</span>
                  <span>{cat.count} messages ({cat.percentage}%)</span>
                </div>
                <div className="w-full h-2.5 bg-surface-container-lowest rounded-full overflow-hidden">
                  <div
                    className="bg-tertiary h-full transition-all duration-500"
                    style={{ width: `${cat.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </AnalyticsCard>
      </div>
    </div>
  );
};
