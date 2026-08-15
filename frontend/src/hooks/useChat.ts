import { useState, useEffect, useCallback } from 'react';
import type { ChatMessage, QuickPrompt } from '../types/chat';
import { chatService } from '../services/chatService';

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [quickPrompts, setQuickPrompts] = useState<QuickPrompt[]>([]);
  const [isSending, setIsSending] = useState<boolean>(false);

  useEffect(() => {
    const initChat = async () => {
      const history = await chatService.getChatHistory();
      const prompts = await chatService.getQuickPrompts();
      setMessages(history);
      setQuickPrompts(prompts);
    };
    initChat();
  }, []);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsSending(true);

    try {
      const assistantMsg = await chatService.sendMessage(text);
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          role: 'assistant',
          content: 'Sorry, I ran into an error processing your query. Please try again.',
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsSending(false);
    }
  }, []);

  return {
    messages,
    quickPrompts,
    isSending,
    sendMessage,
  };
}
