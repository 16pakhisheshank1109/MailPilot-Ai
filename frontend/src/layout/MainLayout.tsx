import React from 'react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { Toast } from '../components/common/Toast';

export const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-surface text-on-surface antialiased flex flex-col font-body selection:bg-primary/30">
      <Sidebar />
      <Navbar />
      <main className="md:ml-64 pt-24 pb-20 md:pb-12 px-4 md:px-8 min-h-screen relative overflow-x-hidden">
        {/* Subtle background glow effect */}
        <div className="fixed inset-0 pointer-events-none z-[-1]">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-10 left-1/3 w-80 h-80 bg-secondary/10 rounded-full blur-[100px]" />
        </div>
        {children}
      </main>
      <Toast />
    </div>
  );
};
