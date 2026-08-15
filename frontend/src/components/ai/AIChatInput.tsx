import React, { useState } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { Button } from '../common/Button';

interface AIChatInputProps {
  onSend: (text: string) => void;
  isLoading?: boolean;
  placeholder?: string;
}

export const AIChatInput: React.FC<AIChatInputProps> = ({
  onSend,
  isLoading = false,
  placeholder = 'Ask MailPilot AI (e.g. "Summarize today\'s emails", "Draft a reply to Google")...',
}) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || isLoading) return;
    onSend(text);
    setText('');
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <div className="relative flex items-center">
        <Sparkles className="absolute left-4 w-5 h-5 text-primary pointer-events-none" />
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={placeholder}
          disabled={isLoading}
          className="w-full bg-surface-container-lowest border border-white/10 rounded-2xl pl-12 pr-16 py-4 text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all shadow-inner"
        />
        <Button
          type="submit"
          size="sm"
          isLoading={isLoading}
          disabled={!text.trim() || isLoading}
          className="absolute right-2.5 rounded-xl p-2.5"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </form>
  );
};
