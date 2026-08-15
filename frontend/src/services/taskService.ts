import type { TaskItem, TaskStatus } from '../types/task';
import { APP_CONFIG } from '../constants/config';

const MOCK_TASKS: TaskItem[] = [
  {
    id: 'tsk_1',
    sourceEmailId: 'em_1',
    sourceEmailSubject: 'Follow-up: Software Engineer Internship 2026',
    title: 'Confirm Google Technical Interview Slot',
    description: 'Select candidate availability before 6:00 PM today for the 45-minute technical round.',
    priority: 'urgent',
    status: 'todo',
    dueDate: 'Today, 6:00 PM',
    createdAt: new Date().toISOString(),
    tags: ['Career', 'Google', 'Urgent'],
  },
  {
    id: 'tsk_2',
    sourceEmailId: 'em_4',
    sourceEmailSubject: 'Action Required: API Key Rotation Alert',
    title: 'Rotate Stripe Production Secret API Keys',
    description: 'Log into Stripe Security Dashboard and update live environment API keys.',
    priority: 'high',
    status: 'todo',
    dueDate: 'In 3 days',
    createdAt: new Date(Date.now() - 3600 * 1000).toISOString(),
    tags: ['System', 'Stripe', 'Security'],
  },
  {
    id: 'tsk_3',
    sourceEmailId: 'em_3',
    sourceEmailSubject: 'New Features Released: Variables and Dynamic Layouts',
    title: 'Explore Figma Dynamic Variables Tokens',
    description: 'Review updated Figma Design System playground file for Code Connect integration.',
    priority: 'low',
    status: 'completed',
    dueDate: 'Tomorrow',
    createdAt: new Date(Date.now() - 86400 * 1000).toISOString(),
    tags: ['Design', 'Figma'],
  },
];

export const taskService = {
  async getTasks(): Promise<TaskItem[]> {
    await new Promise((res) => setTimeout(res, APP_CONFIG.mockDelayMs));
    return [...MOCK_TASKS];
  },

  async updateTaskStatus(id: string, status: TaskStatus): Promise<TaskItem | null> {
    await new Promise((res) => setTimeout(res, 200));
    const task = MOCK_TASKS.find((t) => t.id === id);
    if (task) {
      task.status = status;
      return { ...task };
    }
    return null;
  },
};
