import React from 'react';
import type { TaskItem } from '../../types/task';
import { PriorityBadge } from './PriorityBadge';
import { CheckCircle, Circle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

interface TaskCardProps {
  task: TaskItem;
  onToggleStatus: (id: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onToggleStatus }) => {
  const isDone = task.status === 'completed';

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className={`p-4 rounded-2xl border transition-all flex items-start gap-4 ${
        isDone
          ? 'bg-surface-container-lowest/40 border-white/5 opacity-60'
          : 'glass-panel border-white/10'
      }`}
    >
      <button
        onClick={() => onToggleStatus(task.id)}
        className="mt-0.5 text-on-surface-variant hover:text-primary transition-colors shrink-0"
      >
        {isDone ? (
          <CheckCircle className="w-5 h-5 text-emerald-400" />
        ) : (
          <Circle className="w-5 h-5" />
        )}
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1">
          <h4
            className={`text-sm font-semibold text-on-surface line-clamp-1 ${
              isDone ? 'line-through text-on-surface-variant' : ''
            }`}
          >
            {task.title}
          </h4>
          <PriorityBadge priority={task.priority} />
        </div>

        <p className="text-xs text-on-surface-variant line-clamp-2 mb-2">{task.description}</p>

        <div className="flex items-center gap-4 text-[11px] text-on-surface-variant">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {task.dueDate}
          </span>
          {task.tags.length > 0 && (
            <div className="flex items-center gap-1">
              {task.tags.map((tag) => (
                <span key={tag} className="bg-white/5 px-2 py-0.5 rounded-full border border-white/5">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
