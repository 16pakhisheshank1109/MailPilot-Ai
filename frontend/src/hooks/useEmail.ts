import { useState, useEffect, useCallback } from 'react';
import type { Email, EmailFilter } from '../types/email';
import { emailService } from '../services/emailService';

export function useEmail(initialFilter?: EmailFilter) {
  const [emails, setEmails] = useState<Email[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEmails = useCallback(async (filter?: EmailFilter) => {
    setIsLoading(true);
    try {
      const data = await emailService.getEmails(filter);
      setEmails(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch emails');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmails(initialFilter);
  }, [fetchEmails, initialFilter]);

  const markAsRead = async (id: string) => {
    await emailService.markAsRead(id);
    setEmails((prev) =>
      prev.map((e) => (e.id === id ? { ...e, isRead: true } : e))
    );
  };

  const toggleStar = async (id: string) => {
    const isStarred = await emailService.toggleStar(id);
    setEmails((prev) =>
      prev.map((e) => (e.id === id ? { ...e, isStarred } : e))
    );
  };

  const archiveEmail = async (id: string) => {
    await emailService.archiveEmail(id);
    setEmails((prev) => prev.filter((e) => e.id !== id));
  };

  return {
    emails,
    isLoading,
    error,
    refetch: fetchEmails,
    markAsRead,
    toggleStar,
    archiveEmail,
  };
}
