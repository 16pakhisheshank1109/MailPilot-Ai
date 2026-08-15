import React from 'react';
import { motion } from 'framer-motion';

interface AnalyticsCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export const AnalyticsCard: React.FC<AnalyticsCardProps> = ({ title, subtitle, children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel p-6 rounded-3xl border border-white/10 flex flex-col justify-between"
    >
      <div className="mb-4">
        <h3 className="text-lg font-bold text-on-surface">{title}</h3>
        {subtitle && <p className="text-xs text-on-surface-variant mt-0.5">{subtitle}</p>}
      </div>
      <div>{children}</div>
    </motion.div>
  );
};
