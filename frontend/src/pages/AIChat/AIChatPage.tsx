import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useChat } from '../../hooks/useChat';
import { AIResponseCard } from '../../components/ai/AIResponseCard';
import { AIChatInput } from '../../components/ai/AIChatInput';
import { Sparkles } from 'lucide-react';

export const AIChatPage: React.FC = () => {
  const { messages, quickPrompts, isSending, sendMessage } = useChat();
  const location = useLocation();

  useEffect(() => {
    const state = location.state as { initialPrompt?: string } | undefined;
    if (state?.initialPrompt) {
      sendMessage(state.initialPrompt);
    }
  }, [location.state, sendMessage]);

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-140px)]">
      {/* Header */}
      <div className="pb-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-primary/20 border border-primary/40 flex items-center justify-center text-primary">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-on-surface">Ask MailPilot Assistant</h2>
            <p className="text-xs text-on-surface-variant">Powered by Gemini & FastAPI Agent Engine</p>
          </div>
        </div>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto py-4 space-y-2 pr-2">
        {messages.map((msg) => (
          <AIResponseCard key={msg.id} message={msg} />
        ))}
      </div>

      {/* Quick Prompts & Input */}
      <div className="pt-3 border-t border-white/10 space-y-3">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {quickPrompts.map((p) => (
            <button
              key={p.id}
              onClick={() => sendMessage(p.prompt)}
              className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-xs text-on-surface-variant whitespace-nowrap transition-colors"
            >
              {p.label}
            </button>
          ))}
        </div>

        <AIChatInput onSend={sendMessage} isLoading={isSending} />
      </div>
    </div>
  );
};
