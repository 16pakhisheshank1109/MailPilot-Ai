import React from 'react';
import type { DashboardMetric } from '../../types/analytics';
import { Mail, AlertTriangle, Clock, CheckSquare } from 'lucide-react';
import { motion } from 'framer-motion';

const iconMap: Record<string, React.ReactNode> = {
  mail: <Mail className="w-8 h-8 text-primary" />,
  'alert-triangle': <AlertTriangle className="w-8 h-8 text-error" />,
  clock: <Clock className="w-8 h-8 text-tertiary" />,
  'check-square': <CheckSquare className="w-8 h-8 text-secondary" />,
};

export const MetricCard: React.FC<{ metric: DashboardMetric }> = ({ metric }) => {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="glass-panel p-6 rounded-3xl flex flex-col justify-between h-40 border border-white/10"
    >
      <div className="flex justify-between items-start">
        {iconMap[metric.icon] || <Mail className="w-8 h-8 text-primary" />}
        <span className="text-[11px] font-semibold text-on-surface-variant bg-white/5 px-2.5 py-1 rounded-full">
          {metric.change}
        </span>
      </div>
      <div>
        <p className="text-4xl font-extrabold text-on-surface tracking-tight">{metric.value}</p>
        <p className="text-xs text-on-surface-variant font-medium mt-1">{metric.label}</p>
      </div>
    </motion.div>
  );
};
