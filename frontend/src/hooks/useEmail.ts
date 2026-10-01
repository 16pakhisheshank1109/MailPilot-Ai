import {
  useState,
  useEffect,
  useCallback,
} from "react";

import type {
  Email,
  EmailFilter,
} from "../types/email";

import { emailService } from "../services/emailService";

export function useEmail(
  initialFilter?: EmailFilter
) {
  const [emails, setEmails] = useState<Email[]>([]);
  const [isLoading, setIsLoading] =
    useState<boolean>(true);
  const [error, setError] =
    useState<string | null>(null);

  // Extract primitive values so React can
  // correctly determine when the filter changed.
  const category = initialFilter?.category;
  const searchQuery = initialFilter?.searchQuery;
  const priorityOnly = initialFilter?.priorityOnly;
  const unreadOnly = initialFilter?.unreadOnly;
  const starredOnly = initialFilter?.starredOnly;
  const archivedOnly = initialFilter?.archivedOnly;

  const fetchEmails = useCallback(
    async (filter?: EmailFilter) => {
      setIsLoading(true);

      try {
        const data =
          await emailService.getEmails(filter);

        setEmails(data);
        setError(null);
      } catch (err) {
        console.error(
          "Failed to fetch emails:",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "Failed to fetch emails"
        );
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchEmails({
      category,
      searchQuery,
      priorityOnly,
      unreadOnly,
      starredOnly,
      archivedOnly,
    });
  }, [
    fetchEmails,
    category,
    searchQuery,
    priorityOnly,
    unreadOnly,
    starredOnly,
    archivedOnly,
  ]);

  const markAsRead = async (id: string) => {
    try {
      await emailService.markAsRead(id);

      setEmails((prev) =>
        prev.flatMap((email) => {
          if (email.id !== id) return [email];
          if (unreadOnly) return [];
          return [{ ...email, isRead: true }];
        })
      );
    } catch (err) {
      console.error(
        "Failed to mark email as read:",
        err
      );
    }
  };

  const toggleStar = async (id: string) => {
    try {
      const isStarred =
        await emailService.toggleStar(id);

      setEmails((prev) =>
        prev.flatMap((email) => {
          if (email.id !== id) return [email];
          if (starredOnly && !isStarred) return [];
          return [{ ...email, isStarred }];
        })
      );
    } catch (err) {
      console.error(
        "Failed to toggle email star:",
        err
      );
    }
  };

  const archiveEmail = async (id: string) => {
    try {
      await emailService.archiveEmail(id);

      setEmails((prev) =>
        prev.filter(
          (email) => email.id !== id
        )
      );
    } catch (err) {
      console.error(
        "Failed to archive email:",
        err
      );
    }
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