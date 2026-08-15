import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { USER_ROLES } from '../../constants/config';
import type { UserRole } from '../../types/auth';
import { Sparkles, Check, ArrowRight } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { motion } from 'framer-motion';

export const OnboardingPage: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('Software Engineer');
  const { completeOnboarding, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleProceed = async () => {
    await completeOnboarding(selectedRole);
    navigate('/initialization');
  };

  return (
    <div className="min-h-screen bg-surface text-on-surface flex items-center justify-center p-6 relative">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl glass-panel p-8 rounded-3xl border border-white/10 shadow-2xl"
      >
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-tertiary/20 border border-tertiary/40 flex items-center justify-center text-tertiary mx-auto mb-4">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-on-surface">Personalize Your AI Agent</h2>
          <p className="text-sm text-on-surface-variant mt-1">
            Select your primary professional role so MailPilot AI can tune its priority rankings and draft tone.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
          {USER_ROLES.map((role) => {
            const isSelected = selectedRole === role;
            return (
              <button
                key={role}
                onClick={() => setSelectedRole(role)}
                className={`p-4 rounded-2xl border text-left transition-all flex items-center justify-between ${
                  isSelected
                    ? 'bg-primary/20 border-primary text-on-surface font-bold ring-1 ring-primary'
                    : 'bg-surface-container-lowest/60 border-white/10 text-on-surface-variant hover:border-white/20'
                }`}
              >
                <span>{role}</span>
                {isSelected && <Check className="w-4 h-4 text-primary" />}
              </button>
            );
          })}
        </div>

        <Button
          onClick={handleProceed}
          size="lg"
          isLoading={isLoading}
          className="w-full font-bold"
          rightIcon={<ArrowRight className="w-5 h-5" />}
        >
          Initialize Workspace
        </Button>
      </motion.div>
    </div>
  );
};
