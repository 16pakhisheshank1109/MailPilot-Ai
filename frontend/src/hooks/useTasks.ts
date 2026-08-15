import { useState, useEffect, useCallback } from 'react';
import type { TaskItem, TaskStatus } from '../types/task';
import { taskService } from '../services/taskService';

export function useTasks() {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await taskService.getTasks();
      setTasks(data);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const toggleTaskStatus = async (id: string) => {
    const currentTask = tasks.find((t) => t.id === id);
    if (!currentTask) return;
    const newStatus: TaskStatus = currentTask.status === 'completed' ? 'todo' : 'completed';

    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
    );
    await taskService.updateTaskStatus(id, newStatus);
  };

  return {
    tasks,
    isLoading,
    refetch: fetchTasks,
    toggleTaskStatus,
  };
}
