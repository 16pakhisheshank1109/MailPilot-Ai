import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Bell, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 right-0 left-0 md:left-64 h-20 flex items-center justify-between px-6 bg-surface/80 backdrop-blur-xl border-b border-white/10 z-30">
      <div className="flex items-center gap-3">
        <h2 className="text-xl font-bold font-headline text-on-surface">
          Good Evening, {user?.name.split(' ')[0] || 'Naman'} 👋
        </h2>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/ai-chat')}
          className="p-2 text-primary hover:bg-white/5 rounded-full transition-all active:scale-95 flex items-center gap-2 px-3 py-1.5 border border-primary/20 bg-primary/10 text-xs font-bold"
        >
          <Sparkles className="w-4 h-4" />
          <span className="hidden sm:inline">Ask AI</span>
        </button>

        <button className="p-2.5 text-on-surface-variant hover:text-on-surface hover:bg-white/5 rounded-full transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full animate-ping" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full" />
        </button>

        <div
          onClick={() => navigate('/settings')}
          className="w-10 h-10 rounded-full bg-surface-variant overflow-hidden ring-2 ring-primary/30 cursor-pointer hover:ring-primary transition-all"
        >
          <img
            src={
              user?.avatarUrl ||
              'https://lh3.googleusercontent.com/aida-public/AB6AXuAnrUOQm8k8jikYE4sf7QSzS7WrLw3nZmpTIaTte_9PMS1CZt9_ARkFHu1LLwE7MxAsz35p55B1MN0ukrDN3Mvvx7fTh6S4wa7rYmHoh_N0yZTlDRFnr1Wi1FMh13IYJi1Dbh0k85c7gnxrq6V8XMhDEGZWVKRd2-YdINY872IHeMfnEt5FmMUsYKOVz57jPh_YaNlPfIEXbI32fdU2WYhX_4I0u9pz7XbQtF3yaMTYNSHQkIwFHpmnIw'
            }
            alt={user?.name || 'User Avatar'}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </header>
  );
};
