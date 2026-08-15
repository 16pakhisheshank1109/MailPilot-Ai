export type UserRole = 'Student' | 'Software Engineer' | 'Designer' | 'Executive' | 'Product Manager' | 'Other';

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role?: UserRole;
  isOnboarded: boolean;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password?: string;
  provider?: 'email' | 'google';
}

export interface OnboardingData {
  role: UserRole;
  primaryGoals: string[];
  inboxSyncFrequency: 'realtime' | 'hourly' | 'daily';
  aiTonePreference: 'concise' | 'detailed' | 'bullet_points';
}
