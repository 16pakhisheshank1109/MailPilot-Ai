import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User, UserRole, OnboardingData } from '../types/auth';
import { authService } from '../services/authService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  completeOnboarding: (role: UserRole) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      } catch (err) {
        setError('Failed to load authentication session');
      } finally {
        setIsLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = async (email: string) => {
    setIsLoading(true);
    try {
      const loggedUser = await authService.login({ email });
      setUser(loggedUser);
      setError(null);
    } catch (err) {
      setError('Login failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const completeOnboarding = async (role: UserRole) => {
    setIsLoading(true);
    try {
      const onboardingPayload: OnboardingData = {
        role,
        primaryGoals: ['Email productivity', 'AI Summarization', 'Task Extraction'],
        inboxSyncFrequency: 'realtime',
        aiTonePreference: 'concise',
      };
      const updatedUser = await authService.updateOnboarding(onboardingPayload);
      setUser(updatedUser);
    } catch (err) {
      setError('Failed to complete onboarding');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        error,
        login,
        logout,
        completeOnboarding,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
