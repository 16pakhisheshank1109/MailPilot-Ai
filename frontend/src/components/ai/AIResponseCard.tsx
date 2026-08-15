import React, { useState } from 'react';
import type { ChatMessage } from '../../types/chat';
import { Sparkles, User, Copy, Check } from 'lucide-react';
import { formatRelativeTime } from '../../utils/formatters';

export const AIResponseCard: React.FC<{ message: ChatMessage }> = ({ message }) => {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`flex gap-3 my-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="w-9 h-9 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary shrink-0">
          <Sparkles className="w-4 h-4" />
        </div>
      )}

      <div
        className={`max-w-2xl rounded-3xl p-4 text-sm leading-relaxed border ${
          isUser
            ? 'bg-primary text-on-primary border-primary/20 rounded-tr-sm'
            : 'glass-panel text-on-surface border-white/10 rounded-tl-sm'
        }`}
      >
        <div className="whitespace-pre-wrap">{message.content}</div>

        <div className={`flex items-center justify-between mt-3 text-[10px] ${isUser ? 'text-on-primary/70' : 'text-on-surface-variant'}`}>
          <span>{formatRelativeTime(message.timestamp)}</span>

          {!isUser && (
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 hover:text-on-surface transition-colors"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          )}
        </div>
      </div>

      {isUser && (
        <div className="w-9 h-9 rounded-2xl bg-surface-bright flex items-center justify-center text-on-surface shrink-0 border border-white/10">
          <User className="w-4 h-4" />
        </div>
      )}
    </div>
  );
};
