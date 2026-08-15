import type { User, LoginCredentials, OnboardingData } from '../types/auth';
import { APP_CONFIG } from '../constants/config';

const MOCK_USER: User = {
  id: 'usr_101',
  name: 'Naman Singh',
  email: 'naman@mailpilot.ai',
  avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAnrUOQm8k8jikYE4sf7QSzS7WrLw3nZmpTIaTte_9PMS1CZt9_ARkFHu1LLwE7MxAsz35p55B1MN0ukrDN3Mvvx7fTh6S4wa7rYmHoh_N0yZTlDRFnr1Wi1FMh13IYJi1Dbh0k85c7gnxrq6V8XMhDEGZWVKRd2-YdINY872IHeMfnEt5FmMUsYKOVz57jPh_YaNlPfIEXbI32fdU2WYhX_4I0u9pz7XbQtF3yaMTYNSHQkIwFHpmnIw',
  role: 'Software Engineer',
  isOnboarded: true,
  createdAt: '2026-01-15T00:00:00Z',
};

export const authService = {
  async getCurrentUser(): Promise<User | null> {
    await new Promise((res) => setTimeout(res, APP_CONFIG.mockDelayMs));
    const storedUser = localStorage.getItem('mailpilot_user');
    if (storedUser) {
      try {
        return JSON.parse(storedUser) as User;
      } catch {
        return MOCK_USER;
      }
    }
    return MOCK_USER;
  },

  async login(credentials: LoginCredentials): Promise<User> {
    await new Promise((res) => setTimeout(res, APP_CONFIG.mockDelayMs));
    const user: User = {
      ...MOCK_USER,
      email: credentials.email || MOCK_USER.email,
    };
    localStorage.setItem('mailpilot_user', JSON.stringify(user));
    localStorage.setItem('mailpilot_token', 'mock_jwt_token_fastapi_ready');
    return user;
  },

  async logout(): Promise<void> {
    await new Promise((res) => setTimeout(res, 200));
    localStorage.removeItem('mailpilot_user');
    localStorage.removeItem('mailpilot_token');
  },

  async updateOnboarding(data: OnboardingData): Promise<User> {
    await new Promise((res) => setTimeout(res, APP_CONFIG.mockDelayMs));
    const currentUser = await this.getCurrentUser();
    const updatedUser: User = {
      ...(currentUser || MOCK_USER),
      role: data.role,
      isOnboarded: true,
    };
    localStorage.setItem('mailpilot_user', JSON.stringify(updatedUser));
    return updatedUser;
  },
};
