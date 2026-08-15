import React from 'react';
import { Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export const LoadingScreen: React.FC<{ message?: string }> = ({ message = 'Loading MailPilot AI...' }) => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-surface text-on-surface p-4">
      <motion.div
        animate={{ scale: [1, 1.15, 1], rotate: [0, 180, 360] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="w-16 h-16 rounded-3xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary mb-6 shadow-xl shadow-primary/20"
      >
        <Sparkles className="w-8 h-8" />
      </motion.div>
      <h2 className="text-xl font-bold font-headline text-on-surface">{message}</h2>
      <p className="text-xs text-on-surface-variant mt-2 font-mono">Synchronizing workspace state...</p>
    </div>
  );
};
