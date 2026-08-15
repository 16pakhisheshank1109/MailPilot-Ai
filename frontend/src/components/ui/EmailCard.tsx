import React from 'react';
import type { Email } from '../../types/email';
import { PriorityBadge } from './PriorityBadge';
import { CategoryBadge } from './CategoryBadge';
import { formatRelativeTime } from '../../utils/formatters';
import { Sparkles, Star, Archive, CornerUpLeft } from 'lucide-react';
import { motion } from 'framer-motion';

interface EmailCardProps {
  email: Email;
  onSelect: (email: Email) => void;
  onToggleStar: (id: string) => void;
  onArchive: (id: string) => void;
  onGenerateSummary?: (email: Email) => void;
}

export const EmailCard: React.FC<EmailCardProps> = ({
  email,
  onSelect,
  onToggleStar,
  onArchive,
  onGenerateSummary,
}) => {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={`glass-panel p-5 rounded-3xl border border-white/10 hover:border-primary/40 transition-all duration-200 cursor-pointer group flex flex-col justify-between ${
        !email.isRead ? 'bg-surface-container/90' : 'bg-surface-container-low/40'
      }`}
      onClick={() => onSelect(email)}
    >
      <div>
        <div className="flex justify-between items-start gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-surface-bright flex items-center justify-center font-bold text-primary border border-white/10">
              {email.sender.initials}
            </div>
            <div>
              <h5 className="font-bold text-sm text-on-surface line-clamp-1">{email.sender.name}</h5>
              <p className="text-xs text-on-surface-variant">{formatRelativeTime(email.timestamp)}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <PriorityBadge priority={email.priority} />
            <CategoryBadge category={email.category} />
          </div>
        </div>

        <h4 className="font-semibold text-base text-on-surface mb-1.5 line-clamp-1 group-hover:text-primary transition-colors">
          {email.subject}
        </h4>
        <p className="text-xs text-on-surface-variant line-clamp-2 leading-relaxed mb-4">
          {email.snippet}
        </p>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-white/5" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={() => onGenerateSummary?.(email)}
          className="flex items-center gap-1.5 text-xs font-bold text-primary hover:bg-primary/10 px-3 py-1.5 rounded-xl transition-all"
        >
          <Sparkles className="w-4 h-4" />
          AI Summary
        </button>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onToggleStar(email.id)}
            className={`p-2 rounded-xl transition-colors ${
              email.isStarred ? 'text-amber-400' : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <Star className="w-4 h-4 fill-current" />
          </button>
          <button
            onClick={() => onArchive(email.id)}
            className="p-2 text-on-surface-variant hover:text-on-surface rounded-xl transition-colors"
          >
            <Archive className="w-4 h-4" />
          </button>
          <button className="p-2 text-on-surface-variant hover:text-on-surface rounded-xl transition-colors">
            <CornerUpLeft className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
