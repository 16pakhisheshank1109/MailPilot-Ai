import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Inbox,
  CheckCircle2,
  BarChart3,
  MessageSquare,
  Settings,
  HelpCircle,
  LogOut,
  Sparkles,
  Home,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/common/Button';

export const Sidebar: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: <Home className="w-5 h-5" /> },
    { to: '/inbox', label: 'Inbox', icon: <Inbox className="w-5 h-5" /> },
    { to: '/tasks', label: 'Tasks', icon: <CheckCircle2 className="w-5 h-5" /> },
    { to: '/analytics', label: 'Analytics', icon: <BarChart3 className="w-5 h-5" /> },
    { to: '/ai-chat', label: 'AI Workspace', icon: <MessageSquare className="w-5 h-5" /> },
    { to: '/settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-64 bg-surface-container-low border-r border-white/10 flex flex-col py-6 px-4 gap-4 z-40 hidden md:flex">
        <div className="px-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center text-primary font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h1 className="font-extrabold text-lg text-on-surface tracking-tight leading-none">
                MailPilot AI
              </h1>
              <p className="text-[10px] font-semibold text-on-surface-variant/70 uppercase tracking-widest mt-1">
                AI-First Workspace
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 flex flex-col gap-1.5">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-secondary-container text-on-secondary-container border-l-4 border-primary shadow-md'
                    : 'text-on-surface-variant hover:bg-white/5 hover:text-on-surface'
                }`
              }
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto flex flex-col gap-2 pt-4 border-t border-white/10">
          <Button
            onClick={() => navigate('/ai-chat')}
            variant="primary"
            leftIcon={<Sparkles className="w-4 h-4" />}
            className="w-full justify-center mb-2 font-bold"
          >
            Ask MailPilot
          </Button>

          <a
            href="#"
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-medium text-on-surface-variant hover:bg-white/5 hover:text-on-surface transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
            Help & Documentation
          </a>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-medium text-error hover:bg-error-container/20 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-surface/90 backdrop-blur-xl border-t border-white/10 flex md:hidden items-center justify-around z-40 px-2">
        {navItems.slice(0, 5).map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 text-[10px] font-bold uppercase transition-colors ${
                isActive ? 'text-primary' : 'text-on-surface-variant'
              }`
            }
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </>
  );
};
