import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { MainLayout } from './layout/MainLayout';

import { LandingPage } from './pages/Landing/LandingPage';
import { LoginPage } from './pages/Authentication/LoginPage';
import { OnboardingPage } from './pages/Onboarding/OnboardingPage';
import { InitializationPage } from './pages/Onboarding/InitializationPage';
import { DashboardPage } from './pages/Dashboard/DashboardPage';
import { InboxPage } from './pages/Inbox/InboxPage';
import { EmailDetailPage } from './pages/Email/EmailDetailPage';
import { AnalyticsPage } from './pages/Analytics/AnalyticsPage';
import { TasksPage } from './pages/Tasks/TasksPage';
import { AIChatPage } from './pages/AIChat/AIChatPage';
import { SettingsPage } from './pages/Settings/SettingsPage';
import { NotFoundPage } from './pages/NotFoundPage';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <NotificationProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/onboarding" element={<OnboardingPage />} />
            <Route path="/initialization" element={<InitializationPage />} />

            {/* Authenticated Layout Routes */}
            <Route
              path="/dashboard"
              element={
                <MainLayout>
                  <DashboardPage />
                </MainLayout>
              }
            />
            <Route
              path="/inbox"
              element={
                <MainLayout>
                  <InboxPage />
                </MainLayout>
              }
            />
            <Route
              path="/inbox/:id"
              element={
                <MainLayout>
                  <EmailDetailPage />
                </MainLayout>
              }
            />
            <Route
              path="/analytics"
              element={
                <MainLayout>
                  <AnalyticsPage />
                </MainLayout>
              }
            />
            <Route
              path="/tasks"
              element={
                <MainLayout>
                  <TasksPage />
                </MainLayout>
              }
            />
            <Route
              path="/ai-chat"
              element={
                <MainLayout>
                  <AIChatPage />
                </MainLayout>
              }
            />
            <Route
              path="/settings"
              element={
                <MainLayout>
                  <SettingsPage />
                </MainLayout>
              }
            />

            {/* 404 Route */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </NotificationProvider>
    </AuthProvider>
  );
};

export default App;
