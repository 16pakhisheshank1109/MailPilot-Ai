import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export const InitializationPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/dashboard');
    }, 2200);
    return () => clearTimeout(timer);
  }, [navigate]);

  const steps = [
    'Connecting workspace environment...',
    'Tuning Gemini prompt parameters...',
    'Synthesizing inbox metadata...',
    'Generating AI smart advice metrics...',
  ];

  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col items-center justify-center p-6 text-center">
      <motion.div
        animate={{ scale: [1, 1.1, 1], rotate: [0, 90, 180, 270, 360] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        className="w-20 h-20 rounded-3xl bg-primary/10 border border-primary/40 flex items-center justify-center text-primary mb-8 shadow-2xl shadow-primary/30"
      >
        <Sparkles className="w-10 h-10" />
      </motion.div>

      <h2 className="text-3xl font-extrabold font-headline text-on-surface mb-2">
        Setting Up Your AI Workspace
      </h2>
      <p className="text-sm text-on-surface-variant max-w-sm mb-8">
        MailPilot AI is preparing your custom dashboard and high-priority filters...
      </p>

      <div className="w-full max-w-sm space-y-3 text-left">
        {steps.map((step, idx) => (
          <motion.div
            key={step}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.4 }}
            className="flex items-center gap-3 p-3 bg-surface-container-high/60 border border-white/5 rounded-2xl text-xs font-medium text-on-surface"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{step}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
