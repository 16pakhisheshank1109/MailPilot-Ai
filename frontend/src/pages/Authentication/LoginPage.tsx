import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Sparkles, Mail, Lock, ArrowRight } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { motion } from 'framer-motion';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('naman@mailpilot.ai');
  const [password, setPassword] = useState('••••••••••••');
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email);
    navigate('/onboarding');
  };

  return (
    <div className="min-h-screen bg-surface text-on-surface flex items-center justify-center p-6 relative overflow-hidden">
      {/* Glow backgrounds */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/10 rounded-full blur-[140px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md glass-panel p-8 rounded-3xl border border-white/10 shadow-2xl z-10"
      >
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-primary/20 border border-primary/40 flex items-center justify-center text-primary mx-auto mb-4">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-on-surface">Welcome to MailPilot AI</h2>
          <p className="text-xs text-on-surface-variant mt-1">Sign in to your intelligent workspace session</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-2">Work Email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/50" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-surface-container-lowest border border-white/10 rounded-2xl pl-10 pr-4 py-3 text-sm text-on-surface focus:ring-2 focus:ring-primary/40 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/50" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-surface-container-lowest border border-white/10 rounded-2xl pl-10 pr-4 py-3 text-sm text-on-surface focus:ring-2 focus:ring-primary/40 focus:outline-none"
              />
            </div>
          </div>

          <Button
            type="submit"
            size="lg"
            isLoading={isLoading}
            className="w-full font-bold mt-6"
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Continue to Workspace
          </Button>
        </form>

        <div className="mt-6 text-center text-xs text-on-surface-variant">
          Mock Auth Session for FastAPI Integration Testing
        </div>
      </motion.div>
    </div>
  );
};
