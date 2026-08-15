import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, CheckCircle, Zap, Bot } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { motion } from 'framer-motion';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col selection:bg-primary/30 overflow-x-hidden">
      {/* Top Header */}
      <header className="max-w-7xl mx-auto w-full px-6 py-6 flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-primary/20 border border-primary/40 flex items-center justify-center text-primary">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-xl tracking-tight text-on-surface">MailPilot AI</span>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/login')}>
            Sign In
          </Button>
          <Button variant="primary" onClick={() => navigate('/login')}>
            Get Started Free
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20 relative max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-bold mb-8"
        >
          <Sparkles className="w-4 h-4" />
          <span>Next-Generation Intelligent Workspace Platform</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl font-extrabold text-on-surface tracking-tight leading-tight max-w-4xl"
        >
          Transform Your Inbox Into An <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-tertiary to-secondary">Intelligent Workspace</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-on-surface-variant max-w-2xl mt-6 mb-10 leading-relaxed"
        >
          MailPilot AI synthesizes high-volume email threads, extracts actionable task checklists, and drafts context-aware responses automatically powered by Gemini.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center"
        >
          <Button
            size="lg"
            variant="primary"
            rightIcon={<ArrowRight className="w-5 h-5" />}
            onClick={() => navigate('/login')}
            className="w-full sm:w-auto font-bold px-8 shadow-2xl shadow-primary/30"
          >
            Launch Interactive Workspace
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => navigate('/dashboard')}
            className="w-full sm:w-auto px-8"
          >
            Explore Live Demo
          </Button>
        </motion.div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24 text-left w-full">
          <div className="glass-panel p-8 rounded-3xl border border-white/10">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-6">
              <Bot className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-on-surface mb-2">Instant AI Summaries</h3>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Synthesize 20-page email chains into 3 executive bullet points and key action items instantly.
            </p>
          </div>

          <div className="glass-panel p-8 rounded-3xl border border-white/10">
            <div className="w-12 h-12 rounded-2xl bg-tertiary/10 border border-tertiary/20 flex items-center justify-center text-tertiary mb-6">
              <CheckCircle className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-on-surface mb-2">Automated Task Extractor</h3>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Detect deadlines and requested action items from incoming mail and convert them into prioritized todo lists.
            </p>
          </div>

          <div className="glass-panel p-8 rounded-3xl border border-white/10">
            <div className="w-12 h-12 rounded-2xl bg-secondary/10 border border-secondary/20 flex items-center justify-center text-secondary mb-6">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-on-surface mb-2">Smart Contextual Composer</h3>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Generate tailored, high-converting email responses tuned to your custom persona and career goals.
            </p>
          </div>
        </div>
      </main>

      <footer className="border-t border-white/10 py-8 text-center text-xs text-on-surface-variant/60">
        © 2026 MailPilot AI Inc. Scalable SaaS Frontend Architecture. Ready for FastAPI Integration.
      </footer>
    </div>
  );
};
